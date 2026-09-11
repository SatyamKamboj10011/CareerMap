// App.jsx - Main Application with Sidebar Layout
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import HomePage from './components/HomePage.jsx';
import LandingPage from './components/LandingPage.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import AdvisorDashboard from './components/AdvisorDashboard.jsx';
import AddApplication from './components/AddApplication.jsx';
import NotificationsPage from './components/NotificationsPage.jsx';
import OpportunitiesPage from './components/OpportunitiesPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import './index.css';
import api from './services/api.js';
import { isAuthenticated, getUser, saveToken, saveUser } from './services/Auth.js';


const App = () => {
  const existingUser = isAuthenticated() ? getUser() : null;

  // Valid pages list
  const validPages = [
    'landing', 'home', 'student', 'advisor', 'add',
    'opportunities', 'notifications', 'profile',
    'settings', 'register', 'login', '404'
  ];

  // Navigate function that checks if page exists
  const navigate = (page) => {
    if (validPages.includes(page)) {
      setCurrentPage(page);
    } else {
      setCurrentPage('404');
    }
  };

  // Set initial page based on login state
  const getInitialPage = () => {
    if (!existingUser) return 'landing';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [isLoggedIn, setIsLoggedIn] = useState(!!existingUser);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  // Pages that show the sidebar
  const showSidebar = isLoggedIn && !['register', 'login', 'landing'].includes(currentPage);

  
useEffect(() => {
  // Handle Google OAuth callback
  // Google redirects to /auth/google/success?code=... (a short-lived one-time code,
  // never the JWT itself, so the token never sits in the URL/browser history)
  if (window.location.pathname === '/auth/google/success') {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      api.post('/api/auth/google/exchange', { code })
        .then(({ data }) => {
          saveToken(data.token);
          saveUser(data.user);
          setIsLoggedIn(true);
          setCurrentPage('home');
        })
        .catch(() => {
          setCurrentPage('login');
        })
        .finally(() => {
          // Clean URL either way
          window.history.replaceState({}, document.title, '/');
        });
    }
  }
}, []);


  return (
    <div className="app">

      {/* Landing page — no sidebar */}
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentPage('register')} />
      )}

      {/* Show sidebar when logged in */}
      {showSidebar && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {/* Main content area */}
      {currentPage !== 'landing' && (
        <div className={showSidebar ? 'main-with-sidebar' : 'main-full'}>

          {/* Header - only show when logged in */}
          {showSidebar && (
            <div className="top-bar">
              <div className="top-bar-left">
                <h2 className="page-title">
                  {currentPage === 'home' && 'Welcome Back 👋'}
                  {currentPage === 'student' && 'My Applications'}
                  {currentPage === 'advisor' && 'Advisor Dashboard'}
                  {currentPage === 'add' && 'Add Application'}
                  {currentPage === 'opportunities' && 'Opportunities'}
                  {currentPage === 'notifications' && 'Notifications'}
                  {currentPage === 'profile' && 'Profile'}
                  {currentPage === 'settings' && 'Settings'}
                </h2>
              </div>
              <div className="top-bar-right">
                <div className="top-bar-notification">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span className="notification-dot" />
                </div>
                <div className="top-bar-avatar">
                  {getUser()?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className={showSidebar ? 'page-content' : ''}>

            {/* Auth pages */}
            {currentPage === 'register' && (
              <Register onSwitchToLogin={() => setCurrentPage('login')} />
            )}
            {currentPage === 'login' && (
              <Login
                onSwitchToRegister={() => setCurrentPage('register')}
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            {/* Home page */}
            {currentPage === 'home' && (
              <HomePage onNavigate={setCurrentPage} />
            )}

            {/* Student dashboard */}
            {currentPage === 'student' && (
              <StudentDashboard
                onLogout={handleLogout}
                onAddApplication={() => setCurrentPage('add')}
              />
            )}

            {/* Add application */}
            {currentPage === 'add' && (
              <AddApplication
                onBack={() => setCurrentPage('student')}
                onApplicationAdded={() => setCurrentPage('student')}
              />
            )}

            {/* Advisor dashboard */}
            {currentPage === 'advisor' && (
              <AdvisorDashboard onLogout={handleLogout} />
            )}

{currentPage === 'opportunities' && (
  <OpportunitiesPage />
)}

            {/* Notifications page */}
            {currentPage === 'notifications' && (
  <NotificationsPage />
)}
          

               {/* // Replace profile coming soon */}
{currentPage === 'profile' && (
  <ProfilePage />
)}



            {/* Settings page */}
            {currentPage === 'settings' && (
              <div className="coming-soon">
                <div className="coming-soon-icon">⚙️</div>
                <h2>Settings</h2>
                <p>App settings and preferences</p>
              </div>
            )}

            {/* 404 Page */}
            {currentPage === '404' && (
              <div className="not-found">
                <div className="not-found-code">404</div>
                <h2>Page Not Found</h2>
                <p>Looks like you took a wrong turn somewhere.</p>
                <button
                  className="hero-btn-primary"
                  onClick={() => setCurrentPage('home')}
                >
                  Go Back Home →
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );

};

export default App;