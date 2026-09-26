import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StockSenseLogo from '../components/StockSenseLogo';

export default function EnterpriseSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enterprise Sign Up submitted:', formData);
  };

  return (
    <div className="bg-white text-slate-800 font-sans antialiased relative selection:bg-amber-100 selection:text-amber-900 min-h-screen flex flex-col overflow-x-hidden">
      {/* Subtle ambient decorative glow */}
      <div aria-hidden="true" className="ambient-glow-left"></div>
      <div aria-hidden="true" className="curved-blob-bg"></div>

      {/* Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-8 pb-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3" data-purpose="site-brand">
            <Link className="flex items-center gap-2 group" to="/">
              <StockSenseLogo className="h-9 sm:h-11" />
            </Link>
          </div>

          {/* Right Header Actions - Only Login */}
          <div className="flex items-center gap-4 text-[15px]">
            <span className="hidden sm:inline text-brand-softGray font-normal">Already an enterprise partner?</span>
            <Link
              to="/login"
              className="font-medium text-brand-navy border border-slate-300 hover:border-brand-navy px-5 py-2 rounded-lg transition-all hover:bg-slate-50"
              data-purpose="sign-in-action"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Registration Form */}
        <section className="lg:col-span-7 flex flex-col justify-center" data-purpose="registration-section">
          <div className="mb-3">
            <span className="uppercase tracking-widest text-xs font-bold text-brand-coral">
              Start Your 30-Day Pilot
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[46px] leading-[1.18] font-bold text-brand-navy tracking-tight mb-4 font-serif">
            Streamline, scale <span className="custom-underline px-1">and empower</span> your warehouse operations.
          </h1>

          <p className="text-base sm:text-lg text-brand-softGray mb-8 leading-relaxed max-w-xl font-normal">
            Join high-velocity 3PLs, cold-chain hubs, and manufacturing facilities driving 99.98% inventory precision without manual bottlenecks.
          </p>

          <form className="space-y-4 max-w-xl bg-white/70 backdrop-blur-sm p-1 rounded-2xl" data-purpose="signup-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5" htmlFor="full-name">Full Name</label>
              <input
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors"
                id="full-name"
                name="fullName"
                placeholder="Elena Vance"
                required
                type="text"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5" htmlFor="work-email">Email Address</label>
              <input
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors"
                id="work-email"
                name="email"
                placeholder="elena@logistics-corp.com"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-brand-navy" htmlFor="password">Password</label>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 256-bit AES Enforced
                </span>
              </div>
              <input
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors"
                id="password"
                name="password"
                placeholder="Minimum 10 characters with symbols"
                required
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                <div className="h-1 flex-1 rounded-full bg-slate-200"></div>
                <span className="text-[11px] text-slate-500 ml-1">Strong</span>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  className="mt-0.5 rounded border-slate-300 text-brand-amber focus:ring-brand-amber h-4 w-4"
                  required
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                />
                <span className="text-xs text-brand-softGray leading-snug">
                  I agree to the <a className="underline font-medium text-slate-700 hover:text-brand-navy" href="#">Terms of Service</a>,{' '}
                  <a className="underline font-medium text-slate-700 hover:text-brand-navy" href="#">Master Privacy Policy</a>, and verify that this pilot is for commercial supply-chain operations.
                </span>
              </label>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                className="w-full py-3.5 bg-gradient-to-r from-brand-amber to-[#F59E0B] hover:from-[#e29900] hover:to-[#df8b00] text-white font-semibold text-sm rounded-xl shadow-glow-warm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                data-purpose="submit-button"
                type="submit"
              >
                <span>Create Enterprise Account</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-semibold uppercase text-brand-softGray tracking-widest absolute">
                Or Continue With
              </span>
            </div>

            {/* Sign in with Google Button */}
            <div>
              <button
                type="button"
                className="w-full py-3 px-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-brand-navy transition-all duration-150 shadow-sm flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Visual Composition */}
        <section className="lg:col-span-5 relative flex items-center justify-center" data-purpose="hero-visual-showcase">
          <div className="relative w-full max-w-md lg:max-w-none">
            {/* Main Hero Image */}
            <div className="relative z-10 mx-auto overflow-hidden rounded-3xl shadow-float-card border border-white/80 bg-white">
              <img
                alt="Supply chain operations lead managing smart warehouse with scanner terminal"
                className="w-full h-[470px] object-cover object-center transform hover:scale-102 transition duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgEHuAUMOJZF0TlbRUCKFog5eY4DQ5YDnmUPDNlMNDQK8nDir_Pg7wFyoKMH3NUfb-aJkR0cI9pMDv9CBaZ7kahwyOI23ToSnptOpP2LNh8BXR8iAPgqcKUQH6Tk_pvQjDJ7VS6tpU5haVImYGUeHd_-cGMHy6d-aOHuft-ZHNzU7URnd0y4DB-AxA6ZOJJzBbkqoOPKeg5vb8jImKbIl5vSkfwPs5E2p81Eurt_KHb76Ug154JCyQaQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-xs font-semibold tracking-wider text-amber-300 uppercase mb-1">Live Operations Hub</div>
                <p className="text-sm font-medium leading-snug">"Cycle count variances dropped to 0.02% within 14 days of pilot deployment."</p>
              </div>
            </div>

            {/* Floating Badge 1: Top Right */}
            <aside className="absolute -top-6 -right-4 sm:-right-6 z-20 bg-white p-3.5 rounded-2xl shadow-float-card border border-slate-100 flex items-center gap-3" data-purpose="metric-badge-top">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-coral flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-brand-navy">12,400+ Docks</div>
                <div className="text-[11px] text-brand-softGray">Automated Globally</div>
              </div>
            </aside>

            {/* Floating Badge 2: Lower Left */}
            <aside className="absolute -bottom-6 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-float-card border border-slate-100 max-w-[260px]" data-purpose="metric-badge-bottom">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">99.98% Accuracy</span>
              </div>
              <p className="text-xs text-brand-navy font-semibold leading-tight">
                Immutable pallet-level tracking via automated barcode & RFID scans.
              </p>
            </aside>

            {/* Video Tour quick trigger */}
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 hidden xl:flex items-center gap-2 bg-white/95 py-2 px-3.5 rounded-full shadow-lg border border-slate-100">
              <button aria-label="Watch rapid overview" className="w-8 h-8 rounded-full bg-brand-coral text-white flex items-center justify-center hover:scale-105 transition-transform" type="button">
                <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.518 3.326A1 1 0 003 4.195v11.61a1 1 0 001.518.869l9.925-5.805a1 1 0 000-1.738L4.518 3.326z"></path>
                </svg>
              </button>
              <span className="text-xs font-semibold text-brand-navy pr-1">See 90s Tour</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-100 bg-white/60 backdrop-blur-sm mt-auto py-6" data-purpose="security-compliance-footer">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-softGray">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <svg className="w-4 h-4 text-brand-amber" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" fillRule="evenodd"></path>
              </svg>
              SOC 2 Type II Certified
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <svg className="w-4 h-4 text-brand-amber" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
              </svg>
              ISO 9001 & 27001 Standards
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <svg className="w-4 h-4 text-brand-amber" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
              </svg>
              SAP & Oracle NetSuite Certified Connectors
            </div>
          </div>
          <div className="text-right">
            <span>© 2026 StockSense Enterprise Technologies Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
