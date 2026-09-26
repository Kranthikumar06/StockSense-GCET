import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import StockSenseLogo from '../components/StockSenseLogo';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const API_URL = 'http://localhost:8000/api/auth';

export default function EnterpriseLogin() {
  const navigate = useNavigate();
  const { loading: googleLoading, error: googleError, handleGoogleSuccess, handleGoogleError } = useGoogleAuth(() => {
    navigate('/dashboard');
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [resetStatusMsg, setResetStatusMsg] = useState(null);
  const [resetErrorMsg, setResetErrorMsg] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setResetErrorMsg(null);
    setResetStatusMsg(null);
    if (!resetEmail) {
      setResetErrorMsg('Please enter your account email address.');
      return;
    }
    setResetLoading(true);
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email: resetEmail.trim() });
      setResetStatusMsg(res.data.message);
      setOtpCode('');
      setForgotStep(2);
    } catch (err) {
      setResetErrorMsg(err.response?.data?.detail || 'Failed to request OTP code.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setResetErrorMsg(null);
    setResetStatusMsg(null);
    if (!otpCode) {
      setResetErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }
    setResetLoading(true);
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, { email: resetEmail.trim(), otp_code: otpCode.trim() });
      setResetStatusMsg(res.data.message);
      setForgotStep(3);
    } catch (err) {
      setResetErrorMsg(err.response?.data?.detail || 'Invalid or expired OTP code.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetErrorMsg(null);
    setResetStatusMsg(null);
    if (!newPassword || newPassword !== rePassword) {
      setResetErrorMsg('Passwords do not match or are blank.');
      return;
    }
    setResetLoading(true);
    try {
      const res = await axios.post(`${API_URL}/reset-password`, {
        email: resetEmail.trim(),
        otp_code: otpCode,
        new_password: newPassword,
        re_password: rePassword,
      });
      setResetStatusMsg(res.data.message);
      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotStep(1);
        setResetEmail('');
        setOtpCode('');
        setNewPassword('');
        setRePassword('');
      }, 2500);
    } catch (err) {
      setResetErrorMsg(err.response?.data?.detail || 'Password reset failed.');
    } finally {
      setResetLoading(false);
    }
  };

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
            <span className="hidden sm:inline text-brand-softGray text-xs sm:text-sm font-normal">Don't have an account?</span>
            <Link
              to="/signup"
              className="font-medium text-brand-navy border border-slate-300 hover:border-brand-navy px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all hover:bg-slate-50 shadow-sm"
              data-purpose="sign-up-action"
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
          <section className="lg:col-span-6 w-full max-w-md sm:max-w-lg mx-auto lg:mx-0 flex flex-col justify-center" data-purpose="auth-container">
            <div className="mb-1.5 sm:mb-2">
              <span className="uppercase tracking-widest text-[10px] sm:text-xs font-bold text-brand-coral">
                User Sign In
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[32px] leading-tight font-bold text-brand-navy tracking-tight mb-1.5 sm:mb-2 font-serif">
              Streamline &amp; empower <span className="custom-underline px-1">your warehouse</span> operations.
            </h1>

            <p className="text-xs sm:text-[13px] text-brand-softGray mb-4 sm:mb-5 leading-relaxed font-normal">
              Sign in below to access your StockSense inventory management system.
            </p>

            {/* Error Banner */}
            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form Card */}
            <form className="space-y-3 sm:space-y-3.5 bg-white/95 sm:bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-float-card" onSubmit={handleSubmit} noValidate>
              {/* Field 1: Enter Email or Name */}
              <div>
                <label className="block text-[11px] font-semibold text-brand-navy mb-1" htmlFor="work-email">
                  Enter Email or Name
                </label>
                <input
                  className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors text-slate-800 placeholder:text-slate-400"
                  id="work-email"
                  name="email"
                  placeholder="Enter Email or Name"
                  required
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Field 2: Enter Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-brand-navy" htmlFor="password">
                    Enter Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotStep(1);
                      setResetErrorMsg(null);
                      setResetStatusMsg(null);
                    }}
                    className="text-xs font-semibold text-brand-amber hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors text-slate-800 placeholder:text-slate-400"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  required
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    className="w-4 h-4 rounded text-brand-amber border-slate-300 focus:ring-brand-amber transition cursor-pointer"
                    name="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span className="text-xs text-brand-softGray font-normal">Remember this terminal</span>
                </label>
              </div>

              {/* Submit Button */}
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
                  <span>{submitting ? 'Authenticating...' : 'SIGN IN'}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3 sm:my-3.5">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] font-semibold uppercase text-brand-softGray tracking-widest absolute">
                  Or Continue With
                </span>
              </div>

                {/* Google Auth Error State */}
                {googleError && (
                  <div className="p-2.5 mb-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{googleError}</span>
                  </div>
                )}

                {/* Google Sign In Button */}
                <div className="w-full flex justify-center">
                  {googleLoading ? (
                    <div className="py-2 text-xs font-semibold text-stone-500 animate-pulse flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin text-brand-amber" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      <span>Authenticating with Google...</span>
                    </div>
                  ) : (
                    <div className="w-full flex justify-center [&>div]:w-full">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          if (credentialResponse.credential) {
                            handleGoogleSuccess(credentialResponse.credential);
                          }
                        }}
                        onError={handleGoogleError}
                        text="signin_with"
                        shape="rectangular"
                        theme="outline"
                        size="large"
                        width="100%"
                      />
                    </div>
                  )}
                </div>
              </form>
          </section>

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

      {/* Forgot Password Modal Overlay */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">Reset Password (OTP Verification)</h3>
              <p className="text-xs text-slate-500 mt-1">
                {forgotStep === 1 && 'Enter your registered account email to receive a 6-digit OTP code.'}
                {forgotStep === 2 && 'Enter the 6-digit OTP code sent to your email.'}
                {forgotStep === 3 && 'Set a new secure password for your StockSense account.'}
              </p>
            </div>

            {resetErrorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                ⚠️ {resetErrorMsg}
              </div>
            )}

            {resetStatusMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
                ✅ {resetStatusMsg}
              </div>
            )}

            {/* Step 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors"
                >
                  {resetLoading ? 'Generating OTP...' : 'Send OTP Code'}
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 849201"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-2/3 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors"
                  >
                    {resetLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors mt-2"
                >
                  {resetLoading ? 'Updating...' : 'Update Password & Login'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
