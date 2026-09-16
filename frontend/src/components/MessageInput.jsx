import React, { useState } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Wand2, 
  Languages, 
  Mic, 
  Sparkles 
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { rewriteMessage, translateMessage } from '../services/aiService';

export default function MessageInput({ inputValue, setInputValue }) {
  const { sendMessage, setAiSuggestionModalData } = useChat();
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const handleSend = () => {
    if (!inputValue || inputValue.trim() === '') return;
    sendMessage(inputValue);
    setInputValue('');
    setShowQuickMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickRewrite = async (tone = 'formal') => {
    if (!inputValue || inputValue.trim() === '') {
      alert('Please type a draft message first to rewrite.');
      return;
    }
    setIsProcessingAi(true);
    const rewritten = await rewriteMessage(inputValue, tone);
    setIsProcessingAi(false);
    
    // Open Human-in-the-Loop review modal
    setAiSuggestionModalData({
      type: 'rewrite',
      tone: tone,
      originalText: inputValue,
      suggestedText: rewritten
    });
  };

  const handleQuickTranslate = async (lang = 'Hindi') => {
    if (!inputValue || inputValue.trim() === '') {
      alert('Please type a draft message first to translate.');
      return;
    }
    setIsProcessingAi(true);
    const translated = await translateMessage(inputValue, lang);
    setIsProcessingAi(false);

    // Open review modal
    setAiSuggestionModalData({
      type: 'translate',
      targetLanguage: lang,
      originalText: inputValue,
      suggestedText: translated
    });
  };

  return (
    <div className="chat-input-container">
      {/* Left Action Buttons */}
      <div className="input-actions-left">
        <button 
          className="btn-icon" 
          title="Attach File or Code Snippet"
          onClick={() => alert('Attachment facility ready: Supports PDF, Code Snippets, and Images in v1.2.')}
        >
          <Paperclip size={18} />
        </button>
        <button 
          className="btn-icon" 
          title="Insert Emoji"
          onClick={() => setInputValue(prev => prev + ' 😊')}
        >
          <Smile size={18} />
        </button>
      </div>

      {/* Input Field & AI Trigger */}
      <div className="chat-input-wrapper">
        <textarea
          className="chat-textarea"
          placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
          rows={1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button 
          className="input-sparkle-btn" 
          title="AI Quick Actions (Rewrite / Translate)"
          onClick={() => setShowQuickMenu(!showQuickMenu)}
        >
          <Sparkles size={18} />
        </button>

        {/* Quick AI menu popup */}
        {showQuickMenu && (
          <div style={{
            position: 'absolute',
            bottom: '52px',
            right: '0',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            width: '210px',
            zIndex: 30
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.2rem 0.5rem', fontWeight: 600 }}>
              AI ASSISTANCE (CONFIRM BEFORE SEND)
            </div>
            <button 
              className="filter-tab"
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => { setShowQuickMenu(false); handleQuickRewrite('formal'); }}
            >
              <Wand2 size={14} style={{ color: '#8b5cf6' }} />
              <span>Make Formal / Polite</span>
            </button>
            <button 
              className="filter-tab"
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => { setShowQuickMenu(false); handleQuickRewrite('concise'); }}
            >
              <Wand2 size={14} style={{ color: '#06b6d4' }} />
              <span>Make Concise</span>
            </button>
            <button 
              className="filter-tab"
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => { setShowQuickMenu(false); handleQuickTranslate('Hindi'); }}
            >
              <Languages size={14} style={{ color: '#ec4899' }} />
              <span>Translate to Hindi</span>
            </button>
          </div>
        )}
      </div>

      {/* Send Button */}
      <button 
        className="btn-send"
        disabled={!inputValue || inputValue.trim() === '' || isProcessingAi}
        onClick={handleSend}
        title="Send Message"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
