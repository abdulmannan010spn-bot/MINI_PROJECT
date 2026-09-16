import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  Check, 
  Upload,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'
];

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [department, setDepartment] = useState(currentUser?.department || 'Information Technology');
  const [preferredAiTone, setPreferredAiTone] = useState(currentUser?.preferredAiTone || 'Professional & Friendly');
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser?.preferredLanguage || 'English');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      avatar,
      department,
      preferredAiTone,
      preferredLanguage
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <button 
            className="btn-icon" 
            onClick={() => navigate('/')} 
            title="Back to Chat Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Edit Profile & Change DP</h3>
          <div style={{ width: '36px' }} />
        </div>

        {savedSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--color-success)',
            color: '#6ee7b7',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} />
            <span>Profile and DP updated successfully!</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSave}>
          {/* Avatar & User Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img 
              src={avatar} 
              alt="Avatar" 
              style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
              />
              <button 
                type="button" 
                className="btn-primary" 
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <Upload size={14} />
                <span>Upload Photo from Device</span>
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PNG, JPG or WebP supported</span>
            </div>
          </div>

          {/* Preset Avatar Gallery */}
          <div className="form-group">
            <label className="form-label">Or Choose from Avatar Gallery:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.25rem' }}>
              {PRESET_AVATARS.map((av, i) => (
                <img 
                  key={i} 
                  src={av} 
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: avatar === av ? '3px solid var(--color-primary)' : '3px solid transparent',
                    boxShadow: avatar === av ? '0 0 0 2px var(--color-c1)' : 'none'
                  }}
                  onClick={() => setAvatar(av)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department / College</label>
            <input 
              type="text" 
              className="form-input" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)} 
            />
          </div>

          {/* AI Settings Section */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-c1)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Sparkles size={16} />
              <span>Personalized AI Assistant Config</span>
            </div>

            <div className="form-group">
              <label className="form-label">Default Tone for Message Rewriting</label>
              <select 
                className="ai-select"
                value={preferredAiTone}
                onChange={(e) => setPreferredAiTone(e.target.value)}
              >
                <option value="Professional & Friendly">Professional & Friendly</option>
                <option value="Academic & Formal">Academic & Formal</option>
                <option value="Concise & Brief">Concise & Direct</option>
                <option value="Casual & Conversational">Casual & Conversational</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Default Translation Target</label>
              <select 
                className="ai-select"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
              >
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Russian">Russian (Русский)</option>
                <option value="Japanese">Japanese (日本語)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
          >
            <Save size={16} />
            <span>Save Profile & DP</span>
          </button>
        </form>
      </div>
    </div>
  );
}
