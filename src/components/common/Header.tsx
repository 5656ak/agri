import React from 'react';
import { Languages, PhoneCall, Sprout, Stethoscope, FlaskConical, CalendarDays, Bot, Phone } from 'lucide-react';
import { Language, NavigationTab } from '../../types';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage
}) => {
  return (
    <header className="top-header" role="banner">
      <div className="header-inner">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onSelectTab('home')}
          className="brand-badge"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          aria-label="KrishiVigyan AI Homepage"
        >
          <div className="brand-logo-icon">
            <Sprout size={22} />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">KrishiVigyan AI</span>
            <span className="brand-subtitle">
              {language === 'hi' ? 'किसानों के लिए वैज्ञानिक कृषि सहायक' : 'Scientific Agriculture Assistant'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <button
            className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onSelectTab('dashboard')}
          >
            <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'crop-doctor' ? 'active' : ''}`}
            onClick={() => onSelectTab('crop-doctor')}
          >
            <Stethoscope size={16} />
            <span>{language === 'hi' ? 'रोग निदान' : 'Crop Doctor'}</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'fertilizer' ? 'active' : ''}`}
            onClick={() => onSelectTab('fertilizer')}
          >
            <FlaskConical size={16} />
            <span>{language === 'hi' ? 'खाद सलाह' : 'Fertilizer'}</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'lifecycle' ? 'active' : ''}`}
            onClick={() => onSelectTab('lifecycle')}
          >
            <CalendarDays size={16} />
            <span>{language === 'hi' ? 'फसल चक्र' : 'Lifecycle'}</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'kisan-mitra' ? 'active' : ''}`}
            onClick={() => onSelectTab('kisan-mitra')}
          >
            <Bot size={16} />
            <span>{language === 'hi' ? 'किसान मित्र' : 'AI Assistant'}</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'kvk-connect' ? 'active' : ''}`}
            onClick={() => onSelectTab('kvk-connect')}
          >
            <Phone size={16} />
            <span>{language === 'hi' ? 'KVK संपर्क' : 'KVK Connect'}</span>
          </button>
        </nav>

        {/* Right Utility Bar: Helpline Badge & Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => onSelectTab('kvk-connect')}
            className="btn btn-outline"
            style={{
              padding: '0.35rem 0.65rem',
              minHeight: '36px',
              fontSize: '0.8rem',
              gap: '0.3rem',
              display: 'none',
              borderRadius: '9999px'
            }}
            title="Kisan Call Center: 1800-180-1551"
          >
            <PhoneCall size={14} />
            <span>1800-180-1551</span>
          </button>

          <button
            onClick={onToggleLanguage}
            className="lang-toggle-btn"
            aria-label="Toggle language between Hindi and English"
          >
            <Languages size={16} />
            <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
