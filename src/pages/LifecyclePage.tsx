import React, { useState } from 'react';
import { CalendarDays, Droplets, FlaskConical, Bug, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { cropService } from '../services/agriculture/cropService';
import { sourceService } from '../services/agriculture/sourceService';
import { ResearchSourcePanel } from '../components/common/ResearchSourcePanel';

interface LifecyclePageProps {
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const LifecyclePage: React.FC<LifecyclePageProps> = ({ language }) => {
  const crops = cropService.getAllCrops();
  const [selectedCropId, setSelectedCropId] = useState('wheat');
  const [activeStageNumber, setActiveStageNumber] = useState(5); // Default to Stage 5 (Tillering)

  const selectedCrop = cropService.getCropById(selectedCropId) || crops[0];
  const lifecycleData = cropService.getCropLifecycle(selectedCropId);
  const stages = lifecycleData?.lifecycle_stages || [];
  const activeStage = stages.find((s) => s.stage_number === activeStageNumber) || stages[0];

  const primarySourceId = lifecycleData?.source_ids?.[0] || selectedCrop?.source_ids?.[0];
  const sourceRecord = sourceService.getSafeSourceDisplay(primarySourceId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{language === 'hi' ? '10-चरणीय सम्पूर्ण फसल जीवनचक्र गाइड' : '10-Stage Crop Lifecycle Guide'}</span>
              <span className={`badge ${lifecycleData?.data_status === 'VERIFIED' ? 'badge-verified' : 'badge-demo'}`}>
                {lifecycleData?.data_status === 'VERIFIED' ? 'ICAR VERIFIED DATA' : 'DEMO DATA'}
              </span>
            </h1>
            <p className="section-subtitle">
              {language === 'hi'
                ? 'बीज चयन से लेकर सुरक्षित भंडारण तक प्रत्येक अवस्था पर वैज्ञानिक पैकेज ऑफ प्रैक्टिसेज'
                : 'Scientific Package of Practices from seed selection to post-harvest storage'}
            </p>
          </div>
        </div>
      </div>

      {/* Crop Selector Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {crops.map((crop) => {
          const isSelected = crop.crop_id === selectedCropId;
          const cropIcon = crop.crop_id === 'wheat' ? '🌾' :
                           crop.crop_id === 'rice' ? '🌾' :
                           crop.crop_id === 'cotton' ? '🌱' :
                           crop.crop_id === 'tomato' ? '🍅' :
                           crop.crop_id === 'potato' ? '🥔' :
                           crop.crop_id === 'mustard' ? '🌻' :
                           crop.crop_id === 'maize' ? '🌽' : '🌿';
          return (
            <button
              key={crop.crop_id}
              onClick={() => {
                setSelectedCropId(crop.crop_id);
                setActiveStageNumber(1);
              }}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                borderRadius: '9999px',
                border: isSelected ? '2px solid #1E5631' : '1px solid #E2E8F0',
                background: isSelected ? '#E8F5E9' : '#FFFFFF',
                color: isSelected ? '#1E5631' : '#475569',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{cropIcon}</span>
              <span>{language === 'hi' ? crop.name_hi : crop.name_en}</span>
            </button>
          );
        })}
      </div>

      {/* 10-Stage Horizontal Matrix */}
      <div className="card" style={{ padding: '1rem', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
            चयनित फसल: {language === 'hi' ? selectedCrop.name_hi : selectedCrop.name_en} (10 Agronomic Milestones)
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            अवधि: {selectedCrop.typical_duration.min_days}-{selectedCrop.typical_duration.max_days} दिन
          </span>
        </div>

        {/* Scrollable Stage Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {stages.map((s) => {
            const isActive = s.stage_number === activeStageNumber;
            return (
              <button
                key={s.stage_number}
                onClick={() => setActiveStageNumber(s.stage_number)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  border: isActive ? '2px solid #1E5631' : '1px solid #CBD5E1',
                  background: isActive ? '#1E5631' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#334155',
                  cursor: 'pointer',
                  minWidth: '160px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 700, opacity: isActive ? 0.9 : 0.6 }}>
                  अवस्था {s.stage_number} ({s.duration_days})
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px', lineHeight: 1.2 }}>
                  {language === 'hi' ? s.stage_name_hi.split('. ')[1] || s.stage_name_hi : s.stage_name_en}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Card */}
      {activeStage && (
        <div className="card" style={{ border: '2px solid #2D6A4F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>
                वर्तमान चयनित अवस्था • {activeStage.duration_days}
              </span>
              <h2 style={{ fontSize: '1.4rem', color: '#12372A', marginTop: '0.2rem' }}>
                {language === 'hi' ? activeStage.stage_name_hi : activeStage.stage_name_en}
              </h2>
            </div>
            <span className="badge badge-verified">
              {lifecycleData?.data_status === 'VERIFIED' ? 'ICAR VERIFIED POP' : 'VERIFIED STAGES'}
            </span>
          </div>

          {/* 3 Crucial Agronomic Guidance Blocks */}
          <div className="grid-responsive three-col" style={{ gap: '1rem' }}>
            {/* 1. Irrigation Guidance */}
            <div style={{ padding: '1rem', background: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#1E3A8A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Droplets size={18} color="#2563EB" />
                <span>{language === 'hi' ? 'सिंचाई दिशा-निर्देश (Irrigation):' : 'Irrigation Guidance:'}</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#1E40AF', lineHeight: 1.5 }}>
                {activeStage.irrigation_guidance}
              </p>
            </div>

            {/* 2. Nutrient Guidance */}
            <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '12px', border: '1px solid #FDE68A' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#78350F', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FlaskConical size={18} color="#B45309" />
                <span>{language === 'hi' ? 'पोषण व खाद (Nutrient Management):' : 'Nutrient Guidance:'}</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#92400E', lineHeight: 1.5 }}>
                {activeStage.nutrient_guidance}
              </p>
            </div>

            {/* 3. Pest & Disease Monitoring */}
            <div style={{ padding: '1rem', background: '#FEE2E2', borderRadius: '12px', border: '1px solid #FECACA' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#991B1B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bug size={18} color="#DC2626" />
                <span>{language === 'hi' ? 'रोग व कीट निगरानी (Pest Scouting):' : 'Pest Monitoring:'}</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#B91C1C', lineHeight: 1.5 }}>
                {activeStage.pest_disease_scouting}
              </p>
            </div>
          </div>

          {/* Precautions Banner */}
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#FFFBEB', borderRadius: '10px', border: '1px solid #FCD34D', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={20} color="#D97706" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: '#92400E' }}>
              <strong>महत्वपूर्ण सावधानी (Precaution):</strong> {activeStage.precautions}
            </span>
          </div>

          {/* Dedicated Research Source Component */}
          <ResearchSourcePanel sourceRecord={sourceRecord} />
        </div>
      )}
    </div>
  );
};
