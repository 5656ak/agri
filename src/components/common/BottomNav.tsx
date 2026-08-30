import React from 'react';
import { Home, LayoutDashboard, Stethoscope, FlaskConical, Bot } from 'lucide-react';
import { Language, NavigationTab } from '../../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language
}) => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation Bar">
      <button
        className={`mobile-nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => onSelectTab('home')}
        aria-label="Home"
      >
        <Home className="mobile-nav-icon" />
        <span>{language === 'hi' ? 'होम' : 'Home'}</span>
      </button>

      <button
        className={`mobile-nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => onSelectTab('dashboard')}
        aria-label="My Crops Dashboard"
      >
        <LayoutDashboard className="mobile-nav-icon" />
        <span>{language === 'hi' ? 'डैशबोर्ड' : 'My Crops'}</span>
      </button>

      <button
        className={`mobile-nav-item ${currentTab === 'crop-doctor' ? 'active' : ''}`}
        onClick={() => onSelectTab('crop-doctor')}
        aria-label="Crop Doctor"
      >
        <Stethoscope className="mobile-nav-icon" />
        <span>{language === 'hi' ? 'रोग जांच' : 'Doctor'}</span>
      </button>

      <button
        className={`mobile-nav-item ${currentTab === 'fertilizer' ? 'active' : ''}`}
        onClick={() => onSelectTab('fertilizer')}
        aria-label="Fertilizer Advisor"
      >
        <FlaskConical className="mobile-nav-icon" />
        <span>{language === 'hi' ? 'खाद' : 'Fertilizer'}</span>
      </button>

      <button
        className={`mobile-nav-item ${currentTab === 'kisan-mitra' ? 'active' : ''}`}
        onClick={() => onSelectTab('kisan-mitra')}
        aria-label="AI Assistant"
      >
        <Bot className="mobile-nav-icon" />
        <span>{language === 'hi' ? 'किसान मित्र' : 'AI Mitra'}</span>
      </button>
    </nav>
  );
};
