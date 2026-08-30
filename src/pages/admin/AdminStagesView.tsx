import React, { useState } from 'react';
import { Plus, Trash2, Sprout } from 'lucide-react';
import { CropStage, Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AdminStagesViewProps {
  language: Language;
}

export const AdminStagesView: React.FC<AdminStagesViewProps> = () => {
  const masterCrops = dataStore.getMasterCrops();
  const [selectedCropId, setSelectedCropId] = useState('paddy');
  const stages = dataStore.getCropStages(selectedCropId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [stageNameHi, setStageNameHi] = useState('');
  const [stageNameEn, setStageNameEn] = useState('');
  const [dayStart, setDayStart] = useState(0);
  const [dayEnd, setDayEnd] = useState(30);
  const [irrigationHi, setIrrigationHi] = useState('');
  const [fertilizerHi, setFertilizerHi] = useState('');
  const [pestHi, setPestHi] = useState('');

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageNameHi.trim()) return;

    const newStage: CropStage = {
      id: `stage-${Date.now()}`,
      cropId: selectedCropId,
      stageNumber: stages.length + 1,
      stageNameHi,
      stageNameEn: stageNameEn || stageNameHi,
      dayStart,
      dayEnd,
      irrigationGuidanceHi: irrigationHi || 'आवश्यकतानुसार हल्की सिंचाई करें।',
      irrigationGuidanceEn: 'Light irrigation as required.',
      fertilizerGuidanceHi: fertilizerHi || 'संतुलित पोषण का प्रयोग करें।',
      fertilizerGuidanceEn: 'Apply balanced nutrition.',
      pestScoutingHi: pestHi || 'कीट-रोग के लक्षणों की नियमित निगरानी करें।',
      pestScoutingEn: 'Regular pest scouting.',
      criticalPrecautionsHi: 'सावधानी रखें।',
      criticalPrecautionsEn: 'Take precautions.'
    };

    dataStore.saveCropStage(newStage);
    setStageNameHi('');
    setStageNameEn('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#12372A' }}>
          🌿 फसल विकास अवस्थाएं व PoP (Crop Growth Stages)
        </h2>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>नई अवस्था जोड़ें</span>
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
            नई फसल अवस्था गाइड जोड़ें:
          </h3>
          <form onSubmit={handleAddStage}>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">अवस्था नाम (Hindi):</label>
                <input type="text" className="form-control" placeholder="जैसे: कल्ले फूटना (Tillering)" value={stageNameHi} onChange={(e) => setStageNameHi(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Stage Name (English):</label>
                <input type="text" className="form-control" placeholder="e.g. Active Tillering" value={stageNameEn} onChange={(e) => setStageNameEn(e.target.value)} />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">शुरुआती दिन (Day Start):</label>
                <input type="number" className="form-control" value={dayStart} onChange={(e) => setDayStart(parseInt(e.target.value) || 0)} required />
              </div>
              <div className="form-group">
                <label className="form-label">अंतिम दिन (Day End):</label>
                <input type="number" className="form-control" value={dayEnd} onChange={(e) => setDayEnd(parseInt(e.target.value) || 0)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">सिंचाई दिशा-निर्देश (Irrigation Guidance):</label>
              <textarea className="form-control" rows={2} value={irrigationHi} onChange={(e) => setIrrigationHi(e.target.value)} placeholder="3-4 सेमी पानी का स्तर बनाए रखें।" />
            </div>

            <div className="form-group">
              <label className="form-label">खाद व पोषण (Fertilizer Guidance):</label>
              <textarea className="form-control" rows={2} value={fertilizerHi} onChange={(e) => setFertilizerHi(e.target.value)} placeholder="30-35 kg यूरिया प्रति एकड़ टॉप-ड्रेसिंग करें।" />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">अवस्था सहेजें</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">रद्द करें</button>
            </div>
          </form>
        </div>
      )}

      {/* Stages List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {stages.map((stg) => (
          <div key={stg.id} className="card" style={{ border: '1.5px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1.05rem', color: '#12372A', fontWeight: 700 }}>
                {stg.stageNumber}. {stg.stageNameHi} ({stg.stageNameEn})
              </h4>
              <span className="badge badge-verified">
                दिन {stg.dayStart} - {stg.dayEnd}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.82rem', marginTop: '0.5rem' }}>
              <div>💧 <strong>सिंचाई:</strong> {stg.irrigationGuidanceHi}</div>
              <div>🌿 <strong>पोषण:</strong> {stg.fertilizerGuidanceHi}</div>
              <div>🐛 <strong>कीट:</strong> {stg.pestScoutingHi}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
