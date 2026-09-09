import React, { useState } from 'react';
import { ForecastPoint } from '../../types';
import { formatINR } from '../../services/analyticsEngine';

interface ForecastChartProps {
  points: ForecastPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ points }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!points || points.length === 0) return null;

  const height = 300;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 45;
  const width = 840;

  const maxVal = Math.max(...points.map(p => Math.max(p.upperConfidence, p.historicalRevenue || 0))) * 1.15;
  const minVal = Math.min(...points.map(p => Math.min(p.lowerConfidence, p.historicalRevenue || p.lowerConfidence))) * 0.85;
  const range = maxVal - minVal || 1;

  const getX = (idx: number) => {
    const chartW = width - paddingLeft - paddingRight;
    return paddingLeft + (idx / (points.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    const chartH = height - paddingTop - paddingBottom;
    return height - paddingBottom - ((val - minVal) / range) * chartH;
  };

  // Find index where historical ends and forecast begins
  const transitionIndex = points.findIndex(p => p.historicalRevenue === undefined);
  const cutoffIndex = transitionIndex === -1 ? points.length : transitionIndex;

  // Historical points
  const histPoints = points.slice(0, cutoffIndex).map((p, i) => ({
    x: getX(i),
    y: getY(p.historicalRevenue || p.forecastRevenue)
  }));

  // Forecast points (starts from the last historical point for continuity)
  const forecastStartIndex = Math.max(0, cutoffIndex - 1);
  const fcPoints = points.slice(forecastStartIndex).map((p, i) => {
    const actualIdx = forecastStartIndex + i;
    return {
      x: getX(actualIdx),
      y: getY(p.forecastRevenue),
      upperY: getY(p.upperConfidence),
      lowerY: getY(p.lowerConfidence)
    };
  });

  const createLinePath = (pts: { x: number; y: number }[]) => {
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

  const histPath = createLinePath(histPoints);
  const fcPath = createLinePath(fcPoints);

  // Confidence interval polygon area
  let confidencePolygon = '';
  if (fcPoints.length > 0) {
    const topPath = fcPoints.map(p => `${p.x},${p.upperY}`).join(' L ');
    const bottomPath = [...fcPoints].reverse().map(p => `${p.x},${p.lowerY}`).join(' L ');
    confidencePolygon = `M ${topPath} L ${bottomPath} Z`;
  }

  const yTicks = [
    minVal,
    minVal + range * 0.33,
    minVal + range * 0.66,
    maxVal
  ];

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[points.length - 1];
  const activeX = hoverIdx !== null ? getX(hoverIdx) : getX(points.length - 1);
  const isActual = hoverIdx !== null && hoverIdx < cutoffIndex && points[hoverIdx].historicalRevenue !== undefined;

  return (
    <div className="nexa-card" style={{ padding: '24px 24px 16px 24px' }}>
      {/* Legend & Model Badge */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 2.5, background: '#4F46E5', borderRadius: 2 }} />
            <span style={{ color: 'var(--text-secondary)' }}>Actual Historical Data</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 16,
                height: 0,
                borderTop: '2px dashed #06B6D4'
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Forecast (Projected)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 14,
                height: 10,
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: 2
              }}
            />
            <span style={{ color: 'var(--text-muted)' }}>95% Confidence Interval</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 11.5,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
          <span>Model: Holt-Winters Seasonal Auto-ARIMA</span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
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

          {/* Vertical Transition Boundary Line */}
          {cutoffIndex < points.length && (
            <g>
              <line
                x1={getX(cutoffIndex - 1)}
                y1={paddingTop}
                x2={getX(cutoffIndex - 1)}
                y2={height - paddingBottom}
                stroke="var(--border-medium)"
                strokeDasharray="2 2"
              />
              <text
                x={getX(cutoffIndex - 1)}
                y={paddingTop - 8}
                textAnchor="middle"
                fontSize="10"
                fill="var(--text-muted)"
                fontWeight="500"
              >
                Today
              </text>
            </g>
          )}

          {/* Confidence interval band */}
          {confidencePolygon && <path d={confidencePolygon} fill="url(#confidenceGrad)" />}

          {/* Forecast line (dashed) */}
          <path
            d={fcPath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2.2"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* Historical line (solid) */}
          <path
            d={histPath}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points on Line */}
          {points.map((p, idx) => {
            const x = getX(idx);
            const y = getY(p.historicalRevenue || p.forecastRevenue);
            const isFc = idx >= cutoffIndex;
            const isHovered = hoverIdx === idx;

            return (
              <g key={idx}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 5 : 3}
                  fill={isFc ? '#06B6D4' : '#4F46E5'}
                  stroke="var(--bg-surface)"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={height - paddingBottom + 18}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'}
                  fontWeight={isHovered ? 600 : 400}
                >
                  {p.label}
                </text>

                {/* Hover trigger hit box */}
                <rect
                  x={x - (width / points.length) / 2}
                  y={paddingTop}
                  width={width / points.length}
                  height={height - paddingTop - paddingBottom}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverIdx(idx)}
                />
              </g>
            );
          })}

          {/* Active hover crosshair */}
          {hoverIdx !== null && (
            <line
              x1={activeX}
              y1={paddingTop}
              x2={activeX}
              y2={height - paddingBottom}
              stroke="var(--border-strong)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          )}
        </svg>

        {/* Floating Tooltip Box */}
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
              minWidth: 180,
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{activePoint.label}</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: isActual ? 'rgba(79, 70, 229, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                  color: isActual ? '#4F46E5' : '#06B6D4',
                  fontWeight: 600
                }}
              >
                {isActual ? 'Actual' : 'Projected'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Revenue:</span>
              <span style={{ fontWeight: 600, color: isActual ? '#4F46E5' : '#06B6D4' }}>
                {formatINR(activePoint.historicalRevenue || activePoint.forecastRevenue, false)}
              </span>
            </div>

            {!isActual && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', fontSize: 11 }}>
                  <span style={{ color: 'var(--text-faint)' }}>Upper 95% Bound:</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                    {formatINR(activePoint.upperConfidence, false)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', fontSize: 11 }}>
                  <span style={{ color: 'var(--text-faint)' }}>Lower 95% Bound:</span>
                  <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>
                    {formatINR(activePoint.lowerConfidence, false)}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
