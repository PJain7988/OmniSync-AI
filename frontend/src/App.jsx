import React, { useState, useEffect } from 'react';

import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardOverview from './components/DashboardOverview';
import SocialAnalyzer from './components/SocialAnalyzer';
import CourtExtractor from './components/CourtExtractor';
import HealthcareAnalytics from './components/HealthcareAnalytics';
import SustainableFarming from './components/SustainableFarming';
import InventoryManager from './components/InventoryManager';
import InteriorDesigner from './components/InteriorDesigner';
import SupplyChainTracker from './components/SupplyChainTracker';
import MaternalMonitor from './components/MaternalMonitor';
import RoadHazardReporter from './components/RoadHazardReporter';
import SignLanguageTranslator from './components/SignLanguageTranslator';
import UserManager from './components/UserManager';

import LoginScreen from './components/LoginScreen';
import AICopilot from './components/AICopilot';
import NotificationHub from './components/NotificationHub';
import VisitorBanner from './components/VisitorBanner';

// Production: set VITE_API_URL in Render dashboard to https://your-backend.onrender.com/api
// Development: Vite proxies /api → localhost:5000 automatically (see vite.config.js)
const API_BASE = import.meta.env.VITE_API_URL || 'https://omnisync-ai.onrender.com/api/v1';

const DEFAULT_NOTIFICATIONS = [
  { id: 1, channel: 'push', message: 'OmniSync Security: New JWT session authorized.', time: 'Just now' },
  { id: 2, channel: 'whatsapp', message: 'Maternal Telemetry: Syncing vitals with Dr. Peterson.', time: '10 min ago' },
  { id: 3, channel: 'sms', message: 'Supplier Alert: Restocked SKU-101. Invoice signed.', time: '30 min ago' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbStatus, setDbStatus] = useState({ status: 'connecting', database: 'Connecting...' });

  const [copilotOpen, setCopilotOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);

  // Check login state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('omnisync_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Set theme
    const savedTheme = localStorage.getItem('omnisync_theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('omnisync_theme', nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  };

  const handleLogin = (loginDetails) => {
    setUser(loginDetails);
    localStorage.setItem('omnisync_user', JSON.stringify(loginDetails));
    triggerNotification('push', `Auth success: Welcome ${loginDetails.role.name} (${loginDetails.role.dept})`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('omnisync_user');
  };

  // Dispatch custom multi-channel notifications
  const triggerNotification = (channel, message) => {
    const newAlert = {
      id: Date.now(),
      channel,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newAlert, ...prev]);
    
    // Add visual toast popup
    setToasts(prev => [...prev, newAlert]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newAlert.id));
    }, 4000);

    // HTML5 native notification fallbacks (optional mock display)
    console.log(`[Notification Hub Alert] [${channel.toUpperCase()}] ${message}`);
  };

  const [chatbaseLoaded, setChatbaseLoaded] = useState(false);

  // Load backend telemetry status
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(() => setDbStatus({ status: 'error', database: 'Offline' }));
  }, []);

  // Load Chatbase Chatbot embed script
  useEffect(() => {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args) => target(prop, ...args);
        }
      });
    }

    const onLoad = function() {
      if (document.getElementById("4cFprWIbwnEWeyjcnzYWi")) {
        setChatbaseLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "4cFprWIbwnEWeyjcnzYWi";
      script.domain = "www.chatbase.co";
      script.onload = () => {
        setChatbaseLoaded(true);
      };
      script.onerror = () => {
        console.warn("Failed to load Chatbase script. Custom Copilot will serve as fallback.");
        setChatbaseLoaded(false);
      };
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Sync sidebar open state with Chatbase widget
  useEffect(() => {
    if (chatbaseLoaded && window.chatbase) {
      try {
        if (copilotOpen) {
          window.chatbase("open");
        } else {
          window.chatbase("close");
        }
      } catch (e) {
        console.error("Error toggling Chatbase widget:", e);
      }
    }
  }, [copilotOpen, chatbaseLoaded]);

  return (
    <>
      {!user ? (
        <LoginScreen onLogin={handleLogin} API_BASE={API_BASE} />
      ) : (
        <div className="app-container" style={{ display: 'flex', width: '100vw', overflowX: 'hidden' }}>
          {/* Sidebar Navigation */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            dbStatus={dbStatus} 
            user={user}
            onLogout={handleLogout}
            toggleCopilot={() => setCopilotOpen(!copilotOpen)}
            toggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
            hasNotifications={notifications.length > 0}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          {/* Main Panel Viewport */}
          <main className="main-content" style={{ flex: 1, padding: '30px', position: 'relative', overflowY: 'auto', maxHeight: '100vh', transition: 'margin-right 0.3s ease' }}>
            <ErrorBoundary>
              {activeTab === 'dashboard' && (
                <DashboardOverview setActiveTab={setActiveTab} />
              )}

              {activeTab === 'users' && user && user.role.id === 'admin' && (
                <UserManager API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'social-media' && (
                <SocialAnalyzer API_BASE={API_BASE} triggerAlert={triggerNotification} openCopilot={() => setCopilotOpen(true)} />
              )}

              {activeTab === 'court-order' && (
                <CourtExtractor API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'healthcare' && (
                <HealthcareAnalytics API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'farming' && (
                <SustainableFarming API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'retail' && (
                <InventoryManager API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'interior' && (
                <InteriorDesigner API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'supply-chain' && (
                <SupplyChainTracker API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'maternal' && (
                <MaternalMonitor API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'hazards' && (
                <RoadHazardReporter API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}

              {activeTab === 'sign-language' && (
                <SignLanguageTranslator API_BASE={API_BASE} triggerAlert={triggerNotification} />
              )}
            </ErrorBoundary>
          </main>

          {/* Persistent Floating Alert Hub */}
          {notificationsOpen && (
            <NotificationHub 
              notifications={notifications} 
              onClose={() => setNotificationsOpen(false)}
              onClear={() => setNotifications([])}
            />
          )}

          {/* Floating Toast alerts container */}
          <div className="toast-container" style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '350px',
            width: '100%',
            pointerEvents: 'none'
          }}>
            {toasts.map(t => (
              <div 
                key={t.id} 
                className="toast-message glass-card" 
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  borderLeft: '4px solid ' + (
                    t.channel === 'whatsapp' ? 'var(--accent-emerald)' : 
                    t.channel === 'sms' ? 'var(--accent-cyan)' :
                    t.channel === 'email' ? 'var(--accent-purple)' : 'var(--accent-blue)'
                  ),
                  background: 'var(--bg-secondary)',
                  boxShadow: 'var(--shadow-card)',
                  pointerEvents: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                    {t.channel} Notification
                  </span>
                  <button 
                    onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
                  >
                    ✕
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0 }}>{t.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Persistent Floating Chatbase Copilot Chatbot */}
      <AICopilot 
        activeTab={user ? activeTab : 'login'} 
        API_BASE={API_BASE} 
        isOpen={copilotOpen} 
        onClose={() => setCopilotOpen(false)} 
        chatbaseLoaded={chatbaseLoaded}
      />
      
      {/* Visitor Banner */}
      <VisitorBanner />
    </>
  );
}
