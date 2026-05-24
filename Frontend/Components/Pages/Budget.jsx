import React, { useState } from 'react';
import {
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Flame,
  X,
  Plus,
  Pencil,
  Trash2,
  Info
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
function Budget() {
  // --- STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category'); // 'global' or 'category'
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  const [budgetForm, setBudgetForm] = useState({
    category: 'Food & Groceries',
    limitAmount: ''
  });

  // MOCK DATA 1: The Global Absolute Limit
  const [globalLimit, setGlobalLimit] = useState(50000);

  const [Budgets, setBudgets] = useState([{
    category: 'Loading...',
    spent: 0,
    amount: 0
  }]);
  useEffect(() => {
    const fetchBudgetSummary = async () => {
      try {
        const response = await fetch('http://localhost:3000/budgets/summary', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch budget summary');
        }
        const data = await response.json();
        setBudgets(data);
      } catch (err) {
        toast.error('Server error.');
      }
    };
    fetchBudgetSummary();

    const fetchUntrackedBudget = async () => {
      try {
        const response = await fetch('http://localhost:3000/budgets/untracked', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch untracked budget summary');
        }
        const data = await response.json();
        setUnbudgetedSpending(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error('Server error.');
      }
    }
    fetchUntrackedBudget();

    const fetchGlobalLimit = async () => {
      try {
        const response = await fetch('http://localhost:3000/budget/global', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch global limit');
        }
        const data = await response.json();
        setGlobalLimit(data.totalAmount);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error('Server error.');
      }
    }
    fetchGlobalLimit();
  }, [triggerRefresh]);
  const [unbudgetedSpending, setUnbudgetedSpending] = useState([
    {
      category: 'Loading...',
      spent: 0
    },
  ]);
  const handleDeleteCategory = async (categoryToDelete) => {
    try {
      const response = await fetch(`http://localhost:3000/budget/track/${categoryToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        toast.error('Failed to delete category limit. Please try again.');
        return;
      }
      toast.success(`Deleted limit for category: ${categoryToDelete}`);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error('Network error. Is the server running?');
    }
    setBudgets(prevBudgets => prevBudgets.filter(b => b.category !== categoryToDelete));
    setTriggerRefresh((prev) => prev + 1);
  };

  // --- DERIVED CALCULATIONS ---
  const trackedSpent = Budgets.reduce((acc, curr) => acc + Number(curr.spent), 0);
  const unbudgetedSpent = unbudgetedSpending.reduce((acc, curr) => acc + Number(curr.spent), 0);

  const absoluteTotalSpent = trackedSpent + unbudgetedSpent;
  const globalPercentage = globalLimit > 0 ? ((absoluteTotalSpent / globalLimit) * 100).toFixed(1) : 0;

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setBudgetForm({ ...budgetForm, [e.target.id]: e.target.value });
  };

  const openModal = (type, defaultCategory = 'food_groceries') => {
    setModalType(type);
    setBudgetForm({ ...budgetForm, category: defaultCategory, limitAmount: type === 'global' ? globalLimit : '' });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (modalType === 'global') {
      try {
        // 1. Added the full localhost URL so it hits Express
        const response = await fetch('http://localhost:3000/budget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "totalAmount": Number(budgetForm.limitAmount) }) // Converted to Number just to be safe!
        });

        if (!response.ok) {
          toast.error('Failed to update global limit.');
          return;
        }

        toast.success(`Updated Limit to: ₹${budgetForm.limitAmount}`);
        setGlobalLimit(Number(budgetForm.limitAmount));

      } catch (error) {
        console.error("Fetch error:", error);
        toast.error('Network error. Is the server running?');
      }

    } else {
      const response = await fetch('http://localhost:3000/budget/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: budgetForm.category,
          amount: Number(budgetForm.limitAmount)
        })
      });

      if (!response.ok) {
        toast.error('Failed to save category limit.');
        return;
      }
      toast.success(`Saved: ${budgetForm.category} at ₹${budgetForm.limitAmount}`);
    }
    setBudgetForm({ category: 'food_groceries', limitAmount: '' });
    setIsModalOpen(false);
    setTriggerRefresh((prev) => prev + 1);
  };

  return (
    <div className="relative space-y-6 max-w-4xl mx-auto pb-10">

      {/* 1. HEADER SECTION */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Monthly Budget</h2>
          <p className="text-sm text-slate-500 mt-0.5">Track and enforce your spending limits</p>
        </div>
        <button
          onClick={() => openModal('category')}
          className="flex items-center gap-2 cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add / Edit Category Limit
        </button>
      </header>

      {/* 2. GLOBAL MONTHLY CEILING CARD */}
      {/* 2. GLOBAL MONTHLY CEILING CARD */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>

            {/* --- MODIFIED HEADER WITH VISIBLE EDIT BUTTON --- */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Absolute Monthly Limit
              </span>
              <button
                onClick={() => openModal('global')}
                className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 cursor-pointer hover:bg-indigo-100 hover:text-indigo-700 rounded-md transition-colors border border-indigo-100 shadow-sm"
                title="Edit Total Limit"
              >
                <Pencil size={12} strokeWidth={2.5} />
                <span className="text-[10px] font-bold tracking-wide uppercase">Edit</span>
              </button>
            </div>
            {/* ------------------------------------------------ */}

            <h3 className="text-3xl font-black text-slate-900">
              ₹{absoluteTotalSpent.toLocaleString('en-IN')}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              of ₹{globalLimit.toLocaleString('en-IN')} total limit
            </p>
          </div>
          <div className="text-right mt-1">
            <span className={`text-3xl font-black ${globalPercentage > 90 ? 'text-rose-600' : 'text-indigo-600'}`}>
              {globalPercentage}%
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${globalPercentage > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
            style={{ width: `${Math.min(globalPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 3. TRACKED CATEGORIES GRID */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Tracked Categories</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Budgets.map((budget) => {

            // 🌟 THE MATH: Calculate the percentage dynamically here!
            let spent = Number(budget.spent) || 0;
            let amount = Number(budget.amount) || 0;

            let rawPercentage = amount > 0 ? (spent / amount) * 100 : 0;
            let cappedPercentage = Math.min(rawPercentage, 100);
            let displayPercentage = rawPercentage.toFixed(1);

            let trackColor = "bg-emerald-500";
            let badgeStyle = "bg-emerald-50 text-emerald-700";
            let icon = <CheckCircle2 size={14} />;

            if (rawPercentage >= 100) {
              trackColor = "bg-rose-500";
              badgeStyle = "bg-rose-50 text-rose-700";
              icon = <Flame size={14} />;
            } else if (rawPercentage >= 80) {
              trackColor = "bg-amber-500";
              badgeStyle = "bg-amber-50 text-amber-700";
              icon = <AlertTriangle size={14} />;
            }

            return (
              <div key={budget.category || Math.random()} className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-bold text-slate-900">{budget.category || "Loading..."}</h5>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      ₹{spent.toLocaleString('en-IN')} / ₹{amount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* --- MODIFIED SECTION: Action Buttons Container --- */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteCategory(budget.category)}
                      className="p-1.5 text-rose-400 bg-rose-50 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all cursor-pointer"
                      title="Delete Limit"
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className={`p-1.5 rounded-lg ${badgeStyle}`}>
                      {icon}
                    </span>
                  </div>
                  {/* ------------------------------------------------ */}

                </div>

                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${trackColor} transition-all duration-300`}
                      style={{ width: `${cappedPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-400">
                    {displayPercentage}% Used
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. UNBUDGETED SPENDING WARNING (The Catch-All Bucket) */}
      {unbudgetedSpending.length > 0 && (
        <div className="space-y-4 mt-8">
          <div className="flex items-center gap-2 pl-1">
            <Info size={16} className="text-slate-400" />
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Unbudgeted Spending</h4>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden divide-y divide-slate-100">
            {unbudgetedSpending.map((item) => (
              <div key={item.category} className="p-4 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{item.category}</h5>
                  <p className="text-xs text-slate-500 font-medium">₹{item.spent.toLocaleString('en-IN')} spent with no active limit</p>
                </div>
                <button
                  onClick={() => openModal('category', item.category)}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  + Set Limit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MULTI-PURPOSE MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-2 text-indigo-600 mb-6">
                <Sliders size={20} />
                <h3 className="font-bold text-slate-900 text-lg">
                  {modalType === 'global' ? 'Set Total Monthly Budget' : 'Configure Category Limit'}
                </h3>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">

                {/* Only show category dropdown if we are setting a category limit */}
                {modalType === 'category' && (
                  <div>
                    <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
                    <select
                      id="category" value={budgetForm.category} onChange={handleInputChange}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    >
                      <option value="Food & Groceries">Food & Groceries</option>
                      <option value="Bills & EMIs">Bills & EMIs</option>
                      <option value="Education & Skilling">Education & Skilling</option>
                      <option value="Travel & Cabs">Travel & Cabs</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Rent & PG/Hostel">Rent & PG/Hostel</option>
                      <option value="Subscriptions & Entertainment">Subscriptions & Entertainment</option>
                      <option value="Investments & Savings">Investments & Savings</option>
                      <option value="Pharmacy & Medical">Medical</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="limitAmount" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {modalType === 'global' ? 'Absolute Maximum (₹)' : 'Monthly Limit (₹)'}
                  </label>
                  <input
                    type="number" id="limitAmount" placeholder="e.g. 50000" required
                    value={budgetForm.limitAmount} onChange={handleInputChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-semibold"
                  />
                  {modalType === 'global' && (
                    <p className="text-xs text-slate-400 mt-2">This is the maximum amount you want to spend across ALL categories combined this month.</p>
                  )}
                </div>

                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 mt-2">
                  Save Budget
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Budget;