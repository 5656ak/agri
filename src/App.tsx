import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { QuickCommandModal } from './components/layout/QuickCommandModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { HelpDrawer } from './components/modals/HelpDrawer';
import { ToastContainer } from './components/common/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { OverviewPage } from './pages/OverviewPage';
import { SalesPage } from './pages/SalesPage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { RegionsPage } from './pages/RegionsPage';
import { ForecastPage } from './pages/ForecastPage';
import { AiInsightsPage } from './pages/AiInsightsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { ManualDataPage } from './pages/ManualDataPage';
import { Loader2 } from 'lucide-react';

const AppShell: React.FC = () => {
  const { activeTab, showLanding, setShowLanding } = useAnalytics();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (showLanding) {
    return <LandingPage onOpenAuth={() => setShowLanding(false)} />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'sales':
        return <SalesPage />;
      case 'customers':
        return <CustomersPage />;
      case 'products':
        return <ProductsPage />;
      case 'regions':
        return <RegionsPage />;
      case 'forecast':
        return <ForecastPage />;
      case 'ai-insights':
        return <AiInsightsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'manual-entry':
        return <ManualDataPage />;
      case 'data-sources':
      case 'data-import':
        return <DataSourcesPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="modal-overlay"
          style={{ justifyContent: 'flex-start', padding: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              width: 280,
              height: '100%',
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-xl)',
              animation: 'fadeIn 0.15s ease',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <Sidebar
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="main-content">
        <Topbar
          onToggleMobileMenu={() => {
            if (window.innerWidth < 768) {
              setIsMobileMenuOpen(true);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
        />

        <main className="page-body">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <QuickCommandModal />
      <SettingsModal />
      <HelpDrawer />
      <ToastContainer />
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setActiveTab } = useAnalytics();
  const [authView, setAuthView] = useState<'landing' | 'signin' | 'signup' | 'forgot'>('landing');

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-app)',
          gap: 16
        }}
      >
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Initializing NEXA Workspace...</span>
      </div>
    );
  }

  // If not authenticated, route between Landing and Auth Pages
  if (!isAuthenticated || !user) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onOpenAuth={(mode) => setAuthView(mode)}
        />
      );
    }
    return (
      <AuthPage
        initialMode={authView}
        onBackToLanding={() => setAuthView('landing')}
        onSuccess={() => {
          // After auth, user will be loaded automatically
        }}
      />
    );
  }

  // If authenticated but has not completed onboarding
  if (!user.hasCompletedOnboarding) {
    return (
      <OnboardingPage
        onComplete={(nextAction) => {
          if (nextAction === 'manual') {
            setActiveTab('manual-entry');
          } else if (nextAction === 'upload') {
            setActiveTab('data-sources');
          } else {
            setActiveTab('overview');
          }
        }}
      />
    );
  }

  // Fully authenticated and onboarded SaaS App
  return <AppShell />;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnalyticsProvider>
          <MainRouter />
        </AnalyticsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
