import React from 'react';
import { formatINR } from '../../services/analyticsEngine';

export interface BarItem {
  label: string;
  sublabel?: string;
  value: number;
  total?: number;
  color?: string;
  formattedValue?: string;
  growthPct?: number;
}

interface HorizontalBarChartProps {
  items: BarItem[];
  title?: string;
  subtitle?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  items,
  title,
  subtitle
}) => {
  const maxValue = Math.max(...items.map(i => i.value)) || 1;

  return (
    <div className="nexa-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {title && (
        <div style={{ marginBottom: 16 }}>
          <h4 style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</h4>
          {subtitle && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((item, idx) => {
          const percent = Math.round((item.value / maxValue) * 100);
          const color = item.color || '#4F46E5';

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                <div>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
                  {item.sublabel && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                      ({item.sublabel})
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.formattedValue || formatINR(item.value, true)}
                  </span>
                  {item.growthPct !== undefined && (
                    <span
                      style={{
                        fontSize: 11,
                        color: item.growthPct >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                        fontWeight: 500
                      }}
                    >
                      {item.growthPct >= 0 ? '+' : ''}{item.growthPct}%
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 6,
                  width: '100%',
                  background: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
