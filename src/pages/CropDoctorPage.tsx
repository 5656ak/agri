import React, { useState } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, PhoneCall, HelpCircle, Stethoscope } from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { cropService } from '../services/agriculture/cropService';
import { diseaseService, DiseaseRecord } from '../services/agriculture/diseaseService';
import { chemicalService } from '../services/agriculture/chemicalService';
import { sourceService } from '../services/agriculture/sourceService';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { ResearchSourcePanel } from '../components/common/ResearchSourcePanel';

interface CropDoctorPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const CropDoctorPage: React.FC<CropDoctorPageProps> = ({ onSelectTab, language }) => {
  const crops = cropService.getAllCrops();
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Retrieve verified diseases for selected crop
  const cropDiseases = diseaseService.getDiseasesByCrop(selectedCrop);
  const primaryDisease: DiseaseRecord | undefined = cropDiseases[0];
  const registeredChemicals = primaryDisease
    ? chemicalService.getVerifiedChemicalsForCondition(selectedCrop, primaryDisease.disease_id)
    : [];

  const sourceRecord = sourceService.getSafeSourceDisplay(primaryDisease?.source_ids?.[0]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedImage(uploadEvent.target?.result as string);
        setShowResult(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateAnalysis = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setShowResult(true);
    }, 700);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setShowResult(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="section-header">
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{language === 'hi' ? 'AI फसल रोग व स्वास्थ्य निदान' : 'AI Crop Health Doctor'}</span>
          <span className="badge badge-demo">UI SHELL • LOCAL KB CONNECTED</span>
        </h1>
        <p className="section-subtitle">
          {language === 'hi'
            ? 'पत्ती का फोटो अपलोड कर सत्यापित लक्षणों व वैज्ञानिक प्रबंधन को समझें'
            : 'Inspect explainable symptoms and verified IPM management from ICAR repository'}
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner type="mandatory-ai" />

      {/* Main Interactive Workspace */}
      <div className="grid-responsive two-col" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Input and Capture controls */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Crop Selector */}
          <div className="form-group">
            <label className="form-label" htmlFor="crop-select">
              <span>{language === 'hi' ? '1. फसल चुनें (Select Crop):' : '1. Select Crop:'}</span>
            </label>
            <select
              id="crop-select"
              className="form-control"
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setShowResult(false);
              }}
            >
              {crops.map((crop) => (
                <option key={crop.crop_id} value={crop.crop_id}>
                  {crop.name_hi} ({crop.name_en}) - {crop.category}
                </option>
              ))}
            </select>
          </div>

          {/* Pre-Analysis Guidance */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HelpCircle size={18} color="#16A34A" />
            <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 500 }}>
              {language === 'hi' 
                ? 'साफ और अच्छी रोशनी वाली पत्ती की फोटो लें।' 
                : 'Take a clear and well-lit photo of the affected leaf.'}
            </span>
          </div>

          {/* Image Upload Area */}
          {!selectedImage ? (
            <div
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={28} color="#475569" />
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#1E293B' }}>
                  {language === 'hi' ? 'पत्ती का फोटो अपलोड करें या खींचें' : 'Upload or capture leaf photo'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  JPG, PNG, WebP (धुंधली या बिना पत्ती वाली फोटो खारिज हो जाएगी)
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  <Upload size={18} />
                  <span>{language === 'hi' ? 'गैलरी से चुनें' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                  <Camera size={18} />
                  <span>{language === 'hi' ? 'कैमरा खोलें' : 'Take Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #CBD5E1', maxHeight: '280px', background: '#000' }}>
                <img
                  src={selectedImage}
                  alt="Captured leaf"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <RefreshCw size={16} />
                  <span>{language === 'hi' ? 'फोटो बदलें (Retake)' : 'Retake'}</span>
                </button>

                <button
                  onClick={handleSimulateAnalysis}
                  className="btn btn-primary"
                  disabled={isSimulating}
                  style={{ flex: 2 }}
                >
                  <Sparkles size={18} />
                  <span>
                    {isSimulating
                      ? (language === 'hi' ? 'विश्लेषण जारी है...' : 'Analyzing...')
                      : (language === 'hi' ? 'AI जांच शुरू करें' : 'Analyze Leaf')}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Diagnostic Result Shell connected to Knowledge Base */}
        <div>
          {!showResult || !primaryDisease ? (
            <div 
              className="card" 
              style={{
                border: '1px dashed #CBD5E1',
                background: '#F8FAFC',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                color: '#64748B'
              }}
            >
              <Stethoscope size={40} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '0.5rem' }}>
                {language === 'hi' ? 'निदान परिणाम यहां प्रदर्शित होगा' : 'Diagnostic Result Will Appear Here'}
              </h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto' }}>
                {language === 'hi'
                  ? 'बाईं ओर फोटो अपलोड करने के बाद "AI जांच शुरू करें" पर क्लिक करें।'
                  : 'Upload a leaf photo and click "Analyze Leaf" to inspect structured symptoms from knowledge base.'}
              </p>
            </div>
          ) : (
            <div className="card" style={{ border: '2px solid #1E5631' }}>
              {/* Demo Result Banner */}
              <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', padding: '0.6rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400E' }}>
                  Demo Result — AI model not connected yet (Structured KB Connected)
                </span>
                <span className="badge badge-demo">PHASE 1B</span>
              </div>

              {/* Header: Disease Name & Confidence Tier */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', color: '#12372A', lineHeight: 1.2 }}>
                    {language === 'hi' ? primaryDisease.disease_name_hi : primaryDisease.disease_name_en}
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                    {primaryDisease.pathogen ? `Pathogen: ${primaryDisease.pathogen} • ` : ''}Category: {primaryDisease.category}
                  </span>
                </div>

                {/* Categorical Confidence Tier */}
                <span className="badge badge-verified" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                  Confidence Tier: HIGH
                </span>
              </div>

              {/* Observed Symptoms Checklist from Verified Knowledge Base */}
              <div style={{ margin: '1rem 0', padding: '0.85rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1E293B' }}>
                  {language === 'hi' ? 'अवलोकित लक्षण (Observed Symptoms Checklist):' : 'Observed Symptoms Checklist:'}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {(language === 'hi' ? primaryDisease.symptoms_hi : primaryDisease.symptoms_en).map((sym, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
                      <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Differential Diagnosis Note */}
              {primaryDisease.differential_diagnosis && (
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#475569', background: '#FFFBEB', padding: '0.75rem', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                  <strong>विभेदक निदान (Differential Check):</strong> {primaryDisease.differential_diagnosis}
                </div>
              )}

              {/* Verified Management Options */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#12372A' }}>
                  {language === 'hi' ? 'सत्यापित प्रबंधन अनुशंसाएं (Verified Management):' : 'Verified Management:'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {primaryDisease.cultural_management.length > 0 && (
                    <div style={{ padding: '0.65rem', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                      <strong>सस्य व जैविक प्रबंधन (Cultural & Organic IPM):</strong>
                      <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                        {primaryDisease.cultural_management.map((cm, idx) => (
                          <li key={idx}>{cm}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {registeredChemicals.length > 0 && (
                    <div style={{ padding: '0.65rem', background: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                      <strong>CIB&RC पंजीकृत रासायनिक विकल्प (CIB&RC Registered Chemical):</strong>
                      {registeredChemicals.map((chem) => (
                        <div key={chem.chemical_id} style={{ marginTop: '0.25rem' }}>
                          <div>• {chem.active_ingredient} ({chem.formulation}) @ {chem.dosage.per_acre} ({chem.dilution})</div>
                          <div style={{ fontSize: '0.75rem', color: '#475569' }}>प्रतीक्षा अवधि (PHI): {chem.phi_waiting_period_days} दिन • {chem.safety_precautions[0]}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* KVK Referral Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', padding: '0.75rem', background: '#F1F5F9', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#334155' }}>
                  संदेह या कम आत्मविश्वास की स्थिति में:
                </span>
                <button
                  onClick={() => onSelectTab('kvk-connect')}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.75rem', minHeight: '36px', fontSize: '0.82rem' }}
                >
                  <PhoneCall size={14} />
                  <span>KVK विशेषज्ञ से संपर्क करें</span>
                </button>
              </div>

              {/* Dedicated Research Source Panel Component */}
              <ResearchSourcePanel sourceRecord={sourceRecord} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
