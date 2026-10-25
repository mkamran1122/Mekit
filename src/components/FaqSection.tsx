import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AdSlot } from './ads/AdSlot';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is mekit.online truly free without watermarks, daily limits, or subscriptions?',
      a: 'Yes, 100% free. There are no paid tiers, credits, subscription popups, artificial daily conversion quotas, or watermarks placed on your images. The core tool will remain free forever.'
    },
    {
      q: 'Are my photos ever uploaded to a server or saved in the cloud?',
      a: 'Never. mekit.online processes your images directly inside your web browser using HTML5 Canvas and browser-native image codecs. Your image files never leave your device, and no server has access to your photos or filenames.'
    },
    {
      q: 'How does the Smart Target File Size feature work?',
      a: 'When you select a target (such as 50 KB or 100 KB), mekit.online uses an intelligent binary search algorithm to test different compression qualities and, if permitted, dimension downscaling. It finds the highest quality settings that produce a file strictly under your target limit.'
    },
    {
      q: 'Why can’t lossless PNG always hit arbitrary small file sizes (e.g. 50 KB)?',
      a: 'PNG is a lossless format designed for crisp graphics, icons, and text with transparent backgrounds. Unlike JPEG or WebP, browsers do not support variable quality lossy compression for PNG. To meet strict targets with PNG, dimensions must be scaled down, or the image can be converted to WebP or JPEG.'
    },
    {
      q: 'What happens to transparent backgrounds when converting to JPEG?',
      a: 'The JPEG standard does not support alpha channel transparency. When converting a transparent PNG or WebP to JPEG, mekit.online automatically fills transparent areas with a clean white background so your images don’t end up with black borders.'
    },
    {
      q: 'How many images can I process at once?',
      a: 'You can process dozens of images in batch. Because processing is executed inside your browser, batch performance depends on your device memory (RAM). Files are processed progressively one by one to avoid locking up your browser.'
    },
    {
      q: 'Does mekit.online work on iPhone, iPad, and Android devices?',
      a: 'Yes! mekit.online is fully responsive and compatible with modern mobile browsers (Safari, Chrome, Firefox, Edge). You can pick photos directly from your camera roll or photo library.'
    },
    {
      q: 'Why does mekit.online strip EXIF metadata by default?',
      a: 'Modern camera photos contain hidden metadata including GPS coordinates of where you took the photo, camera serial number, date/time, and thumbnail previews. Stripping this data protects your personal privacy when submitting files to online forms and saves 10 to 30 KB of unnecessary file weight.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="space-y-2">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
          <a href="/" className="hover:text-neutral-900">Home</a>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-800">FAQ</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          Frequently Asked Questions – Mekit Image Tools
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Everything you need to know about privacy, compression limits, and supported formats on mekit.online.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-neutral-900 hover:text-neutral-700 hover:bg-neutral-50/50"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AdSlot slotKey="FAQ_BOTTOM" className="mt-8 pt-4 border-t border-neutral-100" />
    </div>
  );
};
