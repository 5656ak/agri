import React from 'react';
import { Product } from '../../types';
import { formatINR } from '../../services/analyticsEngine';
import { X, TrendingUp, DollarSign, Package, AlertCircle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window"
        style={{ width: '100%', maxWidth: 680, padding: 24 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-info">{product.category}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>SKU: {product.sku}</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-surface-subtle)',
              border: 'none',
              padding: 6,
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 4 Metric Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <div className="nexa-card" style={{ padding: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Revenue</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-primary)', marginTop: 2 }}>
              {formatINR(product.revenue, true)}
            </div>
          </div>
          <div className="nexa-card" style={{ padding: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Units Sold</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {product.unitsSold.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="nexa-card" style={{ padding: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Profit Margin</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#10B981', marginTop: 2 }}>
              {product.marginPct}%
            </div>
          </div>
          <div className="nexa-card" style={{ padding: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Unit Price</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {formatINR(product.unitPrice, false)}
            </div>
          </div>
        </div>

        {/* Historical Monthly Performance Table */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
            Historical 6-Month Revenue & Margin Trajectory
          </h4>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Revenue (INR)</th>
                  <th>Units Fulfilled</th>
                  <th>Realized Margin</th>
                </tr>
              </thead>
              <tbody>
                {(product.historicalPerformance && product.historicalPerformance.length > 0) ? (
                  product.historicalPerformance.map((h, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{h.month} 2026</td>
                      <td>{formatINR(h.revenue, false)}</td>
                      <td>{h.units} units</td>
                      <td>
                        <span className="badge badge-success">{h.margin}%</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>
                      Historical monthly trends accumulate automatically as chronological orders are recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Demand Distribution */}
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
            Regional Geographic Demand Share
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(product.regionalDemand && product.regionalDemand.length > 0) ? (
              product.regionalDemand.map((rd, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12.5 }}>
                  <span style={{ width: 60, fontWeight: 500 }}>{rd.region}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: 999,
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${rd.percentage}%`,
                        background: 'var(--brand-primary)',
                        borderRadius: 999
                      }}
                    />
                  </div>
                  <span style={{ width: 45, textAlign: 'right', fontWeight: 600 }}>{rd.percentage}%</span>
                  <span style={{ width: 70, textAlign: 'right', color: 'var(--text-muted)' }}>
                    ({rd.units} units)
                  </span>
                </div>
              ))
            ) : (
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                Regional territory distribution will populate when orders with region tags are placed.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
