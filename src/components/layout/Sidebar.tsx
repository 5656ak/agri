import React from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Package, 
  MapPin, 
  LineChart, 
  Sparkles, 
  FileText, 
  Database, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Table,
  PlusCircle,
  Layers
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { activeTab, setActiveTab, setIsSettingsOpen, setIsHelpOpen, orders, kpis } = useAnalytics();
  const { user, businessProfile } = useAuth();

  const businessDisplayName = businessProfile?.businessName || user?.businessName || 'My Business';

  const primaryNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'regions', label: 'Regions', icon: MapPin },
    { id: 'forecast', label: 'Forecast', icon: LineChart },
    { 
      id: 'ai-insights', 
      label: 'AI Insights', 
      icon: Sparkles, 
      badge: kpis.hasData && orders.length > 0 ? '5' : undefined 
    },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const dataNavItems = [
    { id: 'manual-entry', label: 'Manual Entry', icon: Table },
    { id: 'data-sources', label: 'Data Sources', icon: Database, badge: orders.length > 0 ? String(orders.length) : undefined },
  ];

  const bottomNavItems = [
    { id: 'settings', label: 'Settings', icon: Settings, isModal: true },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle, isModal: true },
  ];

  const handleNavClick = (item: { id: string; isModal?: boolean }) => {
    if (item.id === 'settings') {
      setIsSettingsOpen(true);
    } else if (item.id === 'help') {
      setIsHelpOpen(true);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside
      style={{
        width: isCollapsed ? 72 : 250,
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 64,
          padding: isCollapsed ? '0 12px' : '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div
          onClick={() => setActiveTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          {/* Stylized Logo Polygon Symbol */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
              flexShrink: 0
            }}
          >
            <Zap size={19} fill="#FFFFFF" />
          </div>

          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)'
                  }}
                >
                  NEXA
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--brand-primary)',
                    letterSpacing: '0.04em'
                  }}
                >
                  ANALYTICS
                </span>
              </div>
              <span 
                style={{ 
                  fontSize: 11, 
                  color: 'var(--text-muted)',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: 140
                }}
                title={businessDisplayName}
              >
                {businessDisplayName}
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4
            }}
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        {/* Analytics Section */}
        {!isCollapsed && (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              letterSpacing: '0.08em',
              padding: '0 8px',
              marginBottom: 4
            }}
          >
            Intelligence
          </span>
        )}

        {primaryNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: isCollapsed ? '10px 0' : '9px 12px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--brand-primary-light)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.12s ease',
                width: '100%',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} style={{ flexShrink: 0 }} />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--brand-primary)' : 'var(--brand-primary-light)',
                    color: isActive ? '#FFFFFF' : 'var(--brand-primary)'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Data Ingestion Section */}
        <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '10px 4px' }} />

        {!isCollapsed && (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              letterSpacing: '0.08em',
              padding: '0 8px',
              marginBottom: 4
            }}
          >
            Data Ingestion
          </span>
        )}

        {dataNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: isCollapsed ? '10px 0' : '9px 12px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--brand-primary-light)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.12s ease',
                width: '100%',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} style={{ flexShrink: 0 }} />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '10px 4px' }} />

        {!isCollapsed && (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              letterSpacing: '0.08em',
              padding: '0 8px',
              marginBottom: 4
            }}
          >
            System
          </span>
        )}

        {bottomNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: 10,
                padding: isCollapsed ? '10px 0' : '9px 12px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--brand-primary-light)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.12s ease',
                width: '100%'
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Footer / Data Status Banner */}
      {!isCollapsed && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
              {orders.length > 0 ? `${orders.length} records active` : 'Awaiting data'}
            </span>
            <span style={{ fontSize: 10, color: orders.length > 0 ? '#10B981' : 'var(--text-muted)' }}>
              {orders.length > 0 ? '● Live calculations' : '○ Zero state'}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('manual-entry')}
            className="btn btn-ghost btn-xs"
            title="Add transaction row"
            style={{ padding: 4 }}
          >
            <PlusCircle size={15} style={{ color: 'var(--brand-primary)' }} />
          </button>
        </div>
      )}

      {/* Collapsed expander button */}
      {isCollapsed && (
        <div
          style={{
            padding: 12,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6
            }}
            title="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </aside>
  );
};
