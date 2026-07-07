import React, { useState, useEffect } from 'react';
import { RefreshCw, Heart, Activity, ShieldCheck, Mail, Send, AlertTriangle } from 'lucide-react';

export default function MaternalMonitor({ API_BASE, triggerAlert }) {
  const [vitalsData, setVitalsData] = useState({ heart_rate: 80, spo2: 98, blood_pressure_systolic: 120, blood_pressure_diastolic: 80, temperature: 36.6, gestational_week: 22 });
  const [maternalAssessment, setMaternalAssessment] = useState(null);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [kickData, setKickData] = useState({ kicks: 10, duration_minutes: 60 });
  const [kickResult, setKickResult] = useState(null);
  const [reminders, setReminders] = useState([]);

  // Doctor Connectivity & Family Notification states
  const [doctorOnline, setDoctorOnline] = useState(true);
  const [doctorPing, setDoctorPing] = useState(24); // ms
  const [emergencyContact, setEmergencyContact] = useState({ name: 'Mark Davis (Spouse)', phone: '+1 (555) 019-2834' });

  const loadHistory = () => {
    fetch(`${API_BASE}/healthcare/maternal/vitals/history/M-001`)
      .then(res => res.json())
      .then(data => setVitalsHistory(data))
      .catch(console.error);

    fetch(`${API_BASE}/healthcare/maternal/reminders/M-001`)
      .then(res => res.json())
      .then(data => setReminders(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadHistory();
  }, [maternalAssessment]);

  // Simulate ping updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDoctorPing(prev => Math.max(10, Math.min(99, prev + Math.floor(Math.random() * 11) - 5)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerVitalsSubmission = async () => {
    try {
      const response = await fetch(`${API_BASE}/healthcare/maternal/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: 'M-001', ...vitalsData })
      });
      const data = await response.json();
      setMaternalAssessment(data);
      triggerAlert('push', `Maternal clinical health check complete. Status: ${data.risk_level} Risk.`);
      
      if (data.emergency) {
        triggerAlert('whatsapp', `EMERGENCY ALERT dispatched to Doctor & ${emergencyContact.name}. Vitals: BP ${vitalsData.blood_pressure_systolic}/${vitalsData.blood_pressure_diastolic}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerLogKicks = async () => {
    try {
      const response = await fetch(`${API_BASE}/healthcare/maternal/kick-count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: 'M-001', kicks: kickData.kicks, duration_minutes: kickData.duration_minutes })
      });
      const data = await response.json();
      setKickResult(data);
      
      if (data.alert) {
        triggerAlert('sms', `Vitals Alert: Lower kick frequency detected. Contacting midwife.`);
      } else {
        triggerAlert('push', `Kick count logged: ${kickData.kicks} kicks.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendFamilyAlert = () => {
    triggerAlert('whatsapp', `Manual maternal update shared with ${emergencyContact.name}. Status: Stable.`);
    alert(`Status notification dispatched successfully to ${emergencyContact.name} at ${emergencyContact.phone}`);
  };

  return (
    <section className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-rose)' }}>Patient Vitals Telemetry</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Evaluate maternal parameters, coordinate doctor telemetry syncs, and dispatch notifications to family circles.</p>
        </div>
      </div>

      {/* Connectivity Banner */}
      <div className="grid-3" style={{ gap: '16px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: doctorOnline ? 'var(--accent-emerald)' : 'var(--accent-rose)', boxShadow: doctorOnline ? '0 0 6px var(--accent-emerald)' : 'none' }} />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Doctor Telemetry Status</span>
            <strong style={{ fontSize: '13px' }}>{doctorOnline ? `Synced (Ping: ${doctorPing}ms)` : 'Disconnected'}</strong>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
          <ShieldCheck size={18} style={{ color: 'var(--accent-cyan)' }} />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Encryption Level</span>
            <strong style={{ fontSize: '13px' }}>AES-256 GCM Secure</strong>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
          <Heart size={18} style={{ color: 'var(--accent-rose)' }} />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Gestational Period</span>
            <strong style={{ fontSize: '13px' }}>Week {vitalsData.gestational_week} (Trimester 2)</strong>
          </div>
        </div>
      </div>
      
      <div className="grid-2">
        {/* Form panel */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', color: 'var(--accent-rose)' }}>Log Clinical Vitals</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Heart Rate (BPM)</label>
              <input type="number" className="form-control" value={vitalsData.heart_rate} onChange={e => setVitalsData({ ...vitalsData, heart_rate: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>SpO2 Saturation (%)</label>
              <input type="number" className="form-control" value={vitalsData.spo2} onChange={e => setVitalsData({ ...vitalsData, spo2: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Systolic BP (mmHg)</label>
              <input type="number" className="form-control" value={vitalsData.blood_pressure_systolic} onChange={e => setVitalsData({ ...vitalsData, blood_pressure_systolic: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Diastolic BP (mmHg)</label>
              <input type="number" className="form-control" value={vitalsData.blood_pressure_diastolic} onChange={e => setVitalsData({ ...vitalsData, blood_pressure_diastolic: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input type="number" step="0.1" className="form-control" value={vitalsData.temperature} onChange={e => setVitalsData({ ...vitalsData, temperature: parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Gestational Week</label>
              <input type="number" className="form-control" value={vitalsData.gestational_week} onChange={e => setVitalsData({ ...vitalsData, gestational_week: parseInt(e.target.value) })} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '12px', width: '100%' }} onClick={triggerVitalsSubmission}>Analyze Patient Status</button>

          {maternalAssessment && (
            <div style={{ marginTop: '20px', padding: '16px', borderRadius: '8px', background: maternalAssessment.emergency ? 'rgba(244,63,94,0.06)' : 'rgba(255,255,255,0.02)', borderLeft: `4px solid ${maternalAssessment.emergency ? 'var(--accent-rose)' : 'var(--accent-emerald)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Assessment Risk:</strong>
                <span className={`badge ${maternalAssessment.risk_level === 'High' ? 'badge-danger' : (maternalAssessment.risk_level === 'Medium' ? 'badge-warning' : 'badge-success')}`}>{maternalAssessment.risk_level}</span>
              </div>
              {maternalAssessment.flags.length > 0 && (
                <div style={{ marginTop: '8px', color: 'var(--accent-rose)', fontSize: '13px' }}>
                  <strong>Flags:</strong> {maternalAssessment.flags.join(', ')}
                </div>
              )}
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <strong>Protocol Recommendation:</strong> {maternalAssessment.recommendations[0]}
              </div>
            </div>
          )}
        </div>

        {/* Analytics & Family Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '16px' }}>Vitals Analytics</h3>
            <div style={{ width: '100%', height: '120px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', position: 'relative' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', position: 'absolute', top: '8px', left: '8px' }}>Blood Pressure Trend (Systolic)</span>
              {vitalsHistory.length > 1 ? (
                <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path
                    d={(() => {
                      const pts = vitalsHistory.slice(-6);
                      const coords = pts.map((pt, i) => {
                        const x = (i / (pts.length - 1)) * 100;
                        const val = parseFloat(pt.blood_pressure_systolic) || 120;
                        const y = 40 - ((val - 90) / 70) * 35;
                        return `${x},${y}`;
                      });
                      return `M ${coords.join(' L ')}`;
                    })()}
                    fill="none"
                    stroke="var(--accent-rose)"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Log vitals to view analytics chart.</div>
              )}
            </div>
          </div>

          {/* Family Contact notifications dispatcher */}
          <div className="glass-card" style={{ padding: '14px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--accent-cyan)' }}>Emergency Family contact Panel</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '10px' }}>Relative Name</label>
                <input type="text" className="form-control" style={{ padding: '6px', fontSize: '12px' }} value={emergencyContact.name} onChange={e => setEmergencyContact({ ...emergencyContact, name: e.target.value })} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '10px' }}>Relative WhatsApp</label>
                <input type="text" className="form-control" style={{ padding: '6px', fontSize: '12px' }} value={emergencyContact.phone} onChange={e => setEmergencyContact({ ...emergencyContact, phone: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={handleSendFamilyAlert}>
              Dispatch Family Update
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
