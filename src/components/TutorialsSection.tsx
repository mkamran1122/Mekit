import React, { useState } from 'react';
import { Link } from '../utils/router';
import { AdSlot } from './ads/AdSlot';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCode2
} from 'lucide-react';

interface TutorialsSectionProps {
  onSelectTool?: (tool: 'studio' | 'compressor' | 'resizer' | 'converter') => void;
}

export const TutorialsSection: React.FC<TutorialsSectionProps> = ({ onSelectTool }) => {
  const [activeTutorialId, setActiveTutorialId] = useState<string>('tut-overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tutorials = [
    {
      id: 'tut-overview',
      number: '01',
      title: 'How to Use mekit.online (A to Z Guide)',
      shortDesc: 'Step-by-step walkthrough of opening the site, uploading, configuring settings, and downloading.',
      badge: 'Core Workflow'
    },
    {
      id: 'tut-compress',
      number: '02',
      title: 'How to Compress an Image to Target KB',
      shortDesc: 'Hit exact file size ceilings (50 KB, 100 KB, 200 KB) for forms without ugly pixelation.',
      badge: 'Signature Feature'
    },
    {
      id: 'tut-resize',
      number: '03',
      title: 'How to Resize Without Distortion',
      shortDesc: 'Master pixel dimensions, aspect ratio locking, fit vs crop modes, and social media presets.',
      badge: 'Resizing & Aspect Ratio'
    },
    {
      id: 'tut-batch',
      number: '04',
      title: 'How to Process Multiple Images & Download ZIP',
      shortDesc: 'Queue dozens of photos at once, override individual settings, and export as a ZIP archive.',
      badge: 'Batch Studio'
    },
    {
      id: 'tut-troubleshoot',
      number: '05',
      title: 'Supported Formats & Troubleshooting',
      shortDesc: 'Supported image types, resolving format errors, download blockers, and browser cache fixes.',
      badge: 'Troubleshooting'
    },
    {
      id: 'tut-privacy',
      number: '06',
      title: 'Privacy & In-Browser Processing',
      shortDesc: 'Technical explanation of zero-upload client-side processing and automatic EXIF GPS stripping.',
      badge: 'Security & Privacy'
    },
    {
      id: 'tut-formats',
      number: '07',
      title: 'JPG vs. PNG vs. WebP Comparison Guide',
      shortDesc: 'Clear breakdown of compression efficiency, transparency support, browser compatibility, and best uses.',
      badge: 'Format Guide'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* Header with Back to Tools button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="space-y-1">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-800">Tutorials</span>
          </nav>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider pt-1">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Complete Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
            Image Compression & Resizing Tutorials
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Original step-by-step guides covering target KB limits, pixel scaling, format conversions, batch processing, and privacy.
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs inline-flex items-center gap-2 shrink-0"
        >
          <span>← Back to Workspace</span>
        </Link>
      </div>

      {/* Tutorial Cards Navigation / Table of Contents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tutorials.map((t) => {
          const isSelected = activeTutorialId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTutorialId(t.id)}
              className={`p-4 text-left rounded-xl border transition-all ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-50 shadow-xs ring-1 ring-neutral-900'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-neutral-400">{t.number}</span>
                <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                  {t.badge}
                </span>
              </div>
              <h3 className="text-xs font-bold text-neutral-900 line-clamp-1">
                {t.title}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                {t.shortDesc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Selected Tutorial View */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-8">

        {/* TUTORIAL 1: OVERVIEW */}
        {activeTutorialId === 'tut-overview' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tutorial 01</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                How to Use mekit.online from Start to Finish
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                A simple 8-step guide to get your images formatted, compressed, and downloaded in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  step: '1',
                  title: 'Open the Website',
                  desc: 'Visit mekit.online in any modern desktop or mobile browser (Chrome, Safari, Edge, Firefox). No account or login required.'
                },
                {
                  step: '2',
                  title: 'Select the Tool You Need',
                  desc: 'Use the top navigation to switch between Compressor (file size limits), Resizer (pixel dimensions), or Converter (JPEG, PNG, WebP).'
                },
                {
                  step: '3',
                  title: 'Upload Your Image(s)',
                  desc: 'Drag and drop files into the upload box, click to browse your folders, or paste screenshots directly from your clipboard (Ctrl+V / ⌘V).'
                },
                {
                  step: '4',
                  title: 'Choose Desired Settings',
                  desc: 'Select a target size (e.g. 100 KB), enter exact dimensions, or pick a verified preset for forms or social media.'
                },
                {
                  step: '5',
                  title: 'Start Processing',
                  desc: 'Click "Process All" or click the refresh icon on any individual image in the queue to run the in-browser canvas algorithm.'
                },
                {
                  step: '6',
                  title: 'Preview the Results',
                  desc: 'Click the "Compare" button to open an interactive Before & After split slider and inspect quality at 100% or 200% zoom.'
                },
                {
                  step: '7',
                  title: 'Download Finished Images',
                  desc: 'Click "Download" on any processed item, or click "Download All as ZIP" to get every compressed image packed into a single zip file.'
                },
                {
                  step: '8',
                  title: 'Batch Processing Supported',
                  desc: 'You can upload and process dozens of images simultaneously. Each file retains its own settings or follows the global preset.'
                }
              ].map((item) => (
                <div key={item.step} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{item.title}</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
              >
                <span>Launch Workspace Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TUTORIAL 2: COMPRESS */}
        {activeTutorialId === 'tut-compress' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tutorial 02</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                How to Compress an Image to a Target File Size
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Understand how image compression works and hit strict 20 KB, 50 KB, 100 KB, or 200 KB requirements for online forms.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-950 text-xs sm:text-sm mb-1">
                  What is Image Compression in Simple Terms?
                </h4>
                <p className="text-xs text-amber-900">
                  Every digital photo is made of millions of tiny colored pixels. Compression works by grouping similar neighboring colors and discarding invisible details. Lossy formats (like JPEG and WebP) reduce file size dramatically while keeping the photo looking sharp to human eyes.
                </p>
              </div>

              <h4 className="font-bold text-neutral-900 text-sm pt-2">Step-by-Step Compression Guide:</h4>
              <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm">
                <li>
                  <strong>Upload Your Image:</strong> Drop a JPG, WebP, or PNG file into mekit.online.
                </li>
                <li>
                  <strong>Select "Smart Target Size":</strong> Under the settings panel, select one of the quick presets (<strong>20 KB</strong>, <strong>50 KB</strong>, <strong>100 KB</strong>, <strong>200 KB</strong>, <strong>500 KB</strong>, <strong>1 MB</strong>) or type your custom requirement.
                </li>
                <li>
                  <strong>Understand Downscaling:</strong> If you check <em>"Allow dimension downscaling if needed"</em>, mekit will intelligently downscale huge camera resolutions (e.g. 4000×3000px) so the file comfortably reaches tiny limits like 50 KB without turning into a blurry pixelated mess.
                </li>
                <li>
                  <strong>Click "Process All":</strong> mekit runs an automated binary search in your browser, testing quality levels to find the highest possible visual clarity under your target limit.
                </li>
                <li>
                  <strong>Compare Before & After:</strong> Click <strong>Compare</strong> to slide between the original and compressed image and inspect details.
                </li>
                <li>
                  <strong>Download:</strong> Click <strong>Download</strong> to save the optimized file directly to your device.
                </li>
              </ol>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 mt-4 space-y-2">
                <h5 className="font-bold text-neutral-900 text-xs">Why an exact byte count is not guaranteed:</h5>
                <p className="text-xs text-neutral-600">
                  A target file size represents a <strong>maximum ceiling</strong>, not an exact byte number. If you choose 100 KB, mekit ensures the output is <em>under or equal to</em> 100 KB (for example, 94.2 KB). Because PNG is a lossless format, meeting tiny file sizes in PNG is impossible without reducing pixel dimensions or converting to WebP/JPEG.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/compress-image"
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
              >
                <span>Open Image Compressor Tool</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TUTORIAL 3: RESIZE */}
        {activeTutorialId === 'tut-resize' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tutorial 03</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                How to Resize an Image Without Stretching or Distortion
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Learn pixels, aspect ratios, fit vs crop modes, and verified platform dimension presets.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <h4 className="font-bold text-neutral-900 text-xs">What Are Pixels (px)?</h4>
                  <p className="text-xs text-neutral-600">
                    Pixels are the individual dots of light that form a digital image. A 1920×1080 image is 1920 pixels wide and 1080 pixels high.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <h4 className="font-bold text-neutral-900 text-xs">What is Aspect Ratio?</h4>
                  <p className="text-xs text-neutral-600">
                    Aspect ratio is the proportional relationship between width and height (e.g., 1:1 square, 16:9 widescreen). Locking it prevents squished faces or warped graphics.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-neutral-900 text-sm pt-2">Resizing Modes in mekit.online:</h4>
              <div className="space-y-2.5">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 text-xs block">1. Fit Inside (Contain) - Recommended</strong>
                  <span className="text-xs text-neutral-600">
                    Scales your image so it fits completely inside the chosen width and height without cropping or stretching anything out.
                  </span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 text-xs block">2. Crop to Fit (Cover)</strong>
                  <span className="text-xs text-neutral-600">
                    Fills the exact width and height. If the original proportions differ, it neatly crops excess edges from the center without distortion.
                  </span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 text-xs block">3. Scale by Percentage</strong>
                  <span className="text-xs text-neutral-600">
                    Quickly shrink by 25%, 50%, or 75% of the original size with one click.
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-neutral-900 text-sm pt-2">Verified Dimension Presets:</h4>
              <p className="text-xs text-neutral-600">
                You can pick instant presets from the dropdown:
                <br />• <strong>Instagram Square:</strong> 1080 × 1080 px
                <br />• <strong>Instagram Story / Reel:</strong> 1080 × 1920 px (9:16)
                <br />• <strong>YouTube Thumbnail:</strong> 1280 × 720 px (16:9)
                <br />• <strong>Passport / ID Photo:</strong> 600 × 600 px (300 DPI 2×2 in)
                <br />• <strong>LinkedIn Header:</strong> 1584 × 396 px
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/resize-image"
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
              >
                <span>Open Image Resizer Tool</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TUTORIAL 4: BATCH */}
        {activeTutorialId === 'tut-batch' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tutorial 04</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                How to Process Multiple Images & Download All as ZIP
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Save hours by resizing and compressing multiple photos simultaneously in one smooth batch.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Select Multiple Files:</strong> Drag a group of images into the upload area, or hold Shift/Ctrl in the file picker to select dozens of images.
                </li>
                <li>
                  <strong>Review Your Queue:</strong> Every image shows its thumbnail, original size, pixel dimensions, and detected file format.
                </li>
                <li>
                  <strong>Apply Global Settings or Individual Overrides:</strong> The settings in the Control Panel apply to all images by default. Want one specific photo to have a different target size? Click the sliders icon next to that image to set an individual override!
                </li>
                <li>
                  <strong>Progressive Batch Processing:</strong> When you click <em>Process All</em>, mekit processes images one by one in sequence. This prevents your browser tab from freezing or running out of memory.
                </li>
                <li>
                  <strong>Download All as ZIP:</strong> Once completed, click the black <strong>Download All as ZIP</strong> button. mekit archives all your compressed files into a clean zip file named <code>mekit-compressed-images.zip</code>.
                </li>
                <li>
                  <strong>Export CSV Report:</strong> Need an audit record of before/after sizes for your client or organization? Click <strong>Export CSV Report</strong> to download a spreadsheet with exact byte counts.
                </li>
              </ol>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/batch-processing"
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
              >
                <span>Start Batch Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TUTORIAL 5: TROUBLESHOOTING */}
        {activeTutorialId === 'tut-troubleshoot' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tutorial 05</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                Supported Formats & Troubleshooting Guide
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Answers to common file errors, format limitations, and browser download issues.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'What image formats are supported?',
                  a: 'mekit.online supports JPEG (.jpg, .jpeg), PNG (.png), and WebP (.webp). These formats have full native encoding support across all modern web browsers.'
                },
                {
                  q: 'Why did an image fail to process?',
                  a: 'If a file shows an error, it is typically because the file is corrupted, truncated, or is an animated GIF, vector SVG, or HEIC format that cannot be decoded by your browser’s canvas engine. Convert the source file to standard JPEG/PNG first or try another image.'
                },
                {
                  q: 'What should I do if the download does not start?',
                  a: 'Modern browsers occasionally block automatic file downloads if multiple files are downloaded quickly. Check your browser address bar for a blocked pop-up icon, click "Always allow downloads from mekit.online", and click Download again.'
                },
                {
                  q: 'Why did my transparent PNG get a white background when converted to JPEG?',
                  a: 'The JPEG image standard does not support an alpha transparency channel. Whenever any transparent PNG or WebP is converted to JPEG, transparent areas must be filled with a solid color (mekit uses clean white). If you require transparent backgrounds, select WebP or PNG as your output format.'
                },
                {
                  q: 'How do I reset and clear my session?',
                  a: 'Click the "Clear All" button in the queue to instantly release all in-memory image buffers, or simply refresh the page in your browser.'
                }
              ].map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="border border-neutral-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full px-4 py-3 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between gap-4 bg-neutral-50/50 hover:bg-neutral-100/60"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 text-xs text-neutral-600 bg-white border-t border-neutral-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
              >
                <span>Back to Workspace</span>
              </Link>
            </div>
          </div>
        )}

        {/* TUTORIAL 6: PRIVACY */}
        {activeTutorialId === 'tut-privacy' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tutorial 06</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                Privacy, Security & In-Browser Processing
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Accurate, verified details of how your personal data and photos remain completely private.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 block text-xs sm:text-sm">
                    Verified 100% Client-Side Processing
                  </strong>
                  <p className="text-xs text-emerald-900 mt-0.5">
                    Images are processed exclusively inside your browser’s temporary memory. Your files are <strong>never uploaded to a remote server</strong> or cloud computing provider.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-neutral-900 text-sm pt-2">How Does In-Browser Processing Work?</h4>
              <p>
                When you drag a file into mekit.online, JavaScript reads the file using the browser’s native <code>FileReader</code> and <code>HTMLCanvasElement</code> APIs. All pixel manipulation, quality scaling, rotation, and file generation happens on your own device’s CPU/GPU. You can even disconnect your internet after loading the page and the tool will continue working completely!
              </p>

              <h4 className="font-bold text-neutral-900 text-sm pt-2">Automatic EXIF Metadata Stripping:</h4>
              <p>
                Smartphone cameras embed invisible metadata into photos:
                <br />• Precise GPS latitude and longitude of where the photo was taken.
                <br />• Exact camera model, smartphone serial number, and timestamp.
                <br />• Embedded thumbnail previews.
              </p>
              <p>
                When mekit renders and re-encodes your image from the HTML5 Canvas, this invasive metadata is not copied to the output file. This protects your personal location privacy when submitting images to public job boards, government portals, or social networks.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
              >
                <span>Try mekit.online Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TUTORIAL 7: FORMAT COMPARISON */}
        {activeTutorialId === 'tut-formats' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tutorial 07</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                JPG vs. PNG vs. WebP: Which Format Should You Choose?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Understand the technical differences between lossy and lossless algorithms to make the right choice for forms, websites, and print.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                <div className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">
                  JPEG / JPG
                </div>
                <h4 className="text-sm font-bold text-neutral-900">Best for Photos & Documents</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Lossy compression that dramatically reduces photographic image sizes. Universal compatibility across all government, visa, and university submission portals. Does not support transparent backgrounds.
                </p>
                <div className="pt-2 text-[11px] text-neutral-500 font-medium">
                  Ideal for: Passport photos, resumes, camera photography.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                <div className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  PNG
                </div>
                <h4 className="text-sm font-bold text-neutral-900">Best for Graphics & Transparency</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Lossless format that keeps sharp lines, text, and transparent alpha channels completely intact without artifacts. Produces larger file sizes and cannot easily meet arbitrary strict KB limits without resizing.
                </p>
                <div className="pt-2 text-[11px] text-neutral-500 font-medium">
                  Ideal for: Logos, digital signatures, UI icons, diagrams.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                <div className="inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-bold">
                  WebP
                </div>
                <h4 className="text-sm font-bold text-neutral-900">Best for Modern Websites</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Google’s modern image format combining superior lossy compression with alpha transparency. Typically 25–35% smaller than JPEG at equivalent visual fidelity. Supported by all modern web browsers.
                </p>
                <div className="pt-2 text-[11px] text-neutral-500 font-medium">
                  Ideal for: Website heroes, blogs, speed optimization.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3">
              <h4 className="text-sm font-bold text-neutral-900">Quick Decision Rules:</h4>
              <ul className="text-xs text-neutral-600 space-y-1.5 list-disc list-inside">
                <li>If an online portal asks for a <strong>passport photo under 50 KB</strong>: Choose <strong>JPEG</strong>.</li>
                <li>If you are uploading a <strong>handwritten signature or transparent badge</strong>: Choose <strong>PNG</strong> or <strong>WebP</strong>.</li>
                <li>If you are optimizing images for your <strong>personal portfolio or business blog</strong>: Choose <strong>WebP</strong> for the fastest page load speeds.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/convert-image"
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
              >
                <span>Open Format Converter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Future AdSense Ad Slot (Isolated, responsive, disabled by default) */}
        <AdSlot slotKey="TUTORIALS_IN_CONTENT" className="mt-8 pt-6 border-t border-neutral-100" />

      </div>
    </div>
  );
};
