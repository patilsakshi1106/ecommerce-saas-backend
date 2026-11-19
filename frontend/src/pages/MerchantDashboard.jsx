// ==========================================
// FILE 1: MerchantDashboard.jsx
// ==========================================

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Boxes,
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
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

// DEMO DATA (CLEARLY LABELLED FOR FRONTEND PREVIEW)
const DEMO_PRODUCTS = [
  {
    id: 'PRD-001',
    name: 'Wireless Headphones',
    category: 'Electronics & Audio',
    price: 450,
    stock: 1000,
    reserved: 350,
    moq: 500,
    available: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PRD-002',
    name: 'Handcrafted Tuscan Leather Tote',
    category: 'Luxury Accessories',
    price: 1850,
    stock: 420,
    reserved: 180,
    moq: 100,
    available: true,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PRD-003',
    name: 'Minimalist Ceramic Diffuser Set',
    category: 'Home & Living',
    price: 620,
    stock: 85,
    reserved: 40,
    moq: 150,
    available: true,
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PRD-004',
    name: 'Brushed Brass Espresso Tamper',
    category: 'Kitchen & Dining',
    price: 380,
    stock: 45,
    reserved: 15,
    moq: 100,
    available: false,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
  }
];

const DEMO_GROUP_ORDERS = [
  {
    id: 'GRP-101',
    productName: 'Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    requiredQty: 500,
    collectedQty: 350,
    status: 'Collecting Orders',
    participants: [
      { id: 'R1', name: 'Retailer A (Vogue Haven)', qty: 100 },
      { id: 'R2', name: 'Retailer B (Sonic Curations)', qty: 150 },
      { id: 'R3', name: 'Retailer C (Urban Loft)', qty: 50 },
      { id: 'R4', name: 'Retailer D (Apex Audio)', qty: 50 }
    ]
  },
  {
    id: 'GRP-102',
    productName: 'Handcrafted Tuscan Leather Tote',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    requiredQty: 100,
    collectedQty: 100,
    status: 'Target Reached',
    participants: [
      { id: 'R5', name: 'Milan Boutique', qty: 40 },
      { id: 'R6', name: 'Luxe Collective', qty: 60 }
    ]
  },
  {
    id: 'GRP-103',
    productName: 'Minimalist Ceramic Diffuser Set',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80',
    requiredQty: 150,
    collectedQty: 150,
    status: 'Confirmed',
    participants: [
      { id: 'R7', name: 'Aura Home Decor', qty: 75 },
      { id: 'R8', name: 'Zenith Living', qty: 75 }
    ]
  }
];

const DEMO_ORDERS = [
  { id: 'ORD-901', product: 'Wireless Headphones', retailer: 'Vogue Haven', qty: 500, total: 225000, date: '2026-11-01', status: 'New Orders' },
  { id: 'ORD-902', product: 'Handcrafted Tuscan Leather Tote', retailer: 'Milan Boutique (Group)', qty: 100, total: 185000, date: '2026-10-29', status: 'Confirmed Orders' },
  { id: 'ORD-903', product: 'Minimalist Ceramic Diffuser Set', retailer: 'Aura Home Decor', qty: 150, total: 93000, date: '2026-10-25', status: 'Processing' },
  { id: 'ORD-904', product: 'Wireless Headphones', retailer: 'Sonic Curations', qty: 600, total: 270000, date: '2026-10-18', status: 'Shipped' },
  { id: 'ORD-905', product: 'Handcrafted Tuscan Leather Tote', retailer: 'Luxe Collective', qty: 120, total: 222000, date: '2026-10-10', status: 'Delivered' },
  { id: 'ORD-906', product: 'Brushed Brass Espresso Tamper', retailer: 'Roast & Co.', qty: 100, total: 38000, date: '2026-10-05', status: 'Cancelled' }
];

export default function MerchantDashboard({
  user,
  onLogout,
  darkMode = false,
  onToggleDark}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [groupOrders, setGroupOrders] = useState(DEMO_GROUP_ORDERS);
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [selectedGroupOrder, setSelectedGroupOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics & Audio',
    price: '',
    stock: '',
    moq: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
  });

  const theme = {
    bg: darkMode ? 'bg-[#0F0F0F] text-[#F5F2EB]' : 'bg-[#FAF8F5] text-[#1C1B18]',
    card: darkMode ? 'bg-[#181818] border-[#2A2925]' : 'bg-white border-[#E6E1D6]',
    sidebar: darkMode ? 'bg-[#141413] border-[#2A2925]' : 'bg-[#F3EFE6] border-[#E6E1D6]',
    muted: darkMode ? 'text-[#9E9A90]' : 'text-[#6E6A61]',
    input: darkMode ? 'bg-[#222220] border-[#33322E] text-[#F5F2EB]' : 'bg-[#FAF8F5] border-[#D8D2C5] text-[#1C1B18]'
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const created = {
      id: `PRD-00${products.length + 1}`,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      reserved: 0,
      moq: Number(newProduct.moq),
      available: true,
      image: newProduct.image
    };
    setProducts([created, ...products]);
    setShowAddModal(false);
    setNewProduct({ name: '', category: 'Electronics & Audio', price: '', stock: '', moq: '', image: newProduct.image });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateGroupStatus = (id, status) => {
    setGroupOrders(groupOrders.map((g) => (g.id === id ? { ...g, status } : g)));
    if (selectedGroupOrder?.id === id) {
      setSelectedGroupOrder({ ...selectedGroupOrder, status });
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'group-orders', label: 'Group Orders', icon: Users },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'profile', label: 'Business Profile', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${theme.bg}`}>
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r transition-all duration-300 flex flex-col justify-between shrink-0 ${theme.sidebar}`}>
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-inherit">
            {sidebarOpen ? (
              <div>
                <span className="font-serif text-2xl tracking-[0.25em] font-semibold">MYSON</span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#C5A059]">Merchant Atelier</span>
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
                    active
                      ? 'bg-[#C5A059] text-black font-medium shadow-sm'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
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
              <h1 className="font-serif text-2xl tracking-wide capitalize">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <span className="text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-[#C5A059]/40 text-[#C5A059] bg-[#C5A059]/10">
                Demo Data Preview
              </span>
            </div>
            <p className={`text-xs ${theme.muted}`}>Aurelia Acoustic Labs • Wholesale Supplier Portal</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
              <input
                type="text"
                placeholder="Search catalogue, orders..."
                className={`pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:border-[#C5A059] ${theme.input}`}
              />
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-md border ${theme.card} hover:border-[#C5A059] transition`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={18} className="text-[#C5A059]" /> : <Moon size={18} />}
            </button>

            <button className={`p-2.5 rounded-md border relative ${theme.card}`}>
              <Bell size={18} />
              <span className="w-2 h-2 rounded-full bg-[#C5A059] absolute top-2 right-2" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-inherit">
              <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center font-serif font-semibold text-[#C5A059]">
                AA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-none">{user?.name || user?.storeName || 'Merchant'}</p>
                <p className={`text-xs mt-1 ${theme.muted}`}>Verified Merchant</p>
              </div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <main className="p-8 space-y-8 overflow-y-auto">
          {/* A. DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Products Listed', value: products.length },
                  { label: 'Available Stock', value: '1,550 Units' },
                  { label: 'Total Orders', value: '148' },
                  { label: 'Pending Orders', value: '19' },
                  { label: 'Completed Orders', value: '124' },
                  { label: 'Total Sales', value: '₹42,85,000' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-5 rounded-lg border ${theme.card}`}>
                    <p className={`text-xs uppercase tracking-wider ${theme.muted}`}>{stat.label}</p>
                    <p className="font-serif text-2xl mt-2 font-semibold text-[#C5A059]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Overview Chart */}
                <div className={`lg:col-span-2 p-6 rounded-lg border ${theme.card}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-serif text-lg">Wholesale Revenue Overview</h2>
                      <p className={`text-xs ${theme.muted}`}>Monthly bulk order volume (Demo Visual)</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <TrendingUp size={14} /> +18.4% vs last quarter
                    </span>
                  </div>
                  <div className="h-56 flex items-end gap-4 pt-6 px-2 border-b border-inherit">
                    {[
                      { month: 'Jun', val: 45, amt: '₹5.2L' },
                      { month: 'Jul', val: 62, amt: '₹6.8L' },
                      { month: 'Aug', val: 55, amt: '₹6.1L' },
                      { month: 'Sep', val: 78, amt: '₹8.4L' },
                      { month: 'Oct', val: 92, amt: '₹9.9L' },
                      { month: 'Nov', val: 68, amt: '₹7.4L' }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[11px] opacity-0 group-hover:opacity-100 transition">{bar.amt}</span>
                        <div
                          style={{ height: `${bar.val}%` }}
                          className="w-full max-w-[44px] bg-[#C5A059]/80 hover:bg-[#C5A059] rounded-t transition-all"
                        />
                        <span className={`text-xs pb-2 ${theme.muted}`}>{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low-stock notifications & Recent Activity */}
                <div className={`p-6 rounded-lg border space-y-6 ${theme.card}`}>
                  <div>
                    <h2 className="font-serif text-lg flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-500" /> Low-Stock Notifications
                    </h2>
                    <div className="mt-3 space-y-3">
                      {products.filter((p) => p.stock < 100).map((item) => (
                        <div key={item.id} className="p-3 rounded border border-amber-500/30 bg-amber-500/5 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className={`text-xs ${theme.muted}`}>MOQ: {item.moq} units</p>
                          </div>
                          <span className="text-xs font-semibold text-amber-500">{item.stock} left</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-inherit">
                    <h3 className="font-serif text-base mb-3">Recent Activity</h3>
                    <ul className="space-y-2.5 text-xs">
                      <li className="flex justify-between">
                        <span>Retailer D joined Wireless Headphones Group</span>
                        <span className={theme.muted}>2h ago</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Tuscan Leather Tote reached 100% target</span>
                        <span className={theme.muted}>5h ago</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Bulk dispatch #ORD-904 marked Shipped</span>
                        <span className={theme.muted}>1d ago</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className={`p-6 rounded-lg border ${theme.card}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-lg">Recent Bulk Orders</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#C5A059] hover:underline flex items-center gap-1">
                    View All Orders <ChevronRight size={14} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
                      <tr>
                        <th className="py-3">Order ID</th>
                        <th className="py-3">Product</th>
                        <th className="py-3">Retailer</th>
                        <th className="py-3">Quantity</th>
                        <th className="py-3">Amount</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {orders.slice(0, 4).map((o) => (
                        <tr key={o.id}>
                          <td className="py-3.5 font-medium">{o.id}</td>
                          <td className="py-3.5">{o.product}</td>
                          <td className="py-3.5">{o.retailer}</td>
                          <td className="py-3.5">{o.qty} units</td>
                          <td className="py-3.5">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-xs border border-[#C5A059]/40 text-[#C5A059]">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* B. PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl">Wholesale Product Catalogue</h2>
                  <p className={`text-xs ${theme.muted}`}>Manage minimum order quantities (MOQ), bulk pricing and stock</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 rounded-md bg-[#C5A059] text-black font-medium text-sm flex items-center gap-2 hover:opacity-90 transition"
                >
                  <PlusCircle size={16} /> Add New Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className={`rounded-lg border overflow-hidden flex flex-col justify-between ${theme.card}`}>
                    <div>
                      <div className="h-48 overflow-hidden relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <span
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[11px] font-medium ${
                            product.available ? 'bg-emerald-900/90 text-emerald-200' : 'bg-red-900/90 text-red-200'
                          }`}
                        >
                          {product.available ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <p className={`text-xs uppercase tracking-wider ${theme.muted}`}>{product.category}</p>
                        <h3 className="font-serif text-lg font-medium">{product.name}</h3>
                        <div className="pt-2 space-y-1 text-sm">
                          <p className="flex justify-between">
                            <span className={theme.muted}>Wholesale Price:</span>
                            <span className="font-semibold text-[#C5A059]">₹{product.price}/unit</span>
                          </p>
                          <p className="flex justify-between">
                            <span className={theme.muted}>Available Stock:</span>
                            <span>{product.stock.toLocaleString()} units</span>
                          </p>
                          <p className="flex justify-between">
                            <span className={theme.muted}>Minimum Bulk Order:</span>
                            <span>{product.moq} units</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-inherit flex items-center justify-end gap-2">
                      <button className="p-2 rounded border border-inherit hover:border-[#C5A059] text-xs flex items-center gap-1">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 rounded border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showAddModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                  <form onSubmit={handleAddProduct} className={`w-full max-w-md p-6 rounded-lg border space-y-4 ${theme.card}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-xl">Add Wholesale Product</h3>
                      <button type="button" onClick={() => setShowAddModal(false)}>
                        <X size={18} />
                      </button>
                    </div>
                    <input
                      required
                      placeholder="Product Name (e.g., Wireless Headphones)"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className={`w-full p-2.5 rounded border text-sm ${theme.input}`}
                    />
                    <input
                      required
                      type="number"
                      placeholder="Wholesale Price per unit (₹)"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className={`w-full p-2.5 rounded border text-sm ${theme.input}`}
                    />
                    <input
                      required
                      type="number"
                      placeholder="Available Stock (units)"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className={`w-full p-2.5 rounded border text-sm ${theme.input}`}
                    />
                    <input
                      required
                      type="number"
                      placeholder="Minimum Order Quantity (MOQ)"
                      value={newProduct.moq}
                      onChange={(e) => setNewProduct({ ...newProduct, moq: e.target.value })}
                      className={`w-full p-2.5 rounded border text-sm ${theme.input}`}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded border text-sm">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 rounded bg-[#C5A059] text-black font-medium text-sm">
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* C. GROUP ORDER MANAGEMENT */}
          {activeTab === 'group-orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl">Retailer Group Order Pooling</h2>
                <p className={`text-xs ${theme.muted}`}>
                  Monitor collective bulk orders created by retailers to meet your Minimum Order Quantity
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {groupOrders.map((group) => {
                  const remaining = Math.max(0, group.requiredQty - group.collectedQty);
                  const pct = Math.min(100, Math.round((group.collectedQty / group.requiredQty) * 100));
                  return (
                    <div key={group.id} className={`rounded-lg border p-5 space-y-4 ${theme.card}`}>
                      <div className="flex items-center gap-4">
                        <img src={group.image} alt={group.productName} className="w-16 h-16 rounded object-cover" />
                        <div>
                          <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059]">
                            {group.status}
                          </span>
                          <h3 className="font-serif text-base mt-1">{group.productName}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                        <div className="p-2.5 rounded bg-black/5 dark:bg-white/5">
                          <span className={theme.muted}>Required Quantity:</span>
                          <p className="font-semibold text-sm mt-0.5">{group.requiredQty} units</p>
                        </div>
                        <div className="p-2.5 rounded bg-black/5 dark:bg-white/5">
                          <span className={theme.muted}>Collected:</span>
                          <p className="font-semibold text-sm mt-0.5 text-[#C5A059]">{group.collectedQty} units</p>
                        </div>
                        <div className="p-2.5 rounded bg-black/5 dark:bg-white/5">
                          <span className={theme.muted}>Remaining:</span>
                          <p className="font-semibold text-sm mt-0.5">{remaining} units</p>
                        </div>
                        <div className="p-2.5 rounded bg-black/5 dark:bg-white/5">
                          <span className={theme.muted}>Participants:</span>
                          <p className="font-semibold text-sm mt-0.5">{group.participants.length} retailers</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Group Progress</span>
                          <span className="font-semibold">{pct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div className="h-full bg-[#C5A059]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <select
                          value={group.status}
                          onChange={(e) => updateGroupStatus(group.id, e.target.value)}
                          className={`text-xs p-2 rounded border ${theme.input}`}
                        >
                          <option>Collecting Orders</option>
                          <option>Target Reached</option>
                          <option>Awaiting Confirmation</option>
                          <option>Confirmed</option>
                          <option>Processing</option>
                          <option>Completed</option>
                        </select>

                        <button
                          onClick={() => setSelectedGroupOrder(group)}
                          className="text-xs px-3 py-2 rounded border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition flex items-center gap-1"
                        >
                          <Eye size={14} /> View Retailers
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedGroupOrder && (
                <div className={`p-6 rounded-lg border ${theme.card}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-serif text-lg">
                        Participating Retailers — {selectedGroupOrder.productName} ({selectedGroupOrder.id})
                      </h3>
                      <p className={`text-xs ${theme.muted}`}>Status: {selectedGroupOrder.status}</p>
                    </div>
                    <button onClick={() => setSelectedGroupOrder(null)} className="text-xs underline">
                      Close Breakdown
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedGroupOrder.participants.map((p) => (
                      <div key={p.id} className="p-4 rounded border border-inherit">
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-[#C5A059] mt-1">Requested: {p.qty} units</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* D. ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {['All', 'New Orders', 'Confirmed Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3.5 py-2 rounded-md text-xs font-medium border transition ${
                      orderFilter === st ? 'bg-[#C5A059] text-black border-[#C5A059]' : theme.card
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className={`p-6 rounded-lg border ${theme.card}`}>
                <table className="w-full text-left text-sm">
                  <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
                    <tr>
                      <th className="py-3">Order ID</th>
                      <th className="py-3">Product Info</th>
                      <th className="py-3">Retailer</th>
                      <th className="py-3">Quantity</th>
                      <th className="py-3">Total Value</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit">
                    {orders
                      .filter((o) => orderFilter === 'All' || o.status === orderFilter)
                      .map((o) => (
                        <tr key={o.id}>
                          <td className="py-3.5 font-medium">{o.id}</td>
                          <td className="py-3.5">{o.product}</td>
                          <td className="py-3.5">{o.retailer}</td>
                          <td className="py-3.5">{o.qty} units</td>
                          <td className="py-3.5">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="py-3.5">{o.date}</td>
                          <td className="py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-xs border border-[#C5A059]/50 text-[#C5A059]">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* E. INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className={`p-5 rounded-lg border ${theme.card}`}>
                  <p className={`text-xs uppercase ${theme.muted}`}>Total Inventory</p>
                  <p className="font-serif text-2xl mt-1 text-[#C5A059]">2,135 Units</p>
                </div>
                <div className={`p-5 rounded-lg border ${theme.card}`}>
                  <p className={`text-xs uppercase ${theme.muted}`}>Available Stock</p>
                  <p className="font-serif text-2xl mt-1">1,550 Units</p>
                </div>
                <div className={`p-5 rounded-lg border ${theme.card}`}>
                  <p className={`text-xs uppercase ${theme.muted}`}>Reserved Stock (Group/Bulk)</p>
                  <p className="font-serif text-2xl mt-1">585 Units</p>
                </div>
                <div className={`p-5 rounded-lg border ${theme.card}`}>
                  <p className={`text-xs uppercase ${theme.muted}`}>Low-Stock Products</p>
                  <p className="font-serif text-2xl mt-1 text-amber-500">2 Items</p>
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${theme.card}`}>
                <h3 className="font-serif text-lg mb-4">Inventory Status Matrix</h3>
                <table className="w-full text-left text-sm">
                  <thead className={`text-xs uppercase border-b border-inherit ${theme.muted}`}>
                    <tr>
                      <th className="py-3">SKU</th>
                      <th className="py-3">Product</th>
                      <th className="py-3">Available</th>
                      <th className="py-3">Reserved</th>
                      <th className="py-3">MOQ</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3.5">{p.id}</td>
                        <td className="py-3.5 font-medium">{p.name}</td>
                        <td className="py-3.5">{p.stock} units</td>
                        <td className="py-3.5">{p.reserved} units</td>
                        <td className="py-3.5">{p.moq} units</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded text-xs ${
                              p.stock < 100 ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                            }`}
                          >
                            {p.stock < 100 ? 'Low Stock Replenish' : 'Optimal Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* F. BUSINESS PROFILE & SETTINGS */}
          {(activeTab === 'profile' || activeTab === 'settings' || activeTab === 'help') && (
            <div className={`p-8 rounded-lg border max-w-3xl space-y-6 ${theme.card}`}>
              <h2 className="font-serif text-2xl">Merchant Business Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className={`block text-xs mb-1 ${theme.muted}`}>Business Name</label>
                  <input defaultValue="Aurelia Acoustic Labs Pvt. Ltd." className={`w-full p-2.5 rounded border ${theme.input}`} />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${theme.muted}`}>Merchant Representative</label>
                  <input defaultValue="Vikramaditya Sen" className={`w-full p-2.5 rounded border ${theme.input}`} />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${theme.muted}`}>GST Identification Number (GSTIN)</label>
                  <input defaultValue="27AABCA8921K1Z5" className={`w-full p-2.5 rounded border ${theme.input}`} />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${theme.muted}`}>Contact Details</label>
                  <input defaultValue="+91 98201 44510 • wholesale@aurelia.in" className={`w-full p-2.5 rounded border ${theme.input}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs mb-1 ${theme.muted}`}>Registered Business Address</label>
                  <input
                    defaultValue="Plot 14, Luxury Industrial Estate, Lower Parel, Mumbai, Maharashtra 400013"
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  />
                </div>
              </div>
              <button className="px-6 py-2.5 rounded bg-[#C5A059] text-black font-medium text-sm">
                Update Merchant Profile
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}