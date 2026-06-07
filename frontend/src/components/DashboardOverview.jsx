import React, { useState, useEffect, useRef } from 'react';
import {
  Share2, Shield, Activity, Sprout, ShoppingCart, Home, Link2, Heart, MapPin, MessageSquare,
  Terminal, Cpu, HardDrive, Wifi, ArrowUpRight
} from 'lucide-react';

const INITIAL_LOGS = [
  { time: '12:45:02', type: 'SYSTEM', msg: 'OmniSync AI multi-agent orchestration bootstrap initiated.' },
  { time: '12:45:05', type: 'DATABASE', msg: 'Local JSON File adapter mounted successfully.' },
  { time: '12:45:09', type: 'NEURAL', msg: 'LeafPathogen classifier neural weights loaded.' },
  { time: '12:45:15', type: 'RETAIL', msg: 'Procurement agent checking reorder limits for SKU-101.' },
  { time: '12:45:21', type: 'CHAIN', msg: 'Mock blockchain genesis block signed: PROD-9824.' },
  { time: '12:45:28', type: 'GESTURE', msg: 'WebSocket sign translator channel open on port 5000.' }
];

const LOG_TEMPLATES = [
  { type: 'OSINT', msg: 'Ethical Analyzer scanned handle target. Threat rating computed: Low.' },
  { type: 'CLINICAL', msg: 'Cardiometabolic model processed age/blood pressure vector. Risk: 14%.' },
  { type: 'AGRONOMY', msg: 'NPK planner triggered precision sprinkler schedule for sector 4B.' },
  { type: 'RETAIL', msg: 'Pricing Agent updated margins on SKU-103. Current Price: $22.50.' },
  { type: 'SPATIAL', msg: 'ThreeJS room bounding box updated. Plant mesh inserted at floor grid (2.4, 0.4).' },
  { type: 'CHAIN', msg: 'Transit transaction block signed. Custodian: Beta Logistics. Location: NY.' },
  { type: 'MATERNAL', msg: 'Obstetric assessment flags parsed. BP systolic 120 within normal bounds.' },
  { type: 'CIVIC', msg: 'Road Hazard database indexed new pothole at lat 28.61, lon 77.20.' },
  { type: 'GESTURE', msg: 'Gesture buffer parsed. Sequence "Hello-Please-Water" translated.' }
];

export default function DashboardOverview({ setActiveTab }) {
  const [metrics, setMetrics] = useState({ logsProcessed: 412, latency: 74, threadsActive: 10 });
  const [consoleLogs, setConsoleLogs] = useState(INITIAL_LOGS);
  const logEndRef = useRef(null);

  // Live simulation loop for metrics and log updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate stats slightly
      setMetrics(prev => ({
        logsProcessed: prev.logsProcessed + Math.floor(Math.random() * 3),
        latency: Math.floor(65 + Math.random() * 20),
        threadsActive: 10
      }));

      // Add a random log message
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setConsoleLogs(prev => [...prev.slice(-15), { time: timeStr, type: template.type, msg: template.msg }]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal console
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="section-title">OmniSync Hub</h1>
          <p className="section-subtitle">Executive control dashboard for the multi-agent AI suite.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge badge-success" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-indicator online" /> Systems Operational
          </span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid-3" style={{ gap: '16px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)' }}>
            <Cpu size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Neural Threads</span>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>{metrics.threadsActive} / 10 Online</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(189, 0, 255, 0.1)', color: 'var(--accent-purple)' }}>
            <Wifi size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Avg Response Latency</span>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>{metrics.latency} ms</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>
            <HardDrive size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total System Actions</span>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>{metrics.logsProcessed} logs</h3>
          </div>
        </div>
      </div>

      {/* Live Agent Terminal Feed */}
      <div className="glass-card" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Terminal size={16} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Real-Time Multi-Agent Transaction Console</span>
        </div>
        <div style={{ height: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--glass-border)', textAlign: 'left' }}>
          {consoleLogs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>[{log.type}]</span>
              <span style={{ color: 'var(--text-primary)' }}>{log.msg}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Subsystem Options & Progress Grid */}
      <div>
        <h2 style={{ textAlign: 'left', marginBottom: '16px', fontSize: '20px', color: 'var(--text-primary)' }}>Administrative Modules</h2>
        <div className="dashboard-grid">
          
          <div className="glass-card project-card" onClick={() => setActiveTab('social-media')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><Share2 /></div>
              <h3>Public Sentiment Monitor</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Scrapes profiles and performs ethical analysis, calculating sentiment profiles and toxicity scores using AI.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>Accuracy: 92%</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('court-order')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><Shield /></div>
              <h3>Judicial Records Engine</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Parses unstructured court orders into legal databases, drawing judgments and summaries instantly.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-purple)' }}>SLA Compliance: 99.8%</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('healthcare')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><Activity /></div>
              <h3>Cardiometabolic Analytics</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Clinical risk advisory calculating probability factors for readmission, heart diseases, and diabetes.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-rose)' }}>F1-Score: 0.94</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('farming')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><Sprout /></div>
              <h3>Agronomic Resource Planner</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Agronomy planner tracking NPK soil properties, suggesting precision irrigation schedules and leaf health.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>Telemetry Node: Active</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('retail')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><ShoppingCart /></div>
              <h3>Warehouse Stock Controller</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Multi-agent inventory system managing automatic procurement, warehouse alerts, and pricing agents.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-blue)' }}>Margin Optim: Auto</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('interior')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><Home /></div>
              <h3>Facility Spatial Modeler</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Spatially render layouts in real-time. Spawn and organize furniture presets in an interactive 3D canvas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>Render Pipeline: WebGL</span>
              <span className="badge badge-info" style={{ padding: '2px 8px' }}>Ready</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('supply-chain')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><Link2 /></div>
              <h3>Logistics Blockchain Ledger</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Cryptographically signs tracking logs. Establishes immutable chain-of-custody ledgers on a mock blockchain.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-purple)' }}>Blocks Mined: {Math.floor(metrics.logsProcessed / 15)}</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('maternal')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><Heart /></div>
              <h3>Patient Vitals Telemetry</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Sensors, medication logs, vitals telemetry, kick counts, and pre-eclampsia warning flags.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-rose)' }}>Alert System: Guarded</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('hazards')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><MapPin /></div>
              <h3>Civic Infrastructure Hazards</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Civic hazards ledger allowing coordinates log, municipal authority updates, and community vote tags.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-amber)' }}>GPS Geofence: Active</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

          <div className="glass-card project-card" onClick={() => setActiveTab('sign-language')}>
            <div className="scan-bar" />
            <div className="project-card-header">
              <div className="project-icon"><MessageSquare /></div>
              <h3>Accessibility Gestures System</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
              Decodes camera streams via high-performance web sockets to translate gesture sequences to speech.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>WS Stream: Online</span>
              <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
