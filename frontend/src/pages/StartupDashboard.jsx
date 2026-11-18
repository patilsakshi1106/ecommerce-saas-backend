// ==========================================
// FILE 3: StartupDashboard.jsx
// ==========================================

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  PlusCircle,
  Eye,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

// INITIAL BEGINNER CHECKLIST STEPS
const INITIAL_CHECKLIST = [
  {
    id: 1,
    title: 'Complete Your Business Profile',
    desc: 'Add your basic contact details so customers know who you are.',
    done: true
  },
  {
    id: 2,
    title: 'Set Up Your Store',
    desc: 'Choose a welcoming store name and write a short introduction.',
    done: true
  },
  {
    id: 3,
    title: 'Add Your First Product',
    desc: 'List an item with a clear name, price and available stock.',
    done: true
  },
  {
    id: 4,
    title: 'Upload Product Images',
    desc: 'Bright, clean photos help shoppers trust your new store.',
    done: false
  },
  {
    id: 5,
    title: 'Preview Your Store',
    desc: 'Check how your online storefront looks to everyday buyers.',
    done: false
  },
  {
    id: 6,
    title: 'Publish Your Products',
    desc: 'Make your store live on MYSON and start receiving orders.',
    done: false
  }
];

export default function StartupDashboard({
  user,
  onLogout,
  darkMode = false,
  onToggleDark
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('welcome');
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  // Store Setup State
  const [storeInfo, setStoreInfo] = useState({
    name: 'Studio Élan Crafts',
    description: 'Hand-poured botanical soy candles and artisanal home accents crafted in small batches.',
    category: 'Home & Living',
    contact: 'hello@studioelan.in • +91 97650 11200',
    status: 'Live & Ready'
  });

  // Beginner Products State
  const [products, setProducts] = useState([
    {
      id: 'ST-1',
      name: 'Lavender & Cedarwood Soy Candle',
      description: 'Hand-poured in a reusable ceramic vessel with 40 hours burn time.',
      category: 'Home & Living',
      price: 750,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const [newProd, setNewProd] = useState({
    name: '',
    description: '',
    category: 'Home & Living',
    price: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
  });

  const theme = {
    bg: darkMode ? 'bg-[#0F0F0F] text-[#F5F2EB]' : 'bg-[#FAF8F5] text-[#1C1B18]',
    card: darkMode ? 'bg-[#181818] border-[#2A2925]' : 'bg-white border-[#E6E1D6]',
    sidebar: darkMode ? 'bg-[#141413] border-[#2A2925]' : 'bg-[#F3EFE6] border-[#E6E1D6]',
    muted: darkMode ? 'text-[#9E9A90]' : 'text-[#6E6A61]',
    input: darkMode ? 'bg-[#222220] border-[#33322E] text-[#F5F2EB]' : 'bg-[#FAF8F5] border-[#D8D2C5] text-[#1C1B18]'
  };

  const completedCount = checklist.filter((c) => c.done).length;

  const toggleStep = (id) => {
    setChecklist(checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const handleAddSimpleProduct = (e) => {
    e.preventDefault();
    setProducts([
      ...products,
      {
        id: `ST-${products.length + 1}`,
        name: newProd.name,
        description: newProd.description,
        category: newProd.category,
        price: Number(newProd.price),
        stock: Number(newProd.stock),
        image: newProd.image
      }
    ]);
    setNewProd({
      name: '',
      description: '',
      category: 'Home & Living',
      price: '',
      stock: '',
      image: newProd.image
    });
    setActiveTab('my-store');
  };

  const navItems = [
    { id: 'welcome', label: 'Dashboard & Checklist', icon: LayoutDashboard },
    { id: 'store-setup', label: 'Store Setup', icon: Store },
    { id: 'add-product', label: 'Add Products', icon: PlusCircle },
    { id: 'my-store', label: 'My Store Preview', icon: Eye },
    { id: 'learning', label: 'Learning Centre', icon: BookOpen },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
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
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#C5A059]">Startup Launchpad</span>
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
            <h1 className="font-serif text-2xl tracking-wide">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className={`text-xs ${theme.muted}`}>Beginner-Friendly Seller Workspace</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDark}
              className={`p-2.5 rounded-md border ${theme.card} hover:border-[#C5A059] transition`}
            >
              {darkMode ? <Sun size={18} className="text-[#C5A059]" /> : <Moon size={18} />}
            </button>
            <button className={`p-2.5 rounded-md border ${theme.card}`}>
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-inherit">
              <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center font-serif font-semibold text-[#C5A059]">
                SE
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.storeName || user?.name || storeInfo.name}</p>
                <p className={`text-xs mt-1 ${theme.muted}`}>New Creator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 max-w-5xl">
          {/* A, B & F. WELCOME SCREEN, CHECKLIST & 4 SIMPLE STATS */}
          {activeTab === 'welcome' && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className={`p-8 rounded-lg border border-[#C5A059]/40 ${theme.card}`}>
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C5A059] mb-2">
                  <Sparkles size={14} /> Founder Onboarding
                </span>
                <h2 className="font-serif text-3xl">Welcome to MYSON!</h2>
                <p className="text-base mt-1">
                  Your journey as an online seller starts here. Let's get your business ready.
                </p>
                <p className={`text-xs mt-3 max-w-2xl leading-relaxed ${theme.muted}`}>
                  Selling online is simple: set up your store name, upload photos and prices of your products, preview how
                  your shop looks, and publish when you feel ready. No technical knowledge needed.
                </p>
              </div>

              {/* F. Basic Performance Overview (Strictly 4 Simple Statistics) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Products Listed', value: products.length, help: 'Items currently in your catalogue' },
                  { label: 'Total Orders', value: '3', help: 'Customer orders received so far' },
                  { label: 'Products Sold', value: '5', help: 'Total individual items delivered' },
                  { label: 'Store Status', value: storeInfo.status, help: 'Your shop visibility to buyers' }
                ].map((stat, i) => (
                  <div key={i} className={`p-5 rounded-lg border ${theme.card}`}>
                    <p className={`text-xs uppercase ${theme.muted}`}>{stat.label}</p>
                    <p className="font-serif text-2xl font-semibold text-[#C5A059] mt-1">{stat.value}</p>
                    <p className={`text-[11px] mt-1 ${theme.muted}`}>{stat.help}</p>
                  </div>
                ))}
              </div>

              {/* B. Getting Started Checklist */}
              <div className={`p-6 rounded-lg border space-y-5 ${theme.card}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl">Getting Started Checklist</h3>
                    <p className={`text-xs ${theme.muted}`}>Click any step to mark it complete as you build your store</p>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059]">
                    {completedCount} out of {checklist.length} steps completed
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#C5A059] transition-all duration-300"
                    style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {checklist.map((step) => (
                    <div
                      key={step.id}
                      onClick={() => toggleStep(step.id)}
                      className={`p-4 rounded-lg border flex items-start gap-3.5 cursor-pointer transition ${
                        step.done ? 'border-[#C5A059]/50 bg-[#C5A059]/5' : 'border-inherit hover:border-[#C5A059]/40'
                      }`}
                    >
                      <CheckCircle2
                        size={20}
                        className={`mt-0.5 shrink-0 ${step.done ? 'text-[#C5A059]' : 'text-gray-400'}`}
                      />
                      <div>
                        <p className={`text-sm font-medium ${step.done ? 'line-through opacity-75' : ''}`}>
                          {step.title}
                        </p>
                        <p className={`text-xs mt-0.5 ${theme.muted}`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* C. STORE SETUP */}
          {activeTab === 'store-setup' && (
            <div className={`p-8 rounded-lg border space-y-5 max-w-2xl ${theme.card}`}>
              <div>
                <h2 className="font-serif text-2xl">Set Up Your Store</h2>
                <p className={`text-xs ${theme.muted}`}>
                  Tell shoppers what makes your brand special. You can update these details anytime.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-medium mb-1">Enter Store Name</label>
                  <input
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Add Store Description</label>
                  <textarea
                    rows={3}
                    value={storeInfo.description}
                    onChange={(e) => setStoreInfo({ ...storeInfo, description: e.target.value })}
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Upload Store Logo (Image URL)</label>
                  <input
                    type="text"
                    placeholder="Paste logo image link or upload..."
                    defaultValue="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80"
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Select Product Category</label>
                  <select
                    value={storeInfo.category}
                    onChange={(e) => setStoreInfo({ ...storeInfo, category: e.target.value })}
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  >
                    <option>Home & Living</option>
                    <option>Fashion & Apparel</option>
                    <option>Beauty & Wellness</option>
                    <option>Handmade & Craft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Add Contact Details</label>
                  <input
                    value={storeInfo.contact}
                    onChange={(e) => setStoreInfo({ ...storeInfo, contact: e.target.value })}
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  />
                </div>
                <button
                  onClick={() => setActiveTab('my-store')}
                  className="px-6 py-2.5 rounded bg-[#C5A059] text-black font-medium text-sm"
                >
                  Save & Preview Store
                </button>
              </div>
            </div>
          )}

          {/* D. ADD PRODUCTS */}
          {activeTab === 'add-product' && (
            <form onSubmit={handleAddSimpleProduct} className={`p-8 rounded-lg border space-y-5 max-w-2xl ${theme.card}`}>
              <div>
                <h2 className="font-serif text-2xl">Add a Product to Your Store</h2>
                <p className={`text-xs ${theme.muted}`}>
                  Fill in the simple details below to list an item for shoppers.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-medium mb-1">Product Name</label>
                  <input
                    required
                    placeholder="e.g., Handwoven Linen Table Runner"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  />
                  <span className={`text-[11px] ${theme.muted}`}>Use a clear title shoppers can easily search for.</span>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Product Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the material, size, and care instructions..."
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className={`w-full p-2.5 rounded border ${theme.input}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Selling Price (₹)</label>
                    <input
                      required
                      type="number"
                      placeholder="e.g., 750"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className={`w-full p-2.5 rounded border ${theme.input}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Available Stock</label>
                    <input
                      required
                      type="number"
                      placeholder="How many items do you have ready?"
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                      className={`w-full p-2.5 rounded border ${theme.input}`}
                    />
                  </div>
                </div>

                <button type="submit" className="px-6 py-2.5 rounded bg-[#C5A059] text-black font-medium text-sm">
                  Publish Product to My Store
                </button>
              </div>
            </form>
          )}

          {/* E. MY STORE PREVIEW */}
          {activeTab === 'my-store' && (
            <div className="space-y-6">
              <div className={`p-8 rounded-lg border text-center space-y-2 ${theme.card}`}>
                <span className="text-[11px] uppercase tracking-widest text-[#C5A059]">Live Customer Storefront Preview</span>
                <h2 className="font-serif text-3xl">{storeInfo.name}</h2>
                <p className={`text-sm max-w-xl mx-auto ${theme.muted}`}>{storeInfo.description}</p>
                <p className="text-xs text-[#C5A059] pt-1">{storeInfo.contact}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((item) => (
                  <div key={item.id} className={`rounded-lg border overflow-hidden ${theme.card}`}>
                    <img src={item.image} alt={item.name} className="w-full h-52 object-cover" />
                    <div className="p-5 space-y-2">
                      <span className={`text-[11px] uppercase ${theme.muted}`}>{item.category}</span>
                      <h3 className="font-serif text-lg">{item.name}</h3>
                      <p className={`text-xs ${theme.muted}`}>{item.description}</p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="font-serif text-xl text-[#C5A059] font-semibold">₹{item.price}</span>
                        <span className={`text-xs ${theme.muted}`}>{item.stock} in stock</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* G. LEARNING CENTRE */}
          {(activeTab === 'learning' || activeTab === 'settings' || activeTab === 'help') && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl">Beginner's Learning Centre</h2>
                <p className={`text-xs ${theme.muted}`}>
                  Short, friendly guides designed to help first-time founders succeed on MYSON.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'How to Start Selling on MYSON',
                    body: 'Complete your basic profile, pick a memorable store name, and publish your first item in under 10 minutes.'
                  },
                  {
                    title: 'How to Add Your First Product',
                    body: 'Take a photo in natural daylight, write a clear title, and set a fair price that covers your materials and time.'
                  },
                  {
                    title: 'How to Manage Orders',
                    body: 'When a shopper buys an item, you will receive an instant notification. Pack the item securely and mark it ready.'
                  },
                  {
                    title: 'How to Update Product Stock',
                    body: 'Always keep your stock count accurate so customers only buy items you have ready to ship.'
                  },
                  {
                    title: 'Tips for Managing Your Online Store',
                    body: 'Respond warmly to buyer questions and share your MYSON store link on social media to attract early shoppers.'
                  }
                ].map((guide, i) => (
                  <div key={i} className={`p-5 rounded-lg border space-y-2 ${theme.card}`}>
                    <h3 className="font-serif text-lg text-[#C5A059]">{guide.title}</h3>
                    <p className={`text-xs leading-relaxed ${theme.muted}`}>{guide.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}