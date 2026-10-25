import React, { useState, useRef, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, Check, AlertCircle } from 'lucide-react';
import { ImageFile } from '../types';
import { formatBytes } from '../utils/imageProcessor';
import { downloadFile, getOutputFilename } from '../utils/exportHelpers';

interface ComparisonModalProps {
  image: ImageFile | null;
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ image, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image || !image.processedResult) return null;

  const res = image.processedResult;

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleDownload = () => {
    const filename = getOutputFilename(image.name, res.format);
    downloadFile(res.blob, filename);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col border border-neutral-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 border-b border-neutral-200 flex items-center justify-between gap-2 sm:gap-4 shrink-0 bg-white">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
              Before & After Visual Comparison
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-500 truncate font-mono">
              {image.name}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom toggles - hidden on smallest mobile screens for space, shown on sm+ */}
            <div className="hidden sm:flex items-center bg-neutral-100 rounded-lg p-0.5 border border-neutral-200">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                title="Zoom out"
                className="p-1.5 text-neutral-600 hover:text-neutral-900"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-2 text-neutral-700 font-semibold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                title="Zoom in"
                className="p-1.5 text-neutral-600 hover:text-neutral-900"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-bold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Comparison"
              className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Stage */}
        <div className="flex-1 relative overflow-auto p-2 sm:p-4 flex items-center justify-center bg-neutral-100 select-none min-h-[260px] sm:min-h-[380px]">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative cursor-ew-resize overflow-hidden rounded-xl shadow-md border border-neutral-300 checkerboard-pattern max-w-full max-h-[50vh] sm:max-h-[60vh] flex items-center justify-center bg-white touch-none"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging.current ? 'none' : 'transform 0.15s ease'
            }}
          >
            {/* Background: Compressed (After) */}
            <img
              src={res.url}
              alt="Processed output"
              className="block max-h-[55vh] max-w-full object-contain pointer-events-none"
            />

            {/* Foreground: Original (Before) clipped to slider position */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={image.originalUrl}
                alt="Original source"
                className="absolute inset-0 max-h-[55vh] max-w-none object-contain h-full"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              />
            </div>

            {/* Slider Dividing Bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-neutral-900 shadow-xl pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-neutral-900 rounded-full shadow-lg flex items-center justify-center text-[10px] text-neutral-900 font-bold">
                ↔
              </div>
            </div>

            {/* Labels overlay */}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 border border-neutral-300 text-neutral-900 text-[11px] font-mono font-bold rounded shadow-xs pointer-events-none">
              Original ({sliderPos > 20 ? `${Math.round(sliderPos)}%` : ''})
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 border border-neutral-300 text-neutral-900 text-[11px] font-mono font-bold rounded shadow-xs pointer-events-none">
              Compressed ({sliderPos < 80 ? `${Math.round(100 - sliderPos)}%` : ''})
            </div>
          </div>
        </div>

        {/* Footer Metrics Breakdown */}
        <div className="p-4 bg-white border-t border-neutral-200 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pb-3 border-b border-neutral-200">
            <div>
              <div className="text-neutral-500 font-medium">Original Size</div>
              <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                {formatBytes(image.originalSize)}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {image.originalWidth}×{image.originalHeight}px
              </div>
            </div>

            <div>
              <div className="text-neutral-500 font-medium">Final Compressed Size</div>
              <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                {formatBytes(res.size)}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {res.width}×{res.height}px
              </div>
            </div>

            <div>
              <div className="text-neutral-500 font-medium">Data Saved</div>
              <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
                -{res.savingsPercent}%
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                Saved {formatBytes(res.savingsBytes)}
              </div>
            </div>

            <div>
              <div className="text-neutral-500 font-medium">Format & Target</div>
              <div className="font-bold text-neutral-900 text-sm uppercase mt-0.5">
                {res.format}
              </div>
              <div className="text-[11px] mt-0.5">
                {res.targetAchieved === true ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Target Met
                  </span>
                ) : res.targetAchieved === false ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Target Missed
                  </span>
                ) : (
                  <span className="text-neutral-500 font-mono">Quality {Math.round(res.qualityUsed * 100)}%</span>
                )}
              </div>
            </div>
          </div>

          {res.explanation && (
            <div className="text-xs text-neutral-600 pt-3">
              <strong className="font-semibold text-neutral-800">Processing Details: </strong>
              {res.explanation}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
