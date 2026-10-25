/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { RouterProvider, useRouter, Link } from './utils/router';
import { SEOHead } from './components/SEOHead';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ControlPanel } from './components/ControlPanel';
import { BatchList } from './components/BatchList';
import { ResultsSummary } from './components/ResultsSummary';
import { ComparisonModal } from './components/ComparisonModal';
import { TutorialsSection } from './components/TutorialsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FaqSection } from './components/FaqSection';
import { ToolInfoSection } from './components/ToolInfoSection';
import { AboutPage, ContactPage, PrivacyPage, TermsPage, DisclaimerPage, NotFoundPage } from './components/Pages';
import { HomeFeaturesSection } from './components/HomeFeaturesSection';
import { CookieConsent } from './components/CookieConsent';
import { AdSlot } from './components/ads/AdSlot';
import { Footer } from './components/Footer';
import { ImageFile, ImageSettings } from './types';
import {
  detectOriginalFormat,
  loadImage,
  checkImageTransparency,
  processSingleImage
} from './utils/imageProcessor';
import { UPLOAD_PRESETS } from './utils/presets';
import { Check, Layers, BookOpen, ShieldCheck, ArrowRight, Target, Maximize2, Sliders } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { recordProcessingLog } from './services/firebase';
import { UserAuthModal } from './components/UserAuthModal';
import { CloudPresetsModal } from './components/CloudPresetsModal';
import { ProcessingHistoryModal } from './components/ProcessingHistoryModal';

const DEFAULT_SETTINGS: ImageSettings = {
  mode: 'targetSize',
  targetSizeKb: 100,
  allowDownscaleForTarget: true,
  minDimensionPct: 40,
  format: 'original',
  quality: 0.82,
  resizeMode: 'none',
  lockAspectRatio: true,
  percentage: 100,
  allowUpscale: false,
  rotation: 0,
  flipH: false,
  flipV: false,
  stripExif: true,
  backgroundColor: '#ffffff'
};

function MainApp() {
  const { path, navigate } = useRouter();
  const cleanPath = path.replace(/\/$/, '') || '/';

  const [controlPanelTab, setControlPanelTab] = useState<'target' | 'resize' | 'format' | 'presets'>('target');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ImageSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeCompareImage, setActiveCompareImage] = useState<ImageFile | null>(null);
  const [hasTransparencyInBatch, setHasTransparencyInBatch] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const imagesRef = useRef(images);
  imagesRef.current = images;

  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const controlPanelRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize tool tab based on current route
  useEffect(() => {
    if (cleanPath === '/compress-image') {
      setControlPanelTab('target');
      setSettings((s) => ({ ...s, mode: 'targetSize' }));
    } else if (cleanPath === '/resize-image') {
      setControlPanelTab('resize');
      setSettings((s) => ({ ...s, resizeMode: s.resizeMode === 'none' ? 'fit' : s.resizeMode }));
    } else if (cleanPath === '/convert-image') {
      setControlPanelTab('format');
    } else if (cleanPath === '/batch-processing') {
      setControlPanelTab('presets');
    }
  }, [cleanPath]);

  // Clipboard paste listener (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const files: File[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const ext = file.type === 'image/png' ? 'png' : 'jpg';
            const renamed = new File([file], `clipboard-image-${Date.now()}.${ext}`, { type: file.type });
            files.push(renamed);
          }
        }
      }

      if (files.length > 0) {
        handleFilesSelected(files);
        showToast(`Imported ${files.length} image from clipboard!`);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle newly selected files
  const handleFilesSelected = async (newFiles: File[]) => {
    const newItems: ImageFile[] = [];

    for (const file of newFiles) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const originalUrl = URL.createObjectURL(file);
      const originalFormat = detectOriginalFormat(file);

      try {
        const img = await loadImage(originalUrl);
        const hasAlpha = checkImageTransparency(img);

        newItems.push({
          id,
          file,
          name: file.name,
          originalSize: file.size,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          originalFormat,
          hasAlpha,
          originalUrl,
          status: 'idle',
          progress: 0
        });
      } catch (err) {
        console.error('Failed to load image', file.name, err);
      }
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
      const anyAlpha = newItems.some((i) => i.hasAlpha);
      if (anyAlpha) setHasTransparencyInBatch(true);
      
      // If currently on an informational page, navigate back to tool
      if (!isToolRoute(cleanPath)) {
        navigate('/');
      }

      setTimeout(() => {
        uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.originalUrl);
        if (item.processedResult) {
          URL.revokeObjectURL(item.processedResult.url);
        }
      });
    };
  }, []);

  // Process all images sequentially
  const handleProcessAll = async () => {
    if (images.length === 0 || isProcessing) return;

    setIsProcessing(true);

    for (let i = 0; i < images.length; i++) {
      const currentItem = images[i];

      setImages((prev) =>
        prev.map((img, idx) => (idx === i ? { ...img, status: 'processing', progress: 50 } : img))
      );

      try {
        const result = await processSingleImage(currentItem, settings);

        setImages((prev) =>
          prev.map((img, idx) =>
            idx === i
              ? {
                  ...img,
                  status: 'done',
                  progress: 100,
                  processedResult: result,
                  error: undefined
                }
              : img
          )
        );

        // Record processing audit stats to Firebase (zero image bytes, privacy-first)
        if (user) {
          recordProcessingLog(user.uid, {
            fileName: currentItem.name,
            tool: cleanPath === '/resize-image' ? 'resizer' : cleanPath === '/convert-image' ? 'converter' : 'compressor',
            originalBytes: currentItem.originalSize,
            compressedBytes: result.size,
            savingsPercent: result.savingsPercent,
            format: result.format,
          }).catch((e) => console.warn('Could not record processing audit log:', e));
        }
      } catch (err: any) {
        console.error(`Error processing ${currentItem.name}:`, err);
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === i
              ? {
                  ...img,
                  status: 'error',
                  progress: 0,
                  error: err?.message || 'Processing failed'
                }
              : img
          )
        );
      }

      await new Promise((r) => setTimeout(r, 40));
    }

    setIsProcessing(false);
  };

  // Process single image
  const handleProcessSingle = async (id: string) => {
    const item = images.find((i) => i.id === id);
    if (!item) return;

    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, status: 'processing', progress: 50 } : img))
    );

    try {
      const result = await processSingleImage(item, settings);
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, status: 'done', progress: 100, processedResult: result, error: undefined }
            : img
        )
      );

      // Record processing audit stats to Firebase
      if (user) {
        recordProcessingLog(user.uid, {
          fileName: item.name,
          tool: cleanPath === '/resize-image' ? 'resizer' : cleanPath === '/convert-image' ? 'converter' : 'compressor',
          originalBytes: item.originalSize,
          compressedBytes: result.size,
          savingsPercent: result.savingsPercent,
          format: result.format,
        }).catch((e) => console.warn('Could not record processing audit log:', e));
      }
    } catch (err: any) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, status: 'error', progress: 0, error: err?.message || 'Failed' }
            : img
        )
      );
    }
  };

  // Remove single image
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.originalUrl);
        if (item.processedResult) URL.revokeObjectURL(item.processedResult.url);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  // Clear all
  const handleClearAll = () => {
    images.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.processedResult) URL.revokeObjectURL(item.processedResult.url);
    });
    setImages([]);
    setHasTransparencyInBatch(false);
  };

  // Update per-image override settings
  const handleUpdateImageSettings = (id: string, customSettings: ImageSettings | undefined) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, customSettings } : img))
    );
  };

  // Apply preset
  const handleApplyPreset = (presetId: string) => {
    const preset = UPLOAD_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSettings((prev) => ({
      ...prev,
      ...preset.settings
    }));
    showToast(`Applied preset: ${preset.name}`);
  };

  const handleTriggerUpload = () => {
    if (!isToolRoute(cleanPath)) {
      navigate('/', { scrollToId: 'upload-zone' });
    } else {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function isToolRoute(p: string) {
    return p === '/' || p === '/compress-image' || p === '/resize-image' || p === '/convert-image' || p === '/batch-processing';
  }

  // Render content according to route
  const renderRouteContent = () => {
    switch (cleanPath) {
      case '/tutorials':
        return <TutorialsSection />;
      case '/how-it-works':
        return <HowItWorksSection />;
      case '/faq':
        return <FaqSection />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      case '/disclaimer':
        return <DisclaimerPage />;
      case '/':
      case '/compress-image':
      case '/resize-image':
      case '/convert-image':
      case '/batch-processing':
        return renderToolWorkspace();
      default:
        return <NotFoundPage />;
    }
  };

  // Tool workspace with route-specific H1 and hero metadata
  const renderToolWorkspace = () => {
    return (
      <div className="space-y-10">
        {/* Route-Specific SEO Hero Heading */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          {cleanPath === '/' && (
            <>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900" style={{ textWrap: 'balance' }}>
                Get Your Images to the Right Size.
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed" style={{ textWrap: 'balance' }}>
                Compress, resize and convert images for forms, websites and everyday use with <strong>mekit.online</strong>. Free, without watermarks.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-neutral-500 font-medium">
                <span>100% In-Browser</span>
                <span aria-hidden="true">·</span>
                <span>Smart Target KB Search</span>
                <span aria-hidden="true">·</span>
                <span>Zero Server Uploads</span>
                <span aria-hidden="true">·</span>
                <span>Batch ZIP Download</span>
              </div>
            </>
          )}

          {cleanPath === '/compress-image' && (
            <>
              <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center justify-center gap-2 pb-1">
                <Link href="/" className="hover:text-neutral-900">Home</Link>
                <span aria-hidden="true">/</span>
                <span className="text-neutral-800">Compressor</span>
              </nav>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900" style={{ textWrap: 'balance' }}>
                Free Image Compressor Online
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed" style={{ textWrap: 'balance' }}>
                Compress JPG, PNG, and WebP images to exact target limits (20 KB, 50 KB, 100 KB, 200 KB) with intelligent quality search and zero server uploads.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-neutral-500 font-medium">
                <span>Target KB Precision</span>
                <span aria-hidden="true">·</span>
                <span>Lossless & Lossy Modes</span>
                <span aria-hidden="true">·</span>
                <span>100% In-Browser</span>
                <span aria-hidden="true">·</span>
                <span>No Watermarks</span>
              </div>
            </>
          )}

          {cleanPath === '/resize-image' && (
            <>
              <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center justify-center gap-2 pb-1">
                <Link href="/" className="hover:text-neutral-900">Home</Link>
                <span aria-hidden="true">/</span>
                <span className="text-neutral-800">Resizer</span>
              </nav>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900" style={{ textWrap: 'balance' }}>
                Free Image Resizer Online
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed" style={{ textWrap: 'balance' }}>
                Resize image dimensions by width, height, or percentage while locking aspect ratio. Standard presets for social media, print, and web.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-neutral-500 font-medium">
                <span>Exact Pixel Dimensions</span>
                <span aria-hidden="true">·</span>
                <span>Aspect Ratio Lock</span>
                <span aria-hidden="true">·</span>
                <span>Social Media Presets</span>
                <span aria-hidden="true">·</span>
                <span>High-Fidelity Scaling</span>
              </div>
            </>
          )}

          {cleanPath === '/convert-image' && (
            <>
              <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center justify-center gap-2 pb-1">
                <Link href="/" className="hover:text-neutral-900">Home</Link>
                <span aria-hidden="true">/</span>
                <span className="text-neutral-800">Converter</span>
              </nav>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900" style={{ textWrap: 'balance' }}>
                Free Image Converter Online
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed" style={{ textWrap: 'balance' }}>
                Convert images between JPG, PNG, and WebP formats instantly with transparency controls and quality tuning.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-neutral-500 font-medium">
                <span>JPG, PNG & WebP</span>
                <span aria-hidden="true">·</span>
                <span>Transparency Preservation</span>
                <span aria-hidden="true">·</span>
                <span>Background Color Fill</span>
                <span aria-hidden="true">·</span>
                <span>Instant In-Browser</span>
              </div>
            </>
          )}

          {cleanPath === '/batch-processing' && (
            <>
              <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center justify-center gap-2 pb-1">
                <Link href="/" className="hover:text-neutral-900">Home</Link>
                <span aria-hidden="true">/</span>
                <span className="text-neutral-800">Batch Processing</span>
              </nav>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900" style={{ textWrap: 'balance' }}>
                Batch Image Compressor & Resizer
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed" style={{ textWrap: 'balance' }}>
                Process dozens of photos simultaneously. Compress to target sizes, resize dimensions, and download all processed images in a clean ZIP file.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-neutral-500 font-medium">
                <span>Bulk Image Queue</span>
                <span aria-hidden="true">·</span>
                <span>Per-Image & Global Controls</span>
                <span aria-hidden="true">·</span>
                <span>Instant ZIP Download</span>
                <span aria-hidden="true">·</span>
                <span>100% Private</span>
              </div>
            </>
          )}
        </section>

        {/* Upload Zone */}
        <div ref={uploadSectionRef}>
          <UploadZone onFilesSelected={handleFilesSelected} fileCount={images.length} />
        </div>

        {/* Workspace: Left Controls + Right Queue */}
        <div id="workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls (5 cols on lg) */}
          <div ref={controlPanelRef} className="lg:col-span-5 space-y-6">
            <ControlPanel
              settings={settings}
              onChangeSettings={setSettings}
              onProcessAll={handleProcessAll}
              isProcessing={isProcessing}
              totalImages={images.length}
              hasTransparencyInBatch={hasTransparencyInBatch}
              onApplyPreset={handleApplyPreset}
              activeTab={controlPanelTab}
              onTabChange={setControlPanelTab}
              onOpenCloudPresets={() => setIsPresetsModalOpen(true)}
            />
          </div>

          {/* Right Queue & Results (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {images.length > 0 ? (
              <>
                <ResultsSummary images={images} />

                <BatchList
                  images={images}
                  onRemoveImage={handleRemoveImage}
                  onClearAll={handleClearAll}
                  onOpenCompare={(img) => setActiveCompareImage(img)}
                  onUpdateImageSettings={handleUpdateImageSettings}
                  onProcessSingle={handleProcessSingle}
                  globalSettings={settings}
                />
              </>
            ) : (
              <div className="p-8 md:p-12 text-center rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-500">
                  <Layers className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-neutral-900">
                    Your image queue is empty
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Drop images into the upload area above, paste with Ctrl+V, or try an instant preset sample.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('job-application')}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 cursor-pointer"
                  >
                    Apply Job Form (100 KB)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('university-form')}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 cursor-pointer"
                  >
                    Apply Student Portal (50 KB)
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Route-Specific SEO Content Section */}
        {cleanPath === '/' && (
          <>
            <div className="mt-12 pt-8 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/tutorials"
              className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-amber-700">Tutorials</span>
                <BookOpen className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mt-2 group-hover:text-amber-800 transition-colors">
                How to Use mekit.online from A to Z →
              </h4>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                Complete step-by-step tutorials explaining target KB compression, resizing, and batch ZIP export.
              </p>
            </Link>

            <Link
              href="/how-it-works"
              className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-700">Security</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mt-2 group-hover:text-emerald-800 transition-colors">
                Why 100% In-Browser Privacy Matters →
              </h4>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                Learn how HTML5 Canvas and browser codecs process images locally with automatic EXIF GPS stripping.
              </p>
            </Link>

            <Link
              href="/faq"
              className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-neutral-700">Help</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mt-2 group-hover:text-neutral-800 transition-colors">
                Frequently Asked Questions →
              </h4>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                Answers regarding lossless PNG limits, transparent JPEG behavior, mobile use, and form submissions.
              </p>
            </Link>
          </div>

          {/* In-Depth Home Features & Workflow Deep-Dive */}
          <HomeFeaturesSection />

          {/* Bottom Ad Slot (Isolated, responsive, policy-safe) */}
          <AdSlot slotKey="HOMEPAGE_BOTTOM" className="pt-6" />
        </>
        )}

        {cleanPath === '/compress-image' && <ToolInfoSection toolType="compressor" />}
        {cleanPath === '/resize-image' && <ToolInfoSection toolType="resizer" />}
        {cleanPath === '/convert-image' && <ToolInfoSection toolType="converter" />}
        {cleanPath === '/batch-processing' && <ToolInfoSection toolType="batch" />}

      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 transition-colors">
      
      {/* Dynamic SEO Head Management */}
      <SEOHead path={cleanPath} />

      {/* Toast feedback banner */}
      {toastMessage && (
        <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 z-50 px-4 py-3 sm:py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-2xl flex items-center justify-center sm:justify-start gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header with mekit.online branding, working nav and cloud sync */}
      <Header
        fileCount={images.length}
        onTriggerUpload={handleTriggerUpload}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
        {renderRouteContent()}
      </main>

      {/* Interactive Before & After Modal */}
      <ComparisonModal
        image={activeCompareImage}
        onClose={() => setActiveCompareImage(null)}
      />

      {/* Firebase Cloud Sync: Authentication Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      {/* Firebase Cloud Sync: Saved Presets Modal */}
      <CloudPresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        currentSettings={settings}
        onApplySettings={(newSettings) => {
          setSettings((prev) => ({ ...prev, ...newSettings }));
          showToast('Applied cloud preset!');
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Firebase Cloud Sync: Processing History Modal */}
      <ProcessingHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Cookie & Privacy Consent Notice */}
      <CookieConsent />

      {/* Semantic Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <MainApp />
    </RouterProvider>
  );
}
