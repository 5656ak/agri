import React, { useState, useEffect, useRef } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { executeAiQuery, AiQueryResult } from '../../services/aiInsightEngine';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Package, 
  MapPin, 
  LineChart, 
  FileText,
  X
} from 'lucide-react';

export const QuickCommandModal: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setActiveTab } = useAnalytics();
  const [query, setQuery] = useState('');
  const [aiResult, setAiResult] = useState<AiQueryResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setAiResult(null);
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickNav = [
    { label: 'Overview Dashboard', tab: 'overview', icon: TrendingUp },
    { label: 'Sales Transactions', tab: 'sales', icon: TrendingUp },
    { label: 'Customer Cohorts & LTV', tab: 'customers', icon: Users },
    { label: 'Product Margins & SKU Drilldown', tab: 'products', icon: Package },
    { label: 'India Regional Performance', tab: 'regions', icon: MapPin },
    { label: 'Sales Forecasting & Projections', tab: 'forecast', icon: LineChart },
    { label: 'AI Business Intelligence', tab: 'ai-insights', icon: Sparkles },
    { label: 'Business Reports & PDF Export', tab: 'reports', icon: FileText },
  ];

  const suggestions = [
    'Why did revenue increase this month?',
    'Which product has the highest profit margin?',
    'Which region is underperforming?',
    'Show me my fastest-growing customer segment.',
    'Predict next month\'s revenue.'
  ];

  const handleRunAi = (prompt: string) => {
    setQuery(prompt);
    const res = executeAiQuery(prompt);
    setAiResult(res);
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleRunAi(query);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCommandPaletteOpen(false)}>
      <div
        className="modal-window"
        style={{ width: '100%', maxWidth: 620, padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={18} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              if (!e.target.value) setAiResult(null);
            }}
            onKeyDown={handleKeyDownInInput}
            placeholder="Ask anything about your business or jump to a page..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 15,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* AI Answer View if Query executed */}
        {aiResult ? (
          <div style={{ padding: 20 }}>
            <div
              style={{
                background: 'var(--brand-primary-light)',
                border: '1px solid var(--brand-primary-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 16,
                marginBottom: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Sparkles size={16} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                  AI Business Analyst Response
                </span>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 14 }}>
                {aiResult.explanation}
              </p>

              {/* Metric Card */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: 12
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{aiResult.keyMetricLabel}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {aiResult.keyMetricValue}
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)' }}>
                  {aiResult.keyMetricTrend}
                </div>
              </div>

              {/* Data points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Data Points Consulted:
                </span>
                {aiResult.dataPoints.map((dp, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 6 }}>
                    <span>•</span>
                    <span>{dp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA action button */}
            {aiResult.actionRoute && (
              <button
                onClick={() => {
                  setActiveTab(aiResult.actionRoute!);
                  setIsCommandPaletteOpen(false);
                }}
                className="btn btn-primary btn-block"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{aiResult.suggestedAction}</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ padding: 16, maxHeight: 420, overflowY: 'auto' }}>
            {/* Suggested AI queries */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, padding: '0 8px' }}>
                Suggested AI Inquiries
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunAi(s)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.1s ease',
                      width: '100%'
                    }}
                    className="dropdown-item"
                  >
                    <Sparkles size={14} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{s}</span>
                    <ArrowRight size={13} style={{ color: 'var(--text-faint)' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Page Jump */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, padding: '0 8px' }}>
                Quick Navigation
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
                {quickNav.map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveTab(n.tab);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="dropdown-item"
                      style={{ padding: '8px 10px' }}
                    >
                      <Icon size={15} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: 12.5 }}>{n.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
