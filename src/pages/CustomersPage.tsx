import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Customer, CustomerSegment } from '../types';
import { formatINR, formatNumber, formatPercent } from '../services/analyticsEngine';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Repeat, 
  Award, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Mail, 
  Phone,
  UploadCloud,
  Table,
  Plus
} from 'lucide-react';
import { DonutChart } from '../components/charts/DonutChart';

export const CustomersPage: React.FC = () => {
  const { orders, setActiveTab, kpis } = useAnalytics();
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('All');

  // Dynamically compute customers from orders
  const customers: Customer[] = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const map: Record<string, {
      id: string;
      name: string;
      email: string;
      city?: string;
      region?: any;
      orders: number;
      totalSpent: number;
      dates: string[];
    }> = {};

    orders.forEach((o, index) => {
      const key = o.customerId || o.customerEmail || o.customerName || `cust-${index}`;
      if (!map[key]) {
        map[key] = {
          id: o.customerId || `CUST-${String(index + 1).padStart(4, '0')}`,
          name: o.customerName || 'Customer',
          email: o.customerEmail || 'buyer@example.com',
          city: o.city || '—',
          region: o.region,
          orders: 0,
          totalSpent: 0,
          dates: []
        };
      }
      map[key].orders += 1;
      map[key].totalSpent += Number(o.revenue) || 0;
      if (o.date) map[key].dates.push(o.date);
    });

    const now = new Date().getTime();

    return Object.keys(map).map(key => {
      const item = map[key];
      const sortedDates = item.dates.sort();
      const firstOrderDate = sortedDates[0] || new Date().toISOString().split('T')[0];
      const lastOrderDate = sortedDates[sortedDates.length - 1] || firstOrderDate;
      const lastTime = new Date(lastOrderDate).getTime();
      const daysSince = isNaN(lastTime) ? 30 : Math.floor((now - lastTime) / (1000 * 60 * 60 * 24));

      let segment: CustomerSegment = 'Regular';
      if (item.orders >= 3 || item.totalSpent >= 25000) {
        segment = 'VIP';
      } else if (item.orders >= 2) {
        segment = 'Loyal';
      } else if (daysSince <= 30) {
        segment = 'New';
      } else if (daysSince >= 120) {
        segment = 'At Risk';
      }

      return {
        id: item.id,
        name: item.name,
        email: item.email,
        city: item.city,
        region: item.region,
        totalOrders: item.orders,
        totalSpent: Math.round(item.totalSpent),
        aov: item.orders > 0 ? Math.round(item.totalSpent / item.orders) : 0,
        firstOrderDate,
        lastOrderDate,
        segment,
        status: 'Active' as const
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.city && c.city.toLowerCase().includes(search.toLowerCase()));

      const matchSegment = segmentFilter === 'All' || c.segment === segmentFilter;
      return matchSearch && matchSegment;
    });
  }, [customers, search, segmentFilter]);

  const segmentCounts = {
    VIP: customers.filter(c => c.segment === 'VIP').length,
    Loyal: customers.filter(c => c.segment === 'Loyal').length,
    Regular: customers.filter(c => c.segment === 'Regular').length,
    'At Risk': customers.filter(c => c.segment === 'At Risk').length,
    New: customers.filter(c => c.segment === 'New').length,
  };

  const repeatCustomersCount = customers.filter(c => c.totalOrders > 1).length;
  const repeatRate = customers.length > 0 ? Number(((repeatCustomersCount / customers.length) * 100).toFixed(1)) : 0;
  const avgLtv = customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length) : 0;

  // ==========================================
  // ZERO-DATA EMPTY STATE
  // ==========================================
  if (orders.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Customer Analytics & Cohorts</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            RFM customer segmentation, repurchase velocity, cohort retention curves, and LTV attribution.
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
            <Users size={26} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            No customer profiles detected
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 24px auto', lineHeight: 1.55 }}>
            Customer profiles and RFM cohorts (VIP, Loyal, New, At Risk) are automatically calculated from order history. Upload orders containing customer names or email addresses to see retention metrics.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('data-sources')}
              className="btn btn-primary"
              style={{ padding: '9px 20px', gap: 8 }}
            >
              <UploadCloud size={15} />
              <span>Import Customer Orders</span>
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
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Customer Analytics & Cohorts</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Tracking {customers.length} distinct buyer profiles dynamically derived from transactions.
          </p>
        </div>

        <button onClick={() => setActiveTab('manual-entry')} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
          <Plus size={14} />
          <span>Add Buyer Order</span>
        </button>
      </div>

      {/* 5 Customer KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Customers</span>
            <Users size={16} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatNumber(customers.length)}
          </div>
          <div style={{ fontSize: 12, color: kpis.customerGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600, marginTop: 4 }}>
            {formatPercent(kpis.customerGrowth)} vs prior
          </div>
        </div>

        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Repeat Purchase Rate</span>
            <Repeat size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981' }}>
            {repeatRate}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {repeatCustomersCount} returning buyers
          </div>
        </div>

        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Average Customer LTV</span>
            <Award size={16} style={{ color: '#F59E0B' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatINR(avgLtv)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Lifetime gross spend
          </div>
        </div>

        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>VIP Segment</span>
            <UserCheck size={16} style={{ color: '#8B5CF6' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#8B5CF6' }}>
            {segmentCounts.VIP}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            High-value multi-buyers
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="nexa-card"
        style={{
          padding: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
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
              maxWidth: 320
            }}
          >
            <Search size={15} style={{ color: 'var(--text-faint)' }} />
            <input
              type="text"
              placeholder="Search customer name, email, or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
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

        {/* Segment Badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['All', 'VIP', 'Loyal', 'Regular', 'New', 'At Risk'] as (string | CustomerSegment)[]).map(seg => {
            const count = seg === 'All' ? customers.length : (segmentCounts as any)[seg];
            return (
              <button
                key={seg}
                onClick={() => setSegmentFilter(seg)}
                className={`btn btn-xs ${segmentFilter === seg ? 'btn-primary' : 'btn-secondary'}`}
              >
                <span>{seg}</span>
                <span style={{ opacity: 0.75, fontSize: 11, marginLeft: 4 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-container">
        <table className="nexa-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Total Spend</th>
              <th>Avg Basket (AOV)</th>
              <th>Last Purchase</th>
              <th>RFM Segment</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => {
              let segBadge = 'badge-neutral';
              if (c.segment === 'VIP') segBadge = 'badge-info';
              else if (c.segment === 'Loyal') segBadge = 'badge-success';
              else if (c.segment === 'New') segBadge = 'badge-neutral';
              else if (c.segment === 'At Risk') segBadge = 'badge-warning';

              return (
                <tr key={c.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{c.email}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.city || '—'}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.totalOrders}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatINR(c.totalSpent)}</td>
                  <td>{formatINR(c.aov, false)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.lastOrderDate}</td>
                  <td>
                    <span className={`badge ${segBadge}`}>{c.segment}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
