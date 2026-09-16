import React from 'react';
import { Sparkles, RefreshCw, Zap } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function SmartReplyBar({ onSelectReply }) {
  const { smartReplies, isSmartRepliesLoading, refreshSmartReplies } = useChat();

  if (!smartReplies || smartReplies.length === 0) return null;

  return (
    <div className="smart-replies-container">
      <div className="smart-reply-label">
        <Sparkles size={14} />
        <span>Smart Replies:</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', flex: 1, padding: '2px 0' }}>
        {smartReplies.map((replyText, idx) => (
          <button
            key={idx}
            className="smart-reply-chip"
            onClick={() => onSelectReply(replyText)}
            title="Click to insert into composer"
          >
            <Zap size={12} style={{ color: '#c084fc' }} />
            <span>{replyText}</span>
          </button>
        ))}
      </div>

      <button 
        className="btn-icon"
        style={{ width: '28px', height: '28px', flexShrink: 0 }}
        onClick={refreshSmartReplies}
        title="Regenerate Smart Suggestions"
        disabled={isSmartRepliesLoading}
      >
        <RefreshCw size={13} className={isSmartRepliesLoading ? 'spin' : ''} />
      </button>
    </div>
  );
}
