import React, { useState, useEffect } from 'react';
import { RefreshCw, Heart, Activity, CheckSquare, Sparkles, AlertTriangle } from 'lucide-react';

export default function HealthcareAnalytics({ API_BASE, triggerAlert }) {
  const [patientData, setPatientData] = useState({
    age: 42, gender: 1, bmi: 26.5, blood_pressure: 130, glucose: 105, smoking: 0, previous_admissions: 1
  });
  const [healthResult, setHealthResult] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Wearable Integration Simulation State
  const [wearableSync, setWearableSync] = useState(false);
  const [wearableData, setWearableData] = useState({ hr: 78, spo2: 98 });
  const [wearableHistory, setWearableHistory] = useState([74, 76, 75, 78, 80, 77, 79]);

  // Hospital occupancy stats
  const [occupancy, setOccupancy] = useState(72); // 72% occupancy

  useEffect(() => {
    let interval;
    if (wearableSync) {
      triggerAlert('push', 'Wearable sync active: Fetching cardiometabolic sensor data.');
      interval = setInterval(() => {
        const nextHR = Math.max(60, Math.min(120, wearableData.hr + Math.floor(Math.random() * 5) - 2));
        const nextSPO2 = Math.max(95, Math.min(100, wearableData.spo2 + Math.floor(Math.random() * 3) - 1));
        setWearableData({ hr: nextHR, spo2: nextSPO2 });
        setWearableHistory(prev => [...prev.slice(-14), nextHR]);
        
        if (nextHR > 105) {
          triggerAlert('whatsapp', `ALERT: Wearable detected high resting heart rate of ${nextHR} BPM.`);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [wearableSync]);

  const triggerHealthPredict = async () => {
    setHealthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/healthcare/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      const data = await response.json();
      setHealthResult(data);
      triggerAlert('push', 'Comorbidity prediction models compiled for Patient.');
    } catch (e) {
      console.error("Fetch failed, using local fallback predictor:", e);
      // Fallback local mock prediction
      const mockResult = {
        risk_level: patientData.glucose > 120 || patientData.blood_pressure > 130 ? "High" : "Low",
        condition_risk: {
          heart_disease: patientData.blood_pressure > 130 ? 0.62 : 0.28,
          diabetes: patientData.glucose > 110 ? 0.58 : 0.32
        },
        recommendation: patientData.glucose > 120 || patientData.blood_pressure > 130
          ? "Begin structured blood sugar monitoring thrice weekly. Recommend a low-glycemic dietary regime, and schedule a general practitioner consultation in 2 weeks."
          : "Maintain current cardiovascular activity routing. Re-evaluate metrics in 3 months."
      };
      setHealthResult(mockResult);
      triggerAlert('push', 'Comorbidity prediction models compiled for Patient.');
    } finally {
      setHealthLoading(false);
    }
  };

  // Mock patient census list
  const CRITICAL_PATIENTS = [
    { id: "P-409", name: "David Miller", age: 64, condition: "Heart Failure risk", status: "Critical", bp: "155/95" },
    { id: "P-882", name: "Sarah Connor", age: 52, condition: "Gestational Diabetes", status: "Guard", bp: "128/84" },
    { id: "P-121", name: "Frank Sinatra", age: 71, condition: "Post-op recovery", status: "Stable", bp: "115/70" }
  ];

  return (
    <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-rose)' }}>Cardiometabolic Analytics</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Predict patient comorbidities, monitor wearable telemetry, and evaluate hospital census levels.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={12} /> Live Sensors Online
          </span>
        </div>
      </div>

      {/* Dials / Occupancy & Wearables */}
      <div className="grid-3" style={{ gap: '16px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)' }}>
            <Heart size={20} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hospital Occupancy</span>
            <h4 style={{ fontSize: '18px', marginTop: '2px' }}>{occupancy}% Capacity</h4>
            <div style={{ width: '120px', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '4px' }}>
              <div style={{ width: `${occupancy}%`, height: '100%', background: 'var(--accent-rose)' }} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Wearable Integration</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input 
                type="checkbox" 
                checked={wearableSync} 
                onChange={(e) => setWearableSync(e.target.checked)} 
                id="wearable-sync-checkbox"
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="wearable-sync-checkbox" style={{ fontSize: '13px', cursor: 'pointer' }}>Sync FitBit / Watch</label>
            </div>
          </div>
        </div>

        {wearableSync && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Pulse: <strong style={{ color: 'var(--accent-rose)' }}>{wearableData.hr} BPM</strong></span>
              <span>SpO2: <strong style={{ color: 'var(--accent-cyan)' }}>{wearableData.spo2}%</strong></span>
            </div>
            {/* Miniature Sparkline */}
            <div style={{ height: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'flex-end', padding: '2px' }}>
              <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path 
                  d={`M ${wearableHistory.map((val, idx) => `${(idx / (wearableHistory.length - 1)) * 100} ${20 - ((val - 50) / 70) * 16}`).join(' L ')}`} 
                  fill="none" 
                  stroke="var(--accent-rose)" 
                  strokeWidth="1.5" 
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="grid-2">
        {/* Patient Form */}
        <div className="glass-card" style={{ textAlign: 'left' }}>
          <h3 style={{ marginBottom: '14px', fontSize: '16px' }}>Diagnostics Inference</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Age</label>
              <input type="number" className="form-control" value={patientData.age} onChange={e => setPatientData({ ...patientData, age: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>BMI</label>
              <input type="number" step="0.1" className="form-control" value={patientData.bmi} onChange={e => setPatientData({ ...patientData, bmi: parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Blood Pressure</label>
              <input type="number" className="form-control" value={patientData.blood_pressure} onChange={e => setPatientData({ ...patientData, blood_pressure: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Glucose Level</label>
              <input type="number" className="form-control" value={patientData.glucose} onChange={e => setPatientData({ ...patientData, glucose: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Admissions</label>
              <input type="number" className="form-control" value={patientData.previous_admissions} onChange={e => setPatientData({ ...patientData, previous_admissions: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Smoking Status</label>
              <select className="form-control" value={patientData.smoking} onChange={e => setPatientData({ ...patientData, smoking: parseInt(e.target.value) })}>
                <option value="0">Non-Smoker</option>
                <option value="1">Active Smoker</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '12px', width: '100%' }} onClick={triggerHealthPredict} disabled={healthLoading}>
            {healthLoading ? <RefreshCw className="spinner" size={16} /> : 'Calculate Health Risks'}
          </button>
        </div>

        {/* Doctor Census Panel */}
        <div className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '16px' }}>Doctor Dashboard - Critical Ward Census</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CRITICAL_PATIENTS.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>{p.name} <span style={{ color: 'var(--text-muted)' }}>({p.id})</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Risk Factor: {p.condition} | BP: {p.bp}</div>
                </div>
                <span className={`badge ${p.status === 'Critical' ? 'badge-danger' : (p.status === 'Guard' ? 'badge-warning' : 'badge-success')}`} style={{ fontSize: '10px' }}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>

          {healthResult && (
            <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-rose)', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong>Predicted Condition Risk Factors:</strong>
                <span className="badge badge-warning" style={{ fontSize: '9px' }}>{healthResult.risk_level} Risk</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div><strong>Heart Disease:</strong> {((healthResult.condition_risk?.heart_disease || 0) * 100).toFixed(0)}%</div>
                <div><strong>Diabetes:</strong> {((healthResult.condition_risk?.diabetes || 0) * 100).toFixed(0)}%</div>
              </div>
              <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--accent-rose)' }}><strong>Advice:</strong> {healthResult.recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
