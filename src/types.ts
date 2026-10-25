export type ImageFormat = 'original' | 'jpeg' | 'png' | 'webp';

export type ResizeMode = 'none' | 'dimensions' | 'percentage' | 'fit' | 'crop';

export interface ImageSettings {
  mode: 'targetSize' | 'manualQuality' | 'dimensionsOnly';
  targetSizeKb: number;
  allowDownscaleForTarget: boolean;
  minDimensionPct: number; // e.g. 40 means don't downscale smaller than 40% of original
  format: ImageFormat;
  quality: number; // 0.05 to 1.0 (for manual quality mode)
  resizeMode: ResizeMode;
  targetWidth?: number;
  targetHeight?: number;
  lockAspectRatio: boolean;
  percentage: number; // e.g. 100, 75, 50, 25
  allowUpscale: boolean;
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  stripExif: boolean;
  backgroundColor: string; // for JPEG when source has alpha, default #ffffff
}

export interface ProcessedResult {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  format: 'jpeg' | 'png' | 'webp';
  targetAchieved: boolean | 'n/a';
  savingsBytes: number;
  savingsPercent: number;
  explanation?: string;
  qualityUsed: number;
  iterations: number;
  executionTimeMs: number;
}

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: 'jpeg' | 'png' | 'webp' | 'other';
  hasAlpha?: boolean;
  originalUrl: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  error?: string;
  processedResult?: ProcessedResult;
  customSettings?: ImageSettings;
}

export interface UploadPreset {
  id: string;
  name: string;
  description: string;
  tag: string;
  settings: Partial<ImageSettings>;
}

export interface DimensionPreset {
  category: string;
  label: string;
  width: number;
  height: number;
  description: string;
}
