import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Eye,
  MessageSquare,
  Scale,
  X,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { RETAILER_CATEGORIES } from '../../data/retailerMockData.js';

export function RetailerEnquiriesSection({
  theme,
  enquiries,
  setEnquiries,
  onCreateEnquiry,
  onOpenConversation,
  onNavigateQuotations,
  onNotify,
  badgeTone,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewEnq, setViewEnq] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    productName: '',
    category: RETAILER_CATEGORIES[0],
    merchantName: 'Aurelia Acoustic & Craft Labs',
    quantity: '100',
    targetBudget: '',
    specifications: '',
    deliveryRequirements: '',
  });

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        e.id.toLowerCase().includes(q) ||
        e.productName.toLowerCase().includes(q) ||
        e.merchantName.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enquiries, search, statusFilter]);

  const openEdit = (enq) => {
    setEditingId(enq.id);
    setForm({
      productName: enq.productName,
      category: enq.category,
      merchantName: enq.merchantName,
      quantity: String(enq.quantity),
      targetBudget: enq.targetBudget || '',
      specifications: enq.specifications || '',
      deliveryRequirements: enq.deliveryRequirements || '',
    });
    setFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                productName: form.productName.trim(),
                category: form.category,
                merchantName: form.merchantName.trim(),
                quantity: Number(form.quantity),
                targetBudget: form.targetBudget.trim(),
                specifications: form.specifications.trim(),
                deliveryRequirements: form.deliveryRequirements.trim(),
              }
            : item
        )
      );
      onNotify('success', `Enquiry ${editingId} updated.`);
    } else {
      onCreateEnquiry(form);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const closeEnquiry = (id) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'Closed' } : e)));
    onNotify('success', `Enquiry ${id} closed.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">My Enquiries</h2>
          <p className={`text-xs ${theme.muted}`}>
            Track product enquiries submitted to merchants and follow up on supplier responses
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              productName: '',
              category: RETAILER_CATEGORIES[0],
              merchantName: 'Aurelia Acoustic & Craft Labs',
              quantity: '100',
              targetBudget: '',
              specifications: '',
              deliveryRequirements: '',
            });
            setFormOpen(true);
          }}
          className="px-4 py-2.5 rounded-md bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1.5"
        >
          <PlusCircle size={15} /> Create New Enquiry
        </button>
      </div>

      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-3 gap-3 ${theme.card}`}>
        <div className="md:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Enquiry ID, product, or merchant..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {['All', 'Submitted', 'Responses Received', 'In Discussion', 'Negotiation', 'Closed'].map(
            (s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            )
          )}
        </select>
      </div>

      <div className={`rounded-xl border overflow-x-auto ${theme.card}`}>
        <table className="w-full text-left text-sm">
          <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Product / Requirement</th>
              <th className="p-4">Merchant Contacted</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Submitted</th>
              <th className="p-4">Responses</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filtered.map((e) => (
              <tr key={e.id}>
                <td className="p-4 font-mono text-xs font-semibold">{e.id}</td>
                <td className="p-4 font-medium">{e.productName}</td>
                <td className="p-4 text-xs">{e.merchantName}</td>
                <td className="p-4 text-xs">{e.quantity} units</td>
                <td className="p-4 text-xs">{e.submittedDate}</td>
                <td className="p-4 text-xs">{e.responsesCount}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs border ${badgeTone(e.status)}`}>
                    {e.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    onClick={() => setViewEnq(e)}
                    className="px-2.5 py-1 rounded border text-xs"
                  >
                    <Eye size={12} className="inline mr-1" />
                    Details
                  </button>
                  {e.status !== 'Closed' && (
                    <button
                      onClick={() => openEdit(e)}
                      className="px-2.5 py-1 rounded border border-[#C5A059] text-[#C5A059] text-xs"
                    >
                      <Edit3 size={12} className="inline" />
                    </button>
                  )}
                  <button
                    onClick={() => onOpenConversation(e.conversationId, e.merchantName)}
                    className="px-2.5 py-1 rounded bg-[#C5A059] text-black text-xs font-semibold"
                  >
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enquiry Details Modal */}
      {viewEnq && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border space-y-4 text-xs ${theme.card}`}>
            <div className="flex justify-between items-start border-b border-inherit pb-3">
              <div>
                <span className="uppercase tracking-wider text-[#C5A059] font-semibold">
                  {viewEnq.id} • {viewEnq.status}
                </span>
                <h3 className="font-serif text-2xl mt-0.5">{viewEnq.productName}</h3>
              </div>
              <button onClick={() => setViewEnq(null)}>
                <X size={18} />
              </button>
            </div>
            <p><strong>Merchant Contacted:</strong> {viewEnq.merchantName}</p>
            <p><strong>Quantity &amp; Budget:</strong> {viewEnq.quantity} units • {viewEnq.targetBudget || 'Flexible'}</p>
            <p><strong>Specifications:</strong> {viewEnq.specifications}</p>
            <p><strong>Delivery Requirements:</strong> {viewEnq.deliveryRequirements}</p>
            {viewEnq.responses?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-inherit">
                <p className="uppercase font-semibold text-[#C5A059]">Merchant Responses</p>
                {viewEnq.responses.map((r, i) => (
                  <div key={i} className="p-3 rounded bg-black/5 dark:bg-white/5">
                    <p className="font-semibold">{r.from} ({r.date})</p>
                    <p className="mt-1">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap justify-between gap-2 pt-3 border-t border-inherit">
              {viewEnq.status !== 'Closed' && (
                <button
                  onClick={() => {
                    closeEnquiry(viewEnq.id);
                    setViewEnq(null);
                  }}
                  className="px-3 py-1.5 rounded border border-red-500/40 text-red-500"
                >
                  Close Enquiry
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => {
                    setViewEnq(null);
                    onNavigateQuotations();
                  }}
                  className="px-3 py-1.5 rounded border"
                >
                  View Quotations
                </button>
                <button
                  onClick={() => {
                    setViewEnq(null);
                    onOpenConversation(viewEnq.conversationId, viewEnq.merchantName);
                  }}
                  className="px-4 py-1.5 rounded bg-[#C5A059] text-black font-semibold"
                >
                  Contact Merchant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Enquiry Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 text-sm ${theme.card}`}>
            <div className="flex justify-between items-center border-b border-inherit pb-2">
              <h3 className="font-serif text-xl">{editingId ? 'Edit Enquiry' : 'Create Product Enquiry'}</h3>
              <button type="button" onClick={() => setFormOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <input
              required
              placeholder="Product or Sourcing Requirement *"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className={`w-full p-2.5 rounded border ${theme.input}`}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`p-2.5 rounded border ${theme.input}`}
              >
                {RETAILER_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Merchant / Supplier Name"
                value={form.merchantName}
                onChange={(e) => setForm({ ...form, merchantName: e.target.value })}
                className={`p-2.5 rounded border ${theme.input}`}
              />
              <input
                required
                type="number"
                min="1"
                placeholder="Quantity Required"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className={`p-2.5 rounded border ${theme.input}`}
              />
              <input
                placeholder="Target Budget (e.g. ₹1,50,000)"
                value={form.targetBudget}
                onChange={(e) => setForm({ ...form, targetBudget: e.target.value })}
                className={`p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <textarea
              rows="2"
              placeholder="Specifications & quality notes..."
              value={form.specifications}
              onChange={(e) => setForm({ ...form, specifications: e.target.value })}
              className={`w-full p-2.5 rounded border text-xs ${theme.input}`}
            />
            <input
              placeholder="Delivery requirements (location & timeline)..."
              value={form.deliveryRequirements}
              onChange={(e) => setForm({ ...form, deliveryRequirements: e.target.value })}
              className={`w-full p-2.5 rounded border text-xs ${theme.input}`}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 rounded border text-xs">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold">
                {editingId ? 'Save Changes' : 'Submit Enquiry'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function RetailerQuotationsSection({
  theme,
  quotations,
  onUpdateStatus,
  onContactMerchant,
  badgeTone,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [detailQuote, setDetailQuote] = useState(null);

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const term = search.trim().toLowerCase();
      const matchSearch =
        !term ||
        q.id.toLowerCase().includes(term) ||
        q.merchantName.toLowerCase().includes(term) ||
        q.productName.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [quotations, search, statusFilter]);

  const toggleCompareId = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3)
    );
  };

  const comparedQuotes = quotations.filter((q) => selectedIds.includes(q.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">My Quotations</h2>
          <p className={`text-xs ${theme.muted}`}>
            Review, compare, shortlist, and accept merchant offers across Enquiries and Group Buys
          </p>
        </div>
        <button
          disabled={selectedIds.length < 2}
          onClick={() => setCompareOpen(true)}
          className="px-4 py-2.5 rounded-md bg-[#C5A059] text-black text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
        >
          <Scale size={15} /> Compare Selected ({selectedIds.length})
        </button>
      </div>

      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-3 gap-3 ${theme.card}`}>
        <div className="md:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Quotation ID, merchant, or product..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {['All', 'Pending', 'Shortlisted', 'Accepted', 'Declined'].map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All Statuses' : s}
            </option>
          ))}
        </select>
      </div>

      <div className={`rounded-xl border overflow-x-auto ${theme.card}`}>
        <table className="w-full text-left text-sm">
          <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
            <tr>
              <th className="p-4">Compare</th>
              <th className="p-4">ID &amp; Source</th>
              <th className="p-4">Merchant</th>
              <th className="p-4">Product</th>
              <th className="p-4">Unit / Total Cost</th>
              <th className="p-4">Delivery &amp; Validity</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filtered.map((q) => {
              const total = q.quotedPricePerUnit * q.requestedQuantity + (q.deliveryCharges || 0);
              return (
                <tr key={q.id}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(q.id)}
                      onChange={() => toggleCompareId(q.id)}
                    />
                  </td>
                  <td className="p-4 font-mono text-xs">
                    <strong>{q.id}</strong>
                    <span className="block text-[10px] text-[#C5A059]">{q.sourceLabel}</span>
                  </td>
                  <td className="p-4 text-xs font-medium">
                    {q.merchantName}
                    <span className={`block font-normal ${theme.muted}`}>{q.merchantLocation}</span>
                  </td>
                  <td className="p-4 text-xs">{q.productName}</td>
                  <td className="p-4 text-xs">
                    <strong className="text-[#C5A059]">₹{q.quotedPricePerUnit}/u</strong>
                    <span className={`block ${theme.muted}`}>
                      Total: ₹{total.toLocaleString('en-IN')} ({q.requestedQuantity}u)
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    <span>₹{q.deliveryCharges} • {q.estimatedDeliveryTimeline}</span>
                    <span className={`block text-[10px] ${theme.muted}`}>Valid: {q.offerValidityDate}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border ${badgeTone(q.status)}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    <button onClick={() => setDetailQuote(q)} className="px-2 py-1 rounded border text-xs">
                      View
                    </button>
                    {['Pending', 'Shortlisted'].includes(q.status) && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(q.id, 'Shortlisted')}
                          className="px-2 py-1 rounded border border-[#C5A059] text-[#C5A059] text-xs"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => onUpdateStatus(q.id, 'Accepted')}
                          className="px-2 py-1 rounded bg-emerald-600 text-white text-xs font-semibold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onUpdateStatus(q.id, 'Declined')}
                          className="px-2 py-1 rounded border border-red-500/40 text-red-500 text-xs"
                        >
                          Decline
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

      {/* Side-by-Side Comparison Modal */}
      {compareOpen && comparedQuotes.length >= 2 && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-4xl p-6 rounded-2xl border space-y-4 ${theme.card}`}>
            <div className="flex justify-between items-center border-b border-inherit pb-3">
              <h3 className="font-serif text-2xl">Side-by-Side Quotation Comparison</h3>
              <button onClick={() => setCompareOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-inherit">
                  <tr>
                    <th className="p-3">Criteria</th>
                    {comparedQuotes.map((q) => (
                      <th key={q.id} className="p-3 font-semibold">
                        {q.merchantName} ({q.id})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  <tr>
                    <td className="p-3 font-medium">Unit Price</td>
                    {comparedQuotes.map((q) => (
                      <td key={q.id} className="p-3 font-semibold text-[#C5A059]">₹{q.quotedPricePerUnit}/u</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Delivery Charges</td>
                    {comparedQuotes.map((q) => (
                      <td key={q.id} className="p-3">₹{q.deliveryCharges}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Total Estimated Cost</td>
                    {comparedQuotes.map((q) => (
                      <td key={q.id} className="p-3 font-semibold">
                        ₹
                        {(q.quotedPricePerUnit * q.requestedQuantity + (q.deliveryCharges || 0)).toLocaleString(
                          'en-IN'
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Delivery Method</td>
                    {comparedQuotes.map((q) => (
                      <td key={q.id} className="p-3">{q.deliveryMethod}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Delivery Timeline</td>
                    {comparedQuotes.map((q) => (
                      <td key={q.id} className="p-3">{q.estimatedDeliveryTimeline}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">MOQ &amp; Validity</td>
                    {comparedQuotes.map((q) => (
                      <td key={q.id} className="p-3">MOQ {q.moq} • Until {q.offerValidityDate}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Details Modal */}
      {detailQuote && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-3 text-xs ${theme.card}`}>
            <div className="flex justify-between items-center border-b border-inherit pb-2">
              <h3 className="font-serif text-xl">{detailQuote.id} — {detailQuote.merchantName}</h3>
              <button onClick={() => setDetailQuote(null)}>
                <X size={18} />
              </button>
            </div>
            <p><strong>Product:</strong> {detailQuote.productName}</p>
            <p><strong>Source:</strong> {detailQuote.sourceLabel}</p>
            <p><strong>Quoted Price:</strong> ₹{detailQuote.quotedPricePerUnit}/unit × {detailQuote.requestedQuantity} units</p>
            <p><strong>Delivery Method:</strong> {detailQuote.deliveryMethod} (₹{detailQuote.deliveryCharges})</p>
            <p><strong>Timeline &amp; Validity:</strong> {detailQuote.estimatedDeliveryTimeline} • Valid until {detailQuote.offerValidityDate}</p>
            <p><strong>Merchant Terms:</strong> {detailQuote.terms}</p>
            <div className="flex justify-end gap-2 pt-3 border-t border-inherit">
              <button
                onClick={() => {
                  const q = detailQuote;
                  setDetailQuote(null);
                  onContactMerchant(q.merchantId, q.merchantName);
                }}
                className="px-4 py-1.5 rounded bg-[#C5A059] text-black font-semibold flex items-center gap-1"
              >
                <MessageSquare size={12} /> Negotiate with Merchant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}