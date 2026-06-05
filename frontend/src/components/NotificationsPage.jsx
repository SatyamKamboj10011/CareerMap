// NotificationsPage.jsx - In-app notifications for students
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../services/Auth.js';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n =>
        axios.put(`http://localhost:5000/api/notifications/${n._id}/read`, {}, {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
      ));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="notif-wrap">

      {/* Header */}
      <div className="notif-header">
        <div>
          <h2 className="notif-title">Notifications</h2>
          <p className="notif-sub">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="notif-loading">
          <div className="notif-spinner"></div>
          Loading notifications...
        </div>
      )}

      {/* Empty state */}
      {!loading && notifications.length === 0 && (
        <div className="notif-empty">
          <div className="notif-empty-icon">🔔</div>
          <div className="notif-empty-title">No notifications yet</div>
          <div className="notif-empty-sub">
            Your career advisor will send you updates here
          </div>
        </div>
      )}

      {/* Notifications list */}
      {!loading && notifications.length > 0 && (
        <div className="notif-list">
          {notifications.map(notif => (
            <div
              key={notif._id}
              className={`notif-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => !notif.read && markAsRead(notif._id)}
            >
              <div className="notif-icon">🔔</div>
              <div className="notif-content">
                <div className="notif-item-title">{notif.title}</div>
                <div className="notif-item-body">{notif.body}</div>
                <div className="notif-item-time">{formatTime(notif.createdAt)}</div>
              </div>
              {!notif.read && <div className="notif-unread-dot"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;