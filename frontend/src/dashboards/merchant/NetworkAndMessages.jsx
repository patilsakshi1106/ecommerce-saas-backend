import React, { useState, useMemo } from 'react';
import {
  Search,
  ShieldCheck,
  MapPin,
  Bookmark,
  UserPlus,
  MessageSquare,
  Send,
  X,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from './merchantData.js';

export function DiscoverBusinessesSection({
  theme,
  businesses,
  setBusinesses,
  onContactBusiness,
  onNotify,
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewBiz, setViewBiz] = useState(null);

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.industry.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      const matchType = typeFilter === 'All' || b.businessType === typeFilter;
      const matchCat = categoryFilter === 'All' || b.category === categoryFilter;
      const matchLoc =
        !locationFilter.trim() ||
        b.location.toLowerCase().includes(locationFilter.trim().toLowerCase());
      const matchVer = !verifiedOnly || b.verified;
      return matchSearch && matchType && matchCat && matchLoc && matchVer;
    });
  }, [businesses, search, typeFilter, categoryFilter, locationFilter, verifiedOnly]);

  const toggleConnect = (biz) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === biz.id ? { ...b, connected: !b.connected } : b))
    );
    onNotify(
      'success',
      biz.connected ? `Removed connection with ${biz.name}.` : `Connection request sent to ${biz.name}.`
    );
  };

  const toggleSave = (biz) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === biz.id ? { ...b, saved: !b.saved } : b))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Discover Businesses</h2>
        <p className={`text-xs ${theme.muted}`}>
          Connect with verified retailers, startups, distributors, manufacturers, and service providers on Vyapar
        </p>
      </div>

      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 ${theme.card}`}>
        <div className="lg:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search businesses by name, industry, or keyword..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {['All', 'Retailer', 'Startup', 'Manufacturer', 'Wholesaler', 'Distributor', 'Service Provider'].map(
            (t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Business Types' : t}
              </option>
            )
          )}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          <option value="All">All Categories</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="City..."
            className={`w-full p-2 rounded-md border text-sm ${theme.input}`}
          />
          <label className="flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            Verified
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((biz) => (
          <div key={biz.id} className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${theme.card}`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center font-serif font-bold text-[#C5A059]">
                    {biz.logo}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold flex items-center gap-1.5">
                      {biz.name}
                      {biz.verified && <ShieldCheck size={15} className="text-emerald-500" />}
                    </h3>
                    <p className={`text-xs ${theme.muted}`}>
                      {biz.businessType} • {biz.industry}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(biz)}
                  className={`p-1.5 rounded ${biz.saved ? 'text-[#C5A059]' : theme.muted}`}
                  title="Save Business"
                >
                  <Bookmark size={16} fill={biz.saved ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className={`text-xs leading-relaxed ${theme.muted}`}>{biz.description}</p>
              <p className={`text-xs flex items-center gap-1 ${theme.muted}`}>
                <MapPin size={13} className="text-[#C5A059]" /> {biz.location} • {biz.category}
              </p>
            </div>

            <div className="pt-3 border-t border-inherit flex flex-wrap gap-2">
              <button
                onClick={() => setViewBiz(biz)}
                className="px-3 py-1.5 rounded border border-inherit text-xs"
              >
                View Profile
              </button>
              <button
                onClick={() => toggleConnect(biz)}
                className={`px-3 py-1.5 rounded border text-xs flex items-center gap-1 ${
                  biz.connected
                    ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'border-[#C5A059] text-[#C5A059]'
                }`}
              >
                <UserPlus size={13} /> {biz.connected ? 'Connected' : 'Connect'}
              </button>
              <button
                onClick={() => onContactBusiness(biz)}
                className="ml-auto px-3 py-1.5 rounded bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1"
              >
                <MessageSquare size={13} /> Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewBiz && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 ${theme.card}`}>
            <div className="flex justify-between items-start border-b border-inherit pb-3">
              <div>
                <h3 className="font-serif text-2xl flex items-center gap-2">
                  {viewBiz.name}
                  {viewBiz.verified && <ShieldCheck size={18} className="text-emerald-500" />}
                </h3>
                <p className={`text-xs ${theme.muted}`}>
                  {viewBiz.businessType} • {viewBiz.industry} • {viewBiz.location}
                </p>
              </div>
              <button onClick={() => setViewBiz(null)}>
                <X size={18} />
              </button>
            </div>
            <p className="text-sm leading-relaxed">{viewBiz.description}</p>
            <p className={`text-xs ${theme.muted}`}>Primary Category: {viewBiz.category}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setViewBiz(null)} className="px-4 py-2 rounded border text-xs">
                Close
              </button>
              <button
                onClick={() => {
                  const target = viewBiz;
                  setViewBiz(null);
                  onContactBusiness(target);
                }}
                className="px-4 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
              >
                Message Business →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OpportunitiesSection({
  theme,
  opportunities,
  setOpportunities,
  onRespondOpportunity,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeOpp, setActiveOpp] = useState(null);
  const [proposalMsg, setProposalMsg] = useState('');

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.businessName.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || o.category === categoryFilter;
      const matchLoc =
        !locationFilter.trim() ||
        o.location.toLowerCase().includes(locationFilter.trim().toLowerCase());
      return matchSearch && matchCat && matchLoc;
    });
  }, [opportunities, search, categoryFilter, locationFilter]);

  const toggleSave = (id) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, saved: !o.saved } : o)));
  };

  const handleSubmitInterest = (e) => {
    e.preventDefault();
    if (!activeOpp) return;
    onRespondOpportunity(
      activeOpp,
      proposalMsg.trim() || `Interested in your opportunity: ${activeOpp.title}. Let's connect!`
    );
    setProposalMsg('');
    setActiveOpp(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Business Opportunities</h2>
        <p className={`text-xs ${theme.muted}`}>
          Discover distributorships, manufacturing partnerships, bulk requirements, and expansion leads
        </p>
      </div>

      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-3 ${theme.card}`}>
        <div className="md:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {[
            'All',
            'Looking for suppliers',
            'Seeking manufacturing partners',
            'Bulk purchasing requirements',
            'Looking for distributors',
          ].map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All Opportunity Types' : c}
            </option>
          ))}
        </select>
        <input
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="Filter by city..."
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((opp) => (
          <div key={opp.id} className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 ${theme.card}`}>
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#C5A059] font-semibold">
                  {opp.category}
                </span>
                <button
                  onClick={() => toggleSave(opp.id)}
                  className={opp.saved ? 'text-[#C5A059]' : theme.muted}
                >
                  <Bookmark size={16} fill={opp.saved ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h3 className="font-serif text-xl font-medium">{opp.title}</h3>
              <p className={`text-xs ${theme.muted}`}>
                {opp.businessName} • {opp.location} • Posted {opp.postedDate}
              </p>
              <p className="text-xs leading-relaxed">{opp.description}</p>
              <p className={`text-xs ${theme.muted}`}>
                <strong>Requirements:</strong> {opp.requirements}
              </p>
            </div>

            <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs">
              <span className={theme.muted}>Deadline: {opp.deadline}</span>
              {opp.interested ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Interest Expressed
                </span>
              ) : (
                <button
                  onClick={() => setActiveOpp(opp)}
                  className="px-4 py-2 rounded bg-[#C5A059] text-black font-semibold"
                >
                  Express Interest / Respond
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeOpp && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitInterest} className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 ${theme.card}`}>
            <div className="flex justify-between items-start border-b border-inherit pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-semibold">
                  Respond to Opportunity
                </span>
                <h3 className="font-serif text-xl mt-0.5">{activeOpp.title}</h3>
              </div>
              <button type="button" onClick={() => setActiveOpp(null)}>
                <X size={18} />
              </button>
            </div>
            <p className={`text-xs ${theme.muted}`}>
              To: <strong>{activeOpp.businessName}</strong> ({activeOpp.location})
            </p>
            <textarea
              rows="4"
              required
              value={proposalMsg}
              onChange={(e) => setProposalMsg(e.target.value)}
              placeholder="Introduce your manufacturing/supply capabilities, capacity, and pricing terms..."
              className={`w-full p-3 rounded border text-xs ${theme.input}`}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setActiveOpp(null)} className="px-4 py-2 rounded border text-xs">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold">
                Submit Response →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function MessagesSection({
  theme,
  conversations,
  activeConvId,
  setActiveConvId,
  onSendMessage,
  onNavigateLinked,
  quotations,
}) {
  const [search, setSearch] = useState('');
  const [text, setText] = useState('');

  const filteredConvs = conversations.filter((c) =>
    c.businessName.toLowerCase().includes(search.trim().toLowerCase())
  );
  const currentConv =
    conversations.find((c) => c.id === activeConvId) || conversations[0] || null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!currentConv || !text.trim()) return;
    onSendMessage(currentConv.id, text.trim());
    setText('');
  };

  const shareLatestQuote = () => {
    if (!currentConv || quotations.length === 0) return;
    const latest = quotations[0];
    onSendMessage(
      currentConv.id,
      `Shared Quotation ${latest.id}: ${latest.productTitle} — ₹${latest.offeredPricePerUnit}/unit (${latest.quantity} units, valid until ${latest.offerValidityDate}).`
    );
  };

  return (
    <div className={`rounded-2xl border overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px] ${theme.card}`}>
      {/* Left: Conversation List */}
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-inherit flex flex-col">
        <div className="p-4 border-b border-inherit">
          <div className="relative">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className={`w-full pl-8 pr-3 py-2 rounded-md border text-xs ${theme.input}`}
            />
          </div>
        </div>
        <div className="divide-y divide-inherit overflow-y-auto flex-1">
          {filteredConvs.map((conv) => {
            const last = conv.messages[conv.messages.length - 1];
            const selected = currentConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-4 text-left flex items-start gap-3 transition ${
                  selected ? 'bg-[#C5A059]/15' : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center font-serif font-bold text-[#C5A059] shrink-0">
                  {conv.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-sm font-semibold truncate">{conv.businessName}</p>
                    <span className={`text-[10px] shrink-0 ${theme.muted}`}>{conv.lastTimestamp}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${theme.muted}`}>{last?.text}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#C5A059] text-black text-[10px] font-bold">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Chat View */}
      <div className="lg:col-span-8 flex flex-col justify-between">
        {!currentConv ? (
          <p className={`my-auto text-center text-sm ${theme.muted}`}>Select a conversation</p>
        ) : (
          <>
            <div className="p-4 border-b border-inherit flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl font-semibold">{currentConv.businessName}</h3>
                <p className={`text-xs ${theme.muted}`}>
                  {currentConv.businessType} • {currentConv.location}
                </p>
              </div>
              {currentConv.linkedType && (
                <button
                  onClick={() => onNavigateLinked(currentConv)}
                  className="px-3 py-1.5 rounded border border-[#C5A059] text-[#C5A059] text-xs flex items-center gap-1"
                >
                  <ExternalLink size={12} /> {currentConv.linkedType}: {currentConv.linkedId}
                </button>
              )}
            </div>

            <div className="p-5 space-y-3 overflow-y-auto flex-1 max-h-[380px]">
              {currentConv.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl text-xs max-w-[80%] ${
                    m.sender === 'me'
                      ? 'ml-auto bg-[#C5A059]/20 border border-[#C5A059]/40'
                      : 'bg-black/5 dark:bg-white/5 border border-inherit'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <span className={`block text-[10px] mt-1 ${theme.muted}`}>{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-inherit flex flex-wrap gap-2">
              <button
                type="button"
                onClick={shareLatestQuote}
                className="px-3 py-2 rounded border border-inherit hover:border-[#C5A059] text-xs"
                title="Share latest quotation details"
              >
                + Share Quote
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className={`flex-1 p-2.5 rounded border text-xs ${theme.input}`}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1"
              >
                <Send size={13} /> Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}