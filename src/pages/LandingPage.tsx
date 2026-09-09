import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  LineChart, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Database,
  Layers,
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { setShowLanding, setActiveTab } = useAnalytics();

  const handleLaunchApp = (targetTab = 'overview') => {
    if (onOpenAuth) {
      onOpenAuth('signup');
    } else {
      setActiveTab(targetTab);
      setShowLanding(false);
    }
  };

  const featureCards = [
    {
      title: 'Autonomous AI Insights',
      desc: 'NEXA continuously scans revenue velocity, regional margins, and basket sizes to flag hidden profit leaks and growth opportunities before they cost you.',
      icon: Sparkles,
      tag: 'Executive AI'
    },
    {
      title: 'Predictive Sales Forecasting',
      desc: 'Seasonal auto-ARIMA algorithms generate probabilistic 30-day, 90-day, and 12-month projections with confidence bounds to de-risk inventory reorders.',
      icon: LineChart,
      tag: 'Machine Learning'
    },
    {
      title: 'Deep Margin & SKU Intelligence',
      desc: 'Understand true contribution margin per product down to freight surcharges, discounts, and regional distribution bottlenecks.',
      icon: TrendingUp,
      tag: 'Unit Economics'
    },
    {
      title: 'Cohort & RFM Retention',
      desc: 'Segment buyers into VIP, Loyal, Regular, and At-Risk groups with real-time repurchase curves and customer lifetime value (LTV) attribution.',
      icon: Users,
      tag: 'Customer Science'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <header
        style={{
          height: 72,
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(10px)'
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            height: '100%',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)'
              }}
            >
              <Zap size={20} fill="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em' }}>NEXA</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)', marginLeft: 4 }}>
                ANALYTICS
              </span>
            </div>
          </div>

          {/* Links & CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => onOpenAuth ? onOpenAuth('signin') : handleLaunchApp('overview')}
              className="btn btn-ghost"
              style={{ fontSize: 13.5 }}
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth ? onOpenAuth('signup') : handleLaunchApp('overview')}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: 13.5 }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 24px 60px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          {/* Release Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--brand-primary-light)',
              border: '1px solid var(--brand-primary-border)',
              color: 'var(--brand-primary)',
              fontSize: 12.5,
              fontWeight: 600,
              marginBottom: 24
            }}
          >
            <Sparkles size={14} />
            <span>NEXA Analytics 2.0 • AI-Powered Business Intelligence for SMBs</span>
          </div>

          {/* Big Hero Title */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              marginBottom: 20
            }}
          >
            Know your business.
            <br />
            <span style={{ color: 'var(--brand-primary)' }}>Make smarter decisions.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 680,
              margin: '0 auto 36px auto'
            }}
          >
            Upload your sales data and instantly understand revenue, margins, customer behavior, regional sales trends, and AI-generated growth opportunities.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenAuth ? onOpenAuth('signup') : handleLaunchApp('overview')}
              className="btn btn-primary btn-lg"
              style={{ gap: 10, padding: '12px 24px' }}
            >
              <span>Create Free Account</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onOpenAuth ? onOpenAuth('signin') : handleLaunchApp('overview')}
              className="btn btn-secondary btn-lg"
              style={{ padding: '12px 22px' }}
            >
              <Lock size={15} />
              <span>Sign In to Workspace</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 28, fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} style={{ color: '#10B981' }} />
              No credit card required
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} style={{ color: '#10B981' }} />
              Bring your own CSV/Excel data
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} style={{ color: '#10B981' }} />
              Instant automated analysis
            </span>
          </div>
        </div>
      </section>

      {/* Product Feature Cards */}
      <section style={{ padding: '40px 24px 80px 24px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Everything SMB founders need to run on numbers
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>
            Designed with the precision and speed of modern tools like Linear, Stripe, and Vercel.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {featureCards.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="nexa-card"
                style={{
                  padding: 26,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onOpenAuth ? onOpenAuth('signup') : handleLaunchApp('overview')}
              >
                <div>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {f.tag}
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: '6px 0 10px 0' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section style={{ padding: '60px 24px 100px 24px', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '50px 30px',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
            Turn your business data into profitable decisions today
          </h2>
          <p style={{ fontSize: 15, color: '#CBD5E1', maxWidth: 600, margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Join forward-thinking founders using NEXA Analytics to accelerate growth, protect margins, and forecast demand with your own data.
          </p>
          <button
            onClick={() => onOpenAuth ? onOpenAuth('signup') : handleLaunchApp('overview')}
            className="btn btn-primary btn-lg"
            style={{ padding: '12px 28px', fontSize: 15 }}
          >
            <span>Start Free Account</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '28px 24px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
        © 2026 NEXA Analytics Inc. All rights reserved. Authenticated SaaS Analytics Platform.
      </footer>
    </div>
  );
};
