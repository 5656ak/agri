import React, { useState } from 'react';
import { Plus, Trash2, Landmark, ExternalLink } from 'lucide-react';
import { GovernmentScheme, Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AdminSchemesViewProps {
  language: Language;
}

export const AdminSchemesView: React.FC<AdminSchemesViewProps> = () => {
  const schemes = dataStore.getGovernmentSchemes();

  const [showAddForm, setShowAddForm] = useState(false);
  const [nameHi, setNameHi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [benefitsHi, setBenefitsHi] = useState('');
  const [eligibilityHi, setEligibilityHi] = useState('');
  const [docsHi, setDocsHi] = useState('');
  const [category, setCategory] = useState<'Direct Benefit' | 'Insurance' | 'Subsidy' | 'Infrastructure' | 'Credit'>('Subsidy');
  const [officialUrl, setOfficialUrl] = useState('https://agricoop.gov.in');

  const handleAddScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameHi.trim() || !benefitsHi.trim()) return;

    const newScheme: GovernmentScheme = {
      id: `scheme-${Date.now()}`,
      nameHi,
      nameEn: nameEn || nameHi,
      shortDescHi: benefitsHi,
      shortDescEn: benefitsHi,
      benefitsHi,
      benefitsEn: benefitsHi,
      eligibilityHi: eligibilityHi ? [eligibilityHi] : ['सभी किसान पात्र'],
      eligibilityEn: ['All farmers eligible'],
      documentsRequiredHi: docsHi ? [docsHi] : ['आधार कार्ड, जमीन की रसीद'],
      documentsRequiredEn: ['Aadhaar Card, Land Record'],
      stateApplicable: 'All India',
      officialUrl,
      category,
      active: true
    };

    dataStore.saveGovernmentScheme(newScheme);
    setNameHi('');
    setNameEn('');
    setBenefitsHi('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#12372A' }}>
          🏛️ सरकारी योजनाएं व सब्सिडी प्रबंधन (Schemes DB)
        </h2>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>नई योजना जोड़ें</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ border: '2px solid #1E5631', background: '#F8FAF7' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#14532D', marginBottom: '0.75rem' }}>
            नई सरकारी योजना दर्ज करें:
          </h3>
          <form onSubmit={handleAddScheme}>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">योजना का नाम (Hindi):</label>
                <input type="text" className="form-control" placeholder="जैसे: प्रधानमंत्री फसल बीमा योजना" value={nameHi} onChange={(e) => setNameHi(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Scheme Name (English):</label>
                <input type="text" className="form-control" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">श्रेणी (Category):</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                  <option value="Direct Benefit">प्रत्यक्ष लाभ (DBT)</option>
                  <option value="Insurance">बीमा सुरक्षा (Insurance)</option>
                  <option value="Subsidy">कृषि यंत्र सब्सिडी (Subsidy)</option>
                  <option value="Infrastructure">मृदा व अवसंरचना (Infrastructure)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">आधिकारिक पोर्टल लिंक (Official URL):</label>
                <input type="url" className="form-control" value={officialUrl} onChange={(e) => setOfficialUrl(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">लाभ का विवरण (Benefits):</label>
              <textarea className="form-control" rows={2} value={benefitsHi} onChange={(e) => setBenefitsHi(e.target.value)} placeholder="40% से 80% तक की सीधी सब्सिडी बैंक खाते में।" required />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">योजना सहेजें</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">रद्द करें</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {schemes.map((s) => (
          <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-warning">{s.category}</span>
                <span className="badge badge-verified">{s.stateApplicable}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>{s.nameHi}</h3>
              <p style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: '0.2rem' }}>
                {s.benefitsHi}
              </p>
            </div>

            <button onClick={() => dataStore.deleteGovernmentScheme(s.id)} className="btn btn-sm" style={{ color: '#DC2626', background: '#FEE2E2', border: 'none' }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
