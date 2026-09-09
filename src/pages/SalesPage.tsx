import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { exportOrdersToCsv } from '../services/exportService';
import { formatINR, formatPercent, computeChannelBreakdown } from '../services/analyticsEngine';
import { Order } from '../types';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  ShoppingBag, 
  Percent, 
  CreditCard,
  UploadCloud,
  Table,
  Plus
} from 'lucide-react';
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';

export const SalesPage: React.FC = () => {
  const { orders, addToast, setActiveTab, kpis } = useAnalytics();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Sorting
  const [sortField, setSortField] = useState<'date' | 'revenue' | 'profit'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dynamic filter options derived from current orders
  const availableCategories = useMemo(() => {
    return Array.from(new Set(orders.map(o => o.category).filter(Boolean))).sort();
  }, [orders]);

  const availableRegions = useMemo(() => {
    return Array.from(new Set(orders.map(o => o.region).filter(Boolean))).sort();
  }, [orders]);

  const availableChannels = useMemo(() => {
    return Array.from(new Set(orders.map(o => o.channel).filter(Boolean))).sort();
  }, [orders]);

  const availableStatuses = useMemo(() => {
    return Array.from(new Set(orders.map(o => o.status).filter(Boolean))).sort();
  }, [orders]);

  // Filtered and sorted dataset
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.productName || '').toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === 'All' || o.category === selectedCategory;
      const matchRegion = selectedRegion === 'All' || o.region === selectedRegion;
      const matchChannel = selectedChannel === 'All' || o.channel === selectedChannel;
      const matchStatus = selectedStatus === 'All' || o.status === selectedStatus;

      return matchSearch && matchCategory && matchRegion && matchChannel && matchStatus;
    }).sort((a, b) => {
      let valA: any = a[sortField] ?? 0;
      let valB: any = b[sortField] ?? 0;

      if (sortField === 'date') {
        valA = new Date(valA).getTime() || 0;
        valB = new Date(valB).getTime() || 0;
      }

      if (sortAsc) return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }, [orders, search, selectedCategory, selectedRegion, selectedChannel, selectedStatus, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: 'date' | 'revenue' | 'profit') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      addToast('No orders to export in current selection', 'warning');
      return;
    }
    exportOrdersToCsv(filteredOrders);
    addToast(`Exported ${filteredOrders.length} sales orders to CSV`, 'success');
  };

  // Channel breakdown calculated dynamically from orders
  const channelBreakdown = useMemo(() => {
    return computeChannelBreakdown(orders);
  }, [orders]);

  // ==========================================
  // ZERO-DATA EMPTY STATE
  // ==========================================
  if (orders.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Sales Ledger & Transactions</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Real-time transaction tracking, order statuses, unit profit attribution, and fulfillment.
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
            <ShoppingBag size={26} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            No sales transactions found
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 24px auto', lineHeight: 1.55 }}>
            Your sales ledger will populate automatically once you ingest your order data. You can upload a CSV/Excel file or add orders directly via the spreadsheet interface.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('data-sources')}
              className="btn btn-primary"
              style={{ padding: '9px 20px', gap: 8 }}
            >
              <UploadCloud size={15} />
              <span>Import Sales Records</span>
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
  // ACTIVE DATA VIEW
  // ==========================================
  const channelColors = ['#4F46E5', '#38BDF8', '#34D399', '#FBBF24', '#A855F7', '#F43F5E'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Sales Ledger & Transactions</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Displaying {orders.length} transaction records with real-time margins and fulfillment data.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleExport} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button onClick={() => setActiveTab('manual-entry')} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
            <Plus size={14} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gross Sales</span>
            <TrendingUp size={16} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            {kpis.totalRevenueFormatted}
          </div>
          <div style={{ fontSize: 12, color: kpis.revenueGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600, marginTop: 4 }}>
            {formatPercent(kpis.revenueGrowth)} growth
          </div>
        </div>

        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fulfilled Orders</span>
            <ShoppingBag size={16} style={{ color: '#06B6D4' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            {kpis.orderCountFormatted}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Across active channels
          </div>
        </div>

        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Net Margin Health</span>
            <Percent size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981' }}>
            {kpis.profitMargin}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600, marginTop: 4 }}>
            {kpis.totalProfitFormatted} net profit
          </div>
        </div>

        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Average Basket Value</span>
            <CreditCard size={16} style={{ color: '#F59E0B' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            {kpis.aovFormatted}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Per order fulfilled
          </div>
        </div>
      </div>

      {/* Dynamic Channel Breakdown Chart */}
      {channelBreakdown.length > 0 && (
        <HorizontalBarChart
          title="Sales Volume by Omnichannel Attribution"
          subtitle="Gross revenue split across recorded sales channels"
          items={channelBreakdown.map((ch, idx) => ({
            label: ch.channel,
            sublabel: `${ch.sharePct}% share (${ch.orders} orders)`,
            value: ch.revenue,
            growthPct: 0,
            color: channelColors[idx % channelColors.length]
          }))}
        />
      )}

      {/* Filter and Search Bar */}
      <div
        className="nexa-card"
        style={{
          padding: 16,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              width: '100%',
              maxWidth: 340
            }}
          >
            <Search size={15} style={{ color: 'var(--text-faint)' }} />
            <input
              type="text"
              placeholder="Search by order #, customer, or SKU..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: 13,
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {availableCategories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="select-input"
              style={{ fontSize: 12.5 }}
            >
              <option value="All">All Categories</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {availableRegions.length > 0 && (
            <select
              value={selectedRegion}
              onChange={e => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="select-input"
              style={{ fontSize: 12.5 }}
            >
              <option value="All">All Regions</option>
              {availableRegions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}

          {availableChannels.length > 0 && (
            <select
              value={selectedChannel}
              onChange={e => {
                setSelectedChannel(e.target.value);
                setCurrentPage(1);
              }}
              className="select-input"
              style={{ fontSize: 12.5 }}
            >
              <option value="All">All Channels</option>
              {availableChannels.map(ch => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          )}

          {availableStatuses.length > 0 && (
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="select-input"
              style={{ fontSize: 12.5 }}
            >
              <option value="All">All Statuses</option>
              {availableStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="nexa-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Date</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>Customer</th>
              <th>Product / SKU</th>
              <th>Category</th>
              <th>Region</th>
              <th onClick={() => handleSort('revenue')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Amount</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('profit')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Profit</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(order => {
              let statusBadge: 'success' | 'info' | 'warning' | 'danger' = 'info';
              if (order.status === 'Delivered') statusBadge = 'success';
              else if (order.status === 'Shipped') statusBadge = 'info';
              else if (order.status === 'Processing') statusBadge = 'warning';
              else if (order.status === 'Cancelled') statusBadge = 'danger';

              return (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--brand-primary)' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{order.date}</td>
                  <td style={{ fontWeight: 500 }}>{order.customerName}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {order.productName}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{order.category || 'General'}</td>
                  <td>
                    <span className="badge badge-neutral">{order.region || '—'}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {formatINR(order.revenue, false)}
                  </td>
                  <td style={{ fontWeight: 600, color: (order.profit || 0) > 0 ? '#10B981' : 'var(--text-muted)' }}>
                    {formatINR(order.profit || 0, false)}
                  </td>
                  <td>
                    <span className={`badge badge-${statusBadge}`}>{order.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
        <span style={{ color: 'var(--text-muted)' }}>
          Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{' '}
          {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>
          <span style={{ padding: '0 8px', fontWeight: 600 }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
