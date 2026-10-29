import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Smartphone, ShieldCheck, Droplet, ArrowRight, LayoutDashboard } from 'lucide-react';
import { AppViewMode } from '../types';

interface NavbarProps {
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
  onOpenAuth: () => void;
  onToggleA11y: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenAuth,
  onToggleA11y,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const progressPipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let cachedTotalHeight = 0;

    const updateTotalHeight = () => {
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        0
      );
      cachedTotalHeight = Math.max(1, docHeight - window.innerHeight);
    };

    updateTotalHeight();

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const isScrolledNow = scrollTop > 15;

        // Only trigger state update when the boolean actually changes
        if (scrolledRef.current !== isScrolledNow) {
          scrolledRef.current = isScrolledNow;
          setScrolled(isScrolledNow);
        }

        // Direct DOM update for progress bar to avoid re-rendering entire Navbar
        if (cachedTotalHeight <= 0) updateTotalHeight();
        const rawProgress = (scrollTop / cachedTotalHeight) * 100;
        const progress = Math.min(100, Math.max(0, rawProgress));

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${Math.max(1, progress)}%`;
        }
        if (progressContainerRef.current) {
          progressContainerRef.current.setAttribute('aria-valuenow', String(Math.round(progress)));
        }
        if (progressPipRef.current) {
          progressPipRef.current.title = `${Math.round(progress)}% scrolled`;
        }
      });
    };

    const handleResize = () => {
      updateTotalHeight();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeView]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (activeView !== 'landing') {
      setActiveView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* WCAG Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:bg-[#0077cc] focus:text-white focus:px-4 focus:py-2.5 focus:rounded-lg focus:shadow-xl focus:font-semibold focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[#007bdb] ${
          scrolled ? 'shadow-md shadow-blue-900/20 py-2.5' : 'py-3'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand matching WSMS header.css */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1"
              aria-label="WSMS Home - Water Supply Management System"
            >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center p-1 group-hover:scale-105 transition-transform shadow-xs overflow-hidden shrink-0">
                <img
                  src="./assets/img/logo/logo.png"
                  alt="WSMS Mineral Water Supply Logo"
                  className="w-full h-full object-contain"
                  loading="eager"
                  width="48"
                  height="48"
                  onError={(e) => { (e.target as HTMLImageElement).src = './assets/img/logo.png'; }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
                    WSMS
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-100 bg-white/20 px-1.5 py-0.5 rounded">
                    Portal
                  </span>
                </div>
                <span className="text-[11px] text-blue-100 hidden sm:inline-block leading-tight font-medium">
                  Water Supply Management System
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden lg:flex items-center gap-3.5 xl:gap-5"
              aria-label="Main Navigation"
            >
              {/* 1. Overview */}
              <button
                type="button"
                onClick={() => {
                  setActiveView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1 ${
                  activeView === 'landing' ? 'text-white underline underline-offset-4' : 'text-white/90 hover:text-white'
                }`}
              >
                Overview
              </button>

              {/* 2. Live Dashboard */}
              <button
                type="button"
                onClick={() => {
                  setActiveView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  activeView === 'dashboard'
                    ? 'bg-white text-[#007bdb] border-white shadow-sm'
                    : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
                }`}
                aria-label="Open Live Dashboard"
                title="Live WSMS Dashboard with News Feed and Summary Cards"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Live Dashboard</span>
                <span className="w-2 h-2 rounded-full bg-[#70e0a1] animate-pulse" />
              </button>

              {/* 3. Field Hub */}
              <button
                type="button"
                onClick={() => {
                  setActiveView('field-hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  activeView === 'field-hub'
                    ? 'bg-white text-[#007bdb] border-white shadow-sm'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
                aria-label="Switch to Field Hub for Labours and Suppliers"
                title="Open mobile inventory & delivery operations portal"
              >
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Field Hub</span>
              </button>

              {/* 4. Features */}
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
              >
                Features
              </button>

              {/* 5. Live Demo */}
              <button
                type="button"
                onClick={() => scrollToSection('demo')}
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
              >
                Live Demo
              </button>

              {/* 6. About */}
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
              >
                About
              </button>

              {/* 7. Contact */}
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
              >
                Contact
              </button>
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleA11y}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Open Accessibility & WCAG 2.1 compliance checker"
                title="WCAG 2.1 Accessibility Tools"
              >
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 bg-white text-[#007bdb] hover:bg-blue-50 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Get Started or Sign In to WSMS"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-[#007bdb]" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? 'Close main navigation menu' : 'Open main navigation menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="lg:hidden bg-[#007bdb] border-t border-white/20 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200"
            role="region"
            aria-label="Mobile Navigation Menu"
          >
            {/* 1. Overview */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/15 font-semibold text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white w-full"
            >
              Overview
            </button>

            {/* 2. Live Dashboard */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-2 px-3 rounded-lg bg-white/20 border border-white/40 text-white font-bold text-base flex items-center justify-between w-full"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-white" />
                Live Dashboard
              </span>
              <span className="text-xs bg-[#33c47a] text-white font-bold px-2 py-0.5 rounded-full">
                Live
              </span>
            </button>

            {/* 3. Field Hub */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveView('field-hub');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-2 px-3 rounded-lg bg-white/15 border border-white/30 text-white font-bold text-base flex items-center justify-between w-full"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-white" />
                Field Hub
              </span>
              <span className="text-xs bg-[#70e0a1] text-slate-900 font-bold px-2 py-0.5 rounded-full">
                Mobile
              </span>
            </button>

            {/* 4. Features */}
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/15 font-semibold text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white w-full"
            >
              Features
            </button>

            {/* 5. Live Demo */}
            <button
              type="button"
              onClick={() => scrollToSection('demo')}
              className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/15 font-semibold text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white w-full"
            >
              Live Demo
            </button>

            {/* 6. About */}
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/15 font-semibold text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white w-full"
            >
              About
            </button>

            {/* 7. Contact */}
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/15 font-semibold text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white w-full"
            >
              Contact
            </button>

            <div className="pt-3 border-t border-white/20 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onToggleA11y();
                }}
                className="flex items-center gap-2 w-full py-2 px-3 text-white/90 hover:bg-white/10 rounded-lg text-sm font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-[#70e0a1]" />
                <span>WCAG 2.1 Accessibility Inspector</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#007bdb] rounded-full font-bold shadow-md hover:bg-slate-100"
              >
                <span>Sign In / Get Started</span>
                <ArrowRight className="w-4 h-4 text-[#007bdb]" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PROMINENT HIGH-VISIBILITY GREEN SCROLL PROGRESS BAR UNDER THE NAVBAR
            - Directly attached to the bottom of the fixed Navbar header
            - Visible dark track (#002b4d) with bottom border for 100% width visibility
            - Vivid lime/emerald gradient (--g-green: #70e0a1 to #33c47a)
            - Glowing cap / indicator pip at the leading edge
            ========================================================================= */}
        <div
          ref={progressContainerRef}
          role="progressbar"
          aria-label="Page reading and scroll progress"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={100}
          className="absolute bottom-0 left-0 right-0 h-[5px] bg-[#002b4d] border-b border-[#001f38] overflow-visible z-30 pointer-events-none"
        >
          <div
            ref={progressBarRef}
            className="h-full relative will-change-[width]"
            style={{
              width: '1%',
              background: 'linear-gradient(to right, #70e0a1, #33c47a, #70e0a1)',
              boxShadow: '0 0 10px rgba(112, 224, 161, 1), 0 0 18px rgba(51, 196, 122, 0.75)',
            }}
          >
            {/* Glowing Green Leading Pip / Dot */}
            <span
              ref={progressPipRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#33c47a] shadow-[0_0_8px_#70e0a1,0_0_14px_#33c47a]"
              title="0% scrolled"
            />
          </div>
        </div>
      </header>
    </>
  );
};
