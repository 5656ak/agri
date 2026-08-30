import React from 'react';
import { Sprout, Plus, Calendar, Droplets, FlaskConical, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { dataStore } from '../services/dataStore';
import { getTranslation } from '../i18n/translations';

interface CropsPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  onOpenCropDetail: (cropId: string) => void;
  onOpenAddCrop: () => void;
  language: Language;
}

export const CropsPage: React.FC<CropsPageProps> = ({
  onOpenCropDetail,
  onOpenAddCrop,
  language
}) => {
  const farmerCrops = dataStore.getFarmerCrops();
  const t = getTranslation(language);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
            {language === 'hi' ? '🌾 मेरी सक्रिय फसलें (My Crops)' : '🌾 My Active Crops'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
            {language === 'hi' ? 'आपके खेत में बोई गई फसलों का सम्पूर्ण जीवनचक्र व स्वास्थ्य ट्रैक करें' : 'Track crop age, milestones, irrigation schedule, and nutrition plans'}
          </p>
        </div>

        <button onClick={onOpenAddCrop} className="btn btn-primary">
          <Plus size={18} />
          <span>{t.addCrop}</span>
        </button>
      </div>

      {/* Crop Cards Grid */}
      {farmerCrops.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Sprout size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t.noCropsTitle}</h3>
          <p style={{ color: '#6B7280', maxWidth: '380px', margin: '0 auto 1.5rem auto' }}>
            {t.noCropsDesc}
          </p>
          <button onClick={onOpenAddCrop} className="btn btn-primary">
            <Plus size={18} />
            <span>{t.addCrop}</span>
          </button>
        </div>
      ) : (
        <div className="grid-responsive three-col" style={{ gap: '1.25rem' }}>
          {farmerCrops.map((crop) => (
            <div
              key={crop.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1.5px solid #E5E7EB',
                padding: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-verified">
                    {crop.healthStatus === 'HEALTHY' ? '🟢 उत्तम व स्वस्थ' : '🟡 निगरानी आवश्यक'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E5631' }}>
                    {crop.areaAcres} एकड़
                  </span>
                </div>

                <h2 style={{ fontSize: '1.25rem', color: '#12372A', marginBottom: '0.25rem' }}>
                  {crop.variety}
                </h2>

                <p style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                  📍 {crop.fieldName} • {crop.soilType}
                </p>

                <div style={{ display: 'flex', gap: '1rem', margin: '0.75rem 0', fontSize: '0.8rem', color: '#6B7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={15} color="#1E5631" />
                    <span>बुवाई: {crop.sowingDate}</span>
                  </span>
                  <span style={{ fontWeight: 700, color: '#1E5631' }}>
                    ({crop.calculatedAgeDays} दिन)
                  </span>
                </div>

                {/* Milestone Pill */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.65rem 0.85rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                    वर्तमान अवस्था (Current Stage):
                  </span>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#14532D', marginTop: '2px' }}>
                    {crop.currentStageName}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
                <button
                  onClick={() => onOpenCropDetail(crop.id)}
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.88rem' }}
                >
                  <span>{t.viewDetails}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
