import React, { useState, useEffect } from 'react';
import { Calculator, Percent, Coins, ArrowRight, RefreshCw, HelpCircle } from 'lucide-react';

function Tools() {
  const [activeTab, setActiveTab] = useState('emi'); // 'emi' | 'interest'

  // 1. EMI Calculation State Configuration
  const [emiInputs, setEmiInputs] = useState({ principal: 500000, rate: 9.5, tenure: 5 });
  const [emiResults, setEmiResults] = useState({ monthlyEmi: 0, totalInterest: 0, totalPayment: 0 });

  // 2. Interest Calculation State Configuration
  const [interestInputs, setInterestInputs] = useState({ principal: 100000, rate: 7.1, time: 3, type: 'compound' });
  const [interestResults, setInterestResults] = useState({ interestEarned: 0, maturityAmount: 0 });

  // Live Hook to compute Loan EMI parameters instantly on change
  useEffect(() => {
    const P = parseFloat(emiInputs.principal) || 0;
    const annualR = parseFloat(emiInputs.rate) || 0;
    const N = (parseFloat(emiInputs.tenure) || 0) * 12; // Convert years to months

    if (P > 0 && annualR > 0 && N > 0) {
      const monthlyR = annualR / (12 * 100);
      // Standard Equated Monthly稳 Formula implementation
      const emi = (P * monthlyR * Math.pow(1 + monthlyR, N)) / (Math.pow(1 + monthlyR, N) - 1);
      const totalPayable = emi * N;
      const totalInt = totalPayable - P;

      setEmiResults({
        monthlyEmi: Math.round(emi),
        totalInterest: Math.round(totalInt),
        totalPayment: Math.round(totalPayable)
      });
    } else {
      setEmiResults({ monthlyEmi: 0, totalInterest: 0, totalPayment: 0 });
    }
  }, [emiInputs]);

  // Live Hook to compute Simple/Compound interest adjustments instantly on change
  useEffect(() => {
    const P = parseFloat(interestInputs.principal) || 0;
    const R = parseFloat(interestInputs.rate) || 0;
    const T = parseFloat(interestInputs.time) || 0;

    if (P > 0 && R > 0 && T > 0) {
      let maturity = 0;
      if (interestInputs.type === 'simple') {
        maturity = P + (P * R * T) / 100;
      } else {
        // Compound interest assuming standard annual compounding frequency interval
        maturity = P * Math.pow(1 + R / 100, T);
      }
      const earned = maturity - P;

      setInterestResults({
        interestEarned: Math.round(earned),
        maturityAmount: Math.round(maturity)
      });
    } else {
      setInterestResults({ interestEarned: 0, maturityAmount: 0 });
    }
  }, [interestInputs]);

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* HEADER & SWITCH RIBBON */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Math Sandboxes</h2>
          <p className="text-sm text-slate-500 mt-0.5">Model capital structures, compound yield projections, and amortization metrics.</p>
        </div>

        {/* COMPONENT TAB NAVIGATION BAR */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/40 shadow-inner self-start sm:self-auto">
          <button 
            onClick={() => setActiveTab('emi')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'emi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Calculator size={14} /> Loan EMI Engine
          </button>
          <button 
            onClick={() => setActiveTab('interest')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'interest' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Percent size={14} /> Yield & Interest
          </button>
        </div>
      </header>

      {/* RENDER VIEW A: EQUATED MONTHLY INSTALLMENT ENGINE */}
      {activeTab === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* INPUT FORM BLOCK CONTAINER */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm space-y-5 h-fit">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Coins className="text-indigo-600" size={16} /> Principal Variables
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Loan Principal Amount (INR)</label>
                <input 
                  type="number" value={emiInputs.principal} onChange={(e) => setEmiInputs({...emiInputs, principal: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Interest Rate (% P.A.)</label>
                <input 
                  type="number" step="0.1" value={emiInputs.rate} onChange={(e) => setEmiInputs({...emiInputs, rate: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Tenure Horizon Duration (Years)</label>
                <input 
                  type="number" value={emiInputs.tenure} onChange={(e) => setEmiInputs({...emiInputs, tenure: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC METRIC GENERATION PANEL CARD OVERVIEWS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100/30 space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Calculated Monthly EMI</span>
                <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{emiResults.monthlyEmi.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Interest Component</span>
                <p className="text-xl font-bold text-slate-800 tracking-tight">₹{emiResults.totalInterest.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Total Absolute Payment</span>
                <p className="text-xl font-bold text-slate-800 tracking-tight">₹{emiResults.totalPayment.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* FORMULA ARCHITECTURE BLUEPRINT NOTES EXPLANATION */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle size={14} /> System Formula Insight
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Loan calculations utilize the standard mathematical monthly reducing amortization framework model:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center font-mono text-sm text-indigo-600 font-bold overflow-x-auto">
                {/* $$E = \frac{P \cdot r \cdot (1+r)^n}{(1+r)^n - 1}$$ */}
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Where $P$ represents absolute principal volume, $r$ defines monthly compounded fractional conversion parameters, and $n$ targets total monthly billing iteration limits.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* RENDER VIEW B: SIMPLE & COMPOUND INTEREST HORIZONS PROJECTOR */}
      {activeTab === 'interest' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CONTROL BOX PACKET ELEMENT */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm space-y-5 h-fit">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
              <RefreshCw className="text-indigo-600" size={15} /> Compounding Variables
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Compounding Routine Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" onClick={() => setInterestInputs({...interestInputs, type: 'simple'})}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${interestInputs.type === 'simple' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    Simple
                  </button>
                  <button 
                    type="button" onClick={() => setInterestInputs({...interestInputs, type: 'compound'})}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${interestInputs.type === 'compound' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    Compound
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Initial Deposit Principal (INR)</label>
                <input 
                  type="number" value={interestInputs.principal} onChange={(e) => setInterestInputs({...interestInputs, principal: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Expected Yield Rate (% P.A.)</label>
                <input 
                  type="number" step="0.01" value={interestInputs.rate} onChange={(e) => setInterestInputs({...interestInputs, rate: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Time Horizon Interval (Years)</label>
                <input 
                  type="number" value={interestInputs.time} onChange={(e) => setInterestInputs({...interestInputs, time: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* PROJECTED INCREMENTAL COMPOUND RETURN DATA OUTPUT DISPLAYS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100/30 space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Estimated Net Interest Earned</span>
                <p className="text-3xl font-black text-emerald-600 tracking-tight">₹{interestResults.interestEarned.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Terminal Maturity Amount</span>
                <p className="text-3xl font-black text-slate-900 tracking-tight">₹{interestResults.maturityAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm space-y-2 text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Overall Capital Growth Multiple Trajectory Shift:</span>
              <span className="text-indigo-600 font-bold font-mono">
                +{((interestResults.maturityAmount / (interestInputs.principal || 1) - 1) * 100).toFixed(1)}% yield accumulation
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Tools;