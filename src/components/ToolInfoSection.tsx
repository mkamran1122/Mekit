import React from 'react';
import { Link } from '../utils/router';
import { AdSlot } from './ads/AdSlot';
import { Target, Maximize2, Sliders, Layers, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ToolInfoSectionProps {
  toolType: 'compressor' | 'resizer' | 'converter' | 'batch';
}

export const ToolInfoSection: React.FC<ToolInfoSectionProps> = ({ toolType }) => {
  if (toolType === 'compressor') {
    return (
      <section className="mt-16 pt-12 border-t border-neutral-200 space-y-12 text-neutral-800">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-600" />
            <span>Image Compression Guide & Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            How to Compress Images to Exact KB Limits Online
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Mekit's free online image compressor allows you to reduce image file size for government forms, university portals, job applications, and websites. Unlike ordinary compressors that only provide a fixed percentage slider, Mekit features a <strong>Smart Target Size</strong> engine that searches for the highest image quality that stays under your required file-size ceiling.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <h3 className="font-bold text-sm text-neutral-900">Preset & Custom KB Ceilings</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Quickly select <strong>20 KB</strong>, <strong>50 KB</strong>, <strong>100 KB</strong>, <strong>200 KB</strong>, <strong>500 KB</strong>, <strong>1 MB</strong>, or enter your own custom limit in KB or MB.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <h3 className="font-bold text-sm text-neutral-900">Intelligent Quality Search</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Our binary search algorithm tests multiple encoding quality levels in your browser within milliseconds to preserve maximum visual clarity.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <h3 className="font-bold text-sm text-neutral-900">Safe Downscaling Fallback</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              If quality reduction alone cannot fit a massive 4K camera photo under 50 KB, optional downscaling reduces resolution to hit the target cleanly.
            </p>
          </div>
        </div>

        {/* Supported formats & practical constraints */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">Supported Formats & Practical Limitations</h3>
          <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>
              • <strong>JPEG / JPG:</strong> The universal format for photographic images. Best suited for hitting strict KB limits on portals. Lossy compression achieves small file sizes while keeping faces and documents clear.
            </p>
            <p>
              • <strong>PNG:</strong> A lossless format designed for graphics, transparent logos, and screenshots. <em>Note:</em> Because PNG encoding does not support lossy quality reduction in browsers, reaching small KB limits with PNG requires reducing pixel dimensions or converting to WebP/JPEG.
            </p>
            <p>
              • <strong>WebP:</strong> The modern web standard offering 25–35% smaller file sizes than JPEG at equivalent visual quality, with full transparency support.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">Frequently Asked Questions About Image Compression</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1.5">
              <h4 className="font-bold text-neutral-900">How do I compress an image to under 100 KB?</h4>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Upload your file, click the "100 KB" preset button, and click "Process All". If the source image is huge (e.g. 4000×3000px), keep "Allow dimension downscaling" enabled so the image scales down smoothly to satisfy the 100 KB rule.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1.5">
              <h4 className="font-bold text-neutral-900">Are my images sent to a server?</h4>
              <p className="text-neutral-600 text-xs leading-relaxed">
                No. All image compression runs directly inside your web browser using HTML5 Canvas. Your files are never uploaded to any remote server or third-party service.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Links to Related Tools & Tutorials */}
        <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="text-neutral-500">Related Tools & Guides:</span>
          <Link href="/resize-image" className="text-neutral-900 hover:underline">
            Image Resizer →
          </Link>
          <span className="text-neutral-300">·</span>
          <Link href="/convert-image" className="text-neutral-900 hover:underline">
            Format Converter →
          </Link>
          <span className="text-neutral-300">·</span>
          <Link href="/batch-processing" className="text-neutral-900 hover:underline">
            Bulk Batch Processing →
          </Link>
          <span className="text-neutral-300">·</span>
          <Link href="/tutorials" className="text-neutral-900 hover:underline">
            Compression Tutorials →
          </Link>
        </div>

        <AdSlot slotKey="TOOL_INFO_BOTTOM" className="mt-8 pt-4 border-t border-neutral-100" />
      </section>
    );
  }

  if (toolType === 'resizer') {
    return (
      <section className="mt-16 pt-12 border-t border-neutral-200 space-y-12 text-neutral-800">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <Maximize2 className="w-4 h-4 text-neutral-700" />
            <span>Image Resizing Guide & Presets</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            How to Resize Images in Pixels Without Distortion
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Mekit's free online image resizer gives you exact control over pixel width and height. With aspect ratio locking, prevent accidental image squishing or stretching. Choose between <strong>Fit Inside</strong> (contain) and <strong>Crop to Fit</strong> (cover) modes, or select verified dimension presets for social media and document portals.
          </p>
        </div>

        {/* Resizing Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <h3 className="font-bold text-sm text-neutral-900">Custom Width & Height</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Enter exact pixel values. When aspect ratio lock is enabled, typing a width automatically calculates the proportionate height.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <h3 className="font-bold text-sm text-neutral-900">Fit vs Crop to Fit</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              <strong>Fit Inside</strong> preserves the entire image within boundaries. <strong>Crop to Fit</strong> fills the entire frame and neatly trims outer edges from center without distortion.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <h3 className="font-bold text-sm text-neutral-900">Rotate & Flip Controls</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Correct orientation with 90° clockwise rotations or mirror images with horizontal and vertical flipping.
            </p>
          </div>
        </div>

        {/* Verified Dimension Presets */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">Verified Dimension Presets Included</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900">Instagram Square</strong>
              <span className="text-neutral-500 font-mono">1080 × 1080 px (1:1)</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900">Instagram Story / Reel</strong>
              <span className="text-neutral-500 font-mono">1080 × 1920 px (9:16)</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900">YouTube Thumbnail</strong>
              <span className="text-neutral-500 font-mono">1280 × 720 px (16:9)</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900">Passport / ID Photo</strong>
              <span className="text-neutral-500 font-mono">600 × 600 px (2×2 in)</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900">LinkedIn Banner</strong>
              <span className="text-neutral-500 font-mono">1584 × 396 px (4:1)</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900">Twitter / X Header</strong>
              <span className="text-neutral-500 font-mono">1500 × 500 px (3:1)</span>
            </div>
          </div>
        </div>

        {/* Internal Links */}
        <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="text-neutral-500">Related Tools & Guides:</span>
          <Link href="/compress-image" className="text-neutral-900 hover:underline">
            Image Compressor →
          </Link>
          <span className="text-neutral-300">·</span>
          <Link href="/convert-image" className="text-neutral-900 hover:underline">
            Format Converter →
          </Link>
          <span className="text-neutral-300">·</span>
          <Link href="/tutorials" className="text-neutral-900 hover:underline">
            Resizing Without Distortion Tutorial →
          </Link>
        </div>

        <AdSlot slotKey="TOOL_INFO_BOTTOM" className="mt-8 pt-4 border-t border-neutral-100" />
      </section>
    );
  }

  if (toolType === 'converter') {
    return (
      <section className="mt-16 pt-12 border-t border-neutral-200 space-y-12 text-neutral-800">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-neutral-700" />
            <span>Format Conversion Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Convert JPG, PNG, and WebP Images Online
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Convert image formats safely in your browser. Whether you need a transparent PNG converted to JPEG for an official form, or want to modernize JPEG photos into lightweight WebP images for your website, Mekit executes the conversion locally with correct MIME types and safe file extensions.
          </p>
        </div>

        {/* Transparency Advice */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
          <h3 className="text-base font-bold text-neutral-900">Automatic Transparency Protection</h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            JPEG does not support alpha transparency channels. When converting transparent PNG or WebP images to JPEG, standard canvas implementations can render transparent areas as black boxes. Mekit automatically fills transparent areas with a clean, solid white background to guarantee pristine form presentation.
          </p>
        </div>

        {/* Internal Links */}
        <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="text-neutral-500">Related Tools:</span>
          <Link href="/compress-image" className="text-neutral-900 hover:underline">
            Image Compressor →
          </Link>
          <span className="text-neutral-300">·</span>
          <Link href="/resize-image" className="text-neutral-900 hover:underline">
            Image Resizer →
          </Link>
          <span className="text-neutral-300">·</span>
          <Link href="/batch-processing" className="text-neutral-900 hover:underline">
            Batch Studio →
          </Link>
        </div>

        <AdSlot slotKey="TOOL_INFO_BOTTOM" className="mt-8 pt-4 border-t border-neutral-100" />
      </section>
    );
  }

  // Batch Studio
  return (
    <section className="mt-16 pt-12 border-t border-neutral-200 space-y-12 text-neutral-800">
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-neutral-700" />
          <span>Bulk Processing Documentation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          Batch Compress, Resize & Export Images as ZIP
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          Need to process multiple images for a project, store catalog, or school roster? Mekit allows you to drag and drop groups of images at once, apply uniform compression or resizing settings across all files, configure individual overrides where needed, and download the entire batch packed in a single ZIP file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
          <h3 className="font-bold text-sm text-neutral-900">Progressive Queue</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Images are processed sequentially in your browser so memory usage remains low and your interface never freezes.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
          <h3 className="font-bold text-sm text-neutral-900">Download All as ZIP</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Get your processed files neatly packaged in a standard ZIP archive with clean filenames and no duplicate conflicts.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
          <h3 className="font-bold text-sm text-neutral-900">CSV Audit Report</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Export a full spreadsheet report documenting original vs final byte sizes, dimensions, and percentage savings.
          </p>
        </div>
      </div>

      {/* Internal Links */}
      <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
        <span className="text-neutral-500">Related Tools:</span>
        <Link href="/compress-image" className="text-neutral-900 hover:underline">
          Image Compressor →
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/resize-image" className="text-neutral-900 hover:underline">
          Image Resizer →
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/tutorials" className="text-neutral-900 hover:underline">
          Batch Processing Tutorial →
        </Link>
      </div>

      <AdSlot slotKey="TOOL_INFO_BOTTOM" className="mt-8 pt-4 border-t border-neutral-100" />
    </section>
  );
};
