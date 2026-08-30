import React, { useState } from 'react';
import { Sprout, MapPin, Calendar, CheckCircle2, ArrowRight, User, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  language: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete, language }) => {
  const masterCrops = dataStore.getMasterCrops();
  const currentFarmer = dataStore.getFarmerProfile();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(currentFarmer.name);
  const [state, setState] = useState(currentFarmer.location.state);
  const [district, setDistrict] = useState(currentFarmer.location.district);
  const [landAcres, setLandAcres] = useState(currentFarmer.totalLandAcres || 5);
  const [selectedCropId, setSelectedCropId] = useState('paddy');
  const [sowingDate, setSowingDate] = useState('2026-07-15');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      dataStore.updateFarmerProfile({
        name: name || 'Ramesh Kumar',
        totalLandAcres: landAcres,
        onboardingCompleted: true,
        location: {
          ...currentFarmer.location,
          state: state,
          district: district,
          formattedAddress: `${district}, ${state}`
        }
      });

      // Add main crop if not already present
      const existingCrops = dataStore.getFarmerCrops();
      if (existingCrops.length === 0) {
        const fields = dataStore.getFarm().fields;
        dataStore.addFarmerCrop({
          cropId: selectedCropId,
          variety: selectedCropId === 'paddy' ? 'Swarna (MTU 7029)' : 'Hybrid High-Yield',
          fieldId: fields[0]?.id || 'field-1',
          areaAcres: Math.min(landAcres, 2.5),
          sowingDate: sowingDate,
          soilType: 'Clay Loam (मटियारी दोमट)',
          irrigationType: 'Canal / Borewell'
        });
      }

      onComplete();
    }
  };

  const handleSkip = () => {
    dataStore.updateFarmerProfile({ onboardingCompleted: true });
    onComplete();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', padding: '1.75rem' }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E5631', background: '#DCFCE7', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
              STEP {step} / 5
            </span>
          </div>
          <button
            onClick={handleSkip}
            style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {language === 'hi' ? 'छोड़ें (Skip)' : 'Skip Setup'}
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div
            style={{
              height: '100%',
              width: `${(step / 5) * 100}%`,
              background: 'linear-gradient(90deg, #1E5631, #52B788)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {/* STEP 1: Name */}
        {step === 1 && (
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <User size={24} color="#1E5631" />
            </div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              {language === 'hi' ? 'आपका शुभ नाम क्या है?' : 'What is your name?'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.25rem' }}>
              {language === 'hi' ? 'व्यक्तिगत सलाह व मौसम सूचनाएं आपके नाम से भेजी जाएंगी।' : 'To personalize your daily field directives and voice assistant.'}
            </p>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder={language === 'hi' ? 'जैसे: रमेश कुमार' : 'e.g. Ramesh Kumar'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <MapPin size={24} color="#1E5631" />
            </div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              {language === 'hi' ? 'आपका खेत किस जिले में है?' : 'Where is your farm located?'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.25rem' }}>
              {language === 'hi' ? 'सटीक मौसम व स्थानीय मंडी भाव हेतु जिला चुनें।' : 'For accurate micro-weather alerts and local mandi prices.'}
            </p>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">{language === 'hi' ? 'राज्य (State)' : 'State'}</label>
                <input
                  type="text"
                  className="form-control"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{language === 'hi' ? 'जिला (District)' : 'District'}</label>
                <input
                  type="text"
                  className="form-control"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Farm Size */}
        {step === 3 && (
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sprout size={24} color="#1E5631" />
            </div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              {language === 'hi' ? 'कुल कृषि रकबा (Farm Size)?' : 'Total Cultivated Land?'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.25rem' }}>
              {language === 'hi' ? 'सरकारी योजना पात्रता व खाद मात्रा गणना हेतु एकड़ दर्ज करें।' : 'In acres for accurate fertilizer bag dosage & subsidy eligibility.'}
            </p>
            <div className="form-group">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                className="form-control"
                value={landAcres}
                onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
              />
              <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                {language === 'hi' ? 'एकड़ में कुल जमीन (Total Acres)' : 'Total land in acres'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Main Crop */}
        {step === 4 && (
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sparkles size={24} color="#1E5631" />
            </div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              {language === 'hi' ? 'मुख्य फसल कौन सी है?' : 'Select your primary crop'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.25rem' }}>
              {language === 'hi' ? 'फसल की अवस्था अनुसार दैनिक कार्य योजना बनेगी।' : 'Daily advisory rules will be customized for this crop.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
              {masterCrops.slice(0, 6).map((c) => {
                const isSel = c.id === selectedCropId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCropId(c.id)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: isSel ? '2px solid #1E5631' : '1px solid #E5E7EB',
                      background: isSel ? '#E8F5E9' : '#FFFFFF',
                      color: isSel ? '#1E5631' : '#374151',
                      fontWeight: isSel ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                    <span style={{ fontSize: '0.85rem' }}>{language === 'hi' ? c.nameHi : c.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Sowing Date */}
        {step === 5 && (
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Calendar size={24} color="#1E5631" />
            </div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              {language === 'hi' ? 'बुवाई कब हुई थी?' : 'When did you sow this crop?'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.25rem' }}>
              {language === 'hi' ? 'बुवाई तिथि से फसल की वर्तमान अवस्था व सिंचाई का दिन तय होगा।' : 'Used to automatically calculate growth stage and upcoming tasks.'}
            </p>
            <div className="form-group">
              <input
                type="date"
                className="form-control"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              {language === 'hi' ? 'पीछे' : 'Back'}
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary"
            style={{ flex: 2 }}
          >
            <span>{step === 5 ? (language === 'hi' ? 'डैशबोर्ड खोलें' : 'Go to Dashboard') : (language === 'hi' ? 'आगे बढ़ें' : 'Next')}</span>
            {step === 5 ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
