import React from 'react';
import { Stethoscope, FlaskConical, CalendarDays, Bot, ArrowRight, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { DEMO_CROPS, DEMO_TASKS } from '../data/demoData';

interface DashboardPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectTab, language }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Farmer Greeting Banner */}
      <section 
        className="card" 
        style={{
          background: 'linear-gradient(135deg, #1E5631 0%, #2D6A4F 100%)',
          color: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <MapPin size={12} />
              <span>करनाल, हरियाणा (Karnal, Haryana)</span>
            </div>
            <h1 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {language === 'hi' ? 'नमस्ते किसान भाई 👋' : 'Welcome Farmer 👋'}
            </h1>
            <p style={{ color: '#E2E8F0', fontSize: '0.9rem' }}>
              {language === 'hi' 
                ? 'आज का मौसम: 22°C धूप खिली है • सिंचाई व कल्ले फूटने की निगरानी के लिए उत्तम समय' 
                : 'Today Weather: 22°C Sunny • Optimal time for irrigation and tillering scouting'}
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#86EFAC', textTransform: 'uppercase', fontWeight: 700 }}>
              सक्रिय फसलें (Active Crops)
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>2 फसलें (3.5 एकड़)</div>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section>
        <div className="section-header">
          <h2 className="section-title">
            {language === 'hi' ? 'त्वरित कार्य (Quick Actions)' : 'Quick Actions'}
          </h2>
        </div>

        <div className="grid-responsive four-col" style={{ gap: '0.75rem' }}>
          <button 
            className="card card-clickable" 
            onClick={() => onSelectTab('crop-doctor')}
            style={{ textAlign: 'center', padding: '1rem', border: '1px solid #BBF7D0', background: '#F0FDF4' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
              <Stethoscope size={22} color="#15803D" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#14532D', display: 'block' }}>
              📷 {language === 'hi' ? 'फसल की जांच' : 'Crop Doctor'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#166534' }}>रोग व कीट पहचान</span>
          </button>

          <button 
            className="card card-clickable" 
            onClick={() => onSelectTab('fertilizer')}
            style={{ textAlign: 'center', padding: '1rem', border: '1px solid #FDE68A', background: '#FFFBEB' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
              <FlaskConical size={22} color="#B45309" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#78350F', display: 'block' }}>
              🧪 {language === 'hi' ? 'खाद सलाह' : 'Fertilizer Advisor'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#92400E' }}>मिट्टी अनुसार खुराक</span>
          </button>

          <button 
            className="card card-clickable" 
            onClick={() => onSelectTab('lifecycle')}
            style={{ textAlign: 'center', padding: '1rem', border: '1px solid #BFDBFE', background: '#EFF6FF' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
              <CalendarDays size={22} color="#1D4ED8" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E3A8A', display: 'block' }}>
              🌱 {language === 'hi' ? 'फसल गाइड' : 'Crop Guide'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#1E40AF' }}>10 जीवनचक्र अवस्थाएं</span>
          </button>

          <button 
            className="card card-clickable" 
            onClick={() => onSelectTab('kisan-mitra')}
            style={{ textAlign: 'center', padding: '1rem', border: '1px solid #E9D5FF', background: '#FAF5FF' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
              <Bot size={22} color="#7E22CE" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#581C87', display: 'block' }}>
              🤖 {language === 'hi' ? 'Kisan Mitra' : 'Kisan Mitra AI'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6B21A8' }}>आवाज में सवाल पूछें</span>
          </button>
        </div>
      </section>

      {/* My Crops Section (Explicitly DEMO DATA) */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{language === 'hi' ? 'मेरी फसलें' : 'My Crops'}</span>
              <span className="badge badge-demo">DEMO DATA</span>
            </h2>
            <p className="section-subtitle">
              {language === 'hi' ? 'खेत में बोई गई फसलों की वर्तमान वृद्धि व स्थिति' : 'Current field crops and growth stage status'}
            </p>
          </div>
        </div>

        <div className="grid-responsive two-col" style={{ gap: '1rem' }}>
          {DEMO_CROPS.map((crop) => (
            <div key={crop.id} className="card" style={{ borderLeft: crop.healthStatus === 'HEALTHY' ? '4px solid #16A34A' : '4px solid #D97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#12372A' }}>
                    {language === 'hi' ? crop.nameHi : crop.nameEn}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    किस्म: {crop.variety} • रकबा: {crop.landAreaAcres} एकड़
                  </span>
                </div>
                <span className={`badge ${crop.healthStatus === 'HEALTHY' ? 'badge-verified' : 'badge-demo'}`}>
                  {crop.healthStatus === 'HEALTHY' ? 'स्वस्थ (Healthy)' : 'निगरानी आवश्यक'}
                </span>
              </div>

              {/* Stage Progress Bar */}
              <div style={{ margin: '0.75rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>
                    वर्तमान अवस्था: {language === 'hi' ? crop.currentStageHi : crop.currentStageEn}
                  </span>
                  <span style={{ color: '#1E5631', fontWeight: 700 }}>बुवाई के {crop.daysSinceSowing} दिन</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${crop.stageProgressPercent}%`, height: '100%', background: '#2D6A4F', borderRadius: '9999px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                  {crop.soilHealthStatus}
                </span>
                <button 
                  onClick={() => onSelectTab('lifecycle')} 
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.75rem', minHeight: '36px', fontSize: '0.82rem' }}
                >
                  <span>{language === 'hi' ? 'फसल गाइड देखें' : 'View Crop Guide'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Tasks Section (Explicitly DEMO DATA) */}
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{language === 'hi' ? 'आज और आगामी वैज्ञानिक कार्य' : "Today's Agronomic Tasks"}</span>
              <span className="badge badge-demo">DEMO DATA</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
              {language === 'hi' 
                ? 'फसल अवस्था के अनुसार अनुशंसित कार्य योजना' 
                : 'Stage-recommended schedule generated from Package of Practices'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DEMO_TASKS.map((task) => (
            <div 
              key={task.id} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="#94A3B8" />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E293B' }}>
                    {language === 'hi' ? task.titleHi : task.titleEn}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#1E5631' }}>{task.cropName}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={12} />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <span className={`badge ${task.priority === 'HIGH' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                {task.priority === 'HIGH' ? 'प्राथमिकता (High)' : 'मध्यम'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
