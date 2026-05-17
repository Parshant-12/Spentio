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

function Udhar() {
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'owes_me' | 'i_owe'

  // Form input state management
  const [formData, setFormData] = useState({
    name: '',
    type: 'gave', // 'gave' (Owes Me) or 'took' (I Owe)
    amount: '',
    remark: ''
  });

  // Mock peer ledger array
  const [peerRecords, setPeerRecords] = useState([
    { id: 1, name: 'Rahul Sharma', type: 'gave', amount: 1500, remark: 'Zomato weekend split', date: 'Today' },
    { id: 2, name: 'Ananya Iyer', type: 'took', amount: 450, remark: 'Auto fare to metro station', date: 'Yesterday' },
    { id: 3, name: 'Amit Verma', type: 'gave', amount: 5000, remark: 'Advanced for trip bookings', date: '14 May 2026' },
    { id: 4, name: 'Sneha Patel', type: 'took', amount: 1200, remark: 'Birthday party contribution', date: '10 May 2026' },
    { id: 5, name: 'Gaurav Das', type: 'gave', amount: 250, remark: 'Chai tapri & snacks', date: '08 May 2026' },
  ]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Recording Udhar logic parameter: ${formData.name} -> ₹${formData.amount}`);
    
    // Reset secondary input fields cleanly
    setFormData({ name: '', type: 'gave', amount: '', remark: '' });
  };

  // Compute absolute peer summary totals dynamically
  const totalOwesMe = peerRecords.filter(p => p.type === 'gave').reduce((acc, c) => acc + c.amount, 0);
  const totalIOwe = peerRecords.filter(p => p.type === 'took').reduce((acc, c) => acc + c.amount, 0);
  const netBalance = totalOwesMe - totalIOwe;

  // Filter algorithmic step execution
  const filteredRecords = peerRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'owes_me') return matchesSearch && record.type === 'gave';
    if (filterType === 'i_owe') return matchesSearch && record.type === 'took';
    return matchesSearch;
  });

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
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><ArrowUpRight size={20}/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">You Owe (To Pay Back)</span>
            <p className="text-3xl font-black text-rose-600 tracking-tight">₹{totalIOwe.toLocaleString('en-IN')}</p>
            <span className="text-xs text-slate-400 block font-medium">Pending dues on your side</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner"><ArrowDownLeft size={20}/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Net Summary Position</span>
            <p className={`text-3xl font-black tracking-tight ${netBalance >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
              {netBalance >= 0 ? `+ ₹${netBalance.toLocaleString('en-IN')}` : `- ₹${Math.abs(netBalance).toLocaleString('en-IN')}`}
            </p>
            <span className="text-xs text-slate-400 block font-medium">Overall calculated cash vector</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shadow-inner"><HandCoins size={20}/></div>
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
              <option value="owes_me">Owes Me (Green)</option>
              <option value="i_owe">I Owe (Red)</option>
            </select>
          </div>

          {/* DYNAMIC FRIENDS FEED STREAM LEDGER CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((person) => {
                  const isOwedToMe = person.type === 'gave';
                  return (
                    <div key={person.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/40 transition-colors group">
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
                            {person.remark} • <span className="text-slate-500 font-normal">{person.date}</span>
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
                          onClick={() => alert(`Initiating direct settlement interface with ${person.name}`)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150"
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
                  No overlapping ledger records track parameters found.
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
                    onClick={() => setFormData({...formData, type: 'gave'})}
                    className={`py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${formData.type === 'gave' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-4 ring-emerald-50' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Lent (Gave Money)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'took'})}
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

              {/* Transaction Remark Note */}
              <div>
                <label htmlFor="remark" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Context / Description Remark
                </label>
                <input 
                  type="text" id="remark" placeholder="e.g., Lunch split bill at dhaba" required
                  value={formData.remark} onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all text-sm"
                />
              </div>

              {/* Action dispatch button submit hook */}
              <button 
                type="submit" 
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 pt-2"
              >
                <PlusCircle size={16} /> Append Entry to Ledger
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Udhar;