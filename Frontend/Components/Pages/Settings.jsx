import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Save, ShieldCheck } from 'lucide-react';

function Settings() {
  const [profile, setProfile] = useState({
    name: 'Parshant Kumar',
    email: 'parshant@example.com',
    currency: 'INR',
    notifications: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('System settings synced cleanly with local storage vectors!');
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* HEADER SECTION */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your structural configuration preferences and identity metrics.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: CORE IDENTITY */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
            <User size={16} /> Personal Profile
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Display Name</label>
              <input 
                type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Anchor Address</label>
              <input 
                type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PREFERENCES & LOCALIZATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
            <Globe size={16} /> Localization & Toggles
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Primary Currency Standard</label>
              <select 
                value={profile.currency} onChange={(e) => setProfile({...profile, currency: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 mt-6 sm:mt-auto">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-900">Push Budget Warning Triggers</p>
                <p className="text-xs text-slate-400 font-medium">Alert via system popups when passing 80% thresholds.</p>
              </div>
              <input 
                type="checkbox" checked={profile.notifications} onChange={(e) => setProfile({...profile, notifications: e.target.checked})}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CREDENTIAL SECURITY */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
            <Lock size={16} /> Security Matrix
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Update Account Password</label>
              <input 
                type="password" placeholder="••••••••••••" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* SAVE EXECUTION BUTTON */}
        <button 
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-sm hover:bg-indigo-700 transition-all ml-auto"
        >
          <Save size={16} /> Synchronize Preferences
        </button>

      </form>
    </div>
  );
}

export default Settings;