import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, Package, Users, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui';

export function Navbar() {
  const { isAuthenticated, username, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/sellers', label: 'Sellers', icon: Users },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg)', borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 56, display: 'flex', alignItems: 'center', gap: 32,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--red)',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Package size={15} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>
            storefront
          </span>
        </Link>

        {/* Nav links */}
        {isAuthenticated && (
          <nav style={{ display: 'flex', gap: 4 }}>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 11px', borderRadius: 'var(--radius)',
                  fontSize: 13, fontWeight: 600,
                  color: isActive(to) ? 'var(--text)' : 'var(--text-muted)',
                  background: isActive(to) ? 'var(--bg3)' : 'transparent',
                  transition: 'all 180ms',
                }}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            style={{
              width: 34, height: 34, borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 180ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {isAuthenticated ? (
            <>
              <span style={{
                fontSize: 12, color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                padding: '4px 10px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}>
                @{username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { logout(); navigate('/login'); }}
                style={{ gap: 5 }}
              >
                <LogOut size={13} />
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
