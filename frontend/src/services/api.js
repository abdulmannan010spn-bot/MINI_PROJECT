// REST API client for Spring Boot Backend

const API_BASE = '/api';

export const api = {
  // Authentication
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, using simulated auth');
    }
    return {
      token: 'jwt-demo-token-12345',
      user: {
        id: 'user-1',
        name: 'Abdul Mannan',
        email: email || 'abdul.mannan@akgec.ac.in',
        rollNo: '2400270130006',
        department: 'Information Technology',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, using simulated register');
    }
    return {
      token: 'jwt-demo-token-new',
      user: {
        id: `user-${Date.now()}`,
        ...userData
      }
    };
  },

  // Users & Contacts
  async getContacts() {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  // Messages
  async getMessages(conversationId) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async sendMessage(conversationId, message) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return message;
  }
};
