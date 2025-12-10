import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { ViewMode } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.LANDING);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session (Simulated)
  useEffect(() => {
    const session = localStorage.getItem('drewverse_session');
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('drewverse_session', 'true');
    setCurrentView(ViewMode.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('drewverse_session');
    setCurrentView(ViewMode.LANDING);
  };

  const navigateTo = (mode: ViewMode) => {
    if (mode === ViewMode.DASHBOARD && !isAuthenticated) {
        setCurrentView(ViewMode.LOGIN);
    } else {
        setCurrentView(mode);
    }
  };

  return (
    <div className="antialiased text-gray-900">
      {currentView === ViewMode.LANDING && (
        <LandingPage onNavigate={navigateTo} />
      )}
      
      {currentView === ViewMode.LOGIN && (
        <Auth 
          onLogin={handleLogin} 
          onBack={() => setCurrentView(ViewMode.LANDING)} 
        />
      )}

      {currentView === ViewMode.DASHBOARD && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;