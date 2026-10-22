import React, { useState } from 'react';
import { RoleSelector, ROLE_DEFINITIONS, authService } from '../App.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BUSINESS_CATEGORIES = [
  'Apparel, Silk & Heritage Textiles',
  'Fine Leather & Handcrafted Footwear',
  'Architectural Ceramics & Home Decor',
  'Botanical Apothecary & Personal Care',
  'Bespoke Rigid & Sustainable Packaging',
  'Multi-Category Concept / Department Store',
];

const ROLE_SPECIFIC_CONFIG = {
  startup: {
    heading: 'Register Your Startup Brand',
    badge: 'Startup Onboarding • Low-MOQ Trade Access',
    storeLabel: 'Startup / Brand Name *',
    storePlaceholder: 'e.g. Studio Aranya',
    detailLabel: 'Current Brand Stage *',
    detailOptions: [
      'Pre-Launch / Sampling Stage',
      'Early D2C Brand (< 1 Year)',
      'Scaling Independent Label (1–3 Years)',
    ],
  },
  retailer: {
    heading: 'Register Your Retail Business',
    badge: 'Retailer Onboarding • Wholesale Buyer Desk',
    storeLabel: 'Retail Store / Boutique Name *',
    storePlaceholder: 'e.g. The Courtyard Edit',
    detailLabel: 'Retail Format & Sourcing Volume *',
    detailOptions: [
      'Single Flagship Boutique (₹1L–₹5L / mo)',
      'Multi-Store Retail Chain (₹5L+ / mo)',
      'Online Multi-Brand Marketplace',
    ],
  },
  merchant: {
    heading: 'Register as a Supply Merchant',
    badge: 'Merchant Onboarding • Catalogue & Wholesale Supplier',
    storeLabel: 'Merchant / Manufacturing House Name *',
    storePlaceholder: 'e.g. Zari & Loom Heritage Mills',
    detailLabel: 'Primary Supply Type & Minimum Order (MOQ) *',
    detailOptions: [
      'Artisanal Craft Studio (MOQ 10–25 Units)',
      'OEM / Private-Label Manufacturer (MOQ 50+ Units)',
      'Authorized Regional Wholesale Distributor',
    ],
  },
};

export default function BusinessRegister({
  selectedRole,
  onChangeRole,
  onNavigateLogin,
  sharedDraft,
  setSharedDraft,
}) {
  const activeRoleKey = ['startup', 'retailer', 'merchant'].includes(selectedRole)
    ? selectedRole
    : 'startup';
  const roleConfig = ROLE_SPECIFIC_CONFIG[activeRoleKey];
  const roleMeta = ROLE_DEFINITIONS[activeRoleKey];

  const [storeName, setStoreName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [businessCategory, setBusinessCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [location, setLocation] = useState('');
  const [roleSpecificDetail, setRoleSpecificDetail] = useState(
    roleConfig.detailOptions[0]
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [registeredData, setRegisteredData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSwitch = (newRole) => {
    if (ROLE_SPECIFIC_CONFIG[newRole]) {
      setRoleSpecificDetail(ROLE_SPECIFIC_CONFIG[newRole].detailOptions[0]);
    }
    setErrors({});
    setServerError('');
    onChangeRole(newRole);
  };

  const updateDraftField = (key, value) => {
    setSharedDraft((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validateBusinessForm = () => {
    const nextErrors = {};

    if (!sharedDraft.name.trim()) {
      nextErrors.name = 'Authorized contact / founder name is required.';
    }
    if (!sharedDraft.email.trim()) {
      nextErrors.email = 'Business email address is required.';
    } else if (!EMAIL_REGEX.test(sharedDraft.email.trim())) {
      nextErrors.email = 'Please enter a valid business email address.';
    }
    if (!storeName.trim()) {
      nextErrors.storeName = 'Business or store name is required.';
    }
    if (!gstNumber.trim()) {
      nextErrors.gstNumber = 'GST number is mandatory for business onboarding.';
    } else if (gstNumber.trim().length !== 15) {
      nextErrors.gstNumber = 'Please enter a valid 15-digit GST number.';
    }
    if (!location.trim()) {
      nextErrors.location = 'City / trade hub location is required.';
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
      nextErrors.acceptedTerms =
        'You must accept the MAISON B2B Trade & Commercial Terms.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setRegisteredData(null);

    if (!validateBusinessForm()) return;

    setIsSubmitting(true);
    try {
      const response = await authService.registerBusiness({
        role: activeRoleKey,
        name: sharedDraft.name,
        email: sharedDraft.email,
        password,
        storeName,
        gstNumber,
        businessCategory,
        location,
        roleSpecificDetail,
      });

      setRegisteredData(response);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setServerError(
        err.message === 'Failed to fetch'
          ? 'Could not reach POST /api/auth/signup. Please verify your Express server is running.'
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="maison-auth-shell">
      {/* LEFT PANEL: B2B & TRADE EDITORIAL SHOWCASE */}
      <aside className="maison-editorial-panel">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85"
          alt="MAISON B2B Trade & Textile Atelier"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/75 to-[#141210]/40" />

        <div className="relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase border border-[#CDA76E]/50 text-[#CDA76E] bg-[#2E4F3E]/50 backdrop-blur-sm">
            {roleConfig.badge}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-medium leading-[1.1] mt-5 text-[#FAF7F2]">
            Built for India’s Next Generation of Brands, Retailers &amp; Craft Houses.
          </h1>
          <p className="text-sm text-[#E5DEC9]/85 mt-4 max-w-md leading-relaxed">
            {roleMeta.tagline} Every business account is verified with a 15-character GSTIN to maintain a trusted, direct-from-source trade network.
          </p>
        </div>

        <div className="relative z-10 mt-10 p-5 rounded-2xl bg-black/45 border border-[#E5DEC9]/20 backdrop-blur-md space-y-2 text-xs text-[#E5DEC9]/85">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#CDA76E]">
            Security &amp; Verification Notice
          </div>
          <p>
            • Wholesale pricing tiers and catalogue management permissions are verified and enforced by the backend upon sign-in.
          </p>
          <button
            type="button"
            onClick={() => handleRoleSwitch('shopper')}
            className="inline-block pt-1 font-semibold uppercase tracking-wider text-white underline underline-offset-4 hover:text-[#CDA76E]"
          >
            Looking for Personal Shopping Instead? Switch to Shopper →
          </button>
        </div>
      </aside>

      {/* RIGHT PANEL: BUSINESS REGISTRATION FORM */}
      <section className="maison-form-panel">
        <div className="max-w-xl w-full mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2E4F3E] dark:text-[#68A688]">
                Commercial Trade Onboarding • GST Verified
              </span>
              <h2 className="font-editorial text-4xl font-semibold mt-0.5">
                {roleConfig.heading}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#2E4F3E]/15 text-[#2E4F3E] dark:text-[#68A688]">
              B2B / Commercial Account
            </span>
          </div>

          {/* 4-Account Type Selector */}
          <RoleSelector selectedRole={activeRoleKey} onChangeRole={handleRoleSwitch} />

          {/* Backend Error Message */}
          {serverError && (
            <div
              role="alert"
              className="mb-5 p-4 rounded-xl bg-[#B93829]/10 border border-[#B93829] text-xs text-[#B93829] dark:text-[#E05A47]"
            >
              <strong className="block font-semibold uppercase tracking-wider mb-0.5">
                Business Onboarding Error
              </strong>
              {serverError}
            </div>
          )}

          {/* Real Backend Success Message */}
          {registeredData && (
            <div
              role="status"
              className="mb-5 p-4 rounded-xl bg-[#2E4F3E]/15 border border-[#2E4F3E] text-xs"
            >
              <strong className="block font-semibold text-[#2E4F3E] dark:text-[#68A688] uppercase tracking-wider mb-1">
                ✓ {registeredData.message}
              </strong>
              <p className="text-[#57524B] dark:text-[#B8B0A4] mb-2">
                Registered <strong>{registeredData.data?.storeName}</strong> (GSTIN:{' '}
                <span className="font-mono-code">{registeredData.data?.gstNumber}</span>) for{' '}
                {registeredData.data?.email}.
              </p>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF7F2] dark:bg-[#F5F0E6] dark:text-[#141210] text-[11px] font-semibold uppercase tracking-wider"
              >
                Proceed to Business Sign In →
              </button>
            </div>
          )}

          <form onSubmit={handleBusinessSubmit} noValidate className="space-y-4">
            {/* Row 1: Full Name & Business Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="biz-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  Full Name (Founder / Contact) *
                </label>
                <input
                  id="biz-name"
                  type="text"
                  value={sharedDraft.name}
                  onChange={(e) => updateDraftField('name', e.target.value)}
                  placeholder="e.g. Vikramaditya Rao"
                  className={`maison-input ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && (
                  <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="biz-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  Business Email Address *
                </label>
                <input
                  id="biz-email"
                  type="email"
                  value={sharedDraft.email}
                  onChange={(e) => updateDraftField('email', e.target.value)}
                  placeholder="founder@atelier.in"
                  className={`maison-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Business/Store Name & 15-Digit GSTIN */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="biz-store"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  {roleConfig.storeLabel}
                </label>
                <input
                  id="biz-store"
                  type="text"
                  value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                    if (errors.storeName) setErrors({ ...errors, storeName: '' });
                  }}
                  placeholder={roleConfig.storePlaceholder}
                  className={`maison-input ${errors.storeName ? 'input-error' : ''}`}
                />
                {errors.storeName && (
                  <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                    {errors.storeName}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="biz-gst"
                    className="text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4]"
                  >
                    15-Digit GSTIN *
                  </label>
                  <span
                    className={`font-mono-code text-[11px] ${
                      gstNumber.trim().length === 15
                        ? 'text-[#2E4F3E] dark:text-[#68A688] font-semibold'
                        : 'text-[#8A8277]'
                    }`}
                  >
                    {gstNumber.trim().length} / 15
                  </span>
                </div>
                <input
                  id="biz-gst"
                  type="text"
                  maxLength={15}
                  value={gstNumber}
                  onChange={(e) => {
                    setGstNumber(e.target.value.toUpperCase());
                    if (errors.gstNumber) setErrors({ ...errors, gstNumber: '' });
                  }}
                  placeholder="27AABCU9603R1ZM"
                  className={`maison-input font-mono-code uppercase ${
                    errors.gstNumber ? 'input-error' : ''
                  }`}
                />
                {errors.gstNumber && (
                  <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                    {errors.gstNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Business Category & City/Location */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="biz-category"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  Business Category *
                </label>
                <select
                  id="biz-category"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="maison-input"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="biz-location"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  Primary City / Hub Location *
                </label>
                <input
                  id="biz-location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors({ ...errors, location: '' });
                  }}
                  placeholder="e.g. Mumbai, Jaipur, Surat, Bengaluru"
                  className={`maison-input ${errors.location ? 'input-error' : ''}`}
                />
                {errors.location && (
                  <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Dynamic Role-Specific Field (Startup vs Retailer vs Merchant) */}
            <div>
              <label
                htmlFor="biz-role-detail"
                className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
              >
                {roleConfig.detailLabel}
              </label>
              <select
                id="biz-role-detail"
                value={roleSpecificDetail}
                onChange={(e) => setRoleSpecificDetail(e.target.value)}
                className="maison-input"
              >
                {roleConfig.detailOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 5: Password & Confirm Password */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="biz-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="biz-password"
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
                  htmlFor="biz-confirm-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#57524B] dark:text-[#B8B0A4] mb-1.5"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="biz-confirm-password"
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

            {/* Terms & Conditions Checkbox */}
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
                  className="mt-0.5 h-4 w-4 rounded border-[#CEC4B0] text-[#2E4F3E] focus:ring-[#2E4F3E]"
                />
                <span>
                  I confirm that our GSTIN details are accurate and agree to MAISON’s{' '}
                  <strong className="text-[#1C1917] dark:text-[#F5F0E6]">
                    Commercial B2B Terms
                  </strong>{' '}
                  and{' '}
                  <strong className="text-[#1C1917] dark:text-[#F5F0E6]">
                    Merchant Code of Conduct
                  </strong>
                  .
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
              className="w-full py-3.5 px-6 rounded-full bg-[#2E4F3E] hover:opacity-95 text-white text-xs font-semibold uppercase tracking-[0.14em] disabled:opacity-60 transition flex items-center justify-center gap-2.5 mt-2"
            >
              {isSubmitting && <span className="maison-spinner" />}
              <span>
                {isSubmitting
                  ? `Registering ${roleMeta.label} Account...`
                  : `Complete ${roleMeta.label} Registration`}
              </span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5DEC9] dark:border-[#332E28] flex items-center justify-between text-xs text-[#57524B] dark:text-[#B8B0A4]">
            <span>Already onboarded your business?</span>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-semibold text-[#1C1917] dark:text-[#F5F0E6] hover:underline"
            >
              Sign In to Business Portal →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}