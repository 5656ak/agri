import React, { useState } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useTheme } from '../../context/ThemeContext';
import { X, Settings, Users, Shield, Bell, Database, RefreshCw } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, workspace, setWorkspace, clearWorkspaceData, addToast } = useAnalytics();
  const { theme, toggleTheme } = useTheme();

  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>((workspace.currency as any) || 'INR');
  const [emailAlerts, setEmailAlerts] = useState(true);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    setWorkspace({
      ...workspace,
      name: workspaceName,
      currency
    });
    addToast('Workspace preferences updated successfully!', 'success');
    setIsSettingsOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
      <div
        className="modal-window"
        style={{ width: '100%', maxWidth: 580, padding: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Settings size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Workspace Settings</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Configure environment, team roles, and data defaults.</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Workspace Name */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Organization / Workspace Name
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={e => setWorkspaceName(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Currency Format */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Base Currency & Numbering Notation
            </label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as any)}
              className="form-select"
            >
              <option value="INR">INR (₹) — Indian Lakhs & Crores (L / Cr)</option>
              <option value="USD">USD ($) — Standard International</option>
              <option value="EUR">EUR (€) — European Standard</option>
            </select>
          </div>

          {/* Theme Preference */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Theme Mode</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current theme: {theme}</div>
            </div>
            <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
              Toggle to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          {/* Notifications */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Email Intelligence Briefings</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Receive weekly automated AI digests</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              style={{ accentColor: 'var(--brand-primary)', width: 18, height: 18 }}
            />
          </div>

          {/* Reset Demo Data Trigger */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Clear Workspace Transactions</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Reset all sales records to a clean zero state</div>
            </div>
            <button
              onClick={() => {
                clearWorkspaceData();
                setIsSettingsOpen(false);
              }}
              className="btn btn-secondary btn-sm"
              style={{ gap: 6, color: 'var(--color-danger)' }}
            >
              <RefreshCw size={13} />
              <span>Clear Data</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={() => setIsSettingsOpen(false)} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
