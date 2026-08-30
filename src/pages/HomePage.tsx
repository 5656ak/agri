import React from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Sparkles,
  Camera,
  Compass,
  FileText,
  Calendar,
  Wallet,
  TrendingUp,
  Landmark,
  ArrowRight,
  Plus,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Volume2
} from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { dataStore } from '../services/dataStore';
import { recommendationEngine } from '../services/recommendationEngine';
import { getTranslation } from '../i18n/translations';

interface HomePageProps {
  onSelectTab: (tab: NavigationTab) => void;
  onOpenCropDetail: (cropId: string) => void;
  onOpenAddCrop: () => void;
  onOpenVoiceAssistant: () => void;
  language: Language;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTab,
  onOpenCropDetail,
  onOpenAddCrop,
  onOpenVoiceAssistant,
  language
}) => {
  const farmer = dataStore.getFarmerProfile();
  const farmerCrops = dataStore.getFarmerCrops();
  const weather = dataStore.getWeather();
  const mandiPrices = dataStore.getMandiPrices();

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const eligibleSchemes = dataStore.getEligibleSchemesForFarmer();
  const recommendations = recommendationEngine.getTodayRecommendations(language);
  const t = getTranslation(language);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Greeting & Hero Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#12372A', fontWeight: 800 }}>
            {language === 'hi' ? `नमस्ते, ${farmer.name.split(' ')[0]} 👋` : `Namaste, ${farmer.name.split(' ')[0]} 👋`}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#4B5563' }}>
            📍 {farmer.location.formattedAddress} • {farmer.totalLandAcres} एकड़ खेत
          </p>
        </div>

        <button
          onClick={onOpenVoiceAssistant}
          className="btn btn-primary"
          style={{ borderRadius: '9999px', background: 'linear-gradient(135deg, #1E5631 0%, #2D6A4F 100%)', boxShadow: '0 4px 12px rgba(30, 86, 49, 0.25)' }}
        >
          <Sparkles size={18} color="#86EFAC" />
          <span>{t.askVoice}</span>
        </button>
      </div>

      {/* 2. Weather Card with Action Directive */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1E5631 0%, #12372A 100%)',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                {weather.temperatureC}°C
              </span>
              <span style={{ fontSize: '1rem', color: '#86EFAC', fontWeight: 600 }}>
                {language === 'hi' ? weather.conditionHi : weather.conditionEn}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.85rem', color: '#E2E8F0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Droplets size={16} color="#60A5FA" />
                <span>बारिश: {weather.rainProbabilityPercent}%</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Wind size={16} color="#A7F3D0" />
                <span>हवा: {weather.windSpeedKmh} km/h</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('weather')}
            className="btn btn-sm"
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(4px)' }}
          >
            <span>7-दिन का पूर्वानुमान</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Action Directive Callout */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.6rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🌧️</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F0FDF4' }}>
              {language === 'hi' ? weather.farmingDirectiveHi : weather.farmingDirectiveEn}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => handleSpeak(language === 'hi' ? weather.farmingDirectiveHi : weather.farmingDirectiveEn, e)}
            className="btn btn-sm"
            style={{ minHeight: '32px', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: 'none', borderRadius: '6px' }}
            title="सुनें (Audio Speech)"
          >
            <Volume2 size={16} />
          </button>
        </div>
      </div>

      {/* 3. 🌱 TODAY'S FARMING ADVICE ("Aaj Aapke Khet Mein") */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#12372A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{language === 'hi' ? '🌱 आज आपके खेत में' : "🌱 Today in Your Field"}</span>
              <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                AI + ICAR DIRECTIVES
              </span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
              {t.todayAdviceSubtitle}
            </p>
          </div>
        </div>

        <div className="grid-responsive two-col" style={{ gap: '0.85rem' }}>
          {recommendations.map((rec) => {
            const isCritical = rec.severity === 'CRITICAL';
            const isWarning = rec.severity === 'WARNING';
            const isSuccess = rec.severity === 'SUCCESS';

            const borderColor = isCritical ? '#FCA5A5' : isWarning ? '#FDE68A' : isSuccess ? '#BBF7D0' : '#BFDBFE';
            const bgColor = isCritical ? '#FFF5F5' : isWarning ? '#FFFBEB' : isSuccess ? '#F0FDF4' : '#EFF6FF';
            const speechText = `${language === 'hi' ? rec.titleHi : rec.titleEn}. ${language === 'hi' ? rec.actionTextHi : rec.actionTextEn}. कारण: ${language === 'hi' ? rec.reasonHi : rec.reasonEn}`;

            return (
              <div
                key={rec.id}
                className="card card-clickable"
                onClick={() => rec.targetTab && onSelectTab(rec.targetTab)}
                style={{
                  border: `1.5px solid ${borderColor}`,
                  background: bgColor,
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.6rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#12372A', fontWeight: 700 }}>
                      {language === 'hi' ? rec.titleHi : rec.titleEn}
                    </h3>
                    <span
                      className={`badge ${isCritical ? 'badge-critical' : isWarning ? 'badge-warning' : isSuccess ? 'badge-verified' : 'badge-info'}`}
                    >
                      {rec.type}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#1F2937', fontWeight: 600, lineHeight: 1.4 }}>
                    {language === 'hi' ? rec.actionTextHi : rec.actionTextEn}
                  </p>

                  <p style={{ fontSize: '0.78rem', color: '#4B5563', marginTop: '0.35rem' }}>
                    💡 <strong>कारण:</strong> {language === 'hi' ? rec.reasonHi : rec.reasonEn}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem', borderTop: '1px dashed rgba(0,0,0,0.08)' }}>
                  <button
                    type="button"
                    onClick={(e) => handleSpeak(speechText, e)}
                    className="btn btn-sm"
                    style={{ minHeight: '30px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', background: '#FFFFFF', color: '#1E5631', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                    title="बोलकर सुनाएं"
                  >
                    <Volume2 size={14} />
                    <span>सुनें (Audio)</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1E5631', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span>विस्तार से देखें</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* 4. 🌾 MY CROPS SECTION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#12372A' }}>{t.myCropsTitle}</h2>
          <button
            onClick={onOpenAddCrop}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '9999px' }}
          >
            <Plus size={16} />
            <span>{t.addCrop}</span>
          </button>
        </div>

        {farmerCrops.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p style={{ color: '#6B7280', marginBottom: '1rem' }}>{t.noCropsDesc}</p>
            <button onClick={onOpenAddCrop} className="btn btn-primary">
              <Plus size={16} />
              <span>{t.addCrop}</span>
            </button>
          </div>
        ) : (
          <div className="grid-responsive three-col" style={{ gap: '1rem' }}>
            {farmerCrops.map((crop) => (
              <div
                key={crop.id}
                className="card card-clickable"
                onClick={() => onOpenCropDetail(crop.id)}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="badge badge-verified">
                      {crop.healthStatus === 'HEALTHY' ? '🟢 उत्तम व स्वस्थ' : '🟡 निगरानी जरूरी'}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E5631' }}>
                      {crop.areaAcres} एकड़
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: '#12372A', marginBottom: '0.2rem' }}>
                    {crop.variety}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {crop.fieldName} • {crop.calculatedAgeDays} दिन की फसल
                  </p>

                  <div style={{ marginTop: '0.65rem', background: '#F8FAF7', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E5631', textTransform: 'uppercase' }}>
                      वर्तमान अवस्था:
                    </span>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F2937', marginTop: '2px' }}>
                      {crop.currentStageName}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 600 }}>
                    सलाह व खाद योजना
                  </span>
                  <ChevronRight size={16} color="#2563EB" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. ⚡ QUICK ACTIONS (Large Touch Targets) */}
      <div>
        <h2 style={{ fontSize: '1.2rem', color: '#12372A', marginBottom: '0.75rem' }}>
          {t.quickActionsTitle}
        </h2>

        <div className="grid-responsive four-col" style={{ gap: '0.85rem' }}>
          <button
            onClick={() => onSelectTab('scan')}
            className="card card-clickable"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem', padding: '1.1rem', border: '1.5px solid #86EFAC', background: '#F0FDF4' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1E5631', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={24} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#12372A' }}>
              {t.qaScan}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('irrigation')}
            className="card card-clickable"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem', padding: '1.1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={24} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#12372A' }}>
              {t.qaIrrigation}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('market')}
            className="card card-clickable"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem', padding: '1.1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#12372A' }}>
              {t.qaMandi}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('schemes')}
            className="card card-clickable"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem', padding: '1.1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={24} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#12372A' }}>
              {t.qaSchemes}
            </span>
          </button>
        </div>
      </div>

      {/* 6. 💰 MARKET PRICES & 🏛️ SCHEMES PREVIEW GRID */}
      <div className="grid-responsive two-col" style={{ gap: '1.5rem' }}>
        {/* Mandi Preview */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#12372A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={18} color="#15803D" />
              <span>{t.mandiTitle}</span>
            </h3>
            <button
              onClick={() => onSelectTab('market')}
              style={{ border: 'none', background: 'none', color: '#1E5631', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              सभी देखें &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {mandiPrices.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.75rem',
                  background: '#F8FAF7',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                    {language === 'hi' ? item.cropNameHi : item.cropNameEn}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    {item.mandiName}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E5631' }}>
                    ₹{item.modalPricePerQuintal.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: item.priceDeltaPercent >= 0 ? '#15803D' : '#DC2626', fontWeight: 700 }}>
                    {item.priceDeltaPercent >= 0 ? `▲ +${item.priceDeltaPercent}%` : `▼ ${item.priceDeltaPercent}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schemes Preview */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#12372A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Landmark size={18} color="#D97706" />
              <span>{t.schemesTitle}</span>
            </h3>
            <button
              onClick={() => onSelectTab('schemes')}
              style={{ border: 'none', background: 'none', color: '#1E5631', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              सभी देखें &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {eligibleSchemes.slice(0, 2).map((sch) => (
              <div
                key={sch.id}
                style={{
                  padding: '0.75rem',
                  background: '#FFFBEB',
                  borderRadius: '8px',
                  border: '1px solid #FDE68A'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 700 }}>
                    {language === 'hi' ? sch.nameHi : sch.nameEn}
                  </h4>
                  <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                    {sch.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#78350F', marginTop: '0.25rem', lineHeight: 1.4 }}>
                  {language === 'hi' ? sch.benefitsHi : sch.benefitsEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. KVK Helpline Footer Callout */}
      <div
        className="card"
        style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '1rem 1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1E5631', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PhoneCall size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#14532D' }}>
              राष्ट्रीय किसान हेल्पलाइन (Kisan Call Center)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#166534' }}>
              निःशुल्क कृषि वैज्ञानिक परामर्श हेतु 1800-180-1551 पर कॉल करें
            </div>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="btn btn-primary btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <span>1800-180-1551</span>
        </a>
      </div>
    </div>
  );
};
