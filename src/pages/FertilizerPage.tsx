import React, { useState } from 'react';
import {
  FlaskConical,
  AlertCircle,
  Calculator,
  ShieldAlert,
  CheckCircle2,
  PhoneCall,
  Info,
  ChevronRight,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { cropService } from '../services/agriculture/cropService';
import { fertilizerService, FertilizerRecommendationResult } from '../services/agriculture/fertilizerService';
import { ResearchSourcePanel } from '../components/common/ResearchSourcePanel';

interface FertilizerPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const FertilizerPage: React.FC<FertilizerPageProps> = ({ onSelectTab, language }) => {
  const crops = cropService.getAllCrops();

  // Form State
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [state, setState] = useState('Haryana');
  const [district, setDistrict] = useState('Karnal');
  const [soilType, setSoilType] = useState('Alluvial Sandy Loam / Loam');
  const [areaAcres, setAreaAcres] = useState<number>(2.5);
  const [stage, setStage] = useState('first_topdress');
  const [targetYield, setTargetYield] = useState<number>(55);
  
  // Soil Health Card Test Values (kg/ha)
  const [soilN, setSoilN] = useState<number>(180);
  const [soilP, setSoilP] = useState<number>(16);
  const [soilK, setSoilK] = useState<number>(190);
  const [soilPh, setSoilPh] = useState<number>(7.4);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FertilizerRecommendationResult | null>(null);
  const [showTraceability, setShowTraceability] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Deterministic instant computation with slight tactile UI delay
    setTimeout(() => {
      const res = fertilizerService.calculateFertilizerRecommendation({
        crop_id: selectedCrop,
        state: state,
        region: district,
        soil_type: soilType,
        area_acres: areaAcres,
        growth_stage: stage,
        target_yield_q_ha: targetYield,
        soil_N_kg_ha: soilN,
        soil_P_kg_ha: soilP,
        soil_K_kg_ha: soilK,
        soil_pH: soilPh
      });
      setResult(res);
      setIsLoading(false);
    }, 400);
  };

  const selectedCropDetails = cropService.getCropById(selectedCrop);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="section-header">
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{language === 'hi' ? 'वैज्ञानिक खाद व पोषण सलाहकार' : 'Deterministic STCR Fertilizer Advisor'}</span>
          <span className="badge badge-verified">ICAR-IISS STCR ENGINE</span>
        </h1>
        <p className="section-subtitle">
          {language === 'hi'
            ? 'मृदा स्वास्थ्य कार्ड एवं ICAR-IISS STCR मॉडल आधारित संतुलित व पारदर्शी पोषण गणना'
            : 'Deterministic target yield fertilizer modeling grounded strictly in ICAR-IISS research'}
        </p>
      </div>

      {/* Mandatory Fundamental Rule Banner */}
      <div 
        className="card" 
        style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderLeft: '5px solid #D97706',
          padding: '1rem',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'flex-start'
        }}
      >
        <AlertCircle size={22} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h3 style={{ fontSize: '0.95rem', color: '#92400E', marginBottom: '0.25rem', fontWeight: 700 }}>
            {language === 'hi' ? 'वैज्ञानिक पोषण का मूल सिद्धांत (Fundamental Science Directive):' : 'Scientific Nutrition Directive:'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#78350F', lineHeight: 1.5 }}>
            {language === 'hi'
              ? 'खाद की मात्रा केवल फसल की फोटो देखकर निर्धारित नहीं की जाती। सिफारिश मिट्टी जांच, फसल, क्षेत्र, लक्ष्य उपज और फसल अवस्था पर आधारित होगी।'
              : 'Fertilizer quantities are never determined from a crop photo alone. Recommendations are strictly computed using soil-test values, crop, agro-climatic region, target yield, and growth stage.'}
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="grid-responsive two-col" style={{ gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: 7-Step Input Form */}
        <form onSubmit={handleCalculate} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', color: '#12372A' }}>
              {language === 'hi' ? 'खेत व मृदा परीक्षण इनपुट' : 'Farm & Soil Test Parameters'}
            </h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
              Deterministic Math Model
            </span>
          </div>

          {/* STEP 1: Select Crop */}
          <div className="form-group">
            <label className="form-label" htmlFor="fert-crop">
              <span>चरण 1: फसल चुनें (Step 1: Select Crop)</span>
              <span style={{ fontSize: '0.75rem', color: '#1E5631', fontWeight: 600 }}>
                {selectedCropDetails?.season} • {selectedCropDetails?.category}
              </span>
            </label>
            <select
              id="fert-crop"
              className="form-control"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              {crops.map((c) => (
                <option key={c.crop_id} value={c.crop_id}>
                  {c.name_hi} ({c.name_en}) {c.crop_id === 'wheat' || c.crop_id === 'rice' || c.crop_id === 'mustard' ? '✓ Verified STCR' : '• Verification Pending'}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 2: State & Soil Type */}
          <div className="form-row two-col">
            <div className="form-group">
              <label className="form-label" htmlFor="fert-state">
                <span>चरण 2: राज्य (State)</span>
              </label>
              <select
                id="fert-state"
                className="form-control"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="Haryana">हरियाणा (Haryana) [Verified STCR]</option>
                <option value="Punjab">पंजाब (Punjab) [Verified STCR]</option>
                <option value="Western Uttar Pradesh">पश्चिमी उत्तर प्रदेश (Western UP) [Verified STCR]</option>
                <option value="Rajasthan">राजस्थान (Rajasthan) [Verified Mustard]</option>
                <option value="Madhya Pradesh">मध्य प्रदेश (Madhya Pradesh)</option>
                <option value="Bihar">बिहार (Bihar)</option>
                <option value="Maharashtra">महाराष्ट्र (Maharashtra)</option>
                <option value="Kerala">केरल (Kerala) [Test Block Unverified]</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fert-soil-type">
                <span>मृदा प्रकार (Soil Type)</span>
              </label>
              <select
                id="fert-soil-type"
                className="form-control"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              >
                <option value="Alluvial Sandy Loam / Loam">जलोढ़ बलुई दोमट (Alluvial Loam)</option>
                <option value="Alluvial Clay Loam">जलोढ़ मटियारी दोमट (Clay Loam)</option>
                <option value="Light Alluvial Sandy Loam">हल्की बलुई दोमट (Light Sandy Loam)</option>
                <option value="Medium Black Clay (Vertisols)">काली मिट्टी (Black Soil)</option>
              </select>
            </div>
          </div>

          {/* STEP 3 & STEP 4: Cultivated Area & Growth Stage */}
          <div className="form-row two-col">
            <div className="form-group">
              <label className="form-label" htmlFor="fert-area">
                <span>चरण 3: रकबा एकड़ में (Area in Acres)</span>
              </label>
              <input
                id="fert-area"
                type="number"
                step="0.25"
                min="0.1"
                max="100"
                className="form-control"
                value={areaAcres}
                onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fert-stage">
                <span>चरण 4: फसल अवस्था (Growth Stage)</span>
              </label>
              <select
                id="fert-stage"
                className="form-control"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option value="basal">1. बुवाई के समय (Basal Application)</option>
                <option value="first_topdress">2. कल्ले फूटना / CRI (1st Top-Dress)</option>
                <option value="second_topdress">3. बाली / फूल निकलना (2nd Top-Dress)</option>
              </select>
            </div>
          </div>

          {/* STEP 5: Target Yield */}
          <div className="form-group">
            <label className="form-label" htmlFor="fert-yield">
              <span>चरण 5: लक्ष्य उपज (Step 5: Target Yield in Q/ha)</span>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                (गेहूं मानक रेंज: 40 - 65 Q/ha)
              </span>
            </label>
            <input
              id="fert-yield"
              type="number"
              className="form-control"
              value={targetYield}
              onChange={(e) => setTargetYield(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* STEP 6: Soil Test Values */}
          <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '0.92rem', color: '#1E293B', marginBottom: '0.6rem', fontWeight: 700 }}>
              चरण 6: मृदा स्वास्थ्य कार्ड मान (Step 6: Soil Health Card Test Values)
            </h3>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label" htmlFor="fert-n" style={{ fontSize: '0.82rem' }}>
                  <span>नाइट्रोजन N (kg/ha)</span>
                </label>
                <input
                  id="fert-n"
                  type="number"
                  className="form-control"
                  value={soilN}
                  onChange={(e) => setSoilN(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fert-p" style={{ fontSize: '0.82rem' }}>
                  <span>फास्फोरस P (kg/ha)</span>
                </label>
                <input
                  id="fert-p"
                  type="number"
                  className="form-control"
                  value={soilP}
                  onChange={(e) => setSoilP(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="fert-k" style={{ fontSize: '0.82rem' }}>
                  <span>पोटाश K (kg/ha)</span>
                </label>
                <input
                  id="fert-k"
                  type="number"
                  className="form-control"
                  value={soilK}
                  onChange={(e) => setSoilK(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="fert-ph" style={{ fontSize: '0.82rem' }}>
                  <span>मिट्टी का pH मान</span>
                </label>
                <input
                  id="fert-ph"
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={soilPh}
                  onChange={(e) => setSoilPh(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* STEP 7: Calculate Button */}
          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-lg" 
            disabled={isLoading}
            style={{ marginTop: '0.25rem' }}
          >
            <Calculator size={20} />
            <span>
              {isLoading
                ? (language === 'hi' ? 'सत्यापन व गणना जारी है...' : 'Verifying & Computing...')
                : (language === 'hi' ? 'चरण 7: STCR संतुलित खाद गणना करें' : 'Step 7: Compute STCR Fertilizer Plan')}
            </span>
          </button>
        </form>

        {/* Right Column: Output Screen */}
        <div>
          {!result ? (
            <div 
              className="card" 
              style={{
                border: '1px dashed #CBD5E1',
                background: '#F8FAFC',
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                color: '#64748B'
              }}
            >
              <FlaskConical size={44} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#334155', marginBottom: '0.5rem' }}>
                {language === 'hi' ? 'सत्यापित खाद सिफारिश परिणाम' : 'Verified Recommendation Output'}
              </h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto', lineHeight: 1.5 }}>
                {language === 'hi'
                  ? 'बाईं ओर मिट्टी परीक्षण के मान दर्ज करें और "गणना करें" पर क्लिक करें। यदि डेटा सत्यापित नहीं है, तो सुरक्षा गेट स्वचालित रूप से सलाह को रोक देगा।'
                  : 'Enter soil test card readings and click calculate. Unverified combinations are strictly blocked by safety gates.'}
              </p>
            </div>
          ) : result.status === 'VERIFICATION_REQUIRED' ? (
            /* Safety Block: Unverified STCR / Missing Region / Out-of-bounds */
            <div className="card" style={{ border: '2px solid #DC2626', background: '#FFF5F5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <ShieldAlert size={26} color="#DC2626" />
                <h3 style={{ fontSize: '1.15rem', color: '#991B1B', fontWeight: 800 }}>
                  {language === 'hi' ? 'सत्यापित सिफारिश अनुपलब्ध (Verification Required)' : 'Verified Recommendation Unavailable'}
                </h3>
              </div>

              <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', color: '#991B1B', fontSize: '0.9rem', lineHeight: 1.5 }}>
                <strong>{result.message}</strong>
              </div>

              {result.missing_requirements && result.missing_requirements.length > 0 && (
                <div style={{ marginBottom: '1rem', background: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid #FECACA' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#7F1D1D', marginBottom: '0.4rem', fontWeight: 700 }}>
                    सुरक्षा सत्यापन रिपोर्ट (Verification Gating Reasons):
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#991B1B', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {result.missing_requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '1rem', lineHeight: 1.5 }}>
                {language === 'hi'
                  ? 'कृषि विज्ञान AI किसी भी अप्रमाणित या गैर-सत्यापित परिस्थिति में कृत्रिम खाद की मात्रा नहीं बनाता। सटीक खुराक के लिए अपने जिले के कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
                  : 'KrishiVigyan AI enforces zero-hallucination policies and never invents unverified fertilizer dosages. Please consult your nearest KVK scientist.'}
              </p>

              <button
                onClick={() => onSelectTab('expert')}
                className="btn btn-primary btn-block"
                style={{ background: '#DC2626', border: 'none' }}
              >
                <PhoneCall size={18} />
                <span>{language === 'hi' ? 'नजदीकी KVK वैज्ञानिक से संपर्क करें' : 'Connect to Nearest KVK'}</span>
              </button>

            </div>
          ) : (
            /* Verified STCR Mathematical Output */
            <div className="card" style={{ border: '2px solid #1E5631' }}>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                <span className="badge badge-verified">
                  ✓ VERIFIED ICAR-IISS STCR CALCULATION
                </span>
                <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 600, fontFamily: 'monospace' }}>
                  {result.equation_used?.id}
                </span>
              </div>

              {/* A. Pure Nutrient Requirement (kg/ha) */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  A. शुद्ध पोषक तत्व आवश्यकता (Pure Nutrients per Hectare)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.35rem', textAlign: 'center' }}>
                  <div style={{ background: '#F8FAFC', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
                      {result.total_crop_requirement_kg_ha?.N}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>N (kg/ha)</span>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
                      {result.total_crop_requirement_kg_ha?.P2O5}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>P₂O₅ (kg/ha)</span>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
                      {result.total_crop_requirement_kg_ha?.K2O}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>K₂O (kg/ha)</span>
                  </div>
                </div>
              </div>

              {/* B. Current Stage Recommended Application */}
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  B. वर्तमान अवस्था खुराक ({result.current_stage_dose?.stage_name})
                </span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', margin: '0.65rem 0', textAlign: 'center' }}>
                  <div style={{ background: '#FFFFFF', padding: '0.5rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#14532D' }}>
                      {result.current_stage_dose?.urea_bags}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#166534' }}>बोरी यूरिया (50kg)</span>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '0.5rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#14532D' }}>
                      {result.current_stage_dose?.dap_bags}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#166534' }}>बोरी DAP (50kg)</span>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '0.5rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#14532D' }}>
                      {result.current_stage_dose?.mop_bags}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#166534' }}>बोरी MOP (50kg)</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#14532D', margin: 0, lineHeight: 1.4 }}>
                  <strong>प्रयोग विधि:</strong> {result.current_stage_dose?.instructions}
                </p>
              </div>

              {/* C. Farmer Cultivated Area Conversion */}
              <div style={{ marginBottom: '1rem', background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  C. किसान के खेत का सम्पूर्ण रकबा ({areaAcres} एकड़) कुल मांग
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: '#334155', marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>कुल यूरिया (Urea - 46% N):</span>
                    <strong>{result.field_total_bags?.urea_50kg_bags} बोरी ({result.field_total_bags?.urea_kg} kg)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>कुल डी.ए.पी (DAP - 18:46:0):</span>
                    <strong>{result.field_total_bags?.dap_50kg_bags} बोरी ({result.field_total_bags?.dap_kg} kg)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>कुल पोटाश (MOP - 60% K2O):</span>
                    <strong>{result.field_total_bags?.mop_50kg_bags} बोरी ({result.field_total_bags?.mop_kg} kg)</strong>
                  </div>
                </div>
              </div>

              {/* D. Calculation Explanation / Traceability Breakdown Toggle */}
              <div style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowTraceability(!showTraceability)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Layers size={16} color="#1E5631" />
                    <strong>गणितीय गणना का चरणबद्ध विवरण (Traceability Breakdown)</strong>
                  </span>
                  <ChevronRight size={16} style={{ transform: showTraceability ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {showTraceability && result.traceability_breakdown && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    {result.traceability_breakdown.map((step) => (
                      <div key={step.step_number} style={{ fontSize: '0.82rem', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.4rem' }}>
                        <div style={{ fontWeight: 700, color: '#12372A' }}>
                          चरण {step.step_number}: {step.title}
                        </div>
                        <p style={{ color: '#475569', margin: '0.15rem 0' }}>{step.description}</p>
                        {step.formula_applied && (
                          <div style={{ fontFamily: 'monospace', background: '#E2E8F0', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', color: '#0F172A' }}>
                            {step.formula_applied}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Micronutrient Advice */}
              {result.micronutrient_advice && (
                <div style={{ padding: '0.75rem', background: '#FEF3C7', borderRadius: '8px', border: '1px solid #FDE68A', marginBottom: '1rem', fontSize: '0.82rem', color: '#78350F' }}>
                  <strong>सूक्ष्म पोषक तत्व (Micronutrient Guidance):</strong> {result.micronutrient_advice}
                </div>
              )}

              {/* F. Safety Notice */}
              <div style={{ padding: '0.6rem 0.85rem', background: '#F1F5F9', borderRadius: '8px', fontSize: '0.82rem', color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span>{result.safety_notice || 'यह सलाह मिट्टी जांच और सत्यापित STCR डेटा पर आधारित है।'}</span>
              </div>

              {/* E. Research Source Panel Component */}
              {result.equation_used?.source && (
                <ResearchSourcePanel sourceRecord={result.equation_used.source} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
