import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { track } from '@vercel/analytics'; // 1. Added Vercel Analytics import

function InstallPWAButton() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      setSupportsPWA(false);
      return;
    }

    // Listener 1: Wait for the browser to allow installation
    const promptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setSupportsPWA(true);
    };
    window.addEventListener('beforeinstallprompt', promptHandler);

    // Listener 2: THE TRACKER - Fires the exact second they install
    const installHandler = () => {
      console.log('✅ Success! The user installed Spentio.');
      track('pwa_installed'); // 2. Sends the install event to your Vercel Dashboard
    };
    window.addEventListener('appinstalled', installHandler);

    // Cleanup listeners when the component unmounts
    return () => {
      window.removeEventListener('beforeinstallprompt', promptHandler);
      window.removeEventListener('appinstalled', installHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setSupportsPWA(false);
    }
  };

  if (!supportsPWA) return null;

  return (
    <div className="pt-2">
      <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">Native App</span>
      <button
        onClick={handleInstallClick}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 dark:from-amber-500/5 dark:to-orange-500/5 text-amber-700 dark:text-amber-400 font-bold text-xs rounded-xl border border-amber-200/40 dark:border-amber-500/10 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <Smartphone size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
          <span>Install App</span>
        </div>
        <span className="bg-amber-500 dark:bg-amber-400 text-white dark:text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider shadow-xs">Free</span>
      </button>
    </div>
  );
}

export default InstallPWAButton;