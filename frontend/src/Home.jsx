import React from 'react';

export default function Home({ user, onLogout, onBackToLanding }) {
  const isBusiness = user?.accountStream === 'business' || Boolean(user?.storeName);
  const businessRoleLabel =
    user?.role === 'retailer'
      ? 'Retailer Partner'
      : user?.role === 'startup'
      ? 'Startup / Online Seller'
      : 'Merchant Partner';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Top Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25] shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] bg-[#F2ECE1] dark:bg-[#2A2622] text-[#B89456] dark:text-[#CDA76E]">
            {isBusiness
              ? `Verified ${businessRoleLabel} Dashboard`
              : 'MAISON Personal Shopper Portal'}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-semibold mt-2">
            Welcome back, {user?.storeName || user?.name || 'Member'}
          </h1>
          <p className="text-sm text-[#5C564F] dark:text-[#A8A096] mt-1">
            Signed in as <strong>{user?.email}</strong>
            {user?.storeName ? ` • Storefront: ${user.storeName}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToLanding}
            className="px-5 py-2.5 rounded-full border border-[#D0C6B0] dark:border-[#423C35] text-xs font-semibold uppercase tracking-wider hover:border-[#B89456] transition"
          >
            ← Back to MAISON Landing
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-5 py-2.5 rounded-full bg-[#181615] text-white dark:bg-[#B89456] dark:text-[#11100F] text-xs font-semibold uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Role-Aware Workspace Overview */}
      {isBusiness ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B89456]">
              01 • Catalogue &amp; Inventory
            </span>
            <h2 className="font-editorial text-2xl font-semibold mt-1">
              Multi-Category Product Listings
            </h2>
            <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-2 leading-relaxed">
              Manage your SKUs across Electronics, Appliances, Home &amp; Living, Fashion, Beauty, and Groceries from your unified business console.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B89456]">
              02 • Commercial Orders
            </span>
            <h2 className="font-editorial text-2xl font-semibold mt-1">
              B2B &amp; B2C Order Fulfillment
            </h2>
            <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-2 leading-relaxed">
              Track incoming retail orders, wholesale allocations, and GST-compliant invoicing in real time.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B89456]">
              03 • Partner Role Status
            </span>
            <h2 className="font-editorial text-2xl font-semibold mt-1">
              {businessRoleLabel}
            </h2>
            <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-2 leading-relaxed">
              Authenticated via MAISON Unified Business Login. Your business permissions are active.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B89456]">
              All 10 Departments Unlocked
            </span>
            <h2 className="font-editorial text-2xl font-semibold mt-1">
              Browse Multi-Category Storefronts
            </h2>
            <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-2 leading-relaxed">
              Shop Electronics, Home Appliances, Living Décor, Fashion, Jewellery, Beauty, and Groceries with one cart.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B89456]">
              Orders &amp; Deliveries
            </span>
            <h2 className="font-editorial text-2xl font-semibold mt-1">
              Active Shipments
            </h2>
            <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-2 leading-relaxed">
              Track your recent purchases and manage doorstep deliveries across India.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-[#1F1C19] border border-[#E5DEC9] dark:border-[#2E2A25]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B89456]">
              Saved Collections
            </span>
            <h2 className="font-editorial text-2xl font-semibold mt-1">
              Personal Wishlist
            </h2>
            <p className="text-xs text-[#5C564F] dark:text-[#A8A096] mt-2 leading-relaxed">
              Bookmark favourite items across categories for instant checkout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}