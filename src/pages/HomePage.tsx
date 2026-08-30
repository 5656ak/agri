import React from 'react';
import { Stethoscope, FlaskConical, CalendarDays, Bot, ArrowRight, ShieldCheck, Building2, GraduationCap, Landmark, Sparkles } from 'lucide-react';
import { Language, NavigationTab } from '../types';

interface HomePageProps {
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTab, language }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Section */}
      <section 
        className="card" 
        style={{
          background: 'linear-gradient(135deg, #12372A 0%, #1E5631 100%)',
          color: '#FFFFFF',
          padding: '2.5rem 1.5rem',
          borderRadius: 'var(--radius-xl)',
          border: 'none',
          boxShadow: '0 10px 25px -5px rgba(18, 55, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.25rem', backdropFilter: 'blur(4px)' }}>
            <Sparkles size={15} color="#86EFAC" />
            <span>Smart India Hackathon Prototype</span>
          </div>

          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>
            {language === 'hi'
              ? 'आपकी फसल, अब AI की वैज्ञानिक निगरानी में'
              : 'Your Crops, Now Under Scientific AI Surveillance'}
          </h1>

          <p style={{ color: '#E2E8F0', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            {language === 'hi'
              ? 'फसल की बीमारी पहचानें, मिट्टी के अनुसार पोषण समझें और बीज से कटाई तक वैज्ञानिक सलाह पाएं।'
              : 'Detect crop diseases, understand soil-based nutrition, and access scientific guidance from seed to harvest.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
            <button
              onClick={() => onSelectTab('crop-doctor')}
              className="btn btn-lg"
              style={{ background: '#4E9F3D', color: '#FFFFFF', border: 'none', fontWeight: 700 }}
            >
              <Stethoscope size={20} />
              <span>{language === 'hi' ? 'फसल की जांच करें' : 'Diagnose Crop Disease'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onSelectTab('kisan-mitra')}
              className="btn btn-lg btn-secondary"
              style={{ fontWeight: 700 }}
            >
              <Bot size={20} color="#1E5631" />
              <span>{language === 'hi' ? 'AI सहायक से पूछें' : 'Ask Kisan Mitra AI'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Feature Cards */}
      <section>
        <div className="section-header">
          <h2 className="section-title">
            {language === 'hi' ? 'प्रमुख वैज्ञानिक सुविधाएं' : 'Key Scientific Features'}
          </h2>
          <p className="section-subtitle">
            {language === 'hi' 
              ? 'भारतीय कृषि अनुसंधान मानकों पर आधारित सटीक व सुरक्षित समाधान' 
              : 'Precise and safe decision support built on Indian agricultural research standards'}
          </p>
        </div>

        <div className="grid-responsive two-col" style={{ gap: '1.25rem' }}>
          {/* Feature 1 */}
          <div 
            className="card card-clickable" 
            onClick={() => onSelectTab('crop-doctor')}
            style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Stethoscope size={24} color="#1E5631" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                {language === 'hi' ? 'AI फसल रोग पहचान' : 'AI Crop Disease Detection'}
              </h3>
              <p style={{ fontSize: '0.9rem' }}>
                {language === 'hi'
                  ? 'पत्ती का फोटो अपलोड करें। AI लक्षणों की पहचान करेगा और सुरक्षित जैविक व रासायनिक उपाय बताएगा।'
                  : 'Upload a leaf photo. AI identifies visible symptoms, disease confidence, and safe IPM measures.'}
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            className="card card-clickable" 
            onClick={() => onSelectTab('fertilizer')}
            style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FlaskConical size={24} color="#B45309" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                {language === 'hi' ? 'मिट्टी आधारित खाद सलाह' : 'Soil-Based Fertilizer Advisor'}
              </h3>
              <p style={{ fontSize: '0.9rem' }}>
                {language === 'hi'
                  ? 'मृदा स्वास्थ्य कार्ड (N-P-K), लक्ष्य उपज और फसल अवस्था के अनुसार वैज्ञानिक खाद की मात्रा और समय।'
                  : 'Calculate stage-specific fertilizer doses using Soil Health Card values and ICAR STCR models.'}
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            className="card card-clickable" 
            onClick={() => onSelectTab('lifecycle')}
            style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarDays size={24} color="#2563EB" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                {language === 'hi' ? '10-चरणीय फसल जीवनचक्र' : '10-Stage Crop Lifecycle Guide'}
              </h3>
              <p style={{ fontSize: '0.9rem' }}>
                {language === 'hi'
                  ? 'बीज चयन से लेकर भंडारण तक प्रत्येक अवस्था पर सिंचाई, पोषण, कीट निगरानी और सावधानियां।'
                  : 'Complete agronomic timeline covering irrigation, nutrition, pest scouting, and precautions.'}
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div 
            className="card card-clickable" 
            onClick={() => onSelectTab('kisan-mitra')}
            style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={24} color="#7E22CE" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                {language === 'hi' ? 'Kisan Mitra AI (ध्वनि व चैट सहायक)' : 'Kisan Mitra AI Assistant'}
              </h3>
              <p style={{ fontSize: '0.9rem' }}>
                {language === 'hi'
                  ? 'सरल हिंदी व अंग्रेजी में बोलकर या लिखकर सवाल पूछें। उत्तर केवल सत्यापित कृषि आंकड़ों पर आधारित होंगे।'
                  : 'Voice and text assistant answering farmer questions grounded strictly in verified agricultural research.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Source Categories Section */}
      <section className="card" style={{ background: '#F8F9FA' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 1.5rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1E5631', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={20} />
            <span>{language === 'hi' ? 'विश्वसनीय कृषि ज्ञान' : 'Authoritative Knowledge Categories'}</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
            {language === 'hi' ? 'वैज्ञानिक अनुसंधान आधारित ज्ञान स्रोत' : 'Scientific Research Source Categories'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            {language === 'hi'
              ? 'सिस्टम का ज्ञान इन प्रतिष्ठित भारतीय कृषि अनुसंधानों की सार्वजनिक मार्गदर्शिकाओं पर आधारित रूपरेखा में संरचित है:'
              : 'The system knowledge base is structured to align with authoritative public guidance from:'}
          </p>
        </div>

        <div className="grid-responsive four-col" style={{ gap: '1rem' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <Building2 size={28} color="#1E5631" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>ICAR</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {language === 'hi' ? 'भारतीय कृषि अनुसंधान परिषद संस्थान' : 'Indian Council of Agricultural Research'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <GraduationCap size={28} color="#2563EB" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>SAUs</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {language === 'hi' ? 'राज्य कृषि विश्वविद्यालय (PAU, TNAU, आदि)' : 'State Agricultural Universities'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <Landmark size={28} color="#B45309" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>KVKs</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {language === 'hi' ? '730+ जिला कृषि विज्ञान केंद्र' : '730+ Krishi Vigyan Kendras'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <ShieldCheck size={28} color="#15803D" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Govt. Agro Portals</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {language === 'hi' ? 'मृदा स्वास्थ्य कार्ड एवं CIB&RC मानक' : 'Soil Health Card & CIB&RC Standards'}
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'center', marginTop: '1rem' }}>
          * सूचना: यह एक हैकाथॉन प्रोटोटाइप है। यह किसी भी सरकारी या शैक्षणिक संस्थान से आधिकारिक साझेदारी या समर्थन का दावा नहीं करता है।
        </p>
      </section>
    </div>
  );
};
