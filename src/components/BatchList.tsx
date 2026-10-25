import React, { useState } from 'react';
import {
  Trash2,
  Download,
  Eye,
  Sliders,
  AlertCircle,
  Check,
  RefreshCw
} from 'lucide-react';
import { ImageFile, ImageSettings } from '../types';
import { formatBytes } from '../utils/imageProcessor';
import { downloadFile, getOutputFilename } from '../utils/exportHelpers';

interface BatchListProps {
  images: ImageFile[];
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  onOpenCompare: (image: ImageFile) => void;
  onUpdateImageSettings: (id: string, customSettings: ImageSettings | undefined) => void;
  onProcessSingle: (id: string) => void;
  globalSettings: ImageSettings;
}

export const BatchList: React.FC<BatchListProps> = ({
  images,
  onRemoveImage,
  onClearAll,
  onOpenCompare,
  onUpdateImageSettings,
  onProcessSingle,
  globalSettings
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDownloadSingle = (item: ImageFile) => {
    if (!item.processedResult) return;
    const filename = getOutputFilename(item.name, item.processedResult.format);
    downloadFile(item.processedResult.blob, filename);
  };

  const editingImage = images.find((img) => img.id === editingId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-neutral-900">
            Image Queue ({images.length})
          </h3>
          <span className="text-xs text-neutral-500 font-mono">
            {images.filter((i) => i.status === 'done').length} completed
          </span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {images.map((item) => {
          const res = item.processedResult;
          const isDone = item.status === 'done' && res;
          const isProcessing = item.status === 'processing';
          const isError = item.status === 'error';

          return (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 transition-all"
            >
              {/* Left: Thumbnail & Info */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1 w-full">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-neutral-200 checkerboard-pattern flex items-center justify-center">
                  <img
                    src={res ? res.url : item.originalUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs font-bold text-neutral-900 truncate max-w-[190px] sm:max-w-xs md:max-w-md block" title={item.name}>
                      {item.name}
                    </span>
                    {item.customSettings && (
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                        Custom Override
                      </span>
                    )}
                  </div>

                  {/* Clean unboxed metadata with separators */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-500">
                    <span className="font-mono">{formatBytes(item.originalSize)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{item.originalWidth}×{item.originalHeight}px</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase font-semibold">{item.originalFormat}</span>
                  </div>

                  {/* Result Status line */}
                  {isDone && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs pt-0.5">
                      <span className="font-bold text-neutral-900 font-mono">
                        → {formatBytes(res.size)}
                      </span>
                      <span className="text-emerald-700 font-mono font-semibold">
                        ({res.savingsPercent > 0 ? `-${res.savingsPercent}%` : `${res.savingsPercent}%`})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-neutral-500">
                        {res.width}×{res.height}px
                      </span>

                      {res.targetAchieved !== 'n/a' && (
                        <>
                          <span aria-hidden="true">·</span>
                          {res.targetAchieved ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <Check className="w-3 h-3" /> Target met
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                              <AlertCircle className="w-3 h-3" /> Target missed
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {isError && (
                    <div className="text-xs text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{item.error || 'Failed to process image.'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                {/* Per-image settings override button */}
                <button
                  type="button"
                  onClick={() => setEditingId(item.id)}
                  title="Configure custom settings for this image"
                  className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-xs font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {/* Compare Before/After button */}
                {isDone && (
                  <button
                    type="button"
                    onClick={() => onOpenCompare(item)}
                    title="Interactive Before & After slider"
                    className="px-3 py-2 min-h-[36px] text-xs font-semibold rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>
                )}

                {/* Single Process / Re-process */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => onProcessSingle(item.id)}
                  title="Process or refresh this file"
                  className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-xs font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                </button>

                {/* Individual Download */}
                {isDone && (
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(item)}
                    title="Download this processed image"
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[36px] text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                )}

                {/* Remove from queue */}
                <button
                  type="button"
                  onClick={() => onRemoveImage(item.id)}
                  title="Remove from queue"
                  className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-xs font-medium rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-Image Override Modal in clean white theme */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 border border-neutral-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h4 className="text-sm font-bold text-neutral-900">
                Override Settings for: <span className="font-mono text-neutral-600 truncate">{editingImage.name}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="text-neutral-400 hover:text-neutral-900 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Target Limit (KB)</label>
                <input
                  type="number"
                  defaultValue={editingImage.customSettings?.targetSizeKb || globalSettings.targetSizeKb}
                  id="override-kb"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-mono text-neutral-900"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Output Format</label>
                <select
                  id="override-format"
                  defaultValue={editingImage.customSettings?.format || globalSettings.format}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-900"
                >
                  <option value="original">Match Original</option>
                  <option value="jpeg">JPEG (.jpg)</option>
                  <option value="webp">WebP (.webp)</option>
                  <option value="png">PNG (.png)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Quality (if manual mode)</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  defaultValue={Math.round((editingImage.customSettings?.quality || globalSettings.quality) * 100)}
                  id="override-q"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  onUpdateImageSettings(editingImage.id, undefined);
                  setEditingId(null);
                }}
                className="text-xs text-neutral-500 hover:text-red-600 underline font-medium"
              >
                Reset to Global Settings
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const kbInput = document.getElementById('override-kb') as HTMLInputElement;
                    const formatInput = document.getElementById('override-format') as HTMLSelectElement;
                    const qInput = document.getElementById('override-q') as HTMLInputElement;

                    const newSettings: ImageSettings = {
                      ...(editingImage.customSettings || globalSettings),
                      targetSizeKb: Number(kbInput?.value || 100),
                      format: formatInput?.value as any,
                      quality: Number(qInput?.value || 80) / 100
                    };

                    onUpdateImageSettings(editingImage.id, newSettings);
                    setEditingId(null);
                    onProcessSingle(editingImage.id);
                  }}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
                >
                  Apply & Re-process
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
