// AddApplication.jsx - Modern Add Application Form
import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/Auth.js';

const AddApplication = ({ onBack, onApplicationAdded }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stages = ['Applied', 'Interview', 'Offer', 'Accepted', 'Rejected'];

  const stageConfig = {
    Applied:   { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    Interview: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    Offer:     { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    Accepted:  { color: '#0891b2', bg: '#f0fdff', border: '#a5f3fc' },
    Rejected:  { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/applications', formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessage('Application added successfully!');
      setTimeout(() => onApplicationAdded(), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  const cfg = stageConfig[formData.status];

  return (
    <div className="aa-wrap">

      {/* ─── LEFT PANEL ─── */}
      <div className="aa-left">

        {/* Back button */}
        <button className="aa-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to pipeline
        </button>

        <h1 className="aa-title">Add new application</h1>
        <p className="aa-sub">Track a new internship application in your pipeline</p>

        {/* Messages */}
        {message && <div className="aa-msg aa-msg-ok">✓ {message}</div>}
        {error && <div className="aa-msg aa-msg-err">⚠ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="aa-form">

          {/* Company + Role */}
          <div className="aa-row">
            <div className="aa-field">
              <label className="aa-label">Company name</label>
              <div className="aa-input-wrap">
                <span className="aa-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
                <input
                  className="aa-input"
                  type="text"
                  name="companyName"
                  placeholder="e.g. Xero, Trade Me, Google"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="aa-field">
              <label className="aa-label">Role / Position</label>
              <div className="aa-input-wrap">
                <span className="aa-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                </span>
                <input
                  className="aa-input"
                  type="text"
                  name="role"
                  placeholder="e.g. Frontend Developer Intern"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="aa-field">
            <label className="aa-label">Date applied</label>
            <div className="aa-input-wrap">
              <span className="aa-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <input
                className="aa-input"
                type="date"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Status selector */}
          <div className="aa-field">
            <label className="aa-label">Current status</label>
            <div className="aa-status-grid">
              {stages.map(stage => {
                const sc = stageConfig[stage];
                return (
                  <button
                    key={stage}
                    type="button"
                    className={`aa-status-btn ${formData.status === stage ? 'active' : ''}`}
                    style={formData.status === stage ? {
                      background: sc.bg,
                      borderColor: sc.color,
                      color: sc.color
                    } : {}}
                    onClick={() => setFormData({ ...formData, status: stage })}
                  >
                    <span className="aa-status-dot" style={{ background: sc.color }}></span>
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="aa-field">
            <label className="aa-label">Notes <span className="aa-optional">(optional)</span></label>
            <textarea
              className="aa-input aa-textarea"
              name="notes"
              placeholder="Any additional notes — interview date, contact name, salary range..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="aa-actions">
            <button type="submit" className="aa-submit-btn" disabled={loading}>
              {loading ? (
                <span className="aa-loading">
                  <span className="aa-spinner"></span>
                  Saving...
                </span>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Save application
                </>
              )}
            </button>
            <button type="button" className="aa-cancel-btn" onClick={onBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* ─── RIGHT PANEL — PREVIEW ─── */}
      <div className="aa-right">
        <div className="aa-preview-label">Live preview</div>

        {/* Card preview */}
        <div className="aa-preview-card" style={{ borderTop: `3px solid ${cfg?.color || '#e8e8e5'}` }}>
          <div className="aa-preview-top">
            <div className="aa-preview-icon" style={{ background: cfg?.bg, color: cfg?.color }}>
              {formData.companyName ? formData.companyName.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <div className="aa-preview-company">
                {formData.companyName || 'Company name'}
              </div>
              <div className="aa-preview-role">
                {formData.role || 'Role / Position'}
              </div>
            </div>
          </div>
          <div className="aa-preview-date">
            {formData.appliedDate
              ? new Date(formData.appliedDate).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Date applied'}
          </div>
          {formData.notes && (
            <div className="aa-preview-notes">{formData.notes}</div>
          )}
          <div className="aa-preview-footer">
            <span
              className="aa-preview-badge"
              style={{ background: cfg?.bg, color: cfg?.color, border: `1px solid ${cfg?.border}` }}
            >
              {formData.status}
            </span>
          </div>
        </div>

        {/* Tips */}
        <div className="aa-tips">
          <div className="aa-tips-title">💡 Tips</div>
          <div className="aa-tip-item">
            <span className="aa-tip-dot"></span>
            Add notes like interview date or contact name
          </div>
          <div className="aa-tip-item">
            <span className="aa-tip-dot"></span>
            Update the status as your application progresses
          </div>
          <div className="aa-tip-item">
            <span className="aa-tip-dot"></span>
            Your advisor can see your pipeline progress
          </div>
          <div className="aa-tip-item">
            <span className="aa-tip-dot"></span>
            Enable notifications to get updates from your advisor
          </div>
        </div>

        {/* Pipeline stages guide */}
        <div className="aa-stages-guide">
          <div className="aa-stages-title">Pipeline stages</div>
          {stages.map(stage => {
            const sc = stageConfig[stage];
            return (
              <div key={stage} className="aa-stage-item">
                <span className="aa-stage-dot" style={{ background: sc.color }}></span>
                <span
                  className="aa-stage-badge"
                  style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AddApplication;