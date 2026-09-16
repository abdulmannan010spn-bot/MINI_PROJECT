import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, 'frontend');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.jsx': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

// Get Local Wi-Fi / LAN IP for cross-device connections
function getLocalIpAddress() {
  const ifaces = os.networkInterfaces();
  for (const dev in ifaces) {
    for (const details of ifaces[dev]) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return '127.0.0.1';
}

const LOCAL_IP = getLocalIpAddress();

// Pre-registered team mobile numbers
const DEFAULT_TEAM_USERS = [
  { phone: '+919876543210', formattedPhone: '+91 98765 43210', name: 'Abdul Mannan', role: 'Student Lead' },
  { phone: '+919876543211', formattedPhone: '+91 98765 43211', name: 'Aditya Maurya', role: 'Student / Backend' },
  { phone: '+919876543212', formattedPhone: '+91 98765 43212', name: 'Mr. Sudhakar Dwivedi', role: 'Faculty Guide' },
  { phone: '+919876543213', formattedPhone: '+91 98765 43213', name: 'Aditya Vishwakarma', role: 'Student / Frontend' },
  { phone: '+919876543214', formattedPhone: '+91 98765 43214', name: 'Abhishek Gangwar', role: 'Student / QA' }
];

// Normalize phone number (removes spaces, dashes, brackets, ensures standard prefix)
function normalizePhoneNumber(input) {
  if (!input) return '+919876543210';
  let cleaned = input.toString().replace(/[\s\-\(\)\.]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = '+91' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned;
}

function formatDisplayPhone(normalized) {
  if (!normalized) return '';
  if (normalized.startsWith('+91') && normalized.length === 13) {
    return `+91 ${normalized.slice(3, 8)} ${normalized.slice(8)}`;
  }
  return normalized;
}

function resolveUserName(phone, customName = '') {
  if (customName && customName.trim()) return customName.trim();
  const normalized = normalizePhoneNumber(phone);
  const found = DEFAULT_TEAM_USERS.find(u => u.phone === normalized);
  if (found) return found.name;
  return `User (${normalized.slice(-4)})`;
}

// ==========================================
// IN-MEMORY REAL-TIME DATA STORE (PHONE-BASED)
// ==========================================
let users = [];
let conversations = [];
let messages = {};

// ACTIVE SSE CLIENTS FOR REAL-TIME BROADCASTS
let sseClients = [];

function broadcastToAll(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (err) {
      console.error('Error broadcasting to client:', err.message);
    }
  });
}

function broadcastToPhone(phone, event, data) {
  const normalized = normalizePhoneNumber(phone);
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients
    .filter(c => c.phone === normalized)
    .forEach(client => {
      try {
        client.res.write(payload);
      } catch (err) {}
    });
}

// Helper to read request JSON body
function readRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const parsed = JSON.parse(body || '{}');
      callback(null, parsed);
    } catch (err) {
      callback(err, null);
    }
  });
}

// ==========================================
// HTTP SERVER IMPLEMENTATION
// ==========================================
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const readJson = (callback) => readRequestBody(req, callback);

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // 1. SSE Real-Time Stream Endpoint (Phone-Keyed)
  if (pathname === '/api/live/stream') {
    const rawPhone = urlObj.searchParams.get('phone') || '+919876543210';
    const phone = normalizePhoneNumber(rawPhone);
    const rawName = urlObj.searchParams.get('name');
    const name = (rawName && rawName.trim() && rawName !== 'undefined' && rawName !== 'null') ? rawName.trim() : resolveUserName(phone);
    const clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    res.write(`event: CONNECTED\ndata: ${JSON.stringify({ clientId, phone, formattedPhone: formatDisplayPhone(phone), serverTime: new Date().toISOString() })}\n\n`);

    const client = { id: clientId, phone, name, res };
    sseClients.push(client);

    // Auto-register user in active users registry
    let existingUser = users.find(u => u.phone === phone);
    if (!existingUser) {
      existingUser = {
        id: `u-${Date.now()}`,
        name: name,
        phone: phone,
        formattedPhone: formatDisplayPhone(phone),
        status: 'Online'
      };
      users.push(existingUser);
    } else if (name && name !== existingUser.name) {
      existingUser.name = name;
    }

    console.log(`[SSE] Phone connected: ${phone} (${name}) | Total active devices: ${sseClients.length}`);

    // Broadcast online status & user info to all connected devices
    broadcastToAll('USER_STATUS_CHANGE', { phone, isOnline: true, user: existingUser });
    broadcastToAll('USER_JOINED', existingUser);

    req.on('close', () => {
      sseClients = sseClients.filter(c => c.id !== clientId);
      console.log(`[SSE] Phone disconnected: ${phone} | Remaining devices: ${sseClients.length}`);
      const hasOtherConnections = sseClients.some(c => c.phone === phone);
      if (!hasOtherConnections) {
        broadcastToAll('USER_STATUS_CHANGE', { phone, isOnline: false, user: existingUser });
      }
    });
    return;
  }

  // 1b. Explicit Register Endpoint (Phone + Name)
  if (pathname === '/api/live/register' && req.method === 'POST') {
    readJson((err, data) => {
      if (!err && data.phone) {
        const phone = normalizePhoneNumber(data.phone);
        const name = resolveUserName(phone, data.name);
        let existingUser = users.find(u => u.phone === phone);
        if (!existingUser) {
          existingUser = {
            id: `u-${Date.now()}`,
            name: name,
            phone: phone,
            formattedPhone: formatDisplayPhone(phone),
            status: 'Online'
          };
          users.push(existingUser);
        } else {
          existingUser.name = name;
        }
        broadcastToAll('USER_JOINED', existingUser);
        broadcastToAll('USER_STATUS_CHANGE', { phone, isOnline: true, user: existingUser });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: existingUser }));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Valid phone number required' }));
      }
    });
    return;
  }

  // 1c. Simulated OTP Generation / Verification Endpoint
  if (pathname === '/api/auth/send-otp' && req.method === 'POST') {
    readJson((err, data) => {
      if (!err && data.phone) {
        const phone = normalizePhoneNumber(data.phone);
        // Default demo OTP is 1234
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          phone,
          formattedPhone: formatDisplayPhone(phone),
          otp: '1234',
          message: 'OTP 1234 sent successfully (Simulated SMS verification)'
        }));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Phone number required' }));
      }
    });
    return;
  }

  // 2. Real-Time Network Info
  if (pathname === '/api/live/network-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ip: LOCAL_IP,
      port: PORT,
      localUrl: `http://localhost:${PORT}`,
      networkUrl: `http://${LOCAL_IP}:${PORT}`,
      activeDevices: sseClients.length,
      connectedPhones: Array.from(new Set(sseClients.map(c => c.phone)))
    }));
    return;
  }

  // 3. Get Initial State / Sync Data (Phone-Based)
  if (pathname === '/api/live/sync') {
    const rawPhone = urlObj.searchParams.get('phone') || '';
    const phone = rawPhone ? normalizePhoneNumber(rawPhone) : '';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      users,
      conversations,
      messages,
      onlinePhones: Array.from(new Set(sseClients.map(c => c.phone))),
      networkUrl: `http://${LOCAL_IP}:${PORT}`
    }));
    return;
  }

  // 4. Send Live Message Across Devices (Phone-Based)
  if (pathname === '/api/live/send' && req.method === 'POST') {
    readJson((err, data) => {
      if (err || !data.convId || !data.message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid message payload' }));
        return;
      }

      const { convId, message, convMeta } = data;
      
      // If conversation does not exist yet, create it on the fly
      let conv = conversations.find(c => c.id === convId);
      if (!conv && convMeta) {
        conv = {
          id: convId,
          title: convMeta.title || message.senderName || formatDisplayPhone(message.senderPhone),
          isGroup: !!convMeta.isGroup,
          participants: convMeta.participants || [message.senderPhone],
          unreadCount: 0,
          lastMessage: {
            text: message.text || (message.audio ? '🎤 Voice Message' : (message.image ? '📷 Photo' : 'Attachment')),
            timestamp: message.timestamp
          }
        };
        conversations.unshift(conv);
        broadcastToAll('CONVERSATION_CREATED', conv);
      }

      if (!messages[convId]) {
        messages[convId] = [];
      }
      messages[convId].push(message);

      // Update conversation lastMessage
      conversations = conversations.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: {
              text: message.text || (message.audio ? '🎤 Voice Message' : (message.image ? '📷 Photo' : 'Attachment')),
              timestamp: message.timestamp
            }
          };
        }
        return c;
      });

      // Broadcast to ALL connected devices in real time
      broadcastToAll('NEW_MESSAGE', { convId, message, conv: conversations.find(c => c.id === convId) });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, messageId: message.id }));
    });
    return;
  }

  // 5. Typing Indicator (Phone-Based)
  if (pathname === '/api/live/typing' && req.method === 'POST') {
    readJson((err, data) => {
      if (!err && data.convId && data.userPhone) {
        broadcastToAll('TYPING', data);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // 6. Profile Update Sync (Phone + Name)
  if (pathname === '/api/live/profile' && req.method === 'POST') {
    readJson((err, data) => {
      if (!err && data.phone) {
        const phone = normalizePhoneNumber(data.phone);
        const cleanName = resolveUserName(phone, data.name);
        const userIndex = users.findIndex(u => u.phone === phone);
        let updatedUser;
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...data, phone, formattedPhone: formatDisplayPhone(phone), name: cleanName };
          updatedUser = users[userIndex];
        } else {
          updatedUser = { id: `u-${Date.now()}`, ...data, phone, formattedPhone: formatDisplayPhone(phone), name: cleanName, status: 'Online' };
          users.push(updatedUser);
        }
        broadcastToAll('PROFILE_UPDATED', updatedUser);
        broadcastToAll('USER_STATUS_CHANGE', { phone, isOnline: true, user: updatedUser });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, user: updatedUser }));
        return;
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid payload' }));
    });
    return;
  }

  // 7. Create New Conversation (Phone Participants)
  if (pathname === '/api/live/create-conv' && req.method === 'POST') {
    readJson((err, data) => {
      if (!err && data.conv) {
        const incoming = data.conv;
        // Check if conversation already exists between same two 1-on-1 phone participants
        const existing = conversations.find(c => {
          if (c.id === incoming.id) return true;
          if (!c.isGroup && !incoming.isGroup && c.participants && incoming.participants) {
            const p1 = [...c.participants].map(x => normalizePhoneNumber(x)).sort().join(',');
            const p2 = [...incoming.participants].map(x => normalizePhoneNumber(x)).sort().join(',');
            return p1 === p2;
          }
          return false;
        });

        const convToUse = existing || incoming;
        if (!existing) {
          conversations.unshift(convToUse);
        }
        if (!messages[convToUse.id]) messages[convToUse.id] = [];
        
        broadcastToAll('CONVERSATION_CREATED', convToUse);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, conv: convToUse }));
        return;
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid conv payload' }));
    });
    return;
  }

  // 8. AI Helper Endpoints
  if (pathname.startsWith('/api/ai/')) {
    readJson((err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (pathname === '/api/ai/smart-replies') {
        res.end(JSON.stringify([
          'Yes, message received on phone.',
          'Understood, proceeding with the test.',
          'Let me check and update you.'
        ]));
      } else if (pathname === '/api/ai/rewrite') {
        res.end(JSON.stringify({
          rewrittenText: `I would like to inform you that ${data.text || 'the task is completed'}. Please let me know if any further action is required.`
        }));
      } else if (pathname === '/api/ai/summarize') {
        res.end(JSON.stringify({
          summary: 'Discussion covering project synopsis, React UI with Lucide icons, and real-time phone authentication.',
          keyPoints: [
            'Pure Phone Number Authentication model active with simulated OTP verification.',
            'Cross-device communication verified across distinct phone numbers.',
            'Human-in-the-Loop AI Assistant provides tone rewriting, live translation, and voice notes.'
          ],
          actionItems: [
            'Finalize major project demonstration under guidance of Mr. Sudhakar Dwivedi for AKGEC (2026-2027).'
          ]
        }));
      } else {
        res.end(JSON.stringify({ status: 'ok' }));
      }
    });
    return;
  }

  // Serve static files
  let safePath = pathname;
  if (safePath === '/' || safePath === '/index.html') {
    safePath = '/standalone-preview.html';
  }

  let filePath = path.join(FRONTEND_DIR, safePath);

  // Fallback to standalone-preview.html for SPA routes
  if (!fs.existsSync(filePath)) {
    filePath = path.join(FRONTEND_DIR, 'standalone-preview.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/html';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

function startServer(portToUse) {
  server.listen(portToUse, () => {
    console.log('\n==================================================================');
    console.log(`  🚀 ConnectAI - AI-Integrated People Chat Application Running!  `);
    console.log(`  👉 Localhost:     http://localhost:${portToUse}                 `);
    console.log(`  👉 IPv4 Loopback: http://127.0.0.1:${portToUse}                `);
    console.log(`  👉 Cross-Device:  http://${LOCAL_IP}:${portToUse}               `);
    console.log(`  📱 Open http://${LOCAL_IP}:${portToUse} on your phone or other PC! `);
    console.log('==================================================================\n');
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`⚠️ Port ${err.port} is already in use, trying port ${Number(err.port) + 1}...`);
    startServer(Number(err.port) + 1);
  } else {
    console.error('Server error:', err);
  }
});

startServer(PORT);
