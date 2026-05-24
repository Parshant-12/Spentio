import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Camera, Sparkles, UploadCloud, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

function AddTransaction() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('manual'); // 'manual' or 'camera'
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Form State - Upgraded with transfer fields
  const [formData, setFormData] = useState({
    amount: '',
    type: '', // 'expense' | 'income' | 'transfer'
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    fromAccount: '',
    toAccount: ''
  });

  // Automatically reset category/accounts to safe defaults when transaction type shifts
  useEffect(() => {
    if (formData.type === 'expense') {
      setFormData(prev => ({ ...prev, category: 'food_groceries' }));
    } else if (formData.type === 'income') {
      setFormData(prev => ({ ...prev, category: 'salary' }));
    }
  }, [formData.type]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.type !== 'transfer') {
        delete formData.fromAccount;
        delete formData.toAccount;
      }
      else if (formData.type === 'transfer') {
        delete formData.category;
      }
      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.success('Transaction added successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Failed to add transaction. Please try again.');
      }
    }
    catch (error) {
      console.error('Error saving transaction:', error);
    }
  }

  // Mock AI OCR Camera Scanner Engine
  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanComplete(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setFormData({
        amount: '450.00',
        type: 'expense',
        category: 'food_groceries',
        date: '2026-05-17',
        description: 'Starbucks Coffee & Sandwich (AI Scanned)',
        fromAccount: 'hdfc_bank',
        toAccount: 'groww_wallet'
      });
      setTimeout(() => {
        setMethod('manual');
        setScanComplete(false);
      }, 1000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased p-6 md:p-10">
      <div className="max-w-xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* Core Layout Card */}
        <div className="bg-white border border-slate-200/70 shadow-xl rounded-2xl p-6 md:p-8">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Add Transaction</h2>
            <p className="text-sm text-slate-400 mt-0.5">Choose an input paradigm to append records onto your financial ledger.</p>
          </div>

          {/* PARADIGM TOGGLE TABS */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl mb-8">
            <button
              onClick={() => setMethod('manual')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${method === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <PenTool size={16} />
              Manual Entry
            </button>
            <button
              onClick={() => setMethod('camera')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${method === 'camera' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Camera size={16} />
              AI Camera Scan
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold">Beta</span>
            </button>
          </div>

          {/* VIEW 1: MANUAL FORM LAYER */}
          {method === 'manual' && (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* FLOW PARAMETER SWITCHBOARD BUTTONS */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Flow Parameter</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all ${formData.type === 'expense' ? 'bg-rose-50 border-rose-200 text-rose-700 ring-4 ring-rose-50' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all ${formData.type === 'income' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-4 ring-emerald-50' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'transfer' })}
                    className={`py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all ${formData.type === 'transfer' ? 'bg-blue-50 border-blue-200 text-blue-700 ring-4 ring-blue-50' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Transfer
                  </button>
                </div>
              </div>

              {/* AMOUNT BLOCK */}
              <div>
                <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Absolute Magnitude (INR)</label>
                <input
                  type="number" id="amount" placeholder="₹ 0.00" value={formData.amount} onChange={handleChange} required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all font-semibold"
                />
              </div>

              {/* DYNAMIC MIDDLE SECTION: ALTERNATING BASED ON SELECTION TYPE */}
              <div className="space-y-5">

                {/* DYNAMIC FIELD TYPE ROUTINE A: RENDER CATEGORIES FOR NON-TRANSFERS */}
                {formData.type !== 'transfer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        {formData.type === 'expense' ? 'Expense Category' : 'Income Source'}
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 transition-all font-medium"
                      >
                        {formData.type === 'expense' ? (
                          <>
                            <option value="food_groceries">Food & Groceries</option>
                            <option value="Bills & Recharges">Bills & EMIs</option>
                            <option value="Education & Skilling">Education & Skilling</option>
                            <option value="travel_cabs">Travel & Cabs</option>
                            <option value="shopping">Shopping</option>
                            <option value="rent_pg">Rent & PG/Hostel</option>
                            <option value="entertainment">Subscriptions & Entertainment</option>
                            <option value="Investments & Savings">Investments & Savings</option>
                            <option value="medical">Pharmacy & Medical</option>
                            <option value="others">Others</option>
                          </>
                        ) : (
                          <>
                            <option value="salary">Primary Salary</option>
                            <option value="freelance">Freelance Yield</option>
                            <option value="investments">Market Dividends/Groww</option>
                            <option value="peer_refund">Friend Remittance/Udhar</option>
                            <option value="others">Others</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Temporal Marker</label>
                      <input type="date" id="date" value={formData.date} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 transition-all font-medium" />
                    </div>
                  </div>
                )}

                {/* DYNAMIC FIELD TYPE ROUTINE B: RENDER INTER-ACCOUNT TRANSFERS ROUTE SELECTORS */}
                {formData.type === 'transfer' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fromAccount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">From</label>
                        <input type="text" id="fromAccount" placeholder="e.g., HDFC Salary Bank" onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all" />
                      </div>
                      <div>
                        <label htmlFor="toAccount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">To</label>
                        <input type="text" id="toAccount" placeholder="e.g., Groww Investment Wallet" onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Date</label>
                      <input type="date" id="date" value={formData.date} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 transition-all font-medium" />
                    </div>
                  </div>
                )}

              </div>

              {/* DESCRIPTION TEXT BLOCK */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descriptor Scope</label>
                <input
                  type="text" id="description" placeholder={formData.type === 'transfer' ? 'e.g., Transferring money to buy stocks' : 'e.g., Grocery store payload'} value={formData.description} onChange={handleChange} required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 shadow-sm transition-all mt-4">
                Save Transaction
              </button>
            </form>
          )}

          {/* VIEW 2: DUMMY AI CAMERA INTERFACE */}
          {method === 'camera' && (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl min-h-[340px] text-center relative overflow-hidden">
              {isScanning && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 animate-fade-in">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                    Executing OCR Parse Sequence...
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Extracting amounts, dates, and vendor keys.</p>
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent top-0 animate-bounce mt-24"></div>
                </div>
              )}
              {scanComplete && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce mb-2" />
                  <p className="font-bold text-slate-900">Payload Extraction Complete!</p>
                  <p className="text-xs text-slate-400 mt-1">Hydrating manual entry data fields...</p>
                </div>
              )}
              <div className="w-16 h-16 bg-white border border-slate-200 shadow-xs rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                <UploadCloud size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Upload Receipt or Open Camera Viewfinder</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6">Drop structural image objects here or take a live picture to pass vectors to our dummy AI computer vision engine model parsing framework.</p>
              <button
                type="button"
                onClick={handleSimulateScan}
                className="flex items-center gap-2 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800 shadow-sm transition-all duration-150"
              >
                <Sparkles size={14} className="text-amber-400 fill-amber-400" />
                Simulate AI Receipt Scan
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AddTransaction;