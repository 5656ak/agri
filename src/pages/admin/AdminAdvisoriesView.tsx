import React, { useState } from 'react';
import { Plus, Trash2, Edit, CheckCircle, AlertTriangle } from 'lucide-react';
import { AdminAdvisory, Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AdminAdvisoriesViewProps {
  language: Language;
}

export const AdminAdvisoriesView: React.FC<AdminAdvisoriesViewProps> = ({ language }) => {
  const advisories = dataStore.getAdvisories();
  const masterCrops = dataStore.getMasterCrops();

  const [showAddForm, setShowAddForm] = useState(false);
  const [titleHi, setTitleHi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [actionHi, setActionHi] = useState('');
  const [cropId, setCropId] = useState('paddy');
  const [state, setState] = useState('Jharkhand');
  const [severity, setSeverity] = useState<'INFO' | 'WARNING' | 'CRITICAL'>('WARNING');
  const [sourceInst, setSourceInst] = useState('ICAR-CRURRS Hazaribagh');

  const handleCreateAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleHi.trim() || !actionHi.trim()) return;

    dataStore.saveAdvisory({
      id: `adv-${Date.now()}`,
      titleHi,
      titleEn: titleEn || titleHi,
      descriptionHi,
      descriptionEn: descriptionHi,
      actionHi,
      actionEn: actionHi,
      cropId,
      state,
      severity,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-09-30',
      active: true,
      sourceInstitution: sourceInst
    });

    setTitleHi('');
    setTitleEn('');
    setDescriptionHi('');
    setActionHi('');
    setShowAddForm(false);
    alert('क्षेत्रीय कृषि सलाह सफलतापूर्वक प्रसारित की गई! किसान के होमपेज पर तुरंत दिखेगी।');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#12372A' }}>
          📢 क्षेत्रीय कृषि सलाह प्रबंधन (Regional Advisories)
        </h2>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>नई सलाह जोड़ें</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ border: '2px solid #1E5631', background: '#F8FAF7' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#14532D', marginBottom: '0.75rem' }}>
            नई कृषि सलाह प्रसारित करें (Broadcast Advisory):
          </h3>
          <form onSubmit={handleCreateAdvisory}>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">शीर्षक (Hindi Title):</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="जैसे: धान में तना छेदक कीट की चेतावनी"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">शीर्षक (English Title):</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Yellow Stem Borer Alert"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">संबंधित फसल (Crop):</label>
                <select className="form-control" value={cropId} onChange={(e) => setCropId(e.target.value)}>
                  {masterCrops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameHi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">गंभीरता स्तर (Severity):</label>
                <select className="form-control" value={severity} onChange={(e) => setSeverity(e.target.value as any)}>
                  <option value="INFO">सामान्य (Info)</option>
                  <option value="WARNING">सावधानी (Warning)</option>
                  <option value="CRITICAL">अति-गंभीर (Critical)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">कारण व विवरण (Description):</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="अधिक नमी के कारण कल्ले फूटने वाली धान में कीट की संभावना है।"
                value={descriptionHi}
                onChange={(e) => setDescriptionHi(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">किसान के लिए कार्रवाई निर्देश (Action Text):</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="खेत में फेरोमोन ट्रैप लगाएं व कारटाप 4G का प्रयोग करें।"
                value={actionHi}
                onChange={(e) => setActionHi(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">अनुसंधान संस्थान / स्रोत (Source Institution):</label>
              <input
                type="text"
                className="form-control"
                value={sourceInst}
                onChange={(e) => setSourceInst(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">सलाह प्रकाशित करें</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">रद्द करें</button>
            </div>
          </form>
        </div>
      )}

      {/* Advisories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {advisories.map((adv) => (
          <div
            key={adv.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '1rem',
              border: adv.active ? '1.5px solid #BBF7D0' : '1px solid #E5E7EB',
              background: adv.active ? '#FFFFFF' : '#F9FAFB'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className={`badge ${adv.severity === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}`}>
                  {adv.severity}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>
                  {adv.cropId?.toUpperCase()} • {adv.state}
                </span>
                <span style={{ fontSize: '0.75rem', color: adv.active ? '#15803D' : '#9CA3AF', fontWeight: 700 }}>
                  {adv.active ? '🟢 सक्रिय (LIVE)' : '⚪ निष्क्रिय'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', color: '#12372A', fontWeight: 700 }}>
                {adv.titleHi}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: '0.2rem' }}>
                {adv.actionHi}
              </p>
              <span style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '0.35rem', display: 'block' }}>
                स्रोत: {adv.sourceInstitution}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => dataStore.toggleAdvisoryActive(adv.id)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                {adv.active ? 'बंद करें' : 'सक्रिय करें'}
              </button>
              <button
                onClick={() => dataStore.deleteAdvisory(adv.id)}
                className="btn btn-sm"
                style={{ color: '#DC2626', background: '#FEE2E2', border: 'none' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
