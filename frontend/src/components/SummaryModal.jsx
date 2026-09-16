import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  ListChecks, 
  X, 
  Copy, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { summarizeConversation } from '../services/aiService';

export default function SummaryModal() {
  const { 
    isSummaryModalOpen, 
    setIsSummaryModalOpen, 
    activeConversation, 
    activeMessages 
  } = useChat();

  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isSummaryModalOpen) {
      setIsLoading(true);
      summarizeConversation(activeMessages, activeConversation?.title)
        .then((data) => {
          setSummaryData(data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isSummaryModalOpen, activeMessages, activeConversation]);

  if (!isSummaryModalOpen) return null;

  const handleCopySummary = () => {
    if (!summaryData) return;
    const textToCopy = `AI Conversation Summary for ${activeConversation?.title}:\n\n${summaryData.summary}\n\nKey Takeaways:\n${summaryData.keyPoints.map(p => `• ${p}`).join('\n')}\n\nAction Items:\n${summaryData.actionItems.map(a => `[ ] ${a}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSummaryModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px', background: 'var(--color-c4)' }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>AI Conversation Digest</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {activeConversation?.title} · {activeMessages.length} Messages Analyzed
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={() => setIsSummaryModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {isLoading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Sparkles size={28} className="spin" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
              <p>Analyzing conversation context & extracting action items...</p>
            </div>
          ) : summaryData ? (
            <>
              {/* Executive Summary */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <h4 style={{ fontSize: '0.85rem', color: '#93c5fd', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} />
                  Overview
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                  {summaryData.summary}
                </p>
              </div>

              {/* Key Takeaways */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  Key Discussion Points
                </h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {summaryData.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Action Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ListChecks size={14} />
                  Recommended Action Items
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {summaryData.actionItems.map((item, i) => (
                    <div 
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        background: 'var(--bg-secondary)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.83rem'
                      }}
                    >
                      <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} defaultChecked={false} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="btn-secondary"
            onClick={handleCopySummary}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            {isCopied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
          </button>
          
          <button 
            className="btn-primary"
            onClick={() => setIsSummaryModalOpen(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
