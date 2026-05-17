import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  TrendingUp, 
  ShoppingBag, 
  Utensils, 
  Car, 
  Layers 
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Metrics, behaviors, and ledger positions.</p>
        </div>
        <button 
          onClick={() => navigate('/Add-Transaction')}
          className="flex items-center justify-center gap-2 bg-indigo-600 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:bg-indigo-700 hover:shadow transition-all duration-200"
        >
          <PlusCircle size={16} /> New Transaction
        </button>
      </header>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Available Balance" value="Reference Point" amount="₹45,231.00" icon={<Wallet size={20}/>} trendColor="text-indigo-600" bgCircle="bg-indigo-50 text-indigo-600" />
        <StatCard title="Inbound Liquidity" value="This Month" amount="₹85,000.00" icon={<ArrowUpRight size={20}/>} trendColor="text-emerald-600" bgCircle="bg-emerald-50 text-emerald-600" />
        <StatCard title="Outbound Operational Capital" value="This Month" amount="₹39,769.00" icon={<ArrowDownLeft size={20}/>} trendColor="text-rose-600" bgCircle="bg-rose-50 text-rose-600" />
      </div>

      {/* SECONDARY ROW GRID: ADVANCED WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DAILY VELOCITY COMPARE ENGINE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-base">Daily Velocity</h3>
              <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">Real-time</span>
            </div>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-500">Today's Aggregated Debit</span>
                <span className="text-base font-bold text-slate-900">₹1,240.00</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-500">Yesterday's Total Debit</span>
                <span className="text-base font-bold text-slate-700">₹2,850.00</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-emerald-600">
            <TrendingUp size={14} />
            <span>Velocity dropped 56.4% compared to yesterday. Outstanding baseline efficiency.</span>
          </div>
        </div>

        {/* BUDGET LIMIT EXHAUSTION COMPONENT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Monthly Safe-To-Spend Target</h3>
            <p className="text-xs text-slate-500 mb-4">Fixed threshold optimization bar.</p>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-900">79.5%</span>
                <span className="text-xs text-slate-400">₹39,769 / ₹50,000 ceiling</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style={{ width: '79.5%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Approaching danger threshold zone limit. Buffer: ₹10,231.</p>
        </div>

        {/* DATA VISUALIZATION ENGINE HOOK CONTAINER */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">High-Level Distributive Vector</h3>
            <p className="text-xs text-slate-500 mb-4">Functional balance visual engine map.</p>
            <div className="h-28 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 font-medium">
              [Analytical Frame Injection Point - Recharts Element]
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Food</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Travel</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Utilities</span>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTION LEDGER WIDGET */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Execution Stream</h3>
            <p className="text-xs text-slate-400">Most recent structural adjustments.</p>
          </div>
          <button 
            onClick={() => navigate('/Analysis')} 
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            View System Ledger
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          <TransactionRowItem icon={<ShoppingBag size={16}/>} label="Amazon Infrastructure Payment" subtitle="Cloud Services Procurement" date="Today, 02:14 PM" amount="- ₹1,240.00" type="expense" />
          <TransactionRowItem icon={<Layers size={16}/>} label="Stripe Remittance Clearing" subtitle="Inbound Client SOW Dividend" date="Yesterday, 11:30 AM" amount="+ ₹45,000.00" type="income" />
          <TransactionRowItem icon={<Utensils size={16}/>} label="Zomato Provisions Logistics" subtitle="Subsistence Expense Vector" date="14 May 2026" amount="- ₹420.00" type="expense" />
          <TransactionRowItem icon={<Car size={16}/>} label="Uber Transport Logistics" subtitle="Commute Optimization Matrix" date="12 May 2026" amount="- ₹680.00" type="expense" />
        </div>
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */
const StatCard = ({ title, value, amount, icon, trendColor, bgCircle }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
    <div className="space-y-1">
      <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{title}</span>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{amount}</p>
      <span className={`text-xs block font-medium ${trendColor}`}>{value}</span>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${bgCircle}`}>
      {icon}
    </div>
  </div>
);

const TransactionRowItem = ({ icon, label, subtitle, date, amount, type }) => (
  <div className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-400 font-medium">{subtitle} • {date}</p>
      </div>
    </div>
    <span className={`text-sm font-bold tracking-tight ${type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
      {amount}
    </span>
  </div>
);

export default Dashboard;