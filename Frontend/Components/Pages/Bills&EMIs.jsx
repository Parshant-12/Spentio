import React, { useState } from 'react';
import { 
  CreditCard, 
  CalendarClock, 
  Percent, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BillsAndEMIs() {
  const navigate = useNavigate();

  // Mock data structure for ongoing subscriptions and utilities
  const [subscriptions] = useState([
    { id: 1, name: 'Netflix Premium', amount: 649, dueDate: 'May 24', category: 'Entertainment', provider: 'Auto-debit' },
    { id: 2, name: 'Airtel Fiber Wi-Fi', amount: 943, dueDate: 'May 28', category: 'Bills & Recharges', provider: 'Manual Pay' },
    { id: 3, name: 'LeetCode Premium', amount: 2999, dueDate: 'Jun 02', category: 'Education', provider: 'Auto-debit' },
    { id: 4, name: 'Gym Membership', amount: 2500, dueDate: 'Jun 05', category: 'Health & Pharmacy', provider: 'Manual Pay' },
  ]);

  // Mock data structure for amortized long-term debts
  const [loans] = useState([
    { id: 1, name: 'HDFC Student Loan', totalAmount: 400000, remaining: 180000, emi: 12500, interestRate: '8.5%', progress: 55 },
    { id: 2, name: 'Apple Financial (Laptop EMI)', totalAmount: 120000, remaining: 40000, emi: 10000, interestRate: '0%', progress: 66.6 },
  ]);

  const totalMonthlyCommitment = subscriptions.reduce((acc, c) => acc + c.amount, 0) + loans.reduce((acc, c) => acc + c.emi, 0);

  return (
    <div className="space-y-8">
      
      {/* HEADER & PORTAL LINK */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recurring & BillsAndEMIs</h2>
          <p className="text-sm text-slate-500 mt-0.5">Audit subscriptions, upcoming billing cycles, and amortized debt metrics.</p>
        </div>
        
        {/* Cross-link button pushing users to the dedicated calculators route */}
        <button 
          onClick={() => navigate('/tools')}
          className="flex items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-xl text-slate-700 font-semibold text-xs shadow-sm hover:bg-slate-50 transition-all"
        >
          Open Planning Calculators <ArrowRight size={14} className="text-slate-400" />
        </button>
      </header>

      {/* RECURRING COMMITMENTS METRIC HEADER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Monthly Fixed Outflow</span>
            <p className="text-3xl font-black text-slate-900 tracking-tight">₹{totalMonthlyCommitment.toLocaleString('en-IN')}</p>
            <span className="text-xs text-slate-400 block font-medium">Combined Bills + EMIs due</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner"><CreditCard size={20}/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Upcoming (7 Days)</span>
            <p className="text-3xl font-black text-amber-600 tracking-tight">₹1,592.00</p>
            <span className="text-xs text-amber-600/80 block font-medium">2 Actions requiring clearance</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner"><CalendarClock size={20}/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Outstanding Debt Aggregate</span>
            <p className="text-3xl font-black text-slate-900 tracking-tight">₹2,20,000</p>
            <span className="text-xs text-rose-500 block font-medium">Principal remaining across pools</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner"><Percent size={20}/></div>
        </div>
      </div>

      {/* INTERACTIVE WORKSPACE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* VIEW 1: SUBSCRIPTIONS & UTILITIES CONTAINER */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Subscriptions & Active Bills</h3>
          
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{sub.name}</p>
                      <p className="text-xs text-slate-400 font-semibold">
                        Due: <span className="text-slate-700 font-bold">{sub.dueDate}</span> • {sub.provider}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">₹{sub.amount.toLocaleString('en-IN')}</p>
                    <span className="inline-block text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider mt-1">
                      {sub.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIEW 2: AMORTIZED LOANS & LOAN TRAJECTORY CEILINGS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Active Loans & EMI Payoffs</h3>
          
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{loan.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-semibold">
                      Interest Rate: <span className="text-slate-800 font-black">{loan.interestRate}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Monthly EMI</span>
                    <p className="text-base font-black text-indigo-600">₹{loan.emi.toLocaleString('en-IN')}/mo</p>
                  </div>
                </div>

                {/* Progress bar tracking payload payoff sequence */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${loan.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Paid: ₹{(loan.totalAmount - loan.remaining).toLocaleString('en-IN')}</span>
                    <span className="text-slate-700 font-black">{loan.progress.toFixed(0)}% Settled</span>
                    <span>Remaining: ₹{loan.remaining.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default BillsAndEMIs;