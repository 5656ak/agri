import React, { useState } from 'react';
import { RegionCode, RegionMetric } from '../../types';
import { formatINR, formatPercent } from '../../services/analyticsEngine';

interface IndiaRegionalMapProps {
  regions: RegionMetric[];
  selectedRegion: RegionCode | null;
  onSelectRegion: (r: RegionCode | null) => void;
}

export const IndiaRegionalMap: React.FC<IndiaRegionalMapProps> = ({
  regions,
  selectedRegion,
  onSelectRegion
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<RegionCode | null>(null);

  // Region colors & intensities based on revenue
  const getRegionFill = (regionId: RegionCode, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return '#4F46E5';
    if (isHovered) return '#6366F1';

    switch (regionId) {
      case 'West':
        return '#4338CA'; // Top revenue
      case 'South':
        return '#4F46E5'; // 2nd
      case 'North':
        return '#6366F1'; // 3rd
      case 'East':
        return '#818CF8'; // 4th
      case 'Central':
        return '#A5B4FC'; // 5th
      default:
        return '#CBD5E1';
    }
  };

  const activeRegionData = regions.find(r => r.id === (hoveredRegion || selectedRegion || 'West'));

  return (
    <div
      className="nexa-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '24px 20px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 600 }}>Geographic Territory Performance</h4>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            Click or hover any region to inspect regional KPIs & metro revenue.
          </p>
        </div>
        {selectedRegion && (
          <button
            onClick={() => onSelectRegion(null)}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 11 }}
          >
            Reset Selection
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1fr) minmax(200px, 1fr)',
          gap: 20,
          alignItems: 'center',
          flex: 1
        }}
      >
        {/* Interactive Stylized India SVG Map */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 280
          }}
        >
          <svg
            viewBox="0 0 360 400"
            style={{ width: '100%', maxHeight: 310, overflow: 'visible' }}
          >
            {/* Filter shadows */}
            <defs>
              <filter id="regionGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.25" floodColor="#4F46E5" />
              </filter>
            </defs>

            {/* NORTH ZONE */}
            <path
              d="M 120 40 L 150 20 L 190 25 L 210 55 L 220 100 L 195 130 L 145 130 L 115 100 Z"
              fill={getRegionFill('North', hoveredRegion === 'North', selectedRegion === 'North')}
              stroke="var(--bg-surface)"
              strokeWidth="2"
              filter={hoveredRegion === 'North' || selectedRegion === 'North' ? 'url(#regionGlow)' : 'none'}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={() => setHoveredRegion('North')}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onSelectRegion(selectedRegion === 'North' ? null : 'North')}
            />
            <text x="165" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600" pointerEvents="none">
              North
            </text>

            {/* WEST ZONE */}
            <path
              d="M 60 140 L 125 130 L 150 170 L 140 230 L 80 230 L 50 180 Z"
              fill={getRegionFill('West', hoveredRegion === 'West', selectedRegion === 'West')}
              stroke="var(--bg-surface)"
              strokeWidth="2"
              filter={hoveredRegion === 'West' || selectedRegion === 'West' ? 'url(#regionGlow)' : 'none'}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={() => setHoveredRegion('West')}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onSelectRegion(selectedRegion === 'West' ? null : 'West')}
            />
            <text x="95" y="185" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600" pointerEvents="none">
              West
            </text>

            {/* CENTRAL ZONE */}
            <path
              d="M 145 130 L 195 130 L 220 160 L 210 230 L 140 230 L 150 170 Z"
              fill={getRegionFill('Central', hoveredRegion === 'Central', selectedRegion === 'Central')}
              stroke="var(--bg-surface)"
              strokeWidth="2"
              filter={hoveredRegion === 'Central' || selectedRegion === 'Central' ? 'url(#regionGlow)' : 'none'}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={() => setHoveredRegion('Central')}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onSelectRegion(selectedRegion === 'Central' ? null : 'Central')}
            />
            <text x="175" y="180" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600" pointerEvents="none">
              Central
            </text>

            {/* EAST ZONE */}
            <path
              d="M 220 135 L 270 130 L 320 115 L 340 145 L 310 180 L 250 210 L 220 160 Z"
              fill={getRegionFill('East', hoveredRegion === 'East', selectedRegion === 'East')}
              stroke="var(--bg-surface)"
              strokeWidth="2"
              filter={hoveredRegion === 'East' || selectedRegion === 'East' ? 'url(#regionGlow)' : 'none'}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={() => setHoveredRegion('East')}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onSelectRegion(selectedRegion === 'East' ? null : 'East')}
            />
            <text x="270" y="160" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600" pointerEvents="none">
              East
            </text>

            {/* SOUTH ZONE */}
            <path
              d="M 100 230 L 210 230 L 195 310 L 150 370 L 130 330 Z"
              fill={getRegionFill('South', hoveredRegion === 'South', selectedRegion === 'South')}
              stroke="var(--bg-surface)"
              strokeWidth="2"
              filter={hoveredRegion === 'South' || selectedRegion === 'South' ? 'url(#regionGlow)' : 'none'}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={() => setHoveredRegion('South')}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onSelectRegion(selectedRegion === 'South' ? null : 'South')}
            />
            <text x="155" y="285" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600" pointerEvents="none">
              South
            </text>
          </svg>
        </div>

        {/* Selected / Hovered Region Breakdown Card */}
        {activeRegionData && (
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Zone Focus
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeRegionData.name}
                </h3>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: activeRegionData.growthPct >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  background: activeRegionData.growthPct >= 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {formatPercent(activeRegionData.growthPct)}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Revenue</span>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--brand-primary)', marginTop: 1 }}>
                  {formatINR(activeRegionData.revenue, true)}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Net Margin</span>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#10B981', marginTop: 1 }}>
                  {activeRegionData.marginPct}%
                </p>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Orders</span>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 1 }}>
                  {activeRegionData.orders.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Customers</span>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 1 }}>
                  {activeRegionData.customers.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Top Metro Hubs */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Top City Hubs:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                {activeRegionData.topCities.slice(0, 3).map((city, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span>{city.city}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatINR(city.revenue, true)} ({city.share}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
