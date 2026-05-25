import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { 
    Mail, 
    Lock, 
    Wallet, 
    ArrowRight, 
    Loader2,
    DollarSign,
    Coins,
    PieChart
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.status === 200) {
                toast.success("Login successful!");
                localStorage.setItem('token', data.authToken);
                navigate('/Dashboard');
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("An error occurred during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

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
                <DollarSign size={80} className="absolute top-[15%] left-[10%] text-emerald-500/10 animate-float-delayed" />
                <Coins size={120} className="absolute bottom-[20%] right-[15%] text-amber-500/10 animate-float" />
                <PieChart size={90} className="absolute top-[10%] right-[20%] text-rose-500/10 animate-float-slow" />
                <Wallet size={100} className="absolute bottom-[15%] left-[15%] text-indigo-500/10 animate-float-delayed" />
                
                {/* Subtle ambient gradients */}
                <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
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
                theme="dark" // Updated to dark theme
                transition={Bounce}
                style={{ zIndex: 9999 }}
            />

            {/* MAIN LOGIN CARD (Glassmorphism Dark Mode) */}
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative z-10">

                {/* Branding / Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                        <Wallet size={28} className="drop-shadow-sm" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Welcome back</h2>
                    <p className="text-sm text-slate-400 mt-2 font-medium">
                        Enter your credentials to access your ledger.
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
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-900 text-white transition-all font-medium placeholder-slate-600"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex items-center justify-between mb-2 pl-1 pr-1">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Password
                            </label>
                            <Link to="/ForgotPassword" className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="password"
                                id="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-900 text-white transition-all font-medium placeholder-slate-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Sign In securely
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        Don't have an account yet?{' '}
                        <Link to="/SignUp" className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition-all">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;