import JSZip from 'jszip';
import { ImageFile } from '../types';
import { formatBytes } from './imageProcessor';

/**
 * Generates a clean, safe filename with correct extension.
 */
export function getOutputFilename(
  originalName: string,
  targetFormat: 'jpeg' | 'png' | 'webp',
  suffix = '-mekit'
): string {
  const lastDot = originalName.lastIndexOf('.');
  const baseName = lastDot > 0 ? originalName.substring(0, lastDot) : originalName;
  // Clean special characters
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'image';

  let extension = 'jpg';
  if (targetFormat === 'png') extension = 'png';
  if (targetFormat === 'webp') extension = 'webp';

  return `${cleanBase}${suffix}.${extension}`;
}

/**
 * Triggers a direct download for a single Blob or URL.
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Creates and downloads a real ZIP archive containing all completed images.
 */
export async function downloadAllAsZip(
  images: ImageFile[],
  zipFilename = 'mekit-processed-images.zip'
): Promise<void> {
  const completedImages = images.filter((img) => img.status === 'done' && img.processedResult);
  if (completedImages.length === 0) return;

  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (let i = 0; i < completedImages.length; i++) {
    const item = completedImages[i];
    const res = item.processedResult!;
    let filename = getOutputFilename(item.name, res.format);

    // Prevent duplicate filenames in ZIP
    if (usedNames.has(filename)) {
      let counter = 1;
      const dotIdx = filename.lastIndexOf('.');
      const base = dotIdx > 0 ? filename.substring(0, dotIdx) : filename;
      const ext = dotIdx > 0 ? filename.substring(dotIdx) : '';
      while (usedNames.has(`${base}_${counter}${ext}`)) {
        counter++;
      }
      filename = `${base}_${counter}${ext}`;
    }

    usedNames.add(filename);
    zip.file(filename, res.blob);
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  downloadFile(zipBlob, zipFilename);
}

/**
 * Exports an audit CSV report of all processing results.
 * Contains purely technical metrics without user image content or private metadata.
 */
export function exportCsvReport(images: ImageFile[]): void {
  const completed = images.filter((img) => img.status === 'done' && img.processedResult);
  if (completed.length === 0) return;

  const headers = [
    'File Name',
    'Original Format',
    'Output Format',
    'Original Dimensions',
    'Output Dimensions',
    'Original Size (Bytes)',
    'Original Size (Formatted)',
    'Final Size (Bytes)',
    'Final Size (Formatted)',
    'Saved (Bytes)',
    'Reduction (%)',
    'Target Achieved',
    'Processing Notes'
  ];

  const escapeCsv = (str: string | number) => {
    const s = String(str);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const rows = completed.map((img) => {
    const r = img.processedResult!;
    return [
      escapeCsv(img.name),
      escapeCsv(img.originalFormat.toUpperCase()),
      escapeCsv(r.format.toUpperCase()),
      escapeCsv(`${img.originalWidth}x${img.originalHeight}`),
      escapeCsv(`${r.width}x${r.height}`),
      escapeCsv(img.originalSize),
      escapeCsv(formatBytes(img.originalSize)),
      escapeCsv(r.size),
      escapeCsv(formatBytes(r.size)),
      escapeCsv(r.savingsBytes),
      escapeCsv(`${r.savingsPercent}%`),
      escapeCsv(r.targetAchieved === 'n/a' ? 'N/A' : r.targetAchieved ? 'Yes' : 'No'),
      escapeCsv(r.explanation || '')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(blob, `mekit-compression-report-${dateStr}.csv`);
}
