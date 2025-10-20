import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/species', label: 'Species', icon: '🦁' },
    { path: '/sightings', label: 'Sightings', icon: '👁️' },
    { path: '/incidents', label: 'Incidents', icon: '⚠️' },
    { path: '/reports', label: 'Reports', icon: '📈' }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="glass rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">🌍 Wildlife Monitoring</h1>
              <p className="text-white/70">Biodiversity Conservation System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-white/60 text-sm">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="glass-button text-white px-6 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="glass rounded-2xl p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`glass-button px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                  location.pathname === item.path
                    ? 'bg-white/30 shadow-lg'
                    : ''
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;