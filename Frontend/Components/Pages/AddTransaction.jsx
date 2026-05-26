import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PenTool, Camera, Sparkles, UploadCloud, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Loader from '../Layouts/Loader';

function AddTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState('manual'); // 'manual' or 'camera'
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);


  const editData = location.state?.editData;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form State - Upgraded with transfer fields
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense', // 'expense' | 'income' | 'transfer'
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    fromAccount: '',
    toAccount: ''
  });
  useEffect(() => {
    if (editData) {
      setIsEditMode(true);
      setEditId(editData._id);

      setFormData({
        amount: editData.amount,
        type: editData.type,
        category: editData.category || '',
        // Extract just the YYYY-MM-DD from the MongoDB timestamp
        date: new Date(editData.date).toISOString().split('T')[0],
        description: editData.description || '',
        fromAccount: editData.fromAccount || '',
        toAccount: editData.toAccount || ''
      });
    }
  }, [editData]);

  // Automatically reset category/accounts to safe defaults when transaction type shifts
  useEffect(() => {
    if (!isEditMode) {
      if (formData.type === 'expense') {
        setFormData(prev => ({ ...prev, category: 'Food & Groceries' }));
      } else if (formData.type === 'income') {
        setFormData(prev => ({ ...prev, category: 'salary' }));
      }
    }
  }, [formData.type, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Data cleanup before sending
      const payload = { ...formData };
      if (payload.type !== 'transfer') {
        delete payload.fromAccount;
        delete payload.toAccount;
      } else if (payload.type === 'transfer') {
        delete payload.category;
      }

      if (!payload.type) {
        toast.warning('Please select a transaction type.');
        return;
      }

      // 3. DYNAMIC URL AND METHOD
      // Tip: Double check your backend put route. It might be /transactions/:id instead of /transaction/:id
      const url = isEditMode
        ? `${BASE_URL}/transaction/${editId}`
        : `${BASE_URL}/transactions`;

      const httpMethod = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: httpMethod,
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Transaction updated successfully!' : 'Transaction added successfully!');

        // After editing, send them back to the ledger to see the update
        if (isEditMode) {
          navigate('/TransactionsHistory');
        } else {
          // If just adding, reset form for the next entry
          setFormData({
            amount: '',
            type: '',
            category: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            fromAccount: '',
            toAccount: ''
          });
        }
      } else {
        toast.error(`Failed to ${isEditMode ? 'update' : 'add'} transaction.`);
      }
    }
    catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Network error occurred.');
    } finally{
      setIsLoading(false);
    }
  }

  // Mock AI OCR Camera Scanner Engine
  const handleSimulateScan = () => {
    toast.warning("This feature is under development.")
    // setIsScanning(true);
    // setScanComplete(false);

    // setTimeout(() => {
    //   setIsScanning(false);
    //   setScanComplete(true);
    //   setFormData({
    //     amount: '450.00',
    //     type: 'expense',
    //     category: 'Food & Groceries',
    //     date: '2026-05-17',
    //     description: 'Starbucks Coffee & Sandwich (AI Scanned)',
    //     fromAccount: 'hdfc_bank',
    //     toAccount: 'groww_wallet'
    //   });
    //   setTimeout(() => {
    //     setMethod('manual');
    //     setScanComplete(false);
    //   }, 1000);
    // }, 2500);
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans antialiased md:p-10 transition-colors duration-200">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 shadow-xl rounded-2xl p-4 md:p-8 transition-colors duration-200">
          <div className="mb-6">
            {/* 4. DYNAMIC UI TEXT */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              {isEditMode
                ? 'Modify the parameters of this financial record.'
                : 'Choose an input paradigm to append records onto your financial ledger.'}
            </p>
          </div>

          {/* PARADIGM TOGGLE TABS */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl mb-8 transition-colors duration-200">
            <button
              onClick={() => setMethod('manual')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${method === 'manual' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <PenTool size={16} />
              Manual Entry
            </button>
            <button
              onClick={() => setMethod('camera')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${method === 'camera' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <Camera size={16} />
              AI Scan
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-md font-bold">Beta</span>
            </button>
          </div>

          {/* VIEW 1: MANUAL FORM LAYER */}
          {method === 'manual' && (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* FLOW PARAMETER SWITCHBOARD BUTTONS */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Transaction Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.type === 'expense' ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 ring-4 ring-rose-50 dark:ring-rose-500/10' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 ring-4 ring-emerald-50 dark:ring-emerald-500/10' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'transfer' })}
                    className={`py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.type === 'transfer' ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 ring-4 ring-blue-50 dark:ring-blue-500/10' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    Transfer
                  </button>
                </div>
              </div>

              {/* AMOUNT BLOCK */}
              <div>
                <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Absolute Magnitude (INR)</label>
                <input
                  onWheel={(e) => e.target.blur()}
                  type="number" id="amount" placeholder="₹ 0.00" value={formData.amount} onChange={handleChange} required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white transition-all font-semibold placeholder-slate-400 dark:placeholder-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* DYNAMIC MIDDLE SECTION: ALTERNATING BASED ON SELECTION TYPE */}
              <div className="space-y-5">

                {/* DYNAMIC FIELD TYPE ROUTINE A: RENDER CATEGORIES FOR NON-TRANSFERS */}
                {formData.type !== 'transfer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        {formData.type === 'expense' ? 'Expense Category' : 'Income Source'}
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all font-medium"
                      >
                        {formData.type === 'expense' ? (
                          <>
                            <option value="Food & Groceries">Food & Groceries</option>
                            <option value="Bills & EMIs">Bills & EMIs</option>
                            <option value="Education & Skilling">Education & Skilling</option>
                            <option value="Travel & Cabs">Travel & Cabs</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Rent & PG/Hostel">Rent & PG/Hostel</option>
                            <option value="Subscriptions & Entertainment">Subscriptions & Entertainment</option>
                            <option value="Investments & Savings">Investments & Savings</option>
                            <option value="Pharmacy & Medical">Pharmacy & Medical</option>
                            <option value="Others">Others</option>
                          </>
                        ) : (
                          <>
                            <option value="Salary">Primary Salary</option>
                            <option value="Freelance">Freelance Yield</option>
                            <option value="Investments">Market Dividends/Groww</option>
                            <option value="Peer_refund">Friend Remittance/Udhar</option>
                            <option value="Others">Others</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Temporal Marker</label>
                      <input type="date" id="date" value={formData.date} onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all font-medium" />
                    </div>
                  </div>
                )}

                {/* DYNAMIC FIELD TYPE ROUTINE B: RENDER INTER-ACCOUNT TRANSFERS ROUTE SELECTORS */}
                {formData.type === 'transfer' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fromAccount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">From</label>
                        <input type="text" id="fromAccount" placeholder="e.g., HDFC Salary Bank" onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-500" />
                      </div>
                      <div>
                        <label htmlFor="toAccount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">To</label>
                        <input type="text" id="toAccount" placeholder="e.g., Groww Investment Wallet" onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-500" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Date</label>
                      <input type="date" id="date" value={formData.date} onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all font-medium" />
                    </div>
                  </div>
                )}

              </div>

              {/* DESCRIPTION TEXT BLOCK */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Descriptor Scope</label>
                <input
                  type="text" id="description" placeholder={formData.type === 'transfer' ? 'e.g., Transferring money to buy stocks' : 'e.g., Grocery store payload'} value={formData.description} onChange={handleChange} required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <button type="submit" className="w-full cursor-pointer py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl text-sm hover:bg-indigo-800 dark:hover:bg-indigo-600 shadow-sm transition-all mt-4">
                {isEditMode ? 'Update Transaction' : 'Save Transaction'}
              </button>
            </form>
          )}

          {/* VIEW 2: DUMMY AI CAMERA INTERFACE */}
          {method === 'camera' && (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl min-h-[340px] text-center relative overflow-hidden transition-colors duration-200">
              {isScanning && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 animate-fade-in">
                  <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                    Executing OCR Parse Sequence...
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Extracting amounts, dates, and vendor keys.</p>
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 dark:via-indigo-400 to-transparent top-0 animate-bounce mt-24"></div>
                </div>
              )}
              {scanComplete && (
                <div className="absolute inset-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center z-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 animate-bounce mb-2" />
                  <p className="font-bold text-slate-900 dark:text-white">Payload Extraction Complete!</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Hydrating manual entry data fields...</p>
                </div>
              )}
              <div className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                <UploadCloud size={28} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Upload Receipt or Open Camera Viewfinder</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-6">Drop structural image objects here or take a live picture to pass vectors to our dummy AI computer vision engine model parsing framework.</p>
              <button
                type="button"
                onClick={handleSimulateScan}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 shadow-sm transition-all duration-150 cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-400 fill-amber-400" />
                Open Camera
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AddTransaction;