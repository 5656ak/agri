import React, { useState } from 'react';
import {
  ShieldCheck,
  Sprout,
  Calendar,
  AlertTriangle,
  Bug,
  TrendingUp,
  Landmark,
  CloudSun,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { AdminSubTab, Language } from '../../types';
import { dataStore } from '../../services/dataStore';
import { AdminCropsView } from './AdminCropsView';
import { AdminStagesView } from './AdminStagesView';
import { AdminAdvisoriesView } from './AdminAdvisoriesView';
import { AdminPestsView } from './AdminPestsView';
import { AdminMarketView } from './AdminMarketView';
import { AdminSchemesView } from './AdminSchemesView';

interface AdminDashboardProps {
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('dashboard');
  const stats = dataStore.getAdminStats();

  const handleResetData = () => {
    if (window.confirm('क्या आप सभी एडमिन व किसान डेटा को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      dataStore.resetToDefault();
      alert('डेटाबेस सफलतापूर्वक रीसेट हो गया!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={26} color="#1E5631" />
            <span>{language === 'hi' ? 'कृषि डेटा एडमिन कंट्रोल पैनल (Admin Portal)' : 'Agricultural Admin Control Center'}</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
            {language === 'hi'
              ? 'फसलों की गाइड, वैज्ञानिक सलाह, मंडी भाव, कीट-रोग व योजनाओं का लाइव प्रबंधन'
              : 'Real-time CRUD management for agronomic rules, regional advisories, schemes & market rates'}
          </p>
        </div>

        <button onClick={handleResetData} className="btn btn-secondary btn-sm" style={{ color: '#DC2626' }}>
          <RefreshCw size={15} />
          <span>फैक्ट्री रीसेट डेटा</span>
        </button>
      </div>

      {/* Admin Navigation Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
        {[
          { id: 'dashboard', label: '📊 सांख्यिकी (Overview)' },
          { id: 'advisories', label: '📢 क्षेत्रीय सलाह (Advisories)' },
          { id: 'crops', label: '🌾 फसल मास्टर (Crops)' },
          { id: 'stages', label: '🌿 विकास अवस्थाएं (Stages)' },
          { id: 'pests', label: '🐛 कीट व रोग (Pests)' },
          { id: 'market', label: '💰 मंडी भाव (Market)' },
          { id: 'schemes', label: '🏛️ सरकारी योजनाएं (Schemes)' }
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

      {/* SubTab Views */}
      {activeSubTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Stats Overview Grid */}
          <div className="grid-responsive four-col" style={{ gap: '1rem' }}>
            <div className="card">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                पंजीकृत किसान
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E5631', marginTop: '0.2rem' }}>
                {stats.totalFarmers.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>
                ✓ सक्रिय कृषक आधार
              </span>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                सक्रिय क्षेत्रीय सलाह
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
                {stats.activeAdvisories}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>
                प्रसारित ICAR/KVK सलाह
              </span>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                सक्रिय मंडी रिकॉर्ड
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>
                {stats.mandiRecords}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 600 }}>
                लाइव Agmarknet मंडियां
              </span>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                सरकारी योजनाएं
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7C3AED', marginTop: '0.2rem' }}>
                {stats.schemesCount}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6D28D9', fontWeight: 600 }}>
                डीबीटी व सब्सिडी स्कीम्स
              </span>
            </div>
          </div>

          {/* Quick Management Cards */}
          <div className="grid-responsive two-col" style={{ gap: '1rem' }}>
            <div
              className="card card-clickable"
              onClick={() => setActiveSubTab('advisories')}
              style={{ border: '1.5px solid #FDE68A', background: '#FFFBEB' }}
            >
              <h3 style={{ fontSize: '1.1rem', color: '#92400E', fontWeight: 700, marginBottom: '0.35rem' }}>
                📢 नई क्षेत्रीय सलाह प्रसारित करें &rarr;
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#78350F' }}>
                कीट प्रकोप, ओलावृष्टि या पोषण संबंधी चेतावनी जारी करें जो किसान के होमपेज पर तुरंत दिखेगी।
              </p>
            </div>

            <div
              className="card card-clickable"
              onClick={() => setActiveSubTab('market')}
              style={{ border: '1.5px solid #BBF7D0', background: '#F0FDF4' }}
            >
              <h3 style={{ fontSize: '1.1rem', color: '#166534', fontWeight: 700, marginBottom: '0.35rem' }}>
                💰 दैनिक मंडी भाव अपडेट करें &rarr;
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#14532D' }}>
                जिलेवार प्रमुख मंडियों के धान, मक्का, गेहूं व टमाटर के मॉडल भाव संशोधित करें।
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'advisories' && <AdminAdvisoriesView language={language} />}
      {activeSubTab === 'crops' && <AdminCropsView language={language} />}
      {activeSubTab === 'stages' && <AdminStagesView language={language} />}
      {activeSubTab === 'pests' && <AdminPestsView language={language} />}
      {activeSubTab === 'market' && <AdminMarketView language={language} />}
      {activeSubTab === 'schemes' && <AdminSchemesView language={language} />}
    </div>
  );
};
