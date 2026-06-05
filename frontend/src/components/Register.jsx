// Register.jsx - Modern Registration Page with Illustrations
import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    role: 'student',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.contactNumber) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        role: formData.role,
        password: formData.password
      });
      setMessage(response.data.message);
      setTimeout(() => onSwitchToLogin(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-wrap">
      {/* Left panel — illustration */}
      <div className="reg-left">
        <div className="reg-left-content">
          <div className="reg-brand">
            <div className="reg-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <span className="reg-brand-name">CareerMap</span>
          </div>

          {/* Main illustration */}
          <div className="reg-illustration">
            <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
              {/* Background circle */}
              <circle cx="140" cy="140" r="120" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <circle cx="140" cy="140" r="90" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

              {/* Central laptop */}
              <rect x="80" y="105" width="120" height="80" rx="8" fill="#1e293b" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
              <rect x="86" y="111" width="108" height="66" rx="4" fill="#0f172a"/>
              {/* Screen content */}
              <rect x="92" y="117" width="40" height="5" rx="2" fill="#7c3aed" opacity="0.8"/>
              <rect x="92" y="126" width="60" height="3" rx="1" fill="rgba(255,255,255,0.2)"/>
              <rect x="92" y="132" width="50" height="3" rx="1" fill="rgba(255,255,255,0.15)"/>
              <rect x="92" y="142" width="96" height="18" rx="4" fill="#1e3a5f"/>
              <rect x="97" y="147" width="20" height="3" rx="1" fill="#60a5fa"/>
              <rect x="97" y="153" width="30" height="3" rx="1" fill="rgba(255,255,255,0.2)"/>
              <rect x="140" y="142" width="48" height="18" rx="4" fill="#1a2e1a"/>
              <rect x="145" y="147" width="18" height="3" rx="1" fill="#4ade80"/>
              <rect x="145" y="153" width="25" height="3" rx="1" fill="rgba(255,255,255,0.2)"/>
              {/* Laptop base */}
              <rect x="70" y="185" width="140" height="8" rx="4" fill="#1e293b" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              <rect x="105" y="189" width="70" height="4" rx="2" fill="#0f172a"/>

              {/* Floating card 1 — offer */}
              <g transform="translate(170, 80)">
                <rect width="90" height="44" rx="10" fill="white" opacity="0.95"/>
                <circle cx="18" cy="22" r="10" fill="#f0fdf4"/>
                <text x="18" y="26" textAnchor="middle" fontSize="12">🎉</text>
                <text x="34" y="17" fontSize="8" fontWeight="600" fill="#000">Offer received!</text>
                <text x="34" y="28" fontSize="7" fill="#888">Google — SWE Intern</text>
              </g>

              {/* Floating card 2 — interview */}
              <g transform="translate(20, 150)">
                <rect width="86" height="44" rx="10" fill="white" opacity="0.95"/>
                <circle cx="18" cy="22" r="10" fill="#eff6ff"/>
                <text x="18" y="26" textAnchor="middle" fontSize="12">📅</text>
                <text x="34" y="17" fontSize="8" fontWeight="600" fill="#000">Interview today</text>
                <text x="34" y="28" fontSize="7" fill="#888">Meta — 2:00 PM</text>
              </g>

              {/* Stats floating */}
              <g transform="translate(175, 170)">
                <rect width="80" height="38" rx="8" fill="rgba(124,58,237,0.9)"/>
                <text x="40" y="16" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.7)">Applications</text>
                <text x="40" y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="white">12</text>
              </g>

              {/* Orbiting dots */}
              <circle cx="140" cy="20" r="5" fill="#7c3aed" opacity="0.8"/>
              <circle cx="260" cy="140" r="4" fill="#0ea5e9" opacity="0.8"/>
              <circle cx="140" cy="260" r="5" fill="#10b981" opacity="0.8"/>
              <circle cx="20" cy="140" r="4" fill="#f59e0b" opacity="0.8"/>
            </svg>
          </div>

          {/* Testimonials */}
          <div className="reg-testimonials">
            {[
              { initials: 'SK', color: '#7c3aed', name: 'Satyam K.', text: 'Landed my dream internship!', role: 'Student' },
              { initials: 'EM', color: '#0ea5e9', name: 'Emma C.', text: 'So much easier to track', role: 'Student' },
              { initials: 'ST', color: '#10b981', name: 'Sarah T.', text: 'Great for monitoring students', role: 'Advisor' },
            ].map((t, i) => (
              <div key={i} className="reg-testimonial-item">
                <div className="reg-t-avatar" style={{ background: t.color }}>{t.initials}</div>
                <div>
                  <div className="reg-t-name">{t.name} <span className="reg-t-role">{t.role}</span></div>
                  <div className="reg-t-text">"{t.text}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="reg-right">
        <div className="reg-form-wrap">

          {/* Progress indicator */}
          <div className="reg-progress">
            <div className={`reg-step ${step >= 1 ? 'active' : ''}`}>
              <div className="reg-step-circle">{step > 1 ? '✓' : '1'}</div>
              <span>Your details</span>
            </div>
            <div className="reg-step-line"></div>
            <div className={`reg-step ${step >= 2 ? 'active' : ''}`}>
              <div className="reg-step-circle">2</div>
              <span>Set password</span>
            </div>
          </div>

          <h1 className="reg-title">
            {step === 1 ? 'Create your account' : 'Set your password'}
          </h1>
          <p className="reg-sub">
            {step === 1
              ? 'Start tracking your internship journey today'
              : 'Choose a strong password to secure your account'}
          </p>

          {/* Messages */}
          {message && (
            <div className="reg-message reg-success">
              <span>✓</span> {message}
            </div>
          )}
          {error && (
            <div className="reg-message reg-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleNext} className="reg-form">
              <div className="reg-field">
                <label className="reg-label">Full name</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    className="reg-input"
                    type="text"
                    name="name"
                    placeholder="Satyam Kamboj"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Email address</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    className="reg-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">Contact number</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <input
                      className="reg-input"
                      type="text"
                      name="contactNumber"
                      placeholder="021 123 4567"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-label">I am a</label>
                  <div className="reg-role-btns">
                    <button
                      type="button"
                      className={`reg-role-btn ${formData.role === 'student' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, role: 'student' })}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      className={`reg-role-btn ${formData.role === 'advisor' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, role: 'advisor' })}
                    >
                      👩‍💼 Advisor
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="reg-btn">
                Continue →
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="reg-form">
              <div className="reg-selected-info">
                <div className="reg-si-avatar">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="reg-si-name">{formData.name}</div>
                  <div className="reg-si-email">{formData.email}</div>
                </div>
                <button type="button" className="reg-si-edit" onClick={() => setStep(1)}>Edit</button>
              </div>

              <div className="reg-field">
                <label className="reg-label">Password</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="reg-input"
                    type="password"
                    name="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Password strength */}
                {formData.password.length > 0 && (
                  <div className="reg-strength">
                    <div className="reg-strength-bars">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className="reg-strength-bar"
                          style={{
                            background: formData.password.length >= i * 2
                              ? formData.password.length < 6 ? '#ef4444'
                              : formData.password.length < 10 ? '#f59e0b' : '#10b981'
                              : '#e5e7eb'
                          }}
                        />
                      ))}
                    </div>
                    <span className="reg-strength-txt">
                      {formData.password.length < 6 ? 'Too short'
                        : formData.password.length < 10 ? 'Good'
                        : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div className="reg-field">
                <label className="reg-label">Confirm password</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </span>
                  <input
                    className="reg-input"
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{
                      borderColor: formData.confirmPassword
                        ? formData.password === formData.confirmPassword ? '#10b981' : '#ef4444'
                        : undefined
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? (
                  <span className="reg-loading">
                    <span className="reg-spinner"></span>
                    Creating account...
                  </span>
                ) : 'Create account →'}
              </button>

              <button
                type="button"
                className="reg-back-btn"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
            </form>
          )}

          <div className="reg-switch">
            Already have an account?{' '}
            <span className="reg-switch-link" onClick={onSwitchToLogin}>
              Sign in
            </span>
          </div>

          <div className="reg-terms">
            By creating an account you agree to our{' '}
            <span className="reg-terms-link">Terms of Service</span>{' '}
            and{' '}
            <span className="reg-terms-link">Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;