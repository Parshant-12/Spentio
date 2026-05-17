import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingDown, 
  PieChart, 
  Sparkles, 
  ArrowRight,
  SlidersHorizontal,
  BarChart3,
  CalendarDays
} from 'lucide-react';

function Analysis() {
  // Navigation states: 'month' | 'year' | 'custom'
  const [viewType, setViewType] = useState('month');
  
  // Input tracking states (initialized to current 2026 placeholders)
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [customStart, setCustomStart] = useState('2026-05-01');
  const [customEnd, setCustomEnd] = useState('2026-05-17');

  return (
    <div className="space-y-8">
      
      {/* HEADER & TIME-FRAME CONTROL RIBBON */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Intelligence</h2>
          <p className="text-sm text-slate-500 mt-0.5">Simple, high-level analysis of your spending patterns.</p>
        </div>
        
        {/* PARADIGM VIEW TOGGLE CONTROL */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/40 shadow-inner self-start sm:self-auto">
          <button 
            onClick={() => setViewType('month')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewType === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Month View
          </button>
          <button 
            onClick={() => setViewType('year')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewType === 'year' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Year View
          </button>
          <button 
            onClick={() => setViewType('custom')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewType === 'custom' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Custom Range
          </button>
        </div>
      </header>

      {/* CONDITIONAL DRILL-DOWN PARAMETER PICKER */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm animate-fade-in flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <SlidersHorizontal size={14} /> Adjust Horizon:
        </div>

        {/* Option A: Specific Month Picker */}
        {viewType === 'month' && (
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        )}

        {/* Option B: Specific Year Dropdown */}
        {viewType === 'year' && (
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          >
            <option value="2026">Year 2026</option>
            <option value="2025">Year 2025</option>
            <option value="2024">Year 2024</option>
          </select>
        )}

        {/* Option C: Custom Calendar Range Picker */}
        {viewType === 'custom' && (
          <div className="flex items-center gap-2">
            <input 
              type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            />
            <ArrowRight size={14} className="text-slate-400" />
            <input 
              type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            />
          </div>
        )}
      </div>

      {/* CORE MONTH-OVER-MONTH SUMMARY OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Selected Range Total</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Active Period Position</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-4xl font-black text-slate-900 tracking-tight">₹39,769.00</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <TrendingDown size={14} />
            <span>Spending drops within safe parameters for this window.</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Baseline Anchor</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Previous Period Position</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
              <CalendarDays size={16} />
            </div>
          </div>
          <p className="text-4xl font-black text-slate-400 tracking-tight">₹48,312.00</p>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
            Variance: <span className="text-emerald-600 font-bold">- ₹8,543.00 (- 17.6%)</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC VISUALIZATION GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INTERACTIVE WEEKLY/MONTHLY BAR CHART ENGINE BLOCK */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Weekly Burn Velocity</h4>
                <p className="text-xs text-slate-400 mt-0.5">Observational split across active intervals.</p>
              </div>
              <BarChart3 size={16} className="text-slate-400" />
            </div>

            {/* HIGH-POLISH TAILWIND CHART GRID SYSTEM */}
            <div className="h-48 flex items-end gap-4 sm:gap-8 pt-4 border-b border-slate-100 px-2">
              <BarColumn height="h-[45%]" label="Week 1" amount="₹8,920" />
              <BarColumn height="h-[85%]" label="Week 2" amount="₹16,400" active={true} />
              <BarColumn height="h-[55%]" label="Week 3" amount="₹10,120" />
              <BarColumn height="h-[25%]" label="Week 4" amount="₹4,329" />
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-400 font-medium mt-4">
            Week 2 maintains peak velocity due to monthly Rent & PG/Hostel clearings.
          </p>
        </div>

        {/* SECTION B: PARETO DISTRIBUTION BURNDOWN */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-900 text-base">Top Categories</h4>
              <PieChart size={16} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              <LinearChartBar label="Rent & PG/Hostel" amount="₹15,000" percentage="37.7%" color="bg-indigo-600" />
              <LinearChartBar label="Food & Groceries" amount="₹12,450" percentage="31.3%" color="bg-amber-500" />
              <LinearChartBar label="Shopping" amount="₹6,820" percentage="17.1%" color="bg-rose-500" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-indigo-600 text-xs font-bold">
            <Sparkles size={14} className="fill-indigo-50" />
            <span>These three items consume 86.1% of total outbounds.</span>
          </div>
        </div>

      </div>

    </div>
  );
}

/* HELPER PRESENTATIONAL COMPONENT WRAPPERS */
const BarColumn = ({ height, label, amount, active }) => (
  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
    {/* Dynamic Amount Bubble Tooltip on Hover */}
    <span className="text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xs mb-1">
      {amount}
    </span>
    {/* Bar Graphic */}
    <div className={`w-full ${height} rounded-t-lg transition-all duration-300 transform group-hover:scale-x-105 
      ${active ? 'bg-indigo-600 shadow-[0_4px_12px_rgba(79,70,229,0.2)]' : 'bg-slate-200/80 group-hover:bg-slate-300'}`}
    ></div>
    {/* Horizontal axis description label */}
    <span className={`text-xs font-semibold ${active ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

const LinearChartBar = ({ label, amount, percentage, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-semibold text-slate-700">
      <span className="text-slate-900">{label}</span>
      <span className="font-bold text-slate-900">{amount}</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: percentage }}></div>
    </div>
  </div>
);

export default Analysis;