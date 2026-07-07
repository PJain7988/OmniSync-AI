import React, { useState } from 'react';
import { RefreshCw, MapPin, Link2, AlertTriangle, UserCheck, ShieldCheck } from 'lucide-react';

export default function SupplyChainTracker({ API_BASE, triggerAlert }) {
  const [productId, setProductId] = useState('PROD-9824');
  const [chainSteps, setChainSteps] = useState([]);
  const [chainLoading, setChainLoading] = useState(false);
  const [newStep, setNewStep] = useState({ step_name: 'Manufactured', handler: 'Alpha Assembly Corp', location: 'California, USA' });

  // Ownership transfer states
  const [ownerTransfer, setOwnerTransfer] = useState({ newOwner: 'Gamma Global Retailers', sigKey: 'secp256k1_sig_98239824...' });
  const [fraudAlerts, setFraudAlerts] = useState(false);

  const triggerTrackProduct = async () => {
    if (!productId) return;
    setChainLoading(true);
    try {
      const response = await fetch(`${API_BASE}/logistics/shipments/${productId}`);
      const data = await response.json();
      setChainSteps(data);
      triggerAlert('push', `Logistics fetched for Blockchain Block ${productId}.`);
      
      // Calculate random fraud state simulation
      setFraudAlerts(Math.random() > 0.6);
    } catch (e) {
      console.error(e);
    } finally {
      setChainLoading(false);
    }
  };

  const handleRegisterSupplyStep = async () => {
    if (!productId || !newStep.step_name) return;
    try {
      const response = await fetch(`${API_BASE}/logistics/shipments/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, ...newStep })
      });
      const data = await response.json();
      if (data.success) {
        setChainSteps(prev => [...prev, data.step].sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)));
        setNewStep({ step_name: 'Packaged', handler: 'Beta Logistics', location: 'New York, USA' });
        triggerAlert('push', `New Block mined: ${newStep.step_name}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTransferOwnership = () => {
    if (!ownerTransfer.newOwner) return;
    triggerAlert('whatsapp', `Blockchain Transfer: Custody of ${productId} signed over to ${ownerTransfer.newOwner}.`);
    alert(`Ownership Transferred cryptographically. Handoff block signed using key ${ownerTransfer.sigKey.slice(0, 10)}...`);
    setOwnerTransfer({ newOwner: '', sigKey: 'secp256k1_sig_' + Math.random().toString(16).slice(2, 12) });
  };

  return (
    <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-cyan)' }}>Logistics Blockchain Ledger</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Trace product custody chains, verify cryptographic signatures, and track shipment routes.</p>
        </div>
      </div>
      
      <div className="form-group">
        <label>Search Product Ledger by Blockchain ID</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="e.g. PROD-9824"
            className="form-control"
            style={{ flex: 1 }}
            value={productId}
            onChange={e => setProductId(e.target.value)}
          />
          <button className="btn btn-primary" onClick={triggerTrackProduct} disabled={chainLoading}>
            {chainLoading ? <RefreshCw className="spinner" size={16} /> : 'Fetch Ledger Logs'}
          </button>
        </div>
      </div>

      {chainSteps.length > 0 && (
        <div className="grid-2" style={{ textAlign: 'left' }}>
          {/* Timeline Nodes & Map */}
          <div>
            <h3 style={{ marginBottom: '14px', fontSize: '16px' }}>On-Chain Shipment Map & Journey</h3>
            
            {/* SVG Supply chain journey path */}
            <div style={{ height: '90px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: '16px', position: 'relative' }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                <path d="M 40 45 Q 120 15 200 45 T 360 45" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              <div style={{ textAlign: 'center', zIndex: 1 }}><MapPin size={16} style={{ color: 'var(--accent-cyan)' }} /><div style={{ fontSize: '10px' }}>Factory</div></div>
              <div style={{ textAlign: 'center', zIndex: 1 }}><MapPin size={16} style={{ color: 'var(--accent-purple)' }} /><div style={{ fontSize: '10px' }}>Logistics</div></div>
              <div style={{ textAlign: 'center', zIndex: 1 }}><MapPin size={16} style={{ color: 'var(--accent-emerald)' }} /><div style={{ fontSize: '10px' }}>Port</div></div>
              <div style={{ textAlign: 'center', zIndex: 1 }}><MapPin size={16} style={{ color: 'var(--accent-rose)' }} /><div style={{ fontSize: '10px' }}>Retail</div></div>
            </div>

            {/* Timeline lists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
              {chainSteps.map((step, i) => (
                <div key={i} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.01)', borderLeft: '3px solid var(--accent-cyan)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <strong>{step.step_name}</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(step.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Custodian: {step.handler} | Location: {step.location}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification & Transfer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px' }}>Fraud Detection & Cryptographic Handoff</h3>

            {/* Fraud alert card */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid ' + (fraudAlerts ? 'var(--accent-rose)' : 'var(--accent-emerald)'),
              background: fraudAlerts ? 'rgba(244,63,94,0.04)' : 'rgba(16,185,129,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {fraudAlerts ? (
                <>
                  <AlertTriangle style={{ color: 'var(--accent-rose)' }} />
                  <div>
                    <strong style={{ color: 'var(--accent-rose)', fontSize: '13px' }}>Anomaly Warning!</strong>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Seal integrity validation mismatch in block transaction log.</p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck style={{ color: 'var(--accent-emerald)' }} />
                  <div>
                    <strong style={{ color: 'var(--accent-emerald)', fontSize: '13px' }}>Blockchain Secure</strong>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>All cryptographic signature chains and seal temperatures verified.</p>
                  </div>
                </>
              )}
            </div>

            {/* QR Scanner Placeholder */}
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '50px', height: '50px', background: '#fff', display: 'flex', padding: '4px' }}>
                {/* Simulated QR Code grids */}
                <div style={{ width: '100%', height: '100%', border: '4px solid #000', background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 10px 10px' }} />
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700' }}>QR Code Ledger Verification</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Scan cargo label code to verify blocks on mobile devices.</p>
              </div>
            </div>

            {/* Custody Handoff Form */}
            <div className="glass-card" style={{ padding: '14px' }}>
              <h4 style={{ fontSize: '13px', marginBottom: '8px' }}>Transfer Custody Handoff</h4>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Next Custodian</label>
                <input type="text" className="form-control" style={{ padding: '6px', fontSize: '12px' }} value={ownerTransfer.newOwner} onChange={e => setOwnerTransfer({ ...ownerTransfer, newOwner: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '10px' }}>Signing Token Key</label>
                <input type="text" className="form-control" style={{ padding: '6px', fontSize: '12px', fontFamily: 'monospace' }} value={ownerTransfer.sigKey} readOnly />
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={handleTransferOwnership}>
                Sign & Authorize Handoff
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
