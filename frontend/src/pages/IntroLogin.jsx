import React, { useState } from 'react';
import { authService } from '../App.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PLATFORM_PILLARS = [
  {
    title: 'Discerning Shoppers',
    badge: 'B2C Personal Curation',
    desc: 'Bypass retail markups and order authentic handloom textiles, stonewares, and botanical apothecary directly from regional Indian ateliers.',
    actionRole: 'shopper',
  },
  {
    title: 'Startup Founders',
    badge: 'Brand Incubation',
    desc: 'Launch your independent label with low-MOQ wholesale batches, bespoke packaging supplies, and verified manufacturing partners.',
    actionRole: 'startup',
  },
  {
    title: 'Retail Store Buyers',
    badge: 'Wholesale Procurement',
    desc: 'Source high-margin regional collections and verified supplier catalogues for your single boutique or multi-store retail chain.',
    actionRole: 'retailer',
  },
  {
    title: 'Supply Merchants',
    badge: 'Catalogue Distribution',
    desc: 'Showcase your manufacturing output, manage wholesale inventory tiers, and connect directly with verified retail buyers across India.',
    actionRole: 'merchant',
  },
];

export default function IntroLogin({ onStartShopping, onStartBusiness, onSelectRole }) {
  const [accountCategory, setAccountCategory] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ type: '', message: '' });
  const [isResetting, setIsResetting] = useState(false);

  const validateLogin = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setAuthenticatedUser(null);

    if (!validateLogin()) return;

    setIsSubmitting(true);
    try {
      const response = await authService.login(accountCategory, { email, password });
      setAuthenticatedUser({
        message: response.message,
        user: response.data,
        accountCategory,
      });
      setPassword('');
    } catch (err) {
      setServerError(
        err.message === 'Failed to fetch'
          ? 'Unable to reach the MAISON authentication server. Please verify your Express backend is running.'
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetStatus({ type: '', message: '' });

    if (!resetEmail.trim() || !EMAIL_REGEX.test(resetEmail.trim())) {
      setResetStatus({
        type: 'error',
        message: 'Please enter a valid registered email address.',
      });
      return;
    }

    setIsResetting(true);
    try {
      const res = await authService.requestPasswordReset(resetEmail);
      setResetStatus({
        type: 'success',
        message: res.message || 'Password recovery instructions have been dispatched.',
      });
    } catch (err) {
      setResetStatus({
        type: 'error',
        message:
          err.message === 'Failed to fetch'
            ? 'Cannot connect to backend server. Note: POST /api/auth/forgot-password is not yet implemented in the Express auth controller.'
            : err.message,
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO INTRODUCTION & EDITORIAL NARRATIVE */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-8 border-b border-[#E5DEC9] dark:border-[#332E28]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase border border-[#B08D57]/40 text-[#B08D57] bg-[#B08D57]/10">
              MAISON • India’s Premier B2B &amp; B2C Commerce Ecosystem
            </span>

            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-[64px] font-medium leading-[1.05] tracking-tight">
              Where Independent Craft Ateliers Meet <em className="text-[#9A5B3E] dark:text-[#C87D5B] italic font-normal">Modern Commerce.</em>
            </h1>

            <p className="text-base sm:text-lg text-[#57524B] dark:text-[#B8B0A4] max-w-2xl leading-relaxed">
              MAISON bridges the gap between regional manufacturers, ambitious startup founders, boutique retail buyers, and daily shoppers under a single quiet-luxury digital roof.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStartShopping}
                className="px-7 py-3.5 rounded-full bg-[#9A5B3E] hover:bg-[#7F482F] text-white text-xs font-semibold uppercase tracking-[0.15em] shadow-sm transition"
              >
                Start Shopping (B2C) →
              </button>
              <button
                type="button"
                onClick={() => onStartBusiness('startup')}
                className="px-7 py-3.5 rounded-full bg-[#2E4F3E] hover:opacity-95 text-white text-xs font-semibold uppercase tracking-[0.15em] shadow-sm transition"
              >
                Start Your Online Business (B2B) →
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5">
            <div className="p-3 rounded-3xl bg-white dark:bg-[#211E1A] border border-[#E5DEC9] dark:border-[#332E28] shadow-sm">
              <div className="relative h-[420px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
                  alt="MAISON Atelier Showcase"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-[#FAF7F2]">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#CDA76E]">
                    Flagship Design Hub • Jaipur &amp; Mumbai
                  </span>
                  <p className="font-editorial text-2xl mt-1">
                    “Engineered with enterprise precision, presented like a Parisian gallery.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM PILLARS (WHO MAISON IS FOR) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9A5B3E] dark:text-[#C87D5B]">
            Four Dedicated Portals
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-semibold mt-1">
            Built for Every Tier of Commerce
          </h2>
          <p className="text-sm text-[#57524B] dark:text-[#B8B0A4] mt-2">
            Select an account stream below to experience MAISON’s tailored workflows.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="p-7 rounded-3xl bg-white dark:bg-[#211E1A] border border-[#E5DEC9] dark:border-[#332E28] shadow-sm flex flex-col justify-between hover:border-[#B08D57] transition-all group"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#F3EDE2] dark:bg-[#1C1916] text-[#57524B] dark:text-[#B8B0A4] mb-4">
                  {pillar.badge}
                </span>
                <h3 className="font-editorial text-2xl font-semibold group-hover:text-[#9A5B3E] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#57524B] dark:text-[#B8B0A4] mt-2.5 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectRole(pillar.actionRole)}
                className="mt-6 pt-4 border-t border-[#E5DEC9] dark:border-[#332E28] text-xs font-semibold uppercase tracking-wider text-[#9A5B3E] dark:text-[#C87D5B] flex items-center justify-between group-hover:translate-x-1 transition-transform"
              >
                <span>Register / Onboard</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SPLIT AUTHENTICATION LOGIN SECTION (Connected to Express backend) */}
      <section id="auth-gateway" className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="maison-auth-shell rounded-3xl overflow-hidden border border-[#E5DEC9] dark:border-[#332E28] shadow-sm bg-white dark:bg-[#211E1A]">
          {/* Left Panel: Intro Editorial Card */}
          <aside className="maison-editorial-panel !p-10 justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#CDA76E]">
              Secure Authentication Gateway
            </span>
            <h2 className="font-editorial text-4xl font-medium mt-3 text-white">
              Already Part of the MAISON Collective?
            </h2>
            <p className="text-sm text-[#E5DEC9]/80 mt-3 leading-relaxed">
              Sign in to manage your orders, wholesale allocations, or supplier inventory levels with instantaneous database verification.
            </p>

            <div className="mt-8 pt-6 border-t border-[#E5DEC9]/20 flex flex-col gap-3">
              <span className="text-xs text-[#E5DEC9]">Need to create a new account?</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onStartShopping}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider text-white transition"
                >
                  + Shopper Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => onStartBusiness('startup')}
                  className="px-4 py-2 rounded-full bg-[#2E4F3E] hover:opacity-90 text-xs font-semibold uppercase tracking-wider text-white transition"
                >
                  + Business / GST Sign Up
                </button>
              </div>
            </div>
          </aside>

          {/* Right Panel: Login Form */}
          <section className="maison-form-panel !p-8 sm:!p-12">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9A5B3E] dark:text-[#C87D5B]">
                  Member Portal
                </span>
                <h3 className="font-editorial text-3xl font-semibold mt-1">
                  Sign In
                </h3>
              </div>

              {/* Portal Selector */}
              <div className="mb-6">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#57524B] dark:text-[#B8B0A4] mb-2">
                  Select Portal Stream
                </label>
                <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F3EDE2] dark:bg-[#1C1916] border border-[#E5DEC9] dark:border-[#332E28] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountCategory('customer');
                      setServerError('');
                    }}
                    className={`py-2 px-3 rounded-lg transition ${
                      accountCategory === 'customer'
                        ? 'bg-[#1C1917] text-[#FAF7F2] dark:bg-[#F5F0E6] dark:text-[#141210] shadow-sm'
                        : 'text-[#57524B] dark:text-[#B8B0A4]'
                    }`}
                  >
                    Shopper (B2C)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountCategory('merchant');
                      setServerError('');
                    }}
                    className={`py-2 px-3 rounded-lg transition ${
                      accountCategory === 'merchant'
                        ? 'bg-[#1C1917] text-[#FAF7F2] dark:bg-[#F5F0E6] dark:text-[#141210] shadow-sm'
                        : 'text-[#57524B] dark:text-[#B8B0A4]'
                    }`}
                  >
                    Business (B2B)
                  </button>
                </div>
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="mb-5 p-4 rounded-xl bg-[#B93829]/10 border border-[#B93829] text-xs text-[#B93829] dark:text-[#E05A47]"
                >
                  <strong className="block font-semibold uppercase tracking-wider mb-0.5">
                    Sign-In Error
                  </strong>
                  {serverError}
                </div>
              )}

              {authenticatedUser && (
                <div
                  role="status"
                  className="mb-5 p-4 rounded-xl bg-[#2E4F3E]/15 border border-[#2E4F3E] text-xs"
                >
                  <strong className="block font-semibold text-[#2E4F3E] dark:text-[#68A688] uppercase tracking-wider mb-1">
                    ✓ {authenticatedUser.message}
                  </strong>
                  <p className="text-[#57524B] dark:text-[#B8B0A4]">
                    Signed in as <strong>{authenticatedUser.user?.name}</strong> (
                    {authenticatedUser.user?.email})
                  </p>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="intro-login-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="intro-login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    placeholder="you@domain.com"
                    className={`maison-input ${fieldErrors.email ? 'input-error' : ''}`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="intro-login-password"
                      className="text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(!showForgotModal)}
                      className="text-xs font-medium text-[#9A5B3E] dark:text-[#C87D5B] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="intro-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password)
                          setFieldErrors({ ...fieldErrors, password: '' });
                      }}
                      placeholder="Enter password"
                      className={`maison-input pr-16 ${
                        fieldErrors.password ? 'input-error' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-[#57524B] dark:text-[#B8B0A4]"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#1C1917] text-[#FAF7F2] dark:bg-[#F5F0E6] dark:text-[#141210] text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2.5 mt-2"
                >
                  {isSubmitting && <span className="maison-spinner" />}
                  <span>
                    {isSubmitting
                      ? 'Signing In...'
                      : accountCategory === 'merchant'
                      ? 'Sign In to Business Portal'
                      : 'Sign In to Shopping Account'}
                  </span>
                </button>
              </form>

              {showForgotModal && (
                <div className="mt-5 p-4 rounded-2xl bg-[#F3EDE2] dark:bg-[#1C1916] border border-[#E5DEC9] dark:border-[#332E28]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-editorial text-lg font-semibold">Password Recovery</h3>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="text-xs text-[#8A8277]"
                    >
                      ✕ Close
                    </button>
                  </div>
                  {resetStatus.message && (
                    <div className="p-2.5 rounded-lg text-xs mb-3 border border-[#B93829] text-[#B93829]">
                      {resetStatus.message}
                    </div>
                  )}
                  <form onSubmit={handleForgotPasswordSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Registered email"
                      className="maison-input text-xs py-2"
                    />
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="px-4 py-2 rounded-xl bg-[#9A5B3E] text-white text-xs font-semibold uppercase tracking-wider shrink-0"
                    >
                      {isResetting ? '...' : 'Send'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}