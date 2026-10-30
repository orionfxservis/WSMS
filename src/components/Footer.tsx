import React, { useState } from 'react';
import { Droplet, ShieldCheck, Heart, ArrowUp, FileText, CheckCircle2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalLegalTitle, setModalLegalTitle] = useState<string | null>(null);

  const legalDocuments: Record<string, string> = {
    Terms: `Terms of Service (Water Supply Management System - Sindh & Pakistan Jurisdiction)
Last Updated: January 2025

These Terms of Service explain your rights and responsibilities when using the Water Supply Management System (WSMS). The laws of Pakistan apply to this agreement, including the Contract Act 1872, Electronic Transactions Ordinance 2002 and Prevention of Electronic Crimes Act 2016.

SECTION 1. ABOUT THE PLATFORM: WSMS is a browser-based CRM & inventory tool for water suppliers. It stores records inside your device with zero unauthorized cloud transmission.
SECTION 2. ACCOUNT CREATION: You are responsible for protecting credentials and all activities occurring under your account.
SECTION 3. ALLOWED USE: Must comply with Pakistan law; fraudulent data, code reverse-engineering, or tampering is strictly prohibited.
SECTION 4. DATA OWNERSHIP: All customer, sales, and inventory data entered belongs entirely to you.
SECTION 5. DATA STORAGE: Stored securely in your browser's local storage.
SECTION 6. SERVICE LIMITATIONS: Provided on an "as-is" and "as-available" basis without warranties.
SECTION 7. INTELLECTUAL PROPERTY: Design, brand, and proprietary code belong to Orion Fx.
SECTION 8. TERMINATION: Access can be suspended upon terms violation; clearing device storage concludes use.
SECTION 9. LIMITATION OF LIABILITY: Governed under Pakistani law; total liability limited to amounts paid in the preceding 12 months.
SECTION 10. GOVERNING LAW & DISPUTES: Courts of Karachi, Sindh.
SECTION 11. CHANGES: Subject to periodic updates.
SECTION 12. CONTACT: Orion Fx Support.`,
    Privacy: `Privacy Policy (Water Supply Management System - Sindh & Pakistan Jurisdiction)
Last Updated: January 2025

This Privacy Policy explains how WSMS handles your information under the laws of Pakistan, including Article 14 of the Constitution, the Prevention of Electronic Crimes Act 2016 (PECA), and principles of the Draft Personal Data Protection Bill.

SECTION 1. NATURE OF WSMS: WSMS is an offline tool. It does not send your data to the cloud or store anything on a remote server. All information stays inside your browser on your device.
SECTION 2. INFORMATION COLLECTED: Collects only business information you enter (Name, Company, Customers, Deliveries, Cans filled/delivered, Expenses, Payments, Inventory). No CNIC, banking, or biometric tracking.
SECTION 3. TECHNICAL DATA: Uses basic browser/session info for local operations. No third-party analytics trackers, advertising cookies, or surveillance scripts.
SECTION 4. DATA USAGE: Exclusively used to run WSMS features, generate calculations and charts, and store records.
SECTION 5. DATA STORAGE: Stored entirely in your browser localStorage. You have complete control.
SECTION 6. DATA SECURITY: Protected by local browser sandboxing; you are responsible for device-level security.
SECTION 7. DATA RETENTION: Retained as long as it remains in your browser; deleted immediately when cleared.
SECTION 8. DATA SHARING: Never shared, sold, or traded with third parties. Shared only upon lawful court order under PECA 2016.
SECTION 9. YOUR RIGHTS: Full rights to view, correct, export, or delete your data at any time.
SECTION 10. CHILDREN'S PRIVACY: For users 18 years and older.
SECTION 11. INTERNATIONAL TRANSFERS: Zero data transfers outside Pakistan.
SECTION 13. POLICY CHANGES: Periodic updates published with revised timestamp.
SECTION 14. CONTACT: Orion Fx Support.`,
    Cookies: `Cookie Policy (Water Supply Management System - Sindh & Pakistan Standards)
Last Updated: January 2025

This Cookie Policy explains how WSMS uses cookies in compliance with Pakistan's electronic transaction and privacy standards.

SECTION 1. ABOUT COOKIES: Cookies are small text files stored by your browser. WSMS uses cookies solely for essential functionality.
SECTION 2. TYPES OF COOKIES USED:
- 2.1 Essential Cookies: Keep you logged in, maintain session state, load local records correctly, and ensure smooth navigation. WSMS will not function properly without them.
- 2.2 No Tracking Cookies: Zero advertising cookies, analytics cookies, third-party trackers, or marketing pixels. Platform works offline without external network communications.
SECTION 3. WHY WE USE COOKIES: Identify active login, maintain session authentication, prevent repeated operations, and support offline-first operation.
SECTION 4. USER CONTROL: Can be disabled in your browser settings. Essential cookies are required for platform operation.
SECTION 5. DATA STORED: Temporary session token and basic app state. Never stores customer data, delivery records, financial details, or personal identifiers in cookies.
SECTION 6. SECURITY: Protected by browser sandboxing and never shared with external parties.
SECTION 7. DELETION: Can be cleared anytime through browser settings.
SECTION 8. POLICY UPDATES: Governed by periodic revisions with timestamp updates.
SECTION 9. CONTACT: Orion Fx Support.`,
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="contact"
      className="bg-[#08101e] text-slate-400 border-t border-sky-950 pt-16 pb-12 scroll-mt-20"
      role="contentinfo"
      aria-label="Site Footer and Contact Information"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Contact Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1 shadow-md shadow-sky-600/20 shrink-0 overflow-hidden">
                <img
                  src="./assets/img/logo/logo.png"
                  alt="WSMS Mineral Water Supply Logo"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  width="44"
                  height="44"
                  onError={(e) => { (e.target as HTMLImageElement).src = './assets/img/logo.png'; }}
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">WSMS</span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Water Supply Management System — modern CRM and real-time inventory management for commercial drinking water distributors and filling plants across Pakistan.
            </p>

            <div className="text-xs text-slate-300 space-y-1 pt-1">
              <div><strong className="text-white">Official Contact & Support:</strong> support@wsms.pk · +92 (21) 3456-7890</div>
              <div><strong className="text-white">Headquarters:</strong> Shahrah-e-Faisal, Karachi, Sindh, Pakistan</div>
            </div>

            <div className="flex items-center gap-3 text-xs text-sky-400 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Sindh Regional Node Operational</span>
              </span>
              <span>·</span>
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">System Modules</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-sky-300 transition-colors">
                  Can Inventory Ledger
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-sky-300 transition-colors">
                  Route & Fleet Tracking
                </a>
              </li>
              <li>
                <a href="#field-hub" className="hover:text-sky-300 transition-colors">
                  Labour & Driver Portal
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-sky-300 transition-colors">
                  ROI & Balance Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Compliance & Legal</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <a
                href="./pages/terms.html"
                className="text-left hover:text-sky-300 transition-colors cursor-pointer text-slate-400 flex items-center justify-between group no-underline"
                title="Open Terms of Service (/pages/terms.html)"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-300 transition-colors" />
                  <span className="group-hover:text-sky-300 transition-colors font-medium">Terms</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-sky-300 transition-colors" />
              </a>
              <a
                href="./pages/privacy.html"
                className="text-left hover:text-sky-300 transition-colors cursor-pointer text-slate-400 flex items-center justify-between group no-underline"
                title="Open Privacy Policy (/pages/privacy.html)"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-300 transition-colors" />
                  <span className="group-hover:text-sky-300 transition-colors font-medium">Privacy</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-sky-300 transition-colors" />
              </a>
              <a
                href="./pages/cookies.html"
                className="text-left hover:text-sky-300 transition-colors cursor-pointer text-slate-400 flex items-center justify-between group no-underline"
                title="Open Cookie Policy (/pages/cookies.html)"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-300 transition-colors" />
                  <span className="group-hover:text-sky-300 transition-colors font-medium">Cookies</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-sky-300 transition-colors" />
              </a>
              <span className="text-xs text-slate-500 pt-1">Sindh SFA Standards Compliant</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Back to Top */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 Water Supply Management System. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc]"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Legal Document Quick Modal */}
      {modalLegalTitle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-doc-title"
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 text-slate-200 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 id="legal-doc-title" className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                {modalLegalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setModalLegalTitle(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
            <pre className="font-sans text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
              {legalDocuments[modalLegalTitle]}
            </pre>
            <div className="pt-2 flex items-center justify-between gap-3">
              {modalLegalTitle === 'Terms' && (
                <a
                  href="./pages/terms.html"
                  className="text-xs text-sky-400 hover:text-sky-300 underline font-semibold flex items-center gap-1"
                >
                  <span>Open Full /pages/terms.html</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {modalLegalTitle === 'Privacy' && (
                <a
                  href="./pages/privacy.html"
                  className="text-xs text-sky-400 hover:text-sky-300 underline font-semibold flex items-center gap-1"
                >
                  <span>Open Full /pages/privacy.html</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {modalLegalTitle === 'Cookies' && (
                <a
                  href="./pages/cookies.html"
                  className="text-xs text-sky-400 hover:text-sky-300 underline font-semibold flex items-center gap-1"
                >
                  <span>Open Full /pages/cookies.html</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setModalLegalTitle(null)}
                className="px-4 py-2 bg-[#0077cc] hover:bg-[#005fa3] text-white font-semibold rounded-lg text-xs ml-auto cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
