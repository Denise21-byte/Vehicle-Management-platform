import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, Info, User, FileText, Shield, AlertCircle } from 'lucide-react';
import {
  getVehicleInfo, getVehicleOwner,
  getVehicleRegistration, getVehicleInsurance,
  deleteVehicle,
} from '../services/api';

const TABS = [
  { key: 'Info',         label: 'Vehicle Info',    icon: Info,     fetcher: getVehicleInfo },
  { key: 'Owner',        label: 'Owner',           icon: User,     fetcher: getVehicleOwner },
  { key: 'Registration', label: 'Registration',    icon: FileText, fetcher: getVehicleRegistration },
  { key: 'Insurance',    label: 'Insurance',       icon: Shield,   fetcher: getVehicleInsurance },
];

function DataGrid({ data }) {
  if (!data) return null;
  const skip = ['id', 'vehicleId', 'createdAt', 'updatedAt'];
  const entries = Object.entries(data).filter(([k]) => !skip.includes(k));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
      {entries.map(([key, val]) => (
        <div key={key} style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'Syne', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
            {val !== null && val !== undefined && val !== '' ? String(val) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function VehicleDetails() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Info');
  const [showConfirm, setShowConfirm] = useState(false);

  const currentTab = TABS.find(t => t.key === activeTab);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id, activeTab],
    queryFn: () => currentTab.fetcher(id).then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Vehicle deleted');
      navigate('/dashboard');
    },
    onError: () => toast.error('Delete failed'),
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard" style={{
            width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'Syne', letterSpacing: '1px', textTransform: 'uppercase' }}>Vehicle Record</p>
            <h1 style={{ fontFamily: 'Syne', fontSize: '24px', fontWeight: 800 }}>ID: {id}</h1>
          </div>
        </div>
        <button onClick={() => setShowConfirm(true)} className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trash2 size={14} /> Delete Vehicle
        </button>
      </div>

      {/* Tabs */}
      <div className="fade-up" style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--card)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border)' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'Syne', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'white' : 'var(--text-muted)',
              boxShadow: active ? '0 0 15px var(--accent-soft)' : 'none',
            }}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="card fade-up" style={{ padding: '28px', minHeight: '300px' }}>
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)' }}>
            <div className="pulse-dot" style={{ marginRight: '10px', fontSize: '16px' }}>●</div>
            Loading {activeTab} data...
          </div>
        )}
        {isError && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--danger)', gap: '10px' }}>
            <AlertCircle size={28} />
            <p>Failed to load {activeTab} data</p>
          </div>
        )}
        {!isLoading && !isError && <DataGrid data={data} />}
      </div>

      {/* Confirm delete modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ padding: '36px', width: '380px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={26} color="var(--danger)" />
            </div>
            <h3 style={{ fontFamily: 'Syne', fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>Delete Vehicle?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px', lineHeight: 1.6 }}>
              This will permanently remove vehicle <strong style={{ color: 'var(--text-primary)' }}>#{id}</strong> from the registry. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowConfirm(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button
                onClick={() => { deleteMutation.mutate(); setShowConfirm(false); }}
                disabled={deleteMutation.isPending}
                className="btn-danger" style={{ flex: 1 }}>
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}