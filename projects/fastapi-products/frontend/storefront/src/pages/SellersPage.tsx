import { useState, useEffect } from 'react';
import { Users, Mail, Hash } from 'lucide-react';
import { getSellers } from '../api/services';
import type { Seller } from '../types';
import { Card, Spinner, EmptyState } from '../components/ui';

const COLORS = ['#e02020', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'];

function SellerCard({ seller, index }: { seller: Seller; index: number }) {
  const color = COLORS[index % COLORS.length];
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 200ms ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: color, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>
          {seller.username[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{seller.username}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>Seller</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          <Mail size={13} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{seller.email}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          <Hash size={13} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
            {seller.id.slice(-8)}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSellers().then(setSellers).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Directory</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Sellers</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>All registered seller accounts.</p>
      </div>

      {loading ? <Spinner /> : sellers.length === 0 ? (
        <EmptyState icon={<Users />} message="No sellers registered yet." />
      ) : (
        <>
          <div style={{ marginBottom: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {sellers.length} seller{sellers.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {sellers.map((s, i) => <SellerCard key={s.id} seller={s} index={i} />)}
          </div>
        </>
      )}
    </div>
  );
}
