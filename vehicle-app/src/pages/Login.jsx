import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate request
    const result = login(email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px 20px',
    }}>
      {/* Glow orb */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="card fade-up" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: '0 0 30px var(--accent-glow)',
          }}>
            <Car size={24} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Sign in to manage vehicle registrations
          </p>
        </div>

        {/* Demo credentials hint */}
        <div style={{
          background: 'var(--accent-soft)', border: '1px solid var(--accent-glow)',
          borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
          fontSize: '12px', color: 'var(--text-secondary)',
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: 'Syne' }}>Demo: </span>
          test@gmail.com / Password!234
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '8px',
            color: 'var(--danger)', fontSize: '13px',
          }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'Syne', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="test@gmail.com" required
                className="input-field" style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'Syne', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="input-field" style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? (
              <><span className="pulse-dot">●</span> Authenticating...</>
            ) : (
              <>Sign In <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to public list</Link>
        </p>
      </div>
    </div>
  );
}