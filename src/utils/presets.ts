import { UploadPreset } from '../types';

export const UPLOAD_PRESETS: UploadPreset[] = [
  {
    id: 'job-application',
    name: 'Job Application Photo',
    description: 'General preset suited for career portals, resume uploads, and LinkedIn profile badges.',
    tag: '≤ 100 KB · 600×600 px · JPG',
    settings: {
      mode: 'targetSize',
      targetSizeKb: 100,
      allowDownscaleForTarget: true,
      minDimensionPct: 50,
      format: 'jpeg',
      resizeMode: 'fit',
      targetWidth: 600,
      targetHeight: 600,
      lockAspectRatio: true,
      allowUpscale: false
    }
  },
  {
    id: 'university-form',
    name: 'University & College Portal',
    description: 'Optimized for campus registrar uploads, student ID cards, and admission forms with strict 50 KB ceilings.',
    tag: '≤ 50 KB · 400×400 px · JPG',
    settings: {
      mode: 'targetSize',
      targetSizeKb: 50,
      allowDownscaleForTarget: true,
      minDimensionPct: 40,
      format: 'jpeg',
      resizeMode: 'fit',
      targetWidth: 400,
      targetHeight: 400,
      lockAspectRatio: true,
      allowUpscale: false
    }
  },
  {
    id: 'government-visa',
    name: 'Online Form / Visa Document',
    description: 'General configuration commonly compatible with government filing portals and digital ID scans.',
    tag: '≤ 200 KB · 600×600 px · JPG',
    settings: {
      mode: 'targetSize',
      targetSizeKb: 200,
      allowDownscaleForTarget: true,
      minDimensionPct: 50,
      format: 'jpeg',
      resizeMode: 'fit',
      targetWidth: 600,
      targetHeight: 600,
      lockAspectRatio: true,
      allowUpscale: false
    }
  },
  {
    id: 'website-hero',
    name: 'Website & Blog Article Hero',
    description: 'High visual clarity in modern WebP format for fast web page speed and SEO performance.',
    tag: '≤ 200 KB · Max 1920×1080 · WebP',
    settings: {
      mode: 'targetSize',
      targetSizeKb: 200,
      allowDownscaleForTarget: true,
      minDimensionPct: 60,
      format: 'webp',
      resizeMode: 'fit',
      targetWidth: 1920,
      targetHeight: 1080,
      lockAspectRatio: true,
      allowUpscale: false
    }
  },
  {
    id: 'email-attachment',
    name: 'Email Attachment Optimizer',
    description: 'Reduces heavy camera photos into fast-sending email attachments under 500 KB.',
    tag: '≤ 500 KB · Max 1200×1200 · JPEG',
    settings: {
      mode: 'targetSize',
      targetSizeKb: 500,
      allowDownscaleForTarget: true,
      minDimensionPct: 50,
      format: 'jpeg',
      resizeMode: 'fit',
      targetWidth: 1200,
      targetHeight: 1200,
      lockAspectRatio: true,
      allowUpscale: false
    }
  },
  {
    id: 'ecommerce-product',
    name: 'E-Commerce Product Showcase',
    description: 'Clean square catalog standard with crisp detail and lightweight footprint for shop speed.',
    tag: '≤ 100 KB · 1000×1000 px · WebP',
    settings: {
      mode: 'targetSize',
      targetSizeKb: 100,
      allowDownscaleForTarget: true,
      minDimensionPct: 50,
      format: 'webp',
      resizeMode: 'fit',
      targetWidth: 1000,
      targetHeight: 1000,
      lockAspectRatio: true,
      allowUpscale: false
    }
  },
  {
    id: 'social-post',
    name: 'Social Media Feed Post',
    description: 'Standard 1080×1080 square format calibrated to eliminate platform re-compression artifacts.',
    tag: '≤ 500 KB · 1080×1080 px · WebP',
    settings: {
      mode: 'targetSize',
      targetSizeKb: 500,
      allowDownscaleForTarget: true,
      minDimensionPct: 50,
      format: 'webp',
      resizeMode: 'fit',
      targetWidth: 1080,
      targetHeight: 1080,
      lockAspectRatio: true,
      allowUpscale: false
    }
  }
];
