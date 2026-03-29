import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, LayoutDashboard, PlusCircle, LogIn, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '8px',
    fontSize: '13px', fontWeight: 500,
    textDecoration: 'none', transition: 'all 0.2s',
    color: isActive(path) ? 'var(--accent)' : 'var(--text-secondary)',
    background: isActive(path) ? 'var(--accent-soft)' : 'transparent',
  });

  return (
    <nav style={{
      background: 'rgba(17,17,24,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 15px var(--accent-glow)',
        }}>
          <Car size={16} color="white" />
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
          VehicleReg
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Link to="/" style={linkStyle('/')}>
          <Car size={14} /> Vehicles
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/dashboard" style={linkStyle('/dashboard')}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
            <Link to="/vehicle/new" style={linkStyle('/vehicle/new')}>
              <PlusCircle size={14} /> Register
            </Link>
          </>
        )}
      </div>

      {/* Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isAuthenticated ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
              background: 'var(--accent-soft)', borderRadius: '8px', border: '1px solid var(--accent-glow)' }}>
              <Shield size={13} color="var(--accent)" />
              <span style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'Syne', fontWeight: 600 }}>
                {user?.email}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-ghost" style={{ padding: '7px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={13} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '7px 20px', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogIn size={13} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}