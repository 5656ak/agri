import React, { useState } from 'react';
import { TimeSeriesPoint, TimeGranularity } from '../../types';
import { formatINR, formatPercent } from '../../services/analyticsEngine';

interface RevenueAreaChartProps {
  data: TimeSeriesPoint[];
  granularity: TimeGranularity;
  onGranularityChange: (g: TimeGranularity) => void;
  showComparison?: boolean;
}

export const RevenueAreaChart: React.FC<RevenueAreaChartProps> = ({
  data,
  granularity,
  onGranularityChange,
  showComparison = true
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // Chart dimensions
  const height = 280;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  // Max revenue for scaling
  const maxRevenue = Math.max(
    ...data.map(d => Math.max(d.revenue, showComparison ? d.previousRevenue : 0))
  ) * 1.12;

  const yTicks = [0, maxRevenue * 0.25, maxRevenue * 0.5, maxRevenue * 0.75, maxRevenue];

  // Helper for coordinates
  const getX = (idx: number, width: number) => {
    const chartWidth = width - paddingLeft - paddingRight;
    return paddingLeft + (idx / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const chartHeight = height - paddingTop - paddingBottom;
    return height - paddingBottom - (val / maxRevenue) * chartHeight;
  };

  // Construct SVG paths
  const width = 800; // viewBox reference width

  const revenuePoints = data.map((d, i) => ({ x: getX(i, width), y: getY(d.revenue) }));
  const profitPoints = data.map((d, i) => ({ x: getX(i, width), y: getY(d.profit) }));
  const prevPoints = data.map((d, i) => ({ x: getX(i, width), y: getY(d.previousRevenue) }));

  // Cubic spline generator
  const createSpline = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cpX = (curr.x + next.x) / 2;
      d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const revenuePath = createSpline(revenuePoints);
  const profitPath = createSpline(profitPoints);
  const prevPath = createSpline(prevPoints);

  const revenueArea = `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x} ${height - paddingBottom} L ${revenuePoints[0].x} ${height - paddingBottom} Z`;

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];
  const activeCoords = hoverIndex !== null ? revenuePoints[hoverIndex] : revenuePoints[revenuePoints.length - 1];
  const activeProfitCoords = hoverIndex !== null ? profitPoints[hoverIndex] : profitPoints[profitPoints.length - 1];

  const currentGrowth = activePoint
    ? ((activePoint.revenue - activePoint.previousRevenue) / (activePoint.previousRevenue || 1)) * 100
    : 0;

  return (
    <div className="nexa-card" style={{ padding: '24px 24px 16px 24px' }}>
      {/* Header & Granularity Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Revenue Overview</h3>
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                background: 'var(--bg-surface-subtle)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              Real-time trend
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Interactive comparison of revenue, profit, and prior period benchmark.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Granularity Pills */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 3
            }}
          >
            {(['daily', 'weekly', 'monthly', 'quarterly'] as TimeGranularity[]).map(g => (
              <button
                key={g}
                onClick={() => onGranularityChange(g)}
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: granularity === g ? 600 : 400,
                  color: granularity === g ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: granularity === g ? 'var(--bg-surface)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  boxShadow: granularity === g ? 'var(--shadow-xs)' : 'none',
                  textTransform: 'capitalize',
                  transition: 'all 0.1s ease'
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12, fontSize: 12.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4F46E5' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Revenue (Current)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Net Profit</span>
        </div>
        {showComparison && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 14,
                height: 0,
                borderTop: '2px dashed var(--text-muted)',
                opacity: 0.7
              }}
            />
            <span style={{ color: 'var(--text-muted)' }}>Previous Period</span>
          </div>
        )}
      </div>

      {/* Responsive SVG Chart */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.28" />
              <stop offset="90%" stopColor="#4F46E5" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {yTicks.map((val, idx) => {
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--chart-grid)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--text-faint)"
                  fontFamily="var(--font-sans)"
                >
                  {formatINR(val, true)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={revenueArea} fill="url(#revenueGrad)" />

          {/* Previous period dashed line */}
          {showComparison && (
            <path
              d={prevPath}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.6"
              strokeDasharray="5 4"
              opacity="0.65"
            />
          )}

          {/* Profit line */}
          <path
            d={profitPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Revenue line */}
          <path
            d={revenuePath}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-axis labels and invisible hover triggers */}
          {data.map((d, idx) => {
            const x = getX(idx, width);
            const isHovered = hoverIndex === idx;

            return (
              <g key={idx}>
                <text
                  x={x}
                  y={height - paddingBottom + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'}
                  fontWeight={isHovered ? 600 : 400}
                >
                  {d.label}
                </text>

                {/* Hover trigger rectangle column */}
                <rect
                  x={x - (width / data.length) / 2}
                  y={paddingTop}
                  width={width / data.length}
                  height={height - paddingTop - paddingBottom}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverIndex(idx)}
                />
              </g>
            );
          })}

          {/* Interactive cursor line */}
          {activeCoords && (
            <g>
              <line
                x1={activeCoords.x}
                y1={paddingTop}
                x2={activeCoords.x}
                y2={height - paddingBottom}
                stroke="var(--border-strong)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle cx={activeCoords.x} cy={activeCoords.y} r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx={activeProfitCoords.x} cy={activeProfitCoords.y} r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Box */}
        {activePoint && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 16,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-md)',
              fontSize: 12,
              minWidth: 170,
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              zIndex: 10
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span>{activePoint.label}</span>
              <span style={{ color: currentGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                {formatPercent(currentGrowth)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Revenue:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatINR(activePoint.revenue, false)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Profit:</span>
              <span style={{ fontWeight: 600, color: '#10B981' }}>{formatINR(activePoint.profit, false)}</span>
            </div>
            {showComparison && (
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0', borderTop: '1px solid var(--border-subtle)', paddingTop: 4 }}>
                <span style={{ color: 'var(--text-faint)' }}>Prior Period:</span>
                <span style={{ color: 'var(--text-muted)' }}>{formatINR(activePoint.previousRevenue, false)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
