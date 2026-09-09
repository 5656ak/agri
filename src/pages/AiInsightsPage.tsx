import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { getAiInsights, getExecutiveSummary } from '../services/aiInsightEngine';
import { AiInsight, InsightType } from '../types';
import { AiInsightCard } from '../components/ai/AiInsightCard';
import { AiQueryBar } from '../components/ai/AiQueryBar';
import { 
  Sparkles, 
  TrendingUp, 
  AlertOctagon, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  X, 
  ArrowRight,
  UploadCloud,
  Table,
  Plus
} from 'lucide-react';

export const AiInsightsPage: React.FC = () => {
  const { kpis, orders, setActiveTab, addToast } = useAnalytics();
  const [filterType, setFilterType] = useState<string>('All');
  const [activeModalInsight, setActiveModalInsight] = useState<AiInsight | null>(null);

  const insights = getAiInsights(kpis, orders);

  const filteredInsights = filterType === 'All'
    ? insights
    : insights.filter(i => i.type.toLowerCase() === filterType.toLowerCase());

  const handleApplyRecommendation = (insight: AiInsight) => {
    addToast(`Applied strategic optimization: ${insight.title}`, 'success');
    setActiveModalInsight(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            AI Business Intelligence
          </h1>
          <span className="badge badge-info">Autonomous Analyst</span>
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
          {orders.length > 0 
            ? `Generating real-time intelligence from your ${orders.length} transaction records.`
            : 'Turn your business data into actionable decisions with real-time operational insights.'}
        </p>
      </div>

      {/* Prominent AI Natural Language Query Bar */}
      <AiQueryBar />

      {/* ZERO-DATA STATE */}
      {orders.length === 0 ? (
        <div
          className="nexa-card"
          style={{
            padding: '44px 32px',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              background: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <Sparkles size={26} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            AI Insights Awaiting Transaction Data
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 24px auto', lineHeight: 1.55 }}>
            NEXA's autonomous analyst continuously scans sales velocity, regional margins, and repeat customer retention to identify profit leaks and growth opportunities. Ingest your business data to activate insights.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('data-sources')}
              className="btn btn-primary"
              style={{ padding: '9px 20px', gap: 8 }}
            >
              <UploadCloud size={15} />
              <span>Import Dataset</span>
            </button>
            <button
              onClick={() => setActiveTab('manual-entry')}
              className="btn btn-secondary"
              style={{ padding: '9px 18px', gap: 8 }}
            >
              <Table size={15} />
              <span>Enter Orders Manually</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Executive Summary Panel */}
          <div
            className="nexa-card"
            style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid var(--brand-primary-border)',
              padding: 24
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={16} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Executive Intelligence Synthesis
              </h3>
            </div>

            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.65 }}>
              {getExecutiveSummary(kpis, orders)}
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Filter Insights:</span>
            {['All', 'Opportunity', 'Risk', 'Recommendation'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`btn btn-xs ${filterType === type ? 'btn-primary' : 'btn-secondary'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Dynamic Insight Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
            {filteredInsights.map(insight => (
              <AiInsightCard
                key={insight.id}
                insight={insight}
                onActionClick={() => setActiveModalInsight(insight)}
              />
            ))}
          </div>
        </>
      )}

      {/* Detailed Modal */}
      {activeModalInsight && (
        <div className="modal-overlay" onClick={() => setActiveModalInsight(null)}>
          <div
            className="modal-window"
            style={{ width: '100%', maxWidth: 540, padding: 24 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span className="badge badge-info">{activeModalInsight.category}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 6, color: 'var(--text-primary)' }}>
                  {activeModalInsight.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalInsight(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
              {activeModalInsight.description}
            </p>

            <div
              style={{
                padding: 14,
                borderRadius: 'var(--radius-md)',
                background: 'var(--brand-primary-light)',
                border: '1px solid var(--brand-primary-border)',
                marginBottom: 20
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)', marginBottom: 4 }}>
                Recommended Action
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                {activeModalInsight.recommendation}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setActiveModalInsight(null)}
                className="btn btn-secondary btn-sm"
              >
                Dismiss
              </button>
              <button
                onClick={() => handleApplyRecommendation(activeModalInsight)}
                className="btn btn-primary btn-sm"
              >
                Apply Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
