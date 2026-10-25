import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from '../utils/router';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1">
              <Link href="/" className="text-lg font-extrabold tracking-tight text-neutral-900 inline-flex items-baseline">
                mekit<span className="text-xs font-bold text-amber-600">.online</span>
              </Link>
              <span className="text-xs text-neutral-400 mx-1">·</span>
              <span className="text-xs text-neutral-500">
                Free, privacy-first image compression & resizing
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Processed directly in your browser. Zero uploads, zero watermarks, 100% free.
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-neutral-600">
            <Link href="/" className="hover:text-neutral-900 transition-colors py-1">
              Studio
            </Link>
            <Link href="/compress-image" className="hover:text-neutral-900 transition-colors py-1">
              Compressor
            </Link>
            <Link href="/resize-image" className="hover:text-neutral-900 transition-colors py-1">
              Resizer
            </Link>
            <Link href="/convert-image" className="hover:text-neutral-900 transition-colors py-1">
              Converter
            </Link>
            <Link href="/batch-processing" className="hover:text-neutral-900 transition-colors py-1">
              Batch Studio
            </Link>
            <Link href="/tutorials" className="hover:text-neutral-900 transition-colors py-1">
              Tutorials
            </Link>
            <Link href="/how-it-works" className="hover:text-neutral-900 transition-colors py-1">
              How It Works
            </Link>
            <Link href="/faq" className="hover:text-neutral-900 transition-colors py-1">
              FAQ
            </Link>
            <Link href="/about" className="hover:text-neutral-900 transition-colors py-1">
              About
            </Link>
            <Link href="/contact" className="hover:text-neutral-900 transition-colors py-1">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors py-1">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors py-1">
              Terms
            </Link>
            <Link href="/disclaimer" className="hover:text-neutral-900 transition-colors py-1">
              Disclaimer
            </Link>
          </nav>
        </div>

        {/* Bottom Bar with MK Labs Attribution, Copyright, and Privacy Badge */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            {/* MK Labs Branding */}
            <div className="flex items-center gap-2.5 bg-neutral-50 border border-neutral-200/90 px-3 py-1.5 rounded-lg shadow-2xs">
              <img
                src="/assets/aistudio/MK_Labs_703312e1.jpg"
                alt="MK Labs logo"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded object-cover border border-neutral-300/70 shrink-0"
              />
              <span className="text-xs text-neutral-800 font-semibold tracking-tight">
                MK Labs
              </span>
            </div>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <span className="text-neutral-400">
              © {new Date().getFullYear()} Mekit. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Client-side local processing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
