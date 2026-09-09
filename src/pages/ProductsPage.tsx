import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Product, ProductCategory } from '../types';
import { formatINR, formatPercent } from '../services/analyticsEngine';
import { ProductDetailModal } from '../components/modals/ProductDetailModal';
import { 
  Package, 
  TrendingUp, 
  Award, 
  Percent, 
  AlertTriangle, 
  ArrowUpRight, 
  Eye, 
  Search,
  UploadCloud,
  Table,
  Plus
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { orders, setActiveTab } = useAnalytics();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Dynamically compute products from user orders
  const products: Product[] = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const map: Record<string, {
      name: string;
      category: ProductCategory;
      sku: string;
      unitsSold: number;
      revenue: number;
      cost: number;
      profit: number;
    }> = {};

    orders.forEach((o, index) => {
      const name = o.productName || 'Unspecified Product';
      if (!map[name]) {
        const skuPrefix = name.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
        map[name] = {
          name,
          category: o.category || 'General',
          sku: o.productId || `${skuPrefix}-${100 + index}`,
          unitsSold: 0,
          revenue: 0,
          cost: 0,
          profit: 0
        };
      }
      const qty = Number(o.quantity) || 1;
      const rev = Number(o.revenue) || 0;
      const cost = Number(o.cost) || 0;
      const profit = Number(o.profit) || (rev - cost);

      map[name].unitsSold += qty;
      map[name].revenue += rev;
      map[name].cost += cost;
      map[name].profit += profit;
    });

    return Object.keys(map).map((name, idx) => {
      const item = map[name];
      const marginPct = item.revenue > 0 ? Number(((item.profit / item.revenue) * 100).toFixed(1)) : 0;
      const unitPrice = item.unitsSold > 0 ? Math.round(item.revenue / item.unitsSold) : 0;
      const unitCost = item.unitsSold > 0 ? Math.round(item.cost / item.unitsSold) : 0;

      return {
        id: `prod-${idx + 1}`,
        name: item.name,
        sku: item.sku,
        category: item.category,
        unitPrice,
        unitCost,
        unitsSold: item.unitsSold,
        revenue: Math.round(item.revenue),
        profit: Math.round(item.profit),
        marginPct,
        growthPct: 0,
        stockStatus: 'In Stock' as const
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, search, categoryFilter]);

  // Derived metrics
  const topProduct = products[0];
  const highestMarginProduct = [...products].sort((a, b) => b.marginPct - a.marginPct)[0];
  const totalCatalogRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalCatalogProfit = products.reduce((sum, p) => sum + p.profit, 0);
  const catalogMargin = totalCatalogRevenue > 0 ? Number(((totalCatalogProfit / totalCatalogRevenue) * 100).toFixed(1)) : 0;

  // ==========================================
  // ZERO-DATA EMPTY STATE
  // ==========================================
  if (orders.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Product Performance & SKU Analytics</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Unit economics, gross contribution margins, inventory turn rates, and SKU profitability.
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
            <Package size={26} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            No products found in catalog
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 24px auto', lineHeight: 1.55 }}>
            Products and SKU profitability are synthesized automatically from your sales orders. Upload order records containing product names, quantities, and prices to calculate catalog unit economics.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('data-sources')}
              className="btn btn-primary"
              style={{ padding: '9px 20px', gap: 8 }}
            >
              <UploadCloud size={15} />
              <span>Import Orders to Detect Products</span>
            </button>
            <button
              onClick={() => setActiveTab('manual-entry')}
              className="btn btn-secondary"
              style={{ padding: '9px 18px', gap: 8 }}
            >
              <Table size={15} />
              <span>Add Products via Spreadsheet</span>
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
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Product Performance & SKU Analytics</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Tracking {products.length} unique catalog SKUs generated from active sales orders.
          </p>
        </div>

        <button onClick={() => setActiveTab('manual-entry')} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
          <Plus size={14} />
          <span>Add SKU Order</span>
        </button>
      </div>

      {/* Top Section KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {/* Top Product */}
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Top Product by Revenue</span>
            <Award size={16} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {topProduct ? topProduct.name : 'N/A'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--brand-primary)' }}>
              {topProduct ? formatINR(topProduct.revenue) : '₹0'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
              {topProduct ? `${topProduct.unitsSold} units` : ''}
            </span>
          </div>
        </div>

        {/* Highest Revenue Category */}
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Highest Revenue Category</span>
            <TrendingUp size={16} style={{ color: '#06B6D4' }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {topProduct ? topProduct.category : 'General'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Leading catalog category
          </div>
        </div>

        {/* Highest Margin Product */}
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Highest Margin SKU</span>
            <Percent size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#10B981', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {highestMarginProduct ? highestMarginProduct.name : 'N/A'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600, marginTop: 4 }}>
            {highestMarginProduct ? `${highestMarginProduct.marginPct}% profit margin` : '0%'}
          </div>
        </div>

        {/* Storewide Blended Margin */}
        <div className="nexa-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Catalog Margin</span>
            <Package size={16} style={{ color: '#8B5CF6' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
            {catalogMargin}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {formatINR(totalCatalogProfit)} net profit
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
              placeholder="Search product name or SKU..."
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

        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setCategoryFilter('All')}
              className={`btn btn-xs ${categoryFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`btn btn-xs ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="nexa-table">
          <thead>
            <tr>
              <th>Product / SKU</th>
              <th>Category</th>
              <th>Units Sold</th>
              <th>Avg Price</th>
              <th>Total Revenue</th>
              <th>Gross Margin</th>
              <th>Stock Health</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {p.sku}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-neutral">{p.category}</span>
                </td>
                <td style={{ fontWeight: 500 }}>{p.unitsSold}</td>
                <td>{formatINR(p.unitPrice, false)}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatINR(p.revenue)}</td>
                <td>
                  <span style={{ fontWeight: 600, color: p.marginPct >= 30 ? '#10B981' : '#F59E0B' }}>
                    {p.marginPct}%
                  </span>
                </td>
                <td>
                  <span className="badge badge-success">{p.stockStatus}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="btn btn-secondary btn-xs"
                    style={{ gap: 4 }}
                  >
                    <Eye size={12} />
                    <span>Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
