import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StockSenseLogo from '../components/StockSenseLogo';

export default function EnterpriseLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
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
    console.log('Enterprise Login submitted:', formData);
    navigate('/dashboard');
  };

  return (
    <div className="bg-brand-lightBg text-brand-dark antialiased font-sans min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-brand-amber selection:text-white">
      {/* Background Aesthetics - Hidden on small mobile screens to prevent overflow */}
      <div aria-hidden="true" className="blob-corner-decal opacity-90 hidden lg:block"></div>
      <div aria-hidden="true" className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-purple-100 rounded-full blur-3xl opacity-40 sm:opacity-50 pointer-events-none"></div>
      <div aria-hidden="true" className="absolute top-1/3 right-4 sm:right-10 w-60 h-60 sm:w-80 sm:h-80 bg-orange-100 rounded-full blur-3xl opacity-50 sm:opacity-60 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 pt-4 sm:pt-5 pb-2">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brand-amber rounded-lg py-1 px-1 transition" to="/">
            <StockSenseLogo className="h-7 sm:h-9 md:h-10" />
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-brand-dark hover:text-white border border-brand-dark/80 hover:border-brand-dark hover:bg-brand-dark rounded-xl transition duration-200 shadow-sm"
            >
              Request Access
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full">
          {/* Left Column: Enterprise Login */}
          <div className="lg:col-span-6 w-full max-w-md sm:max-w-lg mx-auto lg:mx-0" data-purpose="auth-container">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-xs font-extrabold tracking-wider uppercase text-brand-orange">
                INTELLIGENT SUPPLY CHAIN &amp; WMS
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-brand-dark tracking-tight leading-tight mb-1.5 sm:mb-2">
              Log in, <span className="text-brand-orange underline decoration-brand-orange/40 decoration-wavy underline-offset-4">optimize</span> and take control of your warehouse.
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13px] text-brand-muted leading-relaxed mb-4 sm:mb-5 font-normal">
              Access real-time stock telemetry, automated inbound sorting, and compliance suite.
            </p>

            {/* Login Form Card */}
            <div className="bg-white/95 sm:bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl p-4 sm:p-6 shadow-float-card transition-all">
              <form className="space-y-3 sm:space-y-3.5" onSubmit={handleSubmit}>
                {/* Work Email Field */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-dark mb-1" htmlFor="work-email">
                    Enterprise Email
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                      </svg>
                    </div>
                    <input
                      className="w-full pl-9 pr-3.5 py-2.5 sm:py-2 bg-white text-brand-dark text-sm placeholder:text-stone-400 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition duration-150"
                      id="work-email"
                      name="email"
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-dark" htmlFor="password">
                      Password
                    </label>
                    <a className="text-[11px] font-semibold text-brand-orange hover:text-brand-orange/80 transition" href="#reset">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                      </svg>
                    </div>
                    <input
                      className="w-full pl-9 pr-3.5 py-2.5 sm:py-2 bg-white text-brand-dark text-sm placeholder:text-stone-400 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition duration-150"
                      id="password"
                      name="password"
                      placeholder="••••••••••••"
                      required
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Remember Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      className="w-4 h-4 rounded text-brand-amber border-stone-300 focus:ring-brand-amber transition cursor-pointer"
                      name="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={handleChange}
                    />
                    <span className="text-xs text-brand-muted">Remember this terminal</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    className="w-full min-h-[44px] py-2.5 px-5 rounded-xl bg-gradient-to-r from-brand-amber to-[#F59000] hover:from-[#e59b00] hover:to-[#e08300] text-white font-semibold text-sm tracking-wide shadow-glow-orange hover:shadow-md active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    type="submit"
                  >
                    <span>Sign In to Terminal</span>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                    </svg>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-2.5 sm:my-3">
                  <div className="border-t border-stone-200 w-full"></div>
                  <span className="bg-white px-2.5 text-[10px] font-semibold uppercase text-brand-muted tracking-widest absolute">
                    Or Continue With
                  </span>
                </div>

                {/* Google Sign In Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full min-h-[44px] py-2.5 px-4 border border-stone-200 hover:border-stone-300 rounded-xl bg-white hover:bg-stone-50 text-xs sm:text-sm font-semibold text-brand-dark transition-all duration-150 shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              </form>

              {/* Bottom Switch Link */}
              <div className="mt-3.5 pt-3 border-t border-stone-100 text-center">
                <p className="text-xs text-brand-muted">
                  Need new depot authorization?{' '}
                  <Link className="font-bold text-brand-dark hover:text-brand-orange underline underline-offset-2 ml-1 transition" to="/signup">
                    Request Facility Access
                  </Link>
                </p>
              </div>
            </div>

            {/* Mobile-only Trust badges snippet */}
            <div className="mt-4 flex lg:hidden items-center justify-center gap-4 text-[10px] text-brand-muted">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-brand-amber" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35-.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
                </svg>
                SOC2 Type II
              </span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">99.98% Accuracy</span>
            </div>
          </div>

          {/* Right Column: Expressive Logistics Hero Composition (Visible on Large Tablet / Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 relative items-center justify-center w-full" data-purpose="hero-imagery-composition">
            <div className="relative w-full max-w-[520px] aspect-[4/4.2] flex items-center justify-center">
              <div className="absolute inset-0 organic-blob-bg scale-105 opacity-90"></div>
              
              {/* Dynamic Flight Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" fill="none" viewBox="0 0 500 500">
                <path d="M 50 420 C 120 300, 200 180, 420 80" opacity="0.45" stroke="#DF6951" strokeDasharray="6 6" strokeWidth="1.8"></path>
                <path d="M 120 480 C 260 400, 380 320, 470 180" opacity="0.4" stroke="#F1A501" strokeDasharray="4 6" strokeWidth="1.8"></path>
              </svg>

              {/* Badges */}
              <div className="absolute -top-2 left-6 sm:left-10 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow-md text-[10px] font-semibold text-brand-dark border border-stone-100 animate-pulse">
                <svg className="w-3 h-3 text-blue-500 -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path>
                </svg>
                <span>Air Cargo #704 En Route</span>
              </div>

              <div className="absolute top-1/4 -right-2 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-lg border border-stone-100 text-[11px] font-semibold text-brand-dark">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Dock #02 Ingestion 100%</span>
              </div>

              {/* Main Logistics Image */}
              <div className="relative z-10 w-full max-w-[420px] h-[85%] rounded-3xl overflow-hidden shadow-xl border-4 border-white/90 bg-stone-100">
                <img
                  alt="Warehouse logistics manager conducting real-time stock telemetry"
                  className="w-full h-full object-cover object-top filter brightness-95 contrast-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzmP1AzRu98gyYTaH6FnhUtDxJ3ochp340UrzRBn6rb0IJHgPcEz_CXMe8BvEn_W7wZaJAZlvTXQKYykkurS8zTAo4zQnvev_VkvYeze69HxIDspewP2nrubM9y8-amdmp_GSNjRPvhWJWIQcKXKwwwPDz191iDH-SFUJZBvrtx2JX-qtQV7v5N2ju14tW1ZJ1_x8SEFFWsi_1cndBrt7GDcCC_AIZ3TE2bxTivvMuFOgXE89fCT-_lQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-amber">Global Distribution Hub 04</p>
                  <h2 className="text-xs sm:text-sm font-bold tracking-tight">Munich Autonomous Fulfillment Node</h2>
                </div>
              </div>

              {/* Floating Metric 1 */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-3 sm:-left-3 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-float-card border border-stone-200/90 flex items-center gap-2.5 max-w-[200px]">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-brand-dark leading-tight">SHA-256 Synced</p>
                  <p className="text-[9px] text-brand-muted">Block #9,481,203</p>
                </div>
              </div>

              {/* Floating Metric 2 */}
              <div className="absolute -bottom-3 right-1 sm:bottom-1 sm:-right-2 z-20 bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3 shadow-float-card border border-stone-200/90 flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-brand-amber flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-brand-dark leading-tight">14,820 SKUs</p>
                  <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    99.98% Accuracy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-stone-200/70 bg-white/50 backdrop-blur-sm py-2.5 sm:py-3 px-4 sm:px-8 lg:px-14 xl:px-16 mt-1">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-[11px] text-brand-muted text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Warehouses Operational</span>
            </div>
            <span className="hidden sm:inline text-stone-300">|</span>
            <span className="hidden sm:inline font-mono text-[10px] text-stone-500">Latency: 28ms</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 font-medium">
            <span className="hidden sm:inline-flex items-center gap-1 text-stone-600">
              <svg className="w-3 h-3 text-stone-500" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35-.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
              </svg>
              SOC2 Type II
            </span>
            <span className="hidden sm:inline text-stone-600">ISO 27001</span>
            <span className="hidden sm:inline text-stone-300">|</span>
            <a className="hover:text-brand-orange transition" href="#privacy">Privacy</a>
            <a className="hover:text-brand-orange transition" href="#terms">Terms</a>
            <a className="hover:text-brand-orange transition" href="#support">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
