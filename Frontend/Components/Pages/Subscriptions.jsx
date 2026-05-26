import React from 'react';
import { Check, Zap, Sparkles, ShieldCheck, CreditCard, Crown } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

function Subscription() {
  // Premium is the active placeholder tier by default
  const currentPlan = 'premium';

  const handleBillingAction = (tierName) => {
    toast.warning(`${tierName} subscription is under development.`);
  };

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* HEADER SECTION */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Subscription Tier Management</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Scale feature pipelines, automation boundaries, and unlock deep analytical processing modules.</p>
      </header>

      {/* CORE PLANS COMPARATIVE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">

        {/* TIER 1: BASIC FREE SPECIFICATION */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative opacity-75 transition-colors duration-200">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Basic Tier</h3>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Free Baseline</p>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Standard manual entry accounting tools for tracking casual data vectors.</p>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

            <ul className="space-y-3">
              <PlanFeature inclusion="Up to 50 manual logs per month" active={true} />
              <PlanFeature inclusion="Simple overview dashboard" active={true} />
              <PlanFeature inclusion="Basic categorization lists" active={true} />
              <PlanFeature inclusion="AI Financial Copilot Chat" active={false} />
              <PlanFeature inclusion="Smart OCR Camera Scan" active={false} />
              <PlanFeature inclusion="Automated Gmail Sync Pipeline" active={false} />
            </ul>
          </div>

          <button disabled className="w-full mt-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-xl cursor-not-allowed">
            Downgrade Locked
          </button>
        </div>

        {/* TIER 2: PREMIUM PLATFORM (DEFAULT ACTIVE) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-500 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl ring-4 ring-indigo-50 dark:ring-indigo-500/10 transition-colors duration-200">
          {/* Active Status Ribbon Overlay */}
          <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={10} className="fill-white" /> Active Plan
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm uppercase tracking-wider">Premium Access</h3>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹99 <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/ month</span></p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Deep analytical tools and elevated transaction logic boundaries for active trackers.</p>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

            <ul className="space-y-3">
              <PlanFeature inclusion="Unlimited multi-type transactions" active={true} />
              <PlanFeature inclusion="Real-time Weekly Burn Velocity charts" active={true} />
              <PlanFeature inclusion="AI Financial Copilot Chat" active={true} />
              <PlanFeature inclusion="Custom budget alert triggers" active={true} />
              <PlanFeature inclusion="One-click CSV Ledger Exports" active={true} />
              <PlanFeature inclusion="Smart OCR Camera Scan" active={false} />
              <PlanFeature inclusion="Automated Gmail Sync Pipeline" active={false} />
            </ul>
          </div>

          <button
            onClick={() => handleBillingAction('Premium')}
            className="w-full mt-8 py-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CreditCard size={14} /> Manage Subscription Billing
          </button>
        </div>

        {/* TIER 3: PREMIUM PLUS AUTOMATION ENGINE (UPCOMING FEATURES) */}
        <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-indigo-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl dark:shadow-2xl transition-colors duration-200">
          {/* Upgrade Badge Overlay */}
          <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Crown size={10} className="fill-slate-950" /> Flagship Automation
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-amber-600 dark:text-amber-400 text-sm uppercase tracking-wider">Premium Plus</h3>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ₹199 <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ month</span>
              </p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Zero-effort automated accounting ecosystem utilizing background agent parsers.
            </p>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />

            <ul className="space-y-3">
              {/* NOTE: I removed the hardcoded `darkTheme={true}` prop. Make sure your PlanFeature component is also using native `dark:` Tailwind classes internally! */}
              <PlanFeature inclusion="Everything included in Premium" active={true} />
              <PlanFeature inclusion="Smart OCR Receipt Camera Scanning" active={true} />
              <PlanFeature inclusion="AI Automated Gmail Transaction Scraping" active={true} />
              <PlanFeature inclusion="Cross-Platform Global Bank Sync Engine" active={true} />
              <PlanFeature inclusion="Predictive Cash Flow Intelligence Forecasting" active={true} />
            </ul>
          </div>

          <button
            onClick={() => handleBillingAction('Premium Plus')}
            className="w-full mt-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap size={14} className="fill-slate-950" /> Upgrade to Premium Plus
          </button>
        </div>

      </div>
    </div>
  );
}

/* HELPER ROW SUB-COMPONENT FOR LISTING PRIVILEGES */
const PlanFeature = ({ inclusion, active, darkTheme = false }) => (
  <li className={`flex items-start gap-3 text-xs font-medium ${active
    ? darkTheme ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'
    : darkTheme ? 'text-slate-600 line-through' : 'text-slate-300 dark:text-slate-600 line-through'
    }`}>
    <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${active
      ? darkTheme ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
      : darkTheme ? 'bg-slate-800/50 text-slate-600' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600'
      }`}>
      <Check size={10} strokeWidth={3} />
    </div>
    <span>{inclusion}</span>
  </li>
);

export default Subscription;