import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Users,
  FileText,
  Bookmark,
  Building2,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Eye,
  MapPin,
  Phone,
  Mail,
  Globe,
  Upload,
  Plus,
  Briefcase,
} from 'lucide-react';
import { RETAILER_CATEGORIES } from '../../data/retailerMockData.js';

export function RetailerOverviewSection({
  theme,
  profile,
  enquiries,
  groupBuys,
  quotations,
  businesses,
  conversations,
  opportunities,
  onNavigate,
  onOpenGroupDetails,
  onOpenConversation,
  onOpenCompareQuotations,
  badgeTone,
}) {
  const activeEnquiries = enquiries.filter((e) => e.status !== 'Closed');
  const myActiveGroups = groupBuys.filter(
    (g) => (g.createdByMe || g.joinedByMe) && !['Completed', 'Cancelled', 'Expired'].includes(g.status)
  );
  const savedBusinesses = businesses.filter((b) => b.saved);
  const contactedBusinessesCount = businesses.filter((b) => b.contacted).length;
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const recommendedBusinesses = useMemo(
    () =>
      businesses
        .filter((b) => b.verified)
        .slice(0, 3),
    [businesses]
  );

  const kpiCards = [
    {
      label: 'Active Enquiries',
      value: activeEnquiries.length,
      meta: `${enquiries.length} total submitted`,
      icon: Inbox,
      accent: 'text-blue-500 bg-blue-500/15',
      tab: 'enquiries',
    },
    {
      label: 'Active Group Buys',
      value: myActiveGroups.length,
      meta: `${myActiveGroups.reduce((s, g) => s + (g.myQuantity || 0), 0)} units committed`,
      icon: Users,
      accent: 'text-[#C5A059] bg-[#C5A059]/15',
      tab: 'group-buys',
    },
    {
      label: 'Quotations Received',
      value: quotations.length,
      meta: `${quotations.filter((q) => q.status === 'Shortlisted').length} shortlisted`,
      icon: FileText,
      accent: 'text-emerald-500 bg-emerald-500/15',
      tab: 'quotations',
    },
    {
      label: 'Saved Businesses',
      value: savedBusinesses.length,
      meta: 'Bookmarked suppliers',
      icon: Bookmark,
      accent: 'text-amber-500 bg-amber-500/15',
      tab: 'discover-businesses',
    },
    {
      label: 'Businesses Contacted',
      value: contactedBusinessesCount,
      meta: 'Active supplier threads',
      icon: Building2,
      accent: 'text-purple-500 bg-purple-500/15',
      tab: 'discover-businesses',
    },
    {
      label: 'Unread Messages',
      value: unreadMessages,
      meta: `${conversations.length} conversations`,
      icon: MessageSquare,
      accent: 'text-[#C5A059] bg-[#C5A059]/15',
      tab: 'messages',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Compact Welcome Strip */}
      <div
        className={`p-5 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${theme.card}`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-2xl font-semibold">
              Welcome back, {profile.contactPerson}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck size={12} /> {profile.verificationStatus} Retailer
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${theme.muted}`}>
            {profile.businessName} • {profile.industry} • {profile.city}, {profile.state}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('explore-products')}
            className="px-4 py-2 rounded-lg border border-inherit hover:border-[#C5A059] text-xs font-semibold transition"
          >
            Explore Products
          </button>
          <button
            type="button"
            onClick={() => onNavigate('group-buys')}
            className="px-4 py-2 rounded-lg bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
          >
            <Plus size={14} /> Create / Join Group Buy
          </button>
        </div>
      </div>

      {/* 6 Compact Horizontal KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpiCards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => onNavigate(c.tab)}
              className={`p-4 rounded-xl border text-left hover:border-[#C5A059] transition group ${theme.card}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-medium truncate ${theme.muted}`}>{c.label}</span>
                <span className={`p-1.5 rounded-lg shrink-0 ${c.accent}`}>
                  <Icon size={14} />
                </span>
              </div>
              <p className="font-serif text-2xl font-semibold mt-2 group-hover:text-[#C5A059] transition-colors">
                {c.value}
              </p>
              <p className={`text-[11px] mt-0.5 truncate ${theme.muted}`}>{c.meta}</p>
            </button>
          );
        })}
      </div>

      {/* Row 1: Active Group Buys + Recently Received Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Group Buys */}
        <div className={`lg:col-span-7 p-5 rounded-xl border space-y-4 ${theme.card}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-xl font-semibold">Active Group Buys</h3>
              <p className={`text-xs ${theme.muted}`}>
                Bulk pools you created or joined to unlock wholesale pricing
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('group-buys')}
              className="text-xs font-semibold text-[#C5A059] hover:underline flex items-center gap-1"
            >
              All Group Buys <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {myActiveGroups.map((g) => {
              const pct = Math.min(100, Math.round((g.committedQuantity / g.targetQuantity) * 100));
              return (
                <div
                  key={g.id}
                  className="p-4 rounded-xl border border-inherit hover:border-[#C5A059] transition space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-semibold">
                        {g.category} • {g.createdByMe ? 'Created by You' : 'Joined'}
                      </span>
                      <h4 className="font-serif text-base font-semibold">{g.productName}</h4>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${badgeTone(g.status)}`}>
                      {g.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className={theme.muted}>Group Qty:</span>{' '}
                      <strong>
                        {g.committedQuantity}/{g.targetQuantity}u
                      </strong>
                    </div>
                    <div>
                      <span className={theme.muted}>Your Qty:</span>{' '}
                      <strong className="text-[#C5A059]">{g.myQuantity} units</strong>
                    </div>
                    <div>
                      <span className={theme.muted}>Participants:</span>{' '}
                      <strong>{g.participants.length}</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#C5A059]" style={{ width: `${pct}%` }} />
                    </div>
                    <div className={`flex justify-between text-[11px] ${theme.muted}`}>
                      <span>{pct}% of target committed</span>
                      <span>Deadline: {g.deadline}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenGroupDetails(g)}
                      className="text-xs font-semibold text-[#C5A059] hover:underline"
                    >
                      View Complete Group →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recently Received Quotations */}
        <div className={`lg:col-span-5 p-5 rounded-xl border space-y-4 ${theme.card}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-xl font-semibold">Recently Received Quotations</h3>
              <p className={`text-xs ${theme.muted}`}>Compare supplier pricing &amp; delivery terms</p>
            </div>
            <button
              type="button"
              onClick={onOpenCompareQuotations}
              className="text-xs font-semibold text-[#C5A059] hover:underline"
            >
              View &amp; Compare →
            </button>
          </div>

          <div className="space-y-3">
            {quotations.slice(0, 4).map((q) => (
              <div
                key={q.id}
                onClick={() => onNavigate('quotations')}
                className="p-3.5 rounded-xl border border-inherit hover:border-[#C5A059] cursor-pointer transition space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{q.merchantName}</p>
                    <p className={`text-[11px] truncate ${theme.muted}`}>{q.productName}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badgeTone(q.status)}`}>
                    {q.status}
                  </span>
                </div>
                <div className={`flex items-center justify-between text-xs ${theme.muted}`}>
                  <span>
                    <strong className="text-[#C5A059]">₹{q.quotedPricePerUnit}/u</strong> •{' '}
                    {q.requestedQuantity} units
                  </span>
                  <span className="text-[11px]">{q.dateReceived}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Recent Enquiries + Recommended Businesses + Recent Messages */}
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
            {enquiries.slice(0, 3).map((e) => (
              <div
                key={e.id}
                onClick={() => onNavigate('enquiries')}
                className="p-3 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer space-y-1 transition"
              >
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-semibold truncate">{e.productName}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badgeTone(e.status)}`}>
                    {e.status}
                  </span>
                </div>
                <p className={`text-[11px] ${theme.muted}`}>
                  {e.category} • {e.quantity} units • {e.responsesCount} responses
                </p>
                <p className={`text-[10px] ${theme.muted}`}>Submitted: {e.submittedDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Businesses */}
        <div className={`p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Recommended Businesses</h3>
            <button
              type="button"
              onClick={() => onNavigate('discover-businesses')}
              className="text-xs text-[#C5A059] hover:underline"
            >
              Discover →
            </button>
          </div>
          <div className="space-y-2.5">
            {recommendedBusinesses.map((b) => (
              <div
                key={b.id}
                onClick={() => onNavigate('discover-businesses')}
                className="p-3 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer flex items-center gap-3 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-center font-serif font-bold text-[#C5A059] text-xs shrink-0">
                  {b.logo}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate flex items-center gap-1">
                    {b.name}
                    {b.verified && <ShieldCheck size={12} className="text-emerald-500 shrink-0" />}
                  </p>
                  <p className={`text-[11px] truncate ${theme.muted}`}>
                    {b.businessType} • {b.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className={`p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Recent Messages</h3>
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
              const last = conv.messages[conv.messages.length - 1];
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
                        <span className="px-1.5 rounded-full bg-[#C5A059] text-black text-[10px] font-bold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </p>
                    <p className={`text-[11px] line-clamp-1 mt-0.5 ${theme.muted}`}>
                      {last?.text}
                    </p>
                  </div>
                  <span className={`text-[10px] shrink-0 ${theme.muted}`}>{conv.lastTimestamp}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Saved Businesses + Business Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className={`lg:col-span-5 p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Saved Businesses</h3>
            <button
              type="button"
              onClick={() => onNavigate('discover-businesses')}
              className="text-xs text-[#C5A059] hover:underline"
            >
              Manage →
            </button>
          </div>
          {savedBusinesses.length === 0 ? (
            <p className={`text-xs ${theme.muted}`}>No businesses saved yet.</p>
          ) : (
            <div className="space-y-2.5">
              {savedBusinesses.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onNavigate('discover-businesses')}
                  className="p-3 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold">{b.name}</p>
                    <p className={`text-[11px] ${theme.muted}`}>
                      {b.category} • {b.location}
                    </p>
                  </div>
                  <Bookmark size={14} className="text-[#C5A059]" fill="currentColor" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`lg:col-span-7 p-5 rounded-xl border space-y-3.5 ${theme.card}`}>
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
          <div className="grid sm:grid-cols-2 gap-3">
            {opportunities.slice(0, 2).map((opp) => (
              <div
                key={opp.id}
                onClick={() => onNavigate('opportunities')}
                className="p-3.5 rounded-lg border border-inherit hover:border-[#C5A059] cursor-pointer space-y-1 transition"
              >
                <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-semibold">
                  {opp.category}
                </span>
                <p className="text-xs font-semibold line-clamp-2">{opp.title}</p>
                <p className={`text-[11px] ${theme.muted}`}>
                  {opp.businessName} • {opp.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RetailerBusinessProfileSection({ theme, profile, onUpdateProfile, onNotify }) {
  const [mode, setMode] = useState('preview');
  const [form, setForm] = useState(profile);

  const handleImageUpload = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(form);
    setMode('preview');
    onNotify('success', 'Retailer business profile updated.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">My Business Profile</h2>
          <p className={`text-xs ${theme.muted}`}>
            Manage your retail storefront profile visible to merchants and group-buy partners
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onUpdateProfile({ ...profile, profileVisible: !profile.profileVisible });
              onNotify(
                'success',
                profile.profileVisible
                  ? 'Business profile set to Private.'
                  : 'Business profile is now Publicly Discoverable.'
              );
            }}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold border ${theme.card}`}
          >
            Visibility: {profile.profileVisible ? 'Public' : 'Private'}
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-4 py-2 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
              mode === 'preview' ? 'bg-[#C5A059] text-black border-[#C5A059]' : theme.card
            }`}
          >
            <Eye size={14} /> Preview
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(profile);
              setMode('edit');
            }}
            className={`px-4 py-2 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
              mode === 'edit' ? 'bg-[#C5A059] text-black border-[#C5A059]' : theme.card
            }`}
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        </div>
      </div>

      {mode === 'preview' ? (
        <div className={`rounded-2xl border overflow-hidden ${theme.card}`}>
          <div className="h-48 sm:h-56 relative">
            <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={profile.logo}
                  alt="Logo"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#C5A059] bg-black"
                />
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                    {profile.businessName}
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/20 border border-emerald-400 text-emerald-200 flex items-center gap-1">
                      <ShieldCheck size={12} /> {profile.verificationStatus}
                    </span>
                  </h3>
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
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                  About Our Retail Business
                </h4>
                <p className="mt-1.5 leading-relaxed">{profile.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-inherit text-xs">
                  <span className={theme.muted}>Operating Locations</span>
                  <p className="font-medium mt-1">{profile.operatingLocations}</p>
                </div>
                <div className="p-4 rounded-xl border border-inherit text-xs">
                  <span className={theme.muted}>Certifications</span>
                  <p className="font-medium mt-1">{profile.certifications}</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit space-y-3 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#C5A059]">
                Business &amp; Contact Information
              </h4>
              <p className="flex items-start gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5 text-[#C5A059]" />
                <span>
                  {profile.address}, {profile.city}, {profile.state} — {profile.pinCode}
                </span>
              </p>
              <p>GSTIN: <span className="font-mono">{profile.gstin || 'Optional'}</span></p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#C5A059]" /> {profile.contactPerson} • {profile.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#C5A059]" /> {profile.email}
              </p>
              {profile.website && (
                <p className="flex items-center gap-2">
                  <Globe size={14} className="text-[#C5A059]" /> {profile.website}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className={`p-6 sm:p-8 rounded-2xl border space-y-5 text-sm ${theme.card}`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-inherit space-y-2">
              <label className={`block text-xs font-semibold ${theme.muted}`}>Business Logo</label>
              <input
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                placeholder="Logo image URL"
                className={`w-full p-2 rounded border text-xs ${theme.input}`}
              />
              <label className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] cursor-pointer">
                <Upload size={13} /> Upload Logo File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload('logo', e.target.files?.[0])}
                />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-inherit space-y-2">
              <label className={`block text-xs font-semibold ${theme.muted}`}>Cover Image</label>
              <input
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="Cover image URL"
                className={`w-full p-2 rounded border text-xs ${theme.input}`}
              />
              <label className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] cursor-pointer">
                <Upload size={13} /> Upload Cover Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload('coverImage', e.target.files?.[0])}
                />
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
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
              <label className={`block text-xs mb-1 ${theme.muted}`}>Industry</label>
              <input
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Business Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              >
                {RETAILER_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Business Type</label>
              <input
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
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
              <label className={`block text-xs mb-1 ${theme.muted}`}>Business Size</label>
              <input
                value={form.businessSize}
                onChange={(e) => setForm({ ...form, businessSize: e.target.value })}
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
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>State &amp; PIN</label>
              <div className="flex gap-2">
                <input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
                <input
                  value={form.pinCode}
                  onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                  className={`w-28 p-2.5 rounded border ${theme.input}`}
                />
              </div>
            </div>
          </div>

          <textarea
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Business description..."
            className={`w-full p-2.5 rounded border ${theme.input}`}
          />

          <div className="grid md:grid-cols-3 gap-4">
            <input
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              placeholder="Contact Person"
              className={`w-full p-2.5 rounded border ${theme.input}`}
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone Number"
              className={`w-full p-2.5 rounded border ${theme.input}`}
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Business Email"
              className={`w-full p-2.5 rounded border ${theme.input}`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-inherit">
            <button type="button" onClick={() => setMode('preview')} className="px-4 py-2 rounded border text-xs">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold">
              Save Business Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
}