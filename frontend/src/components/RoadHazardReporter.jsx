import React, { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Upload, Award, ShieldAlert, CheckCircle } from 'lucide-react';

export default function RoadHazardReporter({ API_BASE, triggerAlert }) {
  const [hazardList, setHazardList] = useState([]);
  const [newHazard, setNewHazard] = useState({ latitude: '', longitude: '', description: '', hazard_type: 'pothole' });
  const [hazardLoading, setHazardLoading] = useState(false);

  // Rewards and CV states
  const [rewardPoints, setRewardPoints] = useState(240);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cvAnalysis, setCvAnalysis] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const loadHazards = () => {
    fetch(`${API_BASE}/infrastructure/hazards`)
      .then(res => res.json())
      .then(data => setHazardList(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadHazards();
  }, [API_BASE]);

  const triggerSubmitHazard = async () => {
    setHazardLoading(true);
    try {
      const response = await fetch(`${API_BASE}/infrastructure/hazards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHazard)
      });
      if (response.ok) {
        triggerAlert('whatsapp', 'New hazard report successfully registered via citizen portal.');
        setNewHazard({ latitude: '', longitude: '', description: '', hazard_type: 'pothole' });
        loadHazards();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHazardLoading(false);
    }
  };

  const handleUpvoteHazard = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/infrastructure/hazards/${id}/votes`, { method: 'POST' });
      if (response.ok) {
        loadHazards();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateHazardStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/infrastructure/hazards/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setHazardList(prev => prev.map(x => x.id === id ? { ...x, status: data.report.status } : x));
        triggerAlert('push', `Hazard status updated to: ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simulate upload and CV detection
  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setUploadedImage(true);
      setCvAnalysis({
        confidence: 0.94,
        type: 'Pothole (Depth: ~12cm)',
        box: { x: 30, y: 25, w: 140, h: 90 }
      });
      setNewHazard(prev => ({
        ...prev,
        description: 'Auto-detected deep pothole via computer vision scanning.',
        latitude: '28.6141',
        longitude: '77.2093'
      }));
      setIsUploading(false);
      triggerAlert('push', 'CV Model: Identified severe road cavity (94% confidence).');
    }, 1200);
  };

  return (
    <section className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-amber)' }}>Civic Infrastructure Hazards</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>File infrastructure repair logs, upload pothole telemetry, and earn civic points.</p>
        </div>
        
        {/* Citizen reward points banner */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', margin: 0 }}>
          <Award size={18} style={{ color: 'var(--accent-amber)' }} />
          <span style={{ fontSize: '12px' }}>Your Civic Balance: <strong style={{ color: 'var(--accent-amber)' }}>{rewardPoints} pts</strong></span>
        </div>
      </div>
      
      <div className="grid-2">
        {/* Form & Upload */}
        <div className="glass-card">
          <h3>Submit New Hazard Report</h3>
          
          <div style={{ margin: '14px 0' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Computer Vision Image Scanner</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px' }} onClick={handleSimulatedUpload}>
                {isUploading ? 'Analyzing...' : '📷 Mock Upload & Scan'}
              </button>
            </div>
            
            {uploadedImage && cvAnalysis && (
              <div style={{ position: 'relative', marginTop: '10px', height: '140px', background: '#222', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                {/* SVG Visualizing bounding box overlay */}
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <rect x={cvAnalysis.box.x} y={cvAnalysis.box.y} width={cvAnalysis.box.w} height={cvAnalysis.box.h} fill="none" stroke="var(--accent-rose)" strokeWidth="3" />
                  <text x={cvAnalysis.box.x} y={cvAnalysis.box.y - 4} fill="var(--accent-rose)" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {cvAnalysis.type} [{Math.round(cvAnalysis.confidence * 100)}%]
                  </text>
                </svg>
                <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', color: 'var(--accent-emerald)' }}>
                  CV Bounding Box Active
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Hazard Type</label>
            <select className="form-control" value={newHazard.hazard_type} onChange={e => setNewHazard({ ...newHazard, hazard_type: e.target.value })}>
              <option value="pothole">Pothole</option>
              <option value="surface crack">Road Surface Crack</option>
              <option value="debris">Spilled Debris</option>
              <option value="traffic sign damage">Damaged Traffic Sign</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Latitude</label>
              <input type="text" className="form-control" placeholder="28.6139" value={newHazard.latitude} onChange={e => setNewHazard({ ...newHazard, latitude: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input type="text" className="form-control" placeholder="77.2090" value={newHazard.longitude} onChange={e => setNewHazard({ ...newHazard, longitude: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows="3" className="form-control" placeholder="Describe the hazard size/danger level..." value={newHazard.description} onChange={e => setNewHazard({ ...newHazard, description: e.target.value })} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={triggerSubmitHazard} disabled={hazardLoading}>
            {hazardLoading ? <RefreshCw className="spinner" size={16} /> : 'File Report'}
          </button>
        </div>

        {/* Hazard List & Resolution Timelines */}
        <div className="glass-card" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <h3>Active Reports Nearby</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {hazardList.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '14px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong>{item.hazard_type.toUpperCase()}</strong>
                  <span className={`badge ${item.severity === 'High' ? 'badge-danger' : (item.severity === 'Medium' ? 'badge-warning' : 'badge-info')}`}>{item.severity}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.description}</p>
                
                {/* Resolution Progress timeline stepper */}
                <div style={{ margin: '12px 0 6px 0', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Resolution Progress:</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>Reported</span>
                    <span style={{ color: item.status !== 'Reported' ? 'var(--accent-purple)' : 'var(--text-muted)' }}>Dispatched</span>
                    <span style={{ color: item.status === 'Fixed' ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>Repaired</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '12px' }}>
                  <span>Status: <strong style={{ color: 'var(--accent-cyan)' }}>{item.status}</strong></span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleUpvoteHazard(item.id)}>👍 {item.votes} Votes</button>
                    {item.status !== 'Fixed' && (
                      <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleUpdateHazardStatus(item.id, 'Fixed')}>Mark Repaired</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
