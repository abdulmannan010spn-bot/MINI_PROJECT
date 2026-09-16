import React from 'react';
import { 
  Search, 
  MessageSquarePlus, 
  Users, 
  User, 
  X, 
  Check, 
  CheckCheck 
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function Sidebar() {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    isMobileSidebarOpen,
    setIsNewChatModalOpen
  } = useChat();

  return (
    <aside className={`sidebar ${isMobileSidebarOpen ? '' : 'hidden-mobile'}`}>
      {/* Header */}
      <div className="sidebar-header">
        <h2 className="sidebar-title">Conversations</h2>
        <button 
          className="btn-icon" 
          onClick={() => setIsNewChatModalOpen(true)}
          title="New Chat or Group"
          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
        >
          <MessageSquarePlus size={18} />
        </button>
      </div>

      {/* Search Input */}
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input 
          type="text"
          className="search-input"
          placeholder="Search people or messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '1.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Chats
        </button>
        <button 
          className={`filter-tab ${filterType === 'direct' ? 'active' : ''}`}
          onClick={() => setFilterType('direct')}
        >
          Direct
        </button>
        <button 
          className={`filter-tab ${filterType === 'group' ? 'active' : ''}`}
          onClick={() => setFilterType('group')}
        >
          Groups
        </button>
      </div>

      {/* Conversations List */}
      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No conversations found.
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <div 
                key={conv.id}
                className={`conversation-item ${isActive ? 'active' : ''}`}
                onClick={() => selectConversation(conv.id)}
              >
                {/* Avatar with Status indicator */}
                <div className="avatar-container">
                  <img 
                    src={conv.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={conv.title} 
                    className="avatar-img"
                  />
                  {conv.isOnline && <div className="online-indicator" />}
                </div>

                {/* Details */}
                <div className="conv-details">
                  <div className="conv-top-row">
                    <span className="conv-name">{conv.title}</span>
                    <span className="conv-time">{conv.lastMessage?.timestamp || ''}</span>
                  </div>

                  <div className="conv-bottom-row">
                    <span className="conv-last-msg">
                      {conv.lastMessage?.text || 'No messages yet'}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Academic Attribution */}
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>AKGEC IT Dept (2026-27)</span>
        <span style={{ color: 'var(--color-primary)' }}>AI-Assisted</span>
      </div>
    </aside>
  );
}
