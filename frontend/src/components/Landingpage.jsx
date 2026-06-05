// LandingPage.jsx - Public landing page for non-logged in users
import React from 'react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="lp">

      {/* ─── NAVBAR ─── */}
      <nav className="lp-nav">
        <div className="lp-brand">
          <div className="lp-brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span className="lp-brand-name">CareerMap</span>
        </div>
        <div className="lp-nav-links">
          <button className="lp-nav-link">Features</button>
          <button className="lp-nav-link">For Students</button>
          <button className="lp-nav-link">For Advisors</button>
          <button className="lp-nav-link">About</button>
        </div>
        <div className="lp-nav-btns">
          <button className="lp-btn-ghost" onClick={onGetStarted}>Sign in</button>
          <button className="lp-btn-dark" onClick={onGetStarted}>
            Get started free →
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-badge">
            <span className="lp-badge-dot"></span>
            Now with push notifications
          </div>
          <h1 className="lp-hero-title">
            Never lose track of an{' '}
            <span className="lp-accent">internship</span>{' '}again.
          </h1>
          <p className="lp-hero-sub">
            CareerMap helps students organise their internship applications through a clear pipeline — while giving career advisors full visibility to guide them every step of the way.
          </p>
          <div className="lp-hero-btns">
            <button className="lp-hero-btn-p" onClick={onGetStarted}>
              Start for free →
            </button>
            <button className="lp-hero-btn-s">See how it works</button>
          </div>
          <div className="lp-social-proof">
            <div className="lp-avatars">
              {['SK', 'EM', 'RP', 'AM', 'JW'].map((initials, i) => (
                <div
                  key={i}
                  className="lp-avatar"
                  style={{ background: ['#7c3aed','#0ea5e9','#16a34a','#ea580c','#db2777'][i] }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="lp-social-text">
              Trusted by <strong>1,000+ students</strong> at Auckland International Campus
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="lp-hero-visual">
          <div className="lp-main-card">
            <div className="lp-mc-header">
              <span className="lp-mc-title">My Application Pipeline</span>
              <span className="lp-mc-badge">10 applications</span>
            </div>
            <div className="lp-pipe-cols">
              {[
                { label: 'Applied', color: '#eff6ff', hdrBg: '#dbeafe', hdrColor: '#1d4ed8', apps: [{ co: 'Spark NZ', role: 'Frontend Dev' }, { co: 'Xero', role: 'Software Intern' }] },
                { label: 'Interview', color: '#fffbeb', hdrBg: '#fef3c7', hdrColor: '#92400e', apps: [{ co: 'Trade Me', role: 'React Dev' }] },
                { label: 'Offer', color: '#f0fdf4', hdrBg: '#dcfce7', hdrColor: '#166534', apps: [{ co: 'Google', role: 'SWE Intern' }] },
                { label: 'Rejected', color: '#fef2f2', hdrBg: '#fee2e2', hdrColor: '#991b1b', apps: [{ co: 'MYOB', role: 'QA Intern' }] },
              ].map((col, i) => (
                <div key={i} className="lp-pc" style={{ background: col.color }}>
                  <div className="lp-pc-hdr" style={{ background: col.hdrBg, color: col.hdrColor }}>{col.label}</div>
                  {col.apps.map((app, j) => (
                    <div key={j} className="lp-pc-card">
                      <div className="lp-pc-co">{app.co}</div>
                      <div className="lp-pc-role">{app.role}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          <div className="lp-float-card lp-fc1">
            <div className="lp-fc-icon" style={{ background: '#f0fdf4' }}>🎉</div>
            <div>
              <div className="lp-fc-title">Offer received!</div>
              <div className="lp-fc-sub">Google — SWE Intern</div>
            </div>
          </div>
          <div className="lp-float-card lp-fc2">
            <div className="lp-fc-icon" style={{ background: '#eff6ff' }}>📅</div>
            <div>
              <div className="lp-fc-title">Interview today</div>
              <div className="lp-fc-sub">Meta — 2:00 PM</div>
            </div>
          </div>
          <div className="lp-float-card lp-fc3">
            <div className="lp-fc-icon" style={{ background: '#faf5ff' }}>🔔</div>
            <div>
              <div className="lp-fc-title">Advisor message</div>
              <div className="lp-fc-sub">Good luck today!</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div className="lp-stats-bar">
        {[
          { num: '1,000+', label: 'Students using CareerMap' },
          { num: '12,000+', label: 'Applications tracked' },
          { num: '85%', label: 'Students land interviews' },
          { num: '50+', label: 'Career advisors onboard' },
        ].map((stat, i) => (
          <div key={i} className="lp-stat-item">
            <div className="lp-stat-num">{stat.num}</div>
            <div className="lp-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ─── FEATURES ─── */}
      <section className="lp-features">
        <div className="lp-section-label">Features</div>
        <div className="lp-section-title">Everything you need to land your internship</div>
        <div className="lp-section-sub">Built specifically for students who are serious about their career journey.</div>
        <div className="lp-feat-grid">
          {[
            { color: 'purple', icon: '📋', title: 'Pipeline tracking', desc: 'Visualise every application across Applied, Interview, Offer, Accepted and Rejected stages in a clean kanban view.' },
            { color: 'blue', icon: '🔔', title: 'Push notifications', desc: 'Get real-time alerts from your career advisor even when the app is closed, powered by Web Push API.' },
            { color: 'green', icon: '📡', title: 'Works offline', desc: 'Access your applications anywhere even without internet thanks to our built-in service worker caching.' },
            { color: 'orange', icon: '🔒', title: 'Secure authentication', desc: 'JWT-based login with bcrypt password hashing keeps your personal data safe and completely private.' },
            { color: 'pink', icon: '🎯', title: 'Opportunities board', desc: 'Career advisors post internship opportunities directly to the platform for students to browse and apply.' },
            { color: 'teal', icon: '👥', title: 'Advisor dashboard', desc: 'Advisors get a full overview of all student pipelines and can send push notifications to guide students.' },
          ].map((feat, i) => (
            <div key={i} className={`lp-feat-card lp-feat-${feat.color}`}>
              <div className={`lp-feat-icon lp-feat-icon-${feat.color}`}>{feat.icon}</div>
              <div className="lp-feat-t">{feat.title}</div>
              <div className="lp-feat-s">{feat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PIPELINE SHOWCASE ─── */}
      <section className="lp-pipeline-show">
        <div className="lp-ps-label">Pipeline view</div>
        <div className="lp-ps-title">See every stage at a glance</div>
        <div className="lp-ps-sub">Your applications organised across 5 clear stages so you always know what to do next.</div>
        <div className="lp-pipe-show">
          {[
            { label: 'Applied', cls: 'c1', apps: [{ co: 'Spark NZ', role: 'Frontend Dev Intern', date: '12 May 2026' }, { co: 'Xero', role: 'Software Intern', date: '14 May 2026' }] },
            { label: 'Interview', cls: 'c2', apps: [{ co: 'Trade Me', role: 'React Dev Intern', date: 'Interview: 28 May' }, { co: 'Pushpay', role: 'Full Stack Intern', date: 'Interview: 30 May' }] },
            { label: 'Offer', cls: 'c3', apps: [{ co: 'Google', role: 'SWE Intern', date: 'Offer received!' }] },
            { label: 'Accepted', cls: 'c4', apps: [{ co: 'Vend', role: 'Software Intern', date: 'Starts June 2026' }] },
            { label: 'Rejected', cls: 'c5', apps: [{ co: 'MYOB', role: 'QA Intern', date: '20 May 2026' }] },
          ].map((col, i) => (
            <div key={i} className={`lp-ps-col ${col.cls}`}>
              <div className="lp-ps-col-hdr">{col.label}</div>
              {col.apps.map((app, j) => (
                <div key={j} className="lp-ps-card">
                  <div className="lp-ps-card-co">{app.co}</div>
                  <div className="lp-ps-card-role">{app.role}</div>
                  <div className="lp-ps-card-date">{app.date}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROLES ─── */}
      <section className="lp-roles">
        <div className="lp-section-label">Two roles</div>
        <div className="lp-section-title">Built for students and advisors</div>
        <div className="lp-roles-grid">
          <div className="lp-role-card lp-role-student">
            <div className="lp-role-emoji">🎓</div>
            <div className="lp-role-title">For Students</div>
            <div className="lp-role-sub">Keep your entire job search organised in one place and never miss a follow-up again.</div>
            <div className="lp-role-list">
              {['Add and track internship applications', 'Move applications through the pipeline', 'Browse advisor-posted opportunities', 'Receive push notifications from advisor', 'Access your data offline anywhere'].map((item, i) => (
                <div key={i} className="lp-role-item">
                  <span className="lp-role-check lp-check-purple">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="lp-role-card lp-role-advisor">
            <div className="lp-role-emoji">👩‍💼</div>
            <div className="lp-role-title">For Career Advisors</div>
            <div className="lp-role-sub">Monitor your entire cohort at a glance and support students when they need it most.</div>
            <div className="lp-role-list">
              {['View all student pipelines in one dashboard', 'Post new internship opportunities', 'Send push notifications to students', 'Track application counts and stages', 'Identify students who need support'].map((item, i) => (
                <div key={i} className="lp-role-item">
                  <span className="lp-role-check lp-check-blue">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section className="lp-testimonial">
        <div className="lp-section-label">Testimonial</div>
        <div className="lp-test-quote">
          "CareerMap completely changed how I manage my internship search. I used to have applications scattered across 3 different apps and my email. Now everything is in one place and my advisor can actually see my progress."
        </div>
        <div className="lp-test-author">
          <div className="lp-test-av">SK</div>
          <div>
            <div className="lp-test-name">Satyam Kamboj</div>
            <div className="lp-test-role">2nd Year BIT Student — Auckland International Campus</div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="lp-cta">
        <div className="lp-cta-title">Ready to organise your internship search?</div>
        <div className="lp-cta-sub">Join 1,000+ students already using CareerMap to land their dream internships.</div>
        <button className="lp-cta-btn" onClick={onGetStarted}>Get started for free →</button>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">CareerMap</div>
        <div className="lp-footer-links">
          <span className="lp-footer-link">Features</span>
          <span className="lp-footer-link">About</span>
          <span className="lp-footer-link">Contact</span>
        </div>
        <div className="lp-footer-copy">Built by Satyam Kamboj — IA730001 Advanced Application Development 2026</div>
      </footer>

    </div>
  );
};

export default LandingPage;