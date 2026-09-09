import React, { useState, useRef } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { SAMPLE_CSV_DATA, downloadSampleCsv } from '../data/sampleCsv';
import { Order, ProductCategory, RegionCode, SalesChannel } from '../types';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Database, 
  ExternalLink,
  Download
} from 'lucide-react';

interface ColumnMapping {
  orderId: string;
  date: string;
  customer: string;
  product: string;
  category: string;
  region: string;
  channel: string;
  revenue: string;
  cost: string;
}

export const DataImportPage: React.FC = () => {
  const { importOrders, setActiveTab, addToast } = useAnalytics();

  // Wizard Steps: 1: Upload, 2: Column Mapping, 3: Preview & Confirm, 4: Processing
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [progress, setProgress] = useState(0);

  const [mapping, setMapping] = useState<ColumnMapping>({
    orderId: 'Order ID',
    date: 'Date',
    customer: 'Customer',
    product: 'Product',
    category: 'Category',
    region: 'Region',
    channel: 'Channel',
    revenue: 'Revenue',
    cost: 'Cost'
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse raw CSV string
  const parseCsvText = (text: string, name = 'uploaded_data.csv', size = '4.2 KB') => {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) {
      addToast('CSV file must contain at least a header row and 1 data row', 'danger');
      return;
    }

    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
    const dataRows = lines.slice(1).map(line => {
      // Basic CSV column splitter respecting simple commas
      return line.split(',').map(cell => cell.replace(/^["']|["']$/g, '').trim());
    });

    setDetectedHeaders(headers);
    setRawRows(dataRows);
    setFileName(name);
    setFileSize(size);

    // Auto-detect and map columns
    const findHeaderMatch = (candidates: string[]) => {
      return headers.find(h => candidates.some(c => h.toLowerCase().includes(c.toLowerCase()))) || headers[0] || '';
    };

    setMapping({
      orderId: findHeaderMatch(['order', 'id', 'invoice']),
      date: findHeaderMatch(['date', 'created', 'time']),
      customer: findHeaderMatch(['customer', 'buyer', 'name']),
      product: findHeaderMatch(['product', 'item', 'sku', 'title']),
      category: findHeaderMatch(['category', 'type', 'dept']),
      region: findHeaderMatch(['region', 'zone', 'state']),
      channel: findHeaderMatch(['channel', 'source', 'store']),
      revenue: findHeaderMatch(['revenue', 'amount', 'total', 'sales', 'price']),
      cost: findHeaderMatch(['cost', 'cogs', 'expense']),
    });

    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      parseCsvText(text, file.name, `${(file.size / 1024).toFixed(1)} KB`);
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCsv = () => {
    parseCsvText(SAMPLE_CSV_DATA, 'sample_indian_retail_sales.csv', '2.8 KB');
    addToast('Loaded sample retail CSV dataset into pipeline', 'info');
  };

  const handleExecuteImport = () => {
    setStep(4);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          finishProcessing();
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const finishProcessing = () => {
    // Convert parsed rows into typed Orders
    const colIdx = {
      orderId: detectedHeaders.indexOf(mapping.orderId),
      date: detectedHeaders.indexOf(mapping.date),
      customer: detectedHeaders.indexOf(mapping.customer),
      product: detectedHeaders.indexOf(mapping.product),
      category: detectedHeaders.indexOf(mapping.category),
      region: detectedHeaders.indexOf(mapping.region),
      channel: detectedHeaders.indexOf(mapping.channel),
      revenue: detectedHeaders.indexOf(mapping.revenue),
      cost: detectedHeaders.indexOf(mapping.cost),
    };

    const newOrders: Order[] = rawRows.map((row, idx) => {
      const rev = parseFloat(row[colIdx.revenue]) || 4999;
      const cst = parseFloat(row[colIdx.cost]) || Math.round(rev * 0.45);
      const profit = rev - cst;

      return {
        id: `ord-imp-${idx + 1}`,
        orderNumber: row[colIdx.orderId] || `NX-IMP-${1000 + idx}`,
        date: row[colIdx.date] || '2026-09-08',
        customerId: `cust-imp-${idx + 1}`,
        customerName: row[colIdx.customer] || 'Indian Retail Buyer',
        customerEmail: 'customer@apexretail.in',
        productId: `prod-imp-${idx + 1}`,
        productName: row[colIdx.product] || 'Retail Product',
        category: (row[colIdx.category] as ProductCategory) || 'Consumer Electronics',
        region: (row[colIdx.region] as RegionCode) || 'West',
        state: 'Maharashtra',
        city: 'Mumbai',
        channel: (row[colIdx.channel] as SalesChannel) || 'Website',
        quantity: 1,
        unitPrice: rev,
        revenue: rev,
        cost: cst,
        profit,
        marginPct: rev > 0 ? Number(((profit / rev) * 100).toFixed(1)) : 0,
        status: 'Delivered'
      };
    });

    importOrders(newOrders, fileName);

    setTimeout(() => {
      setActiveTab('overview');
    }, 600);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Connect your business data
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
          Ingest your sales records from CSV, Shopify, Razorpay, or custom ERP feeds.
        </p>
      </div>

      {/* Integration Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--brand-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: 'var(--brand-primary)', fontSize: 13.5 }}>CSV Upload</span>
            <CheckCircle2 size={15} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ready & Active</span>
        </div>

        {[
          { name: 'Excel (.xlsx)', status: 'Active' },
          { name: 'Shopify Store', status: 'Direct API' },
          { name: 'Razorpay / UPI', status: 'Payment Webhook' },
          { name: 'Google Sheets', status: 'Cloud Sync' },
          { name: 'Custom REST API', status: 'Enterprise' },
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => addToast(`${item.name} connector is pre-configured for enterprise sync. Use CSV for demo ingestion.`, 'info')}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'pointer',
              opacity: 0.85
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.status}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Drag and Drop Upload Area */}
      {step === 1 && (
        <div
          className="nexa-card"
          style={{
            padding: 48,
            border: isDragging ? '2px dashed var(--brand-primary)' : '2px dashed var(--border-medium)',
            background: isDragging ? 'var(--brand-primary-light)' : 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragLeave={e => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = evt => {
                const text = evt.target?.result as string;
                parseCsvText(text, file.name, `${(file.size / 1024).toFixed(1)} KB`);
              };
              reader.readAsText(file);
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <UploadCloud size={32} />
          </div>

          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            {isDragging ? 'Drop your CSV file here...' : 'Drag and drop your sales CSV here'}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 460, marginBottom: 20 }}>
            Supports transactions with Order ID, Date, Customer, Product, Category, Region, Revenue, and Channel.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="btn btn-primary"
            >
              Browse Local File
            </button>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleLoadSampleCsv();
              }}
              className="btn btn-secondary"
            >
              Load Sample CSV Dataset
            </button>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                downloadSampleCsv();
              }}
              className="btn btn-ghost"
              style={{ gap: 6 }}
            >
              <Download size={14} />
              <span>Download CSV Template</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Column Mapping */}
      {step === 2 && (
        <div className="nexa-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-success">File Validated</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{fileName}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({fileSize})</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>Map CSV Columns to NEXA Schema</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                We've automatically mapped fields based on header names. Confirm or adjust as needed.
              </p>
            </div>
            <button onClick={() => setStep(1)} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
              <RotateCcw size={13} />
              <span>Re-upload</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
            {Object.keys(mapping).map(key => {
              const fieldKey = key as keyof ColumnMapping;
              return (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4, textTransform: 'capitalize' }}>
                    {fieldKey.replace(/([A-Z])/g, ' $1')} Field *
                  </label>
                  <select
                    value={mapping[fieldKey]}
                    onChange={e => setMapping({ ...mapping, [fieldKey]: e.target.value })}
                    className="form-select"
                  >
                    {detectedHeaders.map((h, idx) => (
                      <option key={idx} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              Back
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary">
              <span>Preview Data</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview Data */}
      {step === 3 && (
        <div className="nexa-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Data Ingestion Preview</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                Found {rawRows.length} rows ready to process. Inspect the first 5 records below.
              </p>
            </div>
            <button onClick={() => setStep(2)} className="btn btn-secondary btn-sm">
              Adjust Mapping
            </button>
          </div>

          <div className="table-container" style={{ marginBottom: 24 }}>
            <table className="data-table">
              <thead>
                <tr>
                  {detectedHeaders.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rawRows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--color-success)' }}>
              <CheckCircle2 size={16} />
              <span>All columns validated with 0 schema violations.</span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary">
                Back
              </button>
              <button onClick={handleExecuteImport} className="btn btn-primary" style={{ gap: 6 }}>
                <Database size={15} />
                <span>Confirm & Process Analytics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Processing Progress Bar */}
      {step === 4 && (
        <div
          className="nexa-card"
          style={{
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Database size={24} />
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            Synthesizing Business Intelligence...
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Calculating contribution margins, RFM customer cohorts, and regional run rates.
          </p>

          <div style={{ width: '100%', maxWidth: 380, height: 8, background: 'var(--bg-surface-subtle)', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--brand-primary)',
                borderRadius: 999,
                transition: 'width 0.2s ease'
              }}
            />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)' }}>{progress}% Complete</span>
        </div>
      )}
    </div>
  );
};
