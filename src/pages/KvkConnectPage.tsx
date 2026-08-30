import React, { useState } from 'react';
import { Phone, MapPin, Search, Building, Mail, PhoneCall } from 'lucide-react';
import { Language } from '../types';
import { kvkService, KVKRecord } from '../services/agriculture/kvkService';

interface KvkConnectPageProps {
  language: Language;
}

export const KvkConnectPage: React.FC<KvkConnectPageProps> = ({ language }) => {
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKvks = kvkService.searchKvks(searchQuery, selectedState);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{language === 'hi' ? 'कृषि विज्ञान केंद्र (KVK) व विशेषज्ञ संपर्क' : 'Krishi Vigyan Kendra (KVK) Directory'}</span>
              <span className="badge badge-verified">VERIFIED KVK DIRECTORY</span>
            </h1>
            <p className="section-subtitle">
              {language === 'hi'
                ? 'जटिल रोग या अनिश्चितता की स्थिति में सीधे अपने जिले के कृषि वैज्ञानिकों से संपर्क करें'
                : 'Direct extension contact with district agricultural scientists and national toll-free helpline'}
            </p>
          </div>
        </div>
      </div>

      {/* National Toll-Free Helpline Spotlight */}
      <div 
        className="card" 
        style={{
          background: 'linear-gradient(135deg, #1E5631 0%, #12372A 100%)',
          color: '#FFFFFF',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#4E9F3D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PhoneCall size={24} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>
              {language === 'hi' ? 'राष्ट्रीय किसान कॉल सेंटर (Kisan Call Center)' : 'National Kisan Call Center'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#86EFAC' }}>
              निःशुल्क टोल-फ्री परामर्श (Toll-Free Agricultural Advice): सुबह 6:00 से रात 10:00 बजे तक
            </p>
          </div>
        </div>

        <a 
          href="tel:18001801551" 
          className="btn btn-lg" 
          style={{ background: '#FFFFFF', color: '#12372A', fontWeight: 800, textDecoration: 'none' }}
        >
          <Phone size={18} />
          <span>1800-180-1551 पर कॉल करें</span>
        </a>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="form-row two-col">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="kvk-search">
              <span>{language === 'hi' ? 'जिला या केंद्र खोजें (Search District/KVK):' : 'Search District:'}</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="kvk-search"
                type="text"
                className="form-control"
                placeholder={language === 'hi' ? 'जैसे: करनाल, लुधियाना, मेरठ, जयपुर, भोपाल...' : 'e.g. Karnal, Ludhiana, Meerut, Jaipur...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="kvk-state">
              <span>{language === 'hi' ? 'राज्य चुनें (Filter by State):' : 'Filter by State:'}</span>
            </label>
            <select
              id="kvk-state"
              className="form-control"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="All">सभी राज्य (All States)</option>
              <option value="Haryana">हरियाणा (Haryana)</option>
              <option value="Punjab">पंजाब (Punjab)</option>
              <option value="Uttar Pradesh">उत्तर प्रदेश (Uttar Pradesh)</option>
              <option value="Rajasthan">राजस्थान (Rajasthan)</option>
              <option value="Madhya Pradesh">मध्य प्रदेश (Madhya Pradesh)</option>
            </select>
          </div>
        </div>
      </div>

      {/* KVK Cards Grid */}
      <div className="grid-responsive two-col" style={{ gap: '1rem' }}>
        {filteredKvks.map((kvk) => (
          <div key={kvk.kvk_id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-verified">VERIFIED KVK</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E5631' }}>
                  {kvk.district}, {kvk.state}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: '#12372A', marginBottom: '0.4rem' }}>
                {kvk.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#475569', margin: '0.75rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <Building size={16} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>संस्थान: {kvk.host_organization}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <MapPin size={16} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>पता: {kvk.address}</span>
                </div>
                {kvk.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={16} color="#64748B" style={{ flexShrink: 0 }} />
                    <span>{kvk.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
              <a 
                href="tel:18001801551" 
                className="btn btn-primary" 
                style={{ flex: 1, textDecoration: 'none', fontSize: '0.88rem' }}
              >
                <Phone size={16} />
                <span>कॉल करें (1800-180-1551)</span>
              </a>

              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, fontSize: '0.88rem' }}
                onClick={() => alert(`परामर्श अनुरोध: KVK ${kvk.district} (${kvk.name}) को आपका संदर्भ भेजा गया। वैज्ञानिक आपसे संपर्क करेंगे।`)}
              >
                <span>परामर्श अनुरोध</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
