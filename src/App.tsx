import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { LiveWorkflowDemo } from './components/LiveWorkflowDemo';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { NewsTicker } from './components/NewsTicker';
import { initialInventory, initialDeliveries, initialStations } from './data/mockData';
import { CanInventory, DeliveryRecord, StationData, UserRole, AppViewMode } from './types';
import { Smartphone, CheckCircle2, ArrowRight, LayoutDashboard } from 'lucide-react';

// Direct imports for instant zero-latency view switching and unified offline bundling
import { DashboardView } from './components/DashboardView';
import { LabourSupplierHub } from './components/LabourSupplierHub';
import { AccessibilityTester } from './components/AccessibilityTester';

const ViewSkeleton: React.FC<{ title: string }> = ({ title }) => (
  <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[40vh] text-center space-y-3">
    <div className="w-9 h-9 border-3 border-[#007bdb]/20 border-t-[#007bdb] rounded-full animate-spin" />
    <p className="text-xs font-semibold text-[#007bdb]">Loading {title}...</p>
  </div>
);

export default function App() {
  const [activeView, setActiveView] = useState<AppViewMode>('landing');
  const [inventory, setInventory] = useState<CanInventory>(initialInventory);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(initialDeliveries);
  const [stations] = useState<StationData[]>(initialStations);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    role: UserRole;
    email: string;
  } | null>(null);



  const handleSuccessLogin = (role: UserRole, email: string) => {
    setAuthenticatedUser({ role, email });
    // After login, navigate to the full Operations Dashboard
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = () => {
    if (activeView !== 'landing') {
      setActiveView('landing');
    }
    setTimeout(() => {
      const authEl = document.getElementById('auth-card');
      if (authEl) {
        authEl.scrollIntoView({ behavior: 'smooth' });
        const input = authEl.querySelector('input');
        if (input) input.focus();
      }
    }, 100);
  };

  const handleExploreFeatures = () => {
    if (activeView !== 'landing') {
      setActiveView('landing');
    }
    setTimeout(() => {
      const featEl = document.getElementById('features');
      if (featEl) featEl.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#222222] flex flex-col font-sans selection:bg-[#007bdb] selection:text-white">
      {/* Top Navbar with prominent green scrollbar and view toggles */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuth={handleOpenAuth}
        onToggleA11y={() => setIsA11yOpen(true)}
      />

      {/* Logged In Status Bar under Navbar with dashboard green theme */}
      {authenticatedUser && (
        <aside
          role="status"
          aria-label="User session state"
          className="fixed top-[64px] sm:top-[70px] left-0 right-0 z-40 text-slate-900 text-xs py-2 px-4 flex items-center justify-between shadow-sm border-b border-emerald-300"
          style={{ background: 'var(--g-green)' }}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-slate-900" />
              <span>
                Active Session: <strong className="capitalize text-slate-950 font-bold">{authenticatedUser.role.replace('_', ' ')}</strong> (
                {authenticatedUser.email})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[11px] font-bold bg-slate-900 text-white hover:bg-slate-800 px-3 py-1 rounded-full shadow-xs cursor-pointer transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => setAuthenticatedUser(null)}
                className="text-[11px] font-bold bg-white text-emerald-800 hover:bg-emerald-50 px-3 py-1 rounded-full shadow-xs cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {/* VIEW 1: LANDING OVERVIEW PAGE */}
        {activeView === 'landing' && (
          <>
            {/* Live Karachi News Bulletin Bar on Landing Page */}
            <div className="pt-20 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <NewsTicker className="mt-2" />
            </div>

            {/* Hero Section with Integrated Modern AuthCard */}
            <HeroSection
              onSuccessLogin={handleSuccessLogin}
              onExploreFeatures={handleExploreFeatures}
              onOpenFieldHub={() => {
                setActiveView('field-hub');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Quick Switch to Live Dashboard Banner */}
            <section className="bg-white border-y border-[#eef2f7] py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-emerald-50 border border-[#0077cc]/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-xs font-bold text-[#0077cc] uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
                      <LayoutDashboard className="w-4 h-4" />
                      Live Web Operations Node
                    </span>
                    <h3 className="text-xl font-bold text-[#222222]">
                      Experience the Authentic WSMS Operations Dashboard
                    </h3>
                    <p className="text-sm text-[#666666]">
                      View real-time delivery graphs, tomorrow's travel route plans, Karachi news ticker, and multi-station telemetry.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-white bg-[#0077cc] hover:bg-[#005fa3] transition-all shadow-sm cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open Live Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Core Features Section (6 Cards with Micro-Interactions) */}
            <FeaturesSection />

            {/* Streamlined Field Hub Callout matching dashboard theme */}
            <section
              className="py-12 bg-white border-y border-[#eef2f7]"
              aria-labelledby="hub-callout-heading"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#f7f9fb] border-2 border-[#0077cc]/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#33c47a] animate-pulse" />
                      <span>Mobile Version for Field Workers & Suppliers</span>
                    </div>
                    <h3 id="hub-callout-heading" className="text-xl sm:text-2xl font-bold text-[#222222]">
                      Real-Time Can Inventory & Field Dispatch Portal
                    </h3>
                    <p className="text-sm text-[#666666] max-w-2xl">
                      Log deliveries on the go, track customer bottle balances, monitor RO reservoir volume ({inventory.waterVolumeLitres.toLocaleString()}L in stock), and eliminate can shrinkage.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('field-hub');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-[#70e0a1] to-[#33c47a] hover:from-[#5cd390] hover:to-[#2cb36e] transition-all shadow-md shadow-emerald-950/10 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#33c47a]"
                  >
                    <Smartphone className="w-4 h-4 text-slate-900" />
                    <span>Launch Field Hub</span>
                    <ArrowRight className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
              </div>
            </section>

            {/* Interactive ROI Calculator & Workflow Demonstration */}
            <LiveWorkflowDemo />

            {/* About & Trust Section (Orion Fx Story, Values & Compliance) */}
            <AboutSection />
          </>
        )}

        {/* VIEW 2: LIVE WSMS DASHBOARD (Matches dashboard.html faithfully with Karachi News Feed) */}
        {activeView === 'dashboard' && (
          <div className="pt-16 sm:pt-20">
            <Suspense fallback={<ViewSkeleton title="Operations Dashboard" />}>
              <DashboardView
                inventory={inventory}
                deliveries={deliveries}
                stations={stations}
                onNavigateToSupply={() => {
                  setActiveView('field-hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToLanding={() => {
                  setActiveView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Suspense>
          </div>
        )}

        {/* VIEW 3: FIELD HUB FOR LABOURS & SUPPLIERS */}
        {activeView === 'field-hub' && (
          <div className="pt-16 sm:pt-20">
            <div className="bg-[#007bdb] text-white py-2.5 px-4 shadow-sm">
              <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
                <span className="text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#70e0a1] animate-ping" />
                  WSMS Field Hub · Real-Time Operations Node
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-white hover:text-blue-100 font-semibold underline cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('landing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-white hover:text-blue-100 font-semibold underline cursor-pointer"
                  >
                    Return to Website
                  </button>
                </div>
              </div>
            </div>

            {/* News Ticker also visible inside Field Hub for field operators */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <NewsTicker />
            </div>

            <Suspense fallback={<ViewSkeleton title="Field Hub" />}>
              <LabourSupplierHub
                inventory={inventory}
                setInventory={setInventory}
                deliveries={deliveries}
                setDeliveries={setDeliveries}
                stations={stations}
              />
            </Suspense>
          </div>
        )}
      </main>

      {/* Footer displayed on main page only, not in Operations Dashboard or other views */}
      {activeView === 'landing' && <Footer />}

      {/* WCAG 2.1 Compliance & Accessibility Inspector Modal */}
      {isA11yOpen && (
        <Suspense fallback={null}>
          <AccessibilityTester isOpen={isA11yOpen} onClose={() => setIsA11yOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
