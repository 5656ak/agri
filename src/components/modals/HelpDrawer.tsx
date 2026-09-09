import React from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { X, HelpCircle, BookOpen, Command, Sparkles } from 'lucide-react';

export const HelpDrawer: React.FC = () => {
  const { isHelpOpen, setIsHelpOpen } = useAnalytics();

  if (!isHelpOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsHelpOpen(false)}>
      <div
        className="modal-window"
        style={{ width: '100%', maxWidth: 540, padding: 24 }}
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
              <HelpCircle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Platform Knowledge Base</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Metrics formulas & keyboard shortcuts.</p>
            </div>
          </div>
          <button
            onClick={() => setIsHelpOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Keyboard Shortcuts */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Command size={15} style={{ color: 'var(--brand-primary)' }} />
              <h4 style={{ fontSize: 13.5, fontWeight: 600 }}>Keyboard Shortcuts</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Open AI Command Palette</span>
                <kbd style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-medium)', padding: '2px 6px', borderRadius: 4 }}>
                  ⌘K / Ctrl+K
                </kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Close Modals & Drawers</span>
                <kbd style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-medium)', padding: '2px 6px', borderRadius: 4 }}>
                  Esc
                </kbd>
              </div>
            </div>
          </div>

          {/* Metrics Glossary */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <BookOpen size={15} style={{ color: 'var(--brand-primary)' }} />
              <h4 style={{ fontSize: 13.5, fontWeight: 600 }}>Analytics Calculations Glossary</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>Average Order Value (AOV)</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Formula: <code>Total Revenue ÷ Total Non-Cancelled Orders</code>. Measures average revenue generated per transaction basket.
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>Customer Lifetime Value (LTV)</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Formula: <code>AOV × Purchase Frequency × Customer Lifespan</code>. Gauges aggregate expected revenue generated across buyer tenure.
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>Net Profit Margin</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Formula: <code>((Net Revenue - Cost of Goods Sold) ÷ Net Revenue) × 100</code>. Tracks bottom-line operational efficiency.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button onClick={() => setIsHelpOpen(false)} className="btn btn-secondary">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
