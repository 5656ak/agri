import React, { useState } from 'react';
import { Language, NavigationTab } from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { CropDoctorPage } from './pages/CropDoctorPage';
import { FertilizerPage } from './pages/FertilizerPage';
import { LifecyclePage } from './pages/LifecyclePage';
import { KisanMitraPage } from './pages/KisanMitraPage';
import { KvkConnectPage } from './pages/KvkConnectPage';
import { ShieldCheck, PhoneCall, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [language, setLanguage] = useState<Language>('hi');

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  return (
    <div className="app-container">
      {/* Universal Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Active Page View */}
      <main className="main-content" id="main-content" role="main">
        {currentTab === 'home' && (
          <HomePage onSelectTab={setCurrentTab} language={language} />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage onSelectTab={setCurrentTab} language={language} />
        )}

        {currentTab === 'crop-doctor' && (
          <CropDoctorPage onSelectTab={setCurrentTab} language={language} />
        )}

        {currentTab === 'fertilizer' && (
          <FertilizerPage onSelectTab={setCurrentTab} language={language} />
        )}

        {currentTab === 'lifecycle' && (
          <LifecyclePage onSelectTab={setCurrentTab} language={language} />
        )}

        {currentTab === 'kisan-mitra' && (
          <KisanMitraPage onSelectTab={setCurrentTab} language={language} />
        )}

        {currentTab === 'kvk-connect' && (
          <KvkConnectPage language={language} />
        )}
      </main>

      {/* Trust Footer */}
      <footer 
        style={{
          borderTop: '1px solid var(--color-border)',
          background: '#FFFFFF',
          padding: '1.5rem 1rem',
          marginTop: 'auto',
          fontSize: '0.82rem',
          color: 'var(--color-text-subtle)',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            <span>KrishiVigyan AI</span>
            <span>•</span>
            <span>Smart India Hackathon (SIH) Prototype</span>
          </div>

          <p style={{ maxWidth: '700px', lineHeight: 1.5, color: '#64748B', fontSize: '0.78rem' }}>
            {language === 'hi'
              ? 'अस्वीकरण: यह प्लेटफॉर्म भारतीय कृषि अनुसंधान परिषद (ICAR), कृषि विज्ञान केंद्रों (KVK) व CIB&RC के सार्वजनिक पैकेज ऑफ प्रैक्टिसेज के सिद्धांतों पर आधारित एक प्रोटोटाइप है। यह एक AI-सहायित निर्णय प्रणाली है, पक्का निदान नहीं।'
              : 'Disclaimer: This platform is an agricultural decision-support prototype grounded in scientific principles from ICAR, KVKs, and CIB&RC published packages of practices. AI-assisted assessment is not a guaranteed diagnosis.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#94A3B8' }}>
            <span>Built for Indian Farmers with</span>
            <Heart size={13} color="#DC2626" fill="#DC2626" />
            <span>• Phase 1A Foundation</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
      />
    </div>
  );
};

export default App;
