import React from 'react';
import { Loader2 } from 'lucide-react';

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const btnBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 600,
  letterSpacing: '0.02em', borderRadius: 'var(--radius)',
  transition: 'all 180ms ease', cursor: 'pointer',
  border: '1px solid transparent', whiteSpace: 'nowrap',
};

const variantStyles = {
  primary: { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' },
  ghost: { background: 'transparent', color: 'var(--text-muted)', borderColor: 'transparent' },
  danger: { background: 'transparent', color: 'var(--red)', borderColor: 'var(--red)' },
  outline: { background: 'transparent', color: 'var(--text)', borderColor: 'var(--border)' },
};

const sizeStyles = {
  sm: { fontSize: 12, padding: '5px 12px', height: 30 },
  md: { fontSize: 13, padding: '8px 16px', height: 36 },
  lg: { fontSize: 14, padding: '11px 22px', height: 44 },
};

export function Button({ variant = 'primary', size = 'md', loading, children, disabled, style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        ...btnBase,
        ...variantStyles[variant],
        ...sizeStyles[size],
        opacity: (disabled || loading) ? 0.5 : 1,
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        if (variant === 'primary') el.style.background = 'var(--red-dim)';
        if (variant === 'outline') el.style.borderColor = 'var(--border-hover)';
        if (variant === 'ghost') el.style.color = 'var(--text)';
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        Object.assign(el.style, variantStyles[variant]);
        props.onMouseLeave?.(e);
      }}
    >
      {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>}
      <input
        {...props}
        style={{
          background: 'var(--input-bg)',
          border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          color: 'var(--text)',
          fontSize: 14,
          padding: '9px 12px',
          width: '100%',
          transition: 'border-color 180ms',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--red)' : 'var(--text-dim)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--red)' : 'var(--border)';
        }}
      />
      {error && <span style={{ fontSize: 11, color: 'var(--red)' }}>{error}</span>}
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export function Select({ label, options, style, ...props }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>}
      <select
        {...props}
        style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--text)',
          fontSize: 14,
          padding: '9px 12px',
          width: '100%',
          cursor: 'pointer',
          ...style,
        }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps { children: React.ReactNode; color?: 'red' | 'green' | 'gray' | 'blue'; }

const badgeColors = {
  red:   { bg: 'rgba(224,32,32,0.12)',  color: '#e02020' },
  green: { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e' },
  gray:  { bg: 'var(--bg3)',             color: 'var(--text-muted)' },
  blue:  { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
};

export function Badge({ children, color = 'gray' }: BadgeProps) {
  const c = badgeColors[color];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)',
      padding: '2px 8px', borderRadius: 4, letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      {children}
    </span>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <Loader2 size={size} style={{ animation: 'spin 1s linear infinite', color: 'var(--red)' }} />
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; style?: React.CSSProperties; hoverable?: boolean; onClick?: () => void; }

export function Card({ children, style, hoverable, onClick }: CardProps) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: hovered ? 'var(--card-hover)' : 'var(--card-bg)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: 20,
        transition: 'all 180ms ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; }

export function Modal({ open, onClose, title, children }: ModalProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'fadeIn 150ms ease',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 28, width: '100%', maxWidth: 480,
        boxShadow: 'var(--shadow)', animation: 'fadeUp 180ms ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px 8px', minWidth: 0 }}>✕</Button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, message }: { icon?: React.ReactNode; message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      {icon && <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>{icon}</div>}
      <p style={{ fontSize: 14 }}>{message}</p>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
interface ToastProps { message: string; type?: 'success' | 'error' | 'info'; onClose: () => void; }

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = { success: 'var(--red)', error: '#ef4444', info: 'var(--text-muted)' };

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: 'var(--bg2)', border: `1px solid var(--border)`,
      borderLeft: `3px solid ${colors[type]}`,
      borderRadius: 'var(--radius)', padding: '12px 16px',
      boxShadow: 'var(--shadow)', maxWidth: 340,
      animation: 'fadeUp 200ms ease', fontSize: 13,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}>✕</button>
    </div>
  );
}
