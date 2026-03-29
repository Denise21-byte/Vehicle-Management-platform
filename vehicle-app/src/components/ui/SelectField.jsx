export default function SelectField({ label, registration, error, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, fontFamily: 'Syne, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label}
      </label>
      <select {...registration} className={`input-field ${error ? 'error' : ''}`}>
        <option value="">Select {label}...</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⚠</span> {error.message}
        </p>
      )}
    </div>
  );
}