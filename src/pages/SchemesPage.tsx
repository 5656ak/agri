import React, { useState } from 'react';
import { Landmark, ExternalLink, CheckCircle2, FileText, ChevronRight, Filter } from 'lucide-react';
import { Language } from '../types';
import { dataStore } from '../services/dataStore';

interface SchemesPageProps {
  language: Language;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({ language }) => {
  const farmer = dataStore.getFarmerProfile();
  const schemes = dataStore.getGovernmentSchemes();

  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = schemes.filter((s) => {
    if (!s.active) return false;
    if (categoryFilter === 'ALL') return true;
    return s.category === categoryFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
          🏛️ {language === 'hi' ? 'सरकारी योजनाएं व प्रत्यक्ष अनुदान' : 'Government Agricultural Schemes'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
          {language === 'hi'
            ? `${farmer.location.state} एवं केंद्र सरकार द्वारा संचालित आधिकारिक कृषि योजनाएं व सब्सिडी गाइड`
            : 'Personalized Central & State subsidy programs matching your landholding and crops'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
        {[
          { id: 'ALL', label: 'सभी योजनाएं' },
          { id: 'Direct Benefit', label: 'नकद सहायता (DBT)' },
          { id: 'Insurance', label: 'फसल बीमा (PMFBY)' },
          { id: 'Subsidy', label: 'कृषि यंत्र सब्सिडी' },
          { id: 'Infrastructure', label: 'मृदा स्वास्थ्य' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className="btn btn-sm"
            style={{
              borderRadius: '9999px',
              background: categoryFilter === tab.id ? '#1E5631' : '#FFFFFF',
              color: categoryFilter === tab.id ? '#FFFFFF' : '#374151',
              border: categoryFilter === tab.id ? '1px solid #1E5631' : '1px solid #E5E7EB',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scheme Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.map((sch) => (
          <div
            key={sch.id}
            className="card"
            style={{
              border: '1.5px solid #E5E7EB',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-verified" style={{ marginBottom: '0.35rem' }}>
                  {sch.category} • {sch.stateApplicable}
                </span>
                <h2 style={{ fontSize: '1.25rem', color: '#12372A', marginTop: '0.2rem' }}>
                  {language === 'hi' ? sch.nameHi : sch.nameEn}
                </h2>
              </div>
            </div>

            {/* Benefits Box */}
            <div style={{ background: '#F0FDF4', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                योजना के मुख्य लाभ (What You Get):
              </span>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#14532D', marginTop: '0.2rem', lineHeight: 1.4 }}>
                {language === 'hi' ? sch.benefitsHi : sch.benefitsEn}
              </p>
            </div>

            {/* Eligibility & Documents Grid */}
            <div className="grid-responsive two-col" style={{ gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  पात्रता शर्तें (Who Can Apply):
                </h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {(language === 'hi' ? sch.eligibilityHi : sch.eligibilityEn).map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  आवश्यक दस्तावेज (Required Documents):
                </h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {(language === 'hi' ? sch.documentsRequiredHi : sch.documentsRequiredEn).map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Apply Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '0.75rem' }}>
              <a
                href={sch.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <span>आधिकारिक पोर्टल पर आवेदन करें</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
