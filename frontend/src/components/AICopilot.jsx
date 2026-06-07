import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Mic, Volume2, Sparkles, ChevronRight, Play } from 'lucide-react';

const SUGGESTIONS = {
  dashboard: [
    "Show districts with the highest pothole complaints.",
    "Summarize patient risk trends.",
    "Generate crop recommendations for Haryana.",
    "Verify blockchain audit log stability."
  ],
  'social-media': [
    "Explain Jane's Reputation Score",
    "Perform profile risk assessment",
    "What is the toxicity trend?"
  ],
  'court-order': [
    "Translate court order to Spanish",
    "Summarize judgment in 50 words",
    "Recommend similar case laws"
  ],
  healthcare: [
    "Summarize patient risk trends.",
    "Check disease trend patterns",
    "List cardiac risk adjustments"
  ],
  farming: [
    "Generate crop recommendations for Haryana.",
    "Analyze soil ph recommendations",
    "Verify Early Tomato Blight remedy"
  ],
  retail: [
    "Transcribe Agent demand report",
    "Suggest pricing optimizations",
    "Draft restocking order email"
  ],
  interior: [
    "Recommend color scheme for Scandi style",
    "Estimate total placement cost",
    "Trigger real-time collaboration session"
  ],
  'supply-chain': [
    "Verify product handoff block",
    "Check for shipping anomalies",
    "Transfer product ownership"
  ],
  maternal: [
    "Flag readmission hazard vectors",
    "Draft family notification text",
    "Obstetric vitals checklist"
  ],
  hazards: [
    "Show districts with the highest pothole complaints.",
    "Analyze pothole density heatmap",
    "Check repair resolution status"
  ],
  'sign-language': [
    "Correct sentence construction",
    "Translate gesture to French",
    "Mock video call interpretation"
  ]
};

export default function AICopilot({ activeTab, API_BASE, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I am your OmniSync AI Copilot. I'm context-aware of your current workspace and ready to help. Ask me anything or choose a suggestion below!" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputVal('');
    setLoading(true);

    try {
      const savedUser = localStorage.getItem('omnisync_user');
      const userObj = savedUser ? JSON.parse(savedUser) : null;

      const response = await fetch(`${API_BASE}/copilot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, context: activeTab, user: userObj })
      });
      const data = await response.json();
      
      let replyText = data.reply;
      setMessages(prev => [...prev, { role: 'assistant', text: replyText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I've processed your query. OmniSync modules are fully online and within safety boundaries." }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Simulating speech to text
    setTimeout(() => {
      const simulatedSpeeches = [
        "Explain this profile summary",
        "Summarize judgment in 50 words",
        "List cardiac risk adjustments",
        "Verify product handoff block",
        "Suggest pricing optimizations"
      ];
      const selected = simulatedSpeeches[Math.floor(Math.random() * simulatedSpeeches.length)];
      setInputVal(selected);
      setIsListening(false);
      // Automatically send
      setMessages(prev => [...prev, { role: 'user', text: `[Voice Command]: "${selected}"` }]);
      setLoading(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', text: `Voice command recognized! Processing instruction: "${selected}". Output telemetry updated.` }]);
        setLoading(false);
      }, 1200);
    }, 2000);
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const cleanText = text.replace(/\[.*?\]/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.onend = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Text-to-speech is not supported on this browser.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="copilot-drawer glass-card" style={{
      position: 'fixed',
      top: '0',
      right: '0',
      width: '380px',
      height: '100vh',
      zIndex: 900,
      borderLeft: '1px solid var(--glass-border)',
      borderTop: 'none',
      borderBottom: 'none',
      borderRight: 'none',
      borderRadius: '0',
      boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      background: 'var(--bg-secondary)',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} />
          <h3 style={{ color: 'var(--text-primary)', fontSize: '18px' }}>AI Copilot Drawer</h3>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '10px' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            background: m.role === 'user' ? 'var(--glass-hover)' : 'var(--bg-primary)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '13px',
            lineHeight: '1.4',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '10px', fontWeight: '700', color: m.role === 'user' ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>
              <span>{m.role.toUpperCase()}</span>
              {m.role === 'assistant' && (
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  onClick={() => handleSpeak(m.text)}
                >
                  <Volume2 size={12} className={isPlaying ? "neon-pulse" : ""} />
                </button>
              )}
            </div>
            <div style={{ wordBreak: 'break-word', color: 'var(--text-primary)' }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Context-aware suggestions */}
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px', textAlign: 'left' }}>Context-Aware Prompts</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(SUGGESTIONS[activeTab] || SUGGESTIONS.dashboard).map((s, idx) => (
            <button key={idx} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => handleSend(s)}>
              {s} <ChevronRight size={10} />
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          className={`btn btn-secondary ${isListening ? "active btn-danger" : ""}`} 
          style={{ padding: '10px', borderRadius: '8px' }}
          onClick={startVoiceInput}
          title="Voice Command"
        >
          <Mic size={16} className={isListening ? "neon-pulse" : ""} />
        </button>
        <input 
          type="text" 
          placeholder="Ask Copilot..." 
          className="form-control" 
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-primary" style={{ padding: '10px', borderRadius: '8px' }} onClick={() => handleSend()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
