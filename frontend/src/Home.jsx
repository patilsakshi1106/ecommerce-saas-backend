import React from 'react';

export default function Home({
  onLogin,
  onCustomerRegister,
  onMerchantRegister,
  onShop,
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="uppercase tracking-[0.3em] text-sm mb-4">
          India • B2B & B2C Commerce
        </p>

        <h1 className="text-5xl font-serif mb-5">
          Welcome to MAISON
        </h1>

        <p className="text-lg mb-10">
          Discover unique products and grow your business.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onShop}
            className="bg-[#1C1917] text-white px-6 py-3 rounded-lg"
          >
            Explore Products
          </button>

          <button
            onClick={onLogin}
            className="border border-[#1C1917] px-6 py-3 rounded-lg"
          >
            Login
          </button>

          <button
            onClick={onCustomerRegister}
            className="border border-[#9A5B3E] px-6 py-3 rounded-lg"
          >
            Customer Registration
          </button>

          <button
            onClick={onMerchantRegister}
            className="border border-[#2E4F3E] px-6 py-3 rounded-lg"
          >
            Merchant Registration
          </button>
        </div>
      </section>
    </div>
  );
}