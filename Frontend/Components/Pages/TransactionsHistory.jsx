import React, { useEffect, useState } from 'react';
import { Search, Filter, Trash2, Pencil, ArrowUpRight, ArrowDownLeft, RefreshCw, Download } from 'lucide-react';
import { toast } from 'react-toastify';

function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/transactions', {
          method: 'GET',
          header: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };
    const fetchFilteredData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/transactions/filter/${typeFilter}`, {
          method: 'GET',
          header: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching filtered transaction data:', error);
      }
    };
    if(typeFilter === 'all'){
      fetchData();
    }
    else{
      fetchFilteredData();
    }
  }, [typeFilter]);
  useEffect(() => {
    const searchData = async () => {
      try {
        let url = `http://localhost:3000/transactions/search/${searchTerm}`;
        if(searchTerm.trim() === ''){
          url = 'http://localhost:3000/transactions';
        }
        const response = await fetch(url, {
          method: 'GET',
          header: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };
    searchData();
  }, [searchTerm]);
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/transaction/${id}`, {
        method: 'DELETE',
        header: { 'Content-Type': 'application/json' }
      });
      if(!response.ok){ 
        toast.error('Failed to delete transaction. Please try again.');
      }
      setData((prevData) => prevData.filter((data) => data._id !== id));
      toast.success('Transaction deleted successfully.');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction. Please try again.');
    }
  };
  const handleEdit = (id) => {
    
  }

  return (
    <div className="space-y-6">
      {/* HEADER ACTION AREA */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Transaction History</h2>
          <p className="text-sm text-slate-500 mt-0.5">Search, isolate, and audit historical financial events.</p>
        </div>
        <button className="flex items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-xl text-slate-700 font-semibold text-sm shadow-sm hover:bg-slate-50 transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* FILTER & SEARCH UTILITIES CONTROL BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
        {/* Search Input Box */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search records by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all"
          />
        </div>

        {/* Dropdown Paradigm Type Filtering Wrapper */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 transition-all font-medium appearance-none"
          >
            <option value="all">All Operations</option>
            <option value="expense">Outbound (Expenses)</option>
            <option value="income">Inbound (Income)</option>
            <option value="transfer">Internal Transfers</option>
          </select>
        </div>
      </div>

      {/* LEDGER DATA TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Execution Date</th>
                <th className="py-4 px-4 text-right">Magnitude</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/40 transition-colors group">
                  {/* Title & Vector Indicators */}
                  <td className="py-4 px-6 flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-inner shrink-0
                      ${tx.type === 'income' && 'bg-emerald-50 text-emerald-600'}
                      ${tx.type === 'expense' && 'bg-red-100 text-red-600'}
                      ${tx.type === 'transfer' && 'bg-indigo-50 text-indigo-600'}
                    `}>
                      {tx.type === 'income' && <ArrowUpRight size={16} />}
                      {tx.type === 'expense' && <ArrowDownLeft size={16} />}
                      {tx.type === 'transfer' && <RefreshCw size={14} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{tx.description}</p>
                      {tx.type === 'transfer' && (
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">
                          {tx.fromAccount} → {tx.toAccount}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Category Field */}
                  <td className="py-4 px-4">
                    {tx.type === 'transfer' ? (
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">
                        Transfer
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">
                        {tx.category}
                      </span>
                    )}
                  </td>

                  {/* Date Column */}
                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Normalized Currency Magnitude column */}
                  <td className={`py-4 px-4 text-right font-bold tracking-tight text-base
                    ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}
                  `}>
                    {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Context Actions column (Edit and Delete) */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(tx._id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150"
                        title="Edit Entry"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150"
                        title="Purge Entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;