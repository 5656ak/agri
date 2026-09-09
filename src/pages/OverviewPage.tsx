import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { useAuth } from '../context/AuthContext';
import { 
  computeTimeSeries, 
  computeCategoryBreakdown, 
  computeRegionalBreakdown, 
  computeChannelBreakdown,
  formatINR, 
  formatNumber, 
  formatPercent 
} from '../services/analyticsEngine';
import { exportOrdersToCsv } from '../services/exportService';
import { getExecutiveSummary } from '../services/aiInsightEngine';
import { TimeGranularity } from '../types';
import { Sparkline } from '../components/charts/Sparkline';
import { RevenueAreaChart } from '../components/charts/RevenueAreaChart';
import { DonutChart } from '../components/charts/DonutChart';
import { 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Download, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight,
  UploadCloud,
  Table,
  FileSpreadsheet,
  Database,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { kpis, orders, compareWithPrevious, setActiveTab, addToast } = useAnalytics();
  const { user, businessProfile } = useAuth();
  const [granularity, setGranularity] = useState<TimeGranularity>('monthly');

  const businessName = businessProfile?.businessName || user?.businessName || 'your business';
  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  const handleExport = () => {
    if (orders.length === 0) {
      addToast('No orders to export yet. Please upload data first.', 'warning');
      return;
    }
    exportOrdersToCsv(orders);
    addToast('Exported active sales order dataset as CSV', 'success');
  };

  const handleDownloadTemplate = () => {
    const templateHeaders = 'Order ID,Date,Customer Name,Customer Email,Product Name,Category,Quantity,Revenue,Cost,Region,Channel,Status\n';
    const sampleRows = [
      'ORD-1001,2026-08-01,Rohan Sharma,rohan@example.com,NEXA SoundPod Pro,Consumer Electronics,1,2499,1200,North,Direct Website,Delivered\n',
      'ORD-1002,2026-08-02,Priya Patel,priya@example.com,ErgoChair Elite,Office & Workspace,1,14999,8500,West,Amazon,Delivered\n',
      'ORD-1003,2026-08-03,Anil Kumar,anil@example.com,Artisanal Coffee Beans,Gourmet Food,2,1598,600,South,Direct Website,Delivered\n'
    ].join('');
    const blob = new Blob([templateHeaders + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nexa_sales_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Sample CSV template downloaded', 'info');
  };

  // ==========================================
  // ZERO-DATA EMPTY STATE
  // ==========================================
  if (!kpis.hasData || orders.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Welcome, {userName}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
              Your workspace for <strong style={{ color: 'var(--text-primary)' }}>{businessName}</strong> is initialized and ready for data.
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="btn btn-secondary btn-sm"
            style={{ gap: 6 }}
          >
            <Download size={14} />
            <span>Download CSV Template</span>
          </button>
        </div>

        {/* Hero Zero-State Card */}
        <div
          className="nexa-card"
          style={{
            padding: '36px 32px',
            background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.2)'
              }}
            >
              <UploadCloud size={28} />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              No business data loaded yet
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 26 }}>
              NEXA Analytics never shows generic mock figures. To see real revenue, margins, customer retention cohorts, regional sales maps, and AI forecasting, provide your business sales records below.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('data-sources')}
                className="btn btn-primary"
                style={{ padding: '10px 22px', fontSize: 14, gap: 8 }}
              >
                <UploadCloud size={16} />
                <span>Upload CSV / Excel File</span>
              </button>
              <button
                onClick={() => setActiveTab('manual-entry')}
                className="btn btn-secondary"
                style={{ padding: '10px 20px', fontSize: 14, gap: 8 }}
              >
                <Table size={16} />
                <span>Enter Orders in Spreadsheet</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-Stage Pipeline Diagram */}
        <div className="nexa-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: 'var(--text-primary)' }}>
            How NEXA Intelligence Processes Your Data
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Step 1 */}
            <div style={{ padding: 18, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--brand-primary)', color: '#FFFFFF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  1
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Data Ingestion</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Upload an existing CSV/Excel file or type records into the built-in spreadsheet editor.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ padding: 18, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#06B6D4', color: '#FFFFFF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  2
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Normalization Engine</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Automatic column matching, date parsing, margin reconciliation, and data quality validation.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ padding: 18, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#10B981', color: '#FFFFFF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  3
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Executive Intelligence</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Real-time KPI cards, interactive charts, RFM customer cohorts, regional maps, and AI insights.
              </p>
            </div>
          </div>
        </div>

        {/* Data Schema Guidance */}
        <div className="nexa-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FileSpreadsheet size={18} style={{ color: 'var(--brand-primary)' }} />
            <h4 style={{ fontSize: 14, fontWeight: 600 }}>Supported Columns in CSV / Excel</h4>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
            NEXA's smart column mapper automatically recognizes common variations (e.g. "Amount" or "Total" for Revenue, "Date" or "Timestamp").
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Date', required: true },
              { label: 'Revenue / Amount', required: true },
              { label: 'Product Name', required: false },
              { label: 'Category', required: false },
              { label: 'Customer Name / ID', required: false },
              { label: 'Quantity', required: false },
              { label: 'Cost / COGS', required: false },
              { label: 'Region / State', required: false },
              { label: 'Channel', required: false },
              { label: 'Order Status', required: false }
            ].map(col => (
              <span
                key={col.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: col.required ? 'var(--brand-primary-light)' : 'var(--bg-surface-subtle)',
                  border: `1px solid ${col.required ? 'var(--brand-primary-border)' : 'var(--border-subtle)'}`,
                  fontSize: 12,
                  color: col.required ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: col.required ? 600 : 500
                }}
              >
                <CheckCircle2 size={12} style={{ color: col.required ? 'var(--brand-primary)' : '#10B981' }} />
                {col.label} {col.required ? '(Required)' : '(Optional)'}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE DATA DASHBOARD
  // ==========================================
  const timeSeriesData = computeTimeSeries(orders, granularity);
  const categories = computeCategoryBreakdown(orders);
  const regions = computeRegionalBreakdown(orders);
  const channels = computeChannelBreakdown(orders);

  // Dynamic sparklines generated from real data
  const revenueSparkline = timeSeriesData.length > 0 
    ? timeSeriesData.map(p => p.revenue) 
    : [kpis.revenue];
  const profitSparkline = timeSeriesData.length > 0 
    ? timeSeriesData.map(p => p.profit) 
    : [kpis.profit];
  const ordersSparkline = timeSeriesData.length > 0 
    ? timeSeriesData.map(p => p.orders) 
    : [kpis.orders];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Good day, {userName}
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Here is the live performance summary for <strong style={{ color: 'var(--text-primary)' }}>{businessName}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={handleExport} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button onClick={() => setActiveTab('manual-entry')} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
            <Table size={14} />
            <span>Add Orders</span>
          </button>
        </div>
      </div>

      {/* AI Executive Intelligence Alert Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid var(--brand-primary-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--brand-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Executive Briefing · AI Dynamic Synthesis
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>
              {getExecutiveSummary(kpis, orders)}
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('ai-insights')}
          className="btn btn-primary btn-sm"
          style={{ flexShrink: 0, gap: 6 }}
        >
          <span>View AI Insights</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 5 High-Quality Dynamic KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16
        }}
      >
        {/* KPI 1: Revenue */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Revenue</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {kpis.totalRevenueFormatted}
              </div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IndianRupee size={16} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: kpis.revenueGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {kpis.revenueGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {formatPercent(kpis.revenueGrowth)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>vs prior period</span>
            </div>
            {revenueSparkline.length > 1 && (
              <Sparkline data={revenueSparkline} isPositive={kpis.revenueGrowth >= 0} width={74} height={24} />
            )}
          </div>
        </div>

        {/* KPI 2: Net Profit */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Net Profit</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981', marginTop: 2 }}>
                {kpis.totalProfitFormatted}
              </div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp size={16} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: kpis.profitGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {kpis.profitGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {formatPercent(kpis.profitGrowth)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{kpis.profitMargin}% margin</span>
            </div>
            {profitSparkline.length > 1 && (
              <Sparkline data={profitSparkline} isPositive={kpis.profitGrowth >= 0} width={74} height={24} />
            )}
          </div>
        </div>

        {/* KPI 3: Orders */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Orders</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {kpis.orderCountFormatted}
              </div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(6, 182, 212, 0.12)',
                color: '#06B6D4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShoppingBag size={16} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: kpis.orderGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {kpis.orderGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {formatPercent(kpis.orderGrowth)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>transactions</span>
            </div>
            {ordersSparkline.length > 1 && (
              <Sparkline data={ordersSparkline} isPositive={kpis.orderGrowth >= 0} width={74} height={24} />
            )}
          </div>
        </div>

        {/* KPI 4: Customers */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Customers</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {kpis.customerCountFormatted}
              </div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(139, 92, 246, 0.12)',
                color: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={16} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: kpis.customerGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {kpis.customerGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {formatPercent(kpis.customerGrowth)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>unique buyers</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Average Order Value (AOV) */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Average Order Value</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {kpis.aovFormatted}
              </div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CreditCard size={16} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: kpis.aovGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {kpis.aovGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {formatPercent(kpis.aovGrowth)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>per basket</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Revenue Chart & Category Breakdown Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Revenue Velocity Chart */}
        <div className="nexa-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Revenue Trend</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Calculated strictly from your ingested order records
              </p>
            </div>

            <div style={{ display: 'inline-flex', background: 'var(--bg-surface-subtle)', borderRadius: 6, padding: 3 }}>
              {(['daily', 'weekly', 'monthly', 'quarterly'] as TimeGranularity[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  style={{
                    border: 'none',
                    background: granularity === g ? 'var(--bg-surface)' : 'transparent',
                    color: granularity === g ? 'var(--brand-primary)' : 'var(--text-muted)',
                    fontSize: 11.5,
                    fontWeight: granularity === g ? 600 : 500,
                    padding: '4px 10px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    boxShadow: granularity === g ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <RevenueAreaChart
            data={timeSeriesData}
            granularity={granularity}
            onGranularityChange={setGranularity}
            showComparison={compareWithPrevious}
          />
        </div>

        {/* Category Breakdown Donut */}
        <div className="nexa-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DonutChart
              title="Category Distribution"
              subtitle="Revenue share by catalog category"
              segments={categories.map((c, idx) => {
                const colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
                return {
                  label: c.category,
                  value: c.revenue,
                  color: colors[idx % colors.length],
                  sharePct: c.sharePct
                };
              })}
              centerLabel="Total Sales"
              centerValue={kpis.totalRevenueFormatted}
            />
          </div>
        </div>
      </div>

      {/* Regional & Channel Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Top Channels */}
        <div className="nexa-card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Sales by Channel</h3>
          {channels.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No channel data specified in records.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {channels.map(ch => (
                <div key={ch.channel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 6, background: 'var(--bg-surface-subtle)' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{ch.channel}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{ch.orders} orders</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{formatINR(ch.revenue)}</div>
                    <div style={{ fontSize: 11, color: 'var(--brand-primary)' }}>{ch.sharePct}% share</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regional Territory Contribution */}
        <div className="nexa-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Regional Territories</h3>
            <button onClick={() => setActiveTab('regions')} className="btn btn-ghost btn-xs" style={{ color: 'var(--brand-primary)' }}>
              Open Map →
            </button>
          </div>
          {regions.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No regional territory data found in dataset.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {regions.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 6, background: 'var(--bg-surface-subtle)' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{r.orders} orders</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{formatINR(r.revenue)}</div>
                    <div style={{ fontSize: 11, color: '#10B981' }}>{r.marginPct}% margin</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
