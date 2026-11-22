import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  FileText,
  MessageSquare,
  Award,
  MapPin,
  Calendar,
  Send,
  X,
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from './merchantData.js';

export const isGroupBuyOpen = (gb) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    new Date(gb.deadline) >= today &&
    ['Open', 'Target Reached', 'Negotiating'].includes(gb.status)
  );
};

export function GroupBuysSection({
  theme,
  groupBuys,
  quotations,
  wonDeals,
  activeSubTab,
  setActiveSubTab,
  selectedGroupBuy,
  setSelectedGroupBuy,
  onOpenSubmitQuote,
  onOpenReviseQuote,
  onWithdrawQuote,
  onSendNegotiationMessage,
  onUpdateDealStatus,
  statusBadgeStyle,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [minQty, setMinQty] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [offerStatusFilter, setOfferStatusFilter] = useState('All');
  const [selectedOfferModal, setSelectedOfferModal] = useState(null);

  const [activeNegId, setActiveNegId] = useState(null);
  const [chatText, setChatText] = useState('');
  const [counterPrice, setCounterPrice] = useState('');

  const groupBuyQuotes = useMemo(
    () => quotations.filter((q) => q.sourceType === 'Group Buy'),
    [quotations]
  );

  const activeOfferMap = useMemo(() => {
    const map = {};
    groupBuyQuotes.forEach((q) => {
      if (['Pending', 'Shortlisted', 'Accepted'].includes(q.status)) {
        map[q.sourceId] = q;
      }
    });
    return map;
  }, [groupBuyQuotes]);

  const filteredRequests = useMemo(() => {
    return groupBuys.filter((gb) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        gb.productName.toLowerCase().includes(q) ||
        gb.category.toLowerCase().includes(q) ||
        gb.specifications.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || gb.category === categoryFilter;
      const matchLoc =
        !locationFilter.trim() ||
        gb.deliveryLocation.toLowerCase().includes(locationFilter.trim().toLowerCase());
      const matchQty = !minQty || gb.totalQuantity >= Number(minQty);
      const matchStatus = statusFilter === 'All' || gb.status === statusFilter;
      return matchSearch && matchCat && matchLoc && matchQty && matchStatus;
    });
  }, [groupBuys, search, categoryFilter, locationFilter, minQty, statusFilter]);

  const filteredOffers = useMemo(() => {
    if (offerStatusFilter === 'All') return groupBuyQuotes;
    return groupBuyQuotes.filter((o) => o.status === offerStatusFilter);
  }, [groupBuyQuotes, offerStatusFilter]);

  const activeNegotiations = useMemo(() => {
    return groupBuyQuotes.filter(
      (q) =>
        q.status === 'Shortlisted' ||
        ['Active', 'Counter-Offer Sent', 'Awaiting Buyer'].includes(q.negotiationStatus) ||
        (q.messages?.length > 0 && !['Expired', 'Withdrawn', 'Declined'].includes(q.status))
    );
  }, [groupBuyQuotes]);

  const currentNeg =
    activeNegotiations.find((n) => n.id === activeNegId) || activeNegotiations[0] || null;

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!currentNeg || !chatText.trim()) return;
    onSendNegotiationMessage(currentNeg.id, chatText.trim(), counterPrice ? Number(counterPrice) : null);
    setChatText('');
    setCounterPrice('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 border-b border-inherit pb-4">
        {[
          { id: 'discover', label: 'Discover Requests', icon: Search, count: groupBuys.length },
          { id: 'offers', label: 'My Offers', icon: FileText, count: groupBuyQuotes.length },
          {
            id: 'negotiations',
            label: 'Negotiations',
            icon: MessageSquare,
            count: activeNegotiations.length,
          },
          { id: 'won-deals', label: 'Won Deals', icon: Award, count: wonDeals.length },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition ${
                active
                  ? 'bg-[#C5A059] text-black border-[#C5A059]'
                  : `${theme.card} hover:border-[#C5A059]`
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  active ? 'bg-black/20 text-black' : 'bg-[#C5A059]/15 text-[#C5A059]'
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DISCOVER REQUESTS */}
      {activeSubTab === 'discover' && (
        <div className="space-y-5">
          <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 ${theme.card}`}>
            <div className="lg:col-span-2 relative">
              <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product, category, or keyword..."
                className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
              />
            </div>
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
            <input
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Delivery location..."
              className={`p-2 rounded-md border text-sm ${theme.input}`}
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
                placeholder="Min Qty"
                className={`w-full p-2 rounded-md border text-sm ${theme.input}`}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`p-2 rounded-md border text-sm ${theme.input}`}
              >
                {['All', 'Open', 'Target Reached', 'Negotiating', 'Expired'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map((gb) => {
              const open = isGroupBuyOpen(gb);
              const existing = activeOfferMap[gb.id];
              return (
                <div
                  key={gb.id}
                  className={`rounded-xl border overflow-hidden flex flex-col justify-between ${theme.card}`}
                >
                  <div>
                    <div className="h-44 relative overflow-hidden">
                      <img src={gb.productImage} alt={gb.productName} className="w-full h-full object-cover" />
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] border backdrop-blur-md ${statusBadgeStyle(
                          gb.status
                        )}`}
                      >
                        {gb.status}
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold">
                          {gb.category}
                        </p>
                        <h3 className="font-serif text-xl font-medium mt-0.5">{gb.productName}</h3>
                        <p className={`text-xs line-clamp-2 mt-1 ${theme.muted}`}>
                          {gb.specifications}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded bg-black/5 dark:bg-white/5">
                          <span className={theme.muted}>Combined Qty</span>
                          <p className="font-semibold text-sm text-[#C5A059]">{gb.totalQuantity} units</p>
                        </div>
                        <div className="p-2.5 rounded bg-black/5 dark:bg-white/5">
                          <span className={theme.muted}>Participating</span>
                          <p className="font-semibold text-sm">{gb.participatingCount} businesses</p>
                        </div>
                      </div>
                      <div className={`text-xs space-y-1 ${theme.muted}`}>
                        <p className="flex justify-between">
                          <span>Target Price:</span>
                          <strong className="text-inherit">
                            {gb.targetPricePerUnit ? `₹${gb.targetPricePerUnit}/unit` : 'Flexible'}
                          </strong>
                        </p>
                        <p className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> Delivery:
                          </span>
                          <span>{gb.deliveryLocation}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> Deadline:
                          </span>
                          <span>{gb.deadline}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-inherit flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedGroupBuy(gb)}
                      className="px-3 py-2 rounded border border-inherit hover:border-[#C5A059] text-xs font-medium flex items-center gap-1"
                    >
                      <Eye size={13} /> View Details
                    </button>
                    {existing ? (
                      <button
                        onClick={() => onOpenReviseQuote(existing)}
                        className="px-3 py-2 rounded border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
                      >
                        ✓ Quoted (₹{existing.offeredPricePerUnit})
                      </button>
                    ) : open ? (
                      <button
                        onClick={() => onOpenSubmitQuote(gb)}
                        className="px-3.5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
                      >
                        Submit Quotation
                      </button>
                    ) : (
                      <span className={`text-xs italic ${theme.muted}`}>Closed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY OFFERS */}
      {activeSubTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Shortlisted', 'Accepted', 'Declined', 'Withdrawn', 'Expired'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setOfferStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                    offerStatusFilter === st
                      ? 'bg-[#C5A059] text-black border-[#C5A059]'
                      : theme.card
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
          <div className={`rounded-xl border overflow-x-auto ${theme.card}`}>
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Qty / Buyers</th>
                  <th className="p-4">Quoted Price</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Valid Until</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {filteredOffers.map((o) => (
                  <tr key={o.id}>
                    <td className="p-4 font-medium">
                      {o.productTitle}
                      <p className={`text-xs font-normal ${theme.muted}`}>{o.buyerResponseNote}</p>
                    </td>
                    <td className="p-4 text-xs">
                      {o.quantity} units • {o.participatingBuyers} buyers
                    </td>
                    <td className="p-4 font-semibold text-[#C5A059]">₹{o.offeredPricePerUnit}/u</td>
                    <td className="p-4 text-xs">{o.submittedDate}</td>
                    <td className="p-4 text-xs">{o.offerValidityDate}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs border ${statusBadgeStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOfferModal(o)}
                        className="px-2.5 py-1 rounded border text-xs"
                      >
                        View
                      </button>
                      {['Pending', 'Shortlisted'].includes(o.status) && (
                        <>
                          <button
                            onClick={() => onOpenReviseQuote(o)}
                            className="px-2.5 py-1 rounded border border-[#C5A059] text-[#C5A059] text-xs"
                          >
                            Revise
                          </button>
                          <button
                            onClick={() => onWithdrawQuote(o.id)}
                            className="px-2.5 py-1 rounded border border-red-500/40 text-red-500 text-xs"
                          >
                            Withdraw
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: NEGOTIATIONS */}
      {activeSubTab === 'negotiations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-5 p-5 rounded-xl border space-y-3 ${theme.card}`}>
            <h3 className="font-serif text-lg">Active Group Negotiations</h3>
            {activeNegotiations.map((neg) => (
              <div
                key={neg.id}
                onClick={() => setActiveNegId(neg.id)}
                className={`p-4 rounded-lg border cursor-pointer space-y-1.5 ${
                  currentNeg?.id === neg.id
                    ? 'border-[#C5A059] bg-[#C5A059]/10'
                    : 'border-inherit hover:border-[#C5A059]'
                }`}
              >
                <div className="flex justify-between gap-2">
                  <p className="font-medium text-sm">{neg.productTitle}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadgeStyle(neg.negotiationStatus)}`}>
                    {neg.negotiationStatus}
                  </span>
                </div>
                <p className={`text-xs ${theme.muted}`}>
                  {neg.buyerName} • <strong className="text-[#C5A059]">₹{neg.offeredPricePerUnit}/unit</strong>
                </p>
                <p className={`text-[11px] ${theme.muted}`}>Last activity: {neg.lastActivity}</p>
              </div>
            ))}
          </div>

          <div className={`lg:col-span-7 p-6 rounded-xl border flex flex-col justify-between min-h-[400px] ${theme.card}`}>
            {!currentNeg ? (
              <p className={`my-auto text-center text-sm ${theme.muted}`}>
                Select a negotiation thread to view messages and revise your offer.
              </p>
            ) : (
              <>
                <div className="pb-3 border-b border-inherit flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-xl">{currentNeg.productTitle}</h3>
                    <p className={`text-xs ${theme.muted}`}>
                      {currentNeg.buyerName} • Quote: ₹{currentNeg.offeredPricePerUnit}/unit
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenReviseQuote(currentNeg)}
                    className="px-3 py-1.5 rounded border border-[#C5A059] text-[#C5A059] text-xs font-medium"
                  >
                    Revise Offer
                  </button>
                </div>

                <div className="py-4 space-y-3 max-h-64 overflow-y-auto">
                  {(currentNeg.messages || []).map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg text-xs max-w-[85%] ${
                        m.senderRole === 'merchant'
                          ? 'ml-auto bg-[#C5A059]/20 border border-[#C5A059]/40'
                          : 'bg-black/5 dark:bg-white/5 border border-inherit'
                      }`}
                    >
                      <div className="flex justify-between gap-4 font-semibold mb-1">
                        <span>{m.senderName}</span>
                        <span className={theme.muted}>{m.time}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSend} className="pt-3 border-t border-inherit flex gap-2">
                  <input
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    placeholder="Reply to buyer group..."
                    className={`flex-1 p-2.5 rounded border text-xs ${theme.input}`}
                  />
                  <input
                    type="number"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    placeholder="Counter ₹/u"
                    className={`w-28 p-2.5 rounded border text-xs ${theme.input}`}
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
      )}

      {/* TAB 4: WON DEALS */}
      {activeSubTab === 'won-deals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wonDeals.map((d) => (
            <div key={d.id} className={`p-6 rounded-xl border space-y-4 ${theme.card}`}>
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold">
                    {d.category} • {d.numberOfBuyers} Buyers
                  </span>
                  <h3 className="font-serif text-2xl font-medium mt-0.5">{d.productName}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs border ${statusBadgeStyle(d.dealStatus)}`}>
                  {d.dealStatus}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                  <span className={theme.muted}>Agreed Qty</span>
                  <p className="font-semibold text-sm">{d.totalAgreedQuantity} units</p>
                </div>
                <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                  <span className={theme.muted}>Agreed Price</span>
                  <p className="font-semibold text-sm text-[#C5A059]">₹{d.agreedPricePerUnit}/u</p>
                </div>
                <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                  <span className={theme.muted}>Location</span>
                  <p className="font-semibold text-xs mt-0.5">{d.deliveryLocation}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs">
                <span className={theme.muted}>Accepted: {d.acceptanceDate}</span>
                <select
                  value={d.dealStatus}
                  onChange={(e) => onUpdateDealStatus(d.id, e.target.value)}
                  className={`p-1.5 rounded border text-xs ${theme.input}`}
                >
                  {['Accepted', 'Awaiting Fulfillment', 'In Progress', 'Completed', 'Cancelled'].map(
                    (st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group Buy Details Modal */}
      {selectedGroupBuy && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border space-y-5 ${theme.card}`}>
            <div className="flex justify-between items-start border-b border-inherit pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold">
                  {selectedGroupBuy.category} • {selectedGroupBuy.status}
                </span>
                <h3 className="font-serif text-2xl mt-0.5">{selectedGroupBuy.productName}</h3>
              </div>
              <button onClick={() => setSelectedGroupBuy(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Combined Qty</span>
                <p className="font-semibold text-base text-[#C5A059]">{selectedGroupBuy.totalQuantity} units</p>
              </div>
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Buyers</span>
                <p className="font-semibold text-base">{selectedGroupBuy.participatingCount}</p>
              </div>
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Target Budget</span>
                <p className="font-semibold text-base">
                  {selectedGroupBuy.targetPricePerUnit ? `₹${selectedGroupBuy.targetPricePerUnit}/u` : 'Flexible'}
                </p>
              </div>
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Deadline</span>
                <p className="font-semibold text-sm">{selectedGroupBuy.deadline}</p>
              </div>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <strong className="text-xs uppercase text-[#C5A059] block">Specifications</strong>
                {selectedGroupBuy.specifications}
              </p>
              <p>
                <strong className="text-xs uppercase text-[#C5A059] block">Requirements</strong>
                {selectedGroupBuy.requirements}
              </p>
              <p className="text-xs">
                <strong>Organizer:</strong> {selectedGroupBuy.organizer?.name} (
                {selectedGroupBuy.organizer?.type}, {selectedGroupBuy.organizer?.city})
              </p>
            </div>

            {selectedGroupBuy.participants?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-[#C5A059]">
                  Individual Quantity Breakdown
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  {selectedGroupBuy.participants.map((p, i) => (
                    <div key={i} className="p-2.5 rounded border border-inherit flex justify-between">
                      <span>
                        {p.name} ({p.role})
                      </span>
                      <strong className="text-[#C5A059]">{p.qty} units</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-inherit">
              <button
                onClick={() => setSelectedGroupBuy(null)}
                className="px-4 py-2 rounded border text-xs"
              >
                Close
              </button>
              {isGroupBuyOpen(selectedGroupBuy) && !activeOfferMap[selectedGroupBuy.id] && (
                <button
                  onClick={() => onOpenSubmitQuote(selectedGroupBuy)}
                  className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
                >
                  Submit Quotation →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offer Details Modal */}
      {selectedOfferModal && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border space-y-3 text-xs ${theme.card}`}>
            <div className="flex justify-between items-center border-b border-inherit pb-2">
              <h3 className="font-serif text-xl">{selectedOfferModal.id}</h3>
              <button onClick={() => setSelectedOfferModal(null)}>
                <X size={18} />
              </button>
            </div>
            <p><strong>Product:</strong> {selectedOfferModal.productTitle}</p>
            <p><strong>Quoted Price:</strong> ₹{selectedOfferModal.offeredPricePerUnit}/unit</p>
            <p><strong>Delivery Charges:</strong> ₹{selectedOfferModal.deliveryCharges}</p>
            <p><strong>Timeline:</strong> {selectedOfferModal.estimatedDeliveryTimeline}</p>
            <p><strong>Terms:</strong> {selectedOfferModal.additionalTerms || 'Standard B2B'}</p>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedOfferModal(null)} className="px-4 py-1.5 rounded border">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MyQuotationsSection({
  theme,
  quotations,
  onOpenReviseQuote,
  onWithdrawQuote,
  onJumpToSource,
  statusBadgeStyle,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [viewQuote, setViewQuote] = useState(null);

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const term = search.trim().toLowerCase();
      const matchSearch =
        !term ||
        q.id.toLowerCase().includes(term) ||
        q.buyerName.toLowerCase().includes(term) ||
        q.productTitle.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const matchDate = !dateFilter || q.submittedDate >= dateFilter;
      return matchSearch && matchStatus && matchDate;
    });
  }, [quotations, search, statusFilter, dateFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">My Quotations</h2>
        <p className={`text-xs ${theme.muted}`}>
          Unified tracker for all quotations submitted across Business Enquiries and Group Buys
        </p>
      </div>

      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-3 ${theme.card}`}>
        <div className="md:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Quotation ID, buyer, or product..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {['All', 'Pending', 'Shortlisted', 'Accepted', 'Declined', 'Withdrawn', 'Expired'].map(
            (s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            )
          )}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        />
      </div>

      <div className={`rounded-xl border overflow-x-auto ${theme.card}`}>
        <table className="w-full text-left text-sm">
          <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
            <tr>
              <th className="p-4">Quotation ID</th>
              <th className="p-4">Buyer / Business</th>
              <th className="p-4">Product / Requirement</th>
              <th className="p-4">Quoted Amount</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Submitted / Valid Until</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filtered.map((q) => {
              const total = q.offeredPricePerUnit * q.quantity + (q.deliveryCharges || 0);
              return (
                <tr key={q.id}>
                  <td className="p-4 font-mono text-xs font-semibold">
                    {q.id}
                    <button
                      onClick={() => onJumpToSource(q)}
                      className="block text-[10px] text-[#C5A059] hover:underline mt-0.5"
                    >
                      {q.sourceType}: {q.sourceId}
                    </button>
                  </td>
                  <td className="p-4 font-medium">{q.buyerName}</td>
                  <td className="p-4">{q.productTitle}</td>
                  <td className="p-4">
                    <span className="font-semibold text-[#C5A059]">₹{q.offeredPricePerUnit}/u</span>
                    <span className={`block text-[11px] ${theme.muted}`}>
                      Total: ₹{total.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-4 text-xs">{q.quantity} units</td>
                  <td className="p-4 text-xs">
                    {q.submittedDate} → {q.offerValidityDate}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border ${statusBadgeStyle(q.status)}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setViewQuote(q)}
                      className="px-2.5 py-1 rounded border text-xs"
                    >
                      View
                    </button>
                    {['Pending', 'Shortlisted'].includes(q.status) && (
                      <>
                        <button
                          onClick={() => onOpenReviseQuote(q)}
                          className="px-2.5 py-1 rounded border border-[#C5A059] text-[#C5A059] text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onWithdrawQuote(q.id)}
                          className="px-2.5 py-1 rounded border border-red-500/40 text-red-500 text-xs"
                        >
                          Withdraw
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewQuote && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-3 text-xs ${theme.card}`}>
            <div className="flex justify-between items-center border-b border-inherit pb-2">
              <h3 className="font-serif text-xl">{viewQuote.id} — Quotation Summary</h3>
              <button onClick={() => setViewQuote(null)}>
                <X size={18} />
              </button>
            </div>
            <p><strong>Linked Source:</strong> {viewQuote.sourceType} ({viewQuote.sourceId})</p>
            <p><strong>Buyer:</strong> {viewQuote.buyerName}</p>
            <p><strong>Product:</strong> {viewQuote.productTitle}</p>
            <p><strong>Unit Rate:</strong> ₹{viewQuote.offeredPricePerUnit} × {viewQuote.quantity} units</p>
            <p><strong>Delivery:</strong> ₹{viewQuote.deliveryCharges} • {viewQuote.estimatedDeliveryTimeline}</p>
            <div className="p-3 rounded bg-[#C5A059]/10 border border-[#C5A059]/30">
              <strong>Buyer Response:</strong> {viewQuote.buyerResponseNote}
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setViewQuote(null)} className="px-4 py-1.5 rounded border">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}