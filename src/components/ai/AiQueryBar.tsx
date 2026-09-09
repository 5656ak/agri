import React, { useState } from 'react';
import { executeAiQuery, AiQueryResult } from '../../services/aiInsightEngine';
import { useAnalytics } from '../../context/AnalyticsContext';
import { Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

interface AiQueryBarProps {
  onResultGenerated?: (result: AiQueryResult) => void;
}

export const AiQueryBar: React.FC<AiQueryBarProps> = ({ onResultGenerated }) => {
  const { setActiveTab, kpis, orders } = useAnalytics();
  const [query, setQuery] = useState('');
  const [activeResult, setActiveResult] = useState<AiQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'Why did revenue increase this month?',
    'Which product has the highest profit margin?',
    'Which region is underperforming?',
    'Show me my fastest-growing customer segment.',
    'Predict next month\'s revenue.'
  ];

  const handleExecute = (text: string) => {
    if (!text.trim()) return;
    setQuery(text);
    setIsLoading(true);

    setTimeout(() => {
      const res = executeAiQuery(text, kpis, orders);
      setActiveResult(res);
      setIsLoading(false);
      if (onResultGenerated) {
        onResultGenerated(res);
      }
    }, 280);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExecute(query);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Prominent Search Bar */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.15s ease'
        }}
      >
        <Sparkles size={18} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your business (e.g. 'Why did revenue grow?', 'Predict next quarter')..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 14,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)'
          }}
        />

        <button
          onClick={() => handleExecute(query)}
          disabled={!query.trim() || isLoading}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 12px' }}
        >
          {isLoading ? (
            <span>Analyzing...</span>
          ) : (
            <>
              <span>Ask NEXA</span>
              <CornerDownLeft size={13} />
            </>
          )}
        </button>
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500 }}>Try asking:</span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleExecute(q)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: 12,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.12s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--brand-primary)';
              e.currentTarget.style.color = 'var(--brand-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Render Analyst Response if generated */}
      {activeResult && (
        <div
          className="nexa-card animate-fade-in"
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--brand-primary-border)',
            boxShadow: 'var(--shadow-md)',
            marginTop: 4
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Sparkles size={14} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-primary)' }}>
                NEXA Intelligence Synthesis
              </span>
            </div>
            <button
              onClick={() => setActiveResult(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
            >
              Dismiss
            </button>
          </div>

          <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 16 }}>
            {activeResult.explanation}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
              background: 'var(--bg-surface-subtle)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: 14
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{activeResult.keyMetricLabel}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-primary)', marginTop: 2 }}>
                {activeResult.keyMetricValue}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Trend Context</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-success)', marginTop: 2 }}>
                {activeResult.keyMetricTrend}
              </div>
            </div>
          </div>

          {/* Evidence Data Points */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Corroborating Evidence:
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {activeResult.dataPoints.map((pt, i) => (
                <li key={i} style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--brand-primary)' }}>✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeResult.actionRoute && (
            <button
              onClick={() => setActiveTab(activeResult.actionRoute!)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <span>{activeResult.suggestedAction}</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
