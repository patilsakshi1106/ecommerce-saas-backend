import React, { useState, useEffect } from 'react';
import IntroLogin from './pages/IntroLogin.jsx';
import ShoppingRegister from './pages/ShoppingRegister.jsx';
import BusinessRegister from './pages/BusinessRegister.jsx';
import Home from './Home.jsx';
// Configure your Express backend URL (leave empty if using a Vite proxy, or set to 'http://localhost:5000')
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

/* ==========================================================================
   ROLE DEFINITIONS (4 ACCOUNT TYPES: SHOPPER, STARTUP, RETAILER, MERCHANT)
   ========================================================================== */
export const ROLE_DEFINITIONS = {
  shopper: {
    id: 'shopper',
    label: 'Shopper',
    type: 'Personal Account (B2C)',
    tagline: 'Browse curated Indian boutiques and purchase single pieces.',
    badgeColor: 'text-[#9A5B3E] dark:text-[#C87D5B] border-[#9A5B3E]/40 bg-[#9A5B3E]/10',
  },
  startup: {
    id: 'startup',
    label: 'Startup',
    type: 'Business Account (B2B / D2C)',
    tagline: 'Establish or grow your new brand with low-MOQ sourcing.',
    badgeColor: 'text-[#B08D57] dark:text-[#CDA76E] border-[#B08D57]/40 bg-[#B08D57]/10',
  },
  retailer: {
    id: 'retailer',
    label: 'Retailer',
    type: 'Business Account (B2B Buyer)',
    tagline: 'Source wholesale products and verified suppliers for your store.',
    badgeColor: 'text-[#2E4F3E] dark:text-[#68A688] border-[#2E4F3E]/40 bg-[#2E4F3E]/10',
  },
  merchant: {
    id: 'merchant',
    label: 'Merchant',
    type: 'Business Account (B2B Supplier)',
    tagline: 'Showcase and manage your wholesale & retail product catalogues.',
    badgeColor: 'text-[#2E4F3E] dark:text-[#68A688] border-[#2E4F3E]/40 bg-[#2E4F3E]/10',
  },
};

/* ==========================================================================
   AUTH SERVICE (authService.js) — CONNECTS TO EXPRESS / MONGODB BACKEND
   ========================================================================== */
export const authService = {
  /**
   * Login request
   * @param {'customer' | 'merchant'} accountCategory
   * @param {{ email: string, password: string }} credentials
   */
  async login(accountCategory, { email, password }) {
    const endpoint =
      accountCategory === 'merchant'
        ? `${API_BASE_URL}/api/auth/login`
        : `${API_BASE_URL}/api/auth/customer/login`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || `Authentication failed (HTTP ${response.status}).`);
    }

    // Store only the JWT and safe user profile metadata — NEVER store plaintext passwords.
    // Note: Role permissions are always enforced server-side via the signed JWT.
    if (payload.token) {
      localStorage.setItem('maison_auth_token', payload.token);
    }
    if (payload.data) {
      localStorage.setItem('maison_user_profile', JSON.stringify(payload.data));
    }

    return payload;
  },

  /**
   * Register a B2C Shopper (POST /api/auth/customer/signup)
   */
  async registerShopper({ name, email, password }) {
    const endpoint = `${API_BASE_URL}/api/auth/customer/signup`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || `Customer registration failed (HTTP ${response.status}).`);
    }

    return payload;
  },

  /**
   * Register a B2B Business Account: Startup, Retailer, or Merchant (POST /api/auth/signup)
   * Maps businessName -> storeName and validates 15-character gstNumber for the existing Express controller.
   */
  async registerBusiness({
    role,
    name,
    email,
    password,
    storeName,
    gstNumber,
    businessCategory,
    location,
    roleSpecificDetail,
  }) {
    const endpoint = `${API_BASE_URL}/api/auth/signup`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
        storeName: storeName.trim(),
        gstNumber: gstNumber.trim().toUpperCase(),
        // Extended fields sent for forward-compatibility with Mongoose schema updates:
        role,
        businessCategory,
        location: location.trim(),
        roleSpecificDetail: roleSpecificDetail.trim(),
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || `Business registration failed (HTTP ${response.status}).`);
    }

    return payload;
  },

  /**
   * Password Reset Request
   * Transparently checks if /api/auth/forgot-password exists on the Express server.
   */
  async requestPasswordReset(email) {
    const endpoint = `${API_BASE_URL}/api/auth/forgot-password`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });

    if (response.status === 404) {
      throw new Error(
        'The password reset endpoint (POST /api/auth/forgot-password) is not yet implemented on the Express backend.'
      );
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) {
      throw new Error(
        payload.message ||
          'Password reset endpoint is unavailable on the backend. Please contact support.'
      );
    }

    return payload;
  },
};

/* ==========================================================================
   SHARED AUTH NAVBAR COMPONENT (AuthNavbar.jsx)
   ========================================================================== */
export function AuthNavbar({ currentPage, selectedRole, onNavigateLogin, onNavigateHome, onSelectRole, darkMode, onToggleDark }) {
  return (
    <header className="sticky top-0 z-50 h-[4.75rem] bg-[#FAF7F2]/95 dark:bg-[#141210]/95 backdrop-blur-md border-b border-[#E5DEC9] dark:border-[#332E28]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* MAISON Brand Identity */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#FAF7F2] dark:bg-[#F5F0E6] dark:text-[#141210] flex items-center justify-center font-editorial text-xl font-semibold tracking-widest">
            M
          </div>
          <div>
            <span className="block font-editorial text-2xl font-semibold tracking-[0.18em] leading-none">
              MAISON
            </span>
            <span className="block text-[10px] tracking-[0.2em] uppercase text-[#8A8277] mt-1">
              India • B2B &amp; B2C Commerce
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
          <button
            type="button"
            onClick={onNavigateLogin}
            className={`px-4 py-2 rounded-full transition ${
              currentPage === 'login'
                ? 'bg-[#1C1917] text-[#FAF7F2] dark:bg-[#F5F0E6] dark:text-[#141210]'
                : 'text-[#57524B] dark:text-[#B8B0A4] hover:text-[#1C1917] dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => onSelectRole('shopper')}
            className={`px-4 py-2 rounded-full transition ${
              currentPage === 'shopping-register'
                ? 'bg-[#9A5B3E] text-white'
                : 'text-[#57524B] dark:text-[#B8B0A4] hover:text-[#9A5B3E]'
            }`}
          >
            Shopper Registration
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectRole(selectedRole === 'shopper' ? 'startup' : selectedRole)
            }
            className={`px-4 py-2 rounded-full transition ${
              currentPage === 'business-register'
                ? 'bg-[#2E4F3E] text-white'
                : 'text-[#57524B] dark:text-[#B8B0A4] hover:text-[#2E4F3E]'
            }`}
          >
            Business Registration
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDark}
            className="px-3.5 py-2 rounded-full border border-[#CEC4B0] dark:border-[#4A433B] text-[11px] font-semibold tracking-wider uppercase hover:bg-[#F3EDE2] dark:hover:bg-[#211E1A] transition"
            aria-label="Toggle color theme"
          >
            {darkMode ? '☀ Ivory' : '☾ Espresso'}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
   SHARED 4-ROLE SELECTOR COMPONENT (RoleSelector.jsx)
   Allows selecting Shopper, Startup, Retailer, or Merchant
   ========================================================================== */
export function RoleSelector({ selectedRole, onChangeRole }) {
  const roles = Object.values(ROLE_DEFINITIONS);

  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57524B] dark:text-[#B8B0A4]">
          Select Account Type
        </span>
        <span className="text-[11px] text-[#8A8277]">
          {selectedRole === 'shopper' ? 'Personal B2C Account' : 'GST Business Account'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChangeRole(role.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#1C1917] dark:border-[#F5F0E6] bg-white dark:bg-[#211E1A] shadow-sm ring-1 ring-[#1C1917] dark:ring-[#F5F0E6]'
                  : 'border-[#E5DEC9] dark:border-[#332E28] bg-[#F3EDE2]/50 dark:bg-[#1C1916]/60 hover:border-[#B08D57]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-editorial text-lg font-semibold leading-none">
                  {role.label}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-[#9A5B3E]' : 'bg-transparent border border-[#8A8277]'
                  }`}
                />
              </div>
              <p className="text-[11px] text-[#57524B] dark:text-[#B8B0A4] mt-1.5 line-clamp-2 leading-snug">
                {role.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   ROOT APPLICATION CONTROLLER (App.jsx)
   ========================================================================== */
export default function App() {
  // 'login' | 'shopping-register' | 'business-register'
  const [currentPage, setCurrentPage] = useState('home');
  // 'shopper' | 'startup' | 'retailer' | 'merchant'
  const [selectedRole, setSelectedRole] = useState('shopper');
  // Preserve common fields if a user switches between Shopper and Business roles during registration
  const [sharedDraft, setSharedDraft] = useState({ name: '', email: '' });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('maison_theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('maison_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('maison_theme', 'light');
    }
  }, [darkMode]);

  // Navigate to registration with a preselected role ("Start Shopping" -> 'shopper', "Start Your Online Business" -> 'startup' | 'retailer' | 'merchant')
  const handleSelectRoleAndNavigate = (role) => {
    setSelectedRole(role);
    if (role === 'shopper') {
      setCurrentPage('shopping-register');
    } else {
      setCurrentPage('business-register');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateLogin = () => {
    setCurrentPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleNavigateHome = () => {
  setCurrentPage('home');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917] dark:bg-[#141210] dark:text-[#F5F0E6]">
      <AuthNavbar
        currentPage={currentPage}
        selectedRole={selectedRole}
        onNavigateLogin={handleNavigateLogin}
        onNavigateHome={handleNavigateHome}
        onSelectRole={handleSelectRoleAndNavigate}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
  <Home
    onLogin={handleNavigateLogin}
    onCustomerRegister={() =>
      handleSelectRoleAndNavigate('shopper')
    }
    onMerchantRegister={() =>
      handleSelectRoleAndNavigate('merchant')
    }
    onShop={() => handleSelectRoleAndNavigate('shopper')}
  />
)}
        {currentPage === 'login' && (
          <IntroLogin 
           onNavigateHome={() => setCurrentPage('home')} 
            onStartShopping={() => handleSelectRoleAndNavigate('shopper')}
            onStartBusiness={(defaultBizRole = 'startup') =>
              handleSelectRoleAndNavigate(defaultBizRole)
            }
            onSelectRole={handleSelectRoleAndNavigate}
          />
        )}
      
        {currentPage === 'shopping-register' && (
          <ShoppingRegister
            onNavigateHome={() => setCurrentPage('home')}
            selectedRole={selectedRole}
            onChangeRole={handleSelectRoleAndNavigate}
            onNavigateLogin={handleNavigateLogin}
            sharedDraft={sharedDraft}
            setSharedDraft={setSharedDraft}
          />
        )}

        {currentPage === 'business-register' && (
          <BusinessRegister
            onNavigateHome={() => setCurrentPage('home')}
            selectedRole={selectedRole === 'shopper' ? 'startup' : selectedRole}
            onChangeRole={handleSelectRoleAndNavigate}
            onNavigateLogin={handleNavigateLogin}
            sharedDraft={sharedDraft}
            setSharedDraft={setSharedDraft}
          />
        )}
      </main>
    </div>
  );
}