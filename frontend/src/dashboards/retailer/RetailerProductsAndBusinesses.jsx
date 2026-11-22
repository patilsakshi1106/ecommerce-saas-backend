import React, { useState, useMemo } from 'react';
import {
  Search,
  Bookmark,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Send,
  FileText,
  UserPlus,
  Package,
  X,
  Eye,
} from 'lucide-react';
import { RETAILER_CATEGORIES } from '../../data/retailerMockData.js';

export function ExploreProductsSection({
  theme,
  products,
  setProducts,
  supplierFilterId,
  clearSupplierFilter,
  onContactSupplier,
  onSendEnquiryForProduct,
  onViewSupplierProfile,
  onNotify,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [merchantType, setMerchantType] = useState('All');
  const [maxMoq, setMaxMoq] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (supplierFilterId && p.supplierId !== supplierFilterId) return false;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchCat = category === 'All' || p.category === category;
      const matchLoc =
        !location.trim() ||
        p.supplierLocation.toLowerCase().includes(location.trim().toLowerCase());
      const matchType = merchantType === 'All' || p.supplierType === merchantType;
      const matchMoq = !maxMoq || p.moq <= Number(maxMoq);
      const matchPrice = !maxPrice || (p.wholesalePrice || p.price) <= Number(maxPrice);
      return matchSearch && matchCat && matchLoc && matchType && matchMoq && matchPrice;
    });
  }, [products, supplierFilterId, search, category, location, merchantType, maxMoq, maxPrice]);

  const toggleSaveProduct = (prod) => {
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, saved: !p.saved } : p)));
    if (selectedProduct?.id === prod.id) {
      setSelectedProduct((prev) => ({ ...prev, saved: !prev.saved }));
    }
    onNotify('success', prod.saved ? `Removed "${prod.name}" from saved.` : `Saved "${prod.name}" for sourcing.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Explore Supplier Products</h2>
          <p className={`text-xs ${theme.muted}`}>
            Discover B2B wholesale catalogues, review MOQ terms, and request quotations directly from suppliers
          </p>
        </div>
        {supplierFilterId && (
          <button
            onClick={clearSupplierFilter}
            className="px-3 py-1.5 rounded-full border border-[#C5A059] text-[#C5A059] text-xs font-semibold"
          >
            Showing Filtered Supplier • Clear Filter ✕
          </button>
        )}
      </div>

      {/* Multi-Facet Sourcing Filters */}
      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 ${theme.card}`}>
        <div className="lg:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, brand, or subcategory..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          <option value="All">All Categories</option>
          {RETAILER_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={merchantType}
          onChange={(e) => setMerchantType(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {['All', 'Manufacturer', 'Wholesaler', 'Distributor', 'Supplier'].map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? 'All Merchant Types' : t}
            </option>
          ))}
        </select>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Supplier city..."
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Max MOQ"
            value={maxMoq}
            onChange={(e) => setMaxMoq(e.target.value)}
            className={`w-full p-2 rounded-md border text-xs ${theme.input}`}
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={`w-full p-2 rounded-md border text-xs ${theme.input}`}
          />
        </div>
      </div>

      {/* Product Discovery Grid */}
      {filtered.length === 0 ? (
        <div className={`p-12 rounded-xl border text-center text-sm ${theme.card}`}>
          No supplier products match your current sourcing filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl border overflow-hidden flex flex-col justify-between ${theme.card}`}
            >
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => toggleSaveProduct(p)}
                    className={`absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-sm ${
                      p.saved ? 'text-[#C5A059]' : 'text-white'
                    }`}
                    title="Save Product"
                  >
                    <Bookmark size={15} fill={p.saved ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="uppercase tracking-wider text-[#C5A059] font-semibold">
                      {p.category}
                    </span>
                    <span className={theme.muted}>{p.brand}</span>
                  </div>
                  <h3 className="font-serif text-xl font-medium">{p.name}</h3>
                  <p className={`text-xs line-clamp-2 ${theme.muted}`}>{p.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded bg-black/5 dark:bg-white/5">
                      <span className={theme.muted}>Wholesale Rate</span>
                      <p className="font-semibold text-[#C5A059]">
                        ₹{p.wholesalePrice || p.price}/unit
                      </p>
                    </div>
                    <div className="p-2.5 rounded bg-black/5 dark:bg-white/5">
                      <span className={theme.muted}>MOQ / Available</span>
                      <p className="font-semibold">
                        {p.moq}u • {p.availableQty}u
                      </p>
                    </div>
                  </div>
                  <p className={`text-xs flex items-center gap-1 pt-1 ${theme.muted}`}>
                    <MapPin size={12} className="text-[#C5A059]" /> {p.supplierName} • {p.supplierLocation}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-inherit flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProduct(p)}
                  className="px-3 py-2 rounded border border-inherit hover:border-[#C5A059] text-xs font-medium flex items-center gap-1"
                >
                  <Eye size={13} /> Details
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onSendEnquiryForProduct(p, 'Enquiry')}
                    className="px-3 py-2 rounded border border-[#C5A059] text-[#C5A059] text-xs font-semibold hover:bg-[#C5A059] hover:text-black transition"
                  >
                    Send Enquiry
                  </button>
                  <button
                    onClick={() => onSendEnquiryForProduct(p, 'Quotation')}
                    className="px-3 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal (No Cart/Checkout) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border space-y-5 ${theme.card}`}>
            <div className="flex justify-between items-start border-b border-inherit pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold">
                  {selectedProduct.category} • {selectedProduct.subcategory} • {selectedProduct.brand}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium mt-0.5">
                  {selectedProduct.name}
                </h3>
              </div>
              <button onClick={() => setSelectedProduct(null)}>
                <X size={20} />
              </button>
            </div>

            <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-56 object-cover rounded-xl"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Wholesale Price</span>
                <p className="font-semibold text-base text-[#C5A059]">₹{selectedProduct.wholesalePrice}/u</p>
              </div>
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Indicative MRP</span>
                <p className="font-semibold text-base">₹{selectedProduct.price}/u</p>
              </div>
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>MOQ</span>
                <p className="font-semibold text-base">{selectedProduct.moq} units</p>
              </div>
              <div className="p-3 rounded bg-black/5 dark:bg-white/5">
                <span className={theme.muted}>Available Stock</span>
                <p className="font-semibold text-base">{selectedProduct.availableQty} units</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p>{selectedProduct.description}</p>
              <p className="text-xs">
                <strong className="uppercase text-[#C5A059] block">Specifications</strong>
                {selectedProduct.specifications}
              </p>
              <p className="text-xs">
                <strong className="uppercase text-[#C5A059] block">Delivery Information</strong>
                {selectedProduct.deliveryInfo}
              </p>
              <div className="p-3.5 rounded-xl border border-inherit flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold">{selectedProduct.supplierName}</p>
                  <p className={theme.muted}>
                    {selectedProduct.supplierType} • {selectedProduct.supplierLocation}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const supId = selectedProduct.supplierId;
                    setSelectedProduct(null);
                    onViewSupplierProfile(supId);
                  }}
                  className="text-[#C5A059] font-semibold hover:underline"
                >
                  View Supplier Profile →
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-inherit flex flex-wrap justify-end gap-2">
              <button
                onClick={() => toggleSaveProduct(selectedProduct)}
                className="px-3.5 py-2 rounded border text-xs flex items-center gap-1"
              >
                <Bookmark size={13} fill={selectedProduct.saved ? 'currentColor' : 'none'} />
                {selectedProduct.saved ? 'Saved' : 'Save Product'}
              </button>
              <button
                onClick={() => {
                  const p = selectedProduct;
                  setSelectedProduct(null);
                  onContactSupplier(p.supplierId, p.supplierName);
                }}
                className="px-3.5 py-2 rounded border text-xs flex items-center gap-1"
              >
                <MessageSquare size={13} /> Contact Supplier
              </button>
              <button
                onClick={() => {
                  const p = selectedProduct;
                  setSelectedProduct(null);
                  onSendEnquiryForProduct(p, 'Enquiry');
                }}
                className="px-3.5 py-2 rounded border border-[#C5A059] text-[#C5A059] text-xs font-semibold flex items-center gap-1"
              >
                <Send size={13} /> Send Enquiry
              </button>
              <button
                onClick={() => {
                  const p = selectedProduct;
                  setSelectedProduct(null);
                  onSendEnquiryForProduct(p, 'Quotation');
                }}
                className="px-4 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1"
              >
                <FileText size={13} /> Request Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DiscoverBusinessesRetailerSection({
  theme,
  businesses,
  setBusinesses,
  highlightedSupplierId,
  clearHighlightedSupplier,
  onContactBusiness,
  onViewBusinessProducts,
  onNotify,
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewBiz, setViewBiz] = useState(() =>
    highlightedSupplierId ? businesses.find((b) => b.id === highlightedSupplierId) || null : null
  );

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

  const toggleSave = (b) => {
    setBusinesses((prev) => prev.map((x) => (x.id === b.id ? { ...x, saved: !x.saved } : x)));
    onNotify('success', b.saved ? `Removed ${b.name} from saved businesses.` : `Saved ${b.name}.`);
  };

  const toggleConnect = (b) => {
    setBusinesses((prev) =>
      prev.map((x) => (x.id === b.id ? { ...x, connected: !x.connected } : x))
    );
    onNotify('success', b.connected ? `Disconnected from ${b.name}.` : `Connection request sent to ${b.name}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Discover Businesses &amp; Suppliers</h2>
        <p className={`text-xs ${theme.muted}`}>
          Find verified manufacturers, wholesalers, distributors, suppliers, and service providers
        </p>
      </div>

      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 ${theme.card}`}>
        <div className="lg:col-span-2 relative">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search businesses by name or industry..."
            className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${theme.input}`}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`p-2 rounded-md border text-sm ${theme.input}`}
        >
          {['All', 'Manufacturer', 'Wholesaler', 'Distributor', 'Supplier', 'Service Provider', 'Startup'].map(
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
          {RETAILER_CATEGORIES.map((c) => (
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
        {filtered.map((b) => (
          <div key={b.id} className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${theme.card}`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-center font-serif font-bold text-[#C5A059]">
                    {b.logo}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold flex items-center gap-1.5">
                      {b.name}
                      {b.verified && <ShieldCheck size={15} className="text-emerald-500" />}
                    </h3>
                    <p className={`text-xs ${theme.muted}`}>
                      {b.businessType} • {b.industry}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(b)}
                  className={b.saved ? 'text-[#C5A059]' : theme.muted}
                  title="Save Business"
                >
                  <Bookmark size={16} fill={b.saved ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className={`text-xs leading-relaxed ${theme.muted}`}>{b.description}</p>
              <p className={`text-xs flex items-center gap-1 ${theme.muted}`}>
                <MapPin size={13} className="text-[#C5A059]" /> {b.location} • {b.category}
              </p>
            </div>

            <div className="pt-3 border-t border-inherit flex flex-wrap gap-2">
              <button
                onClick={() => setViewBiz(b)}
                className="px-2.5 py-1.5 rounded border border-inherit text-xs"
              >
                Profile
              </button>
              <button
                onClick={() => onViewBusinessProducts(b.id)}
                className="px-2.5 py-1.5 rounded border border-inherit hover:border-[#C5A059] text-xs flex items-center gap-1"
              >
                <Package size={12} /> Products
              </button>
              <button
                onClick={() => toggleConnect(b)}
                className={`px-2.5 py-1.5 rounded border text-xs flex items-center gap-1 ${
                  b.connected
                    ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'border-[#C5A059] text-[#C5A059]'
                }`}
              >
                <UserPlus size={12} /> {b.connected ? 'Connected' : 'Connect'}
              </button>
              <button
                onClick={() => onContactBusiness(b)}
                className="ml-auto px-3 py-1.5 rounded bg-[#C5A059] text-black text-xs font-semibold flex items-center gap-1"
              >
                <MessageSquare size={12} /> Contact
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
              <button
                onClick={() => {
                  setViewBiz(null);
                  clearHighlightedSupplier?.();
                }}
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm">{viewBiz.description}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const id = viewBiz.id;
                  setViewBiz(null);
                  onViewBusinessProducts(id);
                }}
                className="px-4 py-2 rounded border text-xs"
              >
                View Listed Products
              </button>
              <button
                onClick={() => {
                  const target = viewBiz;
                  setViewBiz(null);
                  onContactBusiness(target);
                }}
                className="px-4 py-2 rounded bg-[#C5A059] text-black text-xs font-semibold"
              >
                Contact Supplier →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}