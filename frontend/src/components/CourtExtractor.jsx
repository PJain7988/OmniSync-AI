import React, { useState } from 'react';
import { RefreshCw, Volume2, Globe, Sparkles, FolderOpen, Search } from 'lucide-react';

export default function CourtExtractor({ API_BASE, triggerAlert }) {
  const [courtText, setCourtText] = useState('');
  const [courtResult, setCourtResult] = useState(null);
  const [courtLoading, setCourtLoading] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [keywordQuery, setKeywordQuery] = useState('');

  const triggerCourtExtraction = async () => {
    if (!courtText) return;
    setCourtLoading(true);
    try {
      const response = await fetch(`${API_BASE}/court-order/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: courtText })
      });
      const data = await response.json();
      setCourtResult(data);
      triggerAlert('push', `Judicial Extract: Case ID ${data.case_number} compiled.`);
    } catch (e) {
      console.error(e);
    } finally {
      setCourtLoading(false);
    }
  };

  const handleTranslate = async (lang) => {
    setTargetLang(lang);
    if (!courtResult) return;
    setIsTranslating(true);
    triggerAlert('push', `Translating case profile to ${lang.toUpperCase()}...`);
    setTimeout(() => {
      // Mock translations
      const translations = {
        es: {
          key_verdict: "El Tribunal falló a favor de la peticionaria, revocando la sanción pecuniaria administrativa.",
          summary: "Esta disputa legal se refiere a los límites del poder regulatorio. El tribunal determinó que la parte demandada no cumplió con el procedimiento de debido proceso legal antes de imponer la multa."
        },
        fr: {
          key_verdict: "Le tribunal a statué en faveur du requérant, annulant l'amende réglementaire.",
          summary: "Ce litige concerne les limites du pouvoir de régulation. Le tribunal a jugé que le défendeur n'a pas respecté les règles de procédure de justice naturelle avant d'émettre la pénalité."
        },
        de: {
          key_verdict: "Das Gericht entschied zugunsten des Klägers und hob die behördliche Geldbuße auf.",
          summary: "Dieser Rechtsstreit befasst sich mit den Grenzen der Regulierungsbefugnis. Das Gericht stellte fest, dass die Beklagte das rechtliche Gehör vor Verhängung des Bußgeldes verletzt hat."
        },
        en: {
          key_verdict: courtResult.key_verdict,
          summary: courtResult.summary
        }
      };

      setCourtResult(prev => ({
        ...prev,
        translated_verdict: translations[lang].key_verdict,
        translated_summary: translations[lang].summary
      }));
      setIsTranslating(false);
    }, 1000);
  };

  const handleVoiceSummary = () => {
    if (!courtResult) return;
    if ('speechSynthesis' in window) {
      if (isPlayingVoice) {
        window.speechSynthesis.cancel();
        setIsPlayingVoice(false);
      } else {
        const textToRead = courtResult.translated_summary || courtResult.summary;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.onend = () => setIsPlayingVoice(false);
        setIsPlayingVoice(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Voice playback not supported in this browser.");
    }
  };

  // Precedent recommendations mock database
  const PRECEDENT_CASES = [
    { number: "WP No. 2831/2024", court: "Supreme Court", title: "Astra Corp vs Union of Trade", ratio: "Regulatory penalties without natural justice show-cause are arbitrary and void." },
    { number: "CA No. 902/2023", court: "High Court of Bombay", title: "State Utilities vs SolarGrid Ltd", ratio: "Mandatory compliance periods must allow a minimum of 45 working days for response." },
    { number: "WP No. 1104/2025", court: "Supreme Court", title: "Global Telecoms vs Reg Authority", ratio: "Confirming boundaries of executive delegation in administrative tribunals." }
  ];

  return (
    <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-purple)' }}>Judicial Records Engine</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Extract structured case entities, analyze outcomes, and search precedent databases.</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Input Text */}
        <div className="glass-card" style={{ textAlign: 'left' }}>
          <h3 style={{ marginBottom: '14px', fontSize: '16px' }}>Input Legal Document</h3>
          <div className="form-group">
            <textarea
              rows="8"
              placeholder="Paste legal judgment proceedings here..."
              className="form-control"
              value={courtText}
              onChange={e => setCourtText(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={triggerCourtExtraction} disabled={courtLoading}>
            {courtLoading ? <RefreshCw className="spinner" size={16} /> : 'Extract Metadata & Summarize'}
          </button>

          {courtResult && (
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Precedent / Similar Case Recommendations</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PRECEDENT_CASES.map((item, idx) => (
                  <div key={idx} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--accent-purple)', fontWeight: '600' }}>
                      <span>{item.title}</span>
                      <span>{item.number}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}><strong>Ratio Decidendi:</strong> {item.ratio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Structured Output */}
        {courtResult ? (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px' }}>Extraction Ledger</h3>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Globe size={14} style={{ color: 'var(--accent-cyan)' }} />
                <select 
                  style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--accent-cyan)', fontSize: '11px', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}
                  value={targetLang}
                  onChange={e => handleTranslate(e.target.value)}
                >
                  <option value="en" style={{ background: '#111' }}>English</option>
                  <option value="es" style={{ background: '#111' }}>Español</option>
                  <option value="fr" style={{ background: '#111' }}>Français</option>
                  <option value="de" style={{ background: '#111' }}>Deutsch</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <div><strong>Case Number:</strong> <code style={{ color: 'var(--accent-cyan)' }}>{courtResult.case_number}</code></div>
              <div><strong>Jurisdiction:</strong> {courtResult.court}</div>
              <div><strong>Presiding Judge:</strong> {courtResult.judge}</div>
              <div><strong>Verdict Date:</strong> {courtResult.verdict_date}</div>
              <div><strong>Petitioner:</strong> {courtResult.petitioner}</div>
              <div><strong>Respondent:</strong> {courtResult.respondent}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--accent-purple)', fontSize: '14px' }}>AI Verdict Summary</strong>
                <button 
                  className={`btn btn-secondary ${isPlayingVoice ? "active" : ""}`} 
                  style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={handleVoiceSummary}
                >
                  <Volume2 size={12} className={isPlayingVoice ? "neon-pulse" : ""} /> Read Summary
                </button>
              </div>
              <div style={{ background: 'rgba(189,0,255,0.04)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                <strong>Outcome:</strong> {courtResult.translated_verdict || courtResult.key_verdict}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {courtResult.translated_summary || courtResult.summary}
              </p>
            </div>

            <button className="btn btn-secondary" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderColor: 'var(--accent-purple)' }} onClick={() => alert('Open Copilot on the right panel to run legal queries.')}>
              <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} /> Ask Legal Chatbot
            </button>
          </div>
        ) : (
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Paste case record text to run OCR entities modeling.
          </div>
        )}
      </div>
    </section>
  );
}
