import React, { useEffect, useState } from 'react';
import { Search, Filter, Trash2, Pencil, ArrowUpRight, ArrowDownLeft, RefreshCw, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import ConfirmModal from '../Layouts/Confirm';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Transactions() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/transactions`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchFilteredData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/transactions/filter/${typeFilter}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching filtered transaction data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (typeFilter === 'all') {
      fetchData();
    }
    else {
      fetchFilteredData();
    }
  }, [typeFilter]);
  useEffect(() => {
    const searchData = async () => {
      try {
        let url = `${BASE_URL}/transactions/search/${searchTerm}`;
        if (searchTerm.trim() === '') {
          url = `${BASE_URL}/transactions`;
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };
    searchData();
  }, [searchTerm]);
  const handleDelete = async () => {
    if (!itemToDelete) return; // Safeguard
    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/transaction/${itemToDelete}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        toast.error('Failed to delete transaction. Please try again.');
      }
      setData((prevData) => prevData.filter((data) => data._id !== itemToDelete));
      toast.success('Transaction deleted successfully.');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction. Please try again.');
    } finally {
      // Clean up modal states regardless of success or failure
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };
  const handleEdit = (id) => {
    const transactionToEdit = data.find(tx => tx._id === id);
    navigate('/AddTransaction', { state: { editData: transactionToEdit } });
  };
  const exportToCSV = () => {
    // 1. Define CSV headers
    const headers = ["Description", "Category", "Date", "Type", "Amount"];

    // 2. Map data to rows
    const csvRows = data.map(tx => [
      `"${tx.description}"`, // Wrapped in quotes to handle commas in descriptions
      `"${tx.category}"`,
      new Date(tx.date).toLocaleDateString(),
      tx.type,
      tx.amount
    ]);

    // 3. Combine headers and rows
    const csvString = [headers, ...csvRows].map(row => row.join(',')).join('\n');

    // 4. Create a Blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.setAttribute('href', url);
    a.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  };
  if (isLoading) {
    return <Loader message="Calculating your budgets..." />;
  }
  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* HEADER ACTION AREA */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Transaction History</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Search, isolate, and audit historical financial events.</p>
        </div>
        <button className="flex cursor-pointer items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
          onClick={exportToCSV}
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* FILTER & SEARCH UTILITIES CONTROL BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
        {/* Search Input Box */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search records by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Dropdown Paradigm Type Filtering Wrapper */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all font-medium appearance-none cursor-pointer"
          >
            <option value="all">All Operations</option>
            <option value="expense">Outbound (Expenses)</option>
            <option value="income">Inbound (Income)</option>
            <option value="transfer">Internal Transfers</option>
          </select>
        </div>
      </div>

      {/* LEDGER DATA TABLE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors duration-200">        <div className="overflow-x-auto">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4 text-right">Amount</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {data.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group">
                  {/* Title & Vector Indicators */}
                  <td className="py-4 px-6 flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-inner shrink-0
                      ${tx.type === 'income' && 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}
                      ${tx.type === 'expense' && 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}
                      ${tx.type === 'transfer' && 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}
                    `}>
                      {tx.type === 'income' && <ArrowUpRight size={16} />}
                      {tx.type === 'expense' && <ArrowDownLeft size={16} />}
                      {tx.type === 'transfer' && <RefreshCw size={14} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                      {tx.type === 'transfer' && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                          {tx.fromAccount} → {tx.toAccount}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Category Field */}
                  <td className="py-4 px-4">
                    {tx.type === 'transfer' ? (
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">
                        Transfer
                      </span>
                    ) : (
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">
                        {tx.category}
                      </span>
                    )}
                  </td>

                  {/* Date Column */}
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Normalized Currency Magnitude column */}
                  <td className={`py-4 px-4 text-right font-bold tracking-tight text-base
                    ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}
                  `}>
                    {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Context Actions column (Edit and Delete) */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          handleEdit(tx._id)
                        }}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg hover:cursor-pointer transition-all duration-150"
                        title="Edit Entry"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(tx._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg hover:cursor-pointer transition-all duration-150"
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
        {/* MOBILE VIEW: Render a card stack instead of a table */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((tx) => (
            <div key={tx._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner shrink-0
            ${tx.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    tx.type === 'expense' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                      'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={18} /> : tx.type === 'expense' ? <ArrowDownLeft size={18} /> : <RefreshCw size={16} />}
                </div>
                {/* Details */}
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{tx.description}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {tx.category} • {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                </p>
                <div className="flex justify-end gap-1 mt-1">
                  <button onClick={() => {
                    handleEdit(tx._id)
                  }} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 cursor-pointer"><Pencil size={14} /></button>
                  <button onClick={() => {
                    setItemToDelete(tx._id);
                    setIsDeleteModalOpen(true);
                  }} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        title="Delete Transaction?"
        message={`Are you sure you want to delete this transaction? This action cannot be undone and will affect your budget calculations.`}
        confirmText="Yes, Delete"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Transactions;