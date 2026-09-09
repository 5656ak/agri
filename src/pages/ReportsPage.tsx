import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { useAuth } from '../context/AuthContext';
import { BusinessReport } from '../types';
import { exportReportSummary, printExecutiveReport } from '../services/exportService';
import { GenerateReportModal } from '../components/modals/GenerateReportModal';
import { 
  FileText, 
  Download, 
  Share2, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  UploadCloud,
  Table,
  Sparkles
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { kpis, orders, addToast, setActiveTab } = useAnalytics();
  const { businessProfile, user } = useAuth();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [reports, setReports] = useState<BusinessReport[]>([]);

  const businessName = businessProfile?.businessName || user?.businessName || 'My Business';

  const handleDownloadReport = (report: BusinessReport) => {
    printExecutiveReport({
      businessName,
      reportTitle: report.title,
      period: report.period,
      kpis,
      orders,
      includeAiInsights: true
    });
    addToast(`Exported "${report.title}" report`, 'success');
  };

  const handleCreateReport = (newReportData: any) => {
    const report: BusinessReport = {
      id: `rep-${Date.now()}`,
      title: newReportData.title || `${businessName} Executive Brief`,
      type: newReportData.type || 'Executive Summary',
      period: newReportData.period || 'Active Period',
      generatedDate: 'Today',
      status: 'Ready',
      size: '1.4 MB',
      summary: `Automated executive brief for ${businessName}: ${kpis.totalRevenueFormatted} in sales across ${kpis.orderCountFormatted} transactions with ${kpis.totalProfitFormatted} net profit (${kpis.profitMargin}% margin).`
    };

    setReports(prev => [report, ...prev]);
    setIsGenerateModalOpen(false);
    addToast(`Generated report: ${report.title}`, 'success');
  };

  // ==========================================
  // ZERO-DATA EMPTY STATE
  // ==========================================
  if (orders.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Executive Reports & Exports
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Board-ready PDF summaries, quarterly business reviews (QBR), and operational audits.
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
            <FileText size={26} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            No reports generated yet
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 24px auto', lineHeight: 1.55 }}>
            Automated executive intelligence briefs and exportable summaries are generated directly from your sales ledger. Upload order records to compile board-ready reports.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('data-sources')}
              className="btn btn-primary"
              style={{ padding: '9px 20px', gap: 8 }}
            >
              <UploadCloud size={15} />
              <span>Import Sales Data</span>
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
  // ACTIVE DATA REPORTS VIEW
  // ==========================================
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Executive Reports & Exports
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Synthesize board-ready PDF summaries and data exports for {businessName}.
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="btn btn-primary btn-sm"
          style={{ gap: 6 }}
        >
          <Plus size={15} />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="nexa-card" style={{ padding: 36, textAlign: 'center' }}>
          <Sparkles size={32} style={{ color: 'var(--brand-primary)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
            Ready to Generate Executive Intelligence
          </h3>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 20px auto' }}>
            Your workspace has {orders.length} active transactions ({kpis.totalRevenueFormatted} gross revenue). Click below to compile your first executive performance brief.
          </p>
          <button
            onClick={() => handleCreateReport({ title: `${businessName} Executive Brief`, type: 'Monthly Brief' })}
            className="btn btn-primary btn-sm"
            style={{ gap: 6 }}
          >
            <Plus size={14} />
            <span>Generate Executive Brief</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reports.map(report => (
            <div
              key={report.id}
              className="nexa-card"
              style={{
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 280 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FileText size={20} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {report.title}
                    </span>
                    <span className="badge badge-info">{report.type}</span>
                    <span className="badge badge-success">{report.status}</span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px 0 8px 0', lineHeight: 1.5 }}>
                    {report.summary}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} />
                      {report.period}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      Generated {report.generatedDate}
                    </span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => handleDownloadReport(report)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 6 }}
                >
                  <Download size={14} />
                  <span>Download Summary</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
      />
    </div>
  );
};
