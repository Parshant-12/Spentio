import React, { useState } from 'react';
import { 
  Sliders, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Flame
} from 'lucide-react';

function Budget() {
  // Local state for handling the budget input form
  const [budgetForm, setBudgetForm] = useState({
    category: 'food_groceries',
    limitAmount: '',
    alertThreshold: '80'
  });

  // Mock data structure matching your streamlined Indian categories
  const [mockBudgets, setMockBudgets] = useState([
    { id: 1, categoryKey: 'rent_pg', label: 'Rent & PG/Hostel', spent: 15000, limit: 15000, percentage: 100 },
    { id: 2, categoryKey: 'food_groceries', label: 'Food & Groceries', spent: 12450, limit: 15000, percentage: 83 },
    { id: 3, categoryKey: 'shopping', label: 'Shopping', spent: 6820, limit: 8000, percentage: 85.2 },
    { id: 4, categoryKey: 'travel_cabs', label: 'Travel & Cabs', spent: 3420, limit: 6000, percentage: 57 },
    { id: 5, categoryKey: 'movies_outings', label: 'Movies & Outings', spent: 2079, limit: 5000, percentage: 41.5 },
  ]);

  const handleInputChange = (e) => {
    setBudgetForm({ ...budgetForm, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Committing configuration parameter: ${budgetForm.category} capped at ₹${budgetForm.limitAmount}`);
    // Reset form field magnitude values
    setBudgetForm({ ...budgetForm, limitAmount: '' });
  };

  // Calculate total metrics dynamically from the data pool
  const totalLimit = mockBudgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalSpent = mockBudgets.reduce((acc, curr) => acc + curr.spent, 0);
  const totalPercentage = ((totalSpent / totalLimit) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      
      {/* HEADER SECTION */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Budget Guardrails</h2>
        <p className="text-sm text-slate-500 mt-0.5">Establish upper execution ceilings per operational category vector.</p>
      </header>

      {/* AGGREGATED MONTHLY BURNDOWN SUMMARY BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Global Capital Ceiling</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{totalSpent.toLocaleString('en-IN')} <span className="text-slate-400 font-medium text-lg">/ ₹{totalLimit.toLocaleString('en-IN')} consumed</span>
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Overall Exhaustion: <span className="text-indigo-600 font-black">{totalPercentage}%</span>
          </span>
        </div>
        
        {/* Master multi-stage progress tracking pipeline bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${totalPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* CORE INTERACTION SPLIT GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE CEILINGS TARGET RUN RATES (2 COLS LARGE SCREENS) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Active Allocations</h4>
          
          <div className="space-y-3">
            {mockBudgets.map((budget) => {
              // Determine context styling indicators dynamically based on threshold breaches
              let trackColor = "bg-emerald-500";
              let badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
              let statusLabel = "Safe";
              let icon = <CheckCircle2 size={12} />;

              if (budget.percentage >= 100) {
                trackColor = "bg-rose-500";
                badgeStyle = "bg-rose-50 text-rose-700 border-rose-100";
                statusLabel = "Breached";
                icon = <Flame size={12} />;
              } else if (budget.percentage >= 80) {
                trackColor = "bg-amber-500";
                badgeStyle = "bg-amber-50 text-amber-700 border-amber-100";
                statusLabel = "Warning";
                icon = <AlertTriangle size={12} />;
              }

              return (
                <div key={budget.id} className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-3.5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{budget.label}</h5>
                      <p className="text-xs text-slate-400 mt-0.5 font-semibold">
                        ₹{budget.spent.toLocaleString('en-IN')} spent <span className="font-medium text-slate-300">|</span> Allowance: ₹{budget.limit.toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    {/* Status Tracker Pill Indicator */}
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${badgeStyle}`}>
                      {icon} {statusLabel}
                    </span>
                  </div>

                  {/* Linear Bar Element */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-50 border border-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${trackColor} transition-all duration-300`} 
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>0%</span>
                      <span className="text-slate-600 font-black">{budget.percentage}% Filled</span>
                      <span>100% Target</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIGURATION MANAGER INPUT FORM CARD */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Target Control</h4>
          
          <div className="bg-white border border-slate-200/70 shadow-sm rounded-2xl p-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-6">
              <Sliders size={18} />
              <h4 className="font-bold text-slate-900 text-base">Configure Threshold</h4>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Category Node Mapping Dropdown */}
              <div>
                <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Vector Category
                </label>
                <select 
                  id="category" 
                  value={budgetForm.category} 
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="food_groceries">Food & Groceries</option>
                  <option value="travel_cabs">Travel & Cabs</option>
                  <option value="bills_recharges">Bills & Recharges</option>
                  <option value="rent_pg">Rent & PG/Hostel</option>
                  <option value="shopping">Shopping</option>
                  <option value="movies_outings">Movies & Outings</option>
                  <option value="education">Education & College</option>
                  <option value="friend_transfers">Sent to Friends (UPI)</option>
                  <option value="others">Others</option>
                </select>
              </div>

              {/* Upper Ceiling Limit Input Field */}
              <div>
                <label htmlFor="limitAmount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Monthly Limit Cap (INR)
                </label>
                <input 
                  type="number" id="limitAmount" placeholder="₹ Maximum Cap limit" required
                  value={budgetForm.limitAmount} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all font-semibold"
                />
              </div>

              {/* Push Warning Threshold Dropdown Range */}
              <div>
                <label htmlFor="alertThreshold" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  System Alert Boundary Trigger
                </label>
                <select 
                  id="alertThreshold" 
                  value={budgetForm.alertThreshold} 
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="50">At 50% Exhaustion</option>
                  <option value="75">At 75% Exhaustion</option>
                  <option value="80">At 80% Exhaustion (Standard)</option>
                  <option value="90">At 90% Exhaustion (Critical)</option>
                </select>
              </div>

              {/* Action Submit Execution Button */}
              <button 
                type="submit" 
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <PlusCircle size={16} /> Establish Budget Constraint
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Budget;