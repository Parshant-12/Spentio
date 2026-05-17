import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, PlusCircle } from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* SHARED SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-10 pl-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">S</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Spent.io</h1>
          </div>
          <nav className="space-y-1.5">
            <button onClick={() => navigate('/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${location.pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100/70'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={() => navigate('/AddTransaction')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${location.pathname === '/AddTransaction' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100/70'}`}>
              <Receipt size={18} /> Transactions
            </button>
            <button onClick={() => navigate('/analysis')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${location.pathname === '/analysis' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100/70'}`}>
              <PieChart size={18} /> Analysis
            </button>
          </nav>
        </div>
      </aside>

      {/* DYNAMIC CONTENT WRAPPER */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* React Router injects the actual active sub-page component here */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default Layout;