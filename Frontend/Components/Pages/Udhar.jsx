import React, { useState, useEffect } from 'react';
import {
  User,
  Search,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  HandCoins,
  CheckCircle2,
  UserPlus,
  X
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Layouts/Loader';
import ConfirmModal from '../Layouts/Confirm';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Udhar() {
  const [isLoading, setIsLoading] = useState(true);
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Master list of all records
  const [peerRecords, setPeerRecords] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Summary States
  const [totalOwesMe, setTotalOwesMe] = useState(0);
  const [totalIOwe, setTotalIOwe] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form input state management
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    amount: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 1. FETCH MASTER LIST: Runs once on mount, and whenever refreshTrigger updates
  useEffect(() => {
    const fetchAllUdharEntries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/udhars`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPeerRecords(data); // Save to Master List
        } else {
          toast.error('Failed to fetch udhar entries');
        }
      } catch (error) {
        console.error('Error fetching udhar entries:', error);
        toast.error('Failed to fetch udhar entries');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllUdharEntries();
  }, [refreshTrigger]); // Removed searchTerm and filterType dependencies

  // 2. CALCULATE GLOBAL SUMMARIES: Locks onto the Master List
  useEffect(() => {
    const OwesMe = peerRecords.filter(p => p.type === 'gave').reduce((acc, c) => acc + c.amount, 0);
    const IOwe = peerRecords.filter(p => p.type === 'took').reduce((acc, c) => acc + c.amount, 0);
    const Balance = OwesMe - IOwe;

    setTotalOwesMe(OwesMe);
    setTotalIOwe(IOwe);
    setNetBalance(Balance);
  }, [peerRecords]);

  // 3. DERIVE DISPLAY LIST: Filters the master list instantly for the UI
  const displayedRecords = peerRecords.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || person.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Handle Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.type) {
      toast.warning('Please select an Operation Mode (Lent or Borrowed).');
      setIsLoading(false);
      return;
    }

    // Ensure amount is passed as a number
    const payload = {
      ...formData,
      amount: Number(formData.amount)
    };
    try {
      const response = await fetch(`${BASE_URL}/udhar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        toast.success('Udhar entry saved successfully');
        setFormData({
          type: '',
          name: '',
          amount: '',
          description: ''
        });
        setRefreshTrigger(refreshTrigger + 1); // Triggers re-fetch
      } else {
        toast.error('Failed to log udhar entry');
      }
    } catch (error) {
      console.error('Error logging udhar entry:', error);
      toast.error('An error occurred while saving the udhar entry');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Deletion/Settlement
  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/udhar/${itemToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        toast.success('Transaction marked as settled');
        setRefreshTrigger(refreshTrigger + 1); // Triggers re-fetch
      } else {
        toast.error('Failed to mark transaction as settled');
      }
    } catch (error) {
      console.error('Error marking transaction as settled:', error);
      toast.error('An error occurred while marking the transaction as settled');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Date Formatter Helper
  const formatRelativeDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* HEADER SECTION */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Udhar Book (Friends Ledger)</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track informal lending, peer-to-peer debt matrices, and group splits.</p>
      </header>

      {/* CORE FINANCIAL STANDING METRIC STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">You are Owed (To Receive)</span>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">₹{totalOwesMe.toLocaleString('en-IN')}</p>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Funds lent out to friends</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner"><ArrowUpRight size={20} /></div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">You Owe (To Pay Back)</span>
            <p className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">₹{totalIOwe.toLocaleString('en-IN')}</p>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Pending dues on your side</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center shadow-inner"><ArrowDownLeft size={20} /></div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Net Summary Position</span>
            <p className={`text-3xl font-black tracking-tight ${netBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-700 dark:text-rose-400'}`}>
              {netBalance >= 0 ? `+ ₹${netBalance.toLocaleString('en-IN')}` : `- ₹${Math.abs(netBalance).toLocaleString('en-IN')}`}
            </p>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Overall calculated cash vector</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shadow-inner"><HandCoins size={20} /></div>
        </div>
      </div>

      {/* CORE DISPLAY/MANAGEMENT CONTROLS GRID 
          UPDATED: Uses flex-col for mobile (with manual order) and grid for desktop 
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">

        {/* LEFT COMPONENT COLUMN: ACTIVE FRIEND LISTINGS AND FILTERS 
            UPDATED: order-2 on mobile (bottom), lg:order-1 on desktop (left)
        */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-4">

          {/* CONTROL BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search friend name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all cursor-pointer"
            >
              <option value="all">All People</option>
              <option value="gave">Owes Me (Green)</option>
              <option value="took">I Owe (Red)</option>
            </select>
          </div>

          {/* DYNAMIC FRIENDS FEED STREAM LEDGER CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm overflow-y-auto h-[450px] transition-colors duration-200">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedRecords.length > 0 ? (
                displayedRecords.map((person) => {
                  const isOwedToMe = person.type === 'gave';
                  return (
                    <div key={person.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        {/* Profile Initials Circular Avatar Frame */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner
                          ${isOwedToMe ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'}`}
                        >
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{person.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
                            {person.description} • <span className="text-slate-500 dark:text-slate-400 font-normal">{formatRelativeDate(person.date)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-base font-black tracking-tight ${isOwedToMe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            ₹{person.amount.toLocaleString('en-IN')}
                          </p>
                          <span className={`text-[9px] font-bold uppercase tracking-wider block mt-0.5 text-slate-500 dark:text-slate-400`}>
                            {isOwedToMe ? 'Owes You' : 'You Owe'}
                          </span>
                        </div>

                        {/* Settle Up Action Button visible on row hover layout blocks */}
                        <button
                          onClick={() => {
                            setItemToDelete(person._id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg cursor-pointer transition-all duration-150"
                          title="Mark Settled"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                  No records found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: LOAN TRANSACTION INPUT CONFIGURATION CARD 
            UPDATED: order-1 on mobile (top), lg:order-2 on desktop (right)
        */}
        <div className="order-1 lg:order-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Log New Udhar</h3>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 transition-colors duration-200">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-6">
              <UserPlus size={18} />
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Record Adjustment</h4>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Paradigm Type Selector Toggle buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Operation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'gave' })}
                    className={`py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.type === 'gave' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 ring-4 ring-emerald-50 dark:ring-emerald-500/10' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    Lent (Gave Money)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'took' })}
                    className={`py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.type === 'took' ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 ring-4 ring-rose-50 dark:ring-rose-500/10' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    Borrowed (Took Money)
                  </button>
                </div>
              </div>

              {/* Friend Name string descriptor tag */}
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Friend's Identity
                </label>
                <input
                  type="text" id="name" placeholder="e.g., Rohit Kumar" required
                  value={formData.name} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium text-sm placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Magnitude valuation input parameter */}
              <div>
                <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Absolute Amount (INR)
                </label>
                <input
                  min={0}
                  onWheel={(e) => e.target.blur()}
                  type="number" id="amount" placeholder="₹ 0.00" required
                  value={formData.amount} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-semibold placeholder-slate-400 dark:placeholder-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Transaction Description Note */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Description
                </label>
                <input
                  type="text" id="description" placeholder="e.g., Lunch split bill at dhaba" required
                  value={formData.description} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all text-sm placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Action dispatch button submit hook */}
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm transition-all flex items-center justify-center gap-1.5 pt-2 cursor-pointer"
              >
                <PlusCircle size={16} /> Save Record
              </button>
            </form>
          </div>
        </div>

      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        title="Confirm Settlment?"
        message={`Are you sure you want to mark this Uhar as settled.`}
        confirmText="Yes"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div >
  );
}

export default Udhar;