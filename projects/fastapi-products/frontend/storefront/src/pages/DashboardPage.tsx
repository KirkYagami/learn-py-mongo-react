import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, CheckCircle, XCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { getProducts, getSellers } from '../api/services';
import { useAuthStore } from '../store/authStore';
import type { Product, Seller } from '../types';
import { Card, Spinner, Badge } from '../components/ui';

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: any; accent?: string }) {
  return (
    <Card style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: accent ? `${accent}14` : 'var(--bg3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color={accent || 'var(--text-muted)'} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, fontWeight: 500 }}>{label}</div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { username } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts({ limit: 100 }), getSellers()])
      .then(([p, s]) => { setProducts(p); setSellers(s); })
      .finally(() => setLoading(false));
  }, []);

  const inStock = products.filter(p => p.in_stock).length;
  const outOfStock = products.filter(p => !p.in_stock).length;
  const categories = [...new Set(products.map(p => p.category))];

  if (loading) return <div style={{ padding: 40 }}><Spinner /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px', animation: 'fadeUp 250ms ease' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Overview</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
          Good day, <span style={{ color: 'var(--red)' }}>@{username}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Here's what's happening in your store.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 36 }}>
        <StatCard label="Total products" value={products.length} icon={Package} accent="#e02020" />
        <StatCard label="In stock" value={inStock} icon={CheckCircle} accent="#22c55e" />
        <StatCard label="Out of stock" value={outOfStock} icon={XCircle} accent="#f59e0b" />
        <StatCard label="Sellers" value={sellers.length} icon={Users} accent="#3b82f6" />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent products */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Products</span>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {products.slice(0, 6).map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 20px',
              borderBottom: i < Math.min(products.length, 6) - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                  ₹{(p.price / 100).toFixed(2)}
                </div>
              </div>
              <Badge color={p.in_stock ? 'green' : 'gray'}>{p.in_stock ? 'In stock' : 'Out'}</Badge>
            </div>
          ))}
          {products.length === 0 && (
            <div style={{ padding: '24px 20px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>No products yet</div>
          )}
        </Card>

        {/* Categories + Sellers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <TrendingUp size={14} color="var(--text-muted)" />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Categories</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {categories.length > 0 ? categories.map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <div key={cat} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'var(--bg3)', borderRadius: 6,
                    padding: '5px 10px', fontSize: 12,
                  }}>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{cat}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 11 }}>{count}</span>
                  </div>
                );
              }) : <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No categories yet</span>}
            </div>
          </Card>

          <Card style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Sellers</span>
              <Link to="/sellers" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {sellers.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
                borderBottom: i < sellers.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {s.username[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.username}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.email}</div>
                </div>
              </div>
            ))}
            {sellers.length === 0 && (
              <div style={{ padding: '24px 20px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>No sellers yet</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
