import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Sprout, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { dataStore } from '../services/dataStore';

interface CalendarPageProps {
  language: Language;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ language }) => {
  const farmerCrops = dataStore.getFarmerCrops();
  const [selectedCropId, setSelectedCropId] = useState(farmerCrops[0]?.id || 'fc-1');

  const selectedCrop = farmerCrops.find((c) => c.id === selectedCropId) || farmerCrops[0];
  const stages = dataStore.getCropStages(selectedCrop?.cropId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
          📅 {language === 'hi' ? 'फसल कैलेंडर व कार्य समय-सारणी' : 'Crop Activity Calendar'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
          {language === 'hi'
            ? 'बुवाई से कटाई तक सभी 10 चरणों की कृषि कार्य सूची एवं समय-सीमा'
            : 'End-to-end milestone timeline from sowing to harvesting'}
        </p>
      </div>

      {/* Crop Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
        {farmerCrops.map((c) => (
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
            <span>🌾 {c.variety} ({c.calculatedAgeDays} दिन)</span>
          </button>
        ))}
      </div>

      {/* Selected Crop Summary */}
      {selectedCrop && (
        <div className="card" style={{ background: '#F8FAF7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E5631', textTransform: 'uppercase' }}>
                सक्रिय फसल: {selectedCrop.variety}
              </span>
              <h2 style={{ fontSize: '1.25rem', color: '#12372A' }}>
                बुवाई तिथि: {selectedCrop.sowingDate} (उम्र: {selectedCrop.calculatedAgeDays} दिन)
              </h2>
            </div>
            <span className="badge badge-verified">
              अवस्था {selectedCrop.currentStageNumber}
            </span>
          </div>
        </div>
      )}

      {/* Stage-wise Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {stages.map((stg) => {
          const isPassed = (selectedCrop?.calculatedAgeDays || 0) > stg.dayEnd;
          const isCurrent = (selectedCrop?.calculatedAgeDays || 0) >= stg.dayStart && (selectedCrop?.calculatedAgeDays || 0) <= stg.dayEnd;
          const isFuture = (selectedCrop?.calculatedAgeDays || 0) < stg.dayStart;

          return (
            <div
              key={stg.id}
              className="card"
              style={{
                border: isCurrent ? '2px solid #1E5631' : '1px solid #E5E7EB',
                background: isCurrent ? '#F0FDF4' : isPassed ? '#FFFFFF' : '#F9FAFB',
                opacity: isFuture ? 0.75 : 1.0,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isPassed ? (
                    <CheckCircle2 size={22} color="#16A34A" />
                  ) : isCurrent ? (
                    <Clock size={22} color="#1E5631" />
                  ) : (
                    <Circle size={22} color="#9CA3AF" />
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: isCurrent ? '#14532D' : '#111827' }}>
                      {language === 'hi' ? stg.stageNameHi : stg.stageNameEn}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      दिन {stg.dayStart} से {stg.dayEnd} तक
                    </span>
                  </div>
                </div>

                <span className={`badge ${isPassed ? 'badge-verified' : isCurrent ? 'badge-warning' : 'badge-info'}`}>
                  {isPassed ? 'पूर्ण (Completed)' : isCurrent ? 'वर्तमान (Active Now)' : 'आगामी (Upcoming)'}
                </span>
              </div>

              {/* Tasks Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                <div style={{ background: '#FFFFFF', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <strong>💧 सिंचाई:</strong> {stg.irrigationGuidanceHi}
                </div>
                <div style={{ background: '#FFFFFF', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <strong>🌿 पोषण:</strong> {stg.fertilizerGuidanceHi}
                </div>
                <div style={{ background: '#FFFFFF', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <strong>🐛 निगरानी:</strong> {stg.pestScoutingHi}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
