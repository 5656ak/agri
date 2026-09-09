import React from 'react';
import { AiInsight } from '../../types';
import { useAnalytics } from '../../context/AnalyticsContext';
import { 
  TrendingUp, 
  AlertTriangle, 
  AlertOctagon, 
  Lightbulb, 
  ArrowRight, 
  Clock 
} from 'lucide-react';

interface AiInsightCardProps {
  insight: AiInsight;
  onActionClick?: (insight: AiInsight) => void;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ insight, onActionClick }) => {
  const { setActiveTab } = useAnalytics();

  let Icon = Lightbulb;
  let badgeVariant: 'success' | 'warning' | 'danger' | 'info' = 'info';
  let badgeLabel = 'Recommendation';
  let accentBorder = 'var(--border-subtle)';

  switch (insight.type) {
    case 'opportunity':
      Icon = TrendingUp;
      badgeVariant = 'success';
      badgeLabel = 'Growth Opportunity';
      accentBorder = 'var(--color-success-border)';
      break;
    case 'risk':
      Icon = AlertOctagon;
      badgeVariant = 'danger';
      badgeLabel = 'Risk Detected';
      accentBorder = 'var(--color-danger-border)';
      break;
    case 'warning':
      Icon = AlertTriangle;
      badgeVariant = 'warning';
      badgeLabel = 'Warning Signal';
      accentBorder = 'var(--color-warning-border)';
      break;
    case 'recommendation':
      Icon = Lightbulb;
      badgeVariant = 'info';
      badgeLabel = 'Strategic Action';
      accentBorder = 'var(--brand-primary-border)';
      break;
  }

  const handleAction = () => {
    if (onActionClick) {
      onActionClick(insight);
    } else if (insight.actionTarget) {
      setActiveTab(insight.actionTarget);
    }
  };

  return (
    <div
      className="nexa-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: accentBorder,
        position: 'relative',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
    >
      <div>
        {/* Top Header: Badge, Impact, Date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className={`badge badge-${badgeVariant}`}>
            <Icon size={12} />
            <span>{badgeLabel}</span>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                padding: '1px 6px',
                borderRadius: 4,
                background: 'var(--bg-surface-subtle)',
                color: insight.impact === 'High' ? 'var(--color-danger)' : 'var(--text-secondary)'
              }}
            >
              {insight.impact} Impact
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={12} />
              {insight.date}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.35 }}>
          {insight.title}
        </h4>

        {/* Description */}
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 14 }}>
          {insight.description}
        </p>

        {/* Metric Highlight Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            marginBottom: 14
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Observed Signal</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: insight.type === 'risk' ? 'var(--color-danger)' : 'var(--color-success)'
              }}
            >
              {insight.metric}
            </span>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>({insight.metricChange})</span>
          </div>
        </div>

        {/* Recommendation snippet */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            AI Prescribed Action:
          </span>
          <p style={{ fontSize: 12.5, color: 'var(--text-primary)', marginTop: 3, fontWeight: 500 }}>
            {insight.recommendation}
          </p>
        </div>
      </div>

      {/* Action CTA Button */}
      <button
        onClick={handleAction}
        className="btn btn-secondary btn-sm"
        style={{
          width: '100%',
          justifyContent: 'center',
          borderColor: accentBorder,
          marginTop: 6
        }}
      >
        <span>{insight.ctaLabel}</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
};
