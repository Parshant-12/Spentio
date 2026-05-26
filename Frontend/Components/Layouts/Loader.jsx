import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 h-full w-full">
      {/* The animate-spin class handles the rotation automatically */}
      <Loader2 size={40} className="text-indigo-600 dark:text-indigo-500 animate-spin" />
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}