import React, { useState, useMemo } from 'react';
import {
  Search,
  Bookmark,
  CheckCircle2,
  Send,
  ExternalLink,
  X,
} from 'lucide-react';

export function RetailerOpportunitiesSection({
  theme,
  opportunities,
  setOpportunities,
  onRespondOpportunity,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [activeOpp, setActiveOpp] = useState(null);
  const [msg, setMsg] = useState('');

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.businessName.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q);
      const matchCat = category === 'All' || o.category === category;
      const matchLoc =
        !location.trim() || o.location.toLowerCase().includes(location.trim().toLowerCase());
      return matchSearch && matchCat && matchLoc;
    });
  }, [opportunities, search, category, location]);

  const toggleSave = (id) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, saved: !o.saved } : o)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Retailer Opportunities</h2>
        <p className={`text-xs ${theme.muted}`}>
          Explore supplier partnerships, distributor offers, wholesale allocations, and collaborations
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {['All', 'New supplier partnerships', 'Wholesale sourcing', 'Distributor opportunities'].map(
            (c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            )
          )}
        </select>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City..."
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((opp) => (
          <div key={opp.id} className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 ${theme.card}`}>
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRespondOpportunity(
                activeOpp,
                msg.trim() || `Interested in ${activeOpp.title}. Let's connect!`
              );
              setMsg('');
              setActiveOpp(null);
            }}
            className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 ${theme.card}`}
          >
            <div className="flex justify-between items-start border-b border-inherit pb-2">
              <h3 className="font-serif text-xl">{activeOpp.title}</h3>
              <button type="button" onClick={() => setActiveOpp(null)}>
                <X size={18} />
              </button>
            </div>
            <textarea
              rows="4"
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Share your store footprint, sourcing volume, and partnership interest..."
              className={`w-full p-3 rounded border text-xs ${theme.input}`}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setActiveOpp(null)} className="px-4 py-2 rounded border text-xs">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold">
                Send Response →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function RetailerMessagesSection({
  theme,
  conversations,
  activeConvId,
  setActiveConvId,
  onSendMessage,
  onNavigateLinked,
  enquiries,
  quotations,
}) {
  const [search, setSearch] = useState('');
  const [text, setText] = useState('');

  const filtered = conversations.filter((c) =>
    c.businessName.toLowerCase().includes(search.trim().toLowerCase())
  );
  const current = conversations.find((c) => c.id === activeConvId) || conversations[0] || null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!current || !text.trim()) return;
    onSendMessage(current.id, text.trim());
    setText('');
  };

  return (
    <div className={`rounded-2xl border overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px] ${theme.card}`}>
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-inherit flex flex-col">
        <div className="p-4 border-b border-inherit">
          <div className="relative">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers & partners..."
              className={`w-full pl-8 pr-3 py-2 rounded-md border text-xs ${theme.input}`}
            />
          </div>
        </div>
        <div className="divide-y divide-inherit overflow-y-auto flex-1">
          {filtered.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <button
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`w-full p-4 text-left flex items-start gap-3 transition ${
                  current?.id === c.id ? 'bg-[#C5A059]/15' : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center font-serif font-bold text-[#C5A059] shrink-0">
                  {c.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{c.businessName}</p>
                    <span className={`text-[10px] shrink-0 ${theme.muted}`}>{c.lastTimestamp}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${theme.muted}`}>{last?.text}</p>
                </div>
                {c.unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#C5A059] text-black text-[10px] font-bold">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col justify-between">
        {!current ? (
          <p className={`my-auto text-center text-sm ${theme.muted}`}>Select a conversation</p>
        ) : (
          <>
            <div className="p-4 border-b border-inherit flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl font-semibold">{current.businessName}</h3>
                <p className={`text-xs ${theme.muted}`}>
                  {current.businessType} • {current.location}
                </p>
              </div>
              {current.linkedType && (
                <button
                  onClick={() => onNavigateLinked(current)}
                  className="px-3 py-1.5 rounded border border-[#C5A059] text-[#C5A059] text-xs flex items-center gap-1"
                >
                  <ExternalLink size={12} /> Open {current.linkedType}: {current.linkedId}
                </button>
              )}
            </div>

            <div className="p-5 space-y-3 overflow-y-auto flex-1 max-h-[380px]">
              {current.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl text-xs max-w-[80%] ${
                    m.sender === 'me'
                      ? 'ml-auto bg-[#C5A059]/20 border border-[#C5A059]/40'
                      : 'bg-black/5 dark:bg-white/5 border border-inherit'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`block text-[10px] mt-1 ${theme.muted}`}>{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-inherit flex flex-wrap gap-2">
              {enquiries[0] && (
                <button
                  type="button"
                  onClick={() =>
                    onSendMessage(
                      current.id,
                      `Shared Enquiry ${enquiries[0].id}: ${enquiries[0].productName} (${enquiries[0].quantity} units).`
                    )
                  }
                  className="px-2.5 py-2 rounded border border-inherit hover:border-[#C5A059] text-xs"
                >
                  + Share Enquiry
                </button>
              )}
              {quotations[0] && (
                <button
                  type="button"
                  onClick={() =>
                    onSendMessage(
                      current.id,
                      `Referring to Quotation ${quotations[0].id}: ₹${quotations[0].quotedPricePerUnit}/unit for ${quotations[0].productName}.`
                    )
                  }
                  className="px-2.5 py-2 rounded border border-inherit hover:border-[#C5A059] text-xs"
                >
                  + Share Quote
                </button>
              )}
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a message to supplier..."
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