import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { generateForecast, ForecastHorizon } from '../services/forecastEngine';
import { formatINR, formatPercent } from '../services/analyticsEngine';
import { ForecastChart } from '../components/charts/ForecastChart';
import { 
  LineChart, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  AlertCircle, 
  HelpCircle,
  UploadCloud,
  Table,
  Plus,
  CheckCircle2
} from 'lucide-react';

export const ForecastPage: React.FC = () => {
  const { orders, setActiveTab } = useAnalytics();
  const [horizon, setHorizon] = useState<ForecastHorizon>('90d');
  const [priceElasticityMultiplier, setPriceElasticityMultiplier] = useState(1.0);

  const forecast = generateForecast(orders, horizon);

  // ==========================================
  // ZERO-DATA / INSUFFICIENT DATA EMPTY STATE
  // ==========================================
  if (!forecast.canForecast) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Sales Forecast</h1>
            <span className="badge badge-info">Predictive Engine</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Autoregressive predictive modeling with probabilistic confidence intervals.
          </p>
        </div>

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
            <LineChart size={26} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Predictive Model Awaiting Historical Data
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 20px auto', lineHeight: 1.6 }}>
            {forecast.reason || 'NEXA builds forecasts using seasonal auto-ARIMA regression on your actual business history. To train the predictive algorithm, provide order records spanning at least 2 monthly cycles.'}
          </p>

          <div
            style={{
              maxWidth: 460,
              margin: '0 auto 28px auto',
              padding: 16,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
              Requirements for Autonomous Forecasting:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} style={{ color: orders.length >= 6 ? '#10B981' : 'var(--text-muted)' }} />
                At least 6 chronological transactions with valid dates ({orders.length} currently loaded)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} style={{ color: 'var(--text-muted)' }} />
                Orders distributed across 2 or more calendar months
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} style={{ color: orders.length > 0 ? '#10B981' : 'var(--text-muted)' }} />
                Numeric revenue/amount values per order
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('data-sources')}
              className="btn btn-primary"
              style={{ padding: '9px 20px', gap: 8 }}
            >
              <UploadCloud size={15} />
              <span>Import Historical Sales CSV</span>
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
  // ACTIVE FORECAST VIEW
  // ==========================================
  const expectedRevenue = Math.round(forecast.expectedRevenue * priceElasticityMultiplier);
  const bestCase = Math.round(forecast.bestCase * priceElasticityMultiplier);
  const worstCase = Math.round(forecast.worstCase * priceElasticityMultiplier);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Horizon Toggles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Sales Forecast</h1>
            <span className="badge badge-info">AI Predictive Model</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Projected business performance based on your {orders.length} historical transactions.
          </p>
        </div>

        {/* Forecast Horizon Switcher */}
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 4
          }}
        >
          {([
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: '6m', label: '6 Months' },
            { id: '12m', label: '12 Months' },
          ] as { id: ForecastHorizon; label: string }[]).map(h => (
            <button
              key={h.id}
              onClick={() => setHorizon(h.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: horizon === h.id ? 'var(--brand-primary)' : 'transparent',
                color: horizon === h.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: 12.5,
                fontWeight: horizon === h.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Projection Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        {/* Expected Revenue */}
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Expected Projection</span>
            <Sparkles size={16} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatINR(expectedRevenue)}
          </div>
          <div style={{ fontSize: 12, color: forecast.expectedGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600, marginTop: 4 }}>
            {formatPercent(forecast.expectedGrowth)} vs historical
          </div>
        </div>

        {/* Bull Case */}
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bull Case (High Bound)</span>
            <TrendingUp size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981' }}>
            {formatINR(bestCase)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            80% confidence upper ceiling
          </div>
        </div>

        {/* Conservative Floor */}
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Conservative Floor</span>
            <AlertCircle size={16} style={{ color: '#F59E0B' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatINR(worstCase)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            80% confidence lower floor
          </div>
        </div>

        {/* Statistical Confidence */}
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Model Confidence</span>
            <ShieldCheck size={16} style={{ color: '#06B6D4' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#06B6D4' }}>
            {forecast.confidenceScore}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Based on {orders.length} order history
          </div>
        </div>
      </div>

      {/* Main Interactive Forecast Chart */}
      <div className="nexa-card" style={{ padding: 24 }}>
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            Historical Sales & Projected Runway ({horizon})
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Solid line shows actual order data; dashed line and shaded area denote forecast and confidence envelope.
          </p>
        </div>

        <ForecastChart
          points={forecast.points.map(p => ({
            ...p,
            forecastRevenue: Math.round(p.forecastRevenue * priceElasticityMultiplier),
            upperConfidence: Math.round(p.upperConfidence * priceElasticityMultiplier),
            lowerConfidence: Math.round(p.lowerConfidence * priceElasticityMultiplier),
          }))}
        />
      </div>

      {/* Scenario Multiplier Driver */}
      <div className="nexa-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Sliders size={18} style={{ color: 'var(--brand-primary)' }} />
          <h4 style={{ fontSize: 14, fontWeight: 700 }}>Scenario Analysis & Multiplier</h4>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
          Adjust the multiplier below to simulate campaign impact or market headwinds:
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input
            type="range"
            min="0.7"
            max="1.4"
            step="0.05"
            value={priceElasticityMultiplier}
            onChange={e => setPriceElasticityMultiplier(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--brand-primary)' }}
          />
          <span style={{ fontSize: 14, fontWeight: 700, minWidth: 60 }}>
            {Math.round(priceElasticityMultiplier * 100)}%
          </span>
          <button
            onClick={() => setPriceElasticityMultiplier(1.0)}
            className="btn btn-ghost btn-xs"
            disabled={priceElasticityMultiplier === 1.0}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
