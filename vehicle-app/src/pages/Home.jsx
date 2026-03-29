import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllVehicles } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Car, Search, Eye, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const statusBadge = (s) => {
  const map = { NEW: 'badge-success', USED: 'badge-warning', REBUILT: 'badge-muted' };
  return <span className={`badge ${map[s] || 'badge-muted'}`}>{s}</span>;
};

const typeBadge = (t) => {
  const map = { ELECTRIC: 'badge-accent', SUV: 'badge-muted', TRUCK: 'badge-muted' };
  return <span className={`badge ${map[t] || 'badge-muted'}`}>{t}</span>;
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getAllVehicles().then(r => r.data),
  });

  const filtered = data.filter(v =>
    [v.manufacture, v.model, v.vehicleType, v.status]
      .join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '40px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero */}
      <div className="fade-up" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <p style={{ color: 'var(--accent)', fontSize: '12px', fontFamily: 'Syne', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Public Registry
            </p>
            <h1 style={{ fontFamily: 'Syne', fontSize: '36px', fontWeight: 800, lineHeight: 1.1, marginBottom: '10px' }}>
              Registered Vehicles
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {data.length} vehicles in the national registry
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/vehicle/new" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={15} /> Register New Vehicle
            </Link>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="fade-up" style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={15} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by make, model, type..."
          className="input-field" style={{ paddingLeft: '44px', maxWidth: '380px' }}
        />
      </div>

      {/* Table */}
      <div className="card fade-up" style={{ overflow: 'hidden' }}>
        {isLoading && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="pulse-dot" style={{ fontSize: '24px', marginBottom: '12px' }}>●</div>
            Loading registry...
          </div>
        )}

        {isError && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--danger)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={32} />
            <p>Failed to load vehicle registry</p>
          </div>
        )}

        {!isLoading && !isError && (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Make & Model</th>
                <th>Year</th>
                <th>Type</th>
                <th>Fuel</th>
                <th>Purpose</th>
                <th>Status</th>
                {isAuthenticated && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No vehicles found</td></tr>
              )}
              {filtered.map((v, i) => (
                <tr key={v.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'monospace' }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.manufacture}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.model}</div>
                  </td>
                  <td style={{ fontFamily: 'Syne', fontWeight: 700 }}>{v.year}</td>
                  <td>{typeBadge(v.vehicleType)}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{v.fuelType}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{v.purpose}</td>
                  <td>{statusBadge(v.status)}</td>
                  {isAuthenticated && (
                    <td>
                      <Link to={`/vehicle/${v.id}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        color: 'var(--accent)', fontSize: '12px', textDecoration: 'none',
                        padding: '5px 12px', borderRadius: '6px', background: 'var(--accent-soft)',
                        fontFamily: 'Syne', fontWeight: 600, transition: 'all 0.2s',
                      }}>
                        <Eye size={12} /> View
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!isAuthenticated && (
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          {' '}to view details, register, or manage vehicles
        </p>
      )}
    </div>
  );
}