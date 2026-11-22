import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Users,
  MapPin,
  Calendar,
  Eye,
  X,
  Truck,
  CheckCircle2,
  MessageSquare,
  Scale,
} from 'lucide-react';
import { RETAILER_CATEGORIES } from '../../data/retailerMockData.js';

export function RetailerGroupBuysSection({
  theme,
  profile,
  groupBuys,
  setGroupBuys,
  quotations,
  selectedGroup,
  setSelectedGroup,
  onUpdateQuotationStatus,
  onContactMerchant,
  onNotify,
  badgeTone,
}) {
  const [subTab, setSubTab] = useState('discover'); // 'discover' | 'my-groups' | 'created' | 'completed'
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('deadline');

  // Create Group Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    productName: '',
    category: RETAILER_CATEGORIES[0],
    productImage:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: '',
    specifications: '',
    targetQuantity: '500',
    myQuantity: '100',
    minGroupQuantity: '350',
    targetPricePerUnit: '',
    deliveryLocation: `${profile.city}, ${profile.state}`,
    deliveryPreference: 'Individual delivery to each participant',
    deadline: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    notes: '',
  });

  // Join / Modify Participation Modal State
  const [joinTarget, setJoinTarget] = useState(null);
  const [joinForm, setJoinForm] = useState({
    quantity: '50',
    deliveryLocation: `${profile.city}, ${profile.state}`,
    notes: '',
  });

  // Compare Group Quotations toggle inside details modal
  const [showCompareMode, setShowCompareMode] = useState(false);

  const filteredGroups = useMemo(() => {
    const list = groupBuys.filter((g) => {
      if (subTab === 'my-groups' && !g.joinedByMe) return false;
      if (subTab === 'created' && !g.createdByMe) return false;
      if (subTab === 'completed' && g.status !== 'Completed') return false;
      if (subTab === 'discover' && ['Completed', 'Cancelled', 'Expired'].includes(g.status)) {
        return false;
      }

      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        g.productName.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.organizerName.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || g.category === categoryFilter;
      const matchLoc =
        !locationFilter.trim() ||
        g.deliveryLocation.toLowerCase().includes(locationFilter.trim().toLowerCase());
      return matchSearch && matchCat && matchLoc;
    });

    if (sortBy === 'progress') {
      return [...list].sort(
        (a, b) => b.committedQuantity / b.targetQuantity - a.committedQuantity / a.targetQuantity
      );
    }
    if (sortBy === 'qty') {
      return [...list].sort((a, b) => b.targetQuantity - a.targetQuantity);
    }
    return [...list].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [groupBuys, subTab, search, categoryFilter, locationFilter, sortBy]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const targetQty = Number(createForm.targetQuantity);
    const ownQty = Number(createForm.myQuantity);
    const created = {
      id: `GB-2026-${Math.floor(200 + Math.random() * 799)}`,
      productName: createForm.productName.trim(),
      productImage: createForm.productImage.trim(),
      category: createForm.category,
      description: createForm.description.trim(),
      specifications: createForm.specifications.trim(),
      organizerName: profile.businessName,
      organizerCity: `${profile.city}, ${profile.state}`,
      createdByMe: true,
      joinedByMe: true,
      myQuantity: ownQty,
      myDeliveryLocation: createForm.deliveryLocation.trim(),
      myNotes: createForm.notes.trim(),
      targetQuantity: targetQty,
      minGroupQuantity: Number(createForm.minGroupQuantity) || targetQty,
      committedQuantity: ownQty,
      targetPricePerUnit: createForm.targetPricePerUnit
        ? Number(createForm.targetPricePerUnit)
        : null,
      deliveryLocation: createForm.deliveryLocation.trim(),
      deliveryPreference: createForm.deliveryPreference,
      deadline: createForm.deadline,
      status: ownQty >= targetQty ? 'Target Reached' : 'Open for Participants',
      participants: [
        {
          id: `P-${Date.now()}`,
          name: `${profile.businessName} (You)`,
          city: profile.city,
          qty: ownQty,
          isMe: true,
        },
      ],
      updates: [
        {
          date: new Date().toISOString().split('T')[0],
          text: `Group buy created by ${profile.businessName} with ${ownQty} initial units committed.`,
        },
      ],
    };

    setGroupBuys((prev) => [created, ...prev]);
    setCreateOpen(false);
    setSubTab('created');
    onNotify('success', `Group Buy "${created.productName}" created! Now visible under Created by Me & Discover Groups.`);
  };

  const openJoinModal = (group) => {
    setJoinTarget(group);
    setJoinForm({
      quantity: group.joinedByMe ? String(group.myQuantity) : '50',
      deliveryLocation: group.myDeliveryLocation || `${profile.city}, ${profile.state}`,
      notes: group.myNotes || '',
    });
  };

  const handleConfirmJoinOrModify = (e) => {
    e.preventDefault();
    if (!joinTarget) return;
    const qty = Number(joinForm.quantity);
    if (!qty || qty < 1) return;

    setGroupBuys((prev) =>
      prev.map((g) => {
        if (g.id !== joinTarget.id) return g;
        const alreadyIn = g.participants.some((p) => p.isMe);
        const updatedParticipants = alreadyIn
          ? g.participants.map((p) => (p.isMe ? { ...p, qty, city: joinForm.deliveryLocation } : p))
          : [
              ...g.participants,
              {
                id: `P-${Date.now()}`,
                name: `${profile.businessName} (You)`,
                city: joinForm.deliveryLocation,
                qty,
                isMe: true,
              },
            ];
        const newCommitted = updatedParticipants.reduce((s, p) => s + p.qty, 0);
        const nextStatus =
          newCommitted >= g.targetQuantity && g.status === 'Open for Participants'
            ? 'Target Reached'
            : g.status;

        const updatedGroup = {
          ...g,
          joinedByMe: true,
          myQuantity: qty,
          myDeliveryLocation: joinForm.deliveryLocation,
          myNotes: joinForm.notes,
          committedQuantity: newCommitted,
          participants: updatedParticipants,
          status: nextStatus,
          updates: [
            {
              date: new Date().toISOString().split('T')[0],
              text: alreadyIn
                ? `${profile.businessName} updated commitment to ${qty} units.`
                : `${profile.businessName} joined with ${qty} units.`,
            },
            ...(g.updates || []),
          ],
        };
        if (selectedGroup?.id === g.id) setSelectedGroup(updatedGroup);
        return updatedGroup;
      })
    );

    onNotify(
      'success',
      joinTarget.joinedByMe
        ? `Updated your quantity in "${joinTarget.productName}" to ${qty} units.`
        : `Joined "${joinTarget.productName}" with ${qty} units!`
    );
    setJoinTarget(null);
  };

  const handleLeaveGroup = (group) => {
    setGroupBuys((prev) =>
      prev.map((g) => {
        if (g.id !== group.id) return g;
        const updatedParticipants = g.participants.filter((p) => !p.isMe);
        const newCommitted = updatedParticipants.reduce((s, p) => s + p.qty, 0);
        const updated = {
          ...g,
          joinedByMe: false,
          myQuantity: 0,
          committedQuantity: newCommitted,
          participants: updatedParticipants,
        };
        if (selectedGroup?.id === g.id) setSelectedGroup(updated);
        return updated;
      })
    );
    onNotify('success', `You left the group buy "${group.productName}".`);
  };

  const groupQuotations = useMemo(() => {
    if (!selectedGroup) return [];
    return quotations.filter(
      (q) => q.sourceType === 'Group Buy' && q.sourceId === selectedGroup.id
    );
  }, [selectedGroup, quotations]);

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-inherit pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'discover', label: 'Discover Groups' },
            { id: 'my-groups', label: 'My Groups' },
            { id: 'created', label: 'Created by Me' },
            { id: 'completed', label: 'Completed' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider border transition ${
                subTab === t.id
                  ? 'bg-[#C5A059] text-black border-[#C5A059]'
                  : `${theme.card} hover:border-[#C5A059]`
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2.5 rounded-md bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
        >
          <PlusCircle size={15} /> Create Group Buy
        </button>
      </div>

      {/* Search, Filter & Sort */}
      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 ${theme.card}`}>
        <div className="lg:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups by product, category, or organizer..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          <option value="All">All Categories</option>
          {RETAILER_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="Filter by delivery city..."
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          <option value="deadline">Sort: Soonest Deadline</option>
          <option value="progress">Sort: Highest Progress</option>
          <option value="qty">Sort: Largest Bulk Qty</option>
        </select>
      </div>

      {/* Group Cards Grid */}
      {filteredGroups.length === 0 ? (
        <div className={`p-12 rounded-xl border text-center text-sm ${theme.card}`}>
          No group buys found in this view. Try adjusting filters or click <strong>Create Group Buy</strong>.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGroups.map((g) => {
            const pct = Math.min(100, Math.round((g.committedQuantity / g.targetQuantity) * 100));
            const remaining = Math.max(0, g.targetQuantity - g.committedQuantity);
            const canJoin = ['Open for Participants', 'Target Reached', 'Sourcing'].includes(g.status);

            return (
              <div
                key={g.id}
                className={`rounded-xl border overflow-hidden flex flex-col justify-between ${theme.card}`}
              >
                <div>
                  <div className="h-40 relative overflow-hidden">
                    <img src={g.productImage} alt={g.productName} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] border backdrop-blur-md ${badgeTone(
                        g.status
                      )}`}
                    >
                      {g.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-semibold">
                        {g.category} • By {g.organizerName}
                      </span>
                      <h3 className="font-serif text-xl font-medium mt-0.5">{g.productName}</h3>
                    </div>

                    {/* Progress Block */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span>
                          <strong className="text-[#C5A059]">{g.committedQuantity}</strong> /{' '}
                          {g.targetQuantity} units
                        </span>
                        <span className={theme.muted}>
                          {remaining > 0 ? `${remaining}u remaining` : 'Target reached'}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#C5A059]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className={`flex justify-between text-[11px] ${theme.muted}`}>
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {g.participants.length} businesses
                        </span>
                        <span>{pct}% filled</span>
                      </div>
                    </div>

                    <div className={`text-xs space-y-1 ${theme.muted}`}>
                      <p className="flex justify-between">
                        <span>Target Price:</span>
                        <strong className="text-inherit">
                          {g.targetPricePerUnit ? `₹${g.targetPricePerUnit}/unit` : 'Flexible'}
                        </strong>
                      </p>
                      <p className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> Hub:
                        </span>
                        <span>{g.deliveryLocation}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Deadline:
                        </span>
                        <span>{g.deadline}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-inherit flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setShowCompareMode(false);
                      setSelectedGroup(g);
                    }}
                    className="px-3 py-2 rounded border border-inherit hover:border-[#C5A059] text-xs font-medium flex items-center gap-1"
                  >
                    <Eye size={13} /> View Group
                  </button>

                  {g.joinedByMe ? (
                    <button
                      onClick={() => openJoinModal(g)}
                      className="px-3 py-2 rounded border border-[#C5A059] text-[#C5A059] text-xs font-semibold"
                    >
                      My Qty: {g.myQuantity}u • Edit
                    </button>
                  ) : canJoin ? (
                    <button
                      onClick={() => openJoinModal(g)}
                      className="px-3.5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
                    >
                      Join Group →
                    </button>
                  ) : (
                    <span className={`text-xs italic ${theme.muted}`}>{g.status}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          GROUP DETAILS MODAL (PROGRESS, PARTICIPANTS, QUOTATIONS & DELIVERY)
          ==================================================================== */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border space-y-6 ${theme.card}`}>
            <div className="flex justify-between items-start border-b border-inherit pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold">
                  {selectedGroup.id} • {selectedGroup.category} • {selectedGroup.status}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium mt-0.5">
                  {selectedGroup.productName}
                </h2>
                <p className={`text-xs mt-1 ${theme.muted}`}>
                  Organized by <strong>{selectedGroup.organizerName}</strong> ({selectedGroup.organizerCity})
                </p>
              </div>
              <button onClick={() => setSelectedGroup(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Demand Progress Summary */}
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit space-y-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className={theme.muted}>Target Quantity</span>
                  <p className="font-semibold text-base">{selectedGroup.targetQuantity} units</p>
                </div>
                <div>
                  <span className={theme.muted}>Committed</span>
                  <p className="font-semibold text-base text-[#C5A059]">
                    {selectedGroup.committedQuantity} units
                  </p>
                </div>
                <div>
                  <span className={theme.muted}>Remaining</span>
                  <p className="font-semibold text-base">
                    {Math.max(0, selectedGroup.targetQuantity - selectedGroup.committedQuantity)} units
                  </p>
                </div>
                <div>
                  <span className={theme.muted}>Participants</span>
                  <p className="font-semibold text-base">
                    {selectedGroup.participants.length} businesses
                  </p>
                </div>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#C5A059]"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((selectedGroup.committedQuantity / selectedGroup.targetQuantity) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Specs, Delivery & Participants */}
            <div className="grid md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div>
                  <h4 className="uppercase font-semibold text-[#C5A059]">Product Specifications</h4>
                  <p className="mt-1 leading-relaxed">{selectedGroup.specifications}</p>
                </div>
                <div>
                  <h4 className="uppercase font-semibold text-[#C5A059] flex items-center gap-1">
                    <Truck size={13} /> Delivery Arrangement
                  </h4>
                  <p className="mt-1">{selectedGroup.deliveryPreference}</p>
                  <p className={`mt-0.5 ${theme.muted}`}>
                    Primary Hub: {selectedGroup.deliveryLocation} • Deadline: {selectedGroup.deadline}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="uppercase font-semibold text-[#C5A059]">
                  Participant Quantity Breakdown
                </h4>
                <div className="space-y-1.5">
                  {selectedGroup.participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-lg border border-inherit flex items-center justify-between"
                    >
                      <span>
                        <strong>{p.name}</strong> ({p.city})
                      </span>
                      <span className="font-semibold text-[#C5A059]">{p.qty} units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Merchant Quotations for this Group Buy */}
            <div className="space-y-3 pt-4 border-t border-inherit">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-serif text-xl">
                  Merchant Quotations ({groupQuotations.length})
                </h4>
                {groupQuotations.length > 1 && (
                  <button
                    onClick={() => setShowCompareMode(!showCompareMode)}
                    className="px-3 py-1.5 rounded border border-[#C5A059] text-[#C5A059] text-xs font-semibold flex items-center gap-1"
                  >
                    <Scale size={13} /> {showCompareMode ? 'Card View' : 'Compare Side-by-Side'}
                  </button>
                )}
              </div>

              {groupQuotations.length === 0 ? (
                <p className={`text-xs ${theme.muted}`}>
                  No merchant quotations submitted yet for this group buy.
                </p>
              ) : showCompareMode ? (
                <div className="overflow-x-auto border border-inherit rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b border-inherit ${theme.muted}`}>
                      <tr>
                        <th className="p-3">Metric</th>
                        {groupQuotations.map((q) => (
                          <th key={q.id} className="p-3 font-semibold text-inherit">
                            {q.merchantName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      <tr>
                        <td className="p-3 font-medium">Price / Unit</td>
                        {groupQuotations.map((q) => (
                          <td key={q.id} className="p-3 font-semibold text-[#C5A059]">
                            ₹{q.quotedPricePerUnit}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Delivery Charges</td>
                        {groupQuotations.map((q) => (
                          <td key={q.id} className="p-3">₹{q.deliveryCharges}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Total Estimated Cost</td>
                        {groupQuotations.map((q) => (
                          <td key={q.id} className="p-3 font-semibold">
                            ₹
                            {(
                              q.quotedPricePerUnit * q.requestedQuantity +
                              (q.deliveryCharges || 0)
                            ).toLocaleString('en-IN')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Delivery Method</td>
                        {groupQuotations.map((q) => (
                          <td key={q.id} className="p-3">{q.deliveryMethod}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Delivery Timeline</td>
                        {groupQuotations.map((q) => (
                          <td key={q.id} className="p-3">{q.estimatedDeliveryTimeline}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {groupQuotations.map((q) => {
                    const estTotal =
                      q.quotedPricePerUnit * q.requestedQuantity + (q.deliveryCharges || 0);
                    return (
                      <div key={q.id} className="p-4 rounded-xl border border-inherit space-y-2.5 text-xs">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold text-sm">{q.merchantName}</p>
                            <p className={theme.muted}>{q.merchantLocation}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full border ${badgeTone(q.status)}`}>
                            {q.status}
                          </span>
                        </div>
                        <p>
                          <strong className="text-[#C5A059] text-sm">₹{q.quotedPricePerUnit}/unit</strong>{' '}
                          • Est. Total: <strong>₹{estTotal.toLocaleString('en-IN')}</strong>
                        </p>
                        <p className={theme.muted}>
                          Delivery: {q.deliveryMethod} (₹{q.deliveryCharges} • {q.estimatedDeliveryTimeline})
                        </p>
                        <p className={theme.muted}>Terms: {q.terms}</p>

                        <div className="pt-2 flex flex-wrap gap-2">
                          {selectedGroup.createdByMe && q.status !== 'Accepted' && (
                            <>
                              <button
                                onClick={() => onUpdateQuotationStatus(q.id, 'Shortlisted')}
                                className="px-2.5 py-1 rounded border border-[#C5A059] text-[#C5A059]"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => onUpdateQuotationStatus(q.id, 'Accepted')}
                                className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold"
                              >
                                Accept Quote
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedGroup(null);
                              onContactMerchant(q.merchantId, q.merchantName);
                            }}
                            className="px-2.5 py-1 rounded border flex items-center gap-1"
                          >
                            <MessageSquare size={12} /> Negotiate
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Participation Controls */}
            <div className="pt-4 border-t border-inherit flex flex-wrap justify-between items-center gap-3">
              <div>
                {selectedGroup.joinedByMe && !selectedGroup.createdByMe && selectedGroup.status !== 'Completed' && (
                  <button
                    onClick={() => handleLeaveGroup(selectedGroup)}
                    className="px-3.5 py-2 rounded border border-red-500/40 text-red-500 text-xs font-medium"
                  >
                    Leave Group
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {selectedGroup.status !== 'Completed' && (
                  <button
                    onClick={() => openJoinModal(selectedGroup)}
                    className="px-4 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
                  >
                    {selectedGroup.joinedByMe ? 'Modify My Quantity' : 'Join This Group →'}
                  </button>
                )}
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="px-4 py-2 rounded border text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE GROUP BUY MODAL */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGroup}
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border space-y-4 text-sm ${theme.card}`}
          >
            <div className="flex justify-between items-center border-b border-inherit pb-3">
              <h3 className="font-serif text-2xl">Create a New Group Buy</h3>
              <button type="button" onClick={() => setCreateOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Product Name *</label>
                <input
                  required
                  value={createForm.productName}
                  onChange={(e) => setCreateForm({ ...createForm, productName: e.target.value })}
                  placeholder="e.g. Smart Desk LED Lamps"
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Product Category *</label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
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
                <label className={`block text-xs mb-1 ${theme.muted}`}>Total Target Quantity *</label>
                <input
                  required
                  type="number"
                  min="10"
                  value={createForm.targetQuantity}
                  onChange={(e) => setCreateForm({ ...createForm, targetQuantity: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Your Own Required Qty *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={createForm.myQuantity}
                  onChange={(e) => setCreateForm({ ...createForm, myQuantity: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Target Price / Unit (₹, Optional)</label>
                <input
                  type="number"
                  value={createForm.targetPricePerUnit}
                  onChange={(e) => setCreateForm({ ...createForm, targetPricePerUnit: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Joining Deadline *</label>
                <input
                  required
                  type="date"
                  value={createForm.deadline}
                  onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Preferred Delivery Hub *</label>
                <input
                  required
                  value={createForm.deliveryLocation}
                  onChange={(e) => setCreateForm({ ...createForm, deliveryLocation: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Delivery Arrangement</label>
                <select
                  value={createForm.deliveryPreference}
                  onChange={(e) => setCreateForm({ ...createForm, deliveryPreference: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                >
                  <option>Individual delivery to each participant</option>
                  <option>Delivery to a single common address</option>
                  <option>Collection from a common pickup location</option>
                </select>
              </div>
            </div>

            <textarea
              rows="2"
              required
              placeholder="Product specifications & quality requirements..."
              value={createForm.specifications}
              onChange={(e) => setCreateForm({ ...createForm, specifications: e.target.value })}
              className={`w-full p-2.5 rounded border ${theme.input}`}
            />
            <textarea
              rows="2"
              placeholder="Additional notes for joining retailers & merchants..."
              value={createForm.notes}
              onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
              className={`w-full p-2.5 rounded border ${theme.input}`}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded border text-xs">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold">
                Publish Group Buy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* JOIN / MODIFY PARTICIPATION MODAL */}
      {joinTarget && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleConfirmJoinOrModify} className={`w-full max-w-md p-6 rounded-2xl border space-y-4 text-sm ${theme.card}`}>
            <div className="flex justify-between items-center border-b border-inherit pb-3">
              <h3 className="font-serif text-xl">
                {joinTarget.joinedByMe ? 'Modify Your Group Quantity' : 'Join Group Buy'}
              </h3>
              <button type="button" onClick={() => setJoinTarget(null)}>
                <X size={18} />
              </button>
            </div>
            <p className="text-xs font-medium">{joinTarget.productName}</p>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Your Required Quantity (Units) *</label>
              <input
                required
                type="number"
                min="1"
                value={joinForm.quantity}
                onChange={(e) => setJoinForm({ ...joinForm, quantity: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Your Delivery Location *</label>
              <input
                required
                value={joinForm.deliveryLocation}
                onChange={(e) => setJoinForm({ ...joinForm, deliveryLocation: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <textarea
              rows="2"
              placeholder="Color split or packaging notes (optional)..."
              value={joinForm.notes}
              onChange={(e) => setJoinForm({ ...joinForm, notes: e.target.value })}
              className={`w-full p-2.5 rounded border text-xs ${theme.input}`}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setJoinTarget(null)} className="px-4 py-2 rounded border text-xs">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold">
                {joinTarget.joinedByMe ? 'Update Quantity' : 'Confirm Participation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}