import React, { useState } from 'react';
import { formatINR } from '../../services/analyticsEngine';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  sharePct?: number;
}

interface DonutChartProps {
  title: string;
  subtitle?: string;
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  title,
  subtitle,
  segments,
  centerLabel = 'Total',
  centerValue,
  size = 180
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const displayTotal = centerValue || formatINR(total, true);

  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="nexa-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</h4>
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '12px 0 20px 0',
          position: 'relative'
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
        >
          {segments.map((seg, idx) => {
            const percent = total > 0 ? seg.value / total : 0;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;
            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{
                  cursor: 'pointer',
                  transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                  opacity: hoveredIdx === null || isHovered ? 1 : 0.6
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Text Readout */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {hoveredIdx !== null ? segments[hoveredIdx].label : centerLabel}
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
            {hoveredIdx !== null ? formatINR(segments[hoveredIdx].value, true) : displayTotal}
          </span>
          {hoveredIdx !== null && (
            <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
              {((segments[hoveredIdx].value / total) * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
        {segments.map((seg, idx) => {
          const percent = total > 0 ? ((seg.value / total) * 100).toFixed(1) : '0';
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: isHovered ? 'var(--bg-hover)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.1s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: seg.color,
                    flexShrink: 0
                  }}
                />
                <span
                  style={{
                    fontSize: 12.5,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {seg.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {formatINR(seg.value, true)}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)', width: 38, textAlign: 'right' }}>
                  {percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
