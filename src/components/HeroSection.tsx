import React from 'react';
import { AuthCard } from './AuthCard';
import { UserRole } from '../types';
import { CheckCircle2, Shield, Activity, Truck, Smartphone, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onSuccessLogin: (role: UserRole, email: string) => void;
  onExploreFeatures: () => void;
  onOpenFieldHub: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSuccessLogin,
  onExploreFeatures,
  onOpenFieldHub,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#007bdb] via-[#006bbd] to-[#005299] text-white flex items-center"
      aria-labelledby="hero-heading"
    >
      {/* Decorative Water Glow Background Elements - Hardware-accelerated radial gradients */}
      <div
        className="absolute top-10 right-[-10%] w-[550px] h-[550px] rounded-full pointer-events-none transform-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(95,168,247,0.18) 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none transform-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(53,131,229,0.25) 0%, rgba(112,224,161,0.12) 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Value Propositions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Live Operational Status Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/25 text-white text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#70e0a1] animate-pulse" />
              <span>Next-Gen WSMS v3.2 · Real-Time Sindh Fleet Telemetry</span>
            </div>

            <div className="space-y-3">
              <h1
                id="hero-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-extrabold tracking-tight leading-[1.18] text-white"
              >
                Mineral Water Supply <br className="hidden sm:inline" />
                <span className="text-white drop-shadow-xs">
                  Management Software in Pakistan
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl font-bold text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-snug">
                Smart Business Management for Water Suppliers, Distributors & 19-Litre Canes Delivery Services
              </p>
            </div>

            <p className="text-sm sm:text-base text-blue-50 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Simplify your Mineral Water Supply Business with WSMS, an all-in-one Water Supply Management System built for businesses across Pakistan. Manage Customer Accounts, daily 19-litre Water Canes Filling Records, Delivery Operations, Reusable Canea Inventory, Supplier Payments, Invoices & Business Expenses from one centralized platform. Track daily Transactions, Monitor Operating Costs & Maintain Accurate Financial Records to manage your Water Distribution Business more efficiently.
            </p>

            {/* Core Pill-free Feature Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#70e0a1] shrink-0" aria-hidden="true" />
                <span>Real-Time Can Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#70e0a1] shrink-0" aria-hidden="true" />
                <span>Cloud-Based Station Ledger</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#70e0a1] shrink-0" aria-hidden="true" />
                <span>Driver Mobile Dispatch</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOpenFieldHub}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-[#70e0a1] to-[#33c47a] hover:from-[#5cd390] hover:to-[#2cb36e] transition-all shadow-lg shadow-emerald-950/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
                aria-label="Open Labour and Supplier Field Hub"
              >
                <Smartphone className="w-4 h-4 text-slate-900" aria-hidden="true" />
                <span>Labour & Supplier Mobile Hub</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreFeatures}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                <span>Explore All Features</span>
              </button>
            </div>

            {/* Live Operational Metrics Counter */}
            <div className="pt-4 border-t border-white/20 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="block text-xl sm:text-2xl font-extrabold text-white">8,500+</span>
                <span className="text-[11px] sm:text-xs text-blue-100">Cans Circulating</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-extrabold text-[#70e0a1]">99.8%</span>
                <span className="text-[11px] sm:text-xs text-blue-100">Delivery Accuracy</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-extrabold text-white">Zero</span>
                <span className="text-[11px] sm:text-xs text-blue-100">Can Deposit Loss</span>
              </div>
            </div>
          </div>

          {/* Right Column: Modernized Interactive Auth Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <AuthCard onSuccessLogin={onSuccessLogin} />
          </div>
        </div>
      </div>
    </section>
  );
};
