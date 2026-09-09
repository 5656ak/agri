import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BusinessProfile } from '../types';
import { 
  Building2, 
  Target, 
  UploadCloud, 
  Table, 
  ArrowRight, 
  Check, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface OnboardingPageProps {
  onComplete: (nextAction?: 'upload' | 'manual' | 'dashboard') => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { user, saveBusinessProfile } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 Fields
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [businessType, setBusinessType] = useState<BusinessProfile['businessType']>('E-commerce');
  const [industry, setIndustry] = useState('Consumer Goods & Retail');
  const [country, setCountry] = useState('India');
  const [currency, setCurrency] = useState('INR');

  // Step 2 Fields
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Revenue',
    'Profit',
    'Orders',
    'Customers',
    'Products'
  ]);

  const analyticalGoalOptions = [
    'Sales',
    'Revenue',
    'Customers',
    'Products',
    'Profit',
    'Regions',
    'Marketing',
    'Orders'
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleFinishStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setStep(2);
  };

  const handleFinishStep2 = () => {
    setStep(3);
  };

  const finalizeProfile = () => {
    saveBusinessProfile({
      businessName: businessName.trim(),
      businessType,
      industry,
      country,
      currency,
      analysisGoals: selectedGoals
    });
  };

  const handleSelectDataOption = (option: 'upload' | 'manual' | 'skip') => {
    finalizeProfile();
    if (option === 'upload') {
      onComplete('upload');
    } else if (option === 'manual') {
      onComplete('manual');
    } else {
      onComplete('dashboard');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-app)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}
    >
      <div
        className="nexa-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 620,
          padding: '36px 32px',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[1, 2, 3].map(num => (
              <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: step === num ? 'var(--brand-primary)' : step > num ? 'var(--color-success)' : 'var(--bg-surface-subtle)',
                    color: step >= num ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  {step > num ? <Check size={14} /> : num}
                </div>
                {num < 3 && (
                  <div
                    style={{
                      width: 32,
                      height: 2,
                      background: step > num ? 'var(--color-success)' : 'var(--border-subtle)',
                      borderRadius: 1
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
            Step {step} of 3
          </span>
        </div>

        {/* STEP 1 — Business Information */}
        {step === 1 && (
          <form onSubmit={handleFinishStep1} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Let's set up your business
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                We'll personalize your workspace and intelligence calculations based on your industry.
              </p>
            </div>

            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Business / Company Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Retail India Ltd"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Business Type
                </label>
                <select
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value as any)}
                  className="form-select"
                >
                  <option value="E-commerce">E-commerce</option>
                  <option value="Retail">Retail Storefront</option>
                  <option value="SaaS">SaaS & Digital Products</option>
                  <option value="Restaurant">Restaurant & F&B</option>
                  <option value="Agency">Agency & Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  placeholder="e.g. Electronics & Wearables"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Country
                </label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="form-select"
                >
                  <option value="India">India (Default)</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Singapore">Singapore</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Primary Currency
                </label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="form-select"
                >
                  <option value="INR">INR (₹) — Indian Rupee</option>
                  <option value="USD">USD ($) — US Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!businessName.trim()}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 0', marginTop: 10 }}
            >
              <span>Continue to Analytical Goals</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* STEP 2 — What do you want to analyze? */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                What do you want to analyze?
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Select the metrics and key areas you want NEXA's intelligence engine to highlight.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {analyticalGoalOptions.map(goal => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'var(--brand-primary-light)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: 13.5,
                      transition: 'all 0.12s ease',
                      textAlign: 'left'
                    }}
                  >
                    <span>{goal} Analytics</span>
                    {isSelected && <CheckCircle2 size={16} style={{ color: 'var(--brand-primary)' }} />}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinishStep2}
                disabled={selectedGoals.length === 0}
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Add Your Data */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Bring your business data to life
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                NEXA Analytics has zero pre-filled demo data. Choose how you want to provide your records.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Option 1: Upload CSV */}
              <div
                onClick={() => handleSelectDataOption('upload')}
                className="nexa-card"
                style={{
                  padding: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1.5px solid var(--brand-primary-border)',
                  background: 'var(--bg-surface-elevated)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 600 }}>Upload CSV / Excel File</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      Automated column detection, preview, and schema validation.
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
              </div>

              {/* Option 2: Enter Data Manually */}
              <div
                onClick={() => handleSelectDataOption('manual')}
                className="nexa-card"
                style={{
                  padding: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'rgba(59, 130, 246, 0.12)',
                      color: 'var(--color-info)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Table size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 600 }}>Enter Data Manually</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      Interactive spreadsheet interface with inline cell editing and live row calculation.
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
              </div>

              {/* Option 3: Google Sheets (Coming Soon) */}
              <div
                style={{
                  padding: 18,
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--border-subtle)',
                  background: 'var(--bg-surface-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: 0.75
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ fontSize: 14.5, fontWeight: 600 }}>Google Sheets Cloud Sync</h4>
                      <span className="badge badge-neutral" style={{ fontSize: 10 }}>Coming Soon</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      Live auto-sync with your Google Drive spreadsheets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skip Option */}
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button
                type="button"
                onClick={() => handleSelectDataOption('skip')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Skip for now & explore empty dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
