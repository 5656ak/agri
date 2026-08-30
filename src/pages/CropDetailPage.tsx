import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Droplets,
  FlaskConical,
  Bug,
  CloudSun,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { dataStore } from '../services/dataStore';
import { getTranslation } from '../i18n/translations';

interface CropDetailPageProps {
  cropId: string;
  onBack: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const CropDetailPage: React.FC<CropDetailPageProps> = ({
  cropId,
  onBack,
  onSelectTab,
  language
}) => {
  const crop = dataStore.getFarmerCropById(cropId);
  const weather = dataStore.getWeather();
  const stages = dataStore.getCropStages(crop?.cropId);
  const pests = dataStore.getPestDiseases(crop?.cropId);
  const mandi = dataStore.getMandiPrices().find((m) => m.cropId === crop?.cropId);

  const [activeSubTab, setActiveSubTab] = useState<'advice' | 'irrigation' | 'fertilizer' | 'pests' | 'activities' | 'market'>('advice');

  if (!crop) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <h2>फसल नहीं मिली</h2>
        <button onClick={onBack} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          वापस जाएं
        </button>
      </div>
    );
  }

  const currentStage = stages.find((s) => s.stageNumber === crop.currentStageNumber) || stages[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#1E5631', fontWeight: 700, textTransform: 'uppercase' }}>
            फसल विवरण (Crop Details)
          </span>
          <h1 style={{ fontSize: '1.4rem', color: '#12372A', lineHeight: 1.2 }}>
            🌾 {crop.variety} ({crop.areaAcres} एकड़)
          </h1>
        </div>
      </div>

      {/* Crop Overview Summary Header Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1E5631 0%, #2D6A4F 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#86EFAC', textTransform: 'uppercase', fontWeight: 600 }}>खेत (Field)</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>{crop.fieldName}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#86EFAC', textTransform: 'uppercase', fontWeight: 600 }}>बुवाई (Sowing)</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>{crop.sowingDate} ({crop.calculatedAgeDays} दिन)</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#86EFAC', textTransform: 'uppercase', fontWeight: 600 }}>मृदा (Soil)</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>{crop.soilType}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#86EFAC', textTransform: 'uppercase', fontWeight: 600 }}>सिंचाई विधि</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>{crop.irrigationType}</p>
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#A7F3D0', fontWeight: 700 }}>वर्तमान विकास अवस्था:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, marginLeft: '0.4rem' }}>{crop.currentStageName}</span>
          </div>
          <span className="badge badge-verified">🟢 स्वस्थ व सामान्य</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
        {[
          { id: 'advice', label: '🌱 आज की सलाह' },
          { id: 'irrigation', label: '💧 सिंचाई गाइड' },
          { id: 'fertilizer', label: '🌿 खाद व पोषण' },
          { id: 'pests', label: '🐛 रोग व कीट' },
          { id: 'activities', label: '📅 कार्य सूची' },
          { id: 'market', label: '💰 मंडी भाव' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className="btn btn-sm"
            style={{
              borderRadius: '9999px',
              background: activeSubTab === tab.id ? '#1E5631' : '#FFFFFF',
              color: activeSubTab === tab.id ? '#FFFFFF' : '#374151',
              border: activeSubTab === tab.id ? '1px solid #1E5631' : '1px solid #E5E7EB',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content 1: Today's Advice */}
      {activeSubTab === 'advice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#166534', marginBottom: '0.4rem', fontWeight: 700 }}>
              आज की मुख्य कृषि सिफारिश (Primary Directive):
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#14532D', lineHeight: 1.5 }}>
              {weather.rainProbabilityPercent >= 50
                ? '🌧️ आज बारिश की संभावना के कारण खेत में कोई रासायनिक छिड़काव या सिंचाई न करें। नालियों की सफाई रखें।'
                : '☀️ खेत में 3-4 सेमी पानी का स्तर बनाए रखें और कल्ले फूटने के लिए पहली निराई पूरी करें।'}
            </p>
          </div>

          {currentStage && (
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', color: '#12372A', marginBottom: '0.75rem' }}>
                वर्तमान अवस्था दिशा-निर्देश ({currentStage.stageNameHi}):
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
                <div style={{ padding: '0.75rem', background: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <strong>💧 सिंचाई निर्देश:</strong> {currentStage.irrigationGuidanceHi}
                </div>
                <div style={{ padding: '0.75rem', background: '#FEF3C7', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                  <strong>🌿 खाद व पोषण:</strong> {currentStage.fertilizerGuidanceHi}
                </div>
                <div style={{ padding: '0.75rem', background: '#FEE2E2', borderRadius: '8px', border: '1px solid #FECACA' }}>
                  <strong>🐛 कीट निगरानी:</strong> {currentStage.pestScoutingHi}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Irrigation */}
      {activeSubTab === 'irrigation' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>सिंचाई स्थिति व शेड्यूल</h3>
            <span className="badge badge-verified">
              {weather.rainProbabilityPercent >= 50 ? '🟢 आज आवश्यकता नहीं' : '🟡 शीघ्र आवश्यक'}
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.5 }}>
            {weather.rainProbabilityPercent >= 50
              ? 'अगले 24 घंटे में प्राकृतिक वर्षा होने की 65% संभावना है। पानी और ईंधन की बचत करें।'
              : 'कल्ले फूटने के इस संवेदनशील समय में खेत सूखने न दें। कल प्रातः काल हल्की सिंचाई करें।'}
          </p>

          <button onClick={() => onSelectTab('irrigation')} className="btn btn-outline">
            <span>विस्तृत सिंचाई सलाहकार खोलें &rarr;</span>
          </button>
        </div>
      )}

      {/* Tab Content 3: Fertilizer */}
      {activeSubTab === 'fertilizer' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>संतुलित पोषण व STCR गणना</h3>
          <p style={{ fontSize: '0.88rem', color: '#4B5563' }}>
            {crop.areaAcres} एकड़ खेत हेतु ICAR-IISS प्रमाणित पोषक तत्व योजना:
          </p>

          <div style={{ background: '#F8FAF7', padding: '1rem', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <div style={{ fontWeight: 700, color: '#1E5631', marginBottom: '0.4rem' }}>
              वर्तमान अवस्था की सिफारिश (1st Top-Dress):
            </div>
            <p style={{ fontSize: '0.85rem', color: '#1F2937' }}>
              • यूरिया (Urea - 46% N): <strong>{Math.round(crop.areaAcres * 35)} kg</strong> (लगभग {(crop.areaAcres * 0.7).toFixed(1)} बोरी)
            </p>
            <p style={{ fontSize: '0.85rem', color: '#1F2937', marginTop: '0.25rem' }}>
              • प्रयोग समय: पहली निराई-गुड़ाई के बाद, हल्की नमी होने पर।
            </p>
          </div>

          <button onClick={() => onSelectTab('fertilizer')} className="btn btn-primary">
            <span>STCR खाद कैलकुलेटर खोलें</span>
          </button>
        </div>
      )}

      {/* Tab Content 4: Pest & Disease */}
      {activeSubTab === 'pests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pests.map((p) => (
            <div key={p.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#12372A', fontWeight: 700 }}>
                  {language === 'hi' ? p.problemNameHi : p.problemNameEn}
                </h4>
                <span className="badge badge-critical">{p.severity}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '0.5rem' }}>
                <strong>प्रमुख लक्षण:</strong> {p.symptomsHi[0]}
              </p>
              <div style={{ background: '#F0FDF4', padding: '0.65rem', borderRadius: '8px', fontSize: '0.82rem', color: '#166534' }}>
                <strong>नियंत्रण:</strong> {p.chemicalGuidanceHi}
              </div>
            </div>
          ))}

          <button onClick={() => onSelectTab('pests')} className="btn btn-outline">
            <span>सम्पूर्ण कीट व रोग डायरेक्टरी देखें &rarr;</span>
          </button>
        </div>
      )}

      {/* Tab Content 5: Activities */}
      {activeSubTab === 'activities' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>फसल कार्य सूची (Checklist)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'act-1', text: 'बुवाई पूर्व बीज शोधन (कार्बेन्डाजिम 2g/kg)', done: true },
              { id: 'act-2', text: 'रोपाई के समय बेसल DAP व MOP का प्रयोग', done: true },
              { id: 'act-3', text: 'पहली निराई-गुड़ाई एवं खरपतवार नियंत्रण', done: true },
              { id: 'act-4', text: 'पहली यूरिया टॉप-ड्रेसिंग (35 kg/एकड़)', done: false },
              { id: 'act-5', text: 'तना छेदक निगरानी फेरोमोन ट्रैप लगाना', done: false }
            ].map((task) => (
              <div
                key={task.id}
                onClick={() => dataStore.toggleCropActivity(crop.id, task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  background: task.done ? '#F0FDF4' : '#F9FAFB',
                  border: task.done ? '1px solid #BBF7D0' : '1px solid #E5E7EB',
                  cursor: 'pointer'
                }}
              >
                <CheckCircle2 size={18} color={task.done ? '#16A34A' : '#9CA3AF'} />
                <span style={{ fontSize: '0.85rem', color: task.done ? '#166534' : '#374151', textDecoration: task.done ? 'line-through' : 'none' }}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 6: Market */}
      {activeSubTab === 'market' && mandi && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>{mandi.cropNameHi} मंडी भाव</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAF7', borderRadius: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{mandi.mandiName}</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E5631' }}>
                ₹{mandi.modalPricePerQuintal} / क्विंटल
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803D' }}>
              ▲ +{mandi.priceDeltaPercent}% इस सप्ताह
            </span>
          </div>

          <button onClick={() => onSelectTab('market')} className="btn btn-outline">
            <span>सभी मंडियों के भाव देखें &rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
};
