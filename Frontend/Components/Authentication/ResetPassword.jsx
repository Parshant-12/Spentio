import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Lock, Loader2, DollarSign, Coins, PieChart, Wallet } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password })
      });

      if (response.ok) {
        toast.success("Password reset successfully! Redirecting...");
        setTimeout(() => navigate('/Login'), 2000);
      } else {
        toast.error("Invalid or expired token.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
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
          theme="dark" // Switched to dark theme
          transition={Bounce}
          style={{ zIndex: 9999 }}
      />

      {/* MAIN RESET PASSWORD CARD (Glassmorphism Dark Mode) */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative z-10">
        
        {/* Branding / Header */}
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                <Lock size={28} className="drop-shadow-sm" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Set New Password</h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">
                Enter your new secure password below.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Password Input */}
          <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
                  New Password
              </label>
              <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-900 text-white transition-all font-medium placeholder-slate-600"
                      placeholder="••••••••"
                  />
              </div>
          </div>

          <button 
            disabled={isLoading}
            type="submit" 
            className="w-full mt-4 cursor-pointer py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default ResetPassword;