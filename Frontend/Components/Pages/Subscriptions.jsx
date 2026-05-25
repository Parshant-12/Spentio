import React from 'react';
import { Check, Zap, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

function Subscription() {
  // Highlights premium status based on our layout placeholders
  const currentPlan = 'premium'; 
  const handlePremium = () =>{
    toast.warning("This Feature is under Development.")
  }
  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* HEADER SECTION */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Subscription Tier Management</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Scale feature pipelines, execution boundaries, and unlock deep analytical processing modules.</p>
      </header>

      {/* CORE PLANS COMPARATIVE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        
        {/* TIER 1: BASIC FREE SPECIFICATION */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative opacity-75 transition-colors duration-200">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Basic Tier</h3>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Free Baseline</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Standard manual entry accounting tools for tracking casual data vectors.</p>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
            
            {/* INCLUDED PRIVILEGES LIST */}
            <ul className="space-y-3">
              <PlanFeature inclusion="Up to 50 manual logs per month" active={true} />
              <PlanFeature inclusion="Simple overview dashboard" active={true} />
              <PlanFeature inclusion="Basic categorization dropdown list" active={true} />
              <PlanFeature inclusion="AI Copilot Data Cognition Engine" active={false} />
              <PlanFeature inclusion="Receipt OCR camera scanning module" active={false} />
            </ul>
          </div>
          
          <button disabled className="w-full mt-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-xl cursor-not-allowed">
            Downgrade Locked
          </button>
        </div>

        {/* TIER 2: PREMIUM COPILOT PLATFORM */}
        <div className="bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-500 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl ring-4 ring-indigo-50 dark:ring-indigo-500/10 transition-colors duration-200">
          {/* Active Status Ribbon Overlay */}
          <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={10} className="fill-white" /> Active Subscription
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm uppercase tracking-wider">Premium Access</h3>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">₹99 <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/ month</span></p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Full platform automation layers, unlimited historical auditing, and deep analytical capabilities.</p>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
            
            {/* INCLUDED PRIVILEGES LIST */}
            <ul className="space-y-3">
              <PlanFeature inclusion="Unlimited multi-type transactions" active={true} />
              <PlanFeature inclusion="Real-time Weekly Burn Velocity charts" active={true} />
              <PlanFeature inclusion="AI Financial Copilot Conversational Chat" active={true} />
              <PlanFeature inclusion="Smart OCR Receipt Camera Scanning engine" active={true} />
              <PlanFeature inclusion="Custom budget alert triggers & warnings" active={true} />
              <PlanFeature inclusion="One-click CSV Ledger Exports" active={true} />
            </ul>
          </div>
          
          <button 
            onClick={() => handlePremium()}
            className="w-full mt-8 py-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CreditCard size={14} /> Manage Subscription Billing
          </button>
        </div>

      </div>
    </div>
  );
}

/* HELPER ROW SUB-COMPONENT FOR LISTING PRIVILEGES */
const PlanFeature = ({ inclusion, active }) => (
  <li className={`flex items-start gap-3 text-xs font-medium ${active ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600 line-through'}`}>
    <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${active ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600'}`}>
      <Check size={10} strokeWidth={3} />
    </div>
    <span>{inclusion}</span>
  </li>
);

export default Subscription;