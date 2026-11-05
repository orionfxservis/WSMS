import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    enquiryType: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 bg-[#f8fafc] text-[#222222] border-t border-[#e2e8f0] relative scroll-mt-16"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Context, Orion Fx Support & Touchpoints */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0077cc] text-xs font-bold tracking-wide uppercase border border-blue-200">
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Contact WSMS</span>
              </div>

              <h2
                id="contact-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight"
              >
                Contact WSMS
              </h2>

              <p className="text-base sm:text-lg font-bold text-[#0077cc] leading-snug">
                Let&apos;s discuss your water supply business needs.
              </p>

              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                Contact Orion Fx for product information, demonstrations, technical support, or subscription enquiries.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-3 pt-2">
              {/* Phone / WhatsApp */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0077cc] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mobile / WhatsApp Helpline
                  </h4>
                  <a
                    href="tel:+923001234567"
                    className="text-sm font-bold text-[#222222] hover:text-[#0077cc] transition-colors"
                  >
                    +92 (300) 123-4567 · +92 (21) 3456-7890
                  </a>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Direct assistance for Pakistani mineral water plants & distributors
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Official Email Support
                  </h4>
                  <a
                    href="mailto:support@wsms.pk"
                    className="text-sm font-bold text-[#222222] hover:text-[#0077cc] transition-colors"
                  >
                    support@wsms.pk · info@orionfx.net
                  </a>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Responses typically within 2 business hours
                  </span>
                </div>
              </div>

              {/* Location & Hours */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Orion Fx Headquarters
                  </h4>
                  <p className="text-sm font-semibold text-[#222222] m-0">
                    Shahrah-e-Faisal, Karachi, Sindh, Pakistan
                  </p>
                  <span className="text-[11px] text-slate-400 block mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Mon – Sat: 9:00 AM – 7:00 PM (PKT)
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Callout */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200/70 text-xs text-slate-700 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#0077cc] shrink-0" />
              <span>
                <strong>100% Privacy & Enterprise Engineering:</strong> All enquiries are handled confidentially by certified Orion Fx deployment specialists.
              </span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,119,204,0.06)]">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-lg sm:text-xl font-bold text-[#222222]">
                  Send an Enquiry to Orion Fx
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] mt-1">
                  Please fill in your details below. Our technical team will review your requirements.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Enquiry Recorded!</strong>
                    <span>
                      Thank you for contacting WSMS. Your request has been previewed. (Form preview only — submission is not connected yet).
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent bg-slate-50/50 hover:bg-white focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Al-Madina Mineral Water"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent bg-slate-50/50 hover:bg-white focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile / WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0300-1234567"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent bg-slate-50/50 hover:bg-white focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@company.pk"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent bg-slate-50/50 hover:bg-white focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Karachi, Lahore, Rawalpindi"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent bg-slate-50/50 hover:bg-white focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Enquiry Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Enquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent bg-slate-50/50 hover:bg-white focus:bg-white transition-all text-slate-800"
                    >
                      <option value="">Select enquiry type</option>
                      <option value="demo">Product Demonstration</option>
                      <option value="pricing">Subscription &amp; Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="customization">Feature Customization &amp; Reports</option>
                      <option value="distribution">Agency &amp; Distributor Network</option>
                      <option value="other">General Enquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your operations, daily cane volume, or questions..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent bg-slate-50/50 hover:bg-white focus:bg-white transition-all resize-y placeholder:text-slate-400"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#0077cc] hover:bg-[#005fa3] active:bg-[#004b80] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Enquiry</span>
                  </button>

                  {/* Form preview only disclaimer note */}
                  <p className="text-xs text-slate-500 italic mt-3 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Form preview only — submission is not connected yet.</span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

