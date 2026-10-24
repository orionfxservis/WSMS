import React from 'react';
import { ShieldCheck, HeartHandshake, Sparkles, Award, Globe, Users, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-16 sm:py-20 bg-white text-[#222222] relative"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0077cc] text-xs font-bold tracking-wide uppercase border border-blue-200">
            <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Built by Orion Pixels</span>
          </div>

          <h2
            id="about-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight"
          >
            Transforming Water Supply Through Engineering Excellence
          </h2>

          <p className="text-base text-[#666666] leading-relaxed">
            Water Supply Management System (WSMS) was born from a fundamental observation: water supply businesses needed reliable, modern digital tools that field drivers and suppliers can actually use without hassle.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div
            className="text-white rounded-[10px] p-8 sm:p-10 shadow-md space-y-4"
            style={{ background: 'var(--g-blue)' }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black">Our Mission</h3>
            <p className="text-blue-50 text-sm sm:text-base leading-relaxed">
              To empower water supply businesses with cutting-edge CRM technology that streamlines operations, enhances customer relationships, and eliminates can deposit shrinkage through efficient management of resources, deliveries, and finances.
            </p>
          </div>

          <div className="bg-white border border-[#eef2f7] rounded-[10px] p-8 sm:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.06)] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0077cc]">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#222222]">Our Vision</h3>
            <p className="text-[#666666] text-sm sm:text-base leading-relaxed">
              To become the leading digital infrastructure for drinking water distribution across Pakistan and beyond, recognized for innovation, field reliability, and the positive health and logistical impact we create for local communities.
            </p>
          </div>
        </div>

        {/* Core Values 4-Grid */}
        <div>
          <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">
            Principles That Guide Every Line of Code
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs hover:border-sky-300 transition-colors space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0077cc]">Reliability</span>
              <h4 className="text-base font-bold text-slate-900">Field-Tested Uptime</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                99.9% uptime architecture designed to work seamlessly even in areas with spotty mobile network connectivity.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs hover:border-sky-300 transition-colors space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Integrity</span>
              <h4 className="text-base font-bold text-slate-900">Multi-Tenant Security</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customer billing and supply ledgers are isolated and encrypted with bank-grade 256-bit SSL protocols.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs hover:border-sky-300 transition-colors space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Simplicity</span>
              <h4 className="text-base font-bold text-slate-900">Designed for Labour</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero training required. Big tap targets, straightforward numbers, and instant WhatsApp receipts for customers.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs hover:border-sky-300 transition-colors space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Compliance</span>
              <h4 className="text-base font-bold text-slate-900">Regulatory Standards</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fully compliant with Sindh Food Authority water quality logs, TDS records, and local provincial tax regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
