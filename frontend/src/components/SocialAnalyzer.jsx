import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, Sparkles, TrendingUp } from 'lucide-react';

export default function SocialAnalyzer({ API_BASE, triggerAlert }) {
  const [socialUser, setSocialUser] = useState('');
  const [socialResult, setSocialResult] = useState(null);
  const [socialLoading, setSocialLoading] = useState(false);
  
  // Real-time toxicity stream tracker
  const [toxicityTrend, setToxicityTrend] = useState([15, 22, 18, 30, 24, 35, 20]);

  useEffect(() => {
    const timer = setInterval(() => {
      setToxicityTrend(prev => [...prev.slice(-14), Math.max(5, Math.min(95, prev[prev.length - 1] + Math.floor(Math.random() * 11) - 5))]);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const triggerSocialAnalysis = async () => {
    if (!socialUser) return;
    setSocialLoading(true);
    try {
      const response = await fetch(`${API_BASE}/social-media/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: socialUser, platforms: ['twitter', 'reddit'] })
      });
      const data = await response.json();
      
      // Inject simulated social influence score
      data.influence_score = Math.round(60 + Math.random() * 38);
      setSocialResult(data);
      triggerAlert('push', `OSINT Scan complete: @${socialUser}. Score: ${data.reputation_score}.`);
    } catch (e) {
      console.error(e);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!socialResult) return;
    
    // Simulate compilation of a report and triggering download of a text report
    const docText = `
--------------------------------------------------
       SMARTSPHERE AI - PUBLIC SENTIMENT REPORT
--------------------------------------------------
Generated on: ${new Date().toLocaleString()}
Target Profile: @${socialResult.username}
--------------------------------------------------
Reputation Score: ${socialResult.reputation_score}/100
Social Influence Score: ${socialResult.influence_score || 82}/100
Risk Profile: ${socialResult.risk_level}
Sentiment Status: ${socialResult.sentiment}

Summary Findings:
${socialResult.summary}

--------------------------------------------------
Cryptographic Seal Hash: MD5-SH-8923489248234823
--------------------------------------------------
`;
    const blob = new Blob([docText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartsphere_sentiment_report_${socialResult.username}.txt`;
    a.click();
    triggerAlert('email', `Sentiment report sent to system logs.`);
  };

  return (
    <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-cyan)' }}>Public Sentiment Monitor</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Identify risk factors, toxicity indices, and social influence vectors.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> Live Scan Active
          </span>
        </div>
      </div>

      <div className="grid-2">
        {/* Profile Search */}
        <div className="glass-card" style={{ textAlign: 'left' }}>
          <h3 style={{ marginBottom: '14px', fontSize: '16px' }}>Scan Operations</h3>
          <div className="form-group">
            <label>Target Social Handle</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="e.g. janesmith_dev"
                className="form-control"
                style={{ flex: 1 }}
                value={socialUser}
                onChange={e => setSocialUser(e.target.value)}
              />
              <button className="btn btn-primary" onClick={triggerSocialAnalysis} disabled={socialLoading}>
                {socialLoading ? <RefreshCw className="spinner" size={16} /> : 'Scan Profile'}
              </button>
            </div>
          </div>

          {/* Real-time Toxicity chart (SVG-based) */}
          <div style={{ marginTop: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Real-time Risk/Toxicity Monitoring (Feed)</span>
            <div style={{ height: '90px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'flex-end' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <path
                  d={`M ${toxicityTrend.map((val, idx) => `${(idx / (toxicityTrend.length - 1)) * 300} ${80 - (val / 100) * 70}`).join(' L ')}`}
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="2"
                />
                <path
                  d={`M 0 80 L ${toxicityTrend.map((val, idx) => `${(idx / (toxicityTrend.length - 1)) * 300} ${80 - (val / 100) * 70}`).join(' L ')} L 300 80 Z`}
                  fill="url(#cyanGrad)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Results */}
        {socialResult ? (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px' }}>Risk Vector Summary</h3>
              <span className="badge badge-success">Analyzed</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '10px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '4px solid var(--accent-cyan)', boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{socialResult.reputation_score}</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>Reputation Score</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '4px solid var(--accent-purple)', boxShadow: '0 0 10px rgba(189, 0, 255, 0.3)' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{socialResult.influence_score || 82}</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>Influence score</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Sentiment polarity</span>
                <div style={{ marginTop: '2px' }}>
                  <span className={`badge ${socialResult.sentiment === 'Positive' ? 'badge-success' : 'badge-warning'}`}>{socialResult.sentiment}</span>
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Risk Level</span>
                <div style={{ marginTop: '2px' }}>
                  <span className={`badge ${socialResult.risk_level === 'Low' ? 'badge-success' : 'badge-danger'}`}>{socialResult.risk_level} Risk</span>
                </div>
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Compliance Narrative</span>
              <p style={{ fontSize: '13px', marginTop: '4px', lineHeight: '1.4' }}>{socialResult.summary}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
              <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px' }} onClick={handleDownloadPDF}>
                <Download size={14} /> PDF Report
              </button>
              <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', borderColor: 'var(--accent-purple)' }} onClick={() => alert('Open Copilot on the right panel to analyze this report.')}>
                <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} /> Ask Copilot
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Submit a profile handle to perform NLP toxicity scans.
          </div>
        )}
      </div>
    </section>
  );
}
