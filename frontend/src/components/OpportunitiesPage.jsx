// OpportunitiesPage.jsx - Students can browse opportunities posted by advisors
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await api.get('/api/opportunities');
      setOpportunities(res.data);
    } catch (err) {
      setError('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const filtered = opportunities.filter(opp =>
    opp.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    opp.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="opp-page">

      {/* Header */}
      <div className="opp-header">
        <div>
          <h2 className="opp-title">Opportunities</h2>
          <p className="opp-sub">Internship opportunities posted by your career advisor</p>
        </div>
        <div className="opp-search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="opp-search"
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Error */}
      {error && <div className="sd-msg sd-msg-err">⚠ {error}</div>}

      {/* Loading */}
      {loading && (
        <div className="opp-loading">
          <div className="opp-spinner"></div>
          Loading opportunities...
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="opp-empty">
          <div className="opp-empty-icon">🎯</div>
          <div className="opp-empty-title">
            {search ? 'No results found' : 'No opportunities yet'}
          </div>
          <div className="opp-empty-sub">
            {search
              ? 'Try a different search term'
              : 'Your career advisor will post internship opportunities here'}
          </div>
        </div>
      )}

      {/* Opportunities grid */}
      {!loading && filtered.length > 0 && (
        <div className="opp-grid">
          {filtered.map(opp => (
            <div key={opp._id} className="opp-card">
              <div className="opp-card-header">
                <div className="opp-card-icon">
                  {opp.companyName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="opp-card-company">{opp.companyName}</div>
                  <div className="opp-card-role">{opp.role}</div>
                </div>
                <span className="opp-card-badge">Active</span>
              </div>
              <div className="opp-card-desc">{opp.description}</div>
              <div className="opp-card-footer">
                <span className="opp-card-tag">🎓 Internship</span>
                <span className="opp-card-tag">📍 New Zealand</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;