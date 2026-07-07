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
  ],
  login: [
    "What is the security protocol of OmniSync AI?",
    "What scopes are available for System Administrator?",
    "How do I log in using Azure Active Directory?",
    "Tell me about the 10 integrated AI modules."
  ]
};

function getLocalCopilotFallback(query, context) {
  const q = query.toLowerCase();

  if (q.includes("district") || q.includes("pothole") || q.includes("complaint") || q.includes("hazard") || q.includes("infrastructure")) {
    return "[Infrastructure Agent]: District 4 (Sector-G) has the highest pothole complaints with 42 logged, followed by Sector-C (29 complaints). Repair agents have scheduled resurfacing starting Monday.";
  }
  if (q.includes("patient") || q.includes("risk trend") || q.includes("vitals") || q.includes("healthcare") || q.includes("diabetes") || q.includes("maternal")) {
    return "[Healthcare Agent]: Patient risk trends show a 58% susceptibility rate for Type-II Diabetes and 22% rate of readmission. Maternal vitals telemetry is synchronized.";
  }
  if (q.includes("crop") || q.includes("recommendation") || q.includes("haryana") || q.includes("soil") || q.includes("farming")) {
    return "[Agronomic Agent]: For Haryana's soil profile (mildly acidic, low nitrogen), recommended crops are Wheat, Basmati Rice, and Mustard. Moisture levels require irrigation every 3 days.";
  }
  if (q.includes("blockchain") || q.includes("ledger") || q.includes("audit") || q.includes("tamper")) {
    return "[Blockchain Audit Agent]: Legal judgments, maternal health logs, and infrastructure reports are cryptographically signed and hashed. Hashing ensures 100% tamper-proof records.";
  }
  if (q.includes("fake news") || q.includes("reputation") || q.includes("sentiment") || q.includes("social")) {
    return "[Social Governance Agent]: Overall reputation score is 74% positive. The OSINT fake news classification models report zero active threat campaigns targeting your modules.";
  }
  if (q.includes("agents") || q.includes("architecture") || q.includes("multi-agent")) {
    return "[System Architect]: OmniSync utilizes 5 specialized agents: Agent 1 (Data Collection), Agent 2 (Prediction), Agent 3 (Recommendation), Agent 4 (Alert), and Agent 5 (Reporting).";
  }
  if (q.includes("sign language") || q.includes("gesture") || q.includes("accessibility")) {
    return "[Accessibility Agent]: MediaPipe coordinates and Transformer models translate streaming video gestures with a confidence rate of 0.93. Speech synthesis is active.";
  }
  if (q.includes("security") || q.includes("protocol") || q.includes("token") || q.includes("jwt") || q.includes("rbac")) {
    return "[Security Agent]: OmniSync uses custom JSON Web Tokens (JWT) and Role-Based Access Control (RBAC) to restrict and authorize administrative scopes.";
  }
  if (q.includes("integrated") || q.includes("modules") || q.includes("features")) {
    return "[System Architect]: OmniSync integrates 10 AI modules: Public Sentiment, Judicial Records, Cardiometabolic Analytics, Agronomic Resource Planner, Warehouse Stock, Facility Spatial, Logistics Blockchain, Patient Vitals, Civic Hazards, and Accessibility Gestures.";
  }
  if (q.includes("help") || q.includes("what can you do") || q.includes("capabilities")) {
    return "I can explain reports, query geospatial hazard maps, analyze agricultural soil properties, and audit blockchain ledger hashes. Choose a prompt or ask me a direct question.";
  }

  return `[OmniSync AI Copilot]: I've processed your query about "${query}" for the ${context.toUpperCase()} module. The system state is operational.`;
}

export default function AICopilot({ activeTab, API_BASE, isOpen, onClose, chatbaseLoaded }) {
  if (chatbaseLoaded) return null;

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

      const response = await fetch(`${API_BASE}/ai/copilot/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, context: activeTab, user: userObj })
      });
      const data = await response.json();
      
      let replyText = data.reply;
      setMessages(prev => [...prev, { role: 'assistant', text: replyText }]);
    } catch (e) {
      console.warn("Backend copilot query failed, using frontend fallback:", e);
      const fallbackReply = getLocalCopilotFallback(text, activeTab);
      setMessages(prev => [...prev, { role: 'assistant', text: fallbackReply }]);
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

  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const isChatOpen = isOpen || isOpenLocal;

  return (
    <>
      {/* Floating Chatbase Chatbot Bubble Button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsOpenLocal(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, #1e6cf0, #7c3aed)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(30, 108, 240, 0.4)',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transform: 'scale(1)',
          }}
          className="chatbase-bubble-btn"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Floating Chatbase Chatbot Window */}
      {isChatOpen && (
        <div className="copilot-drawer glass-card chatbase-window" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          height: '600px',
          maxHeight: 'calc(100vh - 48px)',
          zIndex: 1000,
          border: '1px solid var(--glass-border)',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(13, 23, 46, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          background: 'var(--bg-secondary)',
          backdropFilter: 'blur(20px)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} />
              <div>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: '700', margin: 0, textAlign: 'left' }}>OmniSync AI Chatbot</h3>
                <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', display: 'block', textAlign: 'left', fontWeight: '600' }}>● Active Online</span>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => {
              if (onClose) onClose();
              setIsOpenLocal(false);
            }}>
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
      )}
    </>
  );
}
