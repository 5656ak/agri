import React, { useState } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { exportReportSummary } from '../../services/exportService';
import { X, FileText, Download, CheckCircle2 } from 'lucide-react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose }) => {
  const { kpis, addToast } = useAnalytics();

  const [reportType, setReportType] = useState('Monthly Business Report');
  const [period, setPeriod] = useState('August - September 2026');
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'Executive Brief'>('PDF');
  const [includeForecast, setIncludeForecast] = useState(true);
  const [includeAiInsights, setIncludeAiInsights] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      exportReportSummary(reportType, {
        reportType,
        period,
        format,
        metrics: kpis,
        includeForecast,
        includeAiInsights
      });

      addToast(`Generated ${reportType} (${format}) successfully!`, 'success');
      setIsGenerating(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window"
        style={{ width: '100%', maxWidth: 520, padding: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Generate Executive Business Report</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Configure parameters and download instant report.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Report Type
            </label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="form-select"
            >
              <option value="Weekly Business Report">Weekly Business Report</option>
              <option value="Monthly Business Report">Monthly Business Report</option>
              <option value="Quarterly Business Review">Quarterly Business Review (QBR)</option>
              <option value="Sales Performance Report">Sales Performance Report</option>
              <option value="Customer Cohort & LTV Report">Customer Cohort & LTV Report</option>
              <option value="Product Margin & Inventory Report">Product Margin & Inventory Report</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Reporting Period
            </label>
            <input
              type="text"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Output Format
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {(['PDF', 'CSV', 'Executive Brief'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${format === fmt ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    background: format === fmt ? 'var(--brand-primary-light)' : 'var(--bg-surface)',
                    color: format === fmt ? 'var(--brand-primary)' : 'var(--text-primary)',
                    fontSize: 12.5,
                    fontWeight: format === fmt ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Module Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeForecast}
                onChange={e => setIncludeForecast(e.target.checked)}
                style={{ accentColor: 'var(--brand-primary)' }}
              />
              <span>Include 90-day predictive sales forecast</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeAiInsights}
                onChange={e => setIncludeAiInsights(e.target.checked)}
                style={{ accentColor: 'var(--brand-primary)' }}
              />
              <span>Include AI Executive Summary & Risk recommendations</span>
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleGenerate} disabled={isGenerating} className="btn btn-primary">
            {isGenerating ? (
              <span>Compiling...</span>
            ) : (
              <>
                <Download size={15} />
                <span>Generate & Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
