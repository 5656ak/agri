import React, { useState } from 'react';
import { Plus, Trash2, Edit, Sprout } from 'lucide-react';
import { CropMaster, Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AdminCropsViewProps {
  language: Language;
}

export const AdminCropsView: React.FC<AdminCropsViewProps> = () => {
  const masterCrops = dataStore.getMasterCrops();
  const [showAddForm, setShowAddForm] = useState(false);
  const [nameHi, setNameHi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<'Cereal' | 'Pulse' | 'Cash Crop' | 'Vegetable' | 'Oilseed'>('Cereal');
  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid' | 'All-season'>('Kharif');
  const [duration, setDuration] = useState(120);
  const [varietiesStr, setVarietiesStr] = useState('');
  const [icon, setIcon] = useState('🌾');

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameHi.trim() || !nameEn.trim()) return;

    const newCrop: CropMaster = {
      id: nameEn.toLowerCase().replace(/\s+/g, '-'),
      nameEn,
      nameHi,
      category,
      season,
      totalDurationDays: duration,
      varieties: varietiesStr ? varietiesStr.split(',').map((v) => v.trim()) : ['Hybrid-1'],
      suitableSoils: ['Alluvial Loam', 'Clay Loam'],
      icon: icon || '🌱',
      dataStatus: 'VERIFIED'
    };

    dataStore.saveMasterCrop(newCrop);
    setNameHi('');
    setNameEn('');
    setVarietiesStr('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#12372A' }}>
          🌾 फसल मास्टर डेटाबेस (Crops Master DB)
        </h2>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>नई फसल जोड़ें</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ border: '2px solid #1E5631', background: '#F8FAF7' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#14532D', marginBottom: '0.75rem' }}>
            नई फसल मास्टर रिकॉर्ड जोड़ें:
          </h3>
          <form onSubmit={handleAddCrop}>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">फसल का नाम (Hindi):</label>
                <input type="text" className="form-control" value={nameHi} onChange={(e) => setNameHi(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Crop Name (English):</label>
                <input type="text" className="form-control" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">श्रेणी (Category):</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                  <option value="Cereal">अनाज (Cereal)</option>
                  <option value="Pulse">दलहन (Pulse)</option>
                  <option value="Oilseed">तिलहन (Oilseed)</option>
                  <option value="Vegetable">सब्जी (Vegetable)</option>
                  <option value="Cash Crop">नकदी फसल (Cash Crop)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">मौसम (Season):</label>
                <select className="form-control" value={season} onChange={(e) => setSeason(e.target.value as any)}>
                  <option value="Kharif">खरीफ (Kharif)</option>
                  <option value="Rabi">रबी (Rabi)</option>
                  <option value="Zaid">जायद (Zaid)</option>
                  <option value="All-season">वर्षभर (All-season)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">प्रमुख किस्में (Comma separated varieties):</label>
              <input type="text" className="form-control" placeholder="जैसे: Swarna, IR-64, Pusa-1121" value={varietiesStr} onChange={(e) => setVarietiesStr(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">फसल सहेजें</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">रद्द करें</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid-responsive three-col" style={{ gap: '1rem' }}>
        {masterCrops.map((crop) => (
          <div key={crop.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>{crop.icon}</span>
                <span className="badge badge-verified">{crop.season}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#12372A', marginTop: '0.35rem' }}>
                {crop.nameHi} ({crop.nameEn})
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                {crop.category} • अवधि: {crop.totalDurationDays} दिन
              </p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#374151' }}>
                <strong>किस्में:</strong> {crop.varieties.join(', ')}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => dataStore.deleteMasterCrop(crop.id)} className="btn btn-sm" style={{ color: '#DC2626', background: '#FEE2E2', border: 'none' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
