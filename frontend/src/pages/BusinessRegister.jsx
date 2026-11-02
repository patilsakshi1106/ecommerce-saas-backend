import React, { useState, useEffect } from 'react';
import { authService } from '../App.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MARKETPLACE_DEPARTMENTS = [
  'Electronics & Technology',
  'Fashion & Apparel',
  'Jewellery & Accessories',
  'Home & Living',
  'Beauty & Personal Care',
  'Appliances',
  'Grocery & Essentials',
  'Sports & Fitness',
  'Toys & Hobbies',
  'Multi-Category / General Store',
];

const BUSINESS_REGISTRATION_CHOICES = [
  {
    id: 'merchant',
    title: 'MERCHANT REGISTRATION',
    subtitle: 'For merchants who want to sell their products through MAISON.',
    badge: 'Catalogue Seller & Manufacturer',
  },
  {
    id: 'retailer',
    title: 'RETAILER REGISTRATION',
    subtitle: 'For retailers who want to join the marketplace and grow their business.',
    badge: 'Wholesale & Retail Storefront',
  },
  {
    id: 'startup',
    title: 'STARTUP / ONLINE SELLER REGISTRATION',
    subtitle: 'For entrepreneurs and startups who want to establish their online selling business.',
    badge: 'Emerging Brand & D2C Seller',
  },
];

export default function BusinessRegister({
  initialRole = 'merchant',
  onOpenBusinessLogin,
  onOpenShopperRegister,
}) {
  const [selectedChoice, setSelectedChoice] = useState(initialRole);

  useEffect(() => {
    if (['merchant', 'retailer', 'startup'].includes(initialRole)) {
      setSelectedChoice(initialRole);
    }
  }, [initialRole]);

  // Separate form state for each of the 3 distinct business forms
  const [merchantForm, setMerchantForm] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    gstNumber: '',
    businessCategory: MARKETPLACE_DEPARTMENTS[0],
    location: '',
    catalogueSize: '50–250 SKUs',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [retailerForm, setRetailerForm] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    gstNumber: '',
    businessCategory: MARKETPLACE_DEPARTMENTS[0],
    location: '',
    retailFormat: 'Physical + Online Storefront',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [startupForm, setStartupForm] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    gstNumber: '',
    businessCategory: MARKETPLACE_DEPARTMENTS[0],
    location: '',
    launchStage: 'Early-Stage Online Seller (< 1 Year)',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getActiveFormState = () => {
    if (selectedChoice === 'merchant') return [merchantForm, setMerchantForm];
    if (selectedChoice === 'retailer') return [retailerForm, setRetailerForm];
    return [startupForm, setStartupForm];
  };

  const [activeForm, setActiveForm] = getActiveFormState();

  const updateField = (field, value) => {
    setActiveForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateActiveForm = () => {
    const nextErrors = {};
    if (!activeForm.name.trim()) {
      nextErrors.name = 'Full name / authorized representative name is required.';
    }
    if (!activeForm.email.trim()) {
      nextErrors.email = 'Business email address is required.';
    } else if (!EMAIL_REGEX.test(activeForm.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!activeForm.storeName.trim()) {
      nextErrors.storeName = 'Business / store name is required.';
    }
    if (!activeForm.gstNumber.trim()) {
      nextErrors.gstNumber = 'GST number is mandatory for business onboarding.';
    } else if (activeForm.gstNumber.trim().length !== 15) {
      nextErrors.gstNumber = 'Please enter a valid 15-digit GST number.';
    }
    if (!activeForm.location.trim()) {
      nextErrors.location = 'City / business location is required.';
    }
    if (!activeForm.password) {
      nextErrors.password = 'Password is required.';
    } else if (activeForm.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    if (activeForm.password !== activeForm.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!activeForm.acceptedTerms) {
      nextErrors.acceptedTerms = 'Please accept the MAISON Business Partner Terms.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setRegisteredSuccess(null);

    if (!validateActiveForm()) return;

    setIsSubmitting(true);
    try {
      const response = await authService.registerBusiness({
        role: selectedChoice,
        name: activeForm.name,
        email: activeForm.email,
        phone: activeForm.phone,
        password: activeForm.password,
        storeName: activeForm.storeName,
        gstNumber: activeForm.gstNumber,
        businessCategory: activeForm.businessCategory,
        location: activeForm.location,
        businessDetails:
          activeForm.catalogueSize || activeForm.retailFormat || activeForm.launchStage,
      });

      setRegisteredSuccess({
        role: selectedChoice,
        message: response.message,
        data: response.data,
      });
    } catch (err) {
      setServerError(
        err.message === 'Failed to fetch'
          ? 'Could not connect to POST /api/auth/signup. Please verify your Express server is running.'
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] bg-[#F2ECE1] dark:bg-[#1F1C19] border border-[#D0C6B0] dark:border-[#423C35] text-[#B89456] dark:text-[#CDA76E]">
          MAISON Commercial Partner Onboarding
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold mt-3">
          Business Registration
        </h1>
        <p className="text-sm sm:text-base text-[#5C564F] dark:text-[#A8A096] mt-2">
          Select your business category below. Once registered, all Merchants, Retailers, and Startups sign in through our single unified <strong>Business Login</strong>.
        </p>
      </div>

      {/* Three Clearly Differentiated Business Registration Choices */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {BUSINESS_REGISTRATION_CHOICES.map((choice) => {
          const isSelected = selectedChoice === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => {
                setSelectedChoice(choice.id);
                setErrors({});
                setServerError('');
                setRegisteredSuccess(null);
              }}
              className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#181615] text-[#FAF7F2] dark:bg-[#B89456] dark:text-[#11100F] border-[#B89456] shadow-md'
                  : 'bg-white dark:bg-[#1F1C19] border-[#E5DEC9] dark:border-[#2E2A25] hover:border-[#B89456]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      isSelected
                        ? 'bg-white/15 text-[#CDA76E] dark:bg-black/15 dark:text-[#11100F]'
                        : 'bg-[#F2ECE1] dark:bg-[#2A2622] text-[#B89456]'
                    }`}
                  >
                    {choice.badge}
                  </span>
                  <span className="text-xs font-bold">{isSelected ? '✓ Active' : 'Select →'}</span>
                </div>
                <h2 className="font-editorial text-2xl font-semibold tracking-wide">
                  {choice.title}
                </h2>
                <p
                  className={`text-xs mt-2 leading-relaxed ${
                    isSelected
                      ? 'text-[#E5DEC9] dark:text-[#181615]/80'
                      : 'text-[#5C564F] dark:text-[#A8A096]'
                  }`}
                >
                  {choice.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Business Registration Form Container */}
      <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-[#E5DEC9] dark:border-[#2E2A25]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B89456] dark:text-[#CDA76E]">
              Active Registration Form
            </span>
            <h3 className="font-editorial text-3xl font-semibold mt-0.5">
              {selectedChoice === 'merchant' && 'Merchant Registration Form'}
              {selectedChoice === 'retailer' && 'Retailer Registration Form'}
              {selectedChoice === 'startup' && 'Startup / Online Seller Registration Form'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenBusinessLogin}
            className="text-xs font-semibold uppercase tracking-wider text-[#B89456] dark:text-[#CDA76E] hover:underline"
          >
            Already registered? Business Login →
          </button>
        </div>

        {serverError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-[#B93829]/10 border border-[#B93829] text-xs text-[#B93829] dark:text-[#E05A47]"
          >
            <strong className="block font-semibold uppercase tracking-wider mb-0.5">
              Registration Error
            </strong>
            {serverError}
          </div>
        )}

        {registeredSuccess && (
          <div
            role="status"
            className="mb-6 p-5 rounded-2xl bg-[#285943]/15 border border-[#285943] text-xs space-y-2"
          >
            <strong className="block font-semibold text-[#285943] dark:text-[#68A688] uppercase tracking-wider">
              ✓ {registeredSuccess.message}
            </strong>
            <p className="text-[#5C564F] dark:text-[#A8A096]">
              Your <strong>{registeredSuccess.role.toUpperCase()}</strong> account for{' '}
              <strong>{registeredSuccess.data?.storeName}</strong> (GSTIN:{' '}
              <span className="font-mono-code">{registeredSuccess.data?.gstNumber}</span>) has been created. You can now sign in using the unified Business Login page.
            </p>
            <button
              type="button"
              onClick={onOpenBusinessLogin}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#181615] text-white dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-wider"
            >
              Proceed to Business Login →
            </button>
          </div>
        )}

        {/* Dedicated Form for Merchant / Retailer / Startup */}
        <form onSubmit={handleBusinessSubmit} noValidate className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                {selectedChoice === 'merchant'
                  ? 'Merchant Representative Name *'
                  : selectedChoice === 'retailer'
                  ? 'Retail Owner / Buyer Name *'
                  : 'Founder / Seller Full Name *'}
              </label>
              <input
                type="text"
                value={activeForm.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Vikramaditya Rao"
                className={`maison-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Business Email / Gmail *
              </label>
              <input
                type="email"
                value={activeForm.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="partner@company.com"
                className={`maison-input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                {selectedChoice === 'merchant'
                  ? 'Merchant Store / Brand Name *'
                  : selectedChoice === 'retailer'
                  ? 'Retail Store / Enterprise Name *'
                  : 'Startup / Online Store Name *'}
              </label>
              <input
                type="text"
                value={activeForm.storeName}
                onChange={(e) => updateField('storeName', e.target.value)}
                placeholder="Unique Store or Business Name"
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
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096]">
                  15-Digit GST Number *
                </label>
                <span className="font-mono-code text-[11px] text-[#B89456]">
                  {activeForm.gstNumber.trim().length} / 15
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={15}
                  value={activeForm.gstNumber}
                  onChange={(e) => updateField('gstNumber', e.target.value.toUpperCase())}
                  placeholder="27AABCU9603R1ZM"
                  className={`maison-input font-mono-code uppercase ${
                    errors.gstNumber ? 'input-error' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => updateField('gstNumber', '27AABCU9603R1ZM')}
                  className="px-3 py-2 rounded-xl border border-[#D0C6B0] dark:border-[#423C35] text-[11px] font-semibold shrink-0 hover:border-[#B89456]"
                >
                  Sample GST
                </button>
              </div>
              {errors.gstNumber && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                  {errors.gstNumber}
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Primary Product Category *
              </label>
              <select
                value={activeForm.businessCategory}
                onChange={(e) => updateField('businessCategory', e.target.value)}
                className="maison-input"
              >
                {MARKETPLACE_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                City &amp; State *
              </label>
              <input
                type="text"
                value={activeForm.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra"
                className={`maison-input ${errors.location ? 'input-error' : ''}`}
              />
              {errors.location && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={activeForm.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="maison-input"
              />
            </div>
          </div>

          {/* Role-Specific Field Preserved Separately per Form */}
          {selectedChoice === 'merchant' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Merchant Catalogue Capacity &amp; Supply Type
              </label>
              <select
                value={activeForm.catalogueSize}
                onChange={(e) => updateField('catalogueSize', e.target.value)}
                className="maison-input"
              >
                <option value="10–50 SKUs (Boutique / Direct Brand)">
                  10–50 SKUs (Boutique / Direct Brand)
                </option>
                <option value="50–250 SKUs (Commercial Manufacturer)">
                  50–250 SKUs (Commercial Manufacturer)
                </option>
                <option value="250+ SKUs (Full-Scale Distributor)">
                  250+ SKUs (Full-Scale Distributor)
                </option>
              </select>
            </div>
          )}

          {selectedChoice === 'retailer' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Retailer Store Format &amp; Monthly Sourcing Volume
              </label>
              <select
                value={activeForm.retailFormat}
                onChange={(e) => updateField('retailFormat', e.target.value)}
                className="maison-input"
              >
                <option value="Physical Retail Storefront">Physical Retail Storefront</option>
                <option value="Multi-Store Retail Chain">Multi-Store Retail Chain</option>
                <option value="Physical + Online Storefront">Physical + Online Storefront</option>
              </select>
            </div>
          )}

          {selectedChoice === 'startup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Startup / Online Seller Stage
              </label>
              <select
                value={activeForm.launchStage}
                onChange={(e) => updateField('launchStage', e.target.value)}
                className="maison-input"
              >
                <option value="New Online Seller (Pre-Launch / Setup)">
                  New Online Seller (Pre-Launch / Setup)
                </option>
                <option value="Early-Stage Online Seller (< 1 Year)">
                  Early-Stage Online Seller (&lt; 1 Year)
                </option>
                <option value="Growing D2C Startup (1–3 Years)">
                  Growing D2C Startup (1–3 Years)
                </option>
              </select>
            </div>
          )}

          {/* Password & Confirm Password */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={activeForm.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`maison-input pr-14 ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase text-[#5C564F]"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Confirm Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={activeForm.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="Re-enter password"
                className={`maison-input ${errors.confirmPassword ? 'input-error' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms Acceptance */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#5C564F] dark:text-[#A8A096]">
              <input
                type="checkbox"
                checked={activeForm.acceptedTerms}
                onChange={(e) => updateField('acceptedTerms', e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D0C6B0]"
              />
              <span>
                I confirm our GSTIN and business details are accurate and agree to MAISON’s{' '}
                <strong className="text-[#181615] dark:text-[#F5F2EB]">
                  Business Partner Terms &amp; Conditions
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-full bg-[#181615] text-[#FAF7F2] dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-[0.16em] hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2"
          >
            {isSubmitting && <span className="maison-spinner" />}
            <span>
              {isSubmitting
                ? 'Registering Business Account...'
                : selectedChoice === 'merchant'
                ? 'Complete Merchant Registration'
                : selectedChoice === 'retailer'
                ? 'Complete Retailer Registration'
                : 'Complete Startup / Seller Registration'}
            </span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E5DEC9] dark:border-[#2E2A25] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C564F] dark:text-[#A8A096]">
          <span>Looking to register for personal shopping instead?</span>
          <button
            type="button"
            onClick={onOpenShopperRegister}
            className="font-semibold text-[#B89456] dark:text-[#CDA76E] hover:underline"
          >
            Switch to Shopper Registration →
          </button>
        </div>
      </div>
    </div>
  );
}