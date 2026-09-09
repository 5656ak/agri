import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { getUserDatasets, deleteUserDataset, clearUserOrders } from '../services/userDataStore';
import { 
  Database, 
  UploadCloud, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Table,
  Plus
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const { user } = useAuth();
  const { orders, setActiveTab, addToast, importOrders } = useAnalytics();

  const [datasets, setDatasets] = useState(() => (user ? getUserDatasets(user.id) : []));

  const handleDeleteDataset = (datasetId: string, datasetName: string) => {
    if (!user) return;
    const remainingOrders = deleteUserDataset(user.id, datasetId);
    setDatasets(getUserDatasets(user.id));
    importOrders(remainingOrders, 'Updated Data Sources');
    addToast(`Dataset "${datasetName}" deleted.`, 'info');
  };

  const handleClearAll = () => {
    if (!user) return;
    clearUserOrders(user.id);
    setDatasets([]);
    importOrders([], 'Cleared');
    addToast('All business datasets have been cleared.', 'info');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Data Sources & Ingestion</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Manage your connected files, spreadsheet datasets, and sync history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setActiveTab('manual-entry')} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
            <Table size={14} />
            <span>Manual Spreadsheet</span>
          </button>
          <button onClick={() => setActiveTab('data-import')} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
            <UploadCloud size={14} />
            <span>Upload New File</span>
          </button>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="nexa-card" style={{ padding: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Connected Datasets</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            {datasets.length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {datasets.length === 0 ? 'No data sources connected' : 'Active and parsed'}
          </div>
        </div>

        <div className="nexa-card" style={{ padding: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Ingested Records</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-primary)', marginTop: 2 }}>
            {orders.length.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Rows powering analytics
          </div>
        </div>

        <div className="nexa-card" style={{ padding: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Data Isolation State</span>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#10B981', marginTop: 4 }}>
            Encrypted & Isolated
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
            User Workspace: {user?.businessName || user?.email}
          </div>
        </div>
      </div>

      {/* Active Datasets List or Zero State */}
      {datasets.length === 0 ? (
        <div
          className="nexa-card"
          style={{
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '2px dashed var(--border-medium)'
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <Database size={26} />
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            No Data Sources Connected
          </h3>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 460, marginBottom: 24, lineHeight: 1.5 }}>
            NEXA Analytics never uses placeholder data. Upload your sales CSV/Excel spreadsheet or enter data manually to activate intelligent business analytics.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setActiveTab('data-import')} className="btn btn-primary" style={{ gap: 8 }}>
              <UploadCloud size={16} />
              <span>Upload CSV / Excel</span>
            </button>
            <button onClick={() => setActiveTab('manual-entry')} className="btn btn-secondary" style={{ gap: 8 }}>
              <Table size={16} />
              <span>Enter Data Manually</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: 14.5, fontWeight: 600 }}>Active User Datasets</h4>
            <button onClick={handleClearAll} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
              Clear All Data
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Dataset Name</th>
                <th>Source Type</th>
                <th>Records</th>
                <th>Size</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map(ds => (
                <tr key={ds.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={16} style={{ color: 'var(--brand-primary)' }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ds.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>
                      {ds.sourceType}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{ds.rowCount.toLocaleString('en-IN')} rows</td>
                  <td style={{ color: 'var(--text-muted)' }}>{ds.fileSize || 'N/A'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {new Date(ds.uploadedAt).toLocaleDateString()} {new Date(ds.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setActiveTab('data-import')}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: 12 }}
                      >
                        Replace
                      </button>
                      <button
                        onClick={() => handleDeleteDataset(ds.id, ds.name)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '4px 8px', color: 'var(--color-danger)' }}
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
      )}
    </div>
  );
};
