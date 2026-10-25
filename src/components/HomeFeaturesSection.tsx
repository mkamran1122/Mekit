import React from 'react';
import { Link } from '../utils/router';
import { Target, Maximize2, Sliders, Layers, ShieldCheck, Zap, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { AdSlot } from './ads/AdSlot';

export const HomeFeaturesSection: React.FC = () => {
  return (
    <section className="mt-16 pt-12 border-t border-neutral-200 space-y-16">
      
      {/* 4 Tool Deep-Dives */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Comprehensive In-Browser Utilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Everything You Need for Image Optimization
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Professional photo tools that run locally in your browser with zero server uploads, no accounts, and no watermarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Tool 1 */}
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Smart Target Size Compressor</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Need an image under 50 KB or 100 KB for an online portal? Our binary search algorithm iteratively tests quality levels to give you the sharpest possible output strictly under your target byte limit.
              </p>
            </div>
            <Link
              href="/compress-image"
              className="text-xs font-bold text-neutral-900 hover:text-amber-700 inline-flex items-center gap-1 pt-2"
            >
              <span>Explore Compressor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tool 2 */}
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Maximize2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Precision Image Resizer</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Change width and height in pixels or scale by percentage while locking aspect ratios. Includes built-in standard dimension presets for YouTube, Instagram, passports, and website banners.
              </p>
            </div>
            <Link
              href="/resize-image"
              className="text-xs font-bold text-neutral-900 hover:text-blue-700 inline-flex items-center gap-1 pt-2"
            >
              <span>Explore Resizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tool 3 */}
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Format & Quality Converter</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Convert between JPG, PNG, and WebP instantly. Automatically handles transparent alpha channels with clean white background fills when converting transparent PNGs into JPEGs.
              </p>
            </div>
            <Link
              href="/convert-image"
              className="text-xs font-bold text-neutral-900 hover:text-purple-700 inline-flex items-center gap-1 pt-2"
            >
              <span>Explore Converter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tool 4 */}
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Batch Processing Studio</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Process dozens of images simultaneously. Apply global presets or customize each image individually, then download all optimized files in a single organized ZIP archive.
              </p>
            </div>
            <Link
              href="/batch-processing"
              className="text-xs font-bold text-neutral-900 hover:text-emerald-700 inline-flex items-center gap-1 pt-2"
            >
              <span>Explore Batch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3-Step Workflow Guide */}
      <div className="p-6 sm:p-10 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            How to Use Mekit in 3 Easy Steps
          </h2>
          <p className="text-xs text-neutral-600">
            No software installation, no sign-ups, and no waiting queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-neutral-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Add Your Images</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Drag and drop single or multiple photos, browse from your folder, or press Ctrl+V to paste directly from your clipboard.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Choose Your Constraints</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Select a target size (20KB, 50KB, 100KB, 200KB), input target dimensions, or choose a one-click preset for job forms.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Compare & Download</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Inspect visual clarity with the interactive Before/After comparison slider, then download individual files or a batch ZIP.
            </p>
          </div>
        </div>
      </div>

      {/* Format Comparison Quick Reference */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Format Selection Reference</h2>
        <div className="overflow-x-auto border border-neutral-200 rounded-xl">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-900 font-bold">
              <tr>
                <th className="p-3">Format</th>
                <th className="p-3">Compression Type</th>
                <th className="p-3">Transparency (Alpha)</th>
                <th className="p-3">Best Recommended Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              <tr>
                <td className="p-3 font-bold text-neutral-900">JPEG / JPG</td>
                <td className="p-3">Lossy</td>
                <td className="p-3 text-neutral-500">No (Replaced with white)</td>
                <td className="p-3">Government forms, job applications, student portals, camera photos.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-neutral-900">PNG</td>
                <td className="p-3">Lossless</td>
                <td className="p-3 text-emerald-600 font-medium">Yes (Full alpha support)</td>
                <td className="p-3">Logos, digital signatures, screenshots, transparent graphics.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-neutral-900">WebP</td>
                <td className="p-3">Lossy & Lossless</td>
                <td className="p-3 text-emerald-600 font-medium">Yes (Full alpha support)</td>
                <td className="p-3">Modern websites, blogs, portfolios seeking 30% smaller file sizes.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy-Safe Ad Placement (Disabled until approved, isolated from tool controls) */}
      <AdSlot slotKey="HOMEPAGE_MID" className="pt-4" />

    </section>
  );
};
