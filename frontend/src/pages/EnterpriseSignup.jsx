import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StockSenseLogo from '../components/StockSenseLogo';

const API_URL = 'http://localhost:8000/api/auth';

export default function EnterpriseSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    setSubmitted(true);
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

    // 3. Password Validation (Single line message as requested)
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
      setSubmitted(false);
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
    <div className="bg-white text-slate-800 font-sans antialiased relative selection:bg-amber-100 selection:text-amber-900 min-h-screen flex flex-col overflow-x-hidden">
      {/* Ambient background glows */}
      <div aria-hidden="true" className="ambient-glow-left"></div>
      <div aria-hidden="true" className="curved-blob-bg"></div>

      {/* Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3" data-purpose="site-brand">
            <Link className="flex items-center gap-2 group" to="/">
              <StockSenseLogo className="h-9 sm:h-11" />
            </Link>
          </div>

          <div className="flex items-center gap-4 text-[15px]">
            <span className="hidden sm:inline text-brand-softGray font-normal">Already have an account?</span>
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
        {/* Left Column: Sign Up Form */}
        <section className="lg:col-span-7 flex flex-col justify-center" data-purpose="registration-section">
          <div className="mb-3">
            <span className="uppercase tracking-widest text-xs font-bold text-brand-coral">
              StockSense User Registration
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] leading-[1.18] font-bold text-brand-navy tracking-tight mb-4 font-serif">
            Streamline & empower <span className="custom-underline px-1">your warehouse</span> operations.
          </h1>

          <p className="text-base sm:text-lg text-brand-softGray mb-6 leading-relaxed max-w-xl font-normal">
            Sign up below to access your StockSense inventory system.
          </p>

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-5 max-w-xl p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-4 max-w-xl bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm" data-purpose="signup-form" onSubmit={handleSubmit} noValidate>
            
            {/* Field 1: Enter Name */}
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5" htmlFor="name">
                Enter Name
              </label>
              <input
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
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
              <label className="block text-xs font-semibold text-brand-navy mb-1.5" htmlFor="email">
                Enter Email Id
              </label>
              <input
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
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
              <label className="block text-xs font-semibold text-brand-navy mb-1.5" htmlFor="password">
                Enter Password
              </label>
              <input
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
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
              <label className="block text-xs font-semibold text-brand-navy mb-1.5" htmlFor="re_password">
                Re-Enter Password
              </label>
              <input
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
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
            <div className="pt-3">
              <button
                className={`w-full py-3.5 text-white font-semibold text-sm rounded-xl shadow-glow-warm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer ${
                  submitting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-amber to-[#F59E0B] hover:from-[#e29900] hover:to-[#df8b00]'
                }`}
                data-purpose="submit-button"
                type="submit"
                disabled={submitting}
              >
                <span>{submitting ? 'Signing up...' : 'SIGN UP'}</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Visual Showcase */}
        <section className="lg:col-span-5 relative flex items-center justify-center" data-purpose="hero-visual-showcase">
          <div className="relative w-full max-w-md lg:max-w-none">
            <div className="relative z-10 mx-auto overflow-hidden rounded-3xl shadow-float-card border border-white/80 bg-white">
              <img
                alt="Warehouse operations lead"
                className="w-full h-[470px] object-cover object-center transform hover:scale-102 transition duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgEHuAUMOJZF0TlbRUCKFog5eY4DQ5YDnmUPDNlMNDQK8nDir_Pg7wFyoKMH3NUfb-aJkR0cI9pMDv9CBaZ7kahwyOI23ToSnptOpP2LNh8BXR8iAPgqcKUQH6Tk_pvQjDJ7VS6tpU5haVImYGUeHd_-cGMHy6d-aOHuft-ZHNzU7URnd0y4DB-AxA6ZOJJzBbkqoOPKeg5vb8jImKbIl5vSkfwPs5E2p81Eurt_KHb76Ug154JCyQaQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-xs font-semibold tracking-wider text-amber-300 uppercase mb-1">Live Operations Hub</div>
                <p className="text-sm font-medium leading-snug">"Cycle count variances dropped to 0.02% within 14 days of pilot deployment."</p>
              </div>
            </div>

            <aside className="absolute -top-6 -right-4 sm:-right-6 z-20 bg-white p-3.5 rounded-2xl shadow-float-card border border-slate-100 flex items-center gap-3">
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

            <aside className="absolute -bottom-6 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-float-card border border-slate-100 max-w-[260px]">
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
          </div>
        </section>
      </main>
    </div>
  );
}
