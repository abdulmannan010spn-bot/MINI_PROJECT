import React, { useState } from 'react';
import { 
  Users, 
  User, 
  X, 
  Plus, 
  Search, 
  Check 
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function NewChatModal() {
  const { 
    isNewChatModalOpen, 
    setIsNewChatModalOpen, 
    contacts, 
    createNewConversation 
  } = useChat();

  const [mode, setMode] = useState('direct'); // 'direct' or 'group'
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [groupTitle, setGroupTitle] = useState('');
  const [searchContact, setSearchContact] = useState('');

  if (!isNewChatModalOpen) return null;

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchContact.toLowerCase()) ||
    c.department?.toLowerCase().includes(searchContact.toLowerCase())
  );

  const handleStartChat = () => {
    if (mode === 'direct') {
      if (!selectedContactId) return;
      createNewConversation(selectedContactId, false);
    } else {
      if (!groupTitle.trim()) {
        alert('Please provide a group title.');
        return;
      }
      createNewConversation(selectedContactId || contacts[0].id, true, groupTitle);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewChatModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Start New Conversation</h3>
          <button className="btn-icon" onClick={() => setIsNewChatModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Mode Switcher */}
          <div className="filter-tabs" style={{ padding: 0 }}>
            <button 
              className={`filter-tab ${mode === 'direct' ? 'active' : ''}`}
              onClick={() => setMode('direct')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <User size={15} />
              <span>Direct Message</span>
            </button>
            <button 
              className={`filter-tab ${mode === 'group' ? 'active' : ''}`}
              onClick={() => setMode('group')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Users size={15} />
              <span>Group Chat</span>
            </button>
          </div>

          {/* Group Title (if group mode) */}
          {mode === 'group' && (
            <div className="form-group">
              <label className="form-label">Group Name / Topic</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. IT Major Project 2026-27"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
              />
            </div>
          )}

          {/* Contact Search */}
          <div className="search-box" style={{ padding: 0 }}>
            <Search size={15} className="search-icon" style={{ left: '0.85rem' }} />
            <input 
              type="text"
              className="search-input"
              placeholder="Search faculty or student contacts..."
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
            />
          </div>

          {/* Contacts List */}
          <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {filteredContacts.map(contact => {
              const isSelected = selectedContactId === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-active)' : 'var(--bg-secondary)',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{contact.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {contact.designation || contact.department} {contact.rollNo ? `· ${contact.rollNo}` : ''}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check size={16} style={{ color: 'var(--color-primary)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsNewChatModalOpen(false)}>
            Cancel
          </button>
          <button 
            className="btn-primary"
            onClick={handleStartChat}
            disabled={mode === 'direct' ? !selectedContactId : !groupTitle.trim()}
          >
            {mode === 'direct' ? 'Start Chat' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}
