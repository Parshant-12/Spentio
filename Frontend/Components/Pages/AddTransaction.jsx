import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PenTool, Camera, Sparkles, UploadCloud, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import Webcam from 'react-webcam'; // Added Webcam
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Loader from '../Layouts/Loader';

function AddTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState('manual'); // 'manual' or 'camera'

  // Camera & Scan States
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false); // Controls full-screen overlay
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const editData = location.state?.editData;
  const [isEditMode, setIsEditMode] = useState(!!editData);
  const [editId, setEditId] = useState(editData?._id || null);

  // Form State
  const [formData, setFormData] = useState({
    amount: editData?.amount || '',
    type: editData?.type || 'expense',
    category: editData?.category || '',
    date: editData?.date ? new Date(editData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: editData?.description || '',
    fromAccount: editData?.fromAccount || '',
    toAccount: editData?.toAccount || ''
  });

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
    const playSuccessSound = () => {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.8;
      audio.play().catch(error => console.log("Audio play prevented:", error));
    };

    try {
      const payload = { ...formData };
      if (payload.type !== 'transfer') {
        delete payload.fromAccount;
        delete payload.toAccount;
      } else if (payload.type === 'transfer') {
        delete payload.category;
      }

      if (payload.type === 'income') {
        payload.description = payload.category;
        payload.category = 'Income';
      }

      if (!payload.type) {
        toast.warning('Please select a transaction type.');
        return;
      }

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
        playSuccessSound();
        toast.success(isEditMode ? 'Transaction updated successfully!' : 'Transaction added successfully!');
        if (payload.type === 'expense' && payload.category) {
          try {
            const safeCategory = encodeURIComponent(payload.category);
            const budgetResponse = await fetch(`${BASE_URL}/budgets/track/${safeCategory}`, {
              method: 'GET',
              headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
            });

            if (budgetResponse.ok) {
              const budgetData = await budgetResponse.json();
              const percentage = (budgetData.spent / budgetData.limit) * 100;
              if (percentage >= 100) {
                toast.error(`Budget Exceeded! You are over your ₹${budgetData.limit} limit.`);
              } else if (percentage >= 80) {
                toast.warning(`Heads up! You have used ${percentage.toFixed(0)}% of your budget.`);
              }
            }
          } catch (budgetError) {
            console.error("Failed to fetch budget:", budgetError);
          }
        }

        if (isEditMode) {
          navigate('/TransactionsHistory');
        } else {
          setFormData({
            amount: '',
            type: 'expense',
            category: 'Food & Groceries',
            date: new Date().toISOString().split('T')[0],
            description: '',
            fromAccount: '',
            toAccount: ''
          });
        }
      } else {
        toast.error(`Failed to ${isEditMode ? 'update' : 'add'} transaction.`);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Network error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  const processReceiptData = async (base64Image) => {
    setIsCameraActive(false); // Close full-screen camera if it was open
    setIsScanning(true);

    try {
      const response = await fetch(`${BASE_URL}/scan-receipt`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ imageBase64: base64Image })
      });

      if (response.ok) {
        const parsedData = await response.json();

        setFormData(prev => ({
          ...prev,
          amount: parsedData.amount || prev.amount,
          type: parsedData.type || prev.type,
          category: parsedData.category || prev.category,
          date: parsedData.date || prev.date,
          description: parsedData.description || prev.description
        }));

        setIsScanning(false);
        setScanComplete(true);
        toast.success("Receipt parsed successfully!");

        setTimeout(() => {
          setMethod('manual');
          setScanComplete(false);
        }, 1200);

      } else {
        toast.error("AI vision engine failed to parse the receipt.");
        setIsScanning(false);
      }
    } catch (error) {
      console.error("OCR API Error:", error);
      toast.error("Network error while connecting to AI engine.");
      setIsScanning(false);
    }
  };
  const captureAndProcessReceipt = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) processReceiptData(imageSrc);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = (event) => {
      // 1. Create a virtual image object in memory
      const img = new Image();

      img.onload = () => {
        // 2. Create a virtual canvas exactly the size of the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // 3. Draw the image onto the canvas (this strips the original format)
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 4. Force export as JPEG (0.85 = 85% quality to save bandwidth)
        const jpegBase64 = canvas.toDataURL('image/jpeg', 0.85);

        // 5. Send the strictly formatted JPEG to your API
        processReceiptData(jpegBase64);
      };

      // Pass the raw uploaded file into the virtual image to trigger the onload above
      img.src = event.target.result;
    };

    // Read the file from the user's phone
    reader.readAsDataURL(file);

    // Reset the input value so the same file can be selected again if needed
    e.target.value = null;
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans antialiased md:p-10 transition-colors duration-200">

      {/* --- FULL SCREEN CAMERA OVERLAY --- */}
      {isCameraActive && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-200">
          {/* Camera Viewfinder */}
          <div className="flex-1 relative overflow-hidden bg-zinc-900 flex flex-col justify-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "environment",
                width: { ideal: 4096 },
                height: { ideal: 2160 },
                advanced: [{ focusMode: "continuous" }]
              }}
              className="w-full h-full object-cover"
            />
            {/* Target reticle overlay */}
            <div className="absolute inset-0 border-[2px] border-white/30 m-8 rounded-2xl pointer-events-none flex items-center justify-center">
              <span className="text-white/60 text-sm font-semibold tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">
                Align Receipt
              </span>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="h-36 bg-black flex items-center justify-between px-10 pb-8 pt-4">
            <button
              type="button"
              onClick={() => setIsCameraActive(false)}
              className="text-white/80 hover:text-white font-medium text-lg px-2 py-2"
            >
              Cancel
            </button>

            {/* Native-style Capture Button */}
            <button
              type="button"
              onClick={captureAndProcessReceipt}
              className="w-16 h-16 rounded-full bg-white border-[4px] border-zinc-400 outline outline-[3px] outline-white flex items-center justify-center transition-transform active:scale-90 shadow-xl"
            ></button>

            <div className="w-[70px]"></div> {/* Spacer to keep button centered */}
          </div>
        </div>
      )}

      {/* --- MAIN UI --- */}
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              {isEditMode
                ? 'Modify the parameters of this financial record.'
                : 'Choose an input paradigm to append records onto your financial ledger.'}
            </p>
          </div>

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
                <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Amount (INR)</label>
                <input
                  onWheel={(e) => e.target.blur()}
                  min={0}
                  type="number" id="amount" placeholder="₹ 0.00" value={formData.amount} onChange={handleChange} required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white transition-all font-semibold placeholder-slate-400 dark:placeholder-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* DYNAMIC MIDDLE SECTION */}
              <div className="space-y-5">
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
                            <option value="Rent & PG">Rent & PG/Hostel</option>
                            <option value="Subscriptions & Entertainment">Subscriptions & Entertainment</option>
                            <option value="Investments & Savings">Investments & Savings</option>
                            <option value="Pharmacy & Medical">Pharmacy & Medical</option>
                            <option value="Others">Others</option>
                          </>
                        ) : (
                          <>
                            <option value="Salary">Primary Salary</option>
                            <option value="Pocket Money">Pocket Money</option>
                            <option value="Freelance">Freelance Yield</option>
                            <option value="Investments">Market Dividends/Groww</option>
                            <option value="Peer_refund">Friend Remittance/Udhar</option>
                            <option value="Others">Others</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Date</label>
                      <input type="date" id="date" value={formData.date} onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all font-medium" />
                    </div>
                  </div>
                )}

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
              {formData.type !== 'income' && (
                <div>
                  <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Description</label>
                  <input
                    type="text" id="description" placeholder={formData.type === 'transfer' ? 'e.g., Transferring money to buy stocks' : 'e.g., Grocery store payload'} value={formData.description} onChange={handleChange} required
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              )}

              <button type="submit" className="w-full cursor-pointer py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl text-sm hover:bg-indigo-800 dark:hover:bg-indigo-600 shadow-sm transition-all mt-4">
                {isEditMode ? 'Update Transaction' : 'Save Transaction'}
              </button>
            </form>
          )}

          {/* VIEW 2: AI CAMERA INTERFACE */}
          {method === 'camera' && (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl min-h-[340px] text-center relative overflow-hidden transition-colors duration-200">

              {/* The Scanning Animations you already built */}
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

              <div className="flex flex-col items-center">
                {/* The Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* The Clickable UI Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-4 transition-all active:scale-95 cursor-pointer"
                >
                  <UploadCloud size={28} />
                </button>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Upload Receipt or Open Camera Viewfinder</h3>
<p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mb-6">
  Upload or snap a photo of your receipt to instantly auto-fill your transaction. 
  <span className="block mt-2 text-amber-500 dark:text-amber-400 font-medium">
    ⚠️ Note: AI isn't perfect, so please double-check the details before saving!
  </span>
</p>
              {/* Triggers the new full screen view */}
              <button
                type="button"
                onClick={() => setIsCameraActive(true)}
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