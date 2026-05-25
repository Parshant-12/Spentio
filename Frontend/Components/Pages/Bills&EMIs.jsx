import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CalendarClock,
  Percent,
  ArrowRight,
  Plus,
  X,
  Trash2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BillsAndEMIs() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [subscriptions, setSubscriptions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

  // Form States (Matching your Mongoose Schemas)
  const [subscriptionForm, setSubscriptionForm] = useState({ name: '', amount: '', subscriptioningCycle: 'monthly', dueDate: '', isAutoDebit: false });
  const [loanForm, setLoanForm] = useState({ name: '', totalPrincipal: '', interestRate: '', emiAmount: '', dueDate: '', isAutoDebit: false });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const responseLoans = await fetch(`${BASE_URL}/loans`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const dataLoans = await responseLoans.json();
      setLoans(dataLoans);

      const responseSubs = await fetch(`${BASE_URL}/subscriptions`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const dataSubs = await responseSubs.json();
      setSubscriptions(dataSubs);

    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleAddSubscription = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/subscription`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subscriptionForm)
      });
      if (response.ok) {
        fetchData();
        toast.success('Subscription added successfully');
        setIsSubscriptionModalOpen(false);
      }
      setSubscriptionForm({ name: '', amount: '', subscriptioningCycle: 'monthly', dueDate: '', isAutoDebit: false });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLoan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/loan`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(loanForm)
      });
      if (response.ok) {
        fetchData();
        toast.success('Loan added successfully');
        setIsLoanModalOpen(false);
      }
      setIsLoanModalOpen(false);
      setLoanForm({ name: '', totalPrincipal: '', interestRate: '', emiAmount: '', dueDate: '', isAutoDebit: false });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletesubscription = async (id) => {
    const response = await fetch(`${BASE_URL}/subscription/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      toast.success('Subscription deleted');
      setSubscriptions(subscriptions.filter(s => s._id !== id));
    }
  };
  const handleDeleteLoan = async (id) => {
    const response = await fetch(`${BASE_URL}/loan/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      toast.success('Loan deleted');
      setLoans(loans.filter(l => l._id !== id));
    }
  };

  // --- CALCULATIONS ---
  const totalMonthlyCommitment = subscriptions.reduce((acc, c) => acc + Number(c.amount || 0), 0) +
    loans.reduce((acc, c) => acc + Number(c.emiAmount || 0), 0);

  const totalOutstandingDebt = loans.reduce((acc, c) => acc + Number(c.remainingBalance || 0), 0);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} /></div>;

  return (
    <div className="space-y-8 relative transition-colors duration-200">

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recurring & EMIs</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Audit subscriptions, upcoming subscriptioning cycles, and amortized debt metrics.</p>
        </div>
        <button onClick={() => navigate('/Calculator')} className="flex cursor-pointer items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-xs shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
          Open Planning Calculators <ArrowRight size={14} className="text-slate-400 dark:text-slate-500" />
        </button>
      </header>

      {/* METRICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Monthly Fixed Outflow</span>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">₹{totalMonthlyCommitment.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner"><CreditCard size={20} /></div>
        </div>
        {/* Placeholder for Upcoming - You can calculate this dynamically later using Date() */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Active Subscriptions</span>
            <p className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{subscriptions.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner"><CalendarClock size={20} /></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Outstanding Debt Aggregate</span>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">₹{totalOutstandingDebt.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center shadow-inner"><Percent size={20} /></div>
        </div>
      </div>

      {/* WORKSPACE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* SUBSCRIPTIONS VIEW */}
        <div className="space-y-4">
          <div className="flex justify-between items-end pl-1">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active subscriptions</h3>
            <button onClick={() => setIsSubscriptionModalOpen(true)} className="text-xs cursor-pointer font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:text-indigo-700 dark:hover:text-indigo-300">
              <Plus size={14} /> Add Subscription
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors duration-200">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {subscriptions.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400 dark:text-slate-500">No active subscriptions found.</div>
              ) : subscriptions.map((sub) => (
                <div key={sub._id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{sub.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        Due: Day {sub.dueDate} • {sub.isAutoDebit ? <span className="text-indigo-600 dark:text-indigo-400">Auto-debit</span> : 'Manual Pay'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 dark:text-white">₹{Number(sub.amount).toLocaleString('en-IN')}</p>
                      <span className="inline-block text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider mt-1">
                        {sub.billingCycle}
                      </span>
                    </div>
                    <button onClick={() => handleDeletesubscription(sub._id)} className="p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-opacity cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOANS VIEW */}
        <div className="space-y-4">
          <div className="flex justify-between items-end pl-1">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Loans</h3>
            <button onClick={() => setIsLoanModalOpen(true)} className="text-xs cursor-pointer font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:text-indigo-700 dark:hover:text-indigo-300">
              <Plus size={14} /> Add Loan
            </button>
          </div>

          <div className="space-y-4">
            {loans.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 p-6 text-center text-sm text-slate-400 dark:text-slate-500 transition-colors duration-200">No active loans found.</div>
            ) : loans.map((loan) => {
              const progress = ((loan.totalPrincipal - loan.remainingBalance) / loan.totalPrincipal) * 100;
              return (
                <div key={loan._id} className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{loan.name}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-semibold">
                        Interest Rate: <span className="text-slate-800 dark:text-slate-300 font-black">{loan.interestRate}%</span> • Due: Day {loan.dueDate}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        {loan.isAutoDebit ? <span className="text-indigo-600 dark:text-indigo-400">Auto-debit</span> : 'Manual Pay'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Monthly EMI</span>
                      <p className="text-base font-black text-indigo-600 dark:text-indigo-400">₹{Number(loan.emiAmount).toLocaleString('en-IN')}/mo</p>
                      <button onClick={() => handleDeleteLoan(loan._id)} className="p-1 bg-rose-50 dark:bg-rose-500/10 rounded-sm hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-opacity cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      <span>Paid: ₹{(loan.totalPrincipal - loan.remainingBalance).toLocaleString('en-IN')}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-black">{progress.toFixed(0)}% Settled</span>
                      <span>Remaining: ₹{loan.remainingBalance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* --- ADD SUBSCRIPTION MODAL --- */}
      {isSubscriptionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-xl border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Subscription</h3>
              <button onClick={() => setIsSubscriptionModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubscription} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Name</label>
                <input required type="text" value={subscriptionForm.name} onChange={(e) => setSubscriptionForm({ ...subscriptionForm, name: e.target.value })} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 outline-none" placeholder="e.g. Netflix" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Amount (₹)</label>
                  <input required type="number" value={subscriptionForm.amount} onChange={(e) => setSubscriptionForm({ ...subscriptionForm, amount: e.target.value })} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Due Date (1-31)</label>
                  <input required type="number" min="1" max="31" value={subscriptionForm.dueDate} onChange={(e) => setSubscriptionForm({ ...subscriptionForm, dueDate: e.target.value })} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="autoDebit" checked={subscriptionForm.isAutoDebit} onChange={(e) => setSubscriptionForm({ ...subscriptionForm, isAutoDebit: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-400" />
                <label htmlFor="autoDebit" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Enable Auto-debit</label>
              </div>
              <button type="submit" className="w-full bg-indigo-700 dark:bg-indigo-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors">Save subscription</button>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD LOAN MODAL --- */}
      {isLoanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-xl border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Loan</h3>
              <button onClick={() => setIsLoanModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLoan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Loan Name</label>
                <input required type="text" value={loanForm.name} onChange={(e) => setLoanForm({ ...loanForm, name: e.target.value })} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400" placeholder="e.g. Education Loan" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Principal (₹)</label>
                  <input required type="number" value={loanForm.totalPrincipal} onChange={(e) => setLoanForm({ ...loanForm, totalPrincipal: e.target.value })} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">EMI Amount (₹)</label>
                  <input required type="number" value={loanForm.emiAmount} onChange={(e) => setLoanForm({ ...loanForm, emiAmount: e.target.value })} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Interest Rate (%)</label>
                  <input required type="number" step="0.1" value={loanForm.interestRate} onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Due Date (1-31)</label>
                  <input required type="number" min="1" max="31" value={loanForm.dueDate} onChange={(e) => setLoanForm({ ...loanForm, dueDate: e.target.value })} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="autoDebit" checked={loanForm.isAutoDebit} onChange={(e) => setLoanForm({ ...loanForm, isAutoDebit: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-400" />
                  <label htmlFor="autoDebit" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Enable Auto-debit</label>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-700 dark:bg-indigo-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors">Save Loan</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default BillsAndEMIs;