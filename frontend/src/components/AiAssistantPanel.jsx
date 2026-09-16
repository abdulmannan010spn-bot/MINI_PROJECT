import React, { useState } from 'react';
import { 
  Bot, 
  Wand2, 
  Languages, 
  FileText, 
  ShieldCheck, 
  X, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { rewriteMessage, translateMessage } from '../services/aiService';

export default function AiAssistantPanel() {
  const { 
    isAiPanelOpen, 
    setIsAiPanelOpen, 
    activeConversation, 
    activeMessages,
    setIsSummaryModalOpen,
    setAiSuggestionModalData
  } = useChat();
  const { currentUser } = useAuth();

  const [rewriteTone, setRewriteTone] = useState('formal');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [customDraft, setCustomDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRewrite = async () => {
    const textToTransform = customDraft || (activeMessages.length > 0 ? activeMessages[activeMessages.length - 1].text : '');
    if (!textToTransform) {
      alert('Please enter a draft message to rewrite.');
      return;
    }

    setIsLoading(true);
    const result = await rewriteMessage(textToTransform, rewriteTone);
    setIsLoading(false);

    setAiSuggestionModalData({
      type: 'rewrite',
      tone: rewriteTone,
      originalText: textToTransform,
      suggestedText: result
    });
  };

  const handleTranslate = async () => {
    const textToTransform = customDraft || (activeMessages.length > 0 ? activeMessages[activeMessages.length - 1].text : '');
    if (!textToTransform) {
      alert('Please enter text to translate.');
      return;
    }

    setIsLoading(true);
    const result = await translateMessage(textToTransform, targetLang);
    setIsLoading(false);

    setAiSuggestionModalData({
      type: 'translate',
      targetLanguage: targetLang,
      originalText: textToTransform,
      suggestedText: result
    });
  };

  return (
    <aside className={`ai-panel ${isAiPanelOpen ? 'open' : ''}`}>
      {/* Panel Header */}
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <Sparkles size={18} />
          <span>AI Assistance Layer</span>
        </div>
        <button 
          className="btn-icon" 
          onClick={() => setIsAiPanelOpen(false)}
          title="Close Panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="ai-panel-content">
        {/* Helper Note on Human-in-the-Loop */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 0.85rem',
          fontSize: '0.78rem',
          color: '#c7d2fe',
          display: 'flex',
          gap: '0.5rem',
          lineHeight: '1.4'
        }}>
          <HelpCircle size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary)' }} />
          <span>
            <strong>Human-in-the-Loop AI:</strong> AI suggestions are always previewed. You retain full control to edit, accept, or reject before sending.
          </span>
        </div>

        {/* 1. Quick Draft Assistant */}
        <div className="ai-feature-card">
          <div className="ai-feature-header">
            <span className="ai-feature-label">
              <Wand2 size={16} style={{ color: '#a855f7' }} />
              Tone Rewriter
            </span>
          </div>

          <select 
            className="ai-select"
            value={rewriteTone}
            onChange={(e) => setRewriteTone(e.target.value)}
          >
            <option value="formal">👔 Professional & Formal</option>
            <option value="casual">☕ Casual & Conversational</option>
            <option value="concise">⚡ Concise & Direct</option>
            <option value="polite">🙏 Courteous & Polite</option>
            <option value="grammar">✨ Fix Grammar & Polish</option>
          </select>

          <input 
            type="text"
            className="form-input"
            placeholder="Type draft or uses last message..."
            value={customDraft}
            onChange={(e) => setCustomDraft(e.target.value)}
            style={{ fontSize: '0.82rem' }}
          />

          <button 
            className="btn-ai-action"
            onClick={handleRewrite}
            disabled={isLoading}
          >
            <Wand2 size={14} />
            <span>{isLoading ? 'Processing...' : 'Rewrite with AI'}</span>
          </button>
        </div>

        {/* 2. Multilingual Live Translation */}
        <div className="ai-feature-card">
          <div className="ai-feature-header">
            <span className="ai-feature-label">
              <Languages size={16} style={{ color: '#ec4899' }} />
              Live Translation
            </span>
          </div>

          <select 
            className="ai-select"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="Hindi">🇮🇳 Hindi (हिन्दी)</option>
            <option value="Spanish">🇪🇸 Spanish (Español)</option>
            <option value="French">🇫🇷 French (Français)</option>
            <option value="German">🇩🇪 German (Deutsch)</option>
            <option value="Russian">🇷🇺 Russian (Русский)</option>
            <option value="Japanese">🇯🇵 Japanese (日本語)</option>
          </select>

          <button 
            className="btn-ai-action"
            onClick={handleTranslate}
            disabled={isLoading}
          >
            <Languages size={14} />
            <span>{isLoading ? 'Translating...' : `Translate to ${targetLang}`}</span>
          </button>
        </div>

        {/* 3. Conversation Summarizer */}
        <div className="ai-feature-card">
          <div className="ai-feature-header">
            <span className="ai-feature-label">
              <FileText size={16} style={{ color: 'var(--color-c1)' }} />
              Conversation Summary
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Extract key talking points, decisions, and action items from this discussion.
          </p>

          <button 
            className="btn-ai-action"
            onClick={() => setIsSummaryModalOpen(true)}
          >
            <FileText size={14} />
            <span>Generate Meeting Summary</span>
          </button>
        </div>

        {/* 4. Safety & Content Moderation */}
        <div className="ai-feature-card" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
          <div className="ai-feature-header">
            <span className="ai-feature-label" style={{ color: 'var(--color-success)' }}>
              <ShieldCheck size={16} />
              AI Safety & Moderation
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
            <span>Active filtering: Safe environment for academic & peer communication.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
