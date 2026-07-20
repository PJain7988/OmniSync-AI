import React, { useState } from 'react';
import { Github, AlertTriangle, X } from 'lucide-react'; 

export default function VisitorBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 999999,
        background: '#1a1d21', // Dark background
        color: '#e5e7eb',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        width: '320px',
        border: '1px solid #333'
      }}
      className="glass-card visitor-banner"
    >
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={16} />
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)',
          color: '#eab308',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertTriangle size={16} />
        </div>
        <div>
          <h4 style={{ margin: 0, color: '#eab308', fontSize: '15px', fontWeight: 'bold' }}>
            Welcome Visitor,
          </h4>
        </div>
      </div>
      
      <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#9ca3af', margin: '0 0 16px 0' }}>
        To optimize AWS EC2 cloud costs for this heavy microservices project, the backend may be sleeping. If login fails, please review the architecture on GitHub.
      </p>

      <a
        href="https://github.com/PJain7988/OmniSync-AI"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: '#eab308',
          color: '#000',
          padding: '10px 16px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '13px',
          transition: 'opacity 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        <Github size={16} />
        View Source Code
      </a>
    </div>
  );
}
