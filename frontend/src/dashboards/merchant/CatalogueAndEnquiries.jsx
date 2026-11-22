import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Archive,
  X,
  Eye,
  MessageSquare,
  Send,
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from './merchantData.js';

const EMPTY_PRODUCT = {
  name: '',
  imageUrl:
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
  description: '',
  category: PRODUCT_CATEGORIES[0],
  subcategory: '',
  brand: '',
  price: '',
  wholesalePrice: '',
  unit: 'Piece',
  moq: '',
  stock: '',
  specifications: '',
  availability: 'In Stock',
  deliveryInfo: '',
};

export function ProductCatalogueSection({
  theme,
  products,
  setProducts,
  onNotify,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showArchived, setShowArchived] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (showArchived ? !p.archived : p.archived) return false;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchAvail =
        availabilityFilter === 'All' || p.availability === availabilityFilter;
      return matchSearch && matchCat && matchAvail;
    });

    if (sortBy === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'stock-desc') return [...list].sort((a, b) => b.stock - a.stock);
    return list;
  }, [products, search, categoryFilter, availabilityFilter, sortBy, showArchived]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_PRODUCT);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      imageUrl: p.images?.[0] || EMPTY_PRODUCT.imageUrl,
      description: p.description || '',
      category: p.category,
      subcategory: p.subcategory || '',
      brand: p.brand || '',
      price: String(p.price),
      wholesalePrice: p.wholesalePrice ? String(p.wholesalePrice) : '',
      unit: p.unit || 'Piece',
      moq: String(p.moq),
      stock: String(p.stock),
      specifications: p.specifications || '',
      availability: p.availability || 'In Stock',
      deliveryInfo: p.deliveryInfo || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const record = {
      id: editingId || `PRD-${Math.floor(200 + Math.random() * 799)}`,
      name: form.name.trim(),
      images: [form.imageUrl.trim() || EMPTY_PRODUCT.imageUrl],
      description: form.description.trim(),
      category: form.category,
      subcategory: form.subcategory.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : null,
      unit: form.unit,
      moq: Number(form.moq) || 1,
      stock: Number(form.stock) || 0,
      specifications: form.specifications.trim(),
      availability: form.availability,
      deliveryInfo: form.deliveryInfo.trim(),
      archived: false,
      views: editingId ? products.find((x) => x.id === editingId)?.views || 0 : 12,
      enquiriesCount: editingId
        ? products.find((x) => x.id === editingId)?.enquiriesCount || 0
        : 0,
    };

    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? record : p)));
      onNotify('success', `"${record.name}" updated in Product Catalogue.`);
    } else {
      setProducts((prev) => [record, ...prev]);
      onNotify('success', `"${record.name}" added to Product Catalogue.`);
    }
    setModalOpen(false);
  };

  const handleArchiveToggle = (p) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, archived: !item.archived } : item))
    );
    onNotify('success', p.archived ? `Restored "${p.name}".` : `Archived "${p.name}".`);
  };

  const handleDelete = (p) => {
    setProducts((prev) => prev.filter((item) => item.id !== p.id));
    onNotify('success', `Deleted "${p.name}" from catalogue.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">Product Catalogue</h2>
          <p className={`text-xs ${theme.muted}`}>
            Manage wholesale SKUs, MOQ tiers, stock levels, and product specifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3.5 py-2.5 rounded-md border text-xs font-medium ${theme.card}`}
          >
            {showArchived ? 'View Active Products' : 'View Archived'}
          </button>
          <button
            onClick={openAdd}
            className="px-4 py-2.5 rounded-md bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 ${theme.card}`}>
        <div className="lg:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, category, or brand..."
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
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          <option value="All">All Availability</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          <option value="newest">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="stock-desc">Highest Stock</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className={`p-12 rounded-xl border text-center text-sm ${theme.card}`}>
          No products found matching your current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl border overflow-hidden flex flex-col justify-between ${theme.card}`}
            >
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      p.availability === 'In Stock'
                        ? 'bg-emerald-900/90 text-emerald-200'
                        : p.availability === 'Low Stock'
                        ? 'bg-amber-900/90 text-amber-200'
                        : 'bg-red-900/90 text-red-200'
                    }`}
                  >
                    {p.availability}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold">
                    {p.category}
                  </p>
                  <h3 className="font-serif text-lg font-medium">{p.name}</h3>
                  <div className="text-xs space-y-1 pt-1">
                    <p className="flex justify-between">
                      <span className={theme.muted}>Retail / Wholesale:</span>
                      <span className="font-semibold text-[#C5A059]">
                        ₹{p.price} / ₹{p.wholesalePrice || p.price} per {p.unit}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className={theme.muted}>Available Stock:</span>
                      <span>{p.stock} {p.unit}s</span>
                    </p>
                    <p className="flex justify-between">
                      <span className={theme.muted}>MOQ:</span>
                      <span>{p.moq} {p.unit}s</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3.5 border-t border-inherit flex items-center justify-between gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="px-2.5 py-1.5 rounded border border-inherit hover:border-[#C5A059] text-xs flex items-center gap-1"
                >
                  <Edit3 size={13} /> Edit
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleArchiveToggle(p)}
                    className="p-1.5 rounded border border-inherit hover:border-[#C5A059] text-xs"
                    title={p.archived ? 'Restore' : 'Archive'}
                  >
                    <Archive size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-1.5 rounded border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border space-y-4 text-sm ${theme.card}`}
          >
            <div className="flex justify-between items-center border-b border-inherit pb-3">
              <h3 className="font-serif text-2xl">
                {editingId ? 'Edit Product Listing' : 'Add New Product'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Product Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Product Image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Category *</label>
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
                <label className={`block text-xs mb-1 ${theme.muted}`}>Subcategory</label>
                <input
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  placeholder="e.g. Wireless Audio"
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Brand</label>
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Unit *</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                >
                  <option>Piece</option>
                  <option>Set</option>
                  <option>Box</option>
                  <option>Kg</option>
                  <option>Carton</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Standard Price (₹) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>
                  Wholesale Price (₹, Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.wholesalePrice}
                  onChange={(e) => setForm({ ...form, wholesalePrice: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>
                  Minimum Order Qty (MOQ) *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.moq}
                  onChange={(e) => setForm({ ...form, moq: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Available Stock *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Availability</label>
                <select
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                >
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs mb-1 ${theme.muted}`}>Delivery Information</label>
                <input
                  value={form.deliveryInfo}
                  onChange={(e) => setForm({ ...form, deliveryInfo: e.target.value })}
                  placeholder="e.g. Ships in 3–5 business days"
                  className={`w-full p-2.5 rounded border ${theme.input}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Product Description</label>
              <textarea
                rows="2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>

            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Product Specifications</label>
              <textarea
                rows="2"
                value={form.specifications}
                onChange={(e) => setForm({ ...form, specifications: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
              >
                {editingId ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function BusinessEnquiriesSection({
  theme,
  enquiries,
  setEnquiries,
  onOpenConversation,
  onSendEnquiryReply,
  onNotify,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        e.businessName.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.productRequested.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      const matchDate = !dateFilter || e.dateReceived >= dateFilter;
      return matchSearch && matchStatus && matchDate;
    });
  }, [enquiries, search, statusFilter, dateFilter]);

  const handleStatusChange = (id, status) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) => ({ ...prev, status }));
    }
    onNotify('success', `Enquiry ${id} marked as "${status}".`);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!selectedEnquiry || !replyText.trim()) return;
    onSendEnquiryReply(selectedEnquiry, replyText.trim());
    const updated = {
      ...selectedEnquiry,
      status: selectedEnquiry.status === 'New' ? 'Responded' : selectedEnquiry.status,
      responses: [
        ...(selectedEnquiry.responses || []),
        { text: replyText.trim(), date: new Date().toISOString().split('T')[0] },
      ],
    };
    setSelectedEnquiry(updated);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Business Enquiries</h2>
        <p className={`text-xs ${theme.muted}`}>
          Respond to direct sourcing requests from retailers and startups
        </p>
      </div>

      {/* Search & Filters */}
      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-3 ${theme.card}`}>
        <div className="md:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business name, subject, or product..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {['All', 'New', 'Responded', 'In Discussion', 'Converted', 'Closed'].map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All Statuses' : s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
          title="Filter from date"
        />
      </div>

      {/* Enquiries Table */}
      <div className={`rounded-xl border overflow-x-auto ${theme.card}`}>
        <table className="w-full text-left text-sm">
          <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
            <tr>
              <th className="p-4">Business &amp; Contact</th>
              <th className="p-4">Subject &amp; Product</th>
              <th className="p-4">Qty / Budget</th>
              <th className="p-4">Received</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filtered.map((enq) => (
              <tr key={enq.id}>
                <td className="p-4">
                  <p className="font-medium">{enq.businessName}</p>
                  <p className={`text-xs ${theme.muted}`}>
                    {enq.contactPerson} • {enq.businessType}
                  </p>
                </td>
                <td className="p-4">
                  <p className="font-medium">{enq.subject}</p>
                  <p className={`text-xs ${theme.muted}`}>{enq.productRequested}</p>
                </td>
                <td className="p-4 text-xs">
                  <p className="font-semibold">{enq.quantity} units</p>
                  <p className={theme.muted}>{enq.budget || 'Flexible'}</p>
                </td>
                <td className="p-4 text-xs">{enq.dateReceived}</td>
                <td className="p-4">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                    className={`p-1.5 rounded border text-xs ${theme.input}`}
                  >
                    {['New', 'Responded', 'In Discussion', 'Converted', 'Closed'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedEnquiry(enq)}
                    className="px-2.5 py-1.5 rounded border border-inherit hover:border-[#C5A059] text-xs"
                  >
                    <Eye size={13} className="inline mr-1" />
                    Details
                  </button>
                  <button
                    onClick={() => onOpenConversation(enq.conversationId, enq)}
                    className="px-2.5 py-1.5 rounded bg-[#C5A059] text-black text-xs font-semibold"
                  >
                    <MessageSquare size={13} className="inline mr-1" />
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enquiry Details & Quick Response Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border space-y-4 ${theme.card}`}>
            <div className="flex justify-between items-start border-b border-inherit pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold">
                  {selectedEnquiry.id} • {selectedEnquiry.businessType}
                </span>
                <h3 className="font-serif text-2xl mt-0.5">{selectedEnquiry.subject}</h3>
              </div>
              <button onClick={() => setSelectedEnquiry(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Business</span>
                <p className="font-semibold mt-0.5">{selectedEnquiry.businessName}</p>
                <p className={theme.muted}>{selectedEnquiry.contactPerson}</p>
              </div>
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Requirement</span>
                <p className="font-semibold mt-0.5">{selectedEnquiry.quantity} units</p>
                <p className="text-[#C5A059]">Budget: {selectedEnquiry.budget || 'Not specified'}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-inherit text-sm">
              <p className={`text-xs font-semibold uppercase mb-1 ${theme.muted}`}>Buyer Message</p>
              <p>{selectedEnquiry.message}</p>
            </div>

            {selectedEnquiry.responses?.length > 0 && (
              <div className="space-y-2">
                <p className={`text-xs font-semibold uppercase ${theme.muted}`}>Your Responses</p>
                {selectedEnquiry.responses.map((r, i) => (
                  <div key={i} className="p-3 rounded bg-[#C5A059]/15 text-xs">
                    <p>{r.text}</p>
                    <p className={`mt-1 text-[10px] ${theme.muted}`}>{r.date}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleReplySubmit} className="space-y-2 pt-2 border-t border-inherit">
              <textarea
                rows="2"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a response to this enquiry (syncs to Messages)..."
                className={`w-full p-2.5 rounded border text-xs ${theme.input}`}
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    const convId = selectedEnquiry.conversationId;
                    setSelectedEnquiry(null);
                    onOpenConversation(convId, selectedEnquiry);
                  }}
                  className="text-xs text-[#C5A059] hover:underline"
                >
                  Open Full Conversation →
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send size={13} /> Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}