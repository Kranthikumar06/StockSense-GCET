import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StockSenseLogo from '../components/StockSenseLogo';

const API_URL = 'http://localhost:8000/api/auth';

export default function EnterpriseSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    re_password: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    const errors = {
      name: '',
      email: '',
      password: '',
      re_password: ''
    };

    // 1. Name Validation (6 to 12 characters)
    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length < 6 || trimmedName.length > 12) {
      errors.name = '• Name must be between 6 and 12 characters long.';
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errors.email = '• Email must be a valid email format.';
    }

    // 3. Password Validation (Single line message)
    const pwd = formData.password;
    const isPasswordMoreThan8 = pwd.length > 8;
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(pwd);

    if (!pwd || !isPasswordMoreThan8 || !hasLowerCase || !hasUpperCase || !hasSpecialChar) {
      errors.password = '• Password must contain an uppercase letter, a lowercase letter, a special character, and length > 8 characters.';
    }

    // 4. Re-Enter Password Validation
    if (!formData.re_password || formData.re_password !== formData.password) {
      errors.re_password = '• Passwords must match.';
    }

    setFieldErrors(errors);

    const hasErrors = Object.values(errors).some((err) => err !== '');
    if (hasErrors) {
      return;
    }

    // Attempt backend registration
    setSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name: trimmedName,
        email: formData.email.trim(),
        password: formData.password,
        re_password: formData.re_password
      });

      setSuccessMsg(`Account created successfully! Welcome, ${response.data.name}.`);
      setFormData({ name: '', email: '', password: '', re_password: '' });
      setFieldErrors({ name: '', email: '', password: '', re_password: '' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const backendDetail = err.response.data.detail;
        if (backendDetail.toLowerCase().includes('name')) {
          setFieldErrors((prev) => ({ ...prev, name: `• ${backendDetail}` }));
        } else if (backendDetail.toLowerCase().includes('email')) {
          setFieldErrors((prev) => ({ ...prev, email: `• ${backendDetail}` }));
        } else {
          setFieldErrors((prev) => ({ ...prev, name: `• ${backendDetail}` }));
        }
      } else {
        setFieldErrors((prev) => ({ ...prev, name: '• Server connection error. Please ensure backend is running.' }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-slate-800 font-sans antialiased relative selection:bg-amber-100 selection:text-amber-900 min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Subtle ambient decorative glow - Hidden on mobile */}
      <div aria-hidden="true" className="ambient-glow-left hidden lg:block"></div>
      <div aria-hidden="true" className="curved-blob-bg hidden lg:block"></div>

      {/* Header */}
      <header className="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 pt-4 sm:pt-5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" data-purpose="site-brand">
            <Link className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brand-amber rounded-lg py-1 px-1 transition" to="/">
              <StockSenseLogo className="h-7 sm:h-9 md:h-10" />
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-brand-softGray text-xs sm:text-sm font-normal">Already have an account?</span>
            <Link
              to="/login"
              className="font-medium text-brand-navy border border-slate-300 hover:border-brand-navy px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all hover:bg-slate-50 shadow-sm"
              data-purpose="sign-in-action"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full">
          {/* Left Column: Sign Up Form */}
          <section className="lg:col-span-6 w-full max-w-md sm:max-w-lg mx-auto lg:mx-0 flex flex-col justify-center" data-purpose="registration-section">
            <div className="mb-1.5 sm:mb-2">
              <span className="uppercase tracking-widest text-[10px] sm:text-xs font-bold text-brand-coral">
                Create User Account
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[32px] leading-tight font-bold text-brand-navy tracking-tight mb-1.5 sm:mb-2 font-serif">
              Streamline &amp; empower <span className="custom-underline px-1">your warehouse</span> operations.
            </h1>

            <p className="text-xs sm:text-[13px] text-brand-softGray mb-4 sm:mb-5 leading-relaxed font-normal">
              Sign up below to access your StockSense inventory management system.
            </p>

            {/* Success Alert */}
            {successMsg && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <span>✅</span>
                <span>{successMsg}</span>
              </div>
            )}

            <form className="space-y-3 sm:space-y-3.5 bg-white/95 sm:bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-float-card" data-purpose="signup-form" onSubmit={handleSubmit} noValidate>
              
              {/* Field 1: Enter Name */}
              <div>
                <label className="block text-[11px] font-semibold text-brand-navy mb-1" htmlFor="name">
                  Enter Name
                </label>
                <input
                  className={`w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
                    fieldErrors.name
                      ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                      : 'border-slate-200 focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber'
                  }`}
                  id="name"
                  name="name"
                  placeholder="Enter Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-slate-500 font-normal">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Field 2: Enter Email Id */}
              <div>
                <label className="block text-[11px] font-semibold text-brand-navy mb-1" htmlFor="email">
                  Enter Email Id
                </label>
                <input
                  className={`w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
                    fieldErrors.email
                      ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                      : 'border-slate-200 focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber'
                  }`}
                  id="email"
                  name="email"
                  placeholder="Enter Email Id"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-slate-500 font-normal">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Field 3: Enter Password */}
              <div>
                <label className="block text-[11px] font-semibold text-brand-navy mb-1" htmlFor="password">
                  Enter Password
                </label>
                <input
                  className={`w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
                    fieldErrors.password
                      ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                      : 'border-slate-200 focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber'
                  }`}
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-slate-500 font-normal">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Field 4: Re-Enter Password */}
              <div>
                <label className="block text-[11px] font-semibold text-brand-navy mb-1" htmlFor="re_password">
                  Re-Enter Password
                </label>
                <input
                  className={`w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
                    fieldErrors.re_password
                      ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                      : 'border-slate-200 focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber'
                  }`}
                  id="re_password"
                  name="re_password"
                  placeholder="Re-Enter Password"
                  type="password"
                  value={formData.re_password}
                  onChange={handleChange}
                />
                {fieldErrors.re_password && (
                  <p className="mt-1 text-xs text-slate-500 font-normal">
                    {fieldErrors.re_password}
                  </p>
                )}
              </div>

              {/* Primary Action Button */}
              <div className="pt-1">
                <button
                  className={`w-full min-h-[44px] py-2.5 text-white font-semibold text-sm rounded-xl shadow-glow-warm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer ${
                    submitting
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-amber to-[#F59E0B] hover:from-[#e29900] hover:to-[#df8b00]'
                  }`}
                  data-purpose="submit-button"
                  type="submit"
                  disabled={submitting}
                >
                  <span>{submitting ? 'Creating Account...' : 'SIGN UP'}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
              </div>
            </form>
          </section>

          {/* Right Column: Visual Composition */}
          <section className="hidden lg:flex lg:col-span-6 relative items-center justify-center w-full" data-purpose="hero-visual-showcase">
            <div className="relative w-full max-w-[520px] aspect-[4/4.2] flex items-center justify-center">
              <div className="relative z-10 w-full max-w-[420px] h-[85%] mx-auto overflow-hidden rounded-3xl shadow-xl border border-white/80 bg-white">
                <img
                  alt="Supply chain operations lead managing smart warehouse with scanner terminal"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgEHuAUMOJZF0TlbRUCKFog5eY4DQ5YDnmUPDNlMNDQK8nDir_Pg7wFyoKMH3NUfb-aJkR0cI9pMDv9CBaZ7kahwyOI23ToSnptOpP2LNh8BXR8iAPgqcKUQH6Tk_pvQjDJ7VS6tpU5haVImYGUeHd_-cGMHy6d-aOHuft-ZHNzU7URnd0y4DB-AxA6ZOJJzBbkqoOPKeg5vb8jImKbIl5vSkfwPs5E2p81Eurt_KHb76Ug154JCyQaQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <div className="text-[10px] font-semibold tracking-wider text-amber-300 uppercase mb-0.5">Live Operations Hub</div>
                  <p className="text-xs font-medium leading-snug">"Cycle count variances dropped to 0.02% within 14 days of pilot deployment."</p>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <aside className="absolute -top-2 -right-2 sm:-right-3 z-20 bg-white p-3 rounded-2xl shadow-float-card border border-slate-100 flex items-center gap-2.5" data-purpose="metric-badge-top">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-brand-coral flex items-center justify-center font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-brand-navy">12,400+ Docks</div>
                  <div className="text-[9px] text-brand-softGray">Automated Globally</div>
                </div>
              </aside>

              {/* Floating Badge 2: Lower Left */}
              <aside className="absolute -bottom-2 -left-2 sm:bottom-3 sm:-left-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-float-card border border-slate-100 max-w-[200px]" data-purpose="metric-badge-bottom">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">99.98% Accuracy</span>
                </div>
                <p className="text-[11px] text-brand-navy font-semibold leading-tight">
                  Immutable pallet tracking via RFID.
                </p>
              </aside>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-100 bg-white/60 backdrop-blur-sm mt-1 py-2.5 px-4 sm:px-8 lg:px-14 xl:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-[11px] text-brand-softGray text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <svg className="w-3.5 h-3.5 text-brand-amber" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" fillRule="evenodd"></path>
              </svg>
              SOC 2 Type II Certified
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <svg className="w-3.5 h-3.5 text-brand-amber" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
              </svg>
              ISO 9001 &amp; 27001
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <svg className="w-3.5 h-3.5 text-brand-amber" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
              </svg>
              SAP &amp; Oracle Certified
            </div>
          </div>
          <div className="text-center md:text-right">
            <span>© 2026 StockSense Enterprise Technologies Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
