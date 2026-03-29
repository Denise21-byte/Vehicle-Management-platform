export default function InputField({ label, registration, error, type = 'text', placeholder, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, fontFamily: 'Syne, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder || label}
        {...registration}
        className={`input-field ${error ? 'error' : ''}`}
      />
      {hint && !error && <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{hint}</p>}
      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⚠</span> {error.message}
        </p>
      )}
    </div>
  );
}