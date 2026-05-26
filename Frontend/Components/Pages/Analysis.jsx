import React, { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingDown,
  TrendingUp,
  PieChart,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  BarChart3,
  CalendarDays,
} from 'lucide-react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Loader from '../Layouts/Loader';
function Analysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [viewType, setViewType] = useState('month');

  // Input tracking states
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [customStart, setCustomStart] = useState('2026-05-01');
  const [customEnd, setCustomEnd] = useState('2026-05-31');

  // API Data States
  const [metrics, setMetrics] = useState({
    currentTotal: 0,
    previousTotal: 0,
    topCategories: [],
    chartBuckets: [
      { label: 'Week 1', amount: 0 },
      { label: 'Week 2', amount: 0 },
      { label: 'Week 3', amount: 0 },
      { label: 'Week 4', amount: 0 }
    ]
  });

  // Calculate dates and fetch whenever inputs change
  useEffect(() => {
    fetchAnalysisData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewType, selectedMonth, selectedYear, customStart, customEnd]);

  const fetchAnalysisData = async () => {
    setIsLoading(true);
    try {
      let start, end, prevStart, prevEnd;

      // Determine Date Ranges based on View Type
      if (viewType === 'month') {
        const [year, month] = selectedMonth.split('-');
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0);
        prevStart = new Date(year, month - 2, 1);
        prevEnd = new Date(year, month - 1, 0);
      } else if (viewType === 'year') {
        start = new Date(selectedYear, 0, 1);
        end = new Date(selectedYear, 11, 31);
        prevStart = new Date(selectedYear - 1, 0, 1);
        prevEnd = new Date(selectedYear - 1, 11, 31);
      } else {
        start = new Date(customStart);
        end = new Date(customEnd);
        const duration = end.getTime() - start.getTime();
        prevEnd = new Date(start.getTime() - 86400000);
        prevStart = new Date(prevEnd.getTime() - duration);
      }

      const response = await fetch(`${BASE_URL}/analysis?startDate=${start.toISOString()}&endDate=${end.toISOString()}&prevStartDate=${prevStart.toISOString()}&prevEndDate=${prevEnd.toISOString()}`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error("Backend not connected yet");

      const result = await response.json();

      if (result.success) {
        const buckets = [0, 0, 0, 0];
        const totalDuration = end.getTime() - start.getTime();

        result.data.rawTransactions.forEach(txn => {
          const txnTime = new Date(txn.date).getTime();
          const progress = (txnTime - start.getTime()) / totalDuration;

          if (progress < 0.25) buckets[0] += txn.amount;
          else if (progress < 0.50) buckets[1] += txn.amount;
          else if (progress < 0.75) buckets[2] += txn.amount;
          else buckets[3] += txn.amount;
        });

        const labelPrefix = viewType === 'year' ? 'Quarter' : 'Part';

        setMetrics({
          currentTotal: result.data.currentTotal,
          previousTotal: result.data.previousTotal,
          topCategories: result.data.topCategories,
          chartBuckets: buckets.map((amt, idx) => ({
            label: viewType === 'month' ? `Week ${idx + 1}` : `${labelPrefix} ${idx + 1}`,
            amount: amt
          }))
        });
      }
    } catch (error) {
      console.warn("Using fallback data for UI testing:", error.message);
      setMetrics({
        currentTotal: 39769,
        previousTotal: 48312,
        topCategories: [
          { label: "Rent & PG/Hostel", amount: 15000, percentage: 37.7 },
          { label: "Food & Groceries", amount: 12450, percentage: 31.3 },
          { label: "Shopping", amount: 6820, percentage: 17.1 }
        ],
        chartBuckets: [
          { label: 'Week 1', amount: 8920 },
          { label: 'Week 2', amount: 16400 },
          { label: 'Week 3', amount: 10120 },
          { label: 'Week 4', amount: 4329 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculations for friendly UI messages
  const varianceAmount = metrics.currentTotal - metrics.previousTotal;
  const variancePercentage = metrics.previousTotal === 0 ? 0 : (varianceAmount / metrics.previousTotal) * 100;
  const isSpendingDown = varianceAmount <= 0;
  const maxBucketAmount = Math.max(...metrics.chartBuckets.map(b => b.amount), 1);
  const topCategoriesSum = metrics.topCategories.reduce((acc, cat) => acc + cat.amount, 0);
  const topCategoriesPercentage = metrics.currentTotal > 0 ? ((topCategoriesSum / metrics.currentTotal) * 100).toFixed(0) : 0;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 relative transition-colors duration-200">

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center rounded-3xl">
          <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
        </div>
      )}

      {/* HEADER & TIME-FRAME CONTROL */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Spending Analysis</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">See exactly where your money went during this time.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-700/50 shadow-inner self-start sm:self-auto transition-colors duration-200">
          <button onClick={() => setViewType('month')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewType === 'month' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
            By Month
          </button>
          <button onClick={() => setViewType('year')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewType === 'year' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
            By Year
          </button>
          <button onClick={() => setViewType('custom')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewType === 'custom' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
            Custom Dates
          </button>
        </div>
      </header>

      {/* DATE PICKER */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm animate-fade-in flex flex-wrap items-center gap-4 transition-colors duration-200">
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
          <SlidersHorizontal size={14} /> Choose Dates:
        </div>

        {viewType === 'month' && (
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 transition-all cursor-pointer" />
        )}

        {viewType === 'year' && (
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 transition-all cursor-pointer">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        )}

        {viewType === 'custom' && (
          <div className="flex items-center gap-2">
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-700 dark:text-slate-300 cursor-pointer" />
            <ArrowRight size={14} className="text-slate-400 dark:text-slate-500" />
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-700 dark:text-slate-300 cursor-pointer" />
          </div>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Total Spent</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">This Period</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹{metrics.currentTotal.toLocaleString('en-IN')}</p>
          <div className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold ${isSpendingDown ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isSpendingDown ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span>{isSpendingDown ? 'Great job! You spent less than last time.' : 'You spent more than the previous period.'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Compared To</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Previous Period</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
              <CalendarDays size={16} />
            </div>
          </div>
          <p className="text-4xl font-black text-slate-400 dark:text-slate-500 tracking-tight">₹{metrics.previousTotal.toLocaleString('en-IN')}</p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
            Difference: <span className={`${isSpendingDown ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} font-bold`}>
              {varianceAmount > 0 ? '+' : '-'} ₹{Math.abs(varianceAmount).toLocaleString('en-IN')}
              ({varianceAmount > 0 ? '+' : ''}{variancePercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TIMELINE CHART */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm lg:col-span-2 flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Spending Timeline</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">A breakdown of when you spent your money.</p>
              </div>
              <BarChart3 size={16} className="text-slate-400 dark:text-slate-500" />
            </div>

            <div className="h-48 flex items-end gap-4 sm:gap-8 pt-4 border-b border-slate-100 dark:border-slate-800 px-2">
              {metrics.chartBuckets.map((bucket, idx) => {
                const heightPercent = Math.max((bucket.amount / maxBucketAmount) * 100, 5);
                return (
                  <BarColumn
                    key={idx}
                    height={`${heightPercent}%`}
                    label={bucket.label}
                    amount={`₹${bucket.amount.toLocaleString('en-IN')}`}
                    active={bucket.amount === maxBucketAmount && bucket.amount > 0}
                  />
                )
              })}
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-medium mt-4">
            Your highest spending was during {metrics.chartBuckets.reduce((max, obj) => obj.amount > max.amount ? obj : max, metrics.chartBuckets[0]).label}.
          </p>
        </div>

        {/* TOP CATEGORIES */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Where Your Money Goes</h4>
              <PieChart size={16} className="text-slate-400 dark:text-slate-500" />
            </div>
            <div className="space-y-4">
              {metrics.topCategories.length > 0 ? metrics.topCategories.map((cat, idx) => {
                const colors = ['bg-indigo-600', 'bg-amber-500', 'bg-rose-500'];
                return (
                  <LinearChartBar
                    key={idx}
                    label={cat.label}
                    amount={`₹${cat.amount.toLocaleString('en-IN')}`}
                    percentage={`${cat.percentage}%`}
                    color={colors[idx] || 'bg-slate-400 dark:bg-slate-600'}
                  />
                )
              }) : <p className="text-sm text-slate-400 dark:text-slate-500 text-center">No spending recorded yet.</p>}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <Sparkles size={14} className="fill-indigo-50 dark:fill-indigo-900" />
            <span>These top items make up {topCategoriesPercentage}% of your total spending.</span>
          </div>
        </div>

      </div>

    </div>
  );
}

/* HELPER COMPONENTS */
const BarColumn = ({ height, label, amount, active }) => (
  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
    <span className="text-[10px] font-bold bg-slate-900 dark:bg-slate-700 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xs mb-1">
      {amount}
    </span>
    <div
      style={{ height: height }}
      className={`w-full rounded-t-lg transition-all duration-300 transform group-hover:scale-x-105 
      ${active ? 'bg-indigo-600 dark:bg-indigo-500 shadow-[0_4px_12px_rgba(79,70,229,0.2)] dark:shadow-[0_4px_12px_rgba(99,102,241,0.2)]' : 'bg-slate-200/80 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'}`}
    ></div>
    <span className={`text-xs font-semibold ${active ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
      {label}
    </span>
  </div>
);

const LinearChartBar = ({ label, amount, percentage, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
      <span className="text-slate-900 dark:text-white">{label}</span>
      <span className="font-bold text-slate-900 dark:text-white">{amount}</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: percentage }}></div>
    </div>
  </div>
);

export default Analysis;