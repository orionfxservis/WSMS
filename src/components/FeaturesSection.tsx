import React, { useState } from 'react';
import {
  Users,
  Truck,
  Boxes,
  DollarSign,
  Building2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(null);

  const features = [
    {
      id: 'customer-management',
      title: 'Customer Management',
      subtitle: 'Complete Relationship & Can Ledger',
      description:
        'Track customer profiles, delivery addresses, security deposits, payment histories, and outstanding can balances all in one synchronized record.',
      icon: Users,
      badge: 'Core CRM',
      benefits: [
        'Automated can balance calculation per customer',
        'Deposit tracking for 19L polycarbonate bottles',
        'SMS/WhatsApp delivery notification receipts',
      ],
      demoPreview: {
        title: 'Customer Ledger Preview',
        statLabel: 'Active Accounts',
        statValue: '1,240',
        detail: 'Instant lookup by phone number, building name, or route serial.',
      },
    },
    {
      id: 'delivery-tracking',
      title: 'Delivery Tracking',
      subtitle: 'Real-Time Dispatch & Route Optimization',
      description:
        'Schedule, assign, and track daily water can dispatches. Drivers update order completions live from their mobile devices with GPS timestamps.',
      icon: Truck,
      badge: 'Live GPS',
      benefits: [
        'Dynamic route sequencing to save fuel',
        'Live status updates: Pending, In-Transit, Delivered',
        'Instant digital proof-of-delivery signature/notes',
      ],
      demoPreview: {
        title: 'Fleet Dispatch Stream',
        statLabel: 'Trucks Active',
        statValue: '18 Vans',
        detail: 'Average delivery turnaround time reduced from 45m to 21m.',
      },
    },
    {
      id: 'inventory-management',
      title: 'Inventory Management',
      subtitle: '19L Reusable Cans & Consumables Ledger',
      description:
        'Never lose a bottle again. Track filled cans, empty returns, wash-cycle batches, seal caps, and dispensers with double-entry stock verification.',
      icon: Boxes,
      badge: 'Real-Time Stock',
      benefits: [
        'Zero can shrinkage tracking across field and depot',
        'Automated low-stock alerts for bottle seals and caps',
        'Batch inspection logs for sanitation and sanitizing cycles',
      ],
      demoPreview: {
        title: 'Can Circulation Monitor',
        statLabel: 'Bottles Accounted',
        statValue: '8,500 units',
        detail: 'Discrepancy rate 0.02% across 3 Karachi regional depots.',
      },
    },
    {
      id: 'expense-tracking',
      title: 'Expense Tracking',
      subtitle: 'Operational Cashflow & Cost Attribution',
      description:
        'Monitor fleet diesel expenses, RO membrane replacements, electricity tariffs, driver commissions, and routine vehicle maintenance in real time.',
      icon: DollarSign,
      badge: 'Finance',
      benefits: [
        'Categorized operational cost breakdown',
        'Per-litre cost calculation vs revenue yield',
        'Exportable monthly tax and audit spreadsheets',
      ],
      demoPreview: {
        title: 'Unit Cost Analysis',
        statLabel: 'Net Margin Yield',
        statValue: '+34.8%',
        detail: 'Automated fuel reconciliation based on route kilometer logs.',
      },
    },
    {
      id: 'station-management',
      title: 'Station Management',
      subtitle: 'Multi-Plant Telemetry & Quality Assurance',
      description:
        'Oversee multiple filling bays and filtration stations. Monitor raw water storage levels, RO pressure, TDS minerals, and daily litre flow rates.',
      icon: Building2,
      badge: 'IoT & Telemetry',
      benefits: [
        'Real-time raw vs permeate tank level sensors',
        'Water safety logs for TDS, pH, and chlorine levels',
        'Operator shift logging and pump maintenance warnings',
      ],
      demoPreview: {
        title: 'Filtration Telemetry',
        statLabel: 'Daily Permeate Flow',
        statValue: '62,000 L',
        detail: 'Sindh Food Authority (SFA) compliant water purity standards.',
      },
    },
    {
      id: 'reports-analytics',
      title: 'Reports & Analytics',
      subtitle: 'Data-Driven Business Growth',
      description:
        'Generate executive summaries, route efficiency heatmaps, customer retention rates, and one-click PDF invoices for bulk commercial clients.',
      icon: BarChart3,
      badge: 'BI Intelligence',
      benefits: [
        '1-click GST & commercial tax invoice generation',
        'Customer churn predictor and inactive account alerts',
        'Interactive charts exportable to PDF, Excel, and CSV',
      ],
      demoPreview: {
        title: 'Executive Analytics',
        statLabel: 'Monthly Growth',
        statValue: '+18.4%',
        detail: 'Automated daily reconciliation summary sent via email.',
      },
    },
  ];

  return (
    <section
      id="features"
      className="py-16 sm:py-20 bg-[#f7f9fb] text-[#222222] relative"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0077cc] text-xs font-bold tracking-wide uppercase border border-blue-200">
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Enterprise Feature Suite</span>
          </div>

          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight"
          >
            Everything You Need to Manage Your Water Business
          </h2>

          <p className="text-base text-[#666666] leading-relaxed">
            Powerful, card-based tools designed specifically to streamline water purification, bottling, fleet dispatch, and can inventory management.
          </p>
        </div>

        {/* Features Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            const isSelected = selectedFeatureIndex === index;

            return (
              <div
                key={feat.id}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`View details for ${feat.title}`}
                onClick={() => setSelectedFeatureIndex(isSelected ? null : index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedFeatureIndex(isSelected ? null : index);
                  }
                }}
                className={`group bg-white rounded-[10px] p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] ${
                  isSelected
                    ? 'border-[#0077cc] ring-2 ring-blue-100 shadow-md'
                    : 'border-[#eef2f7] hover:border-[#0077cc] hover:-translate-y-0.5'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-lg text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
                      style={{ background: 'var(--g-blue)' }}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-bold text-[#0077cc] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-[#222222] mb-1 group-hover:text-[#0077cc] transition-colors">
                    {feat.title}
                  </h3>
                  <span className="block text-xs font-semibold text-[#888888] mb-3">
                    {feat.subtitle}
                  </span>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-5">
                    {feat.description}
                  </p>

                  {/* Key Benefits List */}
                  <ul className="space-y-2 mb-5" aria-label={`Key benefits of ${feat.title}`}>
                    {feat.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-start gap-2 text-xs text-[#444444]">
                        <CheckCircle2 className="w-4 h-4 text-[#33c47a] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action / Expand Card */}
                <div className="pt-3 border-t border-[#eef2f7] flex items-center justify-between text-xs font-bold text-[#0077cc] group-hover:text-[#005fa3]">
                  <span>{isSelected ? 'Collapse Preview' : 'Interactive Details'}</span>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSelected ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                {/* Expanded Micro-Interaction Drawer */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-blue-100 bg-[#f7f9fb] rounded-lg p-3 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#222222]">{feat.demoPreview.title}</span>
                      <span className="font-extrabold text-[#0077cc] bg-white px-2 py-0.5 rounded border border-blue-100 shadow-2xs">
                        {feat.demoPreview.statValue}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666] leading-normal">
                      {feat.demoPreview.detail}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
