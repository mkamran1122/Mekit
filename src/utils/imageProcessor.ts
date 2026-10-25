import { ImageFile, ImageSettings, ProcessedResult } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export function getMimeType(format: 'jpeg' | 'png' | 'webp'): string {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

export function detectOriginalFormat(file: File): 'jpeg' | 'png' | 'webp' | 'other' {
  const type = file.type.toLowerCase();
  if (type === 'image/jpeg' || type === 'image/jpg') return 'jpeg';
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  
  const ext = getFileExtension(file.name);
  if (ext === 'jpg' || ext === 'jpeg') return 'jpeg';
  if (ext === 'png') return 'png';
  if (ext === 'webp') return 'webp';
  return 'other';
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image file. File may be corrupted or an unsupported format.'));
    img.src = src;
  });
}

/**
 * Calculates transformed target dimensions based on settings, rotation, and original bounds.
 */
export function calculateOutputDimensions(
  origW: number,
  origH: number,
  settings: ImageSettings
): { width: number; height: number; cropX: number; cropY: number; cropW: number; cropH: number } {
  // Check if rotation swaps aspect ratio
  const isRotated90or270 = settings.rotation === 90 || settings.rotation === 270;
  const sourceW = isRotated90or270 ? origH : origW;
  const sourceH = isRotated90or270 ? origW : origH;

  let targetW = sourceW;
  let targetH = sourceH;
  let cropX = 0;
  let cropY = 0;
  let cropW = sourceW;
  let cropH = sourceH;

  switch (settings.resizeMode) {
    case 'dimensions': {
      if (settings.targetWidth && settings.targetHeight) {
        targetW = Math.round(settings.targetWidth);
        targetH = Math.round(settings.targetHeight);
      } else if (settings.targetWidth) {
        targetW = Math.round(settings.targetWidth);
        targetH = settings.lockAspectRatio ? Math.round((targetW / sourceW) * sourceH) : sourceH;
      } else if (settings.targetHeight) {
        targetH = Math.round(settings.targetHeight);
        targetW = settings.lockAspectRatio ? Math.round((targetH / sourceH) * sourceW) : sourceW;
      }
      break;
    }
    case 'percentage': {
      const scale = Math.max(0.01, (settings.percentage || 100) / 100);
      targetW = Math.max(1, Math.round(sourceW * scale));
      targetH = Math.max(1, Math.round(sourceH * scale));
      break;
    }
    case 'fit': {
      const maxW = settings.targetWidth || sourceW;
      const maxH = settings.targetHeight || sourceH;
      const ratio = Math.min(maxW / sourceW, maxH / sourceH);
      const effectiveRatio = settings.allowUpscale ? ratio : Math.min(1, ratio);
      targetW = Math.max(1, Math.round(sourceW * effectiveRatio));
      targetH = Math.max(1, Math.round(sourceH * effectiveRatio));
      break;
    }
    case 'crop': {
      // Target dimensions are fixed, crop source from center
      const outW = settings.targetWidth || sourceW;
      const outH = settings.targetHeight || sourceH;
      targetW = outW;
      targetH = outH;

      const scale = Math.max(outW / sourceW, outH / sourceH);
      cropW = Math.min(sourceW, Math.round(outW / scale));
      cropH = Math.min(sourceH, Math.round(outH / scale));
      cropX = Math.max(0, Math.round((sourceW - cropW) / 2));
      cropY = Math.max(0, Math.round((sourceH - cropH) / 2));
      break;
    }
    case 'none':
    default: {
      targetW = sourceW;
      targetH = sourceH;
      break;
    }
  }

  // Prevent accidental enlargement if not explicitly allowed
  if (!settings.allowUpscale && settings.resizeMode !== 'crop') {
    if (targetW > sourceW || targetH > sourceH) {
      const downscaleRatio = Math.min(sourceW / targetW, sourceH / targetH);
      targetW = Math.round(targetW * downscaleRatio);
      targetH = Math.round(targetH * downscaleRatio);
    }
  }

  return {
    width: Math.max(1, targetW),
    height: Math.max(1, targetH),
    cropX,
    cropY,
    cropW,
    cropH
  };
}

/**
 * Render image onto canvas with given scale, rotation, flipping, and background.
 */
function renderToCanvas(
  img: HTMLImageElement,
  dims: { width: number; height: number; cropX: number; cropY: number; cropW: number; cropH: number },
  settings: ImageSettings,
  scaleFactor = 1.0,
  fillBackgroundForJpeg = false
): HTMLCanvasElement {
  const finalW = Math.max(1, Math.round(dims.width * scaleFactor));
  const finalH = Math.max(1, Math.round(dims.height * scaleFactor));

  const canvas = document.createElement('canvas');
  canvas.width = finalW;
  canvas.height = finalH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not obtain canvas 2D rendering context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If converting to JPEG or requested, fill opaque background so transparency doesn't turn black
  if (fillBackgroundForJpeg) {
    ctx.fillStyle = settings.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, finalW, finalH);
  }

  ctx.save();
  // Move origin to center of canvas for rotation and flipping
  ctx.translate(finalW / 2, finalH / 2);

  // Rotation
  if (settings.rotation) {
    ctx.rotate((settings.rotation * Math.PI) / 180);
  }

  // Flipping
  const scaleX = settings.flipH ? -1 : 1;
  const scaleY = settings.flipV ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  const isRotated90or270 = settings.rotation === 90 || settings.rotation === 270;
  const drawW = isRotated90or270 ? finalH : finalW;
  const drawH = isRotated90or270 ? finalW : finalH;

  if (settings.resizeMode === 'crop') {
    // Draw cropped portion
    ctx.drawImage(
      img,
      dims.cropX,
      dims.cropY,
      dims.cropW,
      dims.cropH,
      -drawW / 2,
      -drawH / 2,
      drawW,
      drawH
    );
  } else {
    // Standard redraw
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  }

  ctx.restore();
  return canvas;
}

/**
 * Wraps canvas.toBlob in a Promise.
 */
function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed to produce a valid image blob'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Checks if an image has alpha transparency by scanning canvas pixels.
 */
export function checkImageTransparency(img: HTMLImageElement): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(img.naturalWidth, 128);
    canvas.height = Math.min(img.naturalHeight, 128);
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] < 255) {
        return true;
      }
    }
  } catch {
    // Canvas security/tainting fallback
    return false;
  }
  return false;
}

/**
 * Resolves the concrete output format (handling 'original' setting).
 */
export function resolveOutputFormat(
  settingsFormat: ImageSettings['format'],
  originalFormat: 'jpeg' | 'png' | 'webp' | 'other'
): 'jpeg' | 'png' | 'webp' {
  if (settingsFormat !== 'original') {
    return settingsFormat;
  }
  if (originalFormat === 'png') return 'png';
  if (originalFormat === 'webp') return 'webp';
  return 'jpeg';
}

/**
 * Core image processing engine.
 */
export async function processSingleImage(
  imageFile: ImageFile,
  globalSettings: ImageSettings
): Promise<ProcessedResult> {
  const startTime = performance.now();
  const settings = imageFile.customSettings || globalSettings;
  const originalFormat = imageFile.originalFormat;
  const resolvedFormat = resolveOutputFormat(settings.format, originalFormat);
  const mimeType = getMimeType(resolvedFormat);

  const img = await loadImage(imageFile.originalUrl);
  const baseDims = calculateOutputDimensions(img.naturalWidth, img.naturalHeight, settings);
  const fillBg = resolvedFormat === 'jpeg';

  let finalBlob: Blob | null = null;
  let finalWidth = baseDims.width;
  let finalHeight = baseDims.height;
  let targetAchieved: boolean | 'n/a' = 'n/a';
  let qualityUsed = settings.quality;
  let explanation: string | undefined = undefined;
  let iterations = 0;

  if (settings.mode === 'targetSize') {
    const targetBytes = settings.targetSizeKb * 1024;

    if (resolvedFormat === 'png') {
      // PNG is lossless and does not support quality compression parameter
      // We test scale factor if downscaling is allowed
      let currentScale = 1.0;
      let canvas = renderToCanvas(img, baseDims, settings, currentScale, false);
      let blob = await canvasToBlob(canvas, mimeType);
      iterations++;

      if (blob.size <= targetBytes) {
        finalBlob = blob;
        targetAchieved = true;
        qualityUsed = 1.0;
        finalWidth = canvas.width;
        finalHeight = canvas.height;
        explanation = `Lossless PNG successfully saved under ${settings.targetSizeKb} KB (${formatBytes(blob.size)}).`;
      } else if (settings.allowDownscaleForTarget) {
        // Binary search on dimension scale factor
        const minScale = Math.max(0.1, settings.minDimensionPct / 100);
        let lowScale = minScale;
        let highScale = 1.0;
        let bestBlob = blob;
        let bestScale = 1.0;

        for (let step = 0; step < 7; step++) {
          const testScale = (lowScale + highScale) / 2;
          const testCanvas = renderToCanvas(img, baseDims, settings, testScale, false);
          const testBlob = await canvasToBlob(testCanvas, mimeType);
          iterations++;

          if (testBlob.size <= targetBytes) {
            bestBlob = testBlob;
            bestScale = testScale;
            // Try to find a larger scale that still fits
            lowScale = testScale;
          } else {
            highScale = testScale;
          }
        }

        if (bestBlob.size <= targetBytes) {
          finalBlob = bestBlob;
          targetAchieved = true;
          qualityUsed = 1.0;
          finalWidth = Math.max(1, Math.round(baseDims.width * bestScale));
          finalHeight = Math.max(1, Math.round(baseDims.height * bestScale));
          explanation = `PNG met target by reducing resolution to ${finalWidth}×${finalHeight} (${Math.round(bestScale * 100)}% of original size).`;
        } else {
          finalBlob = bestBlob;
          targetAchieved = false;
          qualityUsed = 1.0;
          finalWidth = Math.max(1, Math.round(baseDims.width * bestScale));
          finalHeight = Math.max(1, Math.round(baseDims.height * bestScale));
          explanation = `Lossless PNG cannot be compressed via quality sliders. At minimum allowed scale (${Math.round(minScale * 100)}%), file size is ${formatBytes(bestBlob.size)} (Target: ${settings.targetSizeKb} KB). Switching output format to WebP or JPEG is recommended.`;
        }
      } else {
        finalBlob = blob;
        targetAchieved = false;
        qualityUsed = 1.0;
        explanation = `Lossless PNG at full dimensions is ${formatBytes(blob.size)}, which exceeds the ${settings.targetSizeKb} KB target. Enable "Allow downscaling" or convert to WebP/JPEG to reach this target.`;
      }
    } else {
      // JPEG or WebP: Intelligent Quality & Dimension Binary Search
      let currentScale = 1.0;
      let minScale = settings.allowDownscaleForTarget ? Math.max(0.1, settings.minDimensionPct / 100) : 1.0;
      let canvas = renderToCanvas(img, baseDims, settings, currentScale, fillBg);

      // Search best quality at current scale
      let bestBlobUnderTarget: { blob: Blob; quality: number; scale: number; width: number; height: number } | null = null;
      let lowestAchievedOverall: { blob: Blob; quality: number; scale: number; width: number; height: number } | null = null;

      // Helper function to search quality for a given canvas
      const searchQuality = async (cvs: HTMLCanvasElement, scale: number) => {
        let lowQ = 0.05;
        let highQ = 0.98;
        let bestUnder: { blob: Blob; quality: number } | null = null;
        let smallest: { blob: Blob; quality: number } | null = null;

        for (let iter = 0; iter < 7; iter++) {
          const midQ = Number(((lowQ + highQ) / 2).toFixed(2));
          const testBlob = await canvasToBlob(cvs, mimeType, midQ);
          iterations++;

          if (!smallest || testBlob.size < smallest.blob.size) {
            smallest = { blob: testBlob, quality: midQ };
          }

          if (testBlob.size <= targetBytes) {
            bestUnder = { blob: testBlob, quality: midQ };
            // Try higher quality to see if we can still remain under target
            lowQ = midQ;
          } else {
            // Over target, need lower quality
            highQ = midQ;
          }
        }
        return { bestUnder, smallest };
      };

      const initialSearch = await searchQuality(canvas, 1.0);
      if (initialSearch.bestUnder) {
        bestBlobUnderTarget = {
          blob: initialSearch.bestUnder.blob,
          quality: initialSearch.bestUnder.quality,
          scale: 1.0,
          width: canvas.width,
          height: canvas.height
        };
      }
      if (initialSearch.smallest) {
        lowestAchievedOverall = {
          blob: initialSearch.smallest.blob,
          quality: initialSearch.smallest.quality,
          scale: 1.0,
          width: canvas.width,
          height: canvas.height
        };
      }

      // If target wasn't achieved at 1.0 scale and downscaling is allowed, try progressive downscaling
      if (!bestBlobUnderTarget && settings.allowDownscaleForTarget) {
        const scaleSteps = [0.85, 0.70, 0.55, 0.40, minScale].filter((s, idx, arr) => s >= minScale && arr.indexOf(s) === idx);

        for (const testScale of scaleSteps) {
          const scaledCanvas = renderToCanvas(img, baseDims, settings, testScale, fillBg);
          const scaledSearch = await searchQuality(scaledCanvas, testScale);

          if (scaledSearch.smallest && (!lowestAchievedOverall || scaledSearch.smallest.blob.size < lowestAchievedOverall.blob.size)) {
            lowestAchievedOverall = {
              blob: scaledSearch.smallest.blob,
              quality: scaledSearch.smallest.quality,
              scale: testScale,
              width: scaledCanvas.width,
              height: scaledCanvas.height
            };
          }

          if (scaledSearch.bestUnder) {
            bestBlobUnderTarget = {
              blob: scaledSearch.bestUnder.blob,
              quality: scaledSearch.bestUnder.quality,
              scale: testScale,
              width: scaledCanvas.width,
              height: scaledCanvas.height
            };
            break; // Found highest resolution that meets target!
          }
        }
      }

      if (bestBlobUnderTarget) {
        finalBlob = bestBlobUnderTarget.blob;
        targetAchieved = true;
        qualityUsed = bestBlobUnderTarget.quality;
        finalWidth = bestBlobUnderTarget.width;
        finalHeight = bestBlobUnderTarget.height;
        if (bestBlobUnderTarget.scale < 1.0) {
          explanation = `Target achieved (${formatBytes(finalBlob.size)} ≤ ${settings.targetSizeKb} KB) with ${Math.round(bestBlobUnderTarget.quality * 100)}% quality at ${finalWidth}×${finalHeight}px.`;
        } else {
          explanation = `Target achieved (${formatBytes(finalBlob.size)} ≤ ${settings.targetSizeKb} KB) at full resolution with ${Math.round(bestBlobUnderTarget.quality * 100)}% quality.`;
        }
      } else {
        const fallback = lowestAchievedOverall!;
        finalBlob = fallback.blob;
        targetAchieved = false;
        qualityUsed = fallback.quality;
        finalWidth = fallback.width;
        finalHeight = fallback.height;
        explanation = `Could not reach ${settings.targetSizeKb} KB without excessive degradation. Best achievable was ${formatBytes(finalBlob.size)} at ${finalWidth}×${finalHeight}px (${Math.round(fallback.quality * 100)}% quality). Suggest increasing target size or allowing smaller dimensions.`;
      }
    }
  } else {
    // Manual Quality or Dimensions Only
    const canvas = renderToCanvas(img, baseDims, settings, 1.0, fillBg);
    const quality = settings.mode === 'dimensionsOnly' ? 0.92 : settings.quality;
    finalBlob = await canvasToBlob(canvas, mimeType, quality);
    finalWidth = canvas.width;
    finalHeight = canvas.height;
    targetAchieved = 'n/a';
    qualityUsed = quality;
    iterations = 1;
    explanation = `Processed at ${finalWidth}×${finalHeight}px (${resolvedFormat.toUpperCase()}, ${Math.round(quality * 100)}% quality).`;
  }

  const executionTimeMs = Math.round(performance.now() - startTime);
  const blobUrl = URL.createObjectURL(finalBlob);
  const savingsBytes = imageFile.originalSize - finalBlob.size;
  const savingsPercent = Number(((savingsBytes / imageFile.originalSize) * 100).toFixed(1));

  return {
    blob: finalBlob,
    url: blobUrl,
    size: finalBlob.size,
    width: finalWidth,
    height: finalHeight,
    format: resolvedFormat,
    targetAchieved,
    savingsBytes,
    savingsPercent,
    explanation,
    qualityUsed,
    iterations,
    executionTimeMs
  };
}
