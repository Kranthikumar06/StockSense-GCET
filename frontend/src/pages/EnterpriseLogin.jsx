import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StockSenseLogo from '../components/StockSenseLogo';

const API_URL = 'http://localhost:8000/api/auth';

export default function EnterpriseLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!formData.email || !formData.password) {
      setLoginError('Please enter your email/name and password.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setLoginError(err.response.data.detail);
      } else {
        setLoginError('Invalid credentials or backend server unreachable.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-lightBg text-brand-dark antialiased font-sans min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-brand-amber selection:text-white">
      {/* Background Aesthetics */}
      <div aria-hidden="true" className="blob-corner-decal opacity-90 hidden lg:block"></div>
      <div aria-hidden="true" className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-purple-100 rounded-full blur-3xl opacity-40 sm:opacity-50 pointer-events-none"></div>
      <div aria-hidden="true" className="absolute top-1/3 right-4 sm:right-10 w-60 h-60 sm:w-80 sm:h-80 bg-orange-100 rounded-full blur-3xl opacity-50 sm:opacity-60 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 pt-4 sm:pt-5 pb-2">
        <div className="flex items-center justify-between">
          <Link className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brand-amber rounded-lg py-1 px-1 transition" to="/">
            <StockSenseLogo className="h-7 sm:h-9 md:h-10" />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-brand-dark hover:text-white border border-brand-dark/80 hover:border-brand-dark hover:bg-brand-dark rounded-xl transition duration-200 shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full">
          {/* Left Column: Enterprise Login */}
          <div className="lg:col-span-6 w-full max-w-md sm:max-w-lg mx-auto lg:mx-0" data-purpose="auth-container">
            <div className="inline-flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-xs font-extrabold tracking-wider uppercase text-brand-orange">
                INTELLIGENT SUPPLY CHAIN &amp; WMS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-brand-dark tracking-tight leading-tight mb-1.5 sm:mb-2">
              Log in, <span className="text-brand-orange underline decoration-brand-orange/40 decoration-wavy underline-offset-4">optimize</span> and take control of your warehouse.
            </h1>

            <p className="text-xs sm:text-[13px] text-brand-muted leading-relaxed mb-4 sm:mb-5 font-normal">
              Access real-time stock telemetry, automated inbound sorting, and compliance suite.
            </p>

            {/* Error Banner */}
            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form Card */}
            <div className="bg-white/95 sm:bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl p-4 sm:p-6 shadow-float-card transition-all">
              <form className="space-y-3 sm:space-y-3.5" onSubmit={handleSubmit} noValidate>
                {/* Email / Name Field */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-dark mb-1" htmlFor="work-email">
                    Enterprise Email or Name
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
                      placeholder="name@company.com or User Name"
                      required
                      type="text"
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
                    className={`w-full min-h-[44px] py-2.5 px-5 rounded-xl text-white font-semibold text-sm tracking-wide shadow-glow-orange hover:shadow-md transition duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-brand-amber to-[#F59000] hover:from-[#e59b00] hover:to-[#e08300]'
                    }`}
                    type="submit"
                    disabled={submitting}
                  >
                    <span>{submitting ? 'Authenticating...' : 'Sign In to Terminal'}</span>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                    </svg>
                  </button>
                </div>
              </form>

              {/* Bottom Switch Link */}
              <div className="mt-3.5 pt-3 border-t border-stone-100 text-center">
                <p className="text-xs text-brand-muted">
                  Don't have an account yet?{' '}
                  <Link className="font-bold text-brand-dark hover:text-brand-orange underline underline-offset-2 ml-1 transition" to="/signup">
                    Create New Account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="hidden lg:flex lg:col-span-6 relative items-center justify-center w-full" data-purpose="hero-imagery-composition">
            <div className="relative w-full max-w-[520px] aspect-[4/4.2] flex items-center justify-center">
              <div className="absolute inset-0 organic-blob-bg scale-105 opacity-90"></div>
              
              <div className="relative z-10 w-full max-w-[420px] h-[85%] rounded-3xl overflow-hidden shadow-xl border-4 border-white/90 bg-stone-100">
                <img
                  alt="Warehouse logistics manager conducting real-time stock telemetry"
                  className="w-full h-full object-cover object-top filter brightness-95 contrast-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzmP1AzRu98gyYTaH6FnhUtDxJ3ochp340UrzRBn6rb0IJHgPcEz_CXMe8BvEn_W7wZaJAZlvTXQKYykkurS8zTAo4zQnvev_VkvYeze69HxIDspewP2nrubM9y8-amdmp_GSNjRPvhWJWIQcKXKwwwPDz191iDH-SFUJZBvrtx2JX-qtQV7v5N2ju14tW1ZJ1_x8SEFFWsi_1cndBrt7GDcCC_AIZ3TE2bxTivvMuFOgXE89fCT-_lQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-amber">Global Distribution Hub 04</p>
                  <h2 className="text-xs sm:text-sm font-bold tracking-tight">StockSense Operations Terminal</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
