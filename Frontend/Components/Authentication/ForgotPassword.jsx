import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, DollarSign, Coins, PieChart, Wallet, ArrowLeft } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        toast.success("If this account exists, a reset link has been sent.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50 font-sans p-4 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* INLINE STYLES FOR BACKGROUND ANIMATIONS */}
      <style>
        {`
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-reverse {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(20px) rotate(-10deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-reverse 8s ease-in-out 1s infinite; }
        .animate-float-slow { animation: float 10s ease-in-out 2s infinite; }
        `}
      </style>

      {/* ANIMATED BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <DollarSign size={80} className="absolute top-[20%] right-[15%] text-emerald-500/10 animate-float" />
          <Coins size={120} className="absolute bottom-[15%] left-[10%] text-amber-500/10 animate-float-delayed" />
          <PieChart size={90} className="absolute top-[10%] left-[20%] text-rose-500/10 animate-float-slow" />
          <Wallet size={100} className="absolute bottom-[20%] right-[10%] text-indigo-500/10 animate-float" />
          
          {/* Subtle ambient gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
      </div>

      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
          transition={Bounce}
          style={{ zIndex: 9999 }}
      />

      {/* MAIN FORGOT PASSWORD CARD (Glassmorphism Dark Mode) */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative z-10">
        
        {/* Branding / Header */}
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                <Mail size={28} className="drop-shadow-sm" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Forgot Password</h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">
                Enter your email and we'll send a reset link.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
                  Email Address
              </label>
              <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-900 text-white transition-all font-medium placeholder-slate-600"
                      placeholder="you@example.com"
                  />
              </div>
          </div>

          <button 
            disabled={isLoading}
            type="submit" 
            className="w-full mt-4 cursor-pointer py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Send Reset Link'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <Link to="/Login" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-indigo-300 transition-colors">
                <ArrowLeft size={14} /> Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;