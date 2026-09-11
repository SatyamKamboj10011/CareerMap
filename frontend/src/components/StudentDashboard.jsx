// StudentDashboard.jsx - Modern Student Dashboard
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { getUser } from '../services/Auth.js';

const StudentDashboard = ({ onLogout, onAddApplication }) => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [view, setView] = useState('pipeline'); // 'pipeline' or 'list'
  const [filterStatus, setFilterStatus] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  const user = getUser();
  const stages = ['Applied', 'Interview', 'Offer', 'Accepted', 'Rejected'];

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications');
      setApplications(response.data);
    } catch (err) {
      setError('Failed to load applications');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/applications/${id}`, { status: newStatus });
      fetchApplications();
      setMessage('Status updated!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/applications/${id}`);
      fetchApplications();
      setMessage('Application deleted!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError('Failed to delete application');
    } finally {
      setDeletingId(null);
    }
  };

  // VAPID helper
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  };

  const handleSubscribe = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setError('Push notifications not supported'); return;
      }
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { setError('Permission denied'); return; }
      const convertedKey = urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, applicationServerKey: convertedKey
      });
     await api.post('/api/subscribe', subscription);
      setMessage('Push notifications enabled!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed: ' + err.message);
    }
  };

  const getByStage = (stage) => applications.filter(a => a.status === stage);
  const getCount = (stage) => getByStage(stage).length;

  const stageConfig = {
    Applied:   { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', light: '#dbeafe' },
    Interview: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', light: '#fef3c7' },
    Offer:     { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', light: '#dcfce7' },
    Accepted:  { color: '#0891b2', bg: '#f0fdff', border: '#a5f3fc', light: '#cffafe' },
    Rejected:  { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', light: '#fee2e2' },
  };

  const filteredApps = filterStatus === 'All'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  return (
    <div className="sd-wrap">

      {/* ─── TOP STATS ─── */}
      <div className="sd-stats">
        {stages.map(stage => (
          <div
            key={stage}
            className="sd-stat"
            style={{
              borderTop: `3px solid ${stageConfig[stage].color}`,
              cursor: 'pointer'
            }}
            onClick={() => { setView('list'); setFilterStatus(stage); }}
          >
            <div className="sd-stat-num" style={{ color: stageConfig[stage].color }}>
              {getCount(stage)}
            </div>
            <div className="sd-stat-label">{stage}</div>
            <div className="sd-stat-sub">
              {getCount(stage) === 0 ? 'None yet' : `${Math.round((getCount(stage) / Math.max(applications.length, 1)) * 100)}%`}
            </div>
          </div>
        ))}
      </div>

      {/* ─── MESSAGES ─── */}
      {message && <div className="sd-msg sd-msg-ok">✓ {message}</div>}
      {error && <div className="sd-msg sd-msg-err">⚠ {error}</div>}

      {/* ─── TOOLBAR ─── */}
      <div className="sd-toolbar">
        <div className="sd-view-tabs">
          <button
            className={`sd-tab ${view === 'pipeline' ? 'active' : ''}`}
            onClick={() => setView('pipeline')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="12" rx="1"/>
            </svg>
            Pipeline
          </button>
          <button
            className={`sd-tab ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            List
          </button>
        </div>

        {view === 'list' && (
          <div className="sd-filter">
            {['All', ...stages].map(s => (
              <button
                key={s}
                className={`sd-filter-btn ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
                style={filterStatus === s && s !== 'All' ? {
                  background: stageConfig[s]?.bg,
                  color: stageConfig[s]?.color,
                  borderColor: stageConfig[s]?.border
                } : {}}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="sd-toolbar-right">
          <button className="sd-notify-btn" onClick={handleSubscribe}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Enable alerts
          </button>
          <button className="sd-add-btn" onClick={onAddApplication}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add application
          </button>
        </div>
      </div>

      {/* ─── PIPELINE VIEW ─── */}
      {view === 'pipeline' && (
        <div className="sd-pipeline">
          {stages.map(stage => {
            const cfg = stageConfig[stage];
            const apps = getByStage(stage);
            return (
              <div key={stage} className="sd-col">
                <div className="sd-col-header" style={{ borderBottom: `2px solid ${cfg.color}` }}>
                  <div className="sd-col-header-left">
                    <span className="sd-col-dot" style={{ background: cfg.color }}></span>
                    <span className="sd-col-title">{stage}</span>
                  </div>
                  <span className="sd-col-count" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                    {apps.length}
                  </span>
                </div>

                <div className="sd-col-cards">
                  {apps.length === 0 && (
                    <div className="sd-empty">
                      <div className="sd-empty-icon">📭</div>
                      <div className="sd-empty-txt">Nothing here</div>
                    </div>
                  )}
                  {apps.map(app => (
                    <div key={app._id} className="sd-card">
                      <div className="sd-card-top">
                        <div className="sd-card-icon" style={{ background: cfg.bg, color: cfg.color }}>
                          {app.companyName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="sd-card-info">
                          <div className="sd-card-co">{app.companyName}</div>
                          <div className="sd-card-role">{app.role}</div>
                        </div>
                      </div>
                      <div className="sd-card-date">
                        {new Date(app.appliedDate).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      {app.notes && (
                        <div className="sd-card-notes">{app.notes}</div>
                      )}
                      <div className="sd-card-actions">
                        <select
                          className="sd-select"
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          {stages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                          className="sd-delete-btn"
                          onClick={() => handleDelete(app._id)}
                          disabled={deletingId === app._id}
                        >
                          {deletingId === app._id ? '...' : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── LIST VIEW ─── */}
      {view === 'list' && (
        <div className="sd-list">
          {filteredApps.length === 0 ? (
            <div className="sd-list-empty">
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>No applications found</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Try a different filter or add a new application</div>
            </div>
          ) : (
            <table className="sd-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(app => {
                  const cfg = stageConfig[app.status] || stageConfig.Applied;
                  return (
                    <tr key={app._id}>
                      <td>
                        <div className="sd-table-co">
                          <div className="sd-table-icon" style={{ background: cfg.bg, color: cfg.color }}>
                            {app.companyName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="sd-table-name">{app.companyName}</span>
                        </div>
                      </td>
                      <td className="sd-table-role">{app.role}</td>
                      <td className="sd-table-date">
                        {new Date(app.appliedDate).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <span className="sd-table-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          {app.status}
                        </span>
                      </td>
                      <td className="sd-table-notes">{app.notes || '—'}</td>
                      <td>
                        <div className="sd-table-actions">
                          <select
                            className="sd-select-sm"
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          >
                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button
                            className="sd-delete-btn"
                            onClick={() => handleDelete(app._id)}
                            disabled={deletingId === app._id}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;