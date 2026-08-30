import React from 'react';
import { Home, Sprout, Camera, Grid, Menu } from 'lucide-react';
import { Language, NavigationTab } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
  onOpenMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  onOpenMenu
}) => {
  const t = getTranslation(language);

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile Navigation">
      {/* 1. Home */}
      <button
        onClick={() => onSelectTab('home')}
        className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>{t.navHome}</span>
      </button>

      {/* 2. Crops */}
      <button
        onClick={() => onSelectTab('crops')}
        className={`nav-item ${currentTab === 'crops' || currentTab === 'crop-detail' ? 'active' : ''}`}
      >
        <Sprout size={20} />
        <span>{t.navCrops}</span>
      </button>

      {/* 3. Scan (Prominent Center Button) */}
      <button
        onClick={() => onSelectTab('scan')}
        className="nav-item nav-item-scan"
        aria-label="Scan Crop Health"
      >
        <Camera size={26} color="#FFFFFF" />
      </button>

      {/* 4. My Farm */}
      <button
        onClick={() => onSelectTab('farm')}
        className={`nav-item ${currentTab === 'farm' ? 'active' : ''}`}
      >
        <Grid size={20} />
        <span>{t.navFarm}</span>
      </button>

      {/* 5. More Menu */}
      <button onClick={onOpenMenu} className="nav-item">
        <Menu size={20} />
        <span>{t.navMore}</span>
      </button>
    </nav>
  );
};
