import React, { useState, useEffect } from 'react';
import { Link } from '../utils/router';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('mekit_cookie_consent');
      if (!consent) {
        // Small delay to prevent initial page layout jump
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage access blocked or restricted
    }
  }, []);

  const handleConsent = (choice: 'accepted' | 'essential') => {
    try {
      localStorage.setItem('mekit_cookie_consent', choice);
    } catch {
      // Storage fallback
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy and Cookie Notice"
      className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-300 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Privacy & Cookie Preferences</span>
        </div>
        <button
          type="button"
          onClick={() => handleConsent('essential')}
          className="text-neutral-400 hover:text-neutral-700 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center rounded transition-colors"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
        Mekit processes your images <strong>100% locally in your browser</strong> with zero server uploads. We use browser local storage to save your workspace preferences and, when enabled, third-party advertising partners (such as Google) may use cookies to serve relevant ads.
      </p>

      <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => handleConsent('accepted')}
          className="px-4 py-2 min-h-[38px] text-xs font-bold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => handleConsent('essential')}
          className="px-4 py-2 min-h-[38px] text-xs font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center"
        >
          Essential Only
        </button>
        <Link
          href="/privacy"
          className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline ml-auto py-1.5"
        >
          Privacy Policy
        </Link>
      </div>
    </aside>
  );
};
