import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Error Boundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flex1: 1, height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', background: '#0a0d16', color: '#fff', padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', boxShadow: '0 8px 32px 0 rgba(239, 68, 68, 0.15)' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '20px' }}>
              <AlertTriangle size={36} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>An error occurred</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px', lineHeight: '1.5' }}>
              The module failed to render correctly. This could be due to a server connection failure or inconsistent API payload.
            </p>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', textAlign: 'left', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', color: '#f59e0b', marginBottom: '24px', maxHeight: '150px' }}>
              {this.state.error && this.state.error.toString()}
            </div>
            <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ width: '100%' }}>
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
