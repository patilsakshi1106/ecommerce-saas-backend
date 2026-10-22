import React, { useState } from 'react';
import { RoleSelector, authService } from '../App.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ShoppingRegister({
  selectedRole,
  onChangeRole,
  onNavigateLogin,
  sharedDraft,
  setSharedDraft,
}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [registeredData, setRegisteredData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateDraftField = (key, value) => {
    setSharedDraft((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validateShopperForm = () => {
    const nextErrors = {};
    if (!sharedDraft.name.trim()) {
      nextErrors.name = 'Full name is required.';
    }
    if (!sharedDraft.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(sharedDraft.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!acceptedTerms) {
      nextErrors.acceptedTerms = 'You must accept the MAISON Terms & Conditions.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleShopperSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setRegisteredData(null);

    if (!validateShopperForm()) return;

    setIsSubmitting(true);
    try {
      const response = await authService.registerShopper({
        name: sharedDraft.name,
        email: sharedDraft.email,
        password,
      });

      setRegisteredData(response);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setServerError(
        err.message === 'Failed to fetch'
          ? 'Could not reach POST /api/auth/customer/signup. Please verify your Express server is running.'
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="maison-auth-shell">
      {/* LEFT PANEL: B2C SHOPPER EDITORIAL SHOWCASE */}
      <aside className="maison-editorial-panel">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
          alt="MAISON Personal Shopping Curation"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/70 to-[#141210]/30" />

        <div className="relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase border border-[#9A5B3E] text-[#FAF7F2] bg-[#9A5B3E]/40 backdrop-blur-sm">
            Personal Account • Shopper (B2C)
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-medium leading-[1.1] mt-5 text-[#FAF7F2]">
            Curated Indian Craftsmanship, Delivered to Your Door.
          </h1>
          <p className="text-sm text-[#E5DEC9]/85 mt-4 max-w-md leading-relaxed">
            Create a personal MAISON Shopper account to explore limited-edition collections directly from independent Indian ateliers and flagship boutiques.
          </p>
        </div>

        <div className="relative z-10 mt-10 p-5 rounded-2xl bg-black/40 border border-[#E5DEC9]/20 backdrop-blur-md">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#CDA76E]">
            Looking to Sell or Buy Wholesale Instead?
          </div>
          <p className="text-xs text-[#E5DEC9]/80 mt-1 mb-3">
            Switch to a Startup, Retailer, or Merchant account to unlock GST-verified wholesale trade and catalogue tools.
          </p>
          <button
            type="button"
            onClick={() => onChangeRole('startup')}
            className="text-xs font-semibold uppercase tracking-wider text-white underline underline-offset-4 hover:text-[#CDA76E]"
          >
            Switch to Business Registration →
          </button>
        </div>
      </aside>

      {/* RIGHT PANEL: REGISTRATION FORM WITH 4-ROLE SELECTOR */}
      <section className="maison-form-panel">
        <div className="max-w-xl w-full mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A5B3E] dark:text-[#C87D5B]">
                Account Onboarding • Step 1 of 1
              </span>
              <h2 className="font-editorial text-4xl font-semibold mt-0.5">
                Create Your Shopper Account
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#9A5B3E]/15 text-[#9A5B3E] dark:text-[#C87D5B]">
              Regular Shopping Account
            </span>
          </div>

          {/* 4-Account Type Selector (Shopper, Startup, Retailer, Merchant) */}
          <RoleSelector selectedRole={selectedRole} onChangeRole={onChangeRole} />

          {/* Backend Error Banner */}
          {serverError && (
            <div
              role="alert"
              className="mb-5 p-4 rounded-xl bg-[#B93829]/10 border border-[#B93829] text-xs text-[#B93829] dark:text-[#E05A47]"
            >
              <strong className="block font-semibold uppercase tracking-wider mb-0.5">
                Registration Error
              </strong>
              {serverError}
            </div>
          )}

          {/* Real Backend Registration Success Banner */}
          {registeredData && (
            <div
              role="status"
              className="mb-5 p-4 rounded-xl bg-[#2E4F3E]/15 border border-[#2E4F3E] text-xs"
            >
              <strong className="block font-semibold text-[#2E4F3E] dark:text-[#68A688] uppercase tracking-wider mb-1">
                ✓ {registeredData.message}
              </strong>
              <p className="text-[#57524B] dark:text-[#B8B0A4] mb-2">
                Account created for <strong>{registeredData.data?.name}</strong> (
                {registeredData.data?.email}).
              </p>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF7F2] dark:bg-[#F5F0E6] dark:text-[#141210] text-[11px] font-semibold uppercase tracking-wider"
              >
                Proceed to Sign In →
              </button>
            </div>
          )}

          <form onSubmit={handleShopperSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="shopper-name"
                className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
              >
                Full Name *
              </label>
              <input
                id="shopper-name"
                type="text"
                autoComplete="name"
                value={sharedDraft.name}
                onChange={(e) => updateDraftField('name', e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className={`maison-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="shopper-email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
              >
                Email Address *
              </label>
              <input
                id="shopper-email"
                type="email"
                autoComplete="email"
                value={sharedDraft.email}
                onChange={(e) => updateDraftField('email', e.target.value)}
                placeholder="ananya@example.com"
                className={`maison-input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="shopper-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="shopper-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Min. 6 characters"
                    className={`maison-input pr-14 ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase text-[#57524B] dark:text-[#B8B0A4]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="shopper-confirm-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="shopper-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Re-enter password"
                    className={`maison-input pr-14 ${
                      errors.confirmPassword ? 'input-error' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase text-[#57524B] dark:text-[#B8B0A4]"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#57524B] dark:text-[#B8B0A4]">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (errors.acceptedTerms)
                      setErrors({ ...errors, acceptedTerms: '' });
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-[#CEC4B0] text-[#9A5B3E] focus:ring-[#9A5B3E]"
                />
                <span>
                  I agree to MAISON’s{' '}
                  <strong className="text-[#1C1917] dark:text-[#F5F0E6]">
                    Terms of Service
                  </strong>{' '}
                  and{' '}
                  <strong className="text-[#1C1917] dark:text-[#F5F0E6]">
                    Privacy Policy
                  </strong>{' '}
                  for personal shopping accounts.
                </span>
              </label>
              {errors.acceptedTerms && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                  {errors.acceptedTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-[#9A5B3E] hover:bg-[#7F482F] text-white text-xs font-semibold uppercase tracking-[0.14em] disabled:opacity-60 transition flex items-center justify-center gap-2.5 mt-2"
            >
              {isSubmitting && <span className="maison-spinner" />}
              <span>
                {isSubmitting ? 'Creating Shopper Account...' : 'Create Shopper Account'}
              </span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5DEC9] dark:border-[#332E28] flex items-center justify-between text-xs text-[#57524B] dark:text-[#B8B0A4]">
            <span>Already have a MAISON account?</span>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-semibold text-[#1C1917] dark:text-[#F5F0E6] hover:underline"
            >
              Sign In Here →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}