import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Edit3,
  Eye,
  Globe,
  Phone,
  Mail,
  Building2,
  Package,
  Inbox,
  Users,
  FileText,
  Calendar,
  Award,
  MessageSquare,
  Briefcase,
  BarChart3,
  Plus,
} from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  ANALYTICS_BY_RANGE,
} from './merchantData.js';

const STATUS_COLORS = {
  New: '#C5A059',
  Responded: '#3B82F6',
  'In Discussion': '#F59E0B',
  Converted: '#10B981',
  Closed: '#6B7280',
  Accepted: '#10B981',
  Shortlisted: '#C5A059',
  Pending: '#F59E0B',
  Declined: '#EF4444',
  Withdrawn: '#6B7280',
  Expired: '#9CA3AF',
};

export function OverviewSection({
  theme,
  businessProfile,
  products,
  enquiries,
  groupBuys,
  quotations,
  wonDeals = [],
  opportunities,
  conversations,
  profileCompletion,
  onNavigate,
  onOpenGroupBuyDetails,
  onOpenConversation,
}) {
  const [activityRange, setActivityRange] = useState('30d');
  const [hoveredBarIdx, setHoveredBarIdx] = useState(null);

  // Derived real metrics from existing frontend state (no invented numbers)
  const activeProducts = useMemo(
    () => products.filter((p) => !p.archived),
    [products]
  );
  const inStockCount = useMemo(
    () => activeProducts.filter((p) => p.availability === 'In Stock').length,
    [activeProducts]
  );
  const newEnquiriesCount = useMemo(
    () => enquiries.filter((e) => e.status === 'New').length,
    [enquiries]
  );
  const activeGroupBuys = useMemo(
    () =>
      groupBuys.filter((g) =>
        ['Open', 'Target Reached', 'Negotiating'].includes(g.status)
      ),
    [groupBuys]
  );
  const totalPooledUnits = useMemo(
    () => activeGroupBuys.reduce((sum, g) => sum + (g.totalQuantity || 0), 0),
    [activeGroupBuys]
  );
  const acceptedQuotesCount = useMemo(
    () => quotations.filter((q) => q.status === 'Accepted').length,
    [quotations]
  );
  const shortlistedQuotesCount = useMemo(
    () => quotations.filter((q) => q.status === 'Shortlisted').length,
    [quotations]
  );
  const acceptanceRate = quotations.length
    ? Math.round((acceptedQuotesCount / quotations.length) * 100)
    : 0;

  const popularProducts = useMemo(
    () =>
      [...activeProducts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 4),
    [activeProducts]
  );

  // Analytics range data
  const rangeData = ANALYTICS_BY_RANGE[activityRange] || ANALYTICS_BY_RANGE['30d'];
  const maxTrendViews = Math.max(...rangeData.trend.map((t) => t.views), 1);

  // Enquiry Breakdown by Status (from live enquiries state)
  const enquiryBreakdown = useMemo(() => {
    const statuses = ['New', 'Responded', 'In Discussion', 'Converted', 'Closed'];
    const total = enquiries.length || 1;
    return statuses.map((status) => {
      const count = enquiries.filter((e) => e.status === status).length;
      return {
        status,
        count,
        pct: Math.round((count / total) * 100),
        color: STATUS_COLORS[status],
      };
    });
  }, [enquiries]);

  // Quotation Performance Donut Segments (from live quotations state)
  const quotationBreakdown = useMemo(() => {
    const statuses = ['Accepted', 'Shortlisted', 'Pending', 'Declined', 'Withdrawn', 'Expired'];
    const total = quotations.length;
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    let accumulated = 0;

    const items = statuses
      .map((status) => {
        const count = quotations.filter((q) => q.status === status).length;
        const pct = total ? (count / total) * 100 : 0;
        const dash = total ? (count / total) * circumference : 0;
        const offset = -accumulated;
        accumulated += dash;
        return {
          status,
          count,
          pct: Math.round(pct),
          dash,
          offset,
          color: STATUS_COLORS[status],
        };
      })
      .filter((item) => item.count > 0);

    return { items, total, radius, circumference };
  }, [quotations]);

  // Group Buy Activity Funnel (from live groupBuys, quotations, wonDeals)
  const groupBuyActivity = useMemo(() => {
    const groupBuyQuotes = quotations.filter((q) => q.sourceType === 'Group Buy');
    const negotiatingCount = groupBuyQuotes.filter(
      (q) =>
        q.status === 'Shortlisted' ||
        ['Active', 'Counter-Offer Sent', 'Awaiting Buyer'].includes(q.negotiationStatus)
    ).length;

    const stages = [
      {
        label: 'Open Requests',
        count: activeGroupBuys.length,
        color: '#C5A059',
        hint: 'Available to quote',
      },
      {
        label: 'Quotes Sent',
        count: groupBuyQuotes.length,
        color: '#3B82F6',
        hint: 'Your participation',
      },
      {
        label: 'In Negotiation',
        count: negotiatingCount,
        color: '#F59E0B',
        hint: 'Active discussions',
      },
      {
        label: 'Deals Won',
        count: wonDeals.length,
        color: '#10B981',
        hint: 'Accepted bulk pools',
      },
    ];
    const maxVal = Math.max(...stages.map((s) => s.count), 1);
    return { stages, maxVal };
  }, [activeGroupBuys, quotations, wonDeals]);

  const kpiCards = [
    {
      label: 'Products Listed',
      value: activeProducts.length,
      meta: `${inStockCount} in stock`,
      icon: Package,
      accent: 'text-[#C5A059] bg-[#C5A059]/15',
      tab: 'catalogue',
    },
    {
      label: 'New Enquiries',
      value: newEnquiriesCount,
      meta: `${enquiries.length} total received`,
      icon: Inbox,
      accent: 'text-blue-500 bg-blue-500/15',
      tab: 'enquiries',
    },
    {
      label: 'Active Group Buys',
      value: activeGroupBuys.length,
      meta: `${totalPooledUnits.toLocaleString('en-IN')} units pooled`,
      icon: Users,
      accent: 'text-amber-500 bg-amber-500/15',
      tab: 'group-buys',
    },
    {
      label: 'Quotations Sent',
      value: quotations.length,
      meta: `${shortlistedQuotesCount} shortlisted`,
      icon: FileText,
      accent: 'text-purple-500 bg-purple-500/15',
      tab: 'quotations',
    },
    {
      label: 'Accepted Quotes',
      value: acceptedQuotesCount,
      meta: `${acceptanceRate}% acceptance rate`,
      icon: CheckCircle2,
      accent: 'text-emerald-500 bg-emerald-500/15',
      tab: 'quotations',
    },
    {
      label: 'Profile Views',
      value: ANALYTICS_BY_RANGE['30d'].profileViews.toLocaleString('en-IN'),
      meta: 'Last 30 days',
      icon: Eye,
      accent: 'text-[#C5A059] bg-[#C5A059]/15',
      tab: 'analytics',
    },
  ];

  const badgeTone = (status) => {
    switch (status) {
      case 'New':
      case 'Open':
      case 'Accepted':
      case 'Converted':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Shortlisted':
      case 'Target Reached':
      case 'Responded':
        return 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/40';
      case 'Pending':
      case 'In Discussion':
      case 'Negotiating':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-neutral-500/15 text-neutral-500 border-neutral-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* ==================================================================
          1. COMPACT EXECUTIVE WELCOME STRIP & PROFILE COMPLETION
          ================================================================== */}
      <div
        className={`p-5 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${theme.card}`}
      >
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              Welcome back, {businessProfile.contactPerson}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck size={12} /> {businessProfile.verificationStatus}
            </span>
          </div>
          <p className={`text-xs ${theme.muted}`}>
            {businessProfile.businessName} • {businessProfile.category} • {businessProfile.city},{' '}
            {businessProfile.state}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Compact Profile Completion Pill */}
          <button
            type="button"
            onClick={() => onNavigate('business')}
            className="px-3.5 py-2 rounded-lg border border-inherit hover:border-[#C5A059] flex items-center gap-3 text-left transition"
            title={
              profileCompletion.missingFields.length > 0
                ? `Missing: ${profileCompletion.missingFields.join(', ')}`
                : 'Profile complete'
            }
          >
            <div>
              <span className={`block text-[10px] uppercase tracking-wider ${theme.muted}`}>
                Profile Strength
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-20 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#C5A059]"
                    style={{ width: `${profileCompletion.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#C5A059]">
                  {profileCompletion.percentage}%
                </span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('catalogue')}
            className="px-3.5 py-2.5 rounded-lg border border-inherit hover:border-[#C5A059] text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus size={14} /> Add Product
          </button>

          <button
            type="button"
            onClick={() => onNavigate('group-buys')}
            className="px-4 py-2.5 rounded-lg bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition"
          >
            Explore Group Buys <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ==================================================================
          2. COMPACT 6-METRIC HORIZONTAL KPI GRID
          ================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onNavigate(card.tab)}
              className={`p-4 rounded-xl border text-left hover:border-[#C5A059] transition group ${theme.card}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-medium truncate ${theme.muted}`}>
                  {card.label}
                </span>
                <span className={`p-1.5 rounded-lg shrink-0 ${card.accent}`}>
                  <Icon size={14} />
                </span>
              </div>
              <p className="font-serif text-2xl font-semibold mt-2.5 tracking-tight group-hover:text-[#C5A059] transition-colors">
                {card.value}
              </p>
              <p className={`text-[11px] mt-1 truncate ${theme.muted}`}>{card.meta}</p>
            </button>
          );
        })}
      </div>

      {/* ==================================================================
          3. VISUAL ANALYTICS ROW 1: BUSINESS ACTIVITY + QUOTATION DONUT
          ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Business Activity Chart */}
        <div className={`lg:col-span-7 p-5 rounded-xl border flex flex-col justify-between ${theme.card}`}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-[#C5A059]" />
                <h3 className="font-serif text-lg font-semibold">Business Activity</h3>
              </div>
              <p className={`text-xs mt-0.5 ${theme.muted}`}>
                Storefront &amp; product visits alongside enquiry flow ({rangeData.label})
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: '90d', label: '90D' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActivityRange(r.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition ${
                    activityRange === r.id
                      ? 'bg-[#C5A059] text-black border-[#C5A059]'
                      : 'border-inherit hover:border-[#C5A059]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onNavigate('analytics')}
                className="ml-1 text-xs text-[#C5A059] hover:underline font-medium"
              >
                Full Report →
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="h-44 flex items-end gap-3 pt-6 px-2 border-b border-inherit relative">
            {rangeData.trend.map((pt, idx) => {
              const heightPct = Math.max(14, Math.round((pt.views / maxTrendViews) * 100));
              const isHovered = hoveredBarIdx === idx;
              return (
                <div
                  key={pt.label}
                  onMouseEnter={() => setHoveredBarIdx(idx)}
                  onMouseLeave={() => setHoveredBarIdx(null)}
                  className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer"
                >
                  {isHovered && (
                    <div className="absolute -top-8 z-10 px-2.5 py-1 rounded bg-[#181615] text-[#FAF7F2] text-[10px] font-medium whitespace-nowrap shadow-lg border border-[#C5A059]/40">
                      {pt.views.toLocaleString()} visits • {pt.enquiries} enquiries
                    </div>
                  )}
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[36px] rounded-t transition-all duration-300 ${
                        isHovered ? 'bg-[#C5A059]' : 'bg-[#C5A059]/75'
                      }`}
                    />
                  </div>
                  <span className={`text-[11px] mt-2 ${theme.muted}`}>{pt.label}</span>
                </div>
              );
            })}
          </div>

          {/* Real Summary Footer */}
          <div className="grid grid-cols-3 gap-3 pt-3 text-xs">
            <div>
              <span className={theme.muted}>Profile Views</span>
              <p className="font-semibold mt-0.5">{rangeData.profileViews.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className={theme.muted}>Product Views</span>
              <p className="font-semibold mt-0.5">{rangeData.productViews.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className={theme.muted}>Enquiries ({rangeData.label})</span>
              <p className="font-semibold mt-0.5 text-[#C5A059]">{rangeData.enquiriesReceived}</p>
            </div>
          </div>
        </div>

        {/* Quotation Performance Donut Chart */}
        <div className={`lg:col-span-5 p-5 rounded-xl border flex flex-col justify-between ${theme.card}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-serif text-lg font-semibold">Quotation Performance</h3>
              <p className={`text-xs ${theme.muted}`}>Status distribution of submitted offers</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('quotations')}
              className="text-xs text-[#C5A059] hover:underline font-medium"
            >
              Manage →
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-auto py-2">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90">
                <circle
                  cx="55"
                  cy="55"
                  r={quotationBreakdown.radius}
                  fill="none"
                  stroke="currentColor"
                  className="text-black/10 dark:text-white/10"
                  strokeWidth="12"
                />
                {quotationBreakdown.items.map((seg) => (
                  <circle
                    key={seg.status}
                    cx="55"
                    cy="55"
                    r={quotationBreakdown.radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeDasharray={`${seg.dash} ${quotationBreakdown.circumference}`}
                    strokeDashoffset={seg.offset}
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-serif text-2xl font-semibold leading-none">
                  {quotationBreakdown.total}
                </span>
                <span className={`text-[10px] uppercase tracking-wider mt-1 ${theme.muted}`}>
                  Quotes
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 w-full space-y-2 text-xs">
              {quotationBreakdown.items.map((seg) => (
                <div key={seg.status} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span>{seg.status}</span>
                  </span>
                  <span className="font-semibold">
                    {seg.count}{' '}
                    <span className={`font-normal ${theme.muted}`}>({seg.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`pt-3 border-t border-inherit flex justify-between text-xs ${theme.muted}`}>
            <span>Acceptance Rate</span>
            <strong className="text-emerald-600 dark:text-emerald-400">{acceptanceRate}%</strong>
          </div>
        </div>
      </div>

      {/* ==================================================================
          4. VISUAL ANALYTICS ROW 2: ENQUIRY BREAKDOWN + GROUP BUY ACTIVITY
          ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Enquiry Analytics */}
        <div className={`lg:col-span-6 p-5 rounded-xl border space-y-4 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold">Enquiry Analytics</h3>
              <p className={`text-xs ${theme.muted}`}>
                Breakdown of {enquiries.length} received enquiries by current status
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('enquiries')}
              className="text-xs text-[#C5A059] hover:underline font-medium"
            >
              View Enquiries →
            </button>
          </div>

          {/* Stacked Proportion Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-black/10 dark:bg-white/10">
            {enquiryBreakdown
              .filter((item) => item.count > 0)
              .map((item) => (
                <div
                  key={item.status}
                  style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  title={`${item.status}: ${item.count}`}
                  className="h-full transition-all duration-300"
                />
              ))}
          </div>

          {/* Status Breakdown Rows */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {enquiryBreakdown.map((item) => (
              <button
                key={item.status}
                type="button"
                onClick={() => onNavigate('enquiries')}
                className="p-2.5 rounded-lg border border-inherit hover:border-[#C5A059] text-left transition"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`text-[11px] truncate ${theme.muted}`}>{item.status}</span>
                </div>
                <p className="font-serif text-xl font-semibold mt-1">{item.count}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Group Buy Activity */}
        <div className={`lg:col-span-6 p-5 rounded-xl border space-y-4 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold">Group Buy Activity</h3>
              <p className={`text-xs ${theme.muted}`}>
                Marketplace bulk pools &amp; your participation funnel
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('group-buys')}
              className="text-xs text-[#C5A059] hover:underline font-medium"
            >
              Group Buys →
            </button>
          </div>

          <div className="space-y-3">
            {groupBuyActivity.stages.map((stage) => {
              const widthPct = Math.max(
                8,
                Math.round((stage.count / groupBuyActivity.maxVal) * 100)
              );
              return (
                <div key={stage.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">
                      {stage.label}{' '}
                      <span className={`font-normal ${theme.muted}`}>• {stage.hint}</span>
                    </span>
                    <span className="font-semibold">{stage.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%`, backgroundColor: stage.color }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================================
          5. DEDICATED GROUP BUY REQUESTS RELEVANT TO MERCHANT
          ================================================================== */}
      <div className={`p-5 rounded-xl border space-y-4 ${theme.card}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users size={17} className="text-[#C5A059]" />
              <h3 className="font-serif text-xl font-semibold">
                Group Buy Requests Relevant to Your Business
              </h3>
            </div>
            <p className={`text-xs mt-0.5 ${theme.muted}`}>
              Combined wholesale demand from retailers and startups — submit quotations directly
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('group-buys')}
            className="px-4 py-2 rounded-md bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
          >
            Open Group Buys <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {activeGroupBuys.slice(0, 4).map((gb) => (
            <div
              key={gb.id}
              className="p-4 rounded-xl border border-inherit hover:border-[#C5A059] transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C5A059] truncate">
                    {gb.category}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badgeTone(
                      gb.status
                    )}`}
                  >
                    {gb.status}
                  </span>
                </div>

                <h4 className="font-serif text-base font-semibold leading-snug line-clamp-2">
                  {gb.productName}
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded bg-black/5 dark:bg-white/5">
                    <span className={`block text-[10px] ${theme.muted}`}>Combined Qty</span>
                    <strong className="text-[#C5A059]">{gb.totalQuantity} units</strong>
                  </div>
                  <div className="p-2 rounded bg-black/5 dark:bg-white/5">
                    <span className={`block text-[10px] ${theme.muted}`}>Participants</span>
                    <strong>{gb.participatingCount} businesses</strong>
                  </div>
                </div>

                <div className={`text-[11px] space-y-1 pt-1 ${theme.muted}`}>
                  <p className="flex items-center justify-between">
                    <span>Target Price:</span>
                    <strong className="text-inherit">
                      {gb.targetPricePerUnit ? `₹${gb.targetPricePerUnit}/unit` : 'Open Quote'}
                    </strong>
                  </p>
                  <p className="flex items-center gap-1 truncate">
                    <MapPin size={11} className="shrink-0 text-[#C5A059]" />
                    <span className="truncate">{gb.deliveryLocation}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar size={11} className="shrink-0 text-[#C5A059]" />
                    <span>Deadline: {gb.deadline}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenGroupBuyDetails(gb)}
                className="w-full py-2 rounded-md border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-xs font-semibold transition"
              >
                View &amp; Submit Quote
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================
          6. RECENT ENQUIRIES, QUOTATION ACTIVITY & MESSAGES (3-COLUMN)
          ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Enquiries */}
        <div className={`p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Recent Enquiries</h3>
            <button
              type="button"
              onClick={() => onNavigate('enquiries')}
              className="text-xs text-[#C5A059] hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="space-y-2.5">
            {enquiries.slice(0, 3).map((enq) => (
              <div
                key={enq.id}
                onClick={() => onNavigate('enquiries')}
                className="p-3 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer flex items-center justify-between gap-2 transition"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{enq.businessName}</p>
                  <p className={`text-[11px] truncate ${theme.muted}`}>{enq.subject}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeTone(
                      enq.status
                    )}`}
                  >
                    {enq.status}
                  </span>
                  <p className={`text-[10px] mt-1 ${theme.muted}`}>{enq.dateReceived}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotation Activity */}
        <div className={`p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Recent Quotations</h3>
            <button
              type="button"
              onClick={() => onNavigate('quotations')}
              className="text-xs text-[#C5A059] hover:underline"
            >
              My Quotations →
            </button>
          </div>
          <div className="space-y-2.5">
            {quotations.slice(0, 3).map((q) => (
              <div
                key={q.id}
                onClick={() => onNavigate('quotations')}
                className="p-3 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer flex items-center justify-between gap-2 transition"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{q.productTitle}</p>
                  <p className={`text-[11px] truncate ${theme.muted}`}>
                    {q.buyerName} • ₹{q.offeredPricePerUnit}/u
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badgeTone(
                    q.status
                  )}`}
                >
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className={`p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold flex items-center gap-1.5">
              <MessageSquare size={15} className="text-[#C5A059]" /> Recent Messages
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('messages')}
              className="text-xs text-[#C5A059] hover:underline"
            >
              Inbox →
            </button>
          </div>
          <div className="space-y-2.5">
            {conversations.slice(0, 3).map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => onOpenConversation(conv.id)}
                  className="p-3 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer flex items-start justify-between gap-2 transition"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold flex items-center gap-1.5">
                      <span className="truncate">{conv.businessName}</span>
                      {conv.unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#C5A059] text-black text-[10px] font-bold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </p>
                    <p className={`text-[11px] line-clamp-1 mt-0.5 ${theme.muted}`}>
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                  </div>
                  <span className={`text-[10px] shrink-0 ${theme.muted}`}>
                    {conv.lastTimestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================================
          7. POPULAR PRODUCTS & BUSINESS OPPORTUNITIES (2-COLUMN)
          ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Popular Products */}
        <div className={`lg:col-span-6 p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Popular Products</h3>
            <button
              type="button"
              onClick={() => onNavigate('catalogue')}
              className="text-xs text-[#C5A059] hover:underline"
            >
              Full Catalogue →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {popularProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigate('catalogue')}
                className="p-3 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer flex items-center gap-3 transition"
              >
                <img
                  src={prod.images?.[0]}
                  alt={prod.name}
                  className="w-11 h-11 rounded object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{prod.name}</p>
                  <p className={`text-[11px] ${theme.muted}`}>
                    {(prod.views || 0).toLocaleString()} views • ₹{prod.wholesalePrice || prod.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Opportunities */}
        <div className={`lg:col-span-6 p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold flex items-center gap-1.5">
              <Briefcase size={15} className="text-[#C5A059]" /> Business Opportunities
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('opportunities')}
              className="text-xs text-[#C5A059] hover:underline"
            >
              Explore All →
            </button>
          </div>
          <div className="space-y-2.5">
            {opportunities.slice(0, 3).map((opp) => (
              <div
                key={opp.id}
                onClick={() => onNavigate('opportunities')}
                className="p-3 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer flex items-center justify-between gap-3 transition"
              >
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-semibold">
                    {opp.category}
                  </span>
                  <p className="text-xs font-semibold truncate">{opp.title}</p>
                  <p className={`text-[11px] ${theme.muted}`}>
                    {opp.businessName} • {opp.location}
                  </p>
                </div>
                <ArrowRight size={14} className="text-[#C5A059] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyBusinessSection({ theme, profile, onUpdateProfile, onNotify }) {
  const [mode, setMode] = useState('preview');
  const [form, setForm] = useState(profile);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(form);
    setMode('preview');
    onNotify('success', 'Business profile updated successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">My Business Profile</h2>
          <p className={`text-xs ${theme.muted}`}>
            Control how retailers, startups, and trade partners see your business on Vyapar
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('preview')}
            className={`px-4 py-2 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
              mode === 'preview' ? 'bg-[#C5A059] text-black border-[#C5A059]' : theme.card
            }`}
          >
            <Eye size={14} /> Profile Preview
          </button>
          <button
            onClick={() => {
              setForm(profile);
              setMode('edit');
            }}
            className={`px-4 py-2 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
              mode === 'edit' ? 'bg-[#C5A059] text-black border-[#C5A059]' : theme.card
            }`}
          >
            <Edit3 size={14} /> Edit Business Info
          </button>
        </div>
      </div>

      {mode === 'preview' ? (
        <div className={`rounded-2xl border overflow-hidden ${theme.card}`}>
          <div className="h-48 sm:h-56 relative">
            <img
              src={profile.coverImage}
              alt="Business Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={profile.logo}
                  alt="Logo"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#C5A059] bg-black"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
                      {profile.businessName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/20 border border-emerald-400 text-emerald-200 flex items-center gap-1">
                      <ShieldCheck size={12} /> {profile.verificationStatus}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 mt-0.5">
                    {profile.businessType} • {profile.industry} • {profile.category}
                  </p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-black/50 border border-white/20">
                Est. {profile.yearEstablished} • {profile.businessSize}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                  About the Business
                </h4>
                <p className="mt-2 leading-relaxed">{profile.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-inherit space-y-1">
                  <span className={`text-xs ${theme.muted}`}>Operating Locations</span>
                  <p className="font-medium text-xs">{profile.operatingLocations}</p>
                </div>
                <div className="p-4 rounded-xl border border-inherit space-y-1">
                  <span className={`text-xs ${theme.muted}`}>Certifications &amp; Compliance</span>
                  <p className="font-medium text-xs">{profile.certifications || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#C5A059]">
                Business &amp; Contact Details
              </h4>
              <p className="flex items-start gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5 text-[#C5A059]" />
                <span>
                  {profile.address}, {profile.city}, {profile.state} — {profile.pinCode}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Building2 size={14} className="text-[#C5A059]" />
                <span>GSTIN: {profile.gstin || 'Not provided'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#C5A059]" />
                <span>
                  {profile.contactPerson} • {profile.phone}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#C5A059]" />
                <span>{profile.email}</span>
              </p>
              {profile.website && (
                <p className="flex items-center gap-2">
                  <Globe size={14} className="text-[#C5A059]" />
                  <span>{profile.website}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${theme.card}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Business Name *</label>
              <input
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Industry *</label>
              <input
                required
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Business Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Business Type *</label>
              <select
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              >
                {['Manufacturer', 'Wholesaler', 'Distributor', 'Supplier', 'Service Provider'].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Year Established</label>
              <input
                value={form.yearEstablished}
                onChange={(e) => setForm({ ...form, yearEstablished: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>GSTIN (Optional)</label>
              <input
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                className={`w-full p-2.5 rounded border font-mono ${theme.input}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${theme.muted}`}>Business Description *</label>
            <textarea
              rows="3"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full p-2.5 rounded border text-sm ${theme.input}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Contact Person</label>
              <input
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Business Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-inherit">
            <button
              type="button"
              onClick={() => setMode('preview')}
              className="px-5 py-2.5 rounded-md border text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-md bg-[#C5A059] text-black text-xs font-semibold"
            >
              Save Business Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
}