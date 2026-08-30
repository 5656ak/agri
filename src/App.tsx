import React, { useState, useEffect } from 'react';
import { Language, NavigationTab } from './types';
import { dataStore } from './services/dataStore';

// Common Components
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LocationModal } from './components/common/LocationModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { VoiceAssistantModal } from './components/common/VoiceAssistantModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AddCropModal } from './components/common/AddCropModal';

// Farmer Pages
import { HomePage } from './pages/HomePage';
import { CropsPage } from './pages/CropsPage';
import { CropDetailPage } from './pages/CropDetailPage';
import { ScanPage } from './pages/ScanPage';
import { WeatherPage } from './pages/WeatherPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { FertilizerPage } from './pages/FertilizerPage';
import { PestDirectoryPage } from './pages/PestDirectoryPage';
import { CalendarPage } from './pages/CalendarPage';
import { MarketPage } from './pages/MarketPage';
import { SchemesPage } from './pages/SchemesPage';
import { FarmPage } from './pages/FarmPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { ExpertConnectPage } from './pages/ExpertConnectPage';

// Admin Page
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Mic } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [selectedCropDetailId, setSelectedCropDetailId] = useState<string>('fc-1');
  const [language, setLanguage] = useState<Language>('hi');

  // Modal States
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);

  // Subscribe to DataStore changes
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setTick((prev) => prev + 1);
    });

    const farmer = dataStore.getFarmerProfile();
    if (!farmer.onboardingCompleted) {
      setIsOnboardingOpen(true);
    }

    return () => unsubscribe();
  }, []);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const handleOpenCropDetail = (cropId: string) => {
    setSelectedCropDetailId(cropId);
    setCurrentTab('crop-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. App Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* 2. Main Body Content Area */}
      <main className="app-container" style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <HomePage
            onSelectTab={handleSelectTab}
            onOpenCropDetail={handleOpenCropDetail}
            onOpenAddCrop={() => setIsAddCropOpen(true)}
            onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
            language={language}
          />
        )}

        {currentTab === 'crops' && (
          <CropsPage
            onSelectTab={handleSelectTab}
            onOpenCropDetail={handleOpenCropDetail}
            onOpenAddCrop={() => setIsAddCropOpen(true)}
            language={language}
          />
        )}

        {currentTab === 'crop-detail' && (
          <CropDetailPage
            cropId={selectedCropDetailId}
            onBack={() => handleSelectTab('crops')}
            onSelectTab={handleSelectTab}
            language={language}
          />
        )}

        {currentTab === 'scan' && (
          <ScanPage
            onSelectTab={handleSelectTab}
            language={language}
          />
        )}

        {currentTab === 'weather' && (
          <WeatherPage
            language={language}
          />
        )}

        {currentTab === 'irrigation' && (
          <IrrigationPage
            language={language}
          />
        )}

        {currentTab === 'fertilizer' && (
          <FertilizerPage
            onSelectTab={handleSelectTab}
            language={language}
          />
        )}

        {currentTab === 'pests' && (
          <PestDirectoryPage
            onSelectTab={handleSelectTab}
            language={language}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarPage
            language={language}
          />
        )}

        {currentTab === 'market' && (
          <MarketPage
            language={language}
          />
        )}

        {currentTab === 'schemes' && (
          <SchemesPage
            language={language}
          />
        )}

        {currentTab === 'farm' && (
          <FarmPage
            onSelectTab={handleSelectTab}
            onOpenCropDetail={handleOpenCropDetail}
            onOpenAddCrop={() => setIsAddCropOpen(true)}
            language={language}
          />
        )}

        {currentTab === 'expenses' && (
          <ExpensesPage
            language={language}
          />
        )}

        {currentTab === 'expert' && (
          <ExpertConnectPage
            language={language}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            language={language}
          />
        )}
      </main>

      {/* 3. Floating Voice Assistant Button */}
      <button
        onClick={() => setIsVoiceOpen(true)}
        className="floating-voice-btn"
        aria-label="Kisan Voice Assistant"
        title="बोलकर पूछें (Voice Assistant)"
      >
        <Mic size={26} />
      </button>

      {/* 4. Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        language={language}
        onOpenMenu={() => handleSelectTab('expenses')}
      />

      {/* 5. Modals & Overlays */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        language={language}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={() => setIsOnboardingOpen(false)}
        language={language}
      />

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onSelectTab={handleSelectTab}
        language={language}
      />

      <AddCropModal
        isOpen={isAddCropOpen}
        onClose={() => setIsAddCropOpen(false)}
        language={language}
      />
    </div>
  );
};

export default App;

