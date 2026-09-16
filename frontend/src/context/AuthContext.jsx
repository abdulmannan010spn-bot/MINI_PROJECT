import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENT_USER_DEFAULT } from '../utils/mockData';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ai_chat_user');
    return saved ? JSON.parse(saved) : CURRENT_USER_DEFAULT;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ai_chat_token') || 'demo-jwt-token');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ai_chat_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ai_chat_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res && res.user) {
      setCurrentUser(res.user);
      setToken(res.token);
      localStorage.setItem('ai_chat_token', res.token);
      return res.user;
    }
    return null;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res && res.user) {
      setCurrentUser(res.user);
      setToken(res.token);
      localStorage.setItem('ai_chat_token', res.token);
      return res.user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('ai_chat_user');
    localStorage.removeItem('ai_chat_token');
  };

  const updateProfile = (updates) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
