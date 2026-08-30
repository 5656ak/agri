import React, { useState } from 'react';
import { MapPin, Globe, Bell, User, ShieldCheck, Sprout } from 'lucide-react';
import { Language, NavigationTab } from '../../types';
import { dataStore } from '../../services/dataStore';
import { getTranslation } from '../../i18n/translations';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenLocationModal: () => void;
  onOpenNotifications: () => void;
}

const SUPPORTED_LANGUAGES: { id: Language; label: string }[] = [
  { id: 'hi', label: '🇮🇳 हिन्दी' },
  { id: 'en', label: '🇬🇧 English' },
  { id: 'pa', label: '🌾 ਪੰਜਾਬੀ' },
  { id: 'mr', label: '🌱 मराठी' },
  { id: 'te', label: '🌿 తెలుగు' },
  { id: 'bn', label: '🌾 বাংলা' }
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onSelectLanguage,
  onOpenLocationModal,
  onOpenNotifications
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const farmer = dataStore.getFarmerProfile();
  const unreadCount = dataStore.getUnreadNotificationCount();
  const t = getTranslation(language);

  const isAdmin = currentTab === 'admin';

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => onSelectTab('home')}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1E5631 0%, #2D6A4F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(30, 86, 49, 0.25)'
            }}
          >
            <Sprout size={22} color="#86EFAC" />
          </div>
          <div>
            <div className="brand-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>KisanSaathi</span>
              <span style={{ fontSize: '0.65rem', background: '#DCFCE7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                PRO
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#4B5563', lineHeight: 1 }}>
              {t.tagline}
            </div>
          </div>
        </div>

        {/* Location & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Location Button */}
          <button
            onClick={onOpenLocationModal}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', background: '#F8FAF7' }}
            title={t.changeLocation}
          >
            <MapPin size={15} color="#1E5631" />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {farmer.location.district || farmer.location.state}
            </span>
          </button>

          {/* 6-Language Dropdown Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}
              title="Select Language"
            >
              <Globe size={15} color="#2563EB" />
              <span>{SUPPORTED_LANGUAGES.find((l) => l.id === language)?.label.split(' ')[1] || 'Language'}</span>
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 100,
                  minWidth: '150px',
                  padding: '0.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      onSelectLanguage(lang.id);
                      setShowLangMenu(false);
                    }}
                    style={{
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: language === lang.id ? '#E8F5E9' : 'transparent',
                      color: language === lang.id ? '#1E5631' : '#374151',
                      fontWeight: language === lang.id ? 700 : 500,
                      fontSize: '0.85rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell with Badge */}
          <button
            onClick={onOpenNotifications}
            className="btn btn-secondary btn-sm"
            style={{ position: 'relative', width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
            aria-label="Notifications"
          >
            <Bell size={18} color="#374151" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Admin / Profile Toggle */}
          <button
            onClick={() => onSelectTab(isAdmin ? 'home' : 'admin')}
            className={`btn btn-sm ${isAdmin ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '9999px', fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            {isAdmin ? <User size={15} /> : <ShieldCheck size={15} color="#1E5631" />}
            <span>{isAdmin ? t.farmerView : t.adminPanel}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
