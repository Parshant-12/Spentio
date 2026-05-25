import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  DollarSign,
  Wallet,
  Coins,
  CreditCard,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Monitor,
  Smartphone,
  PlayCircle
} from 'lucide-react';
import Desktop from '../../image-vids/Desktop.png'
import Mobile from '../../image-vids/mobile.png'

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans overflow-hidden selection:bg-indigo-500/30">

      {/* INLINE STYLES FOR CUSTOM ANIMATIONS 
        These keyframes create the smooth, constant floating motion for the background icons.
      */}
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

      {/* --- NAVIGATION BAR --- */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">Spent.io</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/Login')} className="text-sm cursor-pointer font-semibold text-slate-300 hover:text-white transition-colors">Log In</button>
          <button onClick={() => navigate('/Signup')} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 cursor-pointer">
            Get Started
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION WITH ANIMATED ICONS --- */}
      <div className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto">

        {/* Animated Background Icons (Money/Dollar theme) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <DollarSign size={80} className="absolute top-10 left-[10%] text-emerald-500/10 animate-float" />
          <Coins size={120} className="absolute top-40 right-[5%] text-amber-500/10 animate-float-delayed" />
          <CreditCard size={60} className="absolute bottom-10 left-[20%] text-indigo-500/10 animate-float-slow" />
          <PieChart size={90} className="absolute top-1/2 left-[80%] text-rose-500/10 animate-float" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-indigo-400 text-xs font-bold uppercase tracking-widest backdrop-blur-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            The Future of Personal Finance
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            Take control of your money, <span className="text-indigo-500">effortlessly.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
            Spent.io turns complex financial tracking into simple, actionable insights. Track expenses, manage recurring bills, and achieve your financial goals with intelligent automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button onClick={() => navigate('/Signup')} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer">
              Start Tracking for Free <ArrowRight size={18} />
            </button>
            <button onClick={() => document.getElementById('demo-video').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-base font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer">
              <PlayCircle size={18} /> Watch Demo
            </button>
          </div>
        </div>

        {/* --- WEB & MOBILE SCREENSHOT PLACEHOLDERS --- */}
        <div className="relative mx-auto max-w-5xl mt-32 z-10">

          {/* Main Desktop Browser Mockup */}
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 aspect-video shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 group">
            {/* Fake Browser Toolbar */}
            <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            </div>
            <img src={Desktop} className="w-full h-auto" alt="desktop view" />
            <div className="flex-1 bg-slate-800/50 flex flex-col items-center justify-center group-hover:bg-slate-800/30 transition-colors">
              <Monitor size={48} className="text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium">Desktop Dashboard Screenshot</p>
              <p className="text-xs text-slate-500 mt-2">16:9 Aspect Ratio Recommended</p>
            </div>
          </div>

          {/* Overlapping Mobile Mockup */}
          <div className="hidden md:flex absolute -bottom-16 -right-12 bg-slate-950 rounded-[2.5rem] border-[6px] border-slate-800 w-72 h-[550px] shadow-2xl flex-col overflow-hidden ring-1 ring-black/50 z-20 group">
            {/* Fake Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl w-32 mx-auto z-30"></div>
            <img src={Mobile} alt="mobile view" />
            <div className="flex-1 bg-slate-800/80 flex flex-col items-center justify-center group-hover:bg-slate-800/60 transition-colors pt-6">
              <Smartphone size={40} className="text-slate-500 mb-4" />
              <p className="text-slate-300 font-medium text-center px-4">Mobile App View</p>
              <p className="text-[10px] text-slate-500 mt-2 text-center">9:16 Aspect Ratio</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS / FEATURES SECTION --- */}
      <div className="bg-slate-950 py-32 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white">Everything you need to succeed.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We stripped away the confusing accounting jargon to give you tools that actually make sense for your daily life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TrendingUp size={24} className="text-emerald-400" />}
              title="Smart Analytics"
              desc="Visualize your spending with beautiful pie charts, daily velocity graphs, and period-over-period comparisons."
            />
            <FeatureCard
              icon={<Wallet size={24} className="text-indigo-400" />}
              title="Budget Enforcement"
              desc="Set absolute monthly limits and category-specific budgets. We'll warn you before you overspend."
            />
            <FeatureCard
              icon={<ShieldCheck size={24} className="text-rose-400" />}
              title="Udhar (Friends) Ledger"
              desc="Never lose track of who owes who. Easily log split bills, borrowed cash, and net balances with peers."
            />
          </div>
        </div>
      </div>

      {/* --- VIDEO DEMO BLOCK --- */}
      <div id="demo-video" className="py-32 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-white">See exactly how to use Spent.io</h2>
          <p className="text-slate-400">A quick 60-second walkthrough of our core features.</p>
        </div>

        {/* RESPONSIVE VIDEO CONTAINER */}
        <div className="relative aspect-video w-full bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden group">

          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/RiNMAV9qFiQ"
            title="Spent.io Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>

        </div>
      </div>

      {/* --- FINAL CTA / FOOTER --- */}
      <div className="border-t border-slate-800 bg-slate-900/50 pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-black text-white">Ready to fix your finances?</h2>
          <p className="text-slate-400 text-lg">Join today and get full access to the basic tier for free, forever.</p>
          <button onClick={() => navigate('/Signup')} className="px-10 py-5 bg-white text-slate-900 text-lg font-black rounded-2xl shadow-xl hover:bg-slate-100 transition-all transform hover:-translate-y-1 cursor-pointer">
            Create Your Free Account
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-32 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Wallet size={16} /> <span className="font-bold text-slate-400">Spent.io</span> © 2026
          </div>
          <div>
            {"Made by Parshant :)"}
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>

    </div>
  );
}

/* Sub-component for the features grid */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-colors group">
    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default Home;