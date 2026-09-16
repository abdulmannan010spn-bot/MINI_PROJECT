import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Bot, 
  Languages, 
  Copy, 
  Check, 
  CheckCheck,
  ShieldAlert
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import SmartReplyBar from './SmartReplyBar';
import MessageInput from './MessageInput';
import { translateMessage } from '../services/aiService';

export default function ChatArea() {
  const { 
    activeConversation, 
    activeMessages, 
    setIsMobileSidebarOpen, 
    isAiPanelOpen, 
    setIsAiPanelOpen,
    setIsSummaryModalOpen,
    setAiSuggestionModalData
  } = useChat();
  const { currentUser } = useAuth();
  
  const [composerText, setComposerText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSelectSmartReply = (text) => {
    setComposerText(text);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTranslateMessage = async (msg) => {
    const targetLang = currentUser?.preferredLanguage === 'Hindi' ? 'English' : 'Hindi';
    const translated = await translateMessage(msg.text, targetLang);
    
    setAiSuggestionModalData({
      type: 'translate',
      targetLanguage: targetLang,
      originalText: msg.text,
      suggestedText: translated
    });
  };

  if (!activeConversation) {
    return (
      <div className="chat-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <Bot size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
          <h3>Select a conversation to start messaging</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Real-time chat with AI assistance layer ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="chat-main">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-info">
          {/* Mobile Back to contacts */}
          <button 
            className="btn-icon mobile-back-btn" 
            style={{ display: 'none' }}
            onClick={() => setIsMobileSidebarOpen(true)}
            title="Back to Chats"
          >
            <ArrowLeft size={18} />
          </button>

          <img 
            src={activeConversation.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={activeConversation.title} 
            className="avatar-img"
            style={{ width: '38px', height: '38px' }}
          />

          <div>
            <h3 className="chat-header-title">{activeConversation.title}</h3>
            <div className="chat-header-subtitle">
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              <span>{activeConversation.isOnline ? 'Online · Live Sync' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="chat-header-actions">
          {/* Summarize Conversation Trigger */}
          <button 
            className="btn-icon" 
            onClick={() => setIsSummaryModalOpen(true)}
            title="AI Conversation Summary & Action Items"
            style={{ color: '#c084fc' }}
          >
            <FileText size={18} />
          </button>

          <button className="btn-icon" title="Voice Call" onClick={() => alert('Initiating secure WebRTC voice channel...')}>
            <Phone size={18} />
          </button>

          <button className="btn-icon" title="Video Call" onClick={() => alert('Initiating secure WebRTC video channel...')}>
            <Video size={18} />
          </button>

          <button 
            className={`btn-icon ${isAiPanelOpen ? 'active' : ''}`}
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            title="Toggle AI Side Panel"
          >
            <Sparkles size={18} />
          </button>
        </div>
      </header>

      {/* Messages Stream */}
      <div className="messages-stream">
        <div className="message-date-divider">
          <span>Today</span>
        </div>

        {activeMessages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;

          return (
            <div 
              key={msg.id} 
              className={`message-row ${isMe ? 'sent' : 'received'}`}
            >
              {/* Message Hover Actions */}
              <div className="message-actions-bar">
                <button 
                  className="msg-action-btn" 
                  onClick={() => handleCopy(msg.id, msg.text)}
                  title="Copy Text"
                >
                  {copiedId === msg.id ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                </button>
                <button 
                  className="msg-action-btn" 
                  onClick={() => handleTranslateMessage(msg)}
                  title="Translate Message with AI"
                >
                  <Languages size={12} />
                </button>
              </div>

              {/* Bubble Body */}
              <div className="message-bubble">
                {!isMe && activeConversation.type === 'group' && (
                  <span className="message-sender-name">{msg.senderName}</span>
                )}
                
                <p className="message-text">{msg.text}</p>
                
                <div className="message-meta">
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck size={13} style={{ color: '#60a5fa' }} />
                      ) : (
                        <Check size={13} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Smart Replies Suggestions */}
      <SmartReplyBar onSelectReply={handleSelectSmartReply} />

      {/* Chat Message Input Composer */}
      <MessageInput 
        inputValue={composerText} 
        setInputValue={setComposerText} 
      />
    </main>
  );
}
