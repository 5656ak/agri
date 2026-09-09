import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { computeRegionalBreakdown, formatINR, formatPercent } from '../services/analyticsEngine';
import { RegionCode } from '../types';
import { IndiaRegionalMap } from '../components/charts/IndiaRegionalMap';
import { 
  MapPin, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  Building2, 
  DollarSign,
  UploadCloud,
  Table,
  Plus
} from 'lucide-react';

export const RegionsPage: React.FC = () => {
  const { orders, setActiveTab } = useAnalytics();
  const regions = computeRegionalBreakdown(orders);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | null>(null);

  // ==========================================
  // ZERO-DATA EMPTY STATE
  // ==========================================
  if (orders.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Geographic & Regional Territory Intelligence
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            State corridors, Tier-1/Tier-2 city hubs, logistical margin health, and regional customer growth.
          </p>
        </div>

        <div
          className="nexa-card"
          style={{
            padding: '48px 32px',
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
            <MapPin size={26} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            No geographic territory data found
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 24px auto', lineHeight: 1.55 }}>
            Regional distribution maps, state clusters, and city hub analytics are derived from your order dataset. Upload sales records with a 'Region', 'State', or 'City' column to view geographic performance.
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
      </div>
    );
  }

  // ==========================================
  // ORDERS EXIST BUT NO REGIONS FOUND
  // ==========================================
  if (regions.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Geographic & Regional Territory Intelligence
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            State corridors, Tier-1/Tier-2 city hubs, logistical margin health, and regional customer growth.
          </p>
        </div>

        <div className="nexa-card" style={{ padding: 32, textAlign: 'center' }}>
          <MapPin size={36} style={{ color: '#F59E0B', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            No Region Column Detected in Current Dataset
          </h3>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 20px auto' }}>
            Your workspace contains {orders.length} order records, but none contain a recognised 'Region' or 'State' value (e.g. North, South, East, West, Central).
          </p>
          <button onClick={() => setActiveTab('manual-entry')} className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Add Regional Orders in Spreadsheet</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE REGIONS VIEW
  // ==========================================
  const displayRegions = selectedRegion
    ? regions.filter(r => r.id === selectedRegion)
    : regions;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Geographic & Regional Territory Intelligence
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
          Tracking sales across {regions.length} active territories based on your real transactions.
        </p>
      </div>

      {/* Interactive Regional Choropleth Map Component */}
      <IndiaRegionalMap
        regions={regions}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      {/* Ranked Region Cards Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Ranked Regional Performance</h3>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Ranked by contribution to gross volume
        </span>
      </div>

      {/* Ranked Region Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {regions.map((region) => {
          const isSelected = selectedRegion === region.id;

          return (
            <div
              key={region.id}
              onClick={() => setSelectedRegion(isSelected ? null : region.id)}
              className="nexa-card"
              style={{
                padding: 18,
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--brand-primary-light)' : 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {region.name}
                </span>
                <span className="badge badge-neutral">{region.id}</span>
              </div>

              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-primary)', margin: '4px 0' }}>
                {formatINR(region.revenue)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
                <span>{region.orders} orders</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>{region.marginPct}% margin</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
