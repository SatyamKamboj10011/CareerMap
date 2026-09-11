// AdvisorDashboard.jsx - Modern Career Advisor Dashboard
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { getUser } from '../services/Auth.js';

const AdvisorDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [newOpportunity, setNewOpportunity] = useState({ companyName: '', role: '', description: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [notifyingId, setNotifyingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [notifMessages, setNotifMessages] = useState({});
const [notifTitle, setNotifTitle] = useState('');
  const user = getUser();

  useEffect(() => { fetchStudents(); fetchOpportunities(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/api/opportunities/students');
      setStudents(res.data);
    } catch { setError('Failed to load students'); }
  };

  const fetchOpportunities = async () => {
    try {
      const res = await api.get('/api/opportunities');
      setOpportunities(res.data);
    } catch { setError('Failed to load opportunities'); }
  };

  const handlePostOpportunity = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/opportunities', newOpportunity);
      setMessage('Opportunity posted successfully!');
      setShowForm(false);
      setNewOpportunity({ companyName: '', role: '', description: '' });
      fetchOpportunities();
      setTimeout(() => setMessage(''), 3000);
    } catch { setError('Failed to post opportunity'); }
  };

  const handleSendNotification = async (student) => {
  setNotifyingId(student._id);
  try {
    await api.post('/api/notify', {
      title: 'Message from your Career Advisor',
      body: notifMessages[student._id] || `Hi ${student.name}, please check your CareerMap dashboard for updates!`,
      studentId: student._id
    });
    setMessage(`Notification sent to ${student.name}!`);
    setNotifMessages({ ...notifMessages, [student._id]: '' });// Clear input after sending
    setTimeout(() => setMessage(''), 3000);
  } catch (err) {
    console.error('Notify error:', err);
    setError('Failed to send notification');
  } finally {
    setNotifyingId(null);
  }
};

  const handleDeleteOpportunity = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/opportunities/${id}`);
      setMessage('Opportunity deleted!');
      fetchOpportunities();
      setTimeout(() => setMessage(''), 2000);
    } catch { setError('Failed to delete opportunity'); }
    finally { setDeletingId(null); }
  };

  const getStatusConfig = (status) => {
    const map = {
      Applied:   { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
      Interview: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
      Offer:     { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
      Accepted:  { bg: '#f0fdff', color: '#0e7490', border: '#a5f3fc' },
      Rejected:  { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
    };
    return map[status] || { bg: '#f5f5f3', color: '#666', border: '#e0e0de' };
  };

  const totalApps = students.reduce((sum, s) => sum + (s.applicationCount || 0), 0);
  const interviews = students.filter(s => s.latestStatus === 'Interview').length;
  const offers = students.filter(s => s.latestStatus === 'Offer' || s.latestStatus === 'Accepted').length;

  return (
    <div className="adv-wrap">

      {/* ─── STATS ─── */}
      <div className="adv-stats">
        {[
          { num: students.length, label: 'Total Students', icon: '👥', color: '#7c3aed', bg: '#faf5ff' },
          { num: totalApps, label: 'Total Applications', icon: '📋', color: '#2563eb', bg: '#eff6ff' },
          { num: interviews, label: 'In Interview', icon: '📅', color: '#d97706', bg: '#fffbeb' },
          { num: offers, label: 'Offers & Accepted', icon: '🎉', color: '#16a34a', bg: '#f0fdf4' },
          { num: opportunities.length, label: 'Opportunities', icon: '🎯', color: '#0891b2', bg: '#f0fdff' },
        ].map((s, i) => (
          <div key={i} className="adv-stat">
            <div className="adv-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="adv-stat-num" style={{ color: s.color }}>{s.num}</div>
            <div className="adv-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── MESSAGES ─── */}
      {message && <div className="adv-msg adv-msg-ok">✓ {message}</div>}
      {error && <div className="adv-msg adv-msg-err">⚠ {error}</div>}

      {/* ─── TABS + ACTIONS ─── */}
      <div className="adv-toolbar">
        <div className="adv-tabs">
          <button
            className={`adv-tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Students
            <span className="adv-tab-count">{students.length}</span>
          </button>
          <button
            className={`adv-tab ${activeTab === 'opportunities' ? 'active' : ''}`}
            onClick={() => setActiveTab('opportunities')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Opportunities
            <span className="adv-tab-count">{opportunities.length}</span>
          </button>
        </div>

        {activeTab === 'opportunities' && (
          <button
            className="adv-post-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Post opportunity
              </>
            )}
          </button>
        )}
      </div>

      {/* ─── POST OPPORTUNITY FORM ─── */}
      {showForm && activeTab === 'opportunities' && (
        <div className="adv-form-card">
          <div className="adv-form-header">
            <div className="adv-form-title">Post new internship opportunity</div>
            <div className="adv-form-sub">Students will be able to see and apply for this opportunity</div>
          </div>
          <form onSubmit={handlePostOpportunity} className="adv-form">
            <div className="adv-form-row">
              <div className="adv-form-field">
                <label className="adv-form-label">Company name</label>
                <input
                  className="adv-form-input"
                  type="text"
                  name="companyName"
                  placeholder="e.g. Xero"
                  value={newOpportunity.companyName}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="adv-form-field">
                <label className="adv-form-label">Role</label>
                <input
                  className="adv-form-input"
                  type="text"
                  name="role"
                  placeholder="e.g. Frontend Intern"
                  value={newOpportunity.role}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, role: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="adv-form-field">
              <label className="adv-form-label">Description</label>
              <textarea
                className="adv-form-input adv-form-textarea"
                name="description"
                placeholder="Job description, requirements, and any other details..."
                value={newOpportunity.description}
                onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                required
              />
            </div>
            <div className="adv-form-actions">
              <button type="submit" className="adv-submit-btn">
                Post opportunity
              </button>
              <button type="button" className="adv-cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── STUDENTS TAB ─── */}
      {activeTab === 'students' && (
        <div className="adv-table-wrap">
          {students.length === 0 ? (
            <div className="adv-empty">
              <div className="adv-empty-icon">👥</div>
              <div className="adv-empty-title">No students yet</div>
              <div className="adv-empty-sub">Students will appear here once they register</div>
            </div>
          ) : (
            <table className="adv-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Applications</th>
                  <th>Latest status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => {
                  const cfg = getStatusConfig(student.latestStatus);
                  return (
                    <tr key={student._id}>
                      <td>
                        <div className="adv-student-info">
                          <div className="adv-student-avatar">
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="adv-student-name">{student.name}</div>
                            <div className="adv-student-sub">Student</div>
                          </div>
                        </div>
                      </td>
                      <td className="adv-table-email">{student.email}</td>
                      <td>
                        <div className="adv-table-apps">
                          <span className="adv-apps-num">{student.applicationCount || 0}</span>
                          <span className="adv-apps-label">apps</span>
                        </div>
                      </td>
                      <td>
                        {student.latestStatus ? (
                          <span
                            className="adv-status-badge"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                          >
                            {student.latestStatus}
                          </span>
                        ) : (
                          <span className="adv-status-none">No applications</span>
                        )}
                      </td>
                      <td>
  <div className="adv-notify-wrap">
    <input
  className="adv-notify-input"
  placeholder="Type message..."
  value={notifMessages[student._id] || ''}
  onChange={(e) => setNotifMessages({ 
    ...notifMessages, 
    [student._id]: e.target.value 
  })}
/>
    <button
      className="adv-notify-btn"
      onClick={() => handleSendNotification(student)}
      disabled={notifyingId === student._id}
    >
      {notifyingId === student._id ? (
        <span className="adv-btn-spinner"></span>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      )}
      {notifyingId === student._id ? 'Sending...' : 'Notify'}
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

      {/* ─── OPPORTUNITIES TAB ─── */}
      {activeTab === 'opportunities' && (
        <div className="adv-opp-grid">
          {opportunities.length === 0 && !showForm ? (
            <div className="adv-empty">
              <div className="adv-empty-icon">🎯</div>
              <div className="adv-empty-title">No opportunities posted</div>
              <div className="adv-empty-sub">Click "Post opportunity" to add your first internship listing</div>
              <button className="adv-post-btn" onClick={() => setShowForm(true)}>
                + Post opportunity
              </button>
            </div>
          ) : (
            opportunities.map(opp => (
              <div key={opp._id} className="adv-opp-card">
                <div className="adv-opp-header">
                  <div className="adv-opp-icon">
                    {opp.companyName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="adv-opp-company">{opp.companyName}</div>
                    <div className="adv-opp-role">{opp.role}</div>
                  </div>
                  <span className="adv-opp-active">Active</span>
                </div>
                <div className="adv-opp-desc">{opp.description}</div>
                <button
                  className="adv-opp-delete"
                  onClick={() => handleDeleteOpportunity(opp._id)}
                  disabled={deletingId === opp._id}
                >
                  {deletingId === opp._id ? 'Deleting...' : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default AdvisorDashboard;