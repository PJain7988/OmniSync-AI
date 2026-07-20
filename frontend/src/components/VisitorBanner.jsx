import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react'; 

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
        Our backend may temporarily sleep to optimize cloud resources. If you experience delays, please review our architecture on GitHub.
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17 0-1.5-.5-2.73-1.3-3.7.13-.32.6-1.75-.13-3.64 0 0-1-.32-3.3 1.2a11.5 11.5 0 0 0-6 0C7.5 4.14 6.5 4.46 6.5 4.46c-.73 1.89-.26 3.32-.13 3.64-.8.97-1.3 2.2-1.3 3.7 0 5.77 3.35 6.79 6.5 7.17a4.8 4.8 0 0 0-1 3.03v4" />
        </svg>
        View Source Code
      </a>
    </div>
  );
}
