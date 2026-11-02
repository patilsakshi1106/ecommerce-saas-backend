import React, { useState } from 'react';
import { authService } from '../App.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ShoppingRegister({ onOpenShopperLogin, onOpenBusinessRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [registeredShopper, setRegisteredShopper] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateShopper = () => {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = 'Full name is required.';
    }
    if (!email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!acceptedTerms) {
      nextErrors.acceptedTerms = 'You must accept the Terms & Conditions.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleShopperSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setRegisteredShopper(null);

    if (!validateShopper()) return;

    setIsSubmitting(true);
    try {
      const response = await authService.registerShopper({
        name,
        email,
        phone,
        password,
      });

      setRegisteredShopper(response);
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
    <div className="py-12 lg:py-16 max-w-6xl mx-auto px-4 sm:px-8">
      <div className="rounded-3xl overflow-hidden border border-[#E5DEC9] dark:border-[#2E2A25] bg-white dark:bg-[#1F1C19] shadow-lg grid lg:grid-cols-12">
        {/* Left Multi-Category Shopper Welcome Panel */}
        <aside className="lg:col-span-5 bg-[#181615] text-[#FAF7F2] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80"
            alt="MAISON Multi-Category Shopping"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100F] via-[#11100F]/80 to-transparent" />

          <div className="relative z-10">
            <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] border border-[#B89456]/50 text-[#CDA76E]">
              MAISON Personal Account
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-medium mt-4 leading-tight">
              One Account for Every Department.
            </h1>
            <p className="text-xs sm:text-sm text-[#E5DEC9]/80 mt-3 leading-relaxed">
              Create your complimentary MAISON Shopper profile to explore electronics, home appliances, living décor, beauty, fashion, jewellery, groceries, and lifestyle essentials.
            </p>
          </div>

          <div className="relative z-10 mt-10 pt-6 border-t border-white/15 text-xs space-y-2">
            <span className="block text-[#CDA76E] uppercase tracking-wider font-semibold">
              Want to sell on MAISON instead?
            </span>
            <button
              type="button"
              onClick={onOpenBusinessRegister}
              className="text-white underline underline-offset-4 hover:text-[#CDA76E] font-semibold"
            >
              Go to Business Registration (Merchant, Retailer &amp; Startup) →
            </button>
          </div>
        </aside>

        {/* Right Shopper Registration Form */}
        <section className="lg:col-span-7 p-8 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B89456] dark:text-[#CDA76E]">
                Shopper Onboarding
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold mt-0.5">
                Shopper Registration
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenShopperLogin}
              className="text-xs font-semibold uppercase tracking-wider text-[#B89456] dark:text-[#CDA76E] hover:underline"
            >
              Existing Shopper? Login →
            </button>
          </div>

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

          {registeredShopper && (
            <div
              role="status"
              className="mb-5 p-5 rounded-2xl bg-[#285943]/15 border border-[#285943] text-xs space-y-2"
            >
              <strong className="block font-semibold text-[#285943] dark:text-[#68A688] uppercase tracking-wider">
                ✓ {registeredShopper.message}
              </strong>
              <p className="text-[#5C564F] dark:text-[#A8A096]">
                Welcome to MAISON, <strong>{registeredShopper.data?.name}</strong> (
                {registeredShopper.data?.email}). Your shopper account is ready.
              </p>
              <button
                type="button"
                onClick={onOpenShopperLogin}
                className="mt-2 px-5 py-2 rounded-full bg-[#181615] text-white dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-wider"
              >
                Proceed to Shopper Login →
              </button>
            </div>
          )}

          <form onSubmit={handleShopperSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Ananya Sharma"
                className={`maison-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && (
                <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                  Email / Gmail Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="you@gmail.com"
                  className={`maison-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-[#B93829] dark:text-[#E05A47] mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="maison-input"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
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
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: '' });
                  }}
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

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#5C564F] dark:text-[#A8A096]">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (errors.acceptedTerms) setErrors({ ...errors, acceptedTerms: '' });
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-[#D0C6B0]"
                />
                <span>
                  I agree to MAISON’s{' '}
                  <strong className="text-[#181615] dark:text-[#F5F2EB]">
                    Terms &amp; Conditions
                  </strong>{' '}
                  and{' '}
                  <strong className="text-[#181615] dark:text-[#F5F2EB]">
                    Privacy Policy
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
              className="w-full py-4 px-6 rounded-full bg-[#181615] text-[#FAF7F2] dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-[0.16em] hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting && <span className="maison-spinner" />}
              <span>
                {isSubmitting ? 'Creating Shopper Account...' : 'Create Shopper Account'}
              </span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5DEC9] dark:border-[#2E2A25] flex items-center justify-between text-xs text-[#5C564F] dark:text-[#A8A096]">
            <span>Already have a MAISON shopper account?</span>
            <button
              type="button"
              onClick={onOpenShopperLogin}
              className="font-semibold text-[#B89456] dark:text-[#CDA76E] hover:underline"
            >
              Access Shopper Login →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}