import React, { useState } from 'react';
import { RefreshCw, Upload, CloudSun, Eye, Phone, Map, DollarSign, Sparkles } from 'lucide-react';

export default function SustainableFarming({ API_BASE, triggerAlert }) {
  const [soilData, setSoilData] = useState({
    nitrogen: 45, phosphorus: 30, potassium: 50, ph: 6.2, moisture: 40, temperature: 28, humidity: 65, rainfall: 120, latitude: 28.6, longitude: 77.2
  });
  const [farmingResult, setFarmingResult] = useState(null);
  const [farmingLoading, setFarmingLoading] = useState(false);
  const [leafDiseaseResult, setLeafDiseaseResult] = useState(null);
  const [leafLoading, setLeafLoading] = useState(false);

  // Drone/Satellite image layer state
  const [satelliteLayer, setSatelliteLayer] = useState('visible'); // visible, moisture, ndvi
  const [pestDetection, setPestDetection] = useState(null);

  const triggerFarmingAdvisor = async () => {
    setFarmingLoading(true);
    try {
      const response = await fetch(`${API_BASE}/farming/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(soilData)
      });
      const data = await response.json();
      setFarmingResult(data);
      triggerAlert('push', 'NPK soil chemical advisory report completed.');
    } catch (e) {
      console.error(e);
    } finally {
      setFarmingLoading(false);
    }
  };

  const triggerLeafDisease = async () => {
    setLeafLoading(true);
    try {
      const response = await fetch(`${API_BASE}/farming/disease-detect`, { method: 'POST' });
      const data = await response.json();
      setLeafDiseaseResult(data);
      triggerAlert('whatsapp', `Farming pathogen alert: Leaf diagnosed with early signs of ${data.disease}.`);
    } catch (e) {
      console.error(e);
    } finally {
      setLeafLoading(false);
    }
  };

  const triggerPestDetection = () => {
    const pests = [
      { type: "Spider Mites", severity: "High", treatment: "Apply neem oil or insecticidal soap." },
      { type: "Aphids Colony", severity: "Medium", treatment: "Introduce ladybugs or wash foliage." },
      { type: "Cutworms", severity: "Low", treatment: "Apply diatomaceous earth around stems." }
    ];
    const detected = pests[Math.floor(Math.random() * pests.length)];
    setPestDetection(detected);
    triggerAlert('sms', `Pest alert: Detected ${detected.type} in Sector 4B.`);
  };

  return (
    <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-emerald)' }}>Agronomic Resource Planner</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Precision NPK chemical advisory, visual leaf pathogen classifier, and drone/satellite NDVI mapping.</p>
        </div>
      </div>

      {/* Drone/Satellite and Weather widgets */}
      <div className="grid-3" style={{ gap: '16px' }}>
        {/* Drone Mapping Viewport */}
        <div className="glass-card" style={{ padding: '14px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Drone/Satellite Feed</span>
            <select 
              style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--accent-emerald)', fontSize: '10px', borderRadius: '4px', cursor: 'pointer' }}
              value={satelliteLayer}
              onChange={e => setSatelliteLayer(e.target.value)}
            >
              <option value="visible" style={{ background: '#111' }}>Visible RGB</option>
              <option value="moisture" style={{ background: '#111' }}>Soil Moisture</option>
              <option value="ndvi" style={{ background: '#111' }}>NDVI Vegetation</option>
            </select>
          </div>
          
          <div style={{
            height: '80px',
            borderRadius: '6px',
            background: satelliteLayer === 'ndvi' 
              ? 'linear-gradient(45deg, #0f400f, #22c55e)' 
              : (satelliteLayer === 'moisture' ? 'linear-gradient(45deg, #1e3a8a, #3b82f6)' : 'linear-gradient(45deg, #5c4033, #8b5a2b)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--glass-border)',
            position: 'relative'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {satelliteLayer.toUpperCase()} Layer - Sector 4B
            </span>
          </div>
        </div>

        {/* 5-day Weather Forecast */}
        <div className="glass-card" style={{ padding: '14px', textAlign: 'left' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Weather Prediction</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', textAlign: 'center' }}>
            <div><div>Mon</div><CloudSun size={14} style={{ color: 'var(--accent-amber)', margin: '4px 0' }} /><div>31°C</div></div>
            <div><div>Tue</div><CloudSun size={14} style={{ color: 'var(--accent-amber)', margin: '4px 0' }} /><div>30°C</div></div>
            <div><div>Wed</div><CloudSun size={14} style={{ color: 'var(--text-secondary)', margin: '4px 0' }} /><div>28°C</div></div>
            <div><div>Thu</div><CloudSun size={14} style={{ color: 'var(--accent-amber)', margin: '4px 0' }} /><div>32°C</div></div>
            <div><div>Fri</div><CloudSun size={14} style={{ color: 'var(--accent-emerald)', margin: '4px 0' }} /><div>29°C</div></div>
          </div>
        </div>

        {/* Crop Yield Forecast */}
        <div className="glass-card" style={{ padding: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Yield Prediction</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', marginTop: '6px' }}>
            <h4 style={{ fontSize: '20px', color: 'var(--accent-emerald)' }}>4.8 tons <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/acre</span></h4>
            <span className="badge badge-success" style={{ fontSize: '9px', marginLeft: 'auto' }}>+12% vs LY</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '4px' }}>
            <div style={{ width: '82%', height: '100%', background: 'var(--accent-emerald)' }} />
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Soil Chem Form */}
        <div className="glass-card" style={{ textAlign: 'left' }}>
          <h3 style={{ marginBottom: '14px', fontSize: '16px' }}>NPK Chemical Analyzer</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Nitrogen (mg/kg)</label>
              <input type="number" className="form-control" value={soilData.nitrogen} onChange={e => setSoilData({ ...soilData, nitrogen: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Phosphorus (mg/kg)</label>
              <input type="number" className="form-control" value={soilData.phosphorus} onChange={e => setSoilData({ ...soilData, phosphorus: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Potassium (mg/kg)</label>
              <input type="number" className="form-control" value={soilData.potassium} onChange={e => setSoilData({ ...soilData, potassium: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Soil pH</label>
              <input type="number" step="0.1" className="form-control" value={soilData.ph} onChange={e => setSoilData({ ...soilData, ph: parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Moisture (%)</label>
              <input type="number" className="form-control" value={soilData.moisture} onChange={e => setSoilData({ ...soilData, moisture: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Rainfall (mm)</label>
              <input type="number" className="form-control" value={soilData.rainfall} onChange={e => setSoilData({ ...soilData, rainfall: parseInt(e.target.value) })} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '12px', width: '100%' }} onClick={triggerFarmingAdvisor} disabled={farmingLoading}>
            {farmingLoading ? <RefreshCw className="spinner" size={16} /> : 'Analyze Soil Matrix'}
          </button>
        </div>

        {/* Diagnostics & Pest classification */}
        <div className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '16px' }}>Pathogen & Pest Classification</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '12px' }} onClick={triggerLeafDisease}>
              <Upload size={14} /> Scan Leaf Disease
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '12px', borderColor: 'var(--accent-amber)' }} onClick={triggerPestDetection}>
              <Eye size={14} style={{ color: 'var(--accent-amber)' }} /> Scan Pest Activity
            </button>
          </div>

          {leafDiseaseResult && (
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)' }}>
              <strong>Diagnosed Pathogen:</strong> {leafDiseaseResult.disease} ({((leafDiseaseResult.confidence || 0) * 100).toFixed(0)}% match)
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{leafDiseaseResult.recommendation}</p>
            </div>
          )}

          {pestDetection && (
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-amber)' }}>
              <strong>Detected Pest:</strong> {pestDetection.type} (<span style={{ color: 'var(--accent-rose)' }}>{pestDetection.severity} Severity</span>)
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{pestDetection.treatment}</p>
            </div>
          )}

          {farmingResult && (
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', marginTop: 'auto' }}>
              <strong style={{ color: 'var(--accent-emerald)', fontSize: '13px' }}>AI Advisor Suggestions:</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <div><strong>Crops:</strong> {farmingResult.recommended_crops?.join(', ')}</div>
                <div><strong>Watering:</strong> {farmingResult.irrigation_schedule?.frequency} ({farmingResult.irrigation_schedule?.depth_inches} inches)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
