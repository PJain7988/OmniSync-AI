import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Play, Volume2, Video, ShieldAlert, Sparkles, Globe } from 'lucide-react';

export default function SignLanguageTranslator({ API_BASE, triggerAlert }) {
  const [vocabulary, setVocabulary] = useState([]);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [wsMessages, setWsMessages] = useState([]);
  const [wsBuffer, setWsBuffer] = useState(0);
  const wsRef = useRef(null);

  // Advanced features state
  const [offlineMode, setOfflineMode] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  const [correctedText, setCorrectedText] = useState('Hello, my name is John.');
  const [videoCallSim, setVideoCallSim] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/sign-language/vocabulary`)
      .then(res => res.json())
      .then(data => setVocabulary(data.signs))
      .catch(console.error);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const toggleWebsocket = () => {
    if (wsRef.current && wsStatus === 'connected') {
      wsRef.current.close();
      setWsStatus('disconnected');
    } else {
      setWsStatus('connecting');
      const wsUrl = API_BASE.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws/translate';
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
        setWsMessages([{ type: 'info', text: 'Connected to Real-time Stream Translation service.' }]);
        triggerAlert('push', 'Sign Language WebSocket connection active.');
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'gesture') {
          setWsMessages(prev => [...prev, { type: 'gesture', text: `Recognized sign: "${msg.label}"` }]);
          setWsBuffer(msg.buffer_size);
        } else if (msg.type === 'sentence') {
          const raw = msg.text;
          // Apply Transformer grammar correction mock
          let corrected = raw;
          if (raw.toLowerCase().includes("hello name i john")) {
            corrected = "Hello, my name is John.";
          } else if (raw.toLowerCase().includes("need help water please")) {
            corrected = "Excuse me, I need some water, please.";
          }
          setCorrectedText(corrected);
          setWsMessages(prev => [...prev, { type: 'sentence', text: `Translated Sentence: "${corrected}" (Confidence: ${(msg.confidence*100).toFixed(0)}%)` }]);
          setWsBuffer(0);
          
          triggerAlert('push', `Translation resolved: "${corrected}"`);
        }
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
      };
    }
  };

  const simulateFrameUpload = () => {
    if (offlineMode) {
      // Offline mock translate
      triggerAlert('push', 'Offline model inference: Identified gesture "HELP".');
      setCorrectedText("I need help, please.");
      setWsMessages(prev => [...prev, { type: 'sentence', text: `[OFFLINE] Translated Sentence: "I need help, please."` }]);
      return;
    }
    if (!wsRef.current || wsStatus !== 'connected') {
      // Connect first
      toggleWebsocket();
      return;
    }
    wsRef.current.send(JSON.stringify({ type: 'frame', data: 'mock_base64_camera_frame_data' }));
  };

  const speakTranslation = () => {
    if ('speechSynthesis' in window) {
      // Read corrected text or mock language
      let textToRead = correctedText;
      if (targetLang === 'es') textToRead = "Hola, mi nombre es Juan.";
      if (targetLang === 'fr') textToRead = "Bonjour, mon nom est Jean.";
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      window.speechSynthesis.speak(utterance);
      triggerAlert('push', `Synthesized speech: "${textToRead}"`);
    } else {
      alert("TTS not supported.");
    }
  };

  return (
    <section className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-cyan)' }}>Accessibility Gestures System</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Translate sign language frames to speech, run offline transformer networks, and overlay live call captions.</p>
        </div>
      </div>

      {/* Advanced Toggles */}
      <div className="grid-3" style={{ gap: '16px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
          <input 
            type="checkbox" 
            checked={offlineMode} 
            onChange={e => {
              setOfflineMode(e.target.checked);
              triggerAlert('push', `Offline translation mode ${e.target.checked ? 'Enabled' : 'Disabled'}.`);
            }} 
            id="offline-model-check"
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="offline-model-check" style={{ fontSize: '13px', cursor: 'pointer' }}>
            💾 Enable Offline Cache Weights
          </label>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
          <Video size={16} style={{ color: 'var(--accent-purple)' }} />
          <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setVideoCallSim(!videoCallSim)}>
            {videoCallSim ? 'Close Video Feed' : 'Overlay Video Call Cap'}
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
          <Globe size={16} style={{ color: 'var(--accent-cyan)' }} />
          <select 
            style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--accent-cyan)', fontSize: '11px', borderRadius: '4px', cursor: 'pointer', flex: 1, padding: '4px' }}
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
          >
            <option value="en" style={{ background: '#111' }}>Speak in English</option>
            <option value="es" style={{ background: '#111' }}>Speak in Spanish</option>
            <option value="fr" style={{ background: '#111' }}>Speak in French</option>
          </select>
        </div>
      </div>

      <div className="grid-2">
        {/* Sign Stream */}
        <div className="glass-card">
          <h3>Sign Streams Engine</h3>
          <div style={{ marginTop: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className={`btn ${wsStatus === 'connected' ? 'btn-secondary' : 'btn-primary'}`} onClick={toggleWebsocket} disabled={offlineMode}>
              {wsStatus === 'connected' ? 'Disconnect websocket' : 'Connect to Translation WebSocket'}
            </button>
            <button className="btn btn-primary animate-pulse" onClick={simulateFrameUpload}>
              Simulate Camera Frame upload
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <strong>Websocket Engine Status: </strong>
            <span className={`badge ${wsStatus === 'connected' ? 'badge-success' : 'badge-danger'}`}>{offlineMode ? 'Offline Engine' : wsStatus}</span>
            {wsBuffer > 0 && <span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Frame sequence buffer: {wsBuffer}/4</span>}
          </div>

          {/* Video call feed simulator */}
          {videoCallSim && (
            <div style={{ marginTop: '20px', height: '180px', background: '#222', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '11px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                🔴 Call Participant (Jane Doe)
              </div>
              {/* Animated camera indicator */}
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-purple)', animation: 'pulse 2s infinite' }} />
              <div style={{ position: 'absolute', bottom: '10px', width: '90%', background: 'rgba(0,0,0,0.8)', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '13px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <strong>Jane Doe captions:</strong> "{correctedText}"
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', height: '160px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <strong>Translation Log:</strong>
            {wsMessages.map((m, i) => (
              <div key={i} style={{ fontSize: '13px', color: m.type === 'sentence' ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                {m.type === 'sentence' ? '✨ ' : '• '} {m.text}
              </div>
            ))}
          </div>
        </div>

        {/* Transformer Correction Reference */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ color: 'var(--accent-cyan)' }}>Transformer Grammar Correction</h3>
            <div style={{ background: 'rgba(0,240,255,0.02)', padding: '12px', borderLeft: '3px solid var(--accent-cyan)', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI Corrected sentence output:</div>
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', marginTop: '4px', fontWeight: '600' }}>"{correctedText}"</p>
            </div>
            
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={speakTranslation}>
              <Volume2 size={14} /> Speak Translated Text
            </button>
          </div>

          <div className="glass-card">
            <h3>Supported Gestures Reference</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>The underlying CNN/Transformer network recognizes the following vocabulary gestures:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {vocabulary.map((sign, i) => (
                <span key={i} className="badge badge-info" style={{ fontSize: '13px', padding: '6px 12px' }}>{sign}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
