import React from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CloudRain
} from 'lucide-react';
import { Language } from '../types';
import { dataStore } from '../services/dataStore';
import { getTranslation } from '../i18n/translations';

interface WeatherPageProps {
  language: Language;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({ language }) => {
  const farmer = dataStore.getFarmerProfile();
  const weather = dataStore.getWeather();
  const alerts = dataStore.getWeatherAlerts();
  const t = getTranslation(language);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
          🌦️ {language === 'hi' ? 'मौसम व कृषि कार्य निर्देश' : 'Weather & Farming Directives'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
          📍 {farmer.location.formattedAddress} • 7-दिवसीय मौसम पूर्वानुमान व कृषि सलाह
        </p>
      </div>

      {/* Active Weather Alert Callouts */}
      {alerts.map((al) => (
        <div
          key={al.id}
          className="card"
          style={{
            background: '#FEF2F2',
            border: '1.5px solid #F87171',
            padding: '1rem 1.25rem',
            display: 'flex',
            gap: '0.85rem',
            alignItems: 'flex-start'
          }}
        >
          <AlertTriangle size={24} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: '#991B1B', fontWeight: 700 }}>
                {language === 'hi' ? al.titleHi : al.titleEn}
              </h3>
              <span className="badge badge-critical">IMD ALERT</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#7F1D1D', margin: '0.35rem 0' }}>
              {language === 'hi' ? al.descriptionHi : al.descriptionEn}
            </p>
            <div style={{ background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem', color: '#B91C1C', fontWeight: 700, border: '1px solid #FECACA' }}>
              🌾 <strong>किसान के लिए निर्देश:</strong> {language === 'hi' ? al.farmingActionHi : al.farmingActionEn}
            </div>
          </div>
        </div>
      ))}

      {/* Today Main Weather Hero */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1E5631 0%, #12372A 100%)',
          color: '#FFFFFF',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#86EFAC', fontWeight: 700, textTransform: 'uppercase' }}>
              आज का वर्तमान मौसम (Today Live)
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                {weather.temperatureC}°C
              </span>
              <span style={{ fontSize: '1.2rem', color: '#A7F3D0', fontWeight: 600 }}>
                {language === 'hi' ? weather.conditionHi : weather.conditionEn}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#86EFAC' }}>बारिश संभावना:</span>
              <p style={{ fontSize: '1rem', fontWeight: 700 }}>{weather.rainProbabilityPercent}%</p>
            </div>
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#86EFAC' }}>हवा की गति:</span>
              <p style={{ fontSize: '1rem', fontWeight: 700 }}>{weather.windSpeedKmh} km/h</p>
            </div>
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#86EFAC' }}>आर्द्रता (Humidity):</span>
              <p style={{ fontSize: '1rem', fontWeight: 700 }}>{weather.humidityPercent}%</p>
            </div>
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#86EFAC' }}>सूर्योदय / अस्त:</span>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{weather.sunrise} / {weather.sunset}</p>
            </div>
          </div>
        </div>

        {/* Primary Action Directive Banner */}
        <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: '#FFFFFF', borderRadius: '10px', color: '#12372A' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>
            मौसम अनुसार आज का निर्णय (Weather-Driven Directive):
          </span>
          <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#12372A', marginTop: '0.2rem' }}>
            {language === 'hi' ? weather.farmingDirectiveHi : weather.farmingDirectiveEn}
          </p>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div>
        <h2 style={{ fontSize: '1.2rem', color: '#12372A', marginBottom: '0.75rem' }}>
          📅 7-दिवसीय मौसम पूर्वानुमान (7-Day Forecast)
        </h2>

        <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
          {weather.forecast.map((f, i) => (
            <div
              key={i}
              className="card"
              style={{
                textAlign: 'center',
                padding: '0.85rem 0.5rem',
                border: i === 0 ? '2px solid #1E5631' : '1px solid #E5E7EB',
                background: i === 0 ? '#F0FDF4' : '#FFFFFF'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#12372A' }}>
                {language === 'hi' ? f.dayHi : f.dayEn}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: '0.35rem' }}>
                {f.date}
              </div>

              <div style={{ fontSize: '1.8rem', margin: '0.2rem 0' }}>{f.icon}</div>

              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>
                {f.tempMax}° / <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{f.tempMin}°</span>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, marginTop: '0.35rem' }}>
                💧 {f.rainProb}% वर्षा
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
