import React, { useState, useEffect } from 'react';
import { User, Lock, Globe, Save, Mail, Copy, Check } from 'lucide-react'; 
import { toast } from 'react-toastify';
import Loader from '../Layouts/Loader';
import ConfirmModal from '../Layouts/Confirm';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Simple dictionary matching banks to their statement/alert sender addresses
const BANK_DIRECTORY = {
  none: { email: "", note: "Select a bank above to see its filter configurations." },
  hdfc: { email: "alerts@hdfcbank.net", note: "Forward emails sent from alerts@hdfcbank.net" },
  icici: { email: "transaction@icicibank.com", note: "Forward emails sent from transaction@icicibank.com" },
  sbi: { email: "alerts@sbi.co.in", note: "Forward emails sent from alerts@sbi.co.in" },
  groww: { email: "billing@groww.in", note: "Forward emails sent from billing@groww.in" }
};

function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedBank, setSelectedBank] = useState('none');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currency: 'INR',
    notifications: true,
    password: '',
    inboundEmail: '' // Added to hold the unique user forwarding address
  });

  useEffect(() => {
    setIsLoading(true);
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

        if (result.success) {
          setProfile({
            name: result.data.name,
            email: result.data.email,
            currency: result.data.currency || 'INR',
            notifications: result.data.notifications ?? true,
            password: '',
            // Fallback generated mapping if backend does not return a dedicated string
            inboundEmail: result.data.inboundEmail || `add+${result.data._id || 'user'}@inbound.spentio.com`
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to fetch settings.');
      } finally {
        setIsLoading(false);
      }
    };

    dataFetch();
  }, []);

  const handleCopyAddress = () => {
    if (!profile.inboundEmail) return;
    navigator.clipboard.writeText(profile.inboundEmail);
    setCopied(true);
    toast.success("Forwarding address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e) => {
    try {
      const payload = {
        currency: profile.currency,
        notifications: profile.notifications
      };

      if (profile.password && profile.password.trim() !== '') {
        payload.password = profile.password;
      }

      const response = await fetch(`${BASE_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
        setProfile(prev => ({ ...prev, password: '' }));
      } else {
        const errData = await response.json();
        toast.error(errData.message || 'Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Network error. Failed to save settings.');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 max-w-3xl transition-colors duration-200">
      {/* HEADER SECTION */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your structural configuration preferences and identity metrics.</p>
      </header>

      <form onSubmit={(e)=>{e.preventDefault(); setIsDeleteModalOpen(true)}} className="space-y-6">

        {/* SECTION 1: CORE IDENTITY */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <User size={16} /> Personal Profile
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Display Name</label>
              <input
                required
                type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your Name"
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Email Anchor Address</label>
              <input
                required
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
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer"
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

        {/* NEW SECTION 3: AUTOMATED EXPENSE INGEST (EMAIL FORWARDING) */}
        <div className="bg-white hidden dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <Mail size={16} /> Automated Email Sync
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Your Unique Spentio Inbox</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  type="text"
                  value={profile.inboundEmail}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-600 dark:text-slate-300 cursor-not-allowed outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[48px]"
                >
                  {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Any official bank receipt forwarded to this address will instantly appear on your dashboard via AI parsing.
              </p>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Setup Guide by Bank Provider</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer"
              >
                <option value="none">-- Select Your Bank Account --</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="sbi">State Bank of India (SBI)</option>
                <option value="groww">Groww Investments</option>
              </select>

              {selectedBank !== 'none' && (
                <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/70 dark:border-indigo-900/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">Gmail Filter Step:</p>
                  <p>Set a filter where <span className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">From: {BANK_DIRECTORY[selectedBank].email}</span></p>
                  <p className="text-slate-400 dark:text-slate-500 mt-1 italic">{BANK_DIRECTORY[selectedBank].note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: CREDENTIAL SECURITY */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock size={16} /> Security Matrix
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Update Account Password
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
                Leave blank to keep your current password.
              </p>
              <input
                type="password"
                value={profile.password}
                placeholder="••••••••••••"
                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SAVE EXECUTION BUTTON */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all ml-auto cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          Save Configuration
        </button>

      </form>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Confirm Save!"
        message={`Are you sure you want to save this data.`}
        confirmText="Yes"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleSave}
      />
    </div>
  );
}

export default Settings;