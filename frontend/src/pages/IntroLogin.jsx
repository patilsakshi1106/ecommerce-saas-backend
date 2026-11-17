import React, { useState } from 'react';
import { authService } from '../App.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HERO_MOSAIC_ITEMS = [
  {
    title: 'Flagship Audio & Electronics',
    tag: 'Electronics & Tech',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Smart Espresso & Kitchen Appliances',
    tag: 'Home Appliances',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Architectural Living & Décor',
    tag: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Botanical Skincare & Fragrances',
    tag: 'Beauty & Personal Care',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
];

const MARKETPLACE_CATEGORIES = [
  {
    id: 'electronics',
    title: 'Electronics & Technology',
    desc: 'Flagship smartphones, noise-cancelling audio, laptops, smartwatches, and high-performance accessories.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    badge: 'Tech & Audio',
  },
  {
    id: 'appliances',
    title: 'Appliances',
    desc: 'Precision espresso makers, air purifiers, smart refrigerators, and modern kitchen engineering.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    badge: 'Home Systems',
  },
  {
    id: 'home-living',
    title: 'Home & Living',
    desc: 'Contemporary furniture, lighting, artisanal tableware, luxury bedding, and architectural home décor.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    badge: 'Interiors',
  },
  {
    id: 'fashion',
    title: 'Fashion & Apparel',
    desc: 'Tailored menswear, contemporary womenswear, seasonal essentials, and heritage Indian textiles.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    badge: 'Wardrobe',
  },
  {
    id: 'jewellery',
    title: 'Jewellery & Accessories',
    desc: 'Fine timepieces, leather goods, precision eyewear, and handcrafted gold and sterling silver pieces.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    badge: 'Timepieces & Fine Goods',
  },
  {
    id: 'beauty',
    title: 'Beauty & Personal Care',
    desc: 'Clinical skincare, fine fragrances, grooming instruments, and botanical wellness formulations.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    badge: 'Skincare & Wellness',
  },
  {
    id: 'grocery',
    title: 'Grocery & Essentials',
    desc: 'Gourmet pantry staples, single-origin coffees, organic teas, artisanal chocolates, and daily household needs.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    badge: 'Pantry & Daily Needs',
  },
  {
    id: 'sports',
    title: 'Sports & Fitness',
    desc: 'Connected home gym equipment, recovery tech, cycling gear, and high-performance athletic wear.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    badge: 'Performance',
  },
  {
    id: 'toys',
    title: 'Toys & Hobbies',
    desc: 'STEM robotics kits, collector scale models, acoustic instruments, board games, and creative studio supplies.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    badge: 'Leisure & Studio',
  },
  {
    id: 'other',
    title: 'Other Categories',
    desc: 'Pet luxury care, executive stationery, travel luggage, automotive care, and curated seasonal gifting.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    badge: 'Travel, Pet & Office',
  },
];

const WHY_MAISON_FEATURES = [
  {
    number: '01',
    title: 'All-In-One B2B Category Depth',
    desc: 'From commercial electronics and smart appliances to apparel and wholesale groceries, source every business department in one unified trade cart.',
  },
  {
    number: '02',
    title: 'Collaborative Group Bulk Buying',
    desc: 'Merchant MOQ of 500 units when you only need 100? Create a buying group so other retailers and startups needing smaller quantities can join and split the 500-unit bulk order.',
  },
  {
    number: '03',
    title: 'Direct B2B Trade Ecosystem',
    desc: 'Built exclusively for commercial trade—enabling manufacturers, wholesale merchants, retailers, and startups to scale without middlemen.',
  },
  {
    number: '04',
    title: 'Verified Supplier Discovery',
    desc: 'Curated cross-category wholesale catalogues and GST-verified merchant ratings help you find trusted bulk suppliers effortlessly.',
  },
  {
    number: '05',
    title: 'Startup & Retailer Friendly',
    desc: 'One cohesive infrastructure uniting high-volume manufacturers with independent retailers and emerging online sellers.',
  },
];

const BUSINESS_TIERS = [
  {
    role: 'merchant',
    badge: 'Manufacturers & Brand Owners',
    title: 'Merchants',
    desc: 'Showcase your full product catalogue across electronics, home, fashion, or FMCG. Manage inventory, fulfill wholesale and retail orders, and reach buyers nationwide.',
    cta: 'Join as a Merchant',
  },
  {
    role: 'retailer',
    badge: 'Commercial & Store Buyers',
    title: 'Retailers',
    desc: 'Source verified multi-category inventory at competitive wholesale margins, manage bulk procurement, and expand your physical or digital retail assortment.',
    cta: 'Join as a Retailer',
  },
  {
    role: 'startup',
    badge: 'Emerging Brands & Entrepreneurs',
    title: 'Startups and Online Sellers',
    desc: 'Establish and scale your online selling business with low-MOQ sourcing, founder-friendly onboarding tools, and immediate access to MAISON shoppers.',
    cta: 'Join as a Startup / Seller',
  },
];

export default function IntroLogin({
  loginStream,
  setLoginStream,
  onOpenShopperRegister,
  onOpenBusinessRegister,
  onLoginSuccess,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ type: '', message: '' });
  const [isResetting, setIsResetting] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const validateLogin = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email or Gmail address is required.';
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

    if (!validateLogin()) return;

    setIsSubmitting(true);
    try {
      const response = await authService.login(loginStream, { email, password });
      setPassword('');
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setServerError(
        err.message === 'Failed to fetch'
          ? 'Unable to connect to the MAISON backend server. Please ensure your Express server is running.'
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
        message: res.message || 'Password recovery instructions have been sent.',
      });
    } catch (err) {
      setResetStatus({
        type: 'error',
        message:
          err.message === 'Failed to fetch'
            ? 'Cannot connect to backend server. Note: POST /api/auth/forgot-password is not yet configured in the Express controller.'
            : err.message,
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div>
      {/* ====================================================================
          B. HERO BANNER — MULTI-CATEGORY LUXURY MARKETPLACE
          ==================================================================== */}
      <section className="relative overflow-hidden py-14 lg:py-24 border-b border-[#E5DEC9] dark:border-[#2E2A25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] bg-[#F2ECE1] dark:bg-[#1F1C19] border border-[#D0C6B0] dark:border-[#423C35] text-[#B89456] dark:text-[#CDA76E]">
              <span>✦ MAISON Unified Commerce</span>
            </div>

            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-[64px] font-semibold leading-[1.06] tracking-tight">
              Everything You Need.{' '}
              <span className="italic font-normal text-[#B89456] dark:text-[#CDA76E]">
                All in One Marketplace.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5C564F] dark:text-[#A8A096] leading-relaxed max-w-xl">
              Discover products across categories and connect with trusted businesses.
            </p>

            {/* Primary Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('explore-categories')}
                className="px-8 py-4 rounded-full bg-[#181615] text-[#FAF7F2] dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-[0.16em] hover:opacity-90 transition shadow-sm"
              >
                Explore MAISON →
              </button>
              <button
                type="button"
                onClick={() => onOpenBusinessRegister('merchant')}
                className="px-8 py-4 rounded-full border border-[#D0C6B0] dark:border-[#423C35] hover:border-[#B89456] text-xs font-semibold uppercase tracking-[0.16em] transition"
              >
                Grow Your Business
              </button>
            </div>

            {/* Category Highlights Strip */}
            <div className="pt-6 border-t border-[#E5DEC9] dark:border-[#2E2A25] grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="block font-editorial text-2xl font-semibold text-[#B89456] dark:text-[#CDA76E]">
                  10+ Departments
                </span>
                <span className="text-[#5C564F] dark:text-[#A8A096]">
                  Tech, Home, Appliances, Beauty, Fashion &amp; Grocery
                </span>
              </div>
              <div>
                <span className="block font-editorial text-2xl font-semibold text-[#B89456] dark:text-[#CDA76E]">
                  B2C &amp; B2B
                </span>
                <span className="text-[#5C564F] dark:text-[#A8A096]">
                  Personal shopping &amp; GST-verified wholesale
                </span>
              </div>
              <div>
                <span className="block font-editorial text-2xl font-semibold text-[#B89456] dark:text-[#CDA76E]">
                  Unified Access
                </span>
                <span className="text-[#5C564F] dark:text-[#A8A096]">
                  Seamless Shopper &amp; Business portals
                </span>
              </div>
            </div>
          </div>

          {/* Right Multi-Category Product Composition Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25] shadow-sm">
              {HERO_MOSAIC_ITEMS.map((item) => (
                <div
                  key={item.title}
                  onClick={() => scrollToSection('explore-categories')}
                  className="group relative h-52 sm:h-60 rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[#CDA76E] font-semibold">
                      {item.tag}
                    </span>
                    <h3 className="font-editorial text-lg sm:text-xl font-medium leading-snug mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          C. ABOUT MAISON
          ==================================================================== */}
      <section
        id="about-maison"
        className="py-16 lg:py-24 border-b border-[#E5DEC9] dark:border-[#2E2A25]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B89456] dark:text-[#CDA76E]">
              About MAISON
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
              A Modern Marketplace Designed for Every Everyday &amp; Extraordinary Need
            </h2>
            <p className="text-sm sm:text-base text-[#5C564F] dark:text-[#A8A096] leading-relaxed">
              <strong>MAISON</strong> is an all-in-one multi-category e-commerce marketplace built to bring refined quality, convenience, and trust to online commerce. Rather than limiting shoppers to a single vertical, MAISON unites technology, home appliances, living décor, personal care, wardrobe essentials, and daily groceries under one roof.
            </p>
            <p className="text-sm sm:text-base text-[#5C564F] dark:text-[#A8A096] leading-relaxed">
              Our vision is to bridge individual shoppers with verified businesses of every scale—giving consumers a trustworthy destination to shop while empowering established merchants, retail stores, and ambitious startups with the tools to grow online.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-3">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
                <h3 className="font-editorial text-xl font-semibold text-[#B89456] dark:text-[#CDA76E]">
                  For Discerning Shoppers
                </h3>
                <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-1.5 leading-relaxed">
                  Curated multi-category discovery, transparent vendor credentials, and a streamlined personal shopping account.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
                <h3 className="font-editorial text-xl font-semibold text-[#B89456] dark:text-[#CDA76E]">
                  For Ambitious Businesses
                </h3>
                <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-1.5 leading-relaxed">
                  Dedicated onboarding for Merchants, Retailers, and Startups with GST verification and unified business authentication.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-64 rounded-3xl overflow-hidden border border-[#E5DEC9] dark:border-[#2E2A25]">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                  alt="Modern E-Commerce Experience"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 rounded-3xl bg-[#F2ECE1] dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B89456]">
                  Connected Ecosystem
                </span>
                <p className="font-editorial text-2xl font-medium mt-1">
                  Connecting Shoppers, Merchants, Retailers &amp; Startups Nationwide.
                </p>
              </div>
            </div>
            <div className="space-y-4 pt-6">
              <div className="p-6 rounded-3xl bg-[#181615] text-[#FAF7F2] dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#CDA76E]">
                  The MAISON Standard
                </span>
                <p className="font-editorial text-2xl font-medium mt-1">
                  Luxury presentation meets everyday marketplace practicality.
                </p>
              </div>
              <div className="h-64 rounded-3xl overflow-hidden border border-[#E5DEC9] dark:border-[#2E2A25]">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                  alt="Curated Home & Lifestyle"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          D. EXPLORE CATEGORIES (10 MULTI-CATEGORY SHOWCASE)
          ==================================================================== */}
      <section
        id="explore-categories"
        className="py-16 lg:py-24 border-b border-[#E5DEC9] dark:border-[#2E2A25]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B89456] dark:text-[#CDA76E]">
                Explore Categories
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-semibold mt-1">
                Ten Departments. One Destination.
              </h2>
            </div>
            <p className="text-sm text-[#5C564F] dark:text-[#A8A096] max-w-md">
              Select any department below to preview its marketplace focus or register to start shopping and selling.
            </p>
          </div>

          {/* Interactive Selected Category Spotlight Banner */}
          {selectedCategory && (
            <div className="mb-8 p-6 rounded-3xl bg-[#F2ECE1] dark:bg-[#1F1C19] border border-[#B89456] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B89456]">
                  Selected Department • {selectedCategory.badge}
                </span>
                <h3 className="font-editorial text-3xl font-semibold mt-0.5">
                  {selectedCategory.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C564F] dark:text-[#A8A096] mt-1">
                  {selectedCategory.desc} Sign in or register to browse live listings in this category.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onOpenShopperRegister}
                  className="px-5 py-2.5 rounded-full bg-[#181615] text-white dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-wider"
                >
                  Shop This Category
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-2 text-xs text-[#5C564F] dark:text-[#A8A096] hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* 10-Category Responsive Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="group rounded-2xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25] hover:border-[#B89456] overflow-hidden shadow-sm transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/70 text-[#FAF7F2] backdrop-blur-sm">
                    {cat.badge}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial text-xl font-semibold group-hover:text-[#B89456] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-1.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#E5DEC9] dark:border-[#2E2A25] flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#B89456] dark:text-[#CDA76E]">
                    <span>Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          E. WHY MAISON? (B2B & GROUP BULK BUYING)
          ==================================================================== */}
      <section className="py-16 lg:py-24 bg-[#F2ECE1]/60 dark:bg-[#181614] border-b border-[#E5DEC9] dark:border-[#2E2A25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B89456] dark:text-[#CDA76E]">
              Why MAISON?
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-semibold mt-1">
              Designed for Smarter Sourcing &amp; Scalable B2B Commerce
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {WHY_MAISON_FEATURES.map((item) => (
              <div
                key={item.number}
                className="p-6 rounded-2xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25] flex flex-col justify-between"
              >
                <div>
                  <span className="font-editorial text-3xl font-semibold text-[#B89456] dark:text-[#CDA76E]">
                    {item.number}
                  </span>
                  <h3 className="font-editorial text-xl font-semibold mt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Collaborative Bulk Group-Buy Highlight Banner */}
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#B89456]/50 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] bg-[#F2ECE1] dark:bg-[#2A2622] text-[#B89456] dark:text-[#CDA76E]">
                ✦ Signature Feature • MOQ Group Splitting
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold">
                Need 100 Units from a 500-Unit Merchant Bulk Listing?
              </h3>
              <p className="text-xs sm:text-sm text-[#5C564F] dark:text-[#A8A096] leading-relaxed">
                Don’t overstock or lock up your working capital. On MAISON, any retailer or startup can <strong>create a Bulk Buying Group</strong> for a 500-unit merchant batch, claim the 100 units they need, and let other verified retailers join the group to claim the remaining units at factory-direct bulk pricing.
              </p>
            </div>

            <div className="w-full lg:w-auto shrink-0 p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#181614] border border-[#E5DEC9] dark:border-[#2E2A25] text-xs space-y-2 min-w-[260px]">
              <div className="flex justify-between font-semibold">
                <span>Merchant Bulk MOQ:</span>
                <span className="font-mono-code text-[#B89456]">500 Units</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5DEC9] dark:bg-[#2E2A25] overflow-hidden flex">
                <div className="w-1/5 bg-[#181615] dark:bg-[#FAF7F2]" title="Your Claim: 100 Units" />
                <div className="w-3/5 bg-[#B89456]" title="Joined Retailers: 300 Units" />
              </div>
              <div className="flex justify-between text-[11px] text-[#5C564F] dark:text-[#A8A096]">
                <span>You: 100u • 3 Retailers: 300u</span>
                <span className="font-semibold text-[#B89456]">100u Left</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          F. BUSINESS SECTION — "GROW YOUR BUSINESS WITH MAISON"
          ==================================================================== */}
      <section
        id="for-businesses"
        className="py-16 lg:py-24 border-b border-[#E5DEC9] dark:border-[#2E2A25]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B89456] dark:text-[#CDA76E]">
                MAISON Commercial Partner Network
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-semibold mt-1">
                Grow Your Business with MAISON.
              </h2>
            </div>
            <p className="text-sm text-[#5C564F] dark:text-[#A8A096] max-w-md">
              Choose your business category to register. All registered business partners authenticate through a single unified Business Login.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {BUSINESS_TIERS.map((tier) => (
              <div
                key={tier.role}
                className="p-8 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25] hover:border-[#B89456] shadow-sm flex flex-col justify-between transition-all"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#F2ECE1] dark:bg-[#2A2622] text-[#B89456] dark:text-[#CDA76E] mb-4">
                    {tier.badge}
                  </span>
                  <h3 className="font-editorial text-3xl font-semibold">
                    {tier.title}
                  </h3>
                  <p className="text-sm text-[#5C564F] dark:text-[#A8A096] mt-3 leading-relaxed">
                    {tier.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenBusinessRegister(tier.role)}
                  className="mt-8 w-full py-3.5 px-5 rounded-full bg-[#181615] text-[#FAF7F2] dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-90 transition"
                >
                  {tier.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. UNIFIED BUSINESS LOGIN EXPERIENCE
          ==================================================================== */}
      <section id="maison-login-portal" className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl overflow-hidden border border-[#E5DEC9] dark:border-[#2E2A25] bg-white dark:bg-[#1F1C19] shadow-lg grid lg:grid-cols-12">
            {/* Left Informational Panel */}
            <div className="lg:col-span-5 bg-[#181615] text-[#FAF7F2] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] border border-[#B89456]/50 text-[#CDA76E]">
                  Unified Business Authentication
                </span>
                <h2 className="font-editorial text-4xl font-medium mt-4 leading-tight">
                  One Business Login for Merchants, Retailers &amp; Startups.
                </h2>
                <p className="text-xs sm:text-sm text-[#E5DEC9]/80 mt-3 leading-relaxed">
                  Sign in with your registered business email and password. MAISON automatically identifies your registered business role (Merchant, Retailer, or Startup) and directs you to your workspace.
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-white/15 space-y-3 text-xs">
                <span className="block text-[#CDA76E] uppercase tracking-wider font-semibold">
                  New to MAISON?
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => onOpenBusinessRegister('merchant')}
                    className="px-4 py-2 rounded-full bg-[#B89456] text-[#11100F] font-semibold uppercase tracking-wider hover:opacity-90 transition"
                  >
                    Business Registration →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Login Form (Common Business Login Only) */}
            <div className="lg:col-span-7 p-8 sm:p-12">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B89456] dark:text-[#CDA76E]">
                    MAISON Account Access
                  </span>
                  <h3 className="font-editorial text-3xl font-semibold mt-0.5">
                    Business Login
                  </h3>
                </div>
              </div>

              <div className="mb-5 px-4 py-2.5 rounded-xl bg-[#F2ECE1]/70 dark:bg-[#181614] border border-[#E5DEC9] dark:border-[#2E2A25] text-xs text-[#5C564F] dark:text-[#A8A096]">
                Supports <strong>Merchants</strong>, <strong>Retailers</strong>, and{' '}
                <strong>Startups / Online Sellers</strong>. Your role is automatically retrieved upon login.
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="mb-5 p-4 rounded-xl bg-[#B93829]/10 border border-[#B93829] text-xs text-[#B93829] dark:text-[#E05A47]"
                >
                  <strong className="block font-semibold uppercase tracking-wider mb-0.5">
                    Authentication Error
                  </strong>
                  {serverError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="maison-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096] mb-1.5"
                  >
                    Email / Gmail Address
                  </label>
                  <input
                    id="maison-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    placeholder="partner@business.com"
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
                      htmlFor="maison-password"
                      className="text-xs font-semibold uppercase tracking-wider text-[#5C564F] dark:text-[#A8A096]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(!showForgotModal)}
                      className="text-xs font-medium text-[#B89456] dark:text-[#CDA76E] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="maison-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password)
                          setFieldErrors({ ...fieldErrors, password: '' });
                      }}
                      placeholder="Enter your password"
                      className={`maison-input pr-16 ${
                        fieldErrors.password ? 'input-error' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-[#5C564F] dark:text-[#A8A096]"
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
                  className="w-full py-3.5 px-6 rounded-full bg-[#181615] text-[#FAF7F2] dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-[0.16em] hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting && <span className="maison-spinner" />}
                  <span>
                    {isSubmitting ? 'Signing In...' : 'Login to Business Account'}
                  </span>
                </button>
              </form>

              {/* Forgot Password Box */}
              {showForgotModal && (
                <div className="mt-5 p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#181614] border border-[#E5DEC9] dark:border-[#2E2A25]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-editorial text-lg font-semibold">
                      Reset Your Password
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="text-xs text-[#5C564F]"
                    >
                      ✕ Close
                    </button>
                  </div>
                  {resetStatus.message && (
                    <div className="p-2.5 rounded-lg text-xs mb-3 border border-[#B93829] text-[#B93829] dark:text-[#E05A47]">
                      {resetStatus.message}
                    </div>
                  )}
                  <form onSubmit={handleForgotPasswordSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter registered email"
                      className="maison-input text-xs py-2"
                    />
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="px-4 py-2 rounded-xl bg-[#B89456] text-white text-xs font-semibold uppercase tracking-wider shrink-0"
                    >
                      {isResetting ? '...' : 'Reset'}
                    </button>
                  </form>
                </div>
              )}

              {/* Bottom Registration Link */}
              <div className="mt-6 pt-5 border-t border-[#E5DEC9] dark:border-[#2E2A25] flex items-center justify-between text-xs text-[#5C564F] dark:text-[#A8A096]">
                <span>Don’t have a business account yet?</span>
                <button
                  type="button"
                  onClick={() => onOpenBusinessRegister('merchant')}
                  className="font-semibold text-[#B89456] dark:text-[#CDA76E] hover:underline"
                >
                  Go to Business Registration →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          G. FOOTER
          ==================================================================== */}
      <footer
        id="maison-footer"
        className="border-t border-[#E5DEC9] dark:border-[#2E2A25] bg-[#F2ECE1] dark:bg-[#181614] pt-14 pb-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#E5DEC9] dark:border-[#2E2A25]">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#181615] text-[#FAF7F2] dark:bg-[#F5F2EB] dark:text-[#11100F] flex items-center justify-center font-editorial text-lg font-bold">
                  M
                </div>
                <span className="font-editorial text-2xl font-semibold tracking-[0.2em]">
                  MAISON
                </span>
              </div>
              <p className="text-xs text-[#5C564F] dark:text-[#A8A096] max-w-sm leading-relaxed">
                MAISON is a premier all-in-one multi-category e-commerce marketplace connecting shoppers, merchants, retailers, and startup brands across electronics, home, fashion, beauty, appliances, and daily essentials.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#B89456] dark:text-[#CDA76E]">
                Marketplace
              </h4>
              <ul className="space-y-1.5 text-[#5C564F] dark:text-[#A8A096]">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about-maison')}
                    className="hover:underline"
                  >
                    About MAISON
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('explore-categories')}
                    className="hover:underline"
                  >
                    Explore Categories
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenShopperRegister}
                    className="hover:underline"
                  >
                    Shopper Registration
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#B89456] dark:text-[#CDA76E]">
                For Businesses
              </h4>
              <ul className="space-y-1.5 text-[#5C564F] dark:text-[#A8A096]">
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenBusinessRegister('merchant')}
                    className="hover:underline"
                  >
                    Merchant Registration
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenBusinessRegister('retailer')}
                    className="hover:underline"
                  >
                    Retailer Registration
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenBusinessRegister('startup')}
                    className="hover:underline"
                  >
                    Startup / Seller Registration
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStream('business');
                      scrollToSection('maison-login-portal');
                    }}
                    className="hover:underline"
                  >
                    Unified Business Login
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#B89456] dark:text-[#CDA76E]">
                Support &amp; Legal
              </h4>
              <ul className="space-y-1.5 text-[#5C564F] dark:text-[#A8A096]">
                <li>
                  <a href="#maison-footer" className="hover:underline">
                    Contact Us (concierge@maison.in)
                  </a>
                </li>
                <li>
                  <a href="#maison-footer" className="hover:underline">
                    Help &amp; Support Center
                  </a>
                </li>
                <li>
                  <a href="#maison-footer" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#maison-footer" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C564F] dark:text-[#A8A096]">
            <div>© {new Date().getFullYear()} MAISON Marketplace. All rights reserved.</div>
            <div className="flex items-center gap-5">
              <a href="#maison-footer" className="hover:text-[#B89456]">
                Instagram
              </a>
              <a href="#maison-footer" className="hover:text-[#B89456]">
                LinkedIn
              </a>
              <a href="#maison-footer" className="hover:text-[#B89456]">
                X (Twitter)
              </a>
              <a href="#maison-footer" className="hover:text-[#B89456]">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}