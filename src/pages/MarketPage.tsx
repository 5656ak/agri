import React, { useState } from 'react';
import { TrendingUp, Search, MapPin, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Language } from '../types';
import { dataStore } from '../services/dataStore';

interface MarketPageProps {
  language: Language;
}

export const MarketPage: React.FC<MarketPageProps> = ({ language }) => {
  const mandiPrices = dataStore.getMandiPrices();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');

  const filteredPrices = mandiPrices.filter((m) => {
    const matchSearch =
      m.cropNameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cropNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mandiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCrop = selectedCropFilter === 'ALL' || m.cropId === selectedCropFilter;
    return matchSearch && matchCrop;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
          💰 {language === 'hi' ? 'दैनिक मंडी भाव व मूल्य रुझान' : 'Mandi Rates & Price Trends'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
          {language === 'hi'
            ? 'राज्य व नजदीकी कृषि उपज मंडियों के दैनिक मॉडल भाव व पिछले 30 दिनों का ट्रेंड'
            : 'Verified commodity prices and 30-day historical trend indicators across regional mandis'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '0.85rem' }}>
        <div className="form-row two-col" style={{ marginBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder={language === 'hi' ? 'फसल या मंडी खोजें (धान, मक्का, रांची)...' : 'Search crop or mandi...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select
            className="form-control"
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
          >
            <option value="ALL">सभी फसलें (All Crops)</option>
            <option value="paddy">धान (Paddy)</option>
            <option value="maize">मक्का (Maize)</option>
            <option value="tomato">टमाटर (Tomato)</option>
            <option value="wheat">गेहूं (Wheat)</option>
            <option value="mustard">सरसों (Mustard)</option>
          </select>
        </div>
      </div>

      {/* Mandi Cards List */}
      <div className="grid-responsive two-col" style={{ gap: '1rem' }}>
        {filteredPrices.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              border: '1.5px solid #E5E7EB'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-verified">LIVE AGMARKNET</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  अद्यतन: {item.updatedDate}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#12372A' }}>
                {language === 'hi' ? item.cropNameHi : item.cropNameEn}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#4B5563', marginTop: '0.2rem' }}>
                <MapPin size={15} color="#1E5631" />
                <span>{item.mandiName}, {item.district} ({item.state})</span>
              </div>

              {/* Price Display */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1rem', padding: '0.75rem', background: '#F8FAF7', borderRadius: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>
                    मॉडल भाव (Modal Rate):
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E5631' }}>
                    ₹{item.modalPricePerQuintal.toLocaleString()}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4B5563' }}> / क्विंटल</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: item.priceDeltaPercent >= 0 ? '#15803D' : '#DC2626'
                    }}
                  >
                    {item.priceDeltaPercent >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    <span>{item.priceDeltaPercent >= 0 ? `+${item.priceDeltaPercent}%` : `${item.priceDeltaPercent}%`}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    रेंज: ₹{item.minPrice} - ₹{item.maxPrice}
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Historical Trend Visualizer */}
            {item.history && item.history.length > 0 && (
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                  मूल्य रुझान (30-Day Trend):
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '50px', marginTop: '0.5rem', gap: '0.35rem' }}>
                  {item.history.map((h, i) => {
                    const minP = Math.min(...item.history.map((x) => x.price));
                    const maxP = Math.max(...item.history.map((x) => x.price));
                    const range = Math.max(1, maxP - minP);
                    const heightPercent = 30 + ((h.price - minP) / range) * 60;

                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div
                          style={{
                            width: '100%',
                            height: `${heightPercent}%`,
                            background: i === item.history.length - 1 ? '#1E5631' : '#A7F3D0',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease'
                          }}
                          title={`${h.date}: ₹${h.price}`}
                        />
                        <span style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '2px' }}>
                          {h.date.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
