import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Save, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Settings() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currency: 'INR',
    notifications: true,
    password: ''
  });

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const response = await fetch(`${BASE_URL}/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const result = await response.json();

        // Ensure you check 'result.success' and match the keys returned by your API
        if (result.success) {
          setProfile({
            name: result.data.name,
            email: result.data.email,
            currency: result.data.currency || 'INR',
            notifications: result.data.notifications ?? true,
            password: ''
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to fetch settings.');
      }
    };

    dataFetch();
  }, []);


  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });
      if (response.ok){
        toast.success('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings.');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl transition-colors duration-200">
      {/* HEADER SECTION */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your structural configuration preferences and identity metrics.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">

        {/* SECTION 1: CORE IDENTITY */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <User size={16} /> Personal Profile
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Display Name</label>
              <input
                type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder={profile.name}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Email Anchor Address</label>
              <input
                type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PREFERENCES & LOCALIZATION */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe size={16} /> Localization & Toggles
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Primary Currency Standard</label>
              <select
                value={profile.currency} onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 mt-6 sm:mt-auto transition-colors duration-200">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Push Budget Warning Triggers</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Alert via system popups when passing 80% thresholds.</p>
              </div>
              <input
                type="checkbox" checked={profile.notifications} onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
                className="w-4 h-4 text-indigo-600 dark:text-indigo-500 border-slate-300 dark:border-slate-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CREDENTIAL SECURITY */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock size={16} /> Security Matrix
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Update Account Password</label>
              <input
                type="password" placeholder="••••••••••••" onChange={(e)=> setProfile({...profile, password: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SAVE EXECUTION BUTTON */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all ml-auto cursor-pointer"
        >
          <Save size={16} /> Save
        </button>

      </form>
    </div>
  );
}

export default Settings;