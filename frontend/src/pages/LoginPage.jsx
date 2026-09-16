import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Phone, User, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CONTACTS_DATA, CURRENT_USER_DEFAULT } from '../utils/mockData';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' }
];

const PRE_REGISTERED_TEAM = [
  { name: 'Abdul Mannan', phone: '+91 98765 43210', rawPhone: '+919876543210', role: 'Student Lead', avatar: CURRENT_USER_DEFAULT.avatar },
  { name: 'Aditya Maurya', phone: '+91 98765 43211', rawPhone: '+919876543211', role: 'Collaborator', avatar: CONTACTS_DATA[0].avatar },
  { name: 'Mr. Sudhakar Dwivedi', phone: '+91 98765 43212', rawPhone: '+919876543212', role: 'Faculty Mentor', avatar: CONTACTS_DATA[3].avatar },
  { name: 'Aditya Vishwakarma', phone: '+91 98765 43213', rawPhone: '+919876543213', role: 'Collaborator', avatar: CONTACTS_DATA[1].avatar }
];

export default function LoginPage() {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [fullName, setFullName] = useState('Abdul Mannan');
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4']);
  const [isVerifying, setIsVerifying] = useState(false);

  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setShowOtpModal(true);
  };

  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      const fullPhone = `${countryCode} ${phoneNumber.replace(/[\s-]/g, '')}`;
      updateProfile({
        name: fullName || 'User',
        phone: fullPhone,
        email: `${phoneNumber}@connectai.app`,
        avatar: CURRENT_USER_DEFAULT.avatar
      });
      setIsVerifying(false);
      setShowOtpModal(false);
      navigate('/');
    }, 400);
  };

  const handleQuickTeamSelect = (member) => {
    updateProfile({
      name: member.name,
      phone: member.phone,
      email: `${member.rawPhone}@connectai.app`,
      avatar: member.avatar
    });
    navigate('/');
  };

  return (
    <div className="auth-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)', padding: '1rem' }}>
      <div className="auth-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem 1.75rem', width: '100%', maxWidth: '440px' }}>
        
        {/* Header Branding */}
        <div className="auth-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--color-c1), var(--color-c3))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Phone size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.25rem' }}>ConnectAI Phone Login</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Enter your mobile number for secure instant authentication
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--color-danger)',
            color: '#fca5a5',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Direct Phone Number Login Form */}
        <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Mobile Phone Number</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select 
                value={countryCode} 
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '0.65rem 0.5rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="98765 43210" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required 
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Full Name (Display in Chat)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Abdul Mannan or Aditya Maurya" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              style={{
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              marginTop: '0.25rem', 
              padding: '0.75rem', 
              fontSize: '0.92rem', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-c1), var(--color-c4))',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>Continue with Phone Number</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* 1-Click Fast Team Logins */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem',
          marginTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600 }}>
            ⚡ 1-CLICK SELECT TEAM MEMBER:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {PRE_REGISTERED_TEAM.map((member, i) => (
              <div 
                key={i} 
                onClick={() => handleQuickTeamSelect(member)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img src={member.avatar} alt={member.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{member.name} <span style={{ fontSize: '0.7rem', color: 'var(--color-c1)' }}>({member.role})</span></div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📱 {member.phone}</div>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--color-c1)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Digit OTP Verification Modal */}
      {showOtpModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowOtpModal(false)}>
          <div className="modal-content" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', width: '100%', maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--color-success)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Verify Phone Number</h3>
              </div>
              <button onClick={() => setShowOtpModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Enter the 4-digit code sent to <strong>{countryCode} {phoneNumber}</strong>:
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {otpDigits.map((digit, idx) => (
                  <input 
                    key={idx}
                    type="text" 
                    maxLength="1"
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1);
                      const copy = [...otpDigits];
                      copy[idx] = val;
                      setOtpDigits(copy);
                    }}
                    style={{
                      width: '46px',
                      height: '46px',
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.76rem', color: 'var(--color-success)', textAlign: 'center' }}>
                ✅ Demo OTP Code is <strong>1234</strong> (Auto-filled for Instant Verification)
              </div>

              <button 
                type="submit" 
                disabled={isVerifying}
                style={{ 
                  width: '100%', 
                  padding: '0.7rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'linear-gradient(135deg, var(--color-c1), var(--color-c4))', 
                  color: '#fff', 
                  border: 'none', 
                  fontWeight: 600, 
                  cursor: 'pointer' 
                }}
              >
                {isVerifying ? 'Verifying...' : 'Verify & Start Chatting'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
