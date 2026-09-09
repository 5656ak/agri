import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculatePasswordStrength, validateEmail } from '../services/authService';
import { 
  Zap, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup' | 'forgot';
  onSuccess?: () => void;
  onBackToLanding?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin', onSuccess, onBackToLanding }) => {
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation touched
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'forgot') {
      if (!validateEmail(email)) {
        setErrorMessage('Please provide a valid email address.');
        return;
      }
      const res = resetPassword(email);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!validateEmail(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreedToTerms) {
        setErrorMessage('You must agree to the Terms & Privacy Policy.');
        return;
      }

      setIsSubmitting(true);
      const res = await signup(name, email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed.');
      } else {
        if (onSuccess) onSuccess();
      }
    } else {
      // Sign In
      if (!validateEmail(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }

      setIsSubmitting(true);
      const res = await login(email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed.');
      } else {
        if (onSuccess) onSuccess();
      }
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    await loginWithGoogle();
    setIsSubmitting(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app)',
        padding: 24
      }}
    >
      <div
        className="nexa-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '36px 32px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
            }}
          >
            <Zap size={22} fill="#FFFFFF" />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            NEXA Analytics
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Know your business. Make smarter decisions.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 3,
              marginBottom: 24
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
              }}
              style={{
                flex: 1,
                padding: '7px 0',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: mode === 'signin' ? 'var(--bg-surface)' : 'transparent',
                color: mode === 'signin' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: mode === 'signin' ? 600 : 500,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: mode === 'signin' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              style={{
                flex: 1,
                padding: '7px 0',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: mode === 'signup' ? 'var(--bg-surface)' : 'transparent',
                color: mode === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: mode === 'signup' ? 600 : 500,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: mode === 'signup' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Social Authentication */}
        {mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '10px 14px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.12s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '18px 0',
                color: 'var(--text-faint)',
                fontSize: 11.5
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or with email
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>
          </>
        )}

        {/* Error / Success Notice */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger)',
              fontSize: 12.5,
              marginBottom: 16
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success-border)',
              color: 'var(--color-success)',
              fontSize: 12.5,
              marginBottom: 16
            }}
          >
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Full Name for Signup */}
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="form-input"
              />
            </div>
          )}

          {/* Business Email */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Business Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onBlur={() => setTouchedEmail(true)}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@yourcompany.com"
              className="form-input"
              style={{
                borderColor: touchedEmail && !validateEmail(email) ? 'var(--color-danger)' : undefined
              }}
            />
            {touchedEmail && !validateEmail(email) && (
              <span style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: 2, display: 'block' }}>
                Please enter a valid business email.
              </span>
            )}
          </div>

          {/* Password (for Sign In & Sign Up) */}
          {mode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password *
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: 11.5,
                      color: 'var(--brand-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onBlur={() => setTouchedPassword(true)}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="form-input"
                  style={{ paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password Strength Indicator for Signup */}
              {mode === 'signup' && password.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: strength.color, marginBottom: 2 }}>
                    <span>Password Strength:</span>
                    <span style={{ fontWeight: 600 }}>{strength.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, height: 4 }}>
                    {[1, 2, 3, 4].map(step => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          height: '100%',
                          borderRadius: 2,
                          background: step <= strength.score ? strength.color : 'var(--border-subtle)',
                          transition: 'background 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Confirm Password for Signup */}
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="form-input"
                  style={{ paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <span style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: 2, display: 'block' }}>
                  Passwords do not match.
                </span>
              )}
            </div>
          )}

          {/* Terms & Privacy Agreement */}
          {mode === 'signup' && (
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', marginTop: 4 }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                style={{ accentColor: 'var(--brand-primary)', marginTop: 2 }}
              />
              <span>
                I agree to the <strong>Terms of Service</strong> & <strong>Privacy Policy</strong>
              </span>
            </label>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px 0', marginTop: 8 }}
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={15} />
              </>
            ) : mode === 'signup' ? (
              <>
                <span>Create Business Account</span>
                <ArrowRight size={15} />
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        {/* Back Link for Forgot Password */}
        {mode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 12.5,
                color: 'var(--brand-primary)',
                cursor: 'pointer'
              }}
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Return to Homepage if opened from landing */}
        {onBackToLanding && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              type="button"
              onClick={onBackToLanding}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 12.5,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              ← Return to NEXA Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
