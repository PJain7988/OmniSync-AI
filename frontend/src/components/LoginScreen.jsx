import React, { useState, useEffect } from 'react';
import { 
  Shield, Key, Eye, HelpCircle, Lock, Menu, Sparkles, 
  AlertCircle, CheckCircle2, User, Activity, Users, 
  ArrowRight, ArrowRightLeft, Radio, Smartphone 
} from 'lucide-react';

const ROLES = [
  { id: 'admin', name: 'System Administrator', dept: 'IT Operations', scope: 'global:*', handle: '@admin_ops', avatar: 'SA' },
  { id: 'doctor', name: 'Clinical Director', dept: 'Maternal & Medical Services', scope: 'healthcare:*, maternal:*', handle: '@clinical_dir', avatar: 'CD' },
  { id: 'lawyer', name: 'Legal Counsel', dept: 'Judicial Compliance', scope: 'court:*', handle: '@legal_counsel', avatar: 'LC' },
  { id: 'farmer', name: 'Farm Superintendent', dept: 'Agronomy Operations', scope: 'farming:*', handle: '@farm_super', avatar: 'FS' },
  { id: 'logistics', name: 'Logistics Officer', dept: 'Warehouse & Blockchain Ledger', scope: 'retail:*, supplychain:*', handle: '@logistics_officer', avatar: 'LO' },
  { id: 'citizen', name: 'Citizen Operator', dept: 'Public Hazards & Gestures', scope: 'hazards:*, sign:*', handle: '@citizen_op', avatar: 'CO' }
];

const MOCK_NOTIFICATIONS = {
  admin: [
    { title: "JWT Auth Key Signed", text: "Session token authorized for global scope authorization.", time: "Just now" },
    { title: "Zero-Trust Active", text: "OmniSync security shield monitoring 11 systems.", time: "1 min ago" },
    { title: "System Health 100%", text: "All MERN node connections operating at peak status.", time: "3 min ago" }
  ],
  doctor: [
    { title: "Vitals Syncing", text: "Dr. Peterson connected to patient telemetry feeds.", time: "Just now" },
    { title: "Cardiometabolic Alert", text: "Slight anomaly detected in Subject #409. Resolved.", time: "2 min ago" },
    { title: "Clinics Online", text: "Maternal telemetry active across regional networks.", time: "5 min ago" }
  ],
  lawyer: [
    { title: "Judicial Extractor", text: "Processed court order document #1094-A.", time: "Just now" },
    { title: "Compliance Pass", text: "Zero legal compliance exceptions in current block.", time: "4 min ago" },
    { title: "Seal Verification", text: "Digital RSA signature attached to ledger audit.", time: "8 min ago" }
  ],
  farmer: [
    { title: "Agronomy Sync", text: "Recalculated optimal NPK levels for Crop Sectors A & B.", time: "Just now" },
    { title: "Irrigation Flow Open", text: "Smart Valve #4 activated. Flow rate 4.2 L/sec.", time: "1 min ago" },
    { title: "Soil Moisture Normal", text: "Sensor telemetry checks out normal for subsoil grids.", time: "10 min ago" }
  ],
  logistics: [
    { title: "Blockchain Block #1903", text: "Supply Chain block verified. SKU-101 restocked.", time: "Just now" },
    { title: "Spatial Model Synced", text: "Warehouse layout optimized via 3D Spatial AI.", time: "2 min ago" },
    { title: "RFID Node Connected", text: "RFID sensors reported 14 restocking transactions.", time: "6 min ago" }
  ],
  citizen: [
    { title: "Hazard Logged", text: "Pothole detected at Elm St. reported to public works.", time: "Just now" },
    { title: "Accessibility Online", text: "Sign language interpretation engine ready.", time: "1 min ago" },
    { title: "Public Sentiment 84%", text: "Positive sentiment trends rising across local networks.", time: "12 min ago" }
  ]
};

export default function LoginScreen({ onLogin, API_BASE }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin@omnisync.ai');
  const [password, setPassword] = useState('password123');
  const [handle, setHandle] = useState('@admin_ops');
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [activeShowcase, setActiveShowcase] = useState(null);
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [phoneTime, setPhoneTime] = useState('9:41');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-populate defaults based on selected role
  useEffect(() => {
    setEmail(`${selectedRole.id}@omnisync.ai`);
    setHandle(selectedRole.handle);
    setPassword('password123');
    setAuthError('');
    setAuthSuccess('');
  }, [selectedRole, isRegister]);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setPhoneTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate simulated JWT Token (Local Fallback)
  const generateJWT = (role) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=/g, "");
    const payload = btoa(JSON.stringify({
      iss: "omnisync-auth",
      sub: role.id,
      name: role.name,
      dept: role.dept,
      scope: role.scope,
      exp: Math.floor(Date.now() / 1000) + 3600
    })).replace(/=/g, "");
    const signature = btoa("omnisync-secret-hash-" + role.id).replace(/=/g, "").slice(0, 32);
    return `${header}.${payload}.${signature}`;
  };

  const handleAuth = async () => {
    setAuthError('');
    setAuthSuccess('');
    setLoading(true);

    const endpoint = isRegister ? 'register' : 'login';
    const payload = isRegister 
      ? { email, password, roleId: selectedRole.id, handle }
      : { email, password };

    try {
      const response = await fetch(`${API_BASE}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setAuthError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      setAuthSuccess(isRegister ? 'Account created! Redirecting...' : 'Login authorized!');
      
      setTimeout(() => {
        onLogin({ role: data.user.role, token: data.token, email: data.user.email });
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.warn("Backend auth failed, invoking local fallback...", err);
      setAuthError('Server connection error. Invoking local cryptographic emulation...');
      
      setTimeout(() => {
        const token = generateJWT(selectedRole);
        onLogin({ role: selectedRole, token });
        setLoading(false);
      }, 1500);
    }
  };

  const currentNotifications = MOCK_NOTIFICATIONS[selectedRole.id] || [];

  return (
    <div className="login-screen-container" style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 1
    }}>
      {/* Glow Orbs in background */}
      <div className="theme-light-glow" style={{ top: '-10%', left: '-10%' }} />
      <div className="theme-light-glow" style={{ bottom: '-10%', right: '-10%' }} />

      {/* Watermarks */}
      <div className="watermark-bg watermark-top">OMNISYNC</div>
      <div className="watermark-bg watermark-bottom">DIVERSITY</div>

      {/* Tilted Floating Badges */}
      <div className="floating-tilted-badge" style={{ top: '16%', left: '8%' }}>COGNITIVE SUITE</div>
      <div className="floating-tilted-badge alt" style={{ top: '25%', left: '4%', animationDelay: '0.5s' }}>RBAC SECURE</div>
      <div className="floating-tilted-badge" style={{ top: '78%', left: '6%', animationDelay: '1s' }}>MERN TELEMETRY</div>
      <div className="floating-tilted-badge alt" style={{ top: '65%', right: '5%', animationDelay: '1.5s' }}>REAL-TIME SHIELD</div>
      <div className="floating-tilted-badge" style={{ top: '15%', right: '12%' }}>ZERO TRUST</div>
      <div className="floating-tilted-badge alt" style={{ top: '24%', right: '8%', animationDelay: '0.8s' }}>MULTI-AGENT</div>

      {/* Premium Header */}
      <header style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 24px',
        background: 'rgba(255, 255, 255, 0.45)',
        border: '1px solid rgba(30, 108, 240, 0.12)',
        borderRadius: '50px',
        boxShadow: '0 8px 32px rgba(13, 23, 46, 0.03)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-icon" style={{
            background: 'linear-gradient(135deg, #1e6cf0, #7c3aed)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            color: '#fff',
            fontSize: '16px',
            boxShadow: '0 4px 15px rgba(30, 108, 240, 0.2)'
          }}>O</div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f1a30', letterSpacing: '-0.5px' }}>OmniSync AI</span>
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="desktop-nav">
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#40516b', cursor: 'pointer' }}>Home</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#40516b', cursor: 'pointer' }}>About Us</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#40516b', cursor: 'pointer' }}>Security</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#40516b', cursor: 'pointer' }}>Compliance</span>
        </nav>

        <button className="btn btn-primary" onClick={handleAuth} style={{
          borderRadius: '50px',
          padding: '8px 20px',
          fontSize: '12px',
          background: 'linear-gradient(135deg, #1e6cf0, #005eff)',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(30, 108, 240, 0.25)',
          border: 'none',
          cursor: 'pointer'
        }}>
          System Portal <ArrowRight size={14} style={{ marginLeft: '4px' }} />
        </button>
      </header>

      {/* Main Content Body */}
      <main className="login-main-grid" style={{ maxWidth: '1100px' }}>
        {/* Left Side: Title, Pills, Console */}
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: 0 }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            color: '#1e6cf0',
            marginBottom: '12px',
            display: 'block' 
          }}>
            Identity Access & Synchronization
          </span>
          <h1 style={{ 
            fontSize: '44px', 
            fontWeight: '800', 
            color: '#0f1a30', 
            lineHeight: '1.15', 
            marginBottom: '20px',
            letterSpacing: '-1px' 
          }}>
            Security That Acts <br/>
            Before It's Too Late
          </h1>
          <p style={{ fontSize: '15px', color: '#40516b', marginBottom: '24px', lineHeight: '1.5' }}>
            OmniSync converges 10 smart agents under cryptographically authorized MERN credentials. Verify token structures in real time below.
          </p>

          {/* Marquee Pill Bar */}
          <div className="feature-marquee-container">
            <div className="feature-marquee-track">
              {/* First Track */}
              <div className="feature-pill">🛡️ Visible Patrols</div>
              <div className="feature-pill">🏥 Patient Vitals</div>
              <div className="feature-pill">🔗 Blockchain Logs</div>
              <div className="feature-pill">🌾 Agronomic Sync</div>
              <div className="feature-pill">📐 Spatial 3D Modeler</div>
              <div className="feature-pill">⚖️ Judicial Extraction</div>
              <div className="feature-pill">📊 Social Sentiment</div>
              {/* Repeated Track for looping */}
              <div className="feature-pill">🛡️ Visible Patrols</div>
              <div className="feature-pill">🏥 Patient Vitals</div>
              <div className="feature-pill">🔗 Blockchain Logs</div>
              <div className="feature-pill">🌾 Agronomic Sync</div>
              <div className="feature-pill">📐 Spatial 3D Modeler</div>
              <div className="feature-pill">⚖️ Judicial Extraction</div>
              <div className="feature-pill">📊 Social Sentiment</div>
            </div>
          </div>

          {/* Interactive Console Card */}
          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(30, 108, 240, 0.12)',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 12px 40px rgba(13, 23, 46, 0.04)',
            backdropFilter: 'blur(10px)',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '18px', color: '#0f1a30', marginBottom: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: '#1e6cf0' }} /> Workspace Authorization
            </h3>

            {/* Toggle header between Sign In and Register */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(30, 108, 240, 0.12)', marginBottom: '20px' }}>
              <button 
                onClick={() => { setIsRegister(false); setAuthError(''); setAuthSuccess(''); }}
                style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: !isRegister ? '2px solid #1e6cf0' : 'none', fontWeight: !isRegister ? '700' : '500', color: !isRegister ? '#1e6cf0' : '#73849c', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsRegister(true); setAuthError(''); setAuthSuccess(''); }}
                style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: isRegister ? '2px solid #1e6cf0' : 'none', fontWeight: isRegister ? '700' : '500', color: isRegister ? '#1e6cf0' : '#73849c', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease' }}
              >
                Register
              </button>
            </div>

            {/* Notifications and status alerts */}
            {authError && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '10px', color: '#ef4444', fontSize: '11px', fontWeight: '600', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={14} /> {authError}
              </div>
            )}
            {authSuccess && (
              <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#10b981', fontSize: '11px', fontWeight: '600', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} /> {authSuccess}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#73849c', fontWeight: '700' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  className="form-control" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px 12px 38px', 
                    borderRadius: '12px', 
                    background: '#ffffff', 
                    border: '1px solid rgba(30, 108, 240, 0.15)', 
                    color: '#0f1a30',
                    fontWeight: '600'
                  }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#73849c' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#73849c', fontWeight: '700' }}>
                Secure Token Cryptographic Key
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="form-control" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px 12px 38px', 
                    borderRadius: '12px', 
                    background: '#ffffff', 
                    border: '1px solid rgba(30, 108, 240, 0.15)', 
                    color: '#0f1a30' 
                  }}
                  placeholder="Enter key..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#73849c' }} />
              </div>
            </div>

            {isRegister && (
              <>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#73849c', fontWeight: '700' }}>
                    System Handle
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ 
                        width: '100%', 
                        padding: '12px 14px 12px 38px', 
                        borderRadius: '12px', 
                        background: '#ffffff', 
                        border: '1px solid rgba(30, 108, 240, 0.15)', 
                        color: '#0f1a30' 
                      }}
                      placeholder="@handle"
                      value={handle}
                      onChange={e => setHandle(e.target.value)}
                    />
                    <Sparkles size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#73849c' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#73849c', fontWeight: '700' }}>
                    MERN Access Scope
                  </label>
                  <select 
                    className="form-control" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      borderRadius: '12px', 
                      background: '#ffffff', 
                      border: '1px solid rgba(30, 108, 240, 0.15)', 
                      color: '#0f1a30',
                      fontWeight: '600'
                    }}
                    value={selectedRole.id}
                    onChange={(e) => {
                      const found = ROLES.find(r => r.id === e.target.value);
                      setSelectedRole(found);
                    }}
                  >
                    {ROLES.map(role => (
                      <option key={role.id} value={role.id} style={{ background: '#ffffff', color: '#0f1a30' }}>
                        {role.name} ({role.dept})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {!isRegister && (
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#73849c', fontWeight: '700' }}>
                  Pre-config Profile Autofill
                </label>
                <select 
                  className="form-control" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    borderRadius: '12px', 
                    background: '#ffffff', 
                    border: '1px solid rgba(30, 108, 240, 0.15)', 
                    color: '#0f1a30',
                    fontWeight: '600'
                  }}
                  value={selectedRole.id}
                  onChange={(e) => {
                    const found = ROLES.find(r => r.id === e.target.value);
                    setSelectedRole(found);
                  }}
                >
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id} style={{ background: '#ffffff', color: '#0f1a30' }}>
                      {role.name} ({role.dept})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #1e6cf0, #005eff)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(30, 108, 240, 0.25)',
                opacity: loading ? 0.7 : 1
              }}
              onClick={handleAuth}
              disabled={loading}
            >
              {loading ? 'Processing Cryptography...' : (isRegister ? 'Register & Authorize' : 'Authorize Session')} <ArrowRight size={16} />
            </button>

            {/* Quick SSO buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, fontSize: '11px', padding: '10px', borderRadius: '10px', background: '#ffffff', border: '1px solid rgba(30, 108, 240, 0.1)' }}
                onClick={() => alert('SSO login simulated successfully.')}
              >
                Google SSO
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, fontSize: '11px', padding: '10px', borderRadius: '10px', background: '#ffffff', border: '1px solid rgba(30, 108, 240, 0.1)' }}
                onClick={() => alert('Microsoft Azure SSO simulated.')}
              >
                Active Directory
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Virtual Phone Mockup & Floating Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '20px 0'
        }}>
          {/* Floating Profile Capsule Badge (styled after hamida_jannat design card) */}
          <div className="profile-capsule" style={{
            position: 'absolute',
            top: '30px',
            right: '-10px',
            transform: 'rotate(2deg)',
            zIndex: 10
          }}>
            <div className="profile-capsule-avatar">
              {selectedRole.avatar}
            </div>
            <div className="profile-capsule-info">
              <span className="profile-capsule-handle">{selectedRole.handle}</span>
              <span className="profile-capsule-role">{selectedRole.name}</span>
            </div>
          </div>

          {/* Stacked active node stats capsule */}
          <div className="profile-capsule" style={{
            position: 'absolute',
            top: '120px',
            left: '-20px',
            transform: 'rotate(-4deg)',
            zIndex: 10,
            padding: '8px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', marginRight: '4px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#cbdff2', border: '1px solid #fff', display: 'inline-block', fontSize: '8px', textAlign: 'center', lineHeight: '18px', color: '#1e6cf0', fontWeight: '700' }}>U1</span>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#cbdff2', border: '1px solid #fff', display: 'inline-block', fontSize: '8px', textAlign: 'center', lineHeight: '18px', color: '#1e6cf0', fontWeight: '700', marginLeft: '-6px' }}>U2</span>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#cbdff2', border: '1px solid #fff', display: 'inline-block', fontSize: '8px', textAlign: 'center', lineHeight: '18px', color: '#1e6cf0', fontWeight: '700', marginLeft: '-6px' }}>U3</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#0f1a30' }}>300+ Sync Nodes Active</span>
            </div>
          </div>

          {/* Families guard info capsule */}
          <div className="profile-capsule" style={{
            position: 'absolute',
            bottom: '80px',
            left: '-10px',
            transform: 'rotate(3deg)',
            zIndex: 10,
            padding: '6px 14px'
          }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#1e6cf0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Affordable Secure Safeguard
            </span>
          </div>

          {/* Virtual CSS Smartphone Mockup */}
          <div className="phone-mockup-wrapper">
            <div className="phone-screen">
              {/* Dynamic Island Notch */}
              <div className="phone-notch" />

              {/* Status bar */}
              <div className="phone-status-bar">
                <span>{phoneTime}</span>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span>5G</span>
                  <div style={{ width: '15px', height: '8px', border: '1px solid #fff', borderRadius: '2px', padding: '1px', display: 'flex' }}>
                    <div style={{ width: '100%', height: '100%', background: '#fff' }} />
                  </div>
                </div>
              </div>

              {/* Live Notifications Feed */}
              <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
                  Live Telemetry Monitor
                </span>
              </div>

              <div className="phone-notifications-list">
                {currentNotifications.map((notif, idx) => (
                  <div key={idx} className="phone-notification-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                      <strong style={{ fontWeight: '700', color: '#ffffff' }}>{notif.title}</strong>
                      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>{notif.time}</span>
                    </div>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '10px', lineHeight: '1.4' }}>
                      {notif.text}
                    </p>
                  </div>
                ))}

                {/* Simulated locked screen wallpaper content */}
                <div style={{
                  marginTop: 'auto',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'center'
                }}>
                  <Sparkles size={20} style={{ color: '#60a5fa', marginBottom: '6px' }} />
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>Agentic Synchronization</div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Locked & Cryptographically Sealed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Corporate Partners & Trust Section */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1100px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '40px', 
        margin: '0 auto 60px', 
        padding: '24px 0', 
        borderTop: '1px solid rgba(30, 108, 240, 0.08)',
        borderBottom: '1px solid rgba(30, 108, 240, 0.08)',
        flexWrap: 'wrap', 
        opacity: 0.5,
        zIndex: 5
      }}>
        <span style={{ fontSize: '10px', fontWeight: '800', color: '#73849c', letterSpacing: '2px' }}>ENTERPRISE SYNC PARTNERS:</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f1a30', letterSpacing: '1px' }}>◆ NEXUS CAPITAL</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f1a30', letterSpacing: '1px' }}>⬢ CYBERDYNE HEALTH</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f1a30', letterSpacing: '1px' }}>▲ APEX DIGITAL</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f1a30', letterSpacing: '1px' }}>■ VANGUARD SYSTEMS</span>
      </div>

      {/* JWT Token Visualizer Panel below */}
      <section style={{
        width: '100%',
        maxWidth: '1100px',
        background: 'rgba(255, 255, 255, 0.65)',
        border: '1px solid rgba(30, 108, 240, 0.12)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 8px 32px rgba(13, 23, 46, 0.02)',
        backdropFilter: 'blur(10px)',
        zIndex: 5,
        textAlign: 'left',
        marginBottom: '60px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f1a30' }}>
              MERN Token Signature Sandbox
            </h3>
            <p style={{ fontSize: '12px', color: '#73849c', margin: 0 }}>
              Inspect the digitally encoded JWT payload matching your selected role.
            </p>
          </div>
          <button 
            style={{ 
              background: 'rgba(30, 108, 240, 0.06)', 
              border: '1px solid rgba(30, 108, 240, 0.12)', 
              color: '#1e6cf0', 
              fontSize: '12px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: '700'
            }}
            onClick={() => setShowTokenDetails(!showTokenDetails)}
          >
            <Eye size={14} /> {showTokenDetails ? 'Hide Structure' : 'Inspect Token Claims'}
          </button>
        </div>

        {/* Encoded Token Representation */}
        <div style={{ 
          background: '#ffffff', 
          padding: '16px', 
          borderRadius: '12px', 
          border: '1px solid rgba(30, 108, 240, 0.08)', 
          fontSize: '11px', 
          fontFamily: 'monospace', 
          wordBreak: 'break-all', 
          color: '#0f1a30',
          lineHeight: '1.6',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <span style={{ color: '#ef4444', fontWeight: '700' }}>{btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=/g, "").slice(0, 25)}</span>
          .
          <span style={{ color: '#3b82f6', fontWeight: '700' }}>{btoa(JSON.stringify({
            iss: "omnisync-auth",
            sub: selectedRole.id,
            name: selectedRole.name,
            scope: selectedRole.scope,
            exp: Math.floor(Date.now() / 1000) + 3600
          })).replace(/=/g, "").slice(0, 95)}</span>
          .
          <span style={{ color: '#8b5cf6', fontWeight: '700' }}>{btoa("omnisync-secret-hash-" + selectedRole.id).replace(/=/g, "").slice(0, 25)}</span>
        </div>

        {showTokenDetails && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1.2fr', 
            gap: '20px', 
            marginTop: '20px', 
            borderTop: '1px solid rgba(30, 108, 240, 0.08)', 
            paddingTop: '20px' 
          }}>
            <div>
              <strong style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Header (Algorithm Details):</strong>
              <pre style={{ fontSize: '11px', color: '#40516b', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid rgba(30, 108, 240, 0.08)', margin: 0 }}>
                {`{\n  "alg": "HS256",\n  "typ": "JWT"\n}`}
              </pre>
            </div>
            <div>
              <strong style={{ color: '#3b82f6', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Payload Claims (Role Scope):</strong>
              <pre style={{ fontSize: '11px', color: '#40516b', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid rgba(30, 108, 240, 0.08)', margin: 0 }}>
                {JSON.stringify({
                  iss: "omnisync-auth",
                  sub: selectedRole.id,
                  name: selectedRole.name,
                  dept: selectedRole.dept,
                  scope: selectedRole.scope,
                  exp: '1 hour session'
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </section>

      {/* Dynamic Feature Showcase Section */}
      <section style={{
        width: '100%',
        maxWidth: '1100px',
        zIndex: 5,
        marginBottom: '60px',
        textAlign: 'left'
      }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '2px', 
          color: '#1e6cf0', 
          marginBottom: '10px',
          display: 'block' 
        }}>
          OmniSync Intelligence Modules
        </span>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '800', 
          color: '#0f1a30', 
          marginBottom: '12px',
          letterSpacing: '-0.5px' 
        }}>
          Explore Our Cognitive Suites
        </h2>
        <p style={{ fontSize: '14px', color: '#40516b', marginBottom: '32px', maxWidth: '700px', lineHeight: '1.5' }}>
          Preview the underlying analytical frameworks and data structures handled by each micro-agent suite before starting your session.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '30px'
        }}>
          {/* Module 1: AI Governance */}
          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.75)',
            border: activeShowcase === 'governance' ? '2px solid #1e6cf0' : '1px solid rgba(30, 108, 240, 0.12)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => setActiveShowcase('governance')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '24px' }}>📊</span>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f1a30', margin: 0 }}>Social Sentiment & Reputation</h3>
              </div>
              <p style={{ fontSize: '12px', color: '#73849c', lineHeight: '1.5', marginBottom: '16px' }}>
                Performs deep sentiment extraction on real-time feeds to compute reputation coefficients and alert of social media crises.
              </p>
            </div>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', fontSize: '11px', fontFamily: 'monospace', border: '1px solid rgba(30,108,240,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Reputation Score:</span>
                <strong style={{ color: '#10b981' }}>87.4 / 100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Risk Level:</span>
                <span style={{ color: '#10b981', fontWeight: '700' }}>Low Risk</span>
              </div>
            </div>
          </div>

          {/* Module 2: Legal Intelligence */}
          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.75)',
            border: activeShowcase === 'legal' ? '2px solid #1e6cf0' : '1px solid rgba(30, 108, 240, 0.12)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => setActiveShowcase('legal')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '24px' }}>⚖️</span>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f1a30', margin: 0 }}>Legal Entity Extraction</h3>
              </div>
              <p style={{ fontSize: '12px', color: '#73849c', lineHeight: '1.5', marginBottom: '16px' }}>
                Extracts key court metadata, petitioner details, and judgment terms from scanned court order PDF documents.
              </p>
            </div>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', fontSize: '11px', fontFamily: 'monospace', border: '1px solid rgba(30,108,240,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Case ID:</span>
                <strong>2025/001</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Petitioner:</span>
                <strong>XYZ Corp</strong>
              </div>
            </div>
          </div>

          {/* Module 3: Healthcare */}
          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.75)',
            border: activeShowcase === 'healthcare' ? '2px solid #1e6cf0' : '1px solid rgba(30, 108, 240, 0.12)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => setActiveShowcase('healthcare')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '24px' }}>🏥</span>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f1a30', margin: 0 }}>Predictive Analytics</h3>
              </div>
              <p style={{ fontSize: '12px', color: '#73849c', lineHeight: '1.5', marginBottom: '16px' }}>
                Computes cardiovascular risks, glucose tendencies, and readmission probabilities using adaptive mathematical modeling.
              </p>
            </div>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', fontSize: '11px', fontFamily: 'monospace', border: '1px solid rgba(30,108,240,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Heart Risk:</span>
                <strong style={{ color: '#f59e0b' }}>34% (Medium)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Readmissions:</span>
                <strong>Low Probability</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase Expanded View Panel */}
        {activeShowcase && (
          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.85)',
            border: '2px solid #1e6cf0',
            borderRadius: '24px',
            padding: '28px',
            animation: 'slide-down 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f1a30', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡ Interactive Mock Engine:</span>
                <span style={{ color: '#1e6cf0' }}>{activeShowcase} telemetry</span>
              </h4>
              <button 
                onClick={() => setActiveShowcase(null)}
                style={{ background: 'none', border: 'none', color: '#73849c', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}
              >
                Close Preview
              </button>
            </div>

            {activeShowcase === 'governance' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#0f1a30', marginBottom: '8px' }}>Sentiment Breakdown Analysis</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                        <span>Positive Mentions</span>
                        <strong>72%</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '72%', height: '100%', background: '#10b981' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                        <span>Neutral Conversations</span>
                        <strong>18%</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '18%', height: '100%', background: '#3b82f6' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                        <span>Negative Flags</span>
                        <strong>10%</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '10%', height: '100%', background: '#ef4444' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid rgba(30,108,240,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#73849c', marginBottom: '6px' }}>CRISIS ADVISORY TELEMETRY</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>✓ No brand crisis detected</div>
                  <p style={{ fontSize: '11px', color: '#40516b', margin: 0, lineHeight: '1.4' }}>
                    Social sentiment indicators remain high. Net promoter index has advanced 2.4 points over the past 48 hours.
                  </p>
                </div>
              </div>
            )}

            {activeShowcase === 'legal' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#0f1a30', marginBottom: '8px' }}>Extracted Judicial Document Schema</h5>
                  <pre style={{ margin: 0, background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid rgba(30,108,240,0.08)', fontSize: '10px', color: '#40516b', fontFamily: 'monospace' }}>
{`{
  "case_no": "2025/001",
  "judge_name": "Hon. Albert Higgins",
  "petitioner": "XYZ Logistics Corp",
  "respondent": "PQR Port Operations",
  "judgment_summary": "Order granted in favor of petitioner..."
}`}
                  </pre>
                </div>
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid rgba(30,108,240,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#73849c', marginBottom: '6px' }}>OCR CLASSIFICATION FEED</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e6cf0', marginBottom: '4px' }}>OCR Accuracy: 99.4%</div>
                  <p style={{ fontSize: '11px', color: '#40516b', margin: 0, lineHeight: '1.4' }}>
                    DeepNLP agent successfully mapped 14 named entities and parsed the compliance schedule for automatic ledger auditing.
                  </p>
                </div>
              </div>
            )}

            {activeShowcase === 'healthcare' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#0f1a30', marginBottom: '8px' }}>Calculated Risk Tendency Coefficients</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#40516b', width: '120px' }}>Cardiopathic Risk</span>
                      <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginRight: '10px' }}>
                        <div style={{ width: '45%', height: '100%', background: '#f59e0b' }} />
                      </div>
                      <strong style={{ fontSize: '11px', color: '#f59e0b' }}>0.45</strong>
                    </div>
                    <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#40516b', width: '120px' }}>Diabetes Mellitus</span>
                      <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginRight: '10px' }}>
                        <div style={{ width: '15%', height: '100%', background: '#10b981' }} />
                      </div>
                      <strong style={{ fontSize: '11px', color: '#10b981' }}>0.15</strong>
                    </div>
                    <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#40516b', width: '120px' }}>ICU Readmission</span>
                      <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginRight: '10px' }}>
                        <div style={{ width: '60%', height: '100%', background: '#ef4444' }} />
                      </div>
                      <strong style={{ fontSize: '11px', color: '#ef4444' }}>0.60</strong>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid rgba(30,108,240,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#73849c', marginBottom: '6px' }}>CLINICAL STRATIFICATION ADVICE</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>⚠ Patient Readmission Alert</div>
                  <p style={{ fontSize: '11px', color: '#40516b', margin: 0, lineHeight: '1.4' }}>
                    Patient exhibits significant readmission indicators due to recent vital fluctuations.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Step by Step Guide Section (styled after the bottom of the Guarrent design) */}
      <section className="step-guide-container" style={{
        width: '100%',
        maxWidth: '1100px',
        zIndex: 5,
        marginBottom: '40px'
      }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '2px', 
          color: '#1e6cf0', 
          marginBottom: '10px',
          display: 'block' 
        }}>
          Operations Architecture
        </span>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '800', 
          color: '#0f1a30', 
          marginBottom: '32px',
          letterSpacing: '-0.5px' 
        }}>
          How Deterrence Works: A Step-By-Step Guide
        </h2>

        <div className="step-guide-grid">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-card-num">01</div>
            <div className="step-card-title">SUB-AGENT LOGIN</div>
            <p className="step-card-text">
              Select your specific operational profile roles. Digital signatures authorize access to sandboxed module telemetry interfaces.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-card" style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)',
            border: 'none',
            color: '#ffffff'
          }}>
            <div className="step-card-num" style={{ color: 'rgba(255,255,255,0.15)' }}>02</div>
            <div className="step-card-title" style={{ color: '#ffffff' }}>TELEMETRY HARVESTING</div>
            <p className="step-card-text" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Active sensors pull road hazards, cardiac rates, agronomy moisture levels, and blockchain inventory structures to standard state pools.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-card-num">03</div>
            <div className="step-card-title">CRITICAL RESPONSES</div>
            <p className="step-card-text">
              Instantly broadcast alerts via WhatsApp, SMS, or Push notifications using the multi-channel fallback messaging architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '24px 0',
        borderTop: '1px solid rgba(30, 108, 240, 0.08)',
        width: '100%',
        maxWidth: '1100px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 5
      }}>
        <span style={{ fontSize: '12px', color: '#73849c' }}>
          &copy; 2026 OmniSync AI Suite. Cryptographically Secure Portal.
        </span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#73849c', cursor: 'pointer' }}>Terms of Use</span>
          <span style={{ fontSize: '12px', color: '#73849c', cursor: 'pointer' }}>Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
}
