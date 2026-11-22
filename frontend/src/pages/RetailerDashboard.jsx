// ==========================================
// FILE 2: RetailerDashboard.jsx
// ==========================================

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Users,
  PlusCircle,
  ShoppingCart,
  Building2,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  X,
  Share2,
  CheckCircle2,
  Heart,
  Filter, 
} from 'lucide-react';

// DEMO DATA (CLEARLY LABELLED FOR FRONTEND PREVIEW)
const MARKETPLACE_PRODUCTS = [
  {
    id: 'PRD-001',
    name: 'Wireless Headphones',
    merchant: 'Aurelia Acoustic Labs',
    price: 450,
    stock: 1000,
    moq: 500,
    category: 'Electronics',
    groupAvailable: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PRD-002',
    name: 'Handcrafted Tuscan Leather Tote',
    merchant: 'Maison Valmont Leather',
    price: 1850,
    stock: 420,
    moq: 100,
    category: 'Accessories',
    groupAvailable: true,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PRD-003',
    name: 'Minimalist Ceramic Diffuser Set',
    merchant: 'Lumière Botanics',
    price: 620,
    stock: 300,
    moq: 150,
    category: 'Home & Living',
    groupAvailable: true,
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PRD-004',
    name: 'Artisanal Amber Eau de Parfum',
    merchant: 'Atelier de Grasse',
    price: 1200,
    stock: 600,
    moq: 200,
    category: 'Fragrance',
    groupAvailable: false,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80'
  }
];

const INITIAL_DISCOVERY_GROUPS = [
  {
    id: 'GRP-501',
    productId: 'PRD-001',
    productName: 'Wireless Headphones',
    merchant: 'Aurelia Acoustic Labs',
    price: 450,
    requiredQty: 500,
    collectedQty: 350,
    participantsCount: 4,
    deadline: '18 Nov 2026',
    status: 'Collecting Orders',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'GRP-502',
    productId: 'PRD-002',
    productName: 'Handcrafted Tuscan Leather Tote',
    merchant: 'Maison Valmont Leather',
    price: 1850,
    requiredQty: 100,
    collectedQty: 85,
    participantsCount: 3,
    deadline: '12 Nov 2026',
    status: 'Almost Fulfilled',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'GRP-503',
    productId: 'PRD-003',
    productName: 'Minimalist Ceramic Diffuser Set',
    merchant: 'Lumière Botanics',
    price: 620,
    requiredQty: 150,
    collectedQty: 150,
    participantsCount: 5,
    deadline: '08 Nov 2026',
    status: 'Target Reached',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80'
  }
];

export default function RetailerDashboard({
  user,
  onLogout,
  darkMode = false,
  onToggleDark }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceSort, setPriceSort] = useState('default');
  const [groupOrders, setGroupOrders] = useState(INITIAL_DISCOVERY_GROUPS);
  const [myOrders, setMyOrders] = useState([
    {
      id: 'RET-ORD-11',
      type: 'Active Group Orders',
      product: 'Wireless Headphones',
      myQty: 100,
      unitPrice: 450,
      totalCost: 45000,
      status: 'Collecting Orders (350/500 units)'
    },
    {
      id: 'RET-ORD-12',
      type: 'Direct Purchases',
      product: 'Artisanal Amber Eau de Parfum',
      myQty: 200,
      unitPrice: 1200,
      totalCost: 240000,
      status: 'Confirmed'
    }
  ]);

  // Modals & Interactive States
  const [selectedJoinGroup, setSelectedJoinGroup] = useState(null);
  const [joinQty, setJoinQty] = useState('');
  const [joinConfirmed, setJoinConfirmed] = useState(false);

  const [createProductId, setCreateProductId] = useState('PRD-001');
  const [createInitialQty, setCreateInitialQty] = useState(100);
  const [createdShareBanner, setCreatedShareBanner] = useState(null);

  const theme = {
    bg: darkMode ? 'bg-[#0F0F0F] text-[#F5F2EB]' : 'bg-[#FAF8F5] text-[#1C1B18]',
    card: darkMode ? 'bg-[#181818] border-[#2A2925]' : 'bg-white border-[#E6E1D6]',
    sidebar: darkMode ? 'bg-[#141413] border-[#2A2925]' : 'bg-[#F3EFE6] border-[#E6E1D6]',
    muted: darkMode ? 'text-[#9E9A90]' : 'text-[#6E6A61]',
    input: darkMode ? 'bg-[#222220] border-[#33322E] text-[#F5F2EB]' : 'bg-[#FAF8F5] border-[#D8D2C5] text-[#1C1B18]'
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Wholesale Marketplace', icon: Compass },
    { id: 'join-group', label: 'Join a Group Order', icon: Users },
    { id: 'create-group', label: 'Create Group Order', icon: PlusCircle },
    { id: 'my-orders', label: 'My Orders', icon: ShoppingCart },
    { id: 'profile', label: 'Retailer Profile', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const filteredProducts = MARKETPLACE_PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (priceSort === 'low') return a.price - b.price;
    if (priceSort === 'high') return b.price - a.price;
    return 0;
  });

  // Strict Quantity Cap Handler for Joining Group Order
  const handleOpenJoinModal = (group) => {
    const remaining = Math.max(0, group.requiredQty - group.collectedQty);
    setSelectedJoinGroup(group);
    setJoinQty(remaining > 0 ? Math.min(50, remaining) : 0);
    setJoinConfirmed(false);
  };

  const handleQtyChange = (val) => {
    if (!selectedJoinGroup) return;
    const remaining = Math.max(0, selectedJoinGroup.requiredQty - selectedJoinGroup.collectedQty);
    const numeric = Math.max(1, Math.min(Number(val), remaining));
    setJoinQty(numeric);
  };

  const handleConfirmJoinGroup = (e) => {
    e.preventDefault();
    if (!selectedJoinGroup) return;
    const qtyNum = Number(joinQty);
    const updatedGroups = groupOrders.map((g) => {
      if (g.id === selectedJoinGroup.id) {
        const newCollected = g.collectedQty + qtyNum;
        const newStatus =
          newCollected >= g.requiredQty
            ? 'Target Reached'
            : newCollected / g.requiredQty >= 0.8
            ? 'Almost Fulfilled'
            : 'Collecting Orders';
        return {
          ...g,
          collectedQty: newCollected,
          participantsCount: g.participantsCount + 1,
          status: newStatus
        };
      }
      return g;
    });
    setGroupOrders(updatedGroups);
    setMyOrders([
      {
        id: `RET-ORD-${myOrders.length + 15}`,
        type: 'Active Group Orders',
        product: selectedJoinGroup.productName,
        myQty: qtyNum,
        unitPrice: selectedJoinGroup.price,
        totalCost: qtyNum * selectedJoinGroup.price,
        status:
          selectedJoinGroup.collectedQty + qtyNum >= selectedJoinGroup.requiredQty
            ? 'Target Reached (Awaiting Confirmation)'
            : 'Collecting Orders'
      },
      ...myOrders
    ]);
    setJoinConfirmed(true);
  };

  const handleCreateGroupOrder = (e) => {
    e.preventDefault();
    const product = MARKETPLACE_PRODUCTS.find((p) => p.id === createProductId);
    if (!product) return;
    const validQty = Math.max(1, Math.min(Number(createInitialQty), product.moq));
    const newGroup = {
      id: `GRP-50${groupOrders.length + 1}`,
      productId: product.id,
      productName: product.name,
      merchant: product.merchant,
      price: product.price,
      requiredQty: product.moq,
      collectedQty: validQty,
      participantsCount: 1,
      deadline: '28 Nov 2026',
      status: validQty >= product.moq ? 'Target Reached' : 'Collecting Orders',
      image: product.image
    };
    setGroupOrders([newGroup, ...groupOrders]);
    setCreatedShareBanner(newGroup);
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${theme.bg}`}>
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r transition-all duration-300 flex flex-col justify-between shrink-0 ${theme.sidebar}`}>
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-inherit">
            {sidebarOpen ? (
              <div>
                <span className="font-serif text-2xl tracking-[0.25em] font-semibold">MYSON</span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#C5A059]">Retailer Collective</span>
              </div>
            ) : (
              <span className="font-serif text-xl tracking-widest font-bold text-[#C5A059] mx-auto">M</span>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-sm transition-all ${
                    active ? 'bg-[#C5A059] text-black font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-inherit">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm text-red-500 hover:bg-red-500/10 transition">
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVIGATION */}
        <header className={`h-20 border-b px-8 flex items-center justify-between ${theme.card}`}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl tracking-wide">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <span className="text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-[#C5A059]/40 text-[#C5A059] bg-[#C5A059]/10">
                Demo Data Preview
              </span>
            </div>
            <p className={`text-xs ${theme.muted}`}>Vogue Haven Boutique • Wholesale Buyer & Group Pool Member</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDark}
              className={`p-2.5 rounded-md border ${theme.card} hover:border-[#C5A059] transition`}
            >
              {darkMode ? <Sun size={18} className="text-[#C5A059]" /> : <Moon size={18} />}
            </button>
            <button className={`p-2.5 rounded-md border relative ${theme.card}`}>
              <Bell size={18} />
              <span className="w-2 h-2 rounded-full bg-[#C5A059] absolute top-2 right-2" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-inherit">
              <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center font-serif font-semibold text-[#C5A059]">
                VH
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.name || user?.storeName || 'Retailer'}</p>
                <p className={`text-xs mt-1 ${theme.muted}`}>Retail Partner</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 overflow-y-auto">
          {/* A. DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Total Purchases', value: '₹6,45,000' },
                  { label: 'Active Orders', value: '4' },
                  { label: 'Active Group Orders', value: '3 Pools' },
                  { label: 'Completed Orders', value: '28' },
                  { label: 'Saved Products', value: '12 Items' }
                ].map((s, i) => (
                  <div key={i} className={`p-5 rounded-lg border ${theme.card}`}>
                    <p className={`text-xs uppercase tracking-wider ${theme.muted}`}>{s.label}</p>
                    <p className="font-serif text-2xl mt-2 font-semibold text-[#C5A059]">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-lg border ${theme.card}`}>
                <h2 className="font-serif text-lg mb-4">Collaborative Group-Order Live Example</h2>
                <p className={`text-xs mb-4 ${theme.muted}`}>
                  Wireless Headphones — Merchant MOQ: 500 units @ ₹450/unit. Fulfilled collectively by 4 independent retailers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { name: 'Retailer A (You)', units: 100, cost: '₹45,000' },
                    { name: 'Retailer B', units: 150, cost: '₹67,500' },
                    { name: 'Retailer C', units: 100, cost: '₹45,000' },
                    { name: 'Retailer D (Needed/Open)', units: 150, cost: '₹67,500' }
                  ].map((r, i) => (
                    <div key={i} className="p-4 rounded border border-[#C5A059]/30 bg-[#C5A059]/5">
                      <p className="font-medium text-sm">{r.name}</p>
                      <p className="text-xs mt-1">Quantity: {r.units} units</p>
                      <p className="text-xs text-[#C5A059] font-semibold mt-0.5">Individual Cost: {r.cost}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* B. WHOLESALE MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border flex flex-wrap items-center justify-between gap-4 ${theme.card}`}>
                <div className="relative flex-1 min-w-[220px]">
                  <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wholesale products or merchants..."
                    className={`w-full pl-9 pr-4 py-2 text-sm rounded border ${theme.input}`}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={`px-3 py-2 text-sm rounded border ${theme.input}`}
                  >
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Fragrance">Fragrance</option>
                  </select>
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                    className={`px-3 py-2 text-sm rounded border ${theme.input}`}
                  >
                    <option value="default">Sort by: Featured</option>
                    <option value="low">Wholesale Price: Low to High</option>
                    <option value="high">Wholesale Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <div key={p.id} className={`rounded-lg border overflow-hidden flex flex-col justify-between ${theme.card}`}>
                    <div>
                      <div className="h-48 relative">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        {p.groupAvailable && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] uppercase tracking-wider bg-black/80 text-[#C5A059] border border-[#C5A059]/40">
                            Group Order Eligible
                          </span>
                        )}
                      </div>
                      <div className="p-5 space-y-2">
                        <p className={`text-xs ${theme.muted}`}>{p.merchant} • {p.category}</p>
                        <h3 className="font-serif text-lg">{p.name}</h3>
                        <div className="text-xs space-y-1 pt-2">
                          <p className="flex justify-between">
                            <span className={theme.muted}>Wholesale Price:</span>
                            <span className="text-sm font-semibold text-[#C5A059]">₹{p.price}/unit</span>
                          </p>
                          <p className="flex justify-between">
                            <span className={theme.muted}>Available Stock:</span>
                            <span>{p.stock} units</span>
                          </p>
                          <p className="flex justify-between">
                            <span className={theme.muted}>Merchant MOQ:</span>
                            <span className="font-medium">{p.moq} units</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-inherit space-y-2">
                      <button
                        onClick={() => {
                          setMyOrders([
                            {
                              id: `RET-ORD-${myOrders.length + 20}`,
                              type: 'Direct Purchases',
                              product: p.name,
                              myQty: p.moq,
                              unitPrice: p.price,
                              totalCost: p.moq * p.price,
                              status: 'Confirmed'
                            },
                            ...myOrders
                          ]);
                          setActiveTab('my-orders');
                        }}
                        className="w-full py-2 rounded border border-[#C5A059] text-xs font-medium hover:bg-[#C5A059]/10 transition"
                      >
                        Buy in Bulk ({p.moq} MOQ)
                      </button>
                      {p.groupAvailable && (
                        <button
                          onClick={() => setActiveTab('join-group')}
                          className="w-full py-2 rounded bg-[#C5A059] text-black text-xs font-medium hover:opacity-90 transition"
                        >
                          Join or Create Group Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D & F & G. JOIN A GROUP ORDER (DISCOVERY + MODAL) */}
          {activeTab === 'join-group' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl">Join a Group Order</h2>
                <p className={`text-xs ${theme.muted}`}>
                  Combine your order quantity with other verified retailers to unlock wholesale factory pricing.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {groupOrders.map((g) => {
                  const remaining = Math.max(0, g.requiredQty - g.collectedQty);
                  const progress = Math.min(100, Math.round((g.collectedQty / g.requiredQty) * 100));
                  return (
                    <div key={g.id} className={`rounded-lg border overflow-hidden flex flex-col justify-between ${theme.card}`}>
                      <div>
                        <div className="h-44 relative">
                          <img src={g.image} alt={g.productName} className="w-full h-full object-cover" />
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded text-[11px] bg-black/80 text-[#C5A059]">
                            {g.status}
                          </span>
                        </div>
                        <div className="p-5 space-y-3">
                          <div>
                            <p className={`text-xs ${theme.muted}`}>{g.merchant}</p>
                            <h3 className="font-serif text-lg">{g.productName}</h3>
                            <p className="text-sm font-semibold text-[#C5A059] mt-0.5">₹{g.price} / unit</p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-xs p-2.5 rounded bg-black/5 dark:bg-white/5">
                            <div>
                              <span className={`block text-[10px] ${theme.muted}`}>Target</span>
                              <span className="font-semibold">{g.requiredQty}</span>
                            </div>
                            <div>
                              <span className={`block text-[10px] ${theme.muted}`}>Collected</span>
                              <span className="font-semibold text-[#C5A059]">{g.collectedQty}</span>
                            </div>
                            <div>
                              <span className={`block text-[10px] ${theme.muted}`}>Remaining</span>
                              <span className="font-semibold">{remaining}</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress: {progress}%</span>
                              <span>{g.participantsCount} Participating Retailers</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                              <div className="h-full bg-[#C5A059]" style={{ width: `${progress}%` }} />
                            </div>
                            <p className={`text-[11px] mt-2 ${theme.muted}`}>Order Deadline: {g.deadline}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-t border-inherit">
                        <button
                          disabled={remaining === 0}
                          onClick={() => handleOpenJoinModal(g)}
                          className={`w-full py-2.5 rounded text-xs font-medium transition ${
                            remaining === 0
                              ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                              : 'bg-[#C5A059] text-black hover:opacity-90'
                          }`}
                        >
                          {remaining === 0 ? 'Target Reached — Pool Closed' : 'Join Group Order'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* JOIN GROUP ORDER MODAL */}
              {selectedJoinGroup && (
                <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
                  <div className={`w-full max-w-md p-6 rounded-lg border space-y-4 ${theme.card}`}>
                    {!joinConfirmed ? (
                      <form onSubmit={handleConfirmJoinGroup} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-serif text-xl">Join Group Order Pool</h3>
                          <button type="button" onClick={() => setSelectedJoinGroup(null)}>
                            <X size={18} />
                          </button>
                        </div>

                        <div className="p-3 rounded bg-black/5 dark:bg-white/5 text-xs space-y-1">
                          <p className="font-medium text-sm">{selectedJoinGroup.productName}</p>
                          <p>Wholesale Price: ₹{selectedJoinGroup.price}/unit</p>
                          <p className="text-[#C5A059] font-semibold">
                            Available Remaining Quantity Needed:{' '}
                            {selectedJoinGroup.requiredQty - selectedJoinGroup.collectedQty} units
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs mb-1">
                            Enter Your Required Quantity (Max {selectedJoinGroup.requiredQty - selectedJoinGroup.collectedQty} units)
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={selectedJoinGroup.requiredQty - selectedJoinGroup.collectedQty}
                            value={joinQty}
                            onChange={(e) => handleQtyChange(e.target.value)}
                            className={`w-full p-2.5 rounded border text-sm ${theme.input}`}
                          />
                        </div>

                        <div className="p-3 rounded border border-[#C5A059]/30 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Your Estimated Total Cost:</span>
                            <span className="font-serif text-base font-semibold text-[#C5A059]">
                              ₹{(Number(joinQty) * selectedJoinGroup.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Updated Pool Progress:</span>
                            <span>
                              {selectedJoinGroup.collectedQty + Number(joinQty)} / {selectedJoinGroup.requiredQty} units (
                              {Math.round(
                                ((selectedJoinGroup.collectedQty + Number(joinQty)) / selectedJoinGroup.requiredQty) * 100
                              )}
                              %)
                            </span>
                          </div>
                        </div>

                        <button type="submit" className="w-full py-2.5 rounded bg-[#C5A059] text-black font-medium text-sm">
                          Confirm Participation
                        </button>
                      </form>
                    ) : (
                      <div className="text-center space-y-4 py-4">
                        <CheckCircle2 size={44} className="text-[#C5A059] mx-auto" />
                        <h3 className="font-serif text-xl">Group Order Participation Confirmed</h3>
                        <p className={`text-xs ${theme.muted}`}>
                          You have committed {joinQty} units for ₹
                          {(Number(joinQty) * selectedJoinGroup.price).toLocaleString('en-IN')}. Once the target is reached,
                          the merchant will confirm dispatch.
                        </p>
                        <button
                          onClick={() => setSelectedJoinGroup(null)}
                          className="px-6 py-2 rounded bg-[#C5A059] text-black text-xs font-medium"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* E. CREATE GROUP ORDER */}
          {activeTab === 'create-group' && (
            <div className={`max-w-xl p-8 rounded-lg border space-y-6 ${theme.card}`}>
              <div>
                <h2 className="font-serif text-2xl">Start a New Group Order</h2>
                <p className={`text-xs ${theme.muted}`}>
                  Select an eligible merchant product, pledge your required units, and invite fellow retailers.
                </p>
              </div>

              <form onSubmit={handleCreateGroupOrder} className="space-y-4">
                <div>
                  <label className="block text-xs mb-1">Select Eligible Merchant Product</label>
                  <select
                    value={createProductId}
                    onChange={(e) => setCreateProductId(e.target.value)}
                    className={`w-full p-2.5 rounded border text-sm ${theme.input}`}
                  >
                    {MARKETPLACE_PRODUCTS.filter((p) => p.groupAvailable).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — MOQ: {p.moq} units (₹{p.price}/unit)
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const chosen = MARKETPLACE_PRODUCTS.find((p) => p.id === createProductId);
                  return (
                    <>
                      <div className="p-3.5 rounded bg-black/5 dark:bg-white/5 text-xs space-y-1">
                        <p>Merchant Minimum Bulk Quantity: <strong>{chosen.moq} units</strong></p>
                        <p>Unit Wholesale Price: <strong>₹{chosen.price}</strong></p>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Quantity You Personally Require (Units)</label>
                        <input
                          type="number"
                          min={1}
                          max={chosen.moq}
                          value={createInitialQty}
                          onChange={(e) => setCreateInitialQty(e.target.value)}
                          className={`w-full p-2.5 rounded border text-sm ${theme.input}`}
                        />
                      </div>
                      <div className="text-xs flex justify-between">
                        <span>Your Cost Share:</span>
                        <span className="font-semibold text-[#C5A059]">
                          ₹{(createInitialQty * chosen.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </>
                  );
                })()}

                <button type="submit" className="w-full py-3 rounded bg-[#C5A059] text-black font-medium text-sm">
                  Launch Group Order Pool
                </button>
              </form>

              {createdShareBanner && (
                <div className="p-4 rounded border border-[#C5A059] bg-[#C5A059]/10 space-y-2 text-xs">
                  <p className="font-serif text-base font-medium">
                    Pool Created: {createdShareBanner.productName} ({createdShareBanner.id})
                  </p>
                  <p>
                    Progress: {createdShareBanner.collectedQty} / {createdShareBanner.requiredQty} units pledged.
                  </p>
                  <button className="px-3 py-1.5 rounded bg-[#C5A059] text-black font-medium flex items-center gap-1.5">
                    <Share2 size={13} /> Share Group Link with Retailers
                  </button>
                </div>
              )}
            </div>
          )}

          {/* H. MY ORDERS */}
          {activeTab === 'my-orders' && (
            <div className={`p-6 rounded-lg border space-y-4 ${theme.card}`}>
              <h2 className="font-serif text-xl">My Wholesale & Group Orders</h2>
              <table className="w-full text-left text-sm">
                <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
                  <tr>
                    <th className="py-3">Order Reference</th>
                    <th className="py-3">Order Type</th>
                    <th className="py-3">Product</th>
                    <th className="py-3">My Requested Quantity</th>
                    <th className="py-3">My Cost</th>
                    <th className="py-3">Workflow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {myOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-3.5 font-medium">{o.id}</td>
                      <td className="py-3.5">{o.type}</td>
                      <td className="py-3.5">{o.product}</td>
                      <td className="py-3.5">{o.myQty} units</td>
                      <td className="py-3.5 text-[#C5A059] font-medium">₹{o.totalCost.toLocaleString('en-IN')}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded text-xs border border-[#C5A059]/40 text-[#C5A059]">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* I. RETAILER PROFILE */}
          {(activeTab === 'profile' || activeTab === 'settings' || activeTab === 'help') && (
            <div className={`p-8 rounded-lg border max-w-2xl space-y-4 ${theme.card}`}>
              <h2 className="font-serif text-2xl">Retailer Boutique Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className={`block text-xs mb-1 ${theme.muted}`}>Shop Name</label>
                  <input defaultValue="Vogue Haven Lifestyle Store" className={`w-full p-2.5 rounded border ${theme.input}`} />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${theme.muted}`}>GST Details</label>
                  <input defaultValue="27AADCV2219M1Z2" className={`w-full p-2.5 rounded border ${theme.input}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs mb-1 ${theme.muted}`}>Shop Address & Contact</label>
                  <input
                    defaultValue="Boutique 8, Linking Road, Bandra West, Mumbai • +91 98192 33012"
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  />
                </div>
              </div>
              <button className="px-5 py-2.5 rounded bg-[#C5A059] text-black font-medium text-sm">
                Save Retailer Settings
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}