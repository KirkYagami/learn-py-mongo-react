import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, Package, FilterX, Pencil } from 'lucide-react';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../api/services';
import { useAuthStore } from '../store/authStore';
import type { Product } from '../types';
import { Button, Input, Select, Badge, Card, Spinner, Modal, Toast, EmptyState } from '../components/ui';

const CATEGORIES = [
  { label: 'All categories', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'General', value: 'general' },
];

const CATEGORY_OPTIONS = CATEGORIES.slice(1);

const STOCK_OPTIONS = [
  { label: 'All stock', value: '' },
  { label: 'In stock', value: 'true' },
  { label: 'Out of stock', value: 'false' },
];

// ─── Shared form fields ───────────────────────────────────────────────────────
interface ProductFormState {
  name: string;
  description: string;
  price: string;
  in_stock: boolean;
  category: string;
}

function ProductFormFields({
  form,
  onChange,
  onCheckbox,
  error,
}: {
  form: ProductFormState;
  onChange: (k: keyof ProductFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onCheckbox: (checked: boolean) => void;
  error: string;
}) {
  return (
    <>
      <Input label="Name" placeholder="Mechanical Keyboard" value={form.name} onChange={onChange('name')} autoFocus />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Description</label>
        <textarea
          placeholder="A short description..."
          value={form.description}
          onChange={onChange('description')}
          rows={3}
          style={{
            background: 'var(--input-bg)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14,
            padding: '9px 12px', width: '100%', resize: 'vertical', fontFamily: 'var(--font-sans)',
            outline: 'none', transition: 'border-color 180ms',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--text-dim)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Price (₹)" type="number" placeholder="99.99" step="0.01" min="0.01" value={form.price} onChange={onChange('price')} />
        <Select label="Category" value={form.category} onChange={onChange('category')} options={CATEGORY_OPTIONS} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          id="in_stock_field"
          checked={form.in_stock}
          onChange={e => onCheckbox(e.target.checked)}
          style={{ width: 15, height: 15, accentColor: 'var(--red)', cursor: 'pointer' }}
        />
        <label htmlFor="in_stock_field" style={{ fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>In stock</label>
      </div>
      {error && <p style={{ fontSize: 12, color: 'var(--red)' }}>{error}</p>}
    </>
  );
}

// ─── Create modal ─────────────────────────────────────────────────────────────
function CreateProductModal({ open, onClose, onCreate }: {
  open: boolean; onClose: () => void; onCreate: (p: Product) => void;
}) {
  const blank: ProductFormState = { name: '', description: '', price: '', in_stock: true, category: 'general' };
  const [form, setForm] = useState<ProductFormState>(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (k: keyof ProductFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) { setError('All fields required'); return; }
    const priceNum = Math.round(parseFloat(form.price) * 100);
    if (isNaN(priceNum) || priceNum <= 0) { setError('Invalid price'); return; }
    setLoading(true); setError('');
    try {
      const p = await createProduct({ name: form.name, description: form.description, price: priceNum, in_stock: form.in_stock, category: form.category });
      onCreate(p); onClose(); setForm(blank);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create product');
    } finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Product">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ProductFormFields form={form} onChange={onChange} onCheckbox={v => setForm(f => ({ ...f, in_stock: v }))} error={error} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create product</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────
function EditProductModal({ product, onClose, onUpdate }: {
  product: Product | null; onClose: () => void; onUpdate: (p: Product) => void;
}) {
  const [form, setForm] = useState<ProductFormState>({ name: '', description: '', price: '', in_stock: true, category: 'general' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) setForm({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toFixed(2),
      in_stock: product.in_stock,
      category: product.category,
    });
  }, [product]);

  const onChange = (k: keyof ProductFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!form.name || !form.description || !form.price) { setError('All fields required'); return; }
    const priceNum = Math.round(parseFloat(form.price) * 100);
    if (isNaN(priceNum) || priceNum <= 0) { setError('Invalid price'); return; }
    setLoading(true); setError('');
    try {
      const updated = await updateProduct(product.id, { name: form.name, description: form.description, price: priceNum, in_stock: form.in_stock, category: form.category });
      onUpdate(updated); onClose();
    } catch (err: any) {
      // Backend stub returns 422/500 — surface a helpful message
      const detail = err?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Update failed — check backend implementation');
    } finally { setLoading(false); }
  };

  return (
    <Modal open={!!product} onClose={onClose} title="Edit Product">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ProductFormFields form={form} onChange={onChange} onCheckbox={v => setForm(f => ({ ...f, in_stock: v }))} error={error} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save changes</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onDelete, onEdit, canModify }: {
  product: Product; onDelete: (id: string) => void;
  onEdit: (p: Product) => void; canModify: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 3000); return; }
    setDeleting(true);
    try { await deleteProduct(product.id); onDelete(product.id); }
    catch { setDeleting(false); setConfirming(false); }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeUp 200ms ease' }}>
      {/* Title + badge row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 5 }}>{product.name}</h3>
          <span style={{
            fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            background: 'var(--bg3)', padding: '2px 7px', borderRadius: 4, textTransform: 'capitalize',
          }}>{product.category}</span>
        </div>
        <Badge color={product.in_stock ? 'green' : 'gray'}>{product.in_stock ? 'In stock' : 'Out'}</Badge>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, flex: 1 }}>
        {product.description.length > 90 ? product.description.slice(0, 90) + '…' : product.description}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--red)' }}>
          ₹{(product.price / 100).toFixed(2)}
        </span>
        {canModify && (
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="outline" size="sm" onClick={() => onEdit(product)} style={{ gap: 4 }}>
              <Pencil size={12} /> Edit
            </Button>
            <Button
              variant={confirming ? 'danger' : 'ghost'}
              size="sm"
              onClick={handleDelete}
              loading={deleting}
              style={{ gap: 4 }}
            >
              <Trash2 size={12} />
              {confirming ? 'Sure?' : 'Delete'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ProductsPage() {
  const { isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [inStock, setInStock] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState('');
  const [rateLimited, setRateLimited] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true); setRateLimited(false);
    try {
      const params: Record<string, unknown> = { limit: 50 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (inStock !== '') params.in_stock = inStock === 'true';
      setProducts(await getProducts(params));
    } catch (err: any) {
      if (err?.response?.status === 429) setRateLimited(true);
    } finally { setLoading(false); }
  }, [search, category, inStock]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const hasFilters = search || category || inStock;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Catalogue</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Products</h1>
        </div>
        {isAuthenticated && (
          <Button onClick={() => setShowCreate(true)} style={{ gap: 6 }}>
            <Plus size={14} /> New product
          </Button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--input-bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 13,
              padding: '8px 12px 8px 32px', width: '100%', outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--text-dim)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>
        <div style={{ width: 170 }}>
          <Select options={CATEGORIES} value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <div style={{ width: 145 }}>
          <Select options={STOCK_OPTIONS} value={inStock} onChange={e => setInStock(e.target.value)} />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setCategory(''); setInStock(''); }} style={{ gap: 5 }}>
            <FilterX size={13} /> Clear
          </Button>
        )}
      </div>

      {/* Rate limit banner */}
      {rateLimited && (
        <div style={{
          background: 'rgba(224,32,32,0.07)', border: '1px solid rgba(224,32,32,0.22)',
          borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 20,
          fontSize: 13, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ⏱ Rate limit reached (3 req / 60 s on products). Wait a moment and try again.
        </div>
      )}

      {/* Result count */}
      {!loading && (
        <p style={{ marginBottom: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid */}
      {loading ? <Spinner /> : products.length === 0 ? (
        <EmptyState icon={<Package />} message="No products found. Adjust filters or add a new one." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(282px, 1fr))', gap: 16 }}>
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              canModify={isAuthenticated}
              onDelete={id => { setProducts(prev => prev.filter(x => x.id !== id)); setToast('Product deleted'); }}
              onEdit={setEditProduct}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateProductModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={p => { setProducts(prev => [p, ...prev]); setToast('Product created!'); }}
      />
      <EditProductModal
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onUpdate={updated => { setProducts(prev => prev.map(p => p.id === updated.id ? updated : p)); setToast('Product updated!'); }}
      />

      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}
    </div>
  );
}
