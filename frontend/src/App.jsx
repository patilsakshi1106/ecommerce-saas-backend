import React, { useState, useEffect, useRef } from 'react';
import IntroLogin from './pages/IntroLogin.jsx';
import BusinessRegister from './pages/BusinessRegister.jsx';
import MerchantDashboard from './pages/MerchantDashboard.jsx';
import RetailerDashboard from './pages/RetailerDashboard.jsx';
import StartupDashboard from './pages/StartupDashboard.jsx';
import Home from './Home.jsx';

export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

/* ==========================================================================
   ROLE -> DASHBOARD MAP
   The role is saved at registration, returned by the backend at login
   (data.role), and used here to decide which dashboard to open.
   ========================================================================== */
const DASHBOARD_BY_ROLE = {
  merchant: MerchantDashboard,
  retailer: RetailerDashboard,
  startup: StartupDashboard,
};

// Decides which page a user lands on after login / on page refresh.
const getLandingPage = (user) => {
  if (!user) return 'intro';
  if (user.accountStream === 'business' && DASHBOARD_BY_ROLE[user.role]) {
    return 'dashboard';
  }
  return 'home';
};

/* ==========================================================================
   AUTHENTICATION API SERVICE (Connects to Express + MongoDB Backend)
   ========================================================================== */
export const authService = {
  /**
   * Two Login Categories Across MAISON:
  
   * - 'business' -> POST /api/auth/login (Supports Merchants, Retailers, Startups)
   *
   * Expected backend response shape:
   * { success: true, token: '...', data: { name, email, storeName, role, ... } }
   */
  async login(loginType, { email, password }) {
    const endpoint =
      loginType === 'business'
        ? `${API_BASE_URL}/api/auth/login`
        : `${API_BASE_URL}/api/auth/customer/login`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'Invalid email or password.');
    }

    // The backend's data.role is the source of truth.
    // The localStorage map is only a temporary fallback for this browser;
    // remove it once the backend reliably returns data.role.
    const savedRoleMap = JSON.parse(localStorage.getItem('maison_business_roles') || '{}');
    const backendRole = payload.data?.role
      ? String(payload.data.role).toLowerCase()
      : undefined;
    const resolvedRole =
      backendRole ||
      (loginType === 'business'
        ? savedRoleMap[email.trim().toLowerCase()]
        : 'shopper');

    const enrichedUser = {
      ...payload.data,
      accountStream: loginType,
      role: resolvedRole,
    };

    if (payload.token) {
      localStorage.setItem('maison_auth_token', payload.token);
    }
    localStorage.setItem('maison_user_profile', JSON.stringify(enrichedUser));

    return { ...payload, data: enrichedUser };
  },


  /**
   * Register Business: Merchant, Retailer, or Startup (POST /api/auth/signup)
   */
  async registerBusiness(businessPayload) {
    const endpoint = `${API_BASE_URL}/api/auth/signup`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: businessPayload.name.trim(),
        email: businessPayload.email.trim(),
        password: businessPayload.password,
        storeName: businessPayload.storeName.trim(),
        gstNumber: businessPayload.gstNumber.trim().toUpperCase(),
        role: businessPayload.role,
        businessCategory: businessPayload.businessCategory,
        location: businessPayload.location?.trim(),
        phone: businessPayload.phone?.trim(),
        businessDetails: businessPayload.businessDetails,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'Business registration failed.');
    }

    // Temporary fallback: remember the registered role for this browser.
    // The backend should return the role at login, which is the real source.
    const savedRoleMap = JSON.parse(localStorage.getItem('maison_business_roles') || '{}');
    savedRoleMap[businessPayload.email.trim().toLowerCase()] = businessPayload.role;
    localStorage.setItem('maison_business_roles', JSON.stringify(savedRoleMap));

    return payload;
  },

  /**
   * Password Reset Request
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
        'Password reset endpoint (POST /api/auth/forgot-password) is not yet configured on the backend server.'
      );
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'Unable to process password reset request.');
    }

    return payload;
  },
};

/* ==========================================================================
   STICKY TOP NAVIGATION BAR WITH LOGIN & REGISTER DROPDOWNS
   ========================================================================== */
export function MaisonNavbar({
  currentPage,
  darkMode,
  onToggleDark,
  onNavigateSection,
  onOpenLoginStream,
  onOpenBusinessRegister,
  currentUser,
  onLogout,
}) {
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setLoginDropdownOpen(false);
        setRegisterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-[#FAF7F2]/95 dark:bg-[#11100F]/95 backdrop-blur-md border-b border-[#E5DEC9] dark:border-[#2E2A25] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* LEFT: MAISON LOGO / WORDMARK */}
        <button
          type="button"
          onClick={() => onNavigateSection('top')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-full bg-[#181615] text-[#FAF7F2] dark:bg-[#F5F2EB] dark:text-[#11100F] flex items-center justify-center font-editorial text-xl font-bold tracking-widest border border-[#B89456]/40">
            M
          </div>
          <div>
            <span className="block font-editorial text-2xl sm:text-[26px] font-semibold tracking-[0.22em] leading-none">
              MAISON
            </span>
            <span className="block text-[9px] tracking-[0.24em] uppercase text-[#B89456] dark:text-[#CDA76E] mt-1 font-semibold">
              All-In-One Luxury Marketplace
            </span>
          </div>
        </button>

        {/* CENTER: NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.14em] text-[#5C564F] dark:text-[#A8A096]">
          <button
            type="button"
            onClick={() => onNavigateSection('top')}
            className={`hover:text-[#181615] dark:hover:text-white transition ${
              currentPage === 'intro' ? 'text-[#B89456] dark:text-[#CDA76E]' : ''
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('about-maison')}
            className="hover:text-[#181615] dark:hover:text-white transition"
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('explore-categories')}
            className="hover:text-[#181615] dark:hover:text-white transition"
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('for-businesses')}
            className="hover:text-[#181615] dark:hover:text-white transition"
          >
            For Businesses
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('maison-footer')}
            className="hover:text-[#181615] dark:hover:text-white transition"
          >
            Contact
          </button>
        </nav>

        {/* RIGHT: THEME TOGGLE, LOGIN DROPDOWN, REGISTER DROPDOWN */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            className="px-3.5 py-2 rounded-full border border-[#D0C6B0] dark:border-[#423C35] text-[11px] font-semibold uppercase tracking-wider hover:border-[#B89456] transition flex items-center gap-1.5"
            aria-label="Toggle color theme"
          >
            <span>{darkMode ? '☀' : '☾'}</span>
            <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateSection('home')}
                className="px-4 py-2 rounded-full bg-[#B89456] text-white text-xs font-semibold uppercase tracking-wider"
              >
                {currentUser.storeName || currentUser.name}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-2 rounded-full border border-[#E5DEC9] dark:border-[#2E2A25] text-xs font-semibold uppercase tracking-wider hover:text-[#B93829]"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              {/* LOGIN DROPDOWN (Strictly 2 Options: Shopper Login & Business Login) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setLoginDropdownOpen(!loginDropdownOpen);
                    setRegisterDropdownOpen(false);
                  }}
                  className="px-4 py-2 rounded-full border border-[#D0C6B0] dark:border-[#423C35] hover:border-[#181615] dark:hover:border-white text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <span>Login</span>
                  <span className="text-[10px]">▾</span>
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25] shadow-xl py-2 z-50">
                    <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89456]">
                      Login
                    </div>
                  
                    <div className="my-1 border-t border-[#E5DEC9] dark:border-[#2E2A25]" />
                    <button
                      type="button"
                      onClick={() => {
                        setLoginDropdownOpen(false);
                        onOpenLoginStream('business');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-[#FAF7F2] dark:hover:bg-[#2A2622] transition flex flex-col"
                    >
                      <span className="text-xs font-semibold text-[#181615] dark:text-[#F5F2EB]">
                        Login
                      </span>
                      <span className="text-[11px] text-[#5C564F] dark:text-[#A8A096]">
                        Merchants, Retailers &amp; Startups
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* REGISTER DROPDOWN (Strictly 2 Options: Shopper Registration & Business Registration) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setRegisterDropdownOpen(!registerDropdownOpen);
                    setLoginDropdownOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-[#181615] text-[#FAF7F2] dark:bg-[#B89456] dark:text-[#11100F] hover:opacity-90 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <span>Register</span>
                  <span className="text-[10px]">▾</span>
                </button>

                {registerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25] shadow-xl py-2 z-50">
                    <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89456]">
                      Create New Account
                    </div>
            
                    <div className="my-1 border-t border-[#E5DEC9] dark:border-[#2E2A25]" />
                    <button
                      type="button"
                      onClick={() => {
                        setRegisterDropdownOpen(false);
                        onOpenBusinessRegister('merchant');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-[#FAF7F2] dark:hover:bg-[#2A2622] transition flex flex-col"
                    >
                      <span className="text-xs font-semibold text-[#181615] dark:text-[#F5F2EB]">
                        Business Registration
                      </span>
                      <span className="text-[11px] text-[#5C564F] dark:text-[#A8A096]">
                        Merchant, Retailer &amp; Startup onboarding
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-[#E5DEC9] dark:border-[#2E2A25] text-xs"
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 border-t border-[#E5DEC9] dark:border-[#2E2A25] bg-[#FAF7F2] dark:bg-[#11100F] flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateSection('top');
            }}
            className="py-2 text-left"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateSection('about-maison');
            }}
            className="py-2 text-left"
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateSection('explore-categories');
            }}
            className="py-2 text-left"
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateSection('for-businesses');
            }}
            className="py-2 text-left"
          >
            For Businesses
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateSection('maison-footer');
            }}
            className="py-2 text-left"
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
}

/* ==========================================================================
   ROOT APPLICATION STATE & ROUTER (App.jsx)
   ========================================================================== */
export default function App() {
  // Restore a saved session first, so the starting page can depend on it.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('maison_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 'intro' | 'shopping-register' | 'business-register' | 'home' | 'dashboard'
  const [currentPage, setCurrentPage] = useState(() => getLandingPage(currentUser));
  // 'shopper' | 'business'
  const [loginStream, setLoginStream] = useState('shopper');
  // 'merchant' | 'retailer' | 'startup'
  const [initialBusinessRole, setInitialBusinessRole] = useState('merchant');

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('maison_theme') === 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (darkMode) {
      html.classList.add('dark');
      body.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('maison_theme', 'dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('maison_theme', 'light');
    }
  }, [darkMode]);

  const handleNavigateSection = (sectionId) => {
    // Logged-in users: the name button goes to their own landing page
    // (business dashboard for business users, Home for shoppers).
    if (sectionId === 'home' && currentUser) {
      setCurrentPage(getLandingPage(currentUser));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentPage !== 'intro') {
      setCurrentPage('intro');
      setTimeout(() => {
        if (sectionId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenLoginStream = (stream) => {
    setLoginStream(stream);
    if (currentPage !== 'intro') {
      setCurrentPage('intro');
      setTimeout(() => {
        const el = document.getElementById('maison-login-portal');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      const el = document.getElementById('maison-login-portal');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  
  const handleOpenBusinessRegister = (role = 'merchant') => {
    setInitialBusinessRole(role);
    setCurrentPage('business-register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // After login: business users go to the dashboard that matches their role,
  // shoppers go to Home.
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentPage(getLandingPage(userData));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('maison_auth_token');
    localStorage.removeItem('maison_user_profile');
    setCurrentUser(null);
    setCurrentPage('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Business dashboards use their own full-screen layout (sidebar + header),
  // so they are rendered without the MAISON navbar.
  const Dashboard = DASHBOARD_BY_ROLE[currentUser?.role];

  {currentPage === 'dashboard' && Dashboard && (
    <Dashboard
      user={currentUser}
      onLogout={handleLogout}
      darkMode={darkMode}
      onToggleDark={() => setDarkMode(prev => !prev)}
    />
  )}

  return (
    <div
      className={`${
        darkMode ? 'dark bg-[#11100F] text-[#F5F2EB]' : 'bg-[#FAF7F2] text-[#181615]'
      } min-h-screen flex flex-col transition-colors duration-300`}>
      <MaisonNavbar
        currentPage={currentPage}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        onNavigateSection={handleNavigateSection}
        onOpenLoginStream={handleOpenLoginStream}
      
        onOpenBusinessRegister={handleOpenBusinessRegister}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentPage === 'intro' && (
          <IntroLogin
            loginStream={loginStream}
            setLoginStream={setLoginStream}
          
            onOpenBusinessRegister={handleOpenBusinessRegister}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        

        {currentPage === 'business-register' && (
          <BusinessRegister
            initialRole={initialBusinessRole}
            onOpenBusinessLogin={() => handleOpenLoginStream('business')}
            
          />
        )}

        {currentPage === 'home' && (
          <Home
            user={currentUser}
            onLogout={handleLogout}
            onBackToLanding={() => setCurrentPage('intro')}
          />
        )}
      </main>
    </div>
  );
}