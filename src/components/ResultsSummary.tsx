import React, { useState } from 'react';
import { Archive, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { ImageFile } from '../types';
import { formatBytes } from '../utils/imageProcessor';
import { downloadAllAsZip, exportCsvReport } from '../utils/exportHelpers';

interface ResultsSummaryProps {
  images: ImageFile[];
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ images }) => {
  const [isZipping, setIsZipping] = useState(false);

  const completed = images.filter((i) => i.status === 'done' && i.processedResult);
  if (completed.length === 0) return null;

  const totalOriginalBytes = completed.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalFinalBytes = completed.reduce((acc, curr) => acc + curr.processedResult!.size, 0);
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalFinalBytes);
  const totalSavingsPct = totalOriginalBytes > 0
    ? Number(((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1))
    : 0;

  const handleZipDownload = async () => {
    try {
      setIsZipping(true);
      await downloadAllAsZip(completed, 'mekit-compressed-images.zip');
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCsvExport = () => {
    exportCsvReport(completed);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 md:p-6 shadow-xs space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-neutral-900">
              Processing Complete ({completed.length} of {images.length} files)
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Processed 100% locally on your device without server transmission.
          </p>
        </div>

        {/* Action buttons: Download ZIP and CSV Report */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCsvExport}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-xl border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            disabled={isZipping}
            onClick={handleZipDownload}
            className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-[40px] text-xs font-bold rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition-all shadow-xs disabled:opacity-50"
          >
            <Archive className="w-4 h-4 shrink-0" />
            <span>{isZipping ? 'Creating ZIP...' : `Download ZIP (${completed.length})`}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-3 border-t border-neutral-200 text-xs">
        <div className="p-2.5 sm:p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
          <div className="text-neutral-500 font-medium">Total Original Size</div>
          <div className="text-base font-mono font-bold text-neutral-900 mt-0.5">
            {formatBytes(totalOriginalBytes)}
          </div>
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
          <div className="text-neutral-500 font-medium">Total Output Size</div>
          <div className="text-base font-mono font-bold text-neutral-900 mt-0.5">
            {formatBytes(totalFinalBytes)}
          </div>
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
          <div className="text-neutral-500 font-medium">Data Saved</div>
          <div className="text-base font-mono font-bold text-emerald-700 mt-0.5">
            {formatBytes(totalSavedBytes)}
          </div>
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
          <div className="text-neutral-500 font-medium">Average Reduction</div>
          <div className="text-base font-mono font-bold text-emerald-700 mt-0.5">
            {totalSavingsPct > 0 ? `-${totalSavingsPct}%` : '0%'}
          </div>
        </div>
      </div>
    </div>
  );
};
