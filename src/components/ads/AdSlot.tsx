import React, { useEffect, useRef } from 'react';
import { ADS_CONFIG, AdSlotsConfig } from '../../config/ads';
import { AdPlaceholder } from './AdPlaceholder';

interface AdSlotProps {
  slotKey: keyof AdSlotsConfig;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
  minHeight?: number;
}

/**
 * Reusable Google AdSense Ad Slot Component
 *
 * AdSense Policy Safeguards:
 * - Disabled by default (`ADS_CONFIG.ADS_ENABLED = false`).
 * - Renders nothing when disabled (no layout shifts, zero fake ads).
 * - Only mounts real <ins class="adsbygoogle"> when enabled with valid publisher & slot IDs.
 * - Always clearly labeled with standard "ADVERTISEMENT" header when active.
 * - Isolated from tool buttons and interactive elements to prevent accidental clicks.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotKey,
  format = 'responsive',
  className = '',
  minHeight = 100
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef<boolean>(false);

  const isConfigured =
    ADS_CONFIG.ADS_ENABLED &&
    Boolean(ADS_CONFIG.PUBLISHER_ID) &&
    Boolean(ADS_CONFIG.SLOTS[slotKey]);

  useEffect(() => {
    if (!isConfigured || pushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        pushedRef.current = true;
      }
    } catch (err) {
      // Ignore push errors in non-AdSense environments or ad-blocked browsers
      console.warn('AdSense slot initialization:', err);
    }
  }, [isConfigured]);

  // If ads are disabled and test outline is requested, show dev placeholder
  if (!isConfigured) {
    if (ADS_CONFIG.SHOW_TEST_OUTLINE) {
      return <AdPlaceholder slotKey={slotKey} format={format} minHeight={minHeight} />;
    }
    return null;
  }

  const slotId = ADS_CONFIG.SLOTS[slotKey];
  const adFormat = format === 'responsive' ? 'auto' : format;

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full my-8 text-center overflow-hidden transition-all ${className}`}
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1 select-none">
        Advertisement
      </div>
      <div className="flex justify-center items-center w-full">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: `${minHeight - 20}px`, width: '100%' }}
          data-ad-client={ADS_CONFIG.PUBLISHER_ID}
          data-ad-slot={slotId}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
