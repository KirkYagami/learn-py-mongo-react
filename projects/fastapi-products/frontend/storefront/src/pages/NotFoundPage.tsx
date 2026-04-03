import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

export function NotFoundPage() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40,
      animation: 'fadeUp 250ms ease',
    }}>
      <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--border)', lineHeight: 1 }}>404</div>
      <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>This page doesn't exist.</p>
      <Link to="/"><Button variant="outline">Go home</Button></Link>
    </div>
  );
}
