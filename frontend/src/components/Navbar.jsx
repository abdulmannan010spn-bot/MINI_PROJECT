import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MessageSquare, 
  Bot, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { isAiPanelOpen, setIsAiPanelOpen, isMobileSidebarOpen, setIsMobileSidebarOpen } = useChat();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Left Brand Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          className="btn-icon mobile-back-btn" 
          style={{ display: 'none' }}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          title="Toggle Chats Menu"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <span>AI·Chat</span>
            <span className="brand-tag">Academic Edition</span>
          </div>
        </Link>
      </div>

      {/* Center Status & Technology Badge */}
      <div className="nav-center-badge">
        <span className="pulse-dot"></span>
        <span>Human-to-Human Messaging · AI Assistance Active</span>
      </div>

      {/* Right Controls & Profile */}
      <div className="nav-actions">
        {/* Toggle AI Panel Button */}
        <button 
          className={`btn-ai-toggle ${isAiPanelOpen ? 'active' : ''}`}
          onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
          title="Toggle AI Assistant Tools"
        >
          <Bot size={18} />
          <span className="brand-text-long">AI Assistant</span>
        </button>

        {/* User Profile Badge */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/profile" className="user-profile-badge" title="Edit Profile & AI Preferences">
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt={currentUser.name} 
                className="user-avatar"
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }} className="brand-text-long">
                {currentUser.name.split(' ')[0]}
              </span>
            </Link>

            <button 
              className="btn-icon" 
              onClick={handleLogout} 
              title="Logout"
              style={{ color: 'var(--color-danger)' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
