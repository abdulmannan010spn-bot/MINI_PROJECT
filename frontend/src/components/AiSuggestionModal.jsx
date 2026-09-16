import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Languages, 
  Send, 
  Edit3, 
  X, 
  Check, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function AiSuggestionModal() {
  const { 
    aiSuggestionModalData, 
    setAiSuggestionModalData, 
    sendMessage 
  } = useChat();

  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (aiSuggestionModalData) {
      setEditedText(aiSuggestionModalData.suggestedText || '');
    }
  }, [aiSuggestionModalData]);

  if (!aiSuggestionModalData) return null;

  const handleSendSuggestion = () => {
    if (!editedText || editedText.trim() === '') return;
    
    sendMessage(editedText, {
      isAiAssisted: true,
      aiType: aiSuggestionModalData.type
    });

    setAiSuggestionModalData(null);
  };

  const isRewrite = aiSuggestionModalData.type === 'rewrite';
  const isTranslate = aiSuggestionModalData.type === 'translate';

  return (
    <div className="modal-overlay" onClick={() => setAiSuggestionModalData(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon" style={{ width: '30px', height: '30px' }}>
              {isTranslate ? <Languages size={16} /> : <Wand2 size={16} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                {isTranslate 
                  ? `AI Translation (${aiSuggestionModalData.targetLanguage})` 
                  : `AI Message Rewriting (${aiSuggestionModalData.tone})`}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Human-in-the-Loop: Review and edit before transmitting to the other person.
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={() => setAiSuggestionModalData(null)}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Original Text */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Original Input:
            </span>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {aiSuggestionModalData.originalText}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', gap: '4px', fontSize: '0.8rem' }}>
            <Sparkles size={14} />
            <span>AI Processed Suggestion</span>
          </div>

          {/* Editable AI Generated Suggestion */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Edit3 size={13} />
              <span>Review / Edit Suggestion:</span>
            </label>
            <textarea
              className="chat-textarea"
              style={{ minHeight: '90px', borderColor: 'var(--color-primary)' }}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button 
            className="btn-secondary" 
            onClick={() => setAiSuggestionModalData(null)}
          >
            Discard
          </button>

          <button 
            className="btn-primary"
            onClick={handleSendSuggestion}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Send size={15} />
            <span>Confirm & Send Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}
