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
      <div className="grid-3" style={{ gap: '20px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.15)', color: 'var(--accent-cyan)', boxShadow: '0 0 15px rgba(14, 165, 233, 0.2)' }}>
            <Cpu size={28} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Neural Threads</span>
            <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.5px' }}>{metrics.threadsActive} <span style={{fontSize: '16px', color: 'var(--text-muted)'}}>/ 10</span></h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)' }}>
            <Wifi size={28} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Avg Latency</span>
            <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.5px' }}>{metrics.latency} <span style={{fontSize: '16px', color: 'var(--text-muted)'}}>ms</span></h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
            <HardDrive size={28} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Total Actions</span>
            <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.5px' }}>{metrics.logsProcessed}</h3>
          </div>
        </div>
      </div>

      {/* Live Agent Terminal Feed */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
          <Terminal size={18} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-primary)' }}>Real-Time Agent Console</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-rose)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
          </div>
        </div>
        <div style={{ height: '200px', overflowY: 'auto', background: '#0f172a', padding: '20px', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          {consoleLogs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', lineHeight: '1.4' }}>
              <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>[{log.time}]</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: '600', width: '80px', flexShrink: 0 }}>[{log.type}]</span>
              <span style={{ color: '#e2e8f0' }}>{log.msg}</span>
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
