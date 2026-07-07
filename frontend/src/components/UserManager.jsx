import React, { useState, useEffect } from 'react';

const ROLES = [
  { id: 'admin', name: 'System Administrator', dept: 'IT Operations', avatar: 'SA' },
  { id: 'doctor', name: 'Clinical Director', dept: 'Maternal & Medical Services', avatar: 'CD' },
  { id: 'lawyer', name: 'Legal Counsel', dept: 'Judicial Compliance', avatar: 'LC' },
  { id: 'farmer', name: 'Farm Superintendent', dept: 'Agronomy Operations', avatar: 'FS' },
  { id: 'logistics', name: 'Logistics Officer', dept: 'Warehouse & Blockchain Ledger', avatar: 'LO' },
  { id: 'citizen', name: 'Citizen Operator', dept: 'Public Hazards & Gestures', avatar: 'CO' }
];

export default function UserManager({ API_BASE, triggerAlert }) {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [roleId, setRoleId] = useState('doctor');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    if (!token) return;
    setFetching(true);
    try {
      const response = await fetch(`${API_BASE}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.users);
      } else {
        console.warn("Failed to fetch users", data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!email || !password || !roleId) {
      setError('Please fill in email, password and role.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, password, roleId, handle: handle || undefined })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to create user');
        triggerAlert('sms', `Failed to provision user: ${data.error || 'Server error'}`);
      } else {
        setSuccess(`Successfully provisioned user: ${email}`);
        triggerAlert('push', `Successfully provisioned new identity: ${email}`);
        setEmail('');
        setPassword('');
        setHandle('');
        fetchUsers();
      }
    } catch (err) {
      setError('Connection error. Failed to communicate with directory authority.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '10px 0', textAlign: 'left' }}>
      <header style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          User Access Provisioner
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Directory Management Console. Authorize and provision secure institutional identities into the MongoDB credential pool.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', alignItems: 'start' }}>
        {/* Left Column: Form */}
        <div className="glass-card" style={{ padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔑</span> Provision New Member
          </h3>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '10px', color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#10b981', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@omnisync.ai"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#ffffff', color: '#000', fontWeight: '600' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                Temporary Cryptographic Key
              </label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#ffffff', color: '#000' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                System Handle
              </label>
              <input 
                type="text" 
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder="@username"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#ffffff', color: '#000' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                Assign Institutional Role
              </label>
              <select 
                value={roleId}
                onChange={e => setRoleId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#ffffff', color: '#000', fontWeight: '600' }}
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.dept})
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: '700', marginTop: '10px', cursor: 'pointer' }}
            >
              {loading ? 'Cryptographic Sealing...' : 'Provision User Identity'}
            </button>
          </form>
        </div>

        {/* Right Column: Directory List */}
        <div className="glass-card" style={{ padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👥</span> Directory Authority (MongoDB)
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {fetching ? 'Syncing...' : `${users.length} Identities`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {users.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                {fetching ? 'Reading from credential directory...' : 'No users found in directory.'}
              </p>
            ) : (
              users.map(u => {
                const roleObj = ROLES.find(r => r.id === u.role.id) || ROLES[1];
                return (
                  <div 
                    key={u.email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.45)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '11px'
                    }}>
                      {u.role.avatar || roleObj.avatar}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {u.role.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {u.email} &bull; <span style={{ fontFamily: 'monospace' }}>{u.role.handle}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase' }}>
                      Active
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
