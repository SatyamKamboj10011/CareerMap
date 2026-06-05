
import React from 'react';
import { getUser, logout } from '../services/Auth.js';

const Sidebar = ({ currentPage, onNavigate, onLogout }) => {
  const user = getUser();

  // Navigation items
  const navItems = [
    { id: 'home', icon: '⊞', label: 'Dashboard' },
    { id: 'student', icon: '📋', label: 'Applications' },
    { id: 'opportunities', icon: '🎯', label: 'Opportunities' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#8b5cf6"/>
            <path d="M2 17L12 22L22 17" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
            <path d="M2 12L12 17L22 12" stroke="#a78bfa" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <span className="logo-text">CareerMap</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {currentPage === item.id && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        {/* User info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role === 'advisor' ? 'Career Advisor' : 'Student'}</div>
          </div>
        </div>
        {/* Logout */}
        <button className="sidebar-logout" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;