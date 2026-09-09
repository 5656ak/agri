import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { useAuth } from '../context/AuthContext';
import { Order, ManualSpreadsheetRow } from '../types';
import { 
  Table, 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const ManualDataPage: React.FC = () => {
  const { user } = useAuth();
  const { importOrders, setActiveTab, addToast } = useAnalytics();

  const [rows, setRows] = useState<ManualSpreadsheetRow[]>([
    {
      id: 'row-1',
      orderNumber: 'ORD-1001',
      date: new Date().toISOString().split('T')[0],
      customerName: 'Aarav Sharma',
      productName: 'Wireless Headphones',
      category: 'Consumer Electronics',
      region: 'West',
      channel: 'Website',
      quantity: 1,
      revenue: 4999,
      cost: 2300,
    },
    {
      id: 'row-2',
      orderNumber: 'ORD-1002',
      date: new Date().toISOString().split('T')[0],
      customerName: 'Priya Patel',
      productName: 'Ergonomic Task Chair',
      category: 'Ergonomic Workspace',
      region: 'South',
      channel: 'Marketplace',
      quantity: 1,
      revenue: 14500,
      cost: 7800,
    }
  ]);

  const [validationError, setValidationError] = useState('');

  const handleCellChange = (id: string, field: keyof ManualSpreadsheetRow, value: any) => {
    setRows(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddRow = () => {
    const newId = `row-${Date.now()}`;
    const nextOrderNumber = `ORD-${1000 + rows.length + 1}`;
    setRows(prev => [
      ...prev,
      {
        id: newId,
        orderNumber: nextOrderNumber,
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        productName: '',
        category: 'Consumer Electronics',
        region: 'West',
        channel: 'Website',
        quantity: 1,
        revenue: 0,
        cost: 0,
      }
    ]);
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) {
      addToast('Spreadsheet must have at least one record', 'warning');
      return;
    }
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleDuplicateRow = (row: ManualSpreadsheetRow) => {
    const duplicated: ManualSpreadsheetRow = {
      ...row,
      id: `row-${Date.now()}`,
      orderNumber: `${row.orderNumber}-COPY`,
    };
    setRows(prev => [...prev, duplicated]);
    addToast(`Duplicated order ${row.orderNumber}`, 'info');
  };

  const validateRows = (): boolean => {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.customerName.trim()) {
        setValidationError(`Row ${i + 1}: Customer name is required.`);
        return false;
      }
      if (!r.productName.trim()) {
        setValidationError(`Row ${i + 1}: Product name is required.`);
        return false;
      }
      if (isNaN(r.revenue) || r.revenue < 0) {
        setValidationError(`Row ${i + 1}: Revenue must be a positive number.`);
        return false;
      }
      if (isNaN(r.cost) || r.cost < 0) {
        setValidationError(`Row ${i + 1}: Cost must be a positive number.`);
        return false;
      }
      if (!r.date) {
        setValidationError(`Row ${i + 1}: Valid date is required.`);
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  const handleSaveAndAnalyze = () => {
    if (!validateRows()) return;

    const typedOrders: Order[] = rows.map((r, idx) => {
      const profit = r.revenue - r.cost;
      const marginPct = r.revenue > 0 ? Number(((profit / r.revenue) * 100).toFixed(1)) : 0;

      return {
        id: `man-ord-${idx + 1}`,
        orderNumber: r.orderNumber || `MAN-${1000 + idx}`,
        date: r.date,
        customerId: `cust-man-${idx + 1}`,
        customerName: r.customerName,
        customerEmail: `${r.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        productId: `prod-man-${idx + 1}`,
        productName: r.productName,
        category: r.category,
        region: r.region,
        channel: r.channel,
        quantity: r.quantity || 1,
        unitPrice: r.revenue,
        revenue: r.revenue,
        cost: r.cost,
        profit,
        marginPct,
        status: 'Delivered'
      };
    });

    importOrders(typedOrders, 'Manual Spreadsheet Ingestion');
    setActiveTab('overview');
  };

  const totalRevenue = rows.reduce((sum, r) => sum + (Number(r.revenue) || 0), 0);
  const totalCost = rows.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Manual Data Entry</h1>
            <span className="badge badge-info">Spreadsheet Grid</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Add, edit, and duplicate transactions manually with live margin calculations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleAddRow} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
            <Plus size={14} />
            <span>Add Row</span>
          </button>
          <button onClick={handleSaveAndAnalyze} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
            <Sparkles size={14} />
            <span>Save & Analyze ({rows.length} rows)</span>
          </button>
        </div>
      </div>

      {/* Validation alert if present */}
      {validationError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            fontSize: 13
          }}
        >
          <AlertCircle size={16} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Live Calculated Stats Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div className="nexa-card" style={{ padding: 14 }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Spreadsheet Records</span>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{rows.length} Rows</div>
        </div>
        <div className="nexa-card" style={{ padding: 14 }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Input Gross Revenue</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-primary)', marginTop: 2 }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="nexa-card" style={{ padding: 14 }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Input Total Cost</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 2 }}>
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="nexa-card" style={{ padding: 14 }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Net Realized Profit</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: totalProfit >= 0 ? '#10B981' : 'var(--color-danger)', marginTop: 2 }}>
            ₹{totalProfit.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Editable Spreadsheet Table */}
      <div className="table-container">
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 110 }}>Order ID</th>
              <th style={{ width: 130 }}>Date</th>
              <th style={{ minWidth: 160 }}>Customer Name *</th>
              <th style={{ minWidth: 160 }}>Product Name *</th>
              <th style={{ width: 150 }}>Category</th>
              <th style={{ width: 110 }}>Region</th>
              <th style={{ width: 110 }}>Channel</th>
              <th style={{ width: 110 }}>Revenue (₹) *</th>
              <th style={{ width: 110 }}>Cost (₹) *</th>
              <th style={{ width: 80, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="text"
                    value={row.orderNumber}
                    onChange={e => handleCellChange(row.id, 'orderNumber', e.target.value)}
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={row.date}
                    onChange={e => handleCellChange(row.id, 'date', e.target.value)}
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.customerName}
                    placeholder="Customer Name"
                    onChange={e => handleCellChange(row.id, 'customerName', e.target.value)}
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.productName}
                    placeholder="Product Name"
                    onChange={e => handleCellChange(row.id, 'productName', e.target.value)}
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                  />
                </td>
                <td>
                  <select
                    value={row.category}
                    onChange={e => handleCellChange(row.id, 'category', e.target.value)}
                    className="form-select"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                  >
                    <option value="Consumer Electronics">Consumer Electronics</option>
                    <option value="Smart Wearables">Smart Wearables</option>
                    <option value="Ergonomic Workspace">Ergonomic Workspace</option>
                    <option value="Gourmet & Beverage">Gourmet & Beverage</option>
                    <option value="Wellness & Self-Care">Wellness & Self-Care</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td>
                  <select
                    value={row.region}
                    onChange={e => handleCellChange(row.id, 'region', e.target.value)}
                    className="form-select"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                  >
                    <option value="West">West</option>
                    <option value="South">South</option>
                    <option value="North">North</option>
                    <option value="East">East</option>
                    <option value="Central">Central</option>
                  </select>
                </td>
                <td>
                  <select
                    value={row.channel}
                    onChange={e => handleCellChange(row.id, 'channel', e.target.value)}
                    className="form-select"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                  >
                    <option value="Website">Website</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Retail">Retail</option>
                    <option value="Social">Social</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={row.revenue}
                    onChange={e => handleCellChange(row.id, 'revenue', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: 12, fontWeight: 600 }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.cost}
                    onChange={e => handleCellChange(row.id, 'cost', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => handleDuplicateRow(row)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: 4 }}
                      title="Duplicate row"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: 4, color: 'var(--color-danger)' }}
                      title="Delete row"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom CTA Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handleAddRow} className="btn btn-secondary" style={{ gap: 6 }}>
          <Plus size={15} />
          <span>Add Another Transaction Row</span>
        </button>

        <button onClick={handleSaveAndAnalyze} className="btn btn-primary btn-lg" style={{ gap: 8 }}>
          <span>Save & Analyze Dashboard</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
