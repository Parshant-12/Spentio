import React, { useState } from 'react';
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
import { useEffect } from 'react';

function Udhar() {
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [peerRecords, setPeerRecords] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalOwesMe, setTotalOwesMe] = useState(0);
  const [totalIOwe, setTotalIOwe] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

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

  useEffect(() => {
    let URL = `http://localhost:3000/udhars/search/${searchTerm}`;
    if (searchTerm.trim() === '') {
      URL = 'http://localhost:3000/udhars';
    }
    const searchUdharEntries = async () => {
      try {
        const response = await fetch(URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setPeerRecords(data);
        } else {
          toast.error('Failed to fetch udhar entries');
        }
      } catch (error) {
        console.error('Error fetching udhar entries:', error);
        toast.error('Failed to fetch udhar entries');
      }
    };
    searchUdharEntries();
  }, [searchTerm]);

  useEffect(() => {
    try {
      let URL = `http://localhost:3000/udhars/filter/${filterType}`;
      if (filterType === 'all') {
        URL = "http://localhost:3000/udhars";
        // setRefreshTrigger(refreshTrigger + 1);
      }
      const fetchUdharEntries = async () => {
        const response = await fetch(URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setPeerRecords(data);
        } else {
          toast.error('Failed to fetch udhar entries');
        }
      };
      fetchUdharEntries();
    } catch (error) {
      console.error('Error fetching udhar entries:', error);
      toast.error('Failed to fetch udhar entries');
    }
  }, [filterType, refreshTrigger]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) {
      toast.warning('Please select an Operation Mode (Lent or Borrowed).');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/udhar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.success('Udhar entry saved successfully');
        setRefreshTrigger(refreshTrigger + 1);
      } else {
        toast.error('Failed to log udhar entry');
      }
    } catch (error) {
      console.error('Error logging udhar entry:', error);
      toast.error('An error occurred while saving the udhar entry');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/udhar/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        toast.success('Transaction marked as settled');
        setRefreshTrigger(refreshTrigger + 1);
      } else {
        toast.error('Failed to mark transaction as settled');
      }
    } catch (error) {
      console.error('Error marking transaction as settled:', error);
      toast.error('An error occurred while marking the transaction as settled');
    }
  };
  useEffect(() => {
    const OwesMe = peerRecords.filter(p => p.type === 'gave').reduce((acc, c) => acc + c.amount, 0);
    const IOwe = peerRecords.filter(p => p.type === 'took').reduce((acc, c) => acc + c.amount, 0);
    const Balance = OwesMe - IOwe;
    setTotalOwesMe(OwesMe);
    setTotalIOwe(IOwe);
    setNetBalance(Balance);
  }, [peerRecords]);

  // Add this helper function outside of your useEffects
  const formatRelativeDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // 1. Check if it's Today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }

    // 2. Check if it's Yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // 3. Otherwise, format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero (e.g., '05')
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Udhar Book (Friends Ledger)</h2>
        <p className="text-sm text-slate-500 mt-0.5">Track informal lending, peer-to-peer debt matrices, and group splits.</p>
      </header>

      {/* CORE FINANCIAL STANDING METRIC STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">You are Owed (To Receive)</span>
            <p className="text-3xl font-black text-emerald-600 tracking-tight">₹{totalOwesMe.toLocaleString('en-IN')}</p>
            <span className="text-xs text-slate-400 block font-medium">Funds lent out to friends</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><ArrowUpRight size={20} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">You Owe (To Pay Back)</span>
            <p className="text-3xl font-black text-rose-600 tracking-tight">₹{totalIOwe.toLocaleString('en-IN')}</p>
            <span className="text-xs text-slate-400 block font-medium">Pending dues on your side</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner"><ArrowDownLeft size={20} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Net Summary Position</span>
            <p className={`text-3xl font-black tracking-tight ${netBalance >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
              {netBalance >= 0 ? `+ ₹${netBalance.toLocaleString('en-IN')}` : `- ₹${Math.abs(netBalance).toLocaleString('en-IN')}`}
            </p>
            <span className="text-xs text-slate-400 block font-medium">Overall calculated cash vector</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shadow-inner"><HandCoins size={20} /></div>
        </div>
      </div>

      {/* CORE DISPLAY/MANAGEMENT CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COMPONENT COLUMN: ACTIVE FRIEND LISTINGS AND FILTERS */}
        <div className="lg:col-span-2 space-y-4">

          {/* CONTROL BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search friend name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All People</option>
              <option value="gave">Owes Me (Green)</option>
              <option value="took">I Owe (Red)</option>
            </select>
          </div>

          {/* DYNAMIC FRIENDS FEED STREAM LEDGER CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-y-auto h-[450px]">
            <div className="divide-y divide-slate-100">
              {peerRecords.length > 0 ? (
                peerRecords.map((person) => {
                  const isOwedToMe = person.type === 'gave';
                  return (
                    <div key={person.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-100 transition-colors group">
                      <div className="flex items-center gap-4">
                        {/* Profile Initials Circular Avatar Frame */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner
                          ${isOwedToMe ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                        >
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{person.name}</p>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                            {person.description} • <span className="text-slate-500 font-normal">{formatRelativeDate(person.date)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-base font-black tracking-tight ${isOwedToMe ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ₹{person.amount.toLocaleString('en-IN')}
                          </p>
                          <span className={`text-[9px] font-bold uppercase tracking-wider block mt-0.5`}>
                            {isOwedToMe ? 'Owes You' : 'You Owe'}
                          </span>
                        </div>

                        {/* Settle Up Action Button visible on row hover layout blocks */}
                        <button
                          onClick={() => handleDelete(person._id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg cursor-pointer transition-all duration-150"
                          title="Mark Settled"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-sm font-medium text-slate-400">
                  No records found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: LOAN TRANSACTION INPUT CONFIGURATION CARD */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Log New Udhar</h3>

          <div className="bg-white border border-slate-200/70 shadow-sm rounded-2xl p-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-6">
              <UserPlus size={18} />
              <h4 className="font-bold text-slate-900 text-base">Record Adjustment</h4>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Paradigm Type Selector Toggle buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Operation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'gave' })}
                    className={`py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${formData.type === 'gave' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-4 ring-emerald-50' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Lent (Gave Money)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'took' })}
                    className={`py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${formData.type === 'took' ? 'bg-rose-50 border-rose-200 text-rose-700 ring-4 ring-rose-50' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Borrowed (Took Money)
                  </button>
                </div>
              </div>

              {/* Friend Name string descriptor tag */}
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Friend's Identity
                </label>
                <input
                  type="text" id="name" placeholder="e.g., Rohit Kumar" required
                  value={formData.name} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all font-medium text-sm"
                />
              </div>

              {/* Magnitude valuation input parameter */}
              <div>
                <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Absolute Amount (INR)
                </label>
                <input
                  type="number" id="amount" placeholder="₹ 0.00" required
                  value={formData.amount} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all font-semibold"
                />
              </div>

              {/* Transaction Description Note */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </label>
                <input
                  type="text" id="description" placeholder="e.g., Lunch split bill at dhaba" required
                  value={formData.description} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all text-sm"
                />
              </div>

              {/* Action dispatch button submit hook */}
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 pt-2"
              >
                <PlusCircle size={16} /> Save Record
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Udhar;