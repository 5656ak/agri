import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { sourceService, ResearchSourceRecord } from '../../services/agriculture/sourceService';

interface ResearchSourcePanelProps {
  sourceId?: string;
  sourceRecord?: ResearchSourceRecord | null;
  title?: string;
}

export const ResearchSourcePanel: React.FC<ResearchSourcePanelProps> = ({
  sourceId,
  sourceRecord,
  title = 'वैज्ञानिक अनुसंधान स्रोत (Research Source)'
}) => {
  const source: ResearchSourceRecord = sourceRecord || sourceService.getSafeSourceDisplay(sourceId);
  const isVerified = source.verification_status === 'VERIFIED';
  const isPending = source.verification_status === 'PENDING_VERIFICATION';

  return (
    <div className="research-panel" role="region" aria-label="Research Reference Details">
      <div className="research-header">
        <div className="research-title">
          <BookOpen size={18} color="#1E5631" aria-hidden="true" />
          <span>{title}</span>
        </div>
        <span 
          className={`badge ${isVerified ? 'badge-verified' : isPending ? 'badge-warning' : 'badge-demo'}`}
        >
          {source.verification_status}
        </span>
      </div>

      <div className="research-meta-grid">
        <div className="research-item">
          <span className="research-item-label">अनुसंधान संस्थान (Institution)</span>
          <span className="research-item-value">{source.institution}</span>
        </div>

        <div className="research-item">
          <span className="research-item-label">दस्तावेज़ / शीर्षक (Document Title)</span>
          <span className="research-item-value">{source.document_title}</span>
        </div>

        <div className="research-item">
          <span className="research-item-label">प्रकाशन / अद्यतन वर्ष (Year)</span>
          <span className="research-item-value">
            {source.publication_year ? `${source.publication_year}${source.revision_year ? ` (Rev. ${source.revision_year})` : ''}` : 'Verification Pending'}
          </span>
        </div>

        <div className="research-item">
          <span className="research-item-label">संदर्भ संख्या (Reference ID)</span>
          <span className="research-item-value" style={{ fontFamily: 'monospace' }}>
            {source.source_id}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: isVerified ? '#15803D' : '#D97706' }}>
          {isVerified ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
          <span>
            सत्यापन स्थिति (Status): <strong>{isVerified ? 'ICAR/Govt Verified' : 'Research Source Verification Pending'}</strong>
          </span>
        </div>

        {source.official_url && (
          <a 
            href={source.official_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}
          >
            <span>आधिकारिक पोर्टल देखें</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
};
