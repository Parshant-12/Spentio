import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  History,
  PlusCircle, 
  Sparkles, 
  CreditCard, 
  HandCoins, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Calculator
} from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* GLOBAL SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden md:flex h-screen sticky top-0">
        
        {/* TOP BRAND & SCROLLABLE NAV WRAPPER */}
        <div className="flex flex-col overflow-hidden">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2 mb-6 pl-2 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">S</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Spent.io</h1>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            
            {/* SECTION 1: CORE WORKSPACE */}
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Core Hub
              </span>
              <nav className="space-y-1">
                <SidebarLink 
                  icon={<LayoutDashboard size={18} />} 
                  label="Dashboard" 
                  active={location.pathname === '/dashboard'} 
                  onClick={() => navigate('/dashboard')} 
                />
                <SidebarLink 
                  icon={<PlusCircle size={18} />} 
                  label="Add Transaction" 
                  active={location.pathname === '/AddTransaction'} 
                  onClick={() => navigate('/AddTransaction')} 
                />
                <SidebarLink 
                  icon={<History size={18} />} 
                  label="Ledger History" 
                  active={location.pathname === '/Transactions'} 
                  onClick={() => navigate('/Transactions')} 
                />
                <SidebarLink 
                  icon={<HandCoins size={18} />} 
                  label="Udhar Book" 
                  active={location.pathname === '/Udhar'} 
                  onClick={() => navigate('/Udhar')} 
                />
              </nav>
            </div>

            {/* SECTION 2: PLANNING & INTELLIGENCE */}
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Planning & Insights
              </span>
              <nav className="space-y-1">
                <SidebarLink 
                  icon={<Receipt size={18} />} 
                  label="Analysis" 
                  active={location.pathname === '/analysis'} 
                  onClick={() => navigate('/analysis')} 
                />
                <SidebarLink 
                  icon={<Sparkles size={18} />} 
                  label="AI Copilot Chat" 
                  active={location.pathname === '/AiChat'} 
                  onClick={() => navigate('/AiChat')} 
                />
                <SidebarLink 
                  icon={<CreditCard size={18} />} 
                  label="Bills & EMIs" 
                  active={location.pathname === '/BillsAndEMIs'} 
                  onClick={() => navigate('/BillsAndEMIs')} 
                />
                <SidebarLink 
                  icon={<PlusCircle size={18} />} 
                  label="Create Budget" 
                  active={location.pathname === '/Budget'} 
                  onClick={() => navigate('/Budget')} 
                />
                <SidebarLink 
                  icon={<Calculator size={18} />} 
                  label="Calculator" 
                  active={location.pathname === '/Calculator'} 
                  onClick={() => navigate('/Calculator')} 
                />
              </nav>
            </div>

          </div>
        </div>

        {/* ANCHORED BOTTOM CONTROL PANEL */}
        <div className="pt-4 border-t border-slate-100 shrink-0 space-y-1">
          <SidebarLink 
            icon={<ShieldCheck size={18} />} 
            label="Subscription" 
            active={location.pathname === '/Subscription'} 
            onClick={() => navigate('/Subscription')} 
          />
          <SidebarLink 
            icon={<Settings size={18} />} 
            label="Settings" 
            active={location.pathname === '/settings'} 
            onClick={() => navigate('/settings')} 
          />
          <button 
            onClick={() => alert('Logging out and clearing session context...')} 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/60 transition-colors mt-1"
          >
            <LogOut size={18} /> <span>Logout Session</span>
          </button>
        </div>

      </aside>

      {/* DYNAMIC VIEWPORT INJECTION LAYER */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto h-screen">
        <Outlet /> 
      </main>

    </div>
  );
}

/* COMPACT REUSABLE BUTTON COMPONENT */
const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 border border-transparent
      ${active 
        ? 'bg-indigo-50/80 text-indigo-700 font-extrabold border-indigo-100/30' 
        : 'text-slate-500 hover:bg-slate-100/70 hover:text-slate-900'}`}
  >
    <div className={active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

export default Layout;