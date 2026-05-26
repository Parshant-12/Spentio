import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Utensils,
  Car,
  Layers,
  Receipt
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../Layouts/Loader';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default monthly budget limit (You can fetch this from your DB later)
  const monthlyBudget = 50000;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/transactions`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          cache: 'no-store'
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        toast.error("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- CALCULATIONS ---
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // 1. Filter transactions by this month
  const thisMonthTxns = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  // 2. Calculate Totals
  const totalIncome = thisMonthTxns
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = thisMonthTxns
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Lifetime balance (All time income - All time expense)
  const totalBalance = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0) -
    transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

  // 3. Daily Velocity (Today vs Yesterday)
  const todayString = now.toISOString().split('T')[0];
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  const todaySpent = transactions
    .filter(tx => tx.type === 'expense' && tx.date.startsWith(todayString))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const yesterdaySpent = transactions
    .filter(tx => tx.type === 'expense' && tx.date.startsWith(yesterdayString))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const dailyDifference = todaySpent - yesterdaySpent;
  const isSpendingUp = dailyDifference > 0;

  // 4. Budget Calculation
  const budgetPercentage = Math.min((totalExpense / monthlyBudget) * 100, 100).toFixed(1);
  const remainingBudget = monthlyBudget - totalExpense;

  // 5. Get 4 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 transition-colors duration-200">

      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your money at a glance.</p>
        </div>
        <button
          onClick={() => navigate('/AddTransaction')}
          className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 cursor-pointer"
        >
          <PlusCircle size={16} /> New Transaction
        </button>
      </header>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Available Balance" value="All-time" amount={`₹${totalBalance.toLocaleString('en-IN')}`} icon={<Wallet size={20} />} trendColor="text-indigo-600 dark:text-indigo-400" bgCircle="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" />
        <StatCard title="Total Income" value="This Month" amount={`₹${totalIncome.toLocaleString('en-IN')}`} icon={<ArrowUpRight size={20} />} trendColor="text-emerald-600 dark:text-emerald-400" bgCircle="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
        <StatCard title="Total Expenses" value="This Month" amount={`₹${totalExpense.toLocaleString('en-IN')}`} icon={<ArrowDownLeft size={20} />} trendColor="text-rose-600 dark:text-rose-400" bgCircle="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" />
      </div>

      {/* SECONDARY ROW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* DAILY SPENDING COMPARE */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Daily Spending</h3>
              <span className="text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full font-medium">Real-time</span>
            </div>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Spent Today</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">₹{todaySpent.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Spent Yesterday</span>
                <span className="text-base font-bold text-slate-700 dark:text-slate-300">₹{yesterdaySpent.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          <div className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-medium ${isSpendingUp ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isSpendingUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>
              {isSpendingUp
                ? `You have spent ₹${Math.abs(dailyDifference).toLocaleString('en-IN')} more than yesterday.`
                : `You have spent ₹${Math.abs(dailyDifference).toLocaleString('en-IN')} less than yesterday.`}
            </span>
          </div>
        </div>

        {/* BUDGET PROGRESS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Monthly Budget</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">How close you are to your limit.</p>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{budgetPercentage}%</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">₹{totalExpense.toLocaleString('en-IN')} / ₹{monthlyBudget.toLocaleString('en-IN')} limit</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${budgetPercentage > 90 ? 'bg-rose-500' : budgetPercentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${budgetPercentage}%` }}></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            {remainingBudget > 0
              ? `Safe to spend: ₹${remainingBudget.toLocaleString('en-IN')} remaining.`
              : `Budget exceeded by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}.`}
          </p>
        </div>

        {/* QUICK ACTIONS / CATEGORY SHORTCUT */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Category Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">View your full analysis.</p>
            <div className="h-28 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-medium p-4 text-center">
              Want to see exactly where your money goes? Check the Analysis tab for pie charts and timelines.
              <button
                onClick={() => navigate('/Analysis')}
                className="mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Open Analysis
              </button>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Food</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Travel</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Bills</span>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Transactions</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Your latest activity.</p>
          </div>
          <button
            onClick={() => navigate('/TransactionsHistory')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(tx => (
              <TransactionRowItem
                key={tx._id}
                icon={<Receipt size={16} />}
                label={tx.description || tx.category}
                subtitle={tx.category}
                date={new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                amount={`${tx.type === 'income' ? '+' : '-'} ₹${tx.amount.toLocaleString('en-IN')}`}
                type={tx.type}
              />
            ))
          ) : (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">No recent transactions found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */
const StatCard = ({ title, value, amount, icon, trendColor, bgCircle }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-200">
    <div className="space-y-1">
      <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">{title}</span>
      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{amount}</p>
      <span className={`text-xs block font-medium ${trendColor}`}>{value}</span>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${bgCircle}`}>
      {icon}
    </div>
  </div>
);

const TransactionRowItem = ({ icon, label, subtitle, date, amount, type }) => (
  <div className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{subtitle} • {date}</p>
      </div>
    </div>
    <span className={`text-sm font-bold tracking-tight ${type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
      {amount}
    </span>
  </div>
);

export default Dashboard;