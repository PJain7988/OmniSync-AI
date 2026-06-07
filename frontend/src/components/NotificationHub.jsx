import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Send, Bell, PhoneCall } from 'lucide-react';

export default function NotificationHub({ notifications, onClose, onClear }) {
  const [activeChannel, setActiveChannel] = useState('all');
  const [dispatchData, setDispatchData] = useState({ channel: 'whatsapp', recipient: '+1 (555) 019-2834', message: 'OmniSync Emergency Alert: Low soil moisture in sector 4B!' });

  const filtered = notifications.filter(n => {
    if (activeChannel === 'all') return true;
    return n.channel === activeChannel;
  });

  const handleManualDispatch = () => {
    if (!dispatchData.message) return;
    alert(`Notification Dispatched via ${dispatchData.channel.toUpperCase()} to ${dispatchData.recipient || 'all registered users'}`);
    setDispatchData(prev => ({ ...prev, message: '' }));
  };

  return (
    <div className="glass-card" style={{
      position: 'fixed',
      bottom: '80px',
      left: '260px',
      width: '380px',
      maxHeight: '450px',
      zIndex: 890,
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      background: 'var(--bg-secondary)',
      backdropFilter: 'blur(20px)',
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} className="neon-pulse" style={{ color: 'var(--accent-cyan)' }} />
          <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Multi-Channel Notification Hub</strong>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }} onClick={onClose}>Hide</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {['all', 'push', 'email', 'sms', 'whatsapp'].map(ch => (
          <button 
            key={ch} 
            onClick={() => setActiveChannel(ch)}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              borderRadius: '12px',
              background: activeChannel === ch ? 'var(--glass-hover)' : 'var(--bg-primary)',
              border: '1px solid ' + (activeChannel === ch ? 'var(--accent-cyan)' : 'var(--glass-border)'),
              color: activeChannel === ch ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', maxHeight: '180px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            No alerts logged.
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} style={{
              padding: '8px 12px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '6px',
              fontSize: '11px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {item.channel === 'whatsapp' && <MessageCircle size={10} style={{ color: 'var(--accent-emerald)' }} />}
                  {item.channel === 'email' && <Mail size={10} />}
                  {item.channel === 'sms' && <Send size={10} />}
                  {item.channel === 'push' && <Bell size={10} />}
                  {item.channel.toUpperCase()}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{item.time}</span>
              </div>
              <div style={{ color: 'var(--text-primary)' }}>{item.message}</div>
            </div>
          ))
        )}
      </div>

      {/* Dispatcher Sandbox */}
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Alert Dispatcher Sandbox</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '6px', marginBottom: '6px' }}>
          <select 
            className="form-control"
            style={{ padding: '6px', fontSize: '11px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
            value={dispatchData.channel}
            onChange={e => setDispatchData({ ...dispatchData, channel: e.target.value })}
          >
            <option value="whatsapp" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>WhatsApp</option>
            <option value="sms" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>SMS</option>
            <option value="email" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Email</option>
            <option value="push" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Push Alert</option>
          </select>
          <input 
            type="text" 
            placeholder="Recipient / ID" 
            className="form-control"
            style={{ padding: '6px', fontSize: '11px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
            value={dispatchData.recipient}
            onChange={e => setDispatchData({ ...dispatchData, recipient: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input 
            type="text" 
            placeholder="Notification message..." 
            className="form-control"
            style={{ flex: 1, padding: '6px', fontSize: '11px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
            value={dispatchData.message}
            onChange={e => setDispatchData({ ...dispatchData, message: e.target.value })}
          />
          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={handleManualDispatch}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
