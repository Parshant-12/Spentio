import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
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
  Calculator,
  Menu,
  X
} from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State controller for the mobile navigation drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper utility to safely route and close mobile drawer simultaneously
  const handleMobileNav = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* MOBILE TOP NAVIGATION BAR HEADER */}
      <header className="w-full bg-white border-b border-slate-200/80 px-5 py-4 flex items-center justify-between md:hidden sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-base shadow-sm">S</div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Spent.io</h1>
        </div>
        {/* Toggle button anchored on the far right */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* MOBILE SLIDE-OUT DRAWER OVERLAY (RIGHT-ALIGNED) */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Dark Backdrop Mask Layer */}
        <div 
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sliding Sidebar Body (Anchored right-0 and toggles translate-x) */}
        <aside className={`fixed inset-y-0 right-0 w-64 bg-white p-5 flex flex-col justify-between h-full shadow-2xl border-l border-slate-100 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="flex flex-col overflow-hidden h-full">
            {/* Close Drawer Header Button */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">S</div>
                <h1 className="text-xl font-bold text-slate-900">Spent.io</h1>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
              <div>
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Core Hub</span>
                <nav className="space-y-1">
                  <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/dashboard'} onClick={() => handleMobileNav('/dashboard')} />
                  <SidebarLink icon={<PlusCircle size={18} />} label="Add Transaction" active={location.pathname === '/AddTransaction'} onClick={() => handleMobileNav('/AddTransaction')} />
                  <SidebarLink icon={<History size={18} />} label="TransactionsHistory" active={location.pathname === '/TransactionsHistory'} onClick={() => handleMobileNav('/TransactionsHistory')} />
                  <SidebarLink icon={<HandCoins size={18} />} label="Udhar Book" active={location.pathname === '/Udhar'} onClick={() => handleMobileNav('/Udhar')} />
                </nav>
              </div>

              <div>
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Planning & Insights</span>
                <nav className="space-y-1">
                  <SidebarLink icon={<Receipt size={18} />} label="Analysis" active={location.pathname === '/analysis'} onClick={() => handleMobileNav('/analysis')} />
                  <SidebarLink icon={<Sparkles size={18} />} label="AI Copilot Chat" active={location.pathname === '/AiChat'} onClick={() => handleMobileNav('/AiChat')} />
                  <SidebarLink icon={<CreditCard size={18} />} label="Subscriptions & EMIs" active={location.pathname === '/BillsAndEMIs'} onClick={() => handleMobileNav('/BillsAndEMIs')} />
                  <SidebarLink icon={<PlusCircle size={18} />} label="Create Budget" active={location.pathname === '/Budget'} onClick={() => handleMobileNav('/Budget')} />
                  <SidebarLink icon={<Calculator size={18} />} label="Calculator" active={location.pathname === '/Calculator'} onClick={() => handleMobileNav('/Calculator')} />
                </nav>
              </div>
            </div>
          </div>

          {/* Anchored Bottom Actions */}
          <div className="pt-4 border-t border-slate-100 shrink-0 space-y-1">
            <SidebarLink icon={<ShieldCheck size={18} />} label="Subscription" active={location.pathname === '/Subscription'} onClick={() => handleMobileNav('/Subscription')} />
            <SidebarLink icon={<Settings size={18} />} label="Settings" active={location.pathname === '/settings'} onClick={() => handleMobileNav('/settings')} />
            <button 
              onClick={() => alert('Logging out session...')} 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/60 transition-colors mt-1"
            >
              <LogOut size={18} /> <span>Logout Session</span>
            </button>
          </div>

        </aside>
      </div>

      {/* PERMANENT DESKTOP SIDEBAR VIEW (Always left-aligned on computers) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden md:flex h-screen sticky top-0 shrink-0">
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-6 pl-2 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">S</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Spent.io</h1>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Core Hub</span>
              <nav className="space-y-1">
                <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/dashboard'} onClick={() => navigate('/dashboard')} />
                <SidebarLink icon={<PlusCircle size={18} />} label="Add Transaction" active={location.pathname === '/AddTransaction'} onClick={() => navigate('/AddTransaction')} />
                <SidebarLink icon={<History size={18} />} label="Transactions History" active={location.pathname === '/TransactionsHistory'} onClick={() => navigate('/TransactionsHistory')} />
                <SidebarLink icon={<HandCoins size={18} />} label="Udhar Book" active={location.pathname === '/Udhar'} onClick={() => navigate('/Udhar')} />
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Planning & Insights</span>
              <nav className="space-y-1">
                <SidebarLink icon={<Receipt size={18} />} label="Analysis" active={location.pathname === '/analysis'} onClick={() => navigate('/analysis')} />
                <SidebarLink icon={<Sparkles size={18} />} label="AI Copilot Chat" active={location.pathname === '/AiChat'} onClick={() => navigate('/AiChat')} />
                <SidebarLink icon={<CreditCard size={18} />} label="Subscriptions & EMIs" active={location.pathname === '/BillsAndEMIs'} onClick={() => navigate('/BillsAndEMIs')} />
                <SidebarLink icon={<PlusCircle size={18} />} label="Create Budget" active={location.pathname === '/Budget'} onClick={() => navigate('/Budget')} />
                <SidebarLink icon={<Calculator size={18} />} label="Calculator" active={location.pathname === '/Calculator'} onClick={() => navigate('/Calculator')} />
              </nav>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 shrink-0 space-y-1">
          <SidebarLink icon={<ShieldCheck size={18} />} label="Subscription" active={location.pathname === '/Subscription'} onClick={() => navigate('/Subscription')} />
          <SidebarLink icon={<Settings size={18} />} label="Settings" active={location.pathname === '/settings'} onClick={() => navigate('/settings')} />
          <button 
            onClick={() => alert('Logging out and clearing session context...')} 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/60 transition-colors mt-1"
          >
            <LogOut size={18} /> <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* DYNAMIC VIEWPORT CONTENT HUB */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        <Outlet /> 
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
          transition={Bounce}
          z-index={9999}
        />
      </main>

    </div>
  );
}

/* COMPACT REUSABLE BUTTON COMPONENT LINK */
const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 border border-transparent cursor-pointer
      ${active 
        ? 'bg-indigo-50/80 text-indigo-700 font-extrabold border-indigo-100/30' 
        : 'text-slate-500 hover:bg-slate-100/70 hover:text-slate-900'}`}
  >
    <div className={active ? 'text-indigo-600' : 'text-slate-400'}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

export default Layout;