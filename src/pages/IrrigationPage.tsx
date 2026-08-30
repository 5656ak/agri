import React, { useState } from 'react';
import { Droplets, CloudRain, AlertCircle, CheckCircle2, Clock, Calendar, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { dataStore } from '../services/dataStore';

interface IrrigationPageProps {
  language: Language;
}

export const IrrigationPage: React.FC<IrrigationPageProps> = ({ language }) => {
  const farmerCrops = dataStore.getFarmerCrops();
  const weather = dataStore.getWeather();

  const [selectedCropId, setSelectedCropId] = useState(farmerCrops[0]?.id || 'fc-1');
  const [soilType, setSoilType] = useState('Clay Loam (मटियारी दोमट)');
  const [irrigationMethod, setIrrigationMethod] = useState('Canal / Flood');
  const [lastIrrigationDaysAgo, setLastIrrigationDaysAgo] = useState(4);

  const selectedCrop = farmerCrops.find((c) => c.id === selectedCropId) || farmerCrops[0];

  // Logic: evaluate rainfall forecast, crop stage, soil type, and days since last watering
  const isRainExpected = weather.rainProbabilityPercent >= 50;
  const isClaySoil = soilType.includes('Clay');
  const isCriticalStage = selectedCrop?.currentStageName?.includes('Tillering') || selectedCrop?.currentStageName?.includes('Flowering');

  let status: 'NOT_REQUIRED' | 'SOON' | 'REQUIRED' = 'NOT_REQUIRED';
  let nextDateText = 'अगले 24 घंटे में आवश्यकता नहीं';
  let reasonText = 'प्राकृतिक वर्षा (65% संभावना) से मिट्टी में पर्याप्त जल स्तर बना रहेगा।';

  if (isRainExpected) {
    status = 'NOT_REQUIRED';
    nextDateText = 'आज व कल सिंचाई की आवश्यकता नहीं है';
    reasonText = `मौसम विभाग के अनुसार आज ${weather.rainProbabilityPercent}% बारिश की संभावना है। वर्षा जल का सदुपयोग करें और पंप न चलाएं।`;
  } else if (lastIrrigationDaysAgo >= (isClaySoil ? 7 : 4)) {
    status = 'REQUIRED';
    nextDateText = 'कल प्रातः काल (सुबह 6:00 से 9:00 बजे)';
    reasonText = `पिछली सिंचाई को ${lastIrrigationDaysAgo} दिन हो चुके हैं और ${selectedCrop?.variety} वर्तमान में संवेदनशील अवस्था में है।`;
  } else {
    status = 'SOON';
    nextDateText = '2 दिन बाद (02 सितम्बर को)';
    reasonText = 'मिट्टी में अभी पर्याप्त नमी है। 2 दिन बाद 3 सेमी की हल्की सिंचाई अनुशंसित है।';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
          💧 {language === 'hi' ? 'स्मार्ट सिंचाई सलाहकार (Smart Irrigation)' : 'Smart Irrigation Advisor'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
          {language === 'hi'
            ? 'फसल अवस्था, मिट्टी की जलधारण क्षमता व मौसम आधारित वैज्ञानिक सिंचाई सलाह'
            : 'Evapotranspiration & precipitation guided water-saving irrigation directives'}
        </p>
      </div>

      {/* Primary Output Banner */}
      <div
        className="card"
        style={{
          border: status === 'NOT_REQUIRED' ? '2px solid #16A34A' : status === 'SOON' ? '2px solid #D97706' : '2px solid #DC2626',
          background: status === 'NOT_REQUIRED' ? '#F0FDF4' : status === 'SOON' ? '#FFFBEB' : '#FEF2F2',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
              सिंचाई स्थिति (Current Status)
            </span>
            <h2 style={{ fontSize: '1.4rem', color: '#12372A', marginTop: '0.2rem' }}>
              {status === 'NOT_REQUIRED' ? '🟢 आज सिंचाई की जरूरत नहीं है' : status === 'SOON' ? '🟡 2 दिन बाद तैयारी रखें' : '🔴 आज सिंचाई आवश्यक है'}
            </h2>
          </div>

          <span
            className={`badge ${status === 'NOT_REQUIRED' ? 'badge-verified' : status === 'SOON' ? 'badge-warning' : 'badge-critical'}`}
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}
          >
            {nextDateText}
          </span>
        </div>

        {/* Why reasoning box */}
        <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: '#111827', marginBottom: '0.3rem' }}>
            <HelpCircle size={17} color="#1E5631" />
            <span>यह सलाह क्यों दी गई? (Why this recommendation?)</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.45 }}>
            {reasonText}
          </p>
        </div>
      </div>

      {/* Interactive Parameters Input */}
      <div className="card">
        <h2 style={{ fontSize: '1.15rem', color: '#12372A', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
          खेत व सिंचाई पैरामीटर (Field Inputs)
        </h2>

        <div className="grid-responsive two-col" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">फसल चुनें (Crop):</label>
            <select
              className="form-control"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
            >
              {farmerCrops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.variety} ({c.fieldName}) - {c.calculatedAgeDays} दिन
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">मिट्टी का प्रकार (Soil Type):</label>
            <select
              className="form-control"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            >
              <option value="Clay Loam (मटियारी दोमट)">मटियारी दोमट (Clay Loam - अधिक जलधारण)</option>
              <option value="Sandy Loam (बलुई दोमट)">बलुई दोमट (Sandy Loam - मध्यम जलधारण)</option>
              <option value="Light Sandy (बलुई मिट्टी)">हल्की बलुई (Light Sandy - शीघ्र सूखने वाली)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">सिंचाई विधि (Method):</label>
            <select
              className="form-control"
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value)}
            >
              <option value="Canal / Flood">नहर / खुली नाली (Flood)</option>
              <option value="Borewell Tube Well">नलकूप (Tube well)</option>
              <option value="Drip Irrigation">ड्रिप सिंचाई (Drip - 50% पानी बचत)</option>
              <option value="Sprinkler">फव्वारा (Sprinkler)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">पिछली सिंचाई कब की थी? (Days Ago):</label>
            <input
              type="number"
              min="0"
              max="30"
              className="form-control"
              value={lastIrrigationDaysAgo}
              onChange={(e) => setLastIrrigationDaysAgo(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
