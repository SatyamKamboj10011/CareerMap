// HomePage.jsx - Modern Bento Grid Home Dashboard
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { getUser } from '../services/Auth.js';

const HomePage = ({ onNavigate }) => {
  const user = getUser();
  const isAdvisor = user?.role === 'advisor';
  const [applications, setApplications] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchApplications();
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications');
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to load applications');
    }
  };

  const getCount = (status) => applications.filter(a => a.status === status).length;

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const recentApps = applications.slice(-3).reverse();

  return (
    <div className="hp-wrap">

      {/* ─── BENTO GRID ─── */}
      <div className="hp-bento">

        {/* B1 — Hero welcome card */}
        <div className="hp-b hp-b1">
          <div className="hp-b1-bg"></div>
          <div className="hp-b1-content">
            <div className="hp-b1-greeting">{greeting()},</div>
            <div className="hp-b1-name">{user?.name?.split(' ')[0]} 👋</div>
            <div className="hp-b1-sub">
              {isAdvisor
                ? 'Monitor your students and post new opportunities'
                : `You have ${applications.length} applications tracked`}
            </div>
            <div className="hp-b1-btns">
              <button
                className="hp-btn-p"
                onClick={() => onNavigate(isAdvisor ? 'advisor' : 'student')}
              >
                {isAdvisor ? 'View students' : 'My pipeline'}
                <span>→</span>
              </button>
              <button
                className="hp-btn-s"
                onClick={() => onNavigate(isAdvisor ? 'opportunities' : 'add')}
              >
                {isAdvisor ? 'Post opportunity' : 'Add application'}
              </button>
            </div>
          </div>
          {/* Decorative SVG */}
          <div className="hp-b1-deco">
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
              <circle cx="90" cy="90" r="80" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4"/>
              <circle cx="90" cy="90" r="55" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <circle cx="90" cy="90" r="30" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <text x="90" y="96" textAnchor="middle" fontSize="22" fill="rgba(255,255,255,0.6)">🎯</text>
              <circle cx="90" cy="10" r="4" fill="rgba(255,255,255,0.4)"/>
              <circle cx="170" cy="90" r="3" fill="rgba(255,255,255,0.3)"/>
              <circle cx="90" cy="170" r="4" fill="rgba(255,255,255,0.4)"/>
              <circle cx="10" cy="90" r="3" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </div>
        </div>

        {/* B2 — Applied stat */}
        <div className="hp-b hp-b2 hp-stat-card" onClick={() => onNavigate('student')}>
          <div className="hp-stat-icon" style={{ background: '#eff6ff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div className="hp-stat-num" style={{ color: '#2563eb' }}>{getCount('Applied')}</div>
          <div className="hp-stat-label">Applied</div>
          <div className="hp-stat-bar">
            <div className="hp-stat-bar-fill" style={{ width: `${Math.min(getCount('Applied') * 20, 100)}%`, background: '#2563eb' }}></div>
          </div>
        </div>

        {/* B3 — Interview stat */}
        <div className="hp-b hp-b3 hp-stat-card" onClick={() => onNavigate('student')}>
          <div className="hp-stat-icon" style={{ background: '#fffbeb' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="hp-stat-num" style={{ color: '#d97706' }}>{getCount('Interview')}</div>
          <div className="hp-stat-label">Interview</div>
          <div className="hp-stat-bar">
            <div className="hp-stat-bar-fill" style={{ width: `${Math.min(getCount('Interview') * 30, 100)}%`, background: '#d97706' }}></div>
          </div>
        </div>

        {/* B4 — Offer stat */}
        <div className="hp-b hp-b4 hp-stat-card" onClick={() => onNavigate('student')}>
          <div className="hp-stat-icon" style={{ background: '#f0fdf4' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="hp-stat-num" style={{ color: '#16a34a' }}>{getCount('Offer') + getCount('Accepted')}</div>
          <div className="hp-stat-label">Offers</div>
          <div className="hp-stat-bar">
            <div className="hp-stat-bar-fill" style={{ width: `${Math.min((getCount('Offer') + getCount('Accepted')) * 40, 100)}%`, background: '#16a34a' }}></div>
          </div>
        </div>

        {/* B5 — Recent applications */}
        <div className="hp-b hp-b5">
          <div className="hp-b-header">
            <div className="hp-b-title">Recent applications</div>
            <button className="hp-b-link" onClick={() => onNavigate('student')}>View all →</button>
          </div>
          {recentApps.length === 0 ? (
            <div className="hp-empty">
              <div className="hp-empty-icon">📋</div>
              <div className="hp-empty-txt">No applications yet</div>
              <button className="hp-empty-btn" onClick={() => onNavigate('add')}>Add your first →</button>
            </div>
          ) : (
            <div className="hp-app-list">
              {recentApps.map((app, i) => (
                <div key={i} className="hp-app-row">
                  <div className="hp-app-icon">
                    {app.companyName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hp-app-info">
                    <div className="hp-app-co">{app.companyName}</div>
                    <div className="hp-app-role">{app.role}</div>
                  </div>
                  <span className={`hp-app-badge hp-badge-${app.status?.toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* B6 — Quick actions */}
        <div className="hp-b hp-b6">
          <div className="hp-b-title" style={{ marginBottom: '14px' }}>Quick actions</div>
          <div className="hp-quick-grid">
            {[
              { icon: '➕', label: 'Add Application', sub: 'Track new internship', page: 'add', color: '#7c3aed', bg: '#faf5ff' },
              { icon: '🔍', label: 'Browse Jobs', sub: 'Find opportunities', page: 'opportunities', color: '#2563eb', bg: '#eff6ff' },
              { icon: '📊', label: 'My Pipeline', sub: 'View progress', page: 'student', color: '#16a34a', bg: '#f0fdf4' },
              { icon: '🔔', label: 'Notifications', sub: 'Check alerts', page: 'notifications', color: '#d97706', bg: '#fffbeb' },
            ].map((q, i) => (
              <button key={i} className="hp-quick-btn" onClick={() => onNavigate(q.page)}>
                <div className="hp-quick-icon" style={{ background: q.bg, color: q.color }}>{q.icon}</div>
                <div className="hp-quick-label">{q.label}</div>
                <div className="hp-quick-sub">{q.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* B7 — Activity feed */}
        <div className="hp-b hp-b7">
          <div className="hp-b-header">
            <div className="hp-b-title">Activity</div>
            <div className="hp-b-badge">Live</div>
          </div>
          <div className="hp-activity">
            {recentApps.length > 0 ? recentApps.map((app, i) => (
              <div key={i} className="hp-act-item">
                <div className={`hp-act-dot hp-dot-${app.status?.toLowerCase()}`}></div>
                <div className="hp-act-content">
                  <div className="hp-act-txt">
                    {app.status === 'Applied' && `Applied to ${app.companyName}`}
                    {app.status === 'Interview' && `Interview scheduled — ${app.companyName}`}
                    {app.status === 'Offer' && `Offer received from ${app.companyName}!`}
                    {app.status === 'Accepted' && `Accepted offer from ${app.companyName}!`}
                    {app.status === 'Rejected' && `Rejected by ${app.companyName}`}
                  </div>
                  <div className="hp-act-time">{app.role}</div>
                </div>
              </div>
            )) : (
              [
                { dot: 'applied', txt: 'Add applications to see activity', time: 'Get started →' },
              ].map((a, i) => (
                <div key={i} className="hp-act-item">
                  <div className={`hp-act-dot hp-dot-${a.dot}`}></div>
                  <div className="hp-act-content">
                    <div className="hp-act-txt">{a.txt}</div>
                    <div className="hp-act-time">{a.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* B8 — Pipeline progress */}
        <div className="hp-b hp-b8">
          <div className="hp-b-title" style={{ marginBottom: '14px' }}>Pipeline progress</div>
          {[
            { label: 'Applied', count: getCount('Applied'), total: Math.max(applications.length, 1), color: '#2563eb' },
            { label: 'Interview', count: getCount('Interview'), total: Math.max(applications.length, 1), color: '#d97706' },
            { label: 'Offer', count: getCount('Offer'), total: Math.max(applications.length, 1), color: '#16a34a' },
            { label: 'Rejected', count: getCount('Rejected'), total: Math.max(applications.length, 1), color: '#dc2626' },
          ].map((p, i) => (
            <div key={i} className="hp-prog-item">
              <div className="hp-prog-header">
                <span className="hp-prog-label">{p.label}</span>
                <span className="hp-prog-count">{p.count}</span>
              </div>
              <div className="hp-prog-track">
                <div
                  className="hp-prog-fill"
                  style={{
                    width: `${Math.round((p.count / p.total) * 100)}%`,
                    background: p.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* B9 — Advisor card or tips */}
        <div className="hp-b hp-b9">
          {isAdvisor ? (
            <>
              <div className="hp-b-title" style={{ marginBottom: '14px' }}>Advisor tools</div>
              <div className="hp-adv-tools">
                <button className="hp-adv-btn" onClick={() => onNavigate('advisor')}>
                  <span>👥</span> View all students
                </button>
                <button className="hp-adv-btn" onClick={() => onNavigate('opportunities')}>
                  <span>🎯</span> Post opportunity
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="hp-tip-icon">💡</div>
              <div className="hp-tip-title">Pro tip</div>
              <div className="hp-tip-txt">
                Update your application status regularly so your advisor can track your progress and send you timely guidance.
              </div>
              <button className="hp-tip-btn" onClick={() => onNavigate('student')}>
                Update now →
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default HomePage;