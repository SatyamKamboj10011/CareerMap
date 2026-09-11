// ProfilePage.jsx - Student/Advisor profile page
import React, { useState } from 'react';
import api from '../services/api.js';
import { getUser, saveUser } from '../services/Auth.js';

const ProfilePage = () => {
  const user = getUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contactNumber: user?.contactNumber || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.put('/api/auth/profile', formData);
      saveUser({ ...user, ...formData });
      setMessage('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prof-wrap">

      {/* ─── PROFILE HEADER CARD ─── */}
      <div className="prof-hero">
        <div className="prof-avatar-wrap">
          <div className="prof-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="prof-avatar-ring"></div>
        </div>
        <div className="prof-hero-info">
          <h2 className="prof-hero-name">{user?.name}</h2>
          <p className="prof-hero-email">{user?.email}</p>
          <span className="prof-hero-role">
            {user?.role === 'advisor' ? '👩‍💼 Career Advisor' : '🎓 Student'}
          </span>
        </div>
        <button
          className="prof-edit-btn"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit profile
            </>
          )}
        </button>
      </div>

      {/* ─── MESSAGES ─── */}
      {message && <div className="sd-msg sd-msg-ok">✓ {message}</div>}
      {error && <div className="sd-msg sd-msg-err">⚠ {error}</div>}

      <div className="prof-grid">

        {/* ─── PROFILE FORM ─── */}
        <div className="prof-card">
          <div className="prof-card-title">Personal information</div>
          <form onSubmit={handleSubmit} className="prof-form">

            <div className="prof-field">
              <label className="prof-label">Full name</label>
              {editMode ? (
                <div className="prof-input-wrap">
                  <span className="prof-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    className="prof-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : (
                <div className="prof-value">{user?.name}</div>
              )}
            </div>

            <div className="prof-field">
              <label className="prof-label">Email address</label>
              {editMode ? (
                <div className="prof-input-wrap">
                  <span className="prof-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    className="prof-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : (
                <div className="prof-value">{user?.email}</div>
              )}
            </div>

            <div className="prof-field">
              <label className="prof-label">Contact number</label>
              {editMode ? (
                <div className="prof-input-wrap">
                  <span className="prof-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </span>
                  <input
                    className="prof-input"
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <div className="prof-value">{user?.contactNumber || '—'}</div>
              )}
            </div>

            <div className="prof-field">
              <label className="prof-label">Role</label>
              <div className="prof-value">
                <span className="prof-role-badge">
                  {user?.role === 'advisor' ? '👩‍💼 Career Advisor' : '🎓 Student'}
                </span>
              </div>
            </div>

            {editMode && (
              <div className="prof-actions">
                <button type="submit" className="prof-save-btn" disabled={loading}>
                  {loading ? (
                    <span className="aa-loading">
                      <span className="aa-spinner"></span>
                      Saving...
                    </span>
                  ) : 'Save changes'}
                </button>
                <button
                  type="button"
                  className="prof-cancel-btn"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      contactNumber: user?.contactNumber || '',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ─── ACCOUNT INFO ─── */}
        <div className="prof-right">

          {/* Account stats */}
          <div className="prof-card">
            <div className="prof-card-title">Account details</div>
            <div className="prof-detail-list">
              <div className="prof-detail-item">
                <span className="prof-detail-label">Account type</span>
                <span className="prof-detail-value">
                  {user?.role === 'advisor' ? 'Career Advisor' : 'Student'}
                </span>
              </div>
              <div className="prof-detail-item">
                <span className="prof-detail-label">Authentication</span>
                <span className="prof-detail-value prof-detail-green">JWT Secured ✓</span>
              </div>
              <div className="prof-detail-item">
                <span className="prof-detail-label">Password</span>
                <span className="prof-detail-value">••••••••</span>
              </div>
              <div className="prof-detail-item">
                <span className="prof-detail-label">Status</span>
                <span className="prof-detail-value prof-detail-green">Active ✓</span>
              </div>
            </div>
          </div>

          {/* Tips card */}
          <div className="prof-card prof-tips-card">
            <div className="prof-tips-icon">🔒</div>
            <div className="prof-card-title">Keep your account secure</div>
            <div className="prof-tips-list">
              <div className="prof-tip">✓ Use a strong password</div>
              <div className="prof-tip">✓ Enable push notifications</div>
              <div className="prof-tip">✓ Keep your email updated</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;