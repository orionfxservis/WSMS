import React, { useState } from 'react';
import { Calculator, MapPin, CheckCircle2, TrendingUp, DollarSign, Droplet, ArrowRight, ShieldCheck } from 'lucide-react';

export const LiveWorkflowDemo: React.FC = () => {
  const [dailyCanDemand, setDailyCanDemand] = useState<number>(350);
  const [canPricePKR, setCanPricePKR] = useState<number>(200);
  const [emptyReturnRate, setEmptyReturnRate] = useState<number>(96);
  const [activeTab, setActiveTab] = useState<'calculator' | 'workflow'>('calculator');

  // Computed metrics
  const dailyRevenue = dailyCanDemand * canPricePKR;
  const monthlyRevenue = dailyRevenue * 30;
  const lostCanRiskReduction = Math.round(dailyCanDemand * 30 * (1 - emptyReturnRate / 100));
  const estimatedSavings = lostCanRiskReduction * 850; // cost of replacing a 19L polycarbonate bottle in PKR

  return (
    <section
      id="demo"
      className="py-16 sm:py-20 bg-[#f7f9fb] text-[#222222] relative overflow-hidden"
      aria-labelledby="demo-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0077cc] text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive ROI & Supply Calculator</span>
          </div>

          <h2
            id="demo-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#222222]"
          >
            Calculate ROI & See How WSMS Eliminates Can Loss
          </h2>

          <p className="text-[#666666] text-sm sm:text-base">
            Water suppliers in Sindh lose up to 15% of their reusable polycarbonate bottles annually due to manual ledger errors. WSMS completely automates can tracking.
          </p>
        </div>

        {/* Tab Controls matching range buttons from dashboard.html */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex p-1 bg-white border border-[#eef2f7] rounded-xl shadow-xs"
            role="tablist"
            aria-label="Demo Tabs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'calculator'}
              onClick={() => setActiveTab('calculator')}
              className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-[#0077cc] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#222222]'
              }`}
            >
              Can Balance & Revenue Calculator
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'workflow'}
              onClick={() => setActiveTab('workflow')}
              className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'workflow'
                  ? 'bg-[#0077cc] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#222222]'
              }`}
            >
              3-Step Real-Time Workflow
            </button>
          </div>
        </div>

        {activeTab === 'calculator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#eef2f7] rounded-[10px] p-6 sm:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="daily-demand-slider" className="text-sm font-bold text-[#222222]">
                    Daily 19L Can Dispatches
                  </label>
                  <span className="font-mono text-base font-extrabold text-[#0077cc]">
                    {dailyCanDemand} cans/day
                  </span>
                </div>
                <input
                  id="daily-demand-slider"
                  type="range"
                  min="50"
                  max="2000"
                  step="25"
                  value={dailyCanDemand}
                  onChange={(e) => setDailyCanDemand(parseInt(e.target.value))}
                  className="w-full accent-[#0077cc] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#888888] mt-1">
                  <span>50 cans</span>
                  <span>1,000 cans</span>
                  <span>2,000 cans</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="price-slider" className="text-sm font-bold text-[#222222]">
                    Average Selling Price Per Can (PKR)
                  </label>
                  <span className="font-mono text-base font-extrabold text-[#33c47a]">
                    Rs {canPricePKR}
                  </span>
                </div>
                <input
                  id="price-slider"
                  type="range"
                  min="100"
                  max="400"
                  step="10"
                  value={canPricePKR}
                  onChange={(e) => setCanPricePKR(parseInt(e.target.value))}
                  className="w-full accent-[#33c47a] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="return-slider" className="text-sm font-bold text-[#222222]">
                    Target Empty Bottle Return Rate (%)
                  </label>
                  <span className="font-mono text-base font-extrabold text-[#0077cc]">
                    {emptyReturnRate}%
                  </span>
                </div>
                <input
                  id="return-slider"
                  type="range"
                  min="80"
                  max="100"
                  step="1"
                  value={emptyReturnRate}
                  onChange={(e) => setEmptyReturnRate(parseInt(e.target.value))}
                  className="w-full accent-[#0077cc] cursor-pointer"
                />
              </div>
            </div>

            {/* Right Computed Cards using dashboard styling */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#f7f9fb] border border-[#eef2f7] rounded-[10px] space-y-1">
                <span className="text-xs text-[#666666] font-medium">Estimated Daily Gross</span>
                <p className="text-2xl font-black text-[#0077cc]">Rs {dailyRevenue.toLocaleString()}</p>
                <span className="text-[11px] text-[#666666]">From {dailyCanDemand} units delivered</span>
              </div>

              <div className="p-5 bg-[#f7f9fb] border border-[#eef2f7] rounded-[10px] space-y-1">
                <span className="text-xs text-[#666666] font-medium">Projected Monthly Turn</span>
                <p className="text-2xl font-black text-[#33c47a]">Rs {monthlyRevenue.toLocaleString()}</p>
                <span className="text-[11px] text-[#666666]">Based on 30 active delivery days</span>
              </div>

              <div
                className="p-5 rounded-[10px] text-white space-y-1 sm:col-span-2 shadow-sm"
                style={{ background: 'var(--g-green)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90">Annual Bottle Leakage Prevented</span>
                  <span className="text-xs text-slate-900 bg-white font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    WSMS Guarantee
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-950">
                  Rs {(estimatedSavings * 12).toLocaleString()} / year
                </p>
                <p className="text-xs text-slate-900/90 font-medium">
                  Saves ~{(lostCanRiskReduction * 12).toLocaleString()} polycarbonate bottles from disappearing or being stranded unreturned with customers.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-[#eef2f7] rounded-[10px] space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0077cc] flex items-center justify-center font-bold text-base border border-blue-200">
                1
              </div>
              <h4 className="text-lg font-bold text-[#222222]">Filling & Barcode Seal</h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Bottles are filled from the RO permeate line, sanitized, capped, and assigned to the morning truck manifest in under 5 minutes.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#eef2f7] rounded-[10px] space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base border border-emerald-200">
                2
              </div>
              <h4 className="text-lg font-bold text-[#222222]">Field Labour Handshake</h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Drivers tap on their mobile phone to log delivery. Number of delivered cans and returned empty cans are balanced in real time.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#eef2f7] rounded-[10px] space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-base border border-purple-200">
                3
              </div>
              <h4 className="text-lg font-bold text-[#222222]">Automated Reconciliation</h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                End-of-day truck returns match the central depot stock with zero manual paper discrepancy or disputed customer can counts.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
