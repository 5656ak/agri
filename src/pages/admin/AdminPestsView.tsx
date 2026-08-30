import React, { useState } from 'react';
import { Plus, Trash2, Bug } from 'lucide-react';
import { PestDisease, Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AdminPestsViewProps {
  language: Language;
}

export const AdminPestsView: React.FC<AdminPestsViewProps> = () => {
  const masterCrops = dataStore.getMasterCrops();
  const [selectedCropId, setSelectedCropId] = useState('paddy');
  const pests = dataStore.getPestDiseases(selectedCropId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [problemNameHi, setProblemNameHi] = useState('');
  const [problemNameEn, setProblemNameEn] = useState('');
  const [symptomsHi, setSymptomsHi] = useState('');
  const [organicHi, setOrganicHi] = useState('');
  const [chemicalHi, setChemicalHi] = useState('');
  const [category, setCategory] = useState<'Fungal' | 'Bacterial' | 'Viral' | 'Pest_Damage' | 'Nutrient_Deficiency'>('Pest_Damage');

  const handleAddPest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemNameHi.trim()) return;

    const newPest: PestDisease = {
      id: `pest-${Date.now()}`,
      cropId: selectedCropId,
      problemNameHi,
      problemNameEn: problemNameEn || problemNameHi,
      category,
      symptomsHi: symptomsHi ? [symptomsHi] : ['लक्षणों की जांच करें'],
      symptomsEn: [problemNameEn],
      preventionHi: ['स्वच्छ खेती अपनाएं'],
      preventionEn: ['Maintain sanitation'],
      organicManagementHi: organicHi ? [organicHi] : ['नीम तेल का छिड़काव करें'],
      organicManagementEn: ['Neem oil spray'],
      chemicalGuidanceHi: chemicalHi || 'CIB&RC प्रमाणित दवा का प्रयोग करें।',
      chemicalGuidanceEn: 'Use CIBRC registered formulation.',
      severity: 'HIGH',
      sourceInstitution: 'CIB&RC / ICAR'
    };

    dataStore.savePestDisease(newPest);
    setProblemNameHi('');
    setProblemNameEn('');
    setSymptomsHi('');
    setOrganicHi('');
    setChemicalHi('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#12372A' }}>
          🐛 कीट व रोग लाइब्रेरी (Pest & Disease DB)
        </h2>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>नया रोग/कीट जोड़ें</span>
        </button>
      </div>

      {/* Crop Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
        {masterCrops.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCropId(c.id)}
            className="btn btn-sm"
            style={{
              borderRadius: '9999px',
              background: selectedCropId === c.id ? '#1E5631' : '#FFFFFF',
              color: selectedCropId === c.id ? '#FFFFFF' : '#374151',
              border: selectedCropId === c.id ? '1px solid #1E5631' : '1px solid #E5E7EB',
              fontWeight: 700
            }}
          >
            <span>{c.icon} {c.nameHi}</span>
          </button>
        ))}
      </div>

      {showAddForm && (
        <div className="card" style={{ border: '2px solid #1E5631', background: '#F8FAF7' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#14532D', marginBottom: '0.75rem' }}>
            नया कीट/रोग रिकॉर्ड जोड़ें:
          </h3>
          <form onSubmit={handleAddPest}>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">रोग/कीट का नाम (Hindi):</label>
                <input type="text" className="form-control" placeholder="जैसे: धान का तना छेदक" value={problemNameHi} onChange={(e) => setProblemNameHi(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Problem Name (English):</label>
                <input type="text" className="form-control" placeholder="e.g. Yellow Stem Borer" value={problemNameEn} onChange={(e) => setProblemNameEn(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">प्रमुख लक्षण (Symptoms):</label>
              <textarea className="form-control" rows={2} value={symptomsHi} onChange={(e) => setSymptomsHi(e.target.value)} placeholder="गोभ सूखना (डेड हार्ट), पत्तियों पर छिद्र।" />
            </div>

            <div className="form-group">
              <label className="form-label">जैविक व सस्य प्रबंधन (Organic IPM):</label>
              <input type="text" className="form-control" value={organicHi} onChange={(e) => setOrganicHi(e.target.value)} placeholder="नीम तेल (1500 ppm) 5ml/L छिड़कें।" />
            </div>

            <div className="form-group">
              <label className="form-label">CIB&RC प्रमाणित रासायनिक दवा (Chemical Dosage):</label>
              <input type="text" className="form-control" value={chemicalHi} onChange={(e) => setChemicalHi(e.target.value)} placeholder="कारटाप हाइड्रोक्लोराइड 4G @ 7.5 kg/एकड़।" />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">रिकॉर्ड सहेजें</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">रद्द करें</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {pests.map((p) => (
          <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-critical">{p.category}</span>
                <span className="badge badge-verified">CIB&RC VERIFIED</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>
                {p.problemNameHi} ({p.problemNameEn})
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: '0.2rem' }}>
                <strong>लक्षण:</strong> {p.symptomsHi[0]}
              </p>
              <p style={{ fontSize: '0.82rem', color: '#166534', marginTop: '0.2rem' }}>
                <strong>रासायनिक दवा:</strong> {p.chemicalGuidanceHi}
              </p>
            </div>

            <button onClick={() => dataStore.deletePestDisease(p.id)} className="btn btn-sm" style={{ color: '#DC2626', background: '#FEE2E2', border: 'none' }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
