import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: 'Information Technology',
    password: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div className="brand-icon" style={{ width: '44px', height: '44px' }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '0.4rem' }}>Student / Faculty Registration</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Join the AKGEC AI-Integrated Communication Network
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Abdul Mannan"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">University Roll No</label>
              <input
                type="text"
                name="rollNo"
                className="form-input"
                placeholder="2400270130006"
                value={formData.rollNo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select 
                name="department"
                className="ai-select" 
                style={{ height: '38px', marginTop: '1px' }}
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="ECE">ECE</option>
                <option value="Faculty / Guide">Faculty / Guide</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@akgec.ac.in"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              marginTop: '0.5rem', 
              padding: '0.75rem', 
              fontSize: '0.92rem', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
