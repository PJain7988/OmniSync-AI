import React from 'react';
import {
  Share2, Shield, Heart, Sprout, ShoppingCart, Home, Link2, Activity, MapPin, MessageSquare,
  LogOut, Bell, Sparkles, UserCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, dbStatus, user, onLogout, toggleCopilot, toggleNotifications, hasNotifications, theme, toggleTheme }) {
  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between' }}>
      <div>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-icon" style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            color: '#000',
            fontSize: '18px',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
          }}>O</div>
          <span className="logo-text" style={{ fontSize: '18px', fontWeight: '700' }}>OmniSync AI</span>
        </div>

        {/* User Identity Profile Card */}
        {user && (
          <div style={{
            padding: '12px 16px',
            margin: '12px 14px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            fontSize: '12px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--accent-cyan)' }}>
              <UserCheck size={14} />
              <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.role.name}</strong>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '2px' }}>{user.role.dept}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              Scope: {user.role.scope}
            </div>
          </div>
        )}

        <nav className="sidebar-menu" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
          <div className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Home size={18} /> Operations Hub
          </div>
          {user && user.role.id === 'admin' && (
            <div className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')} style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
              <UserCheck size={18} style={{ color: 'var(--accent-cyan)' }} /> User Provisioner
            </div>
          )}
          <div className={`menu-item ${activeTab === 'social-media' ? 'active' : ''}`} onClick={() => setActiveTab('social-media')}>
            <Share2 size={18} /> Public Sentiment Monitor
          </div>
          <div className={`menu-item ${activeTab === 'court-order' ? 'active' : ''}`} onClick={() => setActiveTab('court-order')}>
            <Shield size={18} /> Judicial Records Engine
          </div>
          <div className={`menu-item ${activeTab === 'healthcare' ? 'active' : ''}`} onClick={() => setActiveTab('healthcare')}>
            <Activity size={18} /> Cardiometabolic Analytics
          </div>
          <div className={`menu-item ${activeTab === 'farming' ? 'active' : ''}`} onClick={() => setActiveTab('farming')}>
            <Sprout size={18} /> Agronomic Resource Planner
          </div>
          <div className={`menu-item ${activeTab === 'retail' ? 'active' : ''}`} onClick={() => setActiveTab('retail')}>
            <ShoppingCart size={18} /> Warehouse Stock Controller
          </div>
          <div className={`menu-item ${activeTab === 'interior' ? 'active' : ''}`} onClick={() => setActiveTab('interior')}>
            <Home size={18} /> Facility Spatial Modeler
          </div>
          <div className={`menu-item ${activeTab === 'supply-chain' ? 'active' : ''}`} onClick={() => setActiveTab('supply-chain')}>
            <Link2 size={18} /> Logistics Blockchain Ledger
          </div>
          <div className={`menu-item ${activeTab === 'maternal' ? 'active' : ''}`} onClick={() => setActiveTab('maternal')}>
            <Heart size={18} /> Patient Vitals Telemetry
          </div>
          <div className={`menu-item ${activeTab === 'hazards' ? 'active' : ''}`} onClick={() => setActiveTab('hazards')}>
            <MapPin size={18} /> Civic Infrastructure Hazards
          </div>
          <div className={`menu-item ${activeTab === 'sign-language' ? 'active' : ''}`} onClick={() => setActiveTab('sign-language')}>
            <MessageSquare size={18} /> Accessibility Gestures
          </div>
        </nav>
      </div>

      <div className="sidebar-footer" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--glass-border)' }}>
        {/* Floating Utilities Shortcuts */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={toggleCopilot} 
            className="btn btn-secondary" 
            style={{ flex: 1, padding: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            <Sparkles size={12} style={{ color: 'var(--accent-purple)' }} /> Copilot
          </button>
          <button 
            onClick={toggleNotifications} 
            className="btn btn-secondary" 
            style={{ flex: 1, padding: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', position: 'relative' }}
          >
            <Bell size={12} style={{ color: 'var(--accent-cyan)' }} /> Alerts
            {hasNotifications && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-rose)',
                boxShadow: '0 0 6px var(--accent-rose)'
              }} />
            )}
          </button>
        </div>

        <div className="db-status" style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', width: '100%', fontSize: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={`status-indicator ${dbStatus.database === 'Offline' ? 'fallback' : 'online'}`} />
            <span style={{ color: 'var(--text-secondary)' }}>DB: {dbStatus.database || 'Connecting...'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <button 
              onClick={toggleTheme} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '12px' }}
              title="Toggle Theme Mode"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {user && (
              <button 
                onClick={onLogout} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                title="Logout"
              >
                <LogOut size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
