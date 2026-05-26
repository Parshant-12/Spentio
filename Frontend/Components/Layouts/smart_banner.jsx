import React, { useState, useEffect } from 'react';
import { Share, MoreVertical, X, PlusSquare } from 'lucide-react';

function InstallGuide() {
  const [deviceType, setDeviceType] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Check if they ALREADY installed it
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) return; // Hide if already installed

    // 2. Detect the operating system
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
      setDeviceType('ios');
      setIsVisible(true);
    } else if (isAndroid) {
      setDeviceType('android');
      setIsVisible(true);
    }
    // We do not show this on Desktop, as the desktop button works perfectly
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-4">
        
        {/* App Icon / Logo */}
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
          <span className="font-black text-lg">S</span>
        </div>

        {/* Dynamic Instructions */}
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-1">Install Spentio</h4>
          
          {deviceType === 'ios' ? (
            <p className="text-xs text-slate-300 leading-relaxed">
              Tap the <Share size={12} className="inline mx-0.5 text-blue-400" /> <strong>Share</strong> button at the bottom of your screen, then select <PlusSquare size={12} className="inline mx-0.5" /> <strong>Add to Home Screen</strong>.
            </p>
          ) : (
            <p className="text-xs text-slate-300 leading-relaxed">
              Tap the <MoreVertical size={12} className="inline mx-0.5 text-blue-400" /> <strong>Menu</strong> icon at the top right of your browser, then select <strong>Add to Home screen</strong>.
            </p>
          )}
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors shrink-0 cursor-pointer"
        >
          <X size={14} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}

export default InstallGuide;