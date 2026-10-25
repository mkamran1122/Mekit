import React from 'react';
import { ShieldCheck, Zap, FileCheck } from 'lucide-react';
import { AdSlot } from './ads/AdSlot';

export const HowItWorksSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <div className="space-y-2">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
          <a href="/" className="hover:text-neutral-900">Home</a>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-800">How It Works</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          How mekit.online Works – Client-Side Architecture
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Complete architectural transparency: how we achieve fast, high-fidelity compression and resizing directly in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            1. Zero-Upload Local Processing
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Unlike other converter websites that upload your personal photos to remote cloud servers, mekit.online uses HTML5 Canvas and browser-native image encoders. Your files stay strictly in your computer's RAM.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            2. Binary Search Target Engine
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            When you set a target limit (e.g. 50 KB or 100 KB), mekit.online conducts an automated binary search over encoding quality and downscaling factors to discover the highest visual sharpness that stays under your byte budget.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <FileCheck className="w-5 h-5 text-neutral-900" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            3. Privacy EXIF Stripping
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            When re-encoding new image blobs from Canvas, intrusive GPS coordinates, camera serial numbers, and device details are cleanly discarded. This protects your privacy and reduces file weight.
          </p>
        </div>
      </div>

      {/* Technical Pipeline Breakdown */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 space-y-6 shadow-xs">
        <h3 className="text-lg font-bold text-neutral-900">
          The In-Browser Processing Pipeline
        </h3>

        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
          <div className="flex gap-4 items-start">
            <div className="font-mono font-bold text-neutral-900 shrink-0 text-sm">
              Step 01
            </div>
            <div>
              <strong className="text-neutral-900 block mb-0.5">
                Client File Ingestion & Alpha Detection
              </strong>
              The browser reads your File objects via `URL.createObjectURL`. mekit.online analyzes image dimensions, format headers, and samples pixel opacity to detect alpha transparency channels.
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="font-mono font-bold text-neutral-900 shrink-0 text-sm">
              Step 02
            </div>
            <div>
              <strong className="text-neutral-900 block mb-0.5">
                Geometric Transformation & Matrix Rendering
              </strong>
              Transforms (rotations of 90°/180°/270°, horizontal or vertical flips, and aspect-ratio locked resizing) are applied through high-quality bicubic canvas rendering context with `imageSmoothingQuality = 'high'`.
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="font-mono font-bold text-neutral-900 shrink-0 text-sm">
              Step 03
            </div>
            <div>
              <strong className="text-neutral-900 block mb-0.5">
                Iterative Quality Convergence & Target Validation
              </strong>
              If a target size is requested, mekit.online runs a rapid logarithmic search (usually 6–7 iterations in milliseconds) to locate the highest quality factor producing a file size strictly below your limit.
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="font-mono font-bold text-neutral-900 shrink-0 text-sm">
              Step 04
            </div>
            <div>
              <strong className="text-neutral-900 block mb-0.5">
                Blob Generation & Memory Disposal
              </strong>
              The final binary is converted to an in-memory `Blob`. Temporary canvas contexts are released, and when you finish or remove images, all allocated object URLs are explicitly revoked.
            </div>
          </div>
        </div>
      </div>

      <AdSlot slotKey="HOW_IT_WORKS_BOTTOM" className="mt-8 pt-4 border-t border-neutral-100" />
    </div>
  );
};
