import React from 'react';

interface AdPlaceholderProps {
  slotKey: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  minHeight?: number;
}

/**
 * Developer-only placeholder to verify ad layout positioning during development.
 * Never displays fake ads, fake images, or imitations of Google ads.
 */
export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotKey,
  format = 'responsive',
  minHeight = 90
}) => {
  return (
    <aside
      aria-label="Ad Placement Preview"
      className="w-full my-6 p-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/70 text-center flex flex-col items-center justify-center transition-all"
      style={{ minHeight: `${minHeight}px` }}
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
        Ad Placement Preview ({format})
      </span>
      <p className="text-xs text-neutral-500 mt-1 font-mono">
        Slot: <span className="font-semibold text-neutral-700">{slotKey}</span>
      </p>
      <span className="text-[10px] text-neutral-400 mt-1">
        Disabled by default. Configure in <code className="font-mono text-neutral-600">src/config/ads.ts</code> after AdSense approval.
      </span>
    </aside>
  );
};
