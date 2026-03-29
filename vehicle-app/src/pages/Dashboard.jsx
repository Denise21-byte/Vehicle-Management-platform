import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllVehicles, deleteVehicle } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Car, Zap, Plus, Trash2, Eye, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user }        = useAuth();
  const queryClient     = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getAllVehicles().then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Vehicle deleted successfully');
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete vehicle'),
  });

  const stats = [
    { label: 'Total Vehicles',    value: vehicles.length,                                  icon: Car,        color: 'var(--accent)' },
    { label: 'Electric Vehicles', value: vehicles.filter(v => v.vehicleType==='ELECTRIC').length, icon: Zap, color: '#10B981' },
    { label: 'New Vehicles',      value: vehicles.filter(v => v.status==='NEW').length,    icon: TrendingUp, color: '#F59E0B' },
    { label: 'Commercial',        value: vehicles.filter(v => v.purpose==='COMMERCIAL').length, icon: Car, color: '#8B5CF6' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '4px' }}>Welcome back,</p>
          <h1 style={{ fontFamily: 'Syne', fontSize: '28px', fontWeight: 800 }}>{user?.email}</h1>
        </div>
        <Link to="/vehicle/new" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={15} /> Register Vehicle
        </Link>
      </div>

      {/* Stats */}
      <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'Syne', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {s.label}
                </p>
                <p style={{ fontSize: '32px', fontFamily: 'Syne', fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card fade-up" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '16px', fontWeight: 700 }}>Vehicle Registry</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vehicles.length} total</span>
        </div>

        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Make & Model</th><th>Year</th><th>Type</th>
                <th>Fuel</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{v.manufacture}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.model}</div>
                  </td>
                  <td style={{ fontFamily: 'Syne', fontWeight: 700 }}>{v.year}</td>
                  <td><span className="badge badge-accent">{v.vehicleType}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{v.fuelType}</td>
                  <td>
                    <span className={`badge ${v.status==='NEW' ? 'badge-success' : v.status==='USED' ? 'badge-warning' : 'badge-muted'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/vehicle/${v.id}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        color: 'var(--accent)', fontSize: '12px', textDecoration: 'none',
                        padding: '5px 10px', borderRadius: '6px', background: 'var(--accent-soft)',
                      }}>
                        <Eye size={11} /> View
                      </Link>
                      <button onClick={() => setDeleteId(v.id)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        color: 'var(--danger)', fontSize: '12px', cursor: 'pointer',
                        padding: '5px 10px', borderRadius: '6px',
                        background: 'rgba(239,68,68,0.08)', border: 'none',
                      }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ padding: '32px', width: '360px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertCircle size={24} color="var(--danger)" />
            </div>
            <h3 style={{ fontFamily: 'Syne', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Confirm Delete</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteId(null)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="btn-danger" style={{ flex: 1 }}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}