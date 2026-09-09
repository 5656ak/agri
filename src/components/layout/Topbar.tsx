import React, { useState, useRef, useEffect } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DateRangePicker } from './DateRangePicker';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown, 
  Building2, 
  Plus, 
  Check, 
  LogOut,
  Sparkles,
  Menu,
  Table,
  Database,
  UploadCloud
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const { workspace, setIsCommandPaletteOpen, setActiveTab, setShowLanding, orders, kpis } = useAnalytics();
  const { user, businessProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const wsRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Compute initials
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(n => n[0].toUpperCase())
        .join('')
    : 'U';

  const businessDisplayName = businessProfile?.businessName || user?.businessName || 'My Business Workspace';

  // Dynamic notifications based on real user data
  const notifications = orders.length > 0
    ? [
        {
          id: 'n-1',
          title: 'Active Period Gross Revenue',
          time: 'Live',
          desc: `Tracked ${kpis.totalRevenueFormatted} across ${kpis.orderCountFormatted} transactions.`,
          unread: true
        },
        {
          id: 'n-2',
          title: 'Storewide Margin Health',
          time: 'Calculated',
          desc: `Current blended margin is ${kpis.profitMargin}% with ${kpis.totalProfitFormatted} profit.`,
          unread: false
        }
      ]
    : [
        {
          id: 'n-empty',
          title: 'Workspace Ready for Ingestion',
          time: 'Now',
          desc: 'Upload a CSV/Excel file or add orders manually to unlock AI insights.',
          unread: true
        }
      ];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) {
        setIsWorkspaceMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header
      style={{
        height: 64,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left side: Mobile trigger & Search bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', padding: 6 }}
          >
            <Menu size={19} />
          </button>
        )}

        {/* Global Search / Command Bar Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            color: 'var(--text-muted)',
            fontSize: 13,
            cursor: 'pointer',
            minWidth: 260,
            transition: 'all 0.15s ease'
          }}
        >
          <Search size={15} style={{ color: 'var(--text-faint)' }} />
          <span>Ask AI or search commands...</span>
          <kbd
            style={{
              marginLeft: 'auto',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-faint)'
            }}
          >
            Ctrl+K
          </kbd>
        </button>

        {/* Workspace Indicator Dropdown */}
        <div style={{ position: 'relative' }} ref={wsRef}>
          <button
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <Building2 size={15} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {businessDisplayName}
            </span>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </button>

          {isWorkspaceMenuOpen && (
            <div className="dropdown-menu" style={{ width: 260 }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Current Business Workspace
                </span>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                  {businessDisplayName}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <span className="badge badge-info">{user?.plan || 'Growth Pro'}</span>
                  <span className="badge badge-neutral">{businessProfile?.currency || 'INR'}</span>
                </div>
              </div>

              <div style={{ padding: 4 }}>
                <button
                  onClick={() => {
                    setActiveTab('data-sources');
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <Database size={15} />
                  <span>Manage Data Sources</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('manual-entry');
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <Table size={15} />
                  <span>Manual Spreadsheet Entry</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Ingest Quick Action Button */}
        <button
          onClick={() => setActiveTab('manual-entry')}
          className="btn btn-secondary btn-sm"
          style={{ gap: 6, fontSize: 12.5 }}
        >
          <Plus size={14} />
          <span>Add Data</span>
        </button>

        {/* Date Range Picker */}
        <DateRangePicker />

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              position: 'relative'
            }}
            title="Notifications"
          >
            <Bell size={17} />
            {notifications.some(n => n.unread) && (
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary)'
                }}
              />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="dropdown-menu" style={{ right: 0, width: 300, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Notifications & Alerts</span>
                <span style={{ fontSize: 11, color: 'var(--brand-primary)', cursor: 'pointer' }}>Mark all read</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setActiveTab(orders.length > 0 ? 'overview' : 'data-sources');
                      setIsNotificationsOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: n.unread ? 'var(--brand-primary-light)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-primary)' }}>{n.title}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {n.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Profile Avatar */}
        <div style={{ position: 'relative' }} ref={userRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 2
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)'
              }}
            >
              {userInitials}
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="dropdown-menu" style={{ right: 0, width: 230 }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  {user?.email || 'user@example.com'}
                </div>
                <div style={{ marginTop: 4 }}>
                  <span className="badge badge-info">{user?.plan || 'Growth Pro'}</span>
                </div>
              </div>

              <div style={{ padding: 4 }}>
                <button
                  onClick={() => {
                    setShowLanding(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <Sparkles size={15} />
                  <span>Landing Page Preview</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('data-sources');
                    setIsUserMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <Database size={15} />
                  <span>Data Sources</span>
                </button>

                <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="dropdown-item"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
