import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  X, 
  Settings, 
  User as UserIcon, 
  Building2, 
  RefreshCw, 
  AlertTriangle,
  Check,
  Globe,
  DollarSign
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, workspace, setWorkspace, clearWorkspaceData, addToast } = useAnalytics();
  const { user, businessProfile, saveBusinessProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data'>('profile');

  const [workspaceName, setWorkspaceName] = useState('');
  const [businessType, setBusinessType] = useState('E-commerce');
  const [industry, setIndustry] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isSettingsOpen) {
      setWorkspaceName(businessProfile?.businessName || user?.businessName || workspace.name || 'My Business');
      setBusinessType(businessProfile?.businessType || 'E-commerce');
      setIndustry(businessProfile?.industry || 'Retail & D2C');
      setCurrency(((businessProfile?.currency || workspace.currency) as any) || 'INR');
      setShowClearConfirm(false);
    }
  }, [isSettingsOpen, businessProfile, user, workspace]);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    setWorkspace({
      ...workspace,
      name: workspaceName,
      currency
    });

    if (businessProfile) {
      saveBusinessProfile({
        ...businessProfile,
        businessName: workspaceName,
        businessType: businessType as any,
        industry,
        currency
      });
    } else if (user) {
      saveBusinessProfile({
        businessName: workspaceName,
        businessType: businessType as any,
        industry,
        country: 'India',
        currency,
        analysisGoals: ['Revenue & Margin Optimization']
      });
    }

    addToast('Workspace settings saved successfully!', 'success');
    setIsSettingsOpen(false);
  };

  const handleClearData = () => {
    clearWorkspaceData();
    setShowClearConfirm(false);
    setIsSettingsOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
      <div
        className="modal-window"
        style={{ width: '100%', maxWidth: 620, padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid var(--border-subtle)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Settings size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Workspace Settings</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Manage your organization profile, formatting, and data isolation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div 
          style={{ 
            display: 'flex', 
            borderBottom: '1px solid var(--border-subtle)', 
            padding: '0 24px',
            gap: 20,
            background: 'var(--bg-surface-subtle)'
          }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 4px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'profile' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'profile' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            style={{
              padding: '12px 4px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'preferences' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'preferences' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Preferences & Theme
          </button>
          <button
            onClick={() => setActiveTab('data')}
            style={{
              padding: '12px 4px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'data' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'data' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Data Management
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '22px 24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* User Identity Info */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div 
                    style={{ 
                      width: 38, 
                      height: 38, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)', 
                      color: '#FFF',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14
                    }}
                  >
                    {user?.name?.slice(0, 1) || 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'Authorized User'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                </div>
                <span className="badge badge-info">{user?.plan || 'Growth Pro'}</span>
              </div>

              {/* Workspace Name */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Organization / Business Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={e => setWorkspaceName(e.target.value)}
                  className="form-input"
                  placeholder="e.g., NEXA Tech Brands"
                />
              </div>

              {/* Business Vertical */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Business Vertical
                  </label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    className="form-select"
                  >
                    <option value="E-commerce">E-commerce / D2C</option>
                    <option value="Retail">Retail & Physical Stores</option>
                    <option value="SaaS">SaaS & Software</option>
                    <option value="Manufacturing">Manufacturing & Wholesale</option>
                    <option value="Services">Professional Services</option>
                    <option value="Other">Other Enterprise</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Industry Domain
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="form-input"
                    placeholder="e.g., Consumer Electronics"
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Financial Reporting Currency
                </label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as any)}
                  className="form-select"
                >
                  <option value="INR">INR (₹) — Indian Rupee (Lakhs & Crores notation)</option>
                  <option value="USD">USD ($) — US Dollar (Standard Thousands & Millions)</option>
                  <option value="EUR">EUR (€) — Euro</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Theme Preference */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Theme Mode</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Currently set to {theme === 'dark' ? 'Dark' : 'Light'} theme</div>
                </div>
                <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
              </div>

              {/* Notifications */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Automated AI Briefings</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Receive executive AI summaries and anomaly alerts</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  style={{ accentColor: 'var(--brand-primary)', width: 18, height: 18 }}
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div 
                style={{ 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(239, 68, 68, 0.06)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)' 
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <AlertTriangle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-danger)', margin: '0 0 4px 0' }}>
                      Reset Workspace Data
                    </h4>
                    <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      Permanently wipe all ingested orders and datasets for this account. NEXA Analytics will revert to a clean zero-data state with all metrics reset.
                    </p>
                  </div>
                </div>

                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 14, color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    <RefreshCw size={13} style={{ marginRight: 6 }} />
                    <span>Clear All Workspace Transactions</span>
                  </button>
                ) : (
                  <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-danger)' }}>
                      Are you sure? This cannot be undone.
                    </span>
                    <button
                      onClick={handleClearData}
                      className="btn btn-sm"
                      style={{ background: 'var(--color-danger)', color: '#FFF', border: 'none' }}
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 10, 
            padding: '16px 24px', 
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <button onClick={() => setIsSettingsOpen(false)} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" style={{ gap: 6 }}>
            <Check size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
