import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Building2,
  Package,
  Inbox,
  Users,
  FileText,
  Compass,
  Briefcase,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_PRODUCTS,
  INITIAL_ENQUIRIES,
  INITIAL_GROUP_BUYS,
  INITIAL_QUOTATIONS,
  INITIAL_WON_DEALS,
  INITIAL_DISCOVER_BUSINESSES,
  INITIAL_OPPORTUNITIES,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../dashboards/merchant/merchantData.js';

import { OverviewSection, MyBusinessSection } from '../dashboards/merchant/OverviewAndProfile.jsx';
import {
  ProductCatalogueSection,
  BusinessEnquiriesSection,
} from '../dashboards/merchant/CatalogueAndEnquiries.jsx';
import {
  GroupBuysSection,
  MyQuotationsSection,
  isGroupBuyOpen,
} from '../dashboards/merchant/GroupBuysAndQuotations.jsx';
import {
  DiscoverBusinessesSection,
  OpportunitiesSection,
  MessagesSection,
} from '../dashboards/merchant/NetworkAndMessages.jsx';
import {
  AnalyticsSection,
  NotificationsSection,
  SettingsSection,
} from '../dashboards/merchant/AnalyticsNotificationsSettings.jsx';

export default function MerchantDashboard({
  user,
  onLogout,
  darkMode = false,
  onToggleDark,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [groupBuySubTab, setGroupBuySubTab] = useState('discover');

  // Shared Frontend State Across All 12 Sections
  const [businessProfile, setBusinessProfile] = useState(() => ({
    ...INITIAL_BUSINESS_PROFILE,
    businessName: user?.storeName || INITIAL_BUSINESS_PROFILE.businessName,
    contactPerson: user?.name || INITIAL_BUSINESS_PROFILE.contactPerson,
    email: user?.email || INITIAL_BUSINESS_PROFILE.email,
    gstin: user?.gstNumber || INITIAL_BUSINESS_PROFILE.gstin,
  }));
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [groupBuys, setGroupBuys] = useState(INITIAL_GROUP_BUYS);
  const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
  const [wonDeals, setWonDeals] = useState(INITIAL_WON_DEALS);
  const [businesses, setBusinesses] = useState(INITIAL_DISCOVER_BUSINESSES);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Group Buy Details & Quotation Modal State
  const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState(null);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [quoteReviewStep, setQuoteReviewStep] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    offeredPricePerUnit: '',
    availableQuantity: '',
    moq: '',
    deliveryCharges: '0',
    estimatedDeliveryTimeline: '',
    productBrand: '',
    specificationsOrAlternatives: '',
    offerValidityDate: '',
    additionalTerms: '',
  });

  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4000);
  };

  const theme = {
    bg: darkMode ? 'bg-[#0F0F0F] text-[#F5F2EB]' : 'bg-[#FAF8F5] text-[#1C1B18]',
    card: darkMode ? 'bg-[#181818] border-[#2A2925]' : 'bg-white border-[#E6E1D6]',
    sidebar: darkMode ? 'bg-[#141413] border-[#2A2925]' : 'bg-[#F3EFE6] border-[#E6E1D6]',
    muted: darkMode ? 'text-[#9E9A90]' : 'text-[#6E6A61]',
    input: darkMode
      ? 'bg-[#222220] border-[#33322E] text-[#F5F2EB]'
      : 'bg-[#FAF8F5] border-[#D8D2C5] text-[#1C1B18]',
  };

  const statusBadgeStyle = (status) => {
    switch (status) {
      case 'Open':
      case 'Accepted':
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Target Reached':
      case 'Shortlisted':
      case 'In Progress':
      case 'Active':
        return 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/40';
      case 'Negotiating':
      case 'Pending':
      case 'Awaiting Fulfillment':
      case 'Counter-Offer Sent':
      case 'Awaiting Buyer':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Declined':
      case 'Cancelled':
      case 'Expired':
      case 'Withdrawn':
        return 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30';
      default:
        return 'bg-neutral-500/15 text-neutral-500 border-neutral-500/30';
    }
  };

  // Profile Completion Calculation
  const profileCompletion = useMemo(() => {
    const checks = [
      { label: 'Business Name', ok: Boolean(businessProfile.businessName?.trim()) },
      { label: 'Business Logo', ok: Boolean(businessProfile.logo?.trim()) },
      { label: 'Cover Image', ok: Boolean(businessProfile.coverImage?.trim()) },
      { label: 'Description', ok: Boolean(businessProfile.description?.trim()) },
      { label: 'GSTIN', ok: Boolean(businessProfile.gstin?.trim()) },
      { label: 'Address & PIN', ok: Boolean(businessProfile.address && businessProfile.pinCode) },
      { label: 'Website', ok: Boolean(businessProfile.website?.trim()) },
      { label: 'Certifications', ok: Boolean(businessProfile.certifications?.trim()) },
    ];
    const completed = checks.filter((c) => c.ok).length;
    return {
      percentage: Math.round((completed / checks.length) * 100),
      missingFields: checks.filter((c) => !c.ok).map((c) => c.label),
    };
  }, [businessProfile]);

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // ==========================================================================
  // CROSS-SECTION ACTIONS (QUOTATIONS, ENQUIRIES, MESSAGES, OPPORTUNITIES)
  // ==========================================================================
  const handleOpenSubmitQuote = (gb) => {
    const duplicate = quotations.find(
      (q) =>
        q.sourceType === 'Group Buy' &&
        q.sourceId === gb.id &&
        ['Pending', 'Shortlisted', 'Accepted'].includes(q.status)
    );
    if (duplicate) {
      showToast('error', 'You already have an active quotation for this group buy. Use Revise instead.');
      return;
    }
    if (!isGroupBuyOpen(gb)) {
      showToast('error', 'This group buy is closed or expired.');
      return;
    }
    setQuoteTarget(gb);
    setEditingQuoteId(null);
    setQuoteReviewStep(false);
    setQuoteForm({
      offeredPricePerUnit: gb.targetPricePerUnit ? String(gb.targetPricePerUnit) : '',
      availableQuantity: String(gb.totalQuantity),
      moq: String(Math.min(100, gb.totalQuantity)),
      deliveryCharges: '2500',
      estimatedDeliveryTimeline: '5–7 Business Days',
      productBrand: businessProfile.businessName,
      specificationsOrAlternatives: '',
      offerValidityDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      additionalTerms: '',
    });
    setQuoteModalOpen(true);
  };

  const handleOpenReviseQuote = (quote) => {
    setQuoteTarget({
      id: quote.sourceId,
      productName: quote.productTitle,
      totalQuantity: quote.quantity,
    });
    setEditingQuoteId(quote.id);
    setQuoteReviewStep(false);
    setQuoteForm({
      offeredPricePerUnit: String(quote.offeredPricePerUnit),
      availableQuantity: String(quote.availableQuantity),
      moq: String(quote.moq || 1),
      deliveryCharges: String(quote.deliveryCharges ?? 0),
      estimatedDeliveryTimeline: quote.estimatedDeliveryTimeline,
      productBrand: quote.productBrand || '',
      specificationsOrAlternatives: quote.specificationsOrAlternatives || '',
      offerValidityDate: quote.offerValidityDate,
      additionalTerms: quote.additionalTerms || '',
    });
    setQuoteModalOpen(true);
  };

  const handleConfirmQuotation = () => {
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    if (editingQuoteId) {
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === editingQuoteId
            ? {
                ...q,
                offeredPricePerUnit: Number(quoteForm.offeredPricePerUnit),
                availableQuantity: Number(quoteForm.availableQuantity),
                moq: Number(quoteForm.moq) || 1,
                deliveryCharges: Number(quoteForm.deliveryCharges) || 0,
                estimatedDeliveryTimeline: quoteForm.estimatedDeliveryTimeline,
                productBrand: quoteForm.productBrand,
                specificationsOrAlternatives: quoteForm.specificationsOrAlternatives,
                offerValidityDate: quoteForm.offerValidityDate,
                additionalTerms: quoteForm.additionalTerms,
                revisionCount: (q.revisionCount || 0) + 1,
                lastActivity: `${today} ${timeStr}`,
              }
            : q
        )
      );
      showToast('success', `Quotation ${editingQuoteId} revised successfully.`);
    } else {
      const newQuote = {
        id: `QUO-${Math.floor(510 + Math.random() * 480)}`,
        sourceType: 'Group Buy',
        sourceId: quoteTarget.id,
        buyerName: `${quoteTarget.organizer?.name || 'Buyer Group'} (${quoteTarget.participatingCount} Buyers)`,
        productTitle: quoteTarget.productName,
        category: quoteTarget.category,
        quantity: quoteTarget.totalQuantity,
        participatingBuyers: quoteTarget.participatingCount,
        deliveryLocation: quoteTarget.deliveryLocation,
        offeredPricePerUnit: Number(quoteForm.offeredPricePerUnit),
        availableQuantity: Number(quoteForm.availableQuantity),
        moq: Number(quoteForm.moq) || 1,
        deliveryCharges: Number(quoteForm.deliveryCharges) || 0,
        estimatedDeliveryTimeline: quoteForm.estimatedDeliveryTimeline,
        productBrand: quoteForm.productBrand,
        specificationsOrAlternatives: quoteForm.specificationsOrAlternatives,
        submittedDate: today,
        offerValidityDate: quoteForm.offerValidityDate,
        additionalTerms: quoteForm.additionalTerms,
        status: 'Pending',
        negotiationStatus: 'Active',
        buyerResponseNote: 'Submitted to buyer group organizer for review.',
        revisionCount: 0,
        lastActivity: `${today} ${timeStr}`,
        messages: [
          {
            id: `NM-${Date.now()}`,
            senderRole: 'merchant',
            senderName: businessProfile.businessName,
            text: `Submitted quotation at ₹${quoteForm.offeredPricePerUnit}/unit for ${quoteTarget.totalQuantity} units.`,
            proposedPrice: Number(quoteForm.offeredPricePerUnit),
            time: `Today, ${timeStr}`,
          },
        ],
      };
      setQuotations((prev) => [newQuote, ...prev]);
      setGroupBuys((prev) =>
        prev.map((g) =>
          g.id === quoteTarget.id ? { ...g, quotationCount: (g.quotationCount || 0) + 1 } : g
        )
      );
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          type: 'Quotation Submitted',
          title: `Quotation ${newQuote.id} Sent`,
          message: `Submitted ₹${newQuote.offeredPricePerUnit}/unit for ${newQuote.productTitle}.`,
          time: 'Just now',
          read: false,
          targetTab: 'quotations',
        },
        ...prev,
      ]);
      showToast('success', `Quotation ${newQuote.id} submitted! Reflected in My Offers & My Quotations.`);
    }

    setQuoteModalOpen(false);
    setSelectedGroupBuy(null);
  };

  const handleWithdrawQuote = (quoteId) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quoteId
          ? { ...q, status: 'Withdrawn', negotiationStatus: 'Closed', buyerResponseNote: 'Withdrawn by merchant.' }
          : q
      )
    );
    showToast('success', `Quotation ${quoteId} withdrawn.`);
  };

  const handleSendNegotiationMessage = (quoteId, text, counterPrice) => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quoteId
          ? {
              ...q,
              offeredPricePerUnit: counterPrice || q.offeredPricePerUnit,
              negotiationStatus: counterPrice ? 'Counter-Offer Sent' : 'Awaiting Buyer',
              lastActivity: `Today ${timeStr}`,
              messages: [
                ...(q.messages || []),
                {
                  id: `NM-${Date.now()}`,
                  senderRole: 'merchant',
                  senderName: businessProfile.businessName,
                  text,
                  proposedPrice: counterPrice,
                  time: `Today, ${timeStr}`,
                },
              ],
            }
          : q
      )
    );
    showToast('success', 'Negotiation reply sent.');
  };

  const handleOpenConversation = (convId, fallbackEntity = null) => {
    const existing = conversations.find((c) => c.id === convId);
    if (existing) {
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
      );
      setActiveConvId(convId);
    } else if (fallbackEntity) {
      const newId = `CONV-${Date.now()}`;
      const created = {
        id: newId,
        businessName: fallbackEntity.businessName || fallbackEntity.name,
        logo: (fallbackEntity.businessName || fallbackEntity.name || 'BZ').slice(0, 2).toUpperCase(),
        businessType: fallbackEntity.businessType || 'Business Partner',
        location: fallbackEntity.location || 'India',
        linkedType: fallbackEntity.id?.startsWith('ENQ') ? 'Enquiry' : null,
        linkedId: fallbackEntity.id || null,
        unreadCount: 0,
        lastTimestamp: 'Just now',
        messages: [
          {
            id: `M-${Date.now()}`,
            sender: 'me',
            text: `Started a conversation with ${fallbackEntity.businessName || fallbackEntity.name}.`,
            time: 'Just now',
          },
        ],
      };
      setConversations((prev) => [created, ...prev]);
      setActiveConvId(newId);
    }
    setActiveTab('messages');
  };

  const handleSendMessage = (convId, text) => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              unreadCount: 0,
              lastTimestamp: timeStr,
              messages: [...c.messages, { id: `M-${Date.now()}`, sender: 'me', text, time: `Today, ${timeStr}` }],
            }
          : c
      )
    );
  };

  const handleSendEnquiryReply = (enq, replyText) => {
    const today = new Date().toISOString().split('T')[0];
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === enq.id
          ? {
              ...item,
              status: item.status === 'New' ? 'Responded' : item.status,
              responses: [...(item.responses || []), { text: replyText, date: today }],
            }
          : item
      )
    );
    if (enq.conversationId) {
      handleSendMessage(enq.conversationId, `[Re: ${enq.subject}] ${replyText}`);
    }
    showToast('success', 'Enquiry response sent & synced to Messages.');
  };

  const handleContactBusiness = (biz) => {
    const existing = conversations.find((c) => c.businessName === biz.name);
    if (existing) {
      handleOpenConversation(existing.id);
    } else {
      handleOpenConversation(null, biz);
    }
  };

  const handleRespondOpportunity = (opp, message) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opp.id ? { ...o, interested: true } : o))
    );
    const existing = conversations.find((c) => c.businessName === opp.businessName);
    if (existing) {
      handleSendMessage(existing.id, `[Opportunity: ${opp.title}] ${message}`);
    } else {
      setConversations((prev) => [
        {
          id: `CONV-${Date.now()}`,
          businessName: opp.businessName,
          logo: opp.businessName.slice(0, 2).toUpperCase(),
          businessType: 'Partner Business',
          location: opp.location,
          linkedType: 'Opportunity',
          linkedId: opp.id,
          unreadCount: 0,
          lastTimestamp: 'Just now',
          messages: [{ id: `M-${Date.now()}`, sender: 'me', text: message, time: 'Just now' }],
        },
        ...prev,
      ]);
    }
    showToast('success', `Interest expressed for "${opp.title}" and conversation started.`);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'business', label: 'My Business', icon: Building2 },
    { id: 'catalogue', label: 'Product Catalogue', icon: Package },
    {
      id: 'enquiries',
      label: 'Business Enquiries',
      icon: Inbox,
      badge: enquiries.filter((e) => e.status === 'New').length,
    },
    {
      id: 'group-buys',
      label: 'Group Buys',
      icon: Users,
      badge: groupBuys.filter((g) => isGroupBuyOpen(g)).length,
    },
    { id: 'quotations', label: 'My Quotations', icon: FileText },
    { id: 'discover', label: 'Discover Businesses', icon: Compass },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessages },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${theme.bg}`}>
      {/* 12-ITEM SIDEBAR */}
      {/* 12-ITEM COLLAPSIBLE SIDEBAR (PERSISTENT VYAPAR BRANDING + TOOLTIPS) */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-[76px]'
        } relative border-r transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${theme.sidebar}`}
      >
        {/* Floating Edge Expand / Collapse Button (always accessible) */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          aria-label={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          className={`absolute -right-3 top-7 z-40 w-6 h-6 rounded-full border shadow-md flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition ${theme.card}`}
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div>
          {/* Persistent Vyapar Brand Header */}
          <div className="h-20 flex items-center justify-center px-4 border-b border-inherit">
            {sidebarOpen ? (
              <div className="w-full flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-center font-serif text-lg font-bold text-[#C5A059] shrink-0">
                  V
                </div>
                <div className="min-w-0">
                  <span className="block font-serif text-xl tracking-[0.22em] font-semibold leading-none">
                    VYAPAR HUB
                  </span>
                  <span className="block text-[9px] tracking-[0.18em] uppercase text-[#C5A059] mt-1 font-semibold">
                    Merchant Portal
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-0.5"
                title="VYAPAR — Merchant Portal"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-center font-serif text-lg font-bold text-[#C5A059]">
                  V
                </div>
                <span className="text-[8px] font-serif tracking-[0.18em] font-semibold uppercase text-[#C5A059]">
                  VYAPAR
                </span>
              </div>
            )}
          </div>

          {/* Navigation Items (compact icon rail with hover tooltips when collapsed) */}
          <nav
            className={`p-2.5 space-y-1 ${
              sidebarOpen ? 'overflow-y-auto max-h-[calc(100vh-145px)]' : 'overflow-visible'
            }`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center ${
                      sidebarOpen ? 'justify-between px-3' : 'justify-center px-0'
                    } py-2.5 rounded-md text-xs sm:text-sm transition relative ${
                      active
                        ? 'bg-[#C5A059] text-black font-medium shadow-sm'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon size={17} className="shrink-0" />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </span>
                    {sidebarOpen && item.badge > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          active ? 'bg-black/20 text-black' : 'bg-[#C5A059]/20 text-[#C5A059]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {!sidebarOpen && item.badge > 0 && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#C5A059]" />
                    )}
                  </button>

                  {/* Hover Tooltip in Collapsed Mode */}
                  {!sidebarOpen && (
                    <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-2.5 py-1.5 rounded-md bg-[#181615] text-[#FAF7F2] text-xs font-medium whitespace-nowrap shadow-lg border border-[#C5A059]/40">
                      {item.label}
                      {item.badge > 0 ? ` (${item.badge})` : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Logout with Collapsed Tooltip */}
        <div className="p-2.5 border-t border-inherit relative group">
          <button
            type="button"
            onClick={onLogout}
            className={`w-full flex items-center ${
              sidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'
            } py-2.5 rounded-md text-sm text-red-500 hover:bg-red-500/10 transition`}
          >
            <LogOut size={17} />
            {sidebarOpen && <span>Logout</span>}
          </button>
          {!sidebarOpen && (
            <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-2.5 py-1.5 rounded-md bg-[#181615] text-red-400 text-xs font-medium whitespace-nowrap shadow-lg border border-red-500/30">
              Logout
            </div>
          )}
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-20 border-b px-6 sm:px-8 flex items-center justify-between ${theme.card}`}>
          <div>
            <h1 className="font-serif text-2xl tracking-wide">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className={`text-xs ${theme.muted}`}>{businessProfile.businessName}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDark}
              className={`p-2.5 rounded-md border ${theme.card} hover:border-[#C5A059]`}
              title="Toggle Light / Dark Mode"
            >
              {darkMode ? <Sun size={17} className="text-[#C5A059]" /> : <Moon size={17} />}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`p-2.5 rounded-md border relative ${theme.card} hover:border-[#C5A059]`}
              title="Notifications"
            >
              <Bell size={17} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5A059] text-black text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className="flex items-center gap-2.5 pl-3 border-l border-inherit text-left"
            >
              <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center font-serif font-bold text-[#C5A059]">
                {businessProfile.businessName.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-none">{businessProfile.contactPerson}</p>
                <p className={`text-[11px] mt-1 ${theme.muted}`}>{businessProfile.verificationStatus} Merchant</p>
              </div>
            </button>
          </div>
        </header>

        {toast.message && (
          <div
            className={`mx-6 sm:mx-8 mt-5 p-3.5 rounded-lg border text-xs sm:text-sm flex items-center justify-between ${
              toast.type === 'error'
                ? 'bg-red-500/10 border-red-500 text-red-500'
                : 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            <span className="flex items-center gap-2">
              {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              {toast.message}
            </span>
            <button onClick={() => setToast({ type: '', message: '' })}>
              <X size={16} />
            </button>
          </div>
        )}

        <main className="p-6 sm:p-8 overflow-y-auto flex-1">
          {activeTab === 'overview' && (
            <OverviewSection
              theme={theme}
              businessProfile={businessProfile}
              products={products}
              enquiries={enquiries}
              groupBuys={groupBuys}
              quotations={quotations}
              wonDeals={wonDeals}
              opportunities={opportunities}
              conversations={conversations}
              profileCompletion={profileCompletion}
              onNavigate={setActiveTab}
              onOpenGroupBuyDetails={(gb) => {
                setActiveTab('group-buys');
                setGroupBuySubTab('discover');
                setSelectedGroupBuy(gb);
              }}
              onOpenConversation={(id) => handleOpenConversation(id)}
            />
          )}

          {activeTab === 'business' && (
            <MyBusinessSection
              theme={theme}
              profile={businessProfile}
              onUpdateProfile={setBusinessProfile}
              onNotify={showToast}
            />
          )}

          {activeTab === 'catalogue' && (
            <ProductCatalogueSection
              theme={theme}
              products={products}
              setProducts={setProducts}
              onNotify={showToast}
            />
          )}

          {activeTab === 'enquiries' && (
            <BusinessEnquiriesSection
              theme={theme}
              enquiries={enquiries}
              setEnquiries={setEnquiries}
              onOpenConversation={handleOpenConversation}
              onSendEnquiryReply={handleSendEnquiryReply}
              onNotify={showToast}
            />
          )}

          {activeTab === 'group-buys' && (
            <GroupBuysSection
              theme={theme}
              groupBuys={groupBuys}
              quotations={quotations}
              wonDeals={wonDeals}
              activeSubTab={groupBuySubTab}
              setActiveSubTab={setGroupBuySubTab}
              selectedGroupBuy={selectedGroupBuy}
              setSelectedGroupBuy={setSelectedGroupBuy}
              onOpenSubmitQuote={handleOpenSubmitQuote}
              onOpenReviseQuote={handleOpenReviseQuote}
              onWithdrawQuote={handleWithdrawQuote}
              onSendNegotiationMessage={handleSendNegotiationMessage}
              onUpdateDealStatus={(id, status) => {
                setWonDeals((prev) => prev.map((d) => (d.id === id ? { ...d, dealStatus: status } : d)));
                showToast('success', `Deal status updated to "${status}".`);
              }}
              statusBadgeStyle={statusBadgeStyle}
            />
          )}

          {activeTab === 'quotations' && (
            <MyQuotationsSection
              theme={theme}
              quotations={quotations}
              onOpenReviseQuote={handleOpenReviseQuote}
              onWithdrawQuote={handleWithdrawQuote}
              onJumpToSource={(q) => {
                if (q.sourceType === 'Group Buy') {
                  setActiveTab('group-buys');
                  setGroupBuySubTab('offers');
                } else {
                  setActiveTab('enquiries');
                }
              }}
              statusBadgeStyle={statusBadgeStyle}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverBusinessesSection
              theme={theme}
              businesses={businesses}
              setBusinesses={setBusinesses}
              onContactBusiness={handleContactBusiness}
              onNotify={showToast}
            />
          )}

          {activeTab === 'opportunities' && (
            <OpportunitiesSection
              theme={theme}
              opportunities={opportunities}
              setOpportunities={setOpportunities}
              onRespondOpportunity={handleRespondOpportunity}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesSection
              theme={theme}
              conversations={conversations}
              activeConvId={activeConvId}
              setActiveConvId={(id) => {
                setActiveConvId(id);
                setConversations((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                );
              }}
              onSendMessage={handleSendMessage}
              onNavigateLinked={(conv) => {
                if (conv.linkedType === 'Group Buy') setActiveTab('group-buys');
                else if (conv.linkedType === 'Enquiry') setActiveTab('enquiries');
                else if (conv.linkedType === 'Opportunity') setActiveTab('opportunities');
              }}
              quotations={quotations}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsSection
              theme={theme}
              products={products}
              quotations={quotations}
              wonDeals={wonDeals}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsSection
              theme={theme}
              notifications={notifications}
              onMarkRead={(id) =>
                setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
              }
              onMarkAllRead={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                showToast('success', 'All notifications marked as read.');
              }}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsSection
              theme={theme}
              user={user}
              onNotify={showToast}
              onLogout={onLogout}
            />
          )}
        </main>
      </div>

      {/* SHARED SUBMIT / REVISE QUOTATION MODAL (WITH PRE-SUBMIT REVIEW) */}
      {quoteModalOpen && quoteTarget && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border space-y-5 ${theme.card}`}>
            <div className="flex justify-between items-start border-b border-inherit pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold">
                  {quoteReviewStep
                    ? 'Step 2 of 2 • Review Quotation'
                    : editingQuoteId
                    ? `Revise Quotation ${editingQuoteId}`
                    : 'Step 1 of 2 • Submit Quotation'}
                </span>
                <h3 className="font-serif text-2xl mt-0.5">{quoteTarget.productName}</h3>
              </div>
              <button onClick={() => setQuoteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {!quoteReviewStep ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuoteReviewStep(true);
                }}
                className="space-y-4 text-sm"
              >
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs mb-1 ${theme.muted}`}>Offered Price / Unit (₹) *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={quoteForm.offeredPricePerUnit}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, offeredPricePerUnit: e.target.value })
                      }
                      className={`w-full p-2.5 rounded border ${theme.input}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${theme.muted}`}>Available Qty *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={quoteForm.availableQuantity}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, availableQuantity: e.target.value })
                      }
                      className={`w-full p-2.5 rounded border ${theme.input}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${theme.muted}`}>MOQ</label>
                    <input
                      type="number"
                      min="1"
                      value={quoteForm.moq}
                      onChange={(e) => setQuoteForm({ ...quoteForm, moq: e.target.value })}
                      className={`w-full p-2.5 rounded border ${theme.input}`}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs mb-1 ${theme.muted}`}>Delivery Charges (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={quoteForm.deliveryCharges}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, deliveryCharges: e.target.value })
                      }
                      className={`w-full p-2.5 rounded border ${theme.input}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${theme.muted}`}>Delivery Timeline *</label>
                    <input
                      required
                      value={quoteForm.estimatedDeliveryTimeline}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, estimatedDeliveryTimeline: e.target.value })
                      }
                      className={`w-full p-2.5 rounded border ${theme.input}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${theme.muted}`}>Offer Valid Until *</label>
                    <input
                      required
                      type="date"
                      value={quoteForm.offerValidityDate}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, offerValidityDate: e.target.value })
                      }
                      className={`w-full p-2.5 rounded border ${theme.input}`}
                    />
                  </div>
                </div>

                <input
                  placeholder="Product Brand (Optional)"
                  value={quoteForm.productBrand}
                  onChange={(e) => setQuoteForm({ ...quoteForm, productBrand: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
                <textarea
                  rows="2"
                  placeholder="Product specifications or alternative SKU notes..."
                  value={quoteForm.specificationsOrAlternatives}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, specificationsOrAlternatives: e.target.value })
                  }
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
                <textarea
                  rows="2"
                  placeholder="Additional message or commercial payment terms..."
                  value={quoteForm.additionalTerms}
                  onChange={(e) => setQuoteForm({ ...quoteForm, additionalTerms: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="px-4 py-2 rounded border text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
                  >
                    Review Quotation →
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit space-y-2 text-xs">
                  <p className="flex justify-between">
                    <span className={theme.muted}>Offered Rate:</span>
                    <strong className="text-[#C5A059]">₹{quoteForm.offeredPricePerUnit}/unit</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className={theme.muted}>Estimated Group Order Value:</span>
                    <strong>
                      ₹
                      {(
                        Number(quoteForm.offeredPricePerUnit) *
                          Number(quoteTarget.totalQuantity || quoteForm.availableQuantity) +
                        Number(quoteForm.deliveryCharges || 0)
                      ).toLocaleString('en-IN')}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className={theme.muted}>Supply Qty / MOQ:</span>
                    <span>
                      {quoteForm.availableQuantity} units (MOQ: {quoteForm.moq || 1})
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className={theme.muted}>Delivery &amp; Validity:</span>
                    <span>
                      ₹{quoteForm.deliveryCharges} • {quoteForm.estimatedDeliveryTimeline} • Until{' '}
                      {quoteForm.offerValidityDate}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setQuoteReviewStep(false)}
                    className="px-4 py-2 rounded border text-xs"
                  >
                    ← Edit Details
                  </button>
                  <button
                    onClick={handleConfirmQuotation}
                    className="px-6 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
                  >
                    {editingQuoteId ? 'Confirm & Update Quotation' : 'Confirm & Submit Quotation'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}