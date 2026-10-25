import React, { useRef, useState } from 'react';
import { Upload, ShieldCheck, AlertCircle } from 'lucide-react';
import { createSampleFile } from '../utils/sampleImages';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  fileCount: number;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFilesSelected, fileCount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    const invalidNames: string[] = [];

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];

    Array.from(fileList).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (allowedTypes.includes(file.type.toLowerCase()) || allowedExts.includes(ext)) {
        validFiles.push(file);
      } else {
        invalidNames.push(file.name);
      }
    });

    if (invalidNames.length > 0) {
      setErrorMessage(`Skipped unsupported file(s): ${invalidNames.slice(0, 3).join(', ')}${invalidNames.length > 3 ? '...' : ''}. mekit.online supports JPG/JPEG, PNG, and WebP.`);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const loadSample = async (type: 'photo' | 'transparent' | 'portrait') => {
    try {
      setLoadingSample(true);
      const sample = await createSampleFile(type);
      onFilesSelected([sample]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <div id="upload-zone" className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload images by dropping files or clicking to open file picker"
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 md:p-12 text-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
          isDragging
            ? 'border-neutral-900 bg-neutral-100 scale-[1.005]'
            : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            if (e.target) e.target.value = '';
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <Upload className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
              {fileCount > 0 ? 'Drop more images here, or tap to browse' : 'Drop your images here, or tap to browse'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Supports JPEG, PNG, and WebP. On desktop, paste screenshots with <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-neutral-100 border border-neutral-300 rounded">Ctrl+V</kbd> / <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-neutral-100 border border-neutral-300 rounded">⌘V</kbd>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1 text-xs text-neutral-500">
            <span>Multiple files</span>
            <span aria-hidden="true">·</span>
            <span>Zero cloud uploads</span>
            <span aria-hidden="true">·</span>
            <span>No size cap</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-start gap-2 p-3 text-xs text-amber-900 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Privacy guarantee + Instant sample images */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-2 border-b border-neutral-200 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong className="font-semibold text-neutral-700">Privacy First:</strong> Images are processed locally in your browser memory. No files are ever uploaded.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-neutral-400">Instant test:</span>
          <button
            type="button"
            disabled={loadingSample}
            onClick={(e) => {
              e.stopPropagation();
              loadSample('photo');
            }}
            className="px-2 py-1 min-h-[32px] inline-flex items-center rounded text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 underline underline-offset-2 transition-colors disabled:opacity-50 font-medium"
          >
            HD Photo
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            disabled={loadingSample}
            onClick={(e) => {
              e.stopPropagation();
              loadSample('portrait');
            }}
            className="px-2 py-1 min-h-[32px] inline-flex items-center rounded text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 underline underline-offset-2 transition-colors disabled:opacity-50 font-medium"
          >
            Form Portrait
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            disabled={loadingSample}
            onClick={(e) => {
              e.stopPropagation();
              loadSample('transparent');
            }}
            className="px-2 py-1 min-h-[32px] inline-flex items-center rounded text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 underline underline-offset-2 transition-colors disabled:opacity-50 font-medium"
          >
            Transparent PNG
          </button>
        </div>
      </div>
    </div>
  );
};
