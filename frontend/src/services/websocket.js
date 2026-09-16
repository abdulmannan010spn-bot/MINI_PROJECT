// WebSocket Service for Real-Time Chat Communication
// Connects to Spring Boot STOMP/SockJS or WebSocket server with local fallback

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.reconnectInterval = 5000;
  }

  connect(token, onConnected, onError) {
    console.log('[WebSocket] Connecting to Spring Boot real-time broker...');
    
    // In production environment with Spring Boot running on localhost:8080
    const wsUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + 
                  (window.location.host || 'localhost:8080') + '/ws/chat';

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('[WebSocket] Connected successfully to Spring Boot WebSocket');
        if (onConnected) onConnected();
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.broadcast(payload.topic || 'message', payload.data);
        } catch (e) {
          console.warn('[WebSocket] Non-JSON message received:', event.data);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        console.log('[WebSocket] Disconnected. Running in local reactive mode.');
      };

      this.socket.onerror = (err) => {
        this.isConnected = false;
        if (onError) onError(err);
      };
    } catch (e) {
      this.isConnected = false;
      console.warn('[WebSocket] Live backend unavailable, using local reactive state sync.');
    }
  }

  subscribe(topic, callback) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic).add(callback);

    return () => {
      if (this.listeners.has(topic)) {
        this.listeners.get(topic).delete(callback);
      }
    };
  }

  broadcast(topic, data) {
    if (this.listeners.has(topic)) {
      this.listeners.get(topic).forEach(cb => cb(data));
    }
  }

  sendMessage(destination, messagePayload) {
    if (this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        destination,
        payload: messagePayload
      }));
    } else {
      // Local broadcast simulation
      setTimeout(() => {
        this.broadcast('message', messagePayload);
      }, 50);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }
}

export const wsService = new WebSocketService();
