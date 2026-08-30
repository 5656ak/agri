import React, { useState } from 'react';
import { Bug, ShieldAlert, CheckCircle2, AlertTriangle, PhoneCall, HelpCircle, Leaf } from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { dataStore } from '../services/dataStore';

interface PestDirectoryPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const PestDirectoryPage: React.FC<PestDirectoryPageProps> = ({ onSelectTab, language }) => {
  const masterCrops = dataStore.getMasterCrops();
  const [selectedCropId, setSelectedCropId] = useState('paddy');

  const pests = dataStore.getPestDiseases(selectedCropId);
  const [selectedPestId, setSelectedPestId] = useState<string>(pests[0]?.id || '');

  const activePest = pests.find((p) => p.id === selectedPestId) || pests[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
          🐛 {language === 'hi' ? 'कीट व रोग प्रबंधन केंद्र (Pest & Disease Center)' : 'Pest & Disease Center'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
          {language === 'hi'
            ? 'फसल चुनें और प्रमुख कीट-रोगों के लक्षण, जैविक रोकथाम व CIB&RC प्रमाणित दवाएं जानें'
            : 'Select your crop to inspect symptoms, organic IPM, and government-registered treatments'}
        </p>
      </div>

      {/* Crop Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
        {masterCrops.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCropId(c.id);
              const newPests = dataStore.getPestDiseases(c.id);
              if (newPests.length > 0) setSelectedPestId(newPests[0].id);
            }}
            className="btn btn-sm"
            style={{
              borderRadius: '9999px',
              background: selectedCropId === c.id ? '#1E5631' : '#FFFFFF',
              color: selectedCropId === c.id ? '#FFFFFF' : '#374151',
              border: selectedCropId === c.id ? '1px solid #1E5631' : '1px solid #E5E7EB',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            <span>{c.icon}</span>
            <span>{language === 'hi' ? c.nameHi : c.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Pest Problem Selector Grid & Details */}
      <div className="grid-responsive two-col" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Problem List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>
            {language === 'hi' ? 'प्रमुख कीट व बीमारियां' : 'Common Issues in this Crop'}
          </h3>

          {pests.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
              इस फसल के लिए कोई रोग डेटाबेस दर्ज नहीं है।
            </div>
          ) : (
            pests.map((p) => {
              const isSel = p.id === (activePest?.id || '');
              return (
                <div
                  key={p.id}
                  className="card card-clickable"
                  onClick={() => setSelectedPestId(p.id)}
                  style={{
                    border: isSel ? '2px solid #1E5631' : '1px solid #E5E7EB',
                    background: isSel ? '#F0FDF4' : '#FFFFFF',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.98rem', color: '#12372A', fontWeight: 700 }}>
                      {language === 'hi' ? p.problemNameHi : p.problemNameEn}
                    </h4>
                    <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
                      {p.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: '0.35rem' }}>
                    {p.symptomsHi[0]}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Management Card */}
        {activePest && (
          <div className="card" style={{ border: '2px solid #2D6A4F', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
              <span className="badge badge-verified" style={{ marginBottom: '0.35rem' }}>
                {activePest.category}
              </span>
              <h2 style={{ fontSize: '1.3rem', color: '#12372A' }}>
                {language === 'hi' ? activePest.problemNameHi : activePest.problemNameEn}
              </h2>
            </div>

            {/* Symptoms */}
            <div>
              <h4 style={{ fontSize: '0.92rem', color: '#111827', fontWeight: 700, marginBottom: '0.4rem' }}>
                🔍 मुख्य पहचान व लक्षण (Symptoms):
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {(language === 'hi' ? activePest.symptomsHi : activePest.symptomsEn).map((sym, i) => (
                  <li key={i}>{sym}</li>
                ))}
              </ul>
            </div>

            {/* Organic & Cultural Prevention */}
            <div style={{ background: '#F0FDF4', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
              <h4 style={{ fontSize: '0.92rem', color: '#166534', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Leaf size={16} />
                <span>जैविक व सस्य प्रबंधन (Organic & Cultural IPM):</span>
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#14532D', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {(language === 'hi' ? activePest.organicManagementHi : activePest.organicManagementEn).map((org, i) => (
                  <li key={i}>{org}</li>
                ))}
              </ul>
            </div>

            {/* Chemical Option */}
            <div style={{ background: '#EFF6FF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
              <h4 style={{ fontSize: '0.92rem', color: '#1E40AF', fontWeight: 700, marginBottom: '0.25rem' }}>
                💊 रासायनिक दवा (CIB&RC Registered):
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#1E3A8A', lineHeight: 1.4 }}>
                {language === 'hi' ? activePest.chemicalGuidanceHi : activePest.chemicalGuidanceEn}
              </p>
              {activePest.phiDays && (
                <span style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 700, marginTop: '0.3rem', display: 'block' }}>
                  ⏳ प्रतीक्षा अवधि (PHI): {activePest.phiDays} दिन
                </span>
              )}
            </div>

            {/* Expert Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAF7', padding: '0.75rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#4B5563' }}>संदेह होने पर विशेषज्ञ से पूछें:</span>
              <button onClick={() => onSelectTab('expert')} className="btn btn-outline btn-sm">
                <PhoneCall size={14} />
                <span>वैज्ञानिक से पूछें</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
