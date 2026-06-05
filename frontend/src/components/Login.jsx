// Login.jsx - Modern Login Page with Illustrations
import React, { useState } from 'react';
import axios from 'axios';
import { saveToken, saveUser } from '../services/Auth.js';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      saveToken(response.data.token);
      saveUser(response.data.user);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => onLoginSuccess(response.data.user), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">

      {/* Left panel — form */}
      <div className="login-left">
        <div className="login-form-wrap">

          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <span className="login-brand-name">CareerMap</span>
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to continue your internship journey</p>

          {/* Messages */}
          {message && (
            <div className="login-message login-success">
              <span>✓</span> {message}
            </div>
          )}
          {error && (
            <div className="login-message login-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">Email address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  className="login-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label">Password</label>
                <span className="login-forgot">Forgot password?</span>
              </div>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-show-pw"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="login-loading">
                  <span className="login-spinner"></span>
                  Signing in...
                </span>
              ) : 'Sign in →'}
            </button>
          </form>

        {/* Divider */}
<div className="login-divider">
  <div className="login-divider-line"></div>
  <span className="login-divider-txt">or</span>
  <div className="login-divider-line"></div>
</div>

{/* Google Sign In Button */}

 <a href="http://localhost:5000/api/auth/google"
  className="google-btn">
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Sign in with Google
</a>

{/* Demo buttons */}
<div className="login-demo-btns">
  <button
    className="login-demo-btn"
    onClick={() => { setEmail('satyam@careermap.com'); setPassword('test123'); }}
  >
    🎓 Student demo
  </button>
  <button
    className="login-demo-btn"
    onClick={() => { setEmail('sarah@careermap.com'); setPassword('advisor123'); }}
  >
    👩‍💼 Advisor demo
  </button>
</div>
          <div className="login-switch">
            Don't have an account?{' '}
            <span className="login-switch-link" onClick={onSwitchToRegister}>
              Sign up for free
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — illustration */}
      <div className="login-right">
        <div className="login-right-content">

          {/* Main headline */}
          <div className="login-headline">
            <h2 className="login-hl-title">
              Your internship journey,<br />
              <span className="login-hl-accent">tracked and organised.</span>
            </h2>
            <p className="login-hl-sub">
              Join thousands of students who use CareerMap to manage their applications and land their dream internships.
            </p>
          </div>

          {/* Dashboard preview illustration */}
          <div className="login-preview">
            <div className="login-preview-header">
              <div className="login-preview-dots">
                <span style={{ background: '#ff5f57' }}></span>
                <span style={{ background: '#febc2e' }}></span>
                <span style={{ background: '#28c840' }}></span>
              </div>
              <span className="login-preview-url">careermap.app/dashboard</span>
            </div>
            <div className="login-preview-body">
              {/* Stats row */}
              <div className="login-stats-row">
                {[
                  { num: '4', label: 'Applied', color: '#2563eb' },
                  { num: '2', label: 'Interview', color: '#d97706' },
                  { num: '1', label: 'Offer', color: '#16a34a' },
                  { num: '1', label: 'Accepted', color: '#16a34a' },
                ].map((s, i) => (
                  <div key={i} className="login-stat">
                    <div className="login-stat-num" style={{ color: s.color }}>{s.num}</div>
                    <div className="login-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Pipeline preview */}
              <div className="login-pipe-preview">
                {[
                  { co: 'Google', role: 'SWE Intern', status: 'Offer', statusColor: '#16a34a', statusBg: '#f0fdf4' },
                  { co: 'Trade Me', role: 'React Dev Intern', status: 'Interview', statusColor: '#92400e', statusBg: '#fffbeb' },
                  { co: 'Spark NZ', role: 'Frontend Dev', status: 'Applied', statusColor: '#1d4ed8', statusBg: '#eff6ff' },
                  { co: 'Xero', role: 'Software Intern', status: 'Applied', statusColor: '#1d4ed8', statusBg: '#eff6ff' },
                ].map((app, i) => (
                  <div key={i} className="login-app-row">
                    <div className="login-app-co-wrap">
                      <div className="login-app-co-icon">{app.co.charAt(0)}</div>
                      <div>
                        <div className="login-app-co">{app.co}</div>
                        <div className="login-app-role">{app.role}</div>
                      </div>
                    </div>
                    <span
                      className="login-app-badge"
                      style={{ color: app.statusColor, background: app.statusBg }}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature pills */}
          <div className="login-pills">
            {[
              { icon: '🔒', text: 'JWT secured' },
              { icon: '📡', text: 'Works offline' },
              { icon: '🔔', text: 'Push alerts' },
              { icon: '☁️', text: 'Cloud synced' },
            ].map((pill, i) => (
              <div key={i} className="login-pill">
                <span>{pill.icon}</span>
                <span>{pill.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;