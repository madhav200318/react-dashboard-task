// App.js
import React, { useState } from 'react';
import LoginPage from './LoginPage.js';
import DashboardPage from './DashboardPage.js';
// No specific CSS file for App.js as its styling is minimal and handled by global/component CSS

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const userId = localStorage.getItem('user_id');
    return userId ? 'dashboard' : 'login';
  });

  const [userId, setUserId] = useState(localStorage.getItem('user_id') || '');

  const handleLoginSuccess = (id) => {
    setUserId(id);
    localStorage.setItem('user_id', id);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserId('');
    localStorage.removeItem('user_id');
    setCurrentView('login');
  };

  return (
    <div className="app-container">
      {currentView === 'login' ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DashboardPage userId={userId} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
