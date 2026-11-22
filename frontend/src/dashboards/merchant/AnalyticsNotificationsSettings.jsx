import React, { useState } from 'react';
import { Bell, CheckCheck, Shield, Lock, User, AlertTriangle } from 'lucide-react';
import { ANALYTICS_BY_RANGE } from './merchantData.js';

export function AnalyticsSection({ theme, products, quotations, wonDeals }) {
  const [range, setRange] = useState('30d');
  const data = ANALYTICS_BY_RANGE[range];
  const acceptedCount = quotations.filter((q) => q.status === 'Accepted').length;
  const maxViews = Math.max(...data.trend.map((t) => t.views), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">Merchant Analytics</h2>
          <p className={`text-xs ${theme.muted}`}>
            Track visibility, enquiry conversion, and group-buy performance
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold border ${
                range === r.id ? 'bg-[#C5A059] text-black border-[#C5A059]' : theme.card
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Profile Views', value: data.profileViews.toLocaleString() },
          { label: 'Product Views', value: data.productViews.toLocaleString() },
          { label: 'Enquiries Received', value: data.enquiriesReceived },
          { label: 'Enquiry Response Rate', value: data.responseRate },
          { label: 'Quotations Submitted', value: quotations.length },
          { label: 'Quotations Accepted', value: acceptedCount },
          { label: 'Group-Buy Participation', value: data.groupBuyParticipation },
          { label: 'Deals Won', value: wonDeals.length },
        ].map((kpi) => (
          <div key={kpi.label} className={`p-5 rounded-xl border ${theme.card}`}>
            <p className={`text-xs uppercase tracking-wider ${theme.muted}`}>{kpi.label}</p>
            <p className="font-serif text-3xl font-semibold text-[#C5A059] mt-2">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Views & Enquiries Chart */}
        <div className={`lg:col-span-7 p-6 rounded-xl border ${theme.card}`}>
          <h3 className="font-serif text-xl mb-1">Visibility &amp; Enquiry Trend ({data.label})</h3>
          <p className={`text-xs mb-6 ${theme.muted}`}>
            Business discovery activity: {data.discoveryConnections} profile connections
          </p>
          <div className="h-52 flex items-end gap-4 px-2 border-b border-inherit">
            {data.trend.map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-[#C5A059]">{bar.views}</span>
                <div
                  style={{ height: `${Math.max(12, Math.round((bar.views / maxViews) * 100))}%` }}
                  className="w-full max-w-[44px] bg-[#C5A059]/85 rounded-t"
                />
                <span className={`text-xs pb-2 ${theme.muted}`}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed Products */}
        <div className={`lg:col-span-5 p-6 rounded-xl border space-y-4 ${theme.card}`}>
          <h3 className="font-serif text-xl">Most Viewed Products</h3>
          <div className="space-y-3">
            {[...products]
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 4)
              .map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium truncate">{p.name}</span>
                    <span className="text-[#C5A059] font-semibold">{p.views || 0} views</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#C5A059]"
                      style={{ width: `${Math.min(100, Math.round(((p.views || 0) / 1500) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationsSection({
  theme,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
}) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Notification Centre</h2>
          <p className={`text-xs ${theme.muted}`}>
            Stay updated on enquiries, group buys, negotiations, deals, and verification alerts
          </p>
        </div>
        <button
          onClick={onMarkAllRead}
          className="px-4 py-2 rounded-md border border-[#C5A059] text-[#C5A059] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#C5A059] hover:text-black transition"
        >
          <CheckCheck size={15} /> Mark All as Read
        </button>
      </div>

      <div className={`rounded-xl border divide-y divide-inherit ${theme.card}`}>
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              onMarkRead(n.id);
              onNavigate(n.targetTab);
            }}
            className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition ${
              n.read ? 'opacity-75' : 'bg-[#C5A059]/5'
            } hover:bg-[#C5A059]/10`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {!n.read && <span className="w-2 h-2 rounded-full bg-[#C5A059]" />}
                <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-semibold">
                  {n.type}
                </span>
              </div>
              <p className="text-sm font-semibold">{n.title}</p>
              <p className={`text-xs ${theme.muted}`}>{n.message}</p>
            </div>
            <span className={`text-[11px] shrink-0 ${theme.muted}`}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsSection({ theme, user, onNotify, onLogout }) {
  const [subTab, setSubTab] = useState('account');
  const [account, setAccount] = useState({
    name: user?.name || 'Vikramaditya Sen',
    email: user?.email || 'wholesale@aurelialabs.in',
    phone: '+91 98201 44510',
    profileImage:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [prefs, setPrefs] = useState({
    twoFactor: true,
    loginAlerts: true,
    emailEnquiries: true,
    groupBuyAlerts: true,
    negotiationPings: true,
    showPublicProfile: true,
    showPhoneToVerifiedOnly: true,
    allowDirectMessages: true,
  });

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwords.next || passwords.next !== passwords.confirm) {
      onNotify('error', 'New password and confirmation must match.');
      return;
    }
    setPasswords({ current: '', next: '', confirm: '' });
    onNotify('success', 'Password updated in your security preferences.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap gap-2 border-b border-inherit pb-4">
        {[
          { id: 'account', label: 'Account', icon: User },
          { id: 'security', label: 'Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'privacy', label: 'Business Privacy', icon: Shield },
          { id: 'management', label: 'Account Management', icon: AlertTriangle },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`px-4 py-2 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
                subTab === t.id ? 'bg-[#C5A059] text-black border-[#C5A059]' : theme.card
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {subTab === 'account' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNotify('success', 'Account settings saved.');
          }}
          className={`p-6 rounded-xl border space-y-4 text-sm ${theme.card}`}
        >
          <h3 className="font-serif text-xl">Account Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Full Name</label>
              <input
                value={account.name}
                onChange={(e) => setAccount({ ...account, name: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Email</label>
              <input
                type="email"
                value={account.email}
                onChange={(e) => setAccount({ ...account, email: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Phone Number</label>
              <input
                value={account.phone}
                onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.muted}`}>Profile Image URL</label>
              <input
                value={account.profileImage}
                onChange={(e) => setAccount({ ...account, profileImage: e.target.value })}
                className={`w-full p-2.5 rounded border ${theme.input}`}
              />
            </div>
          </div>
          <button type="submit" className="px-5 py-2.5 rounded bg-[#C5A059] text-black text-xs font-semibold">
            Save Account Changes
          </button>
        </form>
      )}

      {subTab === 'security' && (
        <form onSubmit={handlePasswordSave} className={`p-6 rounded-xl border space-y-4 text-sm ${theme.card}`}>
          <h3 className="font-serif text-xl">Password &amp; Security</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className={`p-2.5 rounded border ${theme.input}`}
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              className={`p-2.5 rounded border ${theme.input}`}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className={`p-2.5 rounded border ${theme.input}`}
            />
          </div>
          <div className="space-y-2 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.twoFactor}
                onChange={(e) => setPrefs({ ...prefs, twoFactor: e.target.checked })}
              />
              Enable Two-Factor Authentication (2FA) for B2B quote approvals
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.loginAlerts}
                onChange={(e) => setPrefs({ ...prefs, loginAlerts: e.target.checked })}
              />
              Send email alerts for logins from unrecognized devices
            </label>
          </div>
          <button type="submit" className="px-5 py-2.5 rounded bg-[#C5A059] text-black text-xs font-semibold">
            Update Security Settings
          </button>
        </form>
      )}

      {subTab === 'notifications' && (
        <div className={`p-6 rounded-xl border space-y-3 text-sm ${theme.card}`}>
          <h3 className="font-serif text-xl">Notification Preferences</h3>
          {[
            { key: 'emailEnquiries', label: 'Instant email alerts for new business enquiries' },
            { key: 'groupBuyAlerts', label: 'Alert when new Group Buys match my business category' },
            { key: 'negotiationPings', label: 'Notify immediately on quotation shortlists & counter-offers' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between py-2 border-b border-inherit text-xs cursor-pointer">
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={(e) => {
                  setPrefs({ ...prefs, [item.key]: e.target.checked });
                  onNotify('success', 'Notification preference updated.');
                }}
              />
            </label>
          ))}
        </div>
      )}

      {subTab === 'privacy' && (
        <div className={`p-6 rounded-xl border space-y-3 text-sm ${theme.card}`}>
          <h3 className="font-serif text-xl">Business Privacy &amp; Contact Visibility</h3>
          {[
            { key: 'showPublicProfile', label: 'Make business profile discoverable in Discover Businesses' },
            { key: 'showPhoneToVerifiedOnly', label: 'Restrict direct phone number visibility to verified businesses only' },
            { key: 'allowDirectMessages', label: 'Allow retailers and startups to initiate direct messages' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between py-2 border-b border-inherit text-xs cursor-pointer">
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={(e) => {
                  setPrefs({ ...prefs, [item.key]: e.target.checked });
                  onNotify('success', 'Privacy setting updated.');
                }}
              />
            </label>
          ))}
        </div>
      )}

      {subTab === 'management' && (
        <div className={`p-6 rounded-xl border space-y-4 text-sm ${theme.card}`}>
          <h3 className="font-serif text-xl text-red-500">Account Management</h3>
          <p className={`text-xs ${theme.muted}`}>
            Temporarily deactivate your merchant storefront or permanently request account removal.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNotify('success', 'Account pause preview triggered (frontend only).')}
              className="px-4 py-2 rounded border border-amber-500 text-amber-500 text-xs font-semibold"
            >
              Deactivate Account
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your merchant account?')) {
                  onLogout?.();
                }
              }}
              className="px-4 py-2 rounded border border-red-500 text-red-500 text-xs font-semibold hover:bg-red-500/10"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}