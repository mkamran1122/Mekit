import React, { useState } from 'react';
import {
  Sliders,
  Target,
  Maximize2,
  RefreshCw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  Layers,
  Bookmark
} from 'lucide-react';
import { ImageSettings, ImageFormat, ResizeMode } from '../types';
import { DIMENSION_PRESETS } from '../utils/dimensionPresets';
import { UPLOAD_PRESETS } from '../utils/presets';

interface ControlPanelProps {
  settings: ImageSettings;
  onChangeSettings: (settings: ImageSettings) => void;
  onProcessAll: () => void;
  isProcessing: boolean;
  totalImages: number;
  hasTransparencyInBatch: boolean;
  onApplyPreset: (presetId: string) => void;
  activeTab: 'target' | 'resize' | 'format' | 'presets';
  onTabChange: (tab: 'target' | 'resize' | 'format' | 'presets') => void;
  onOpenCloudPresets?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onChangeSettings,
  onProcessAll,
  isProcessing,
  totalImages,
  hasTransparencyInBatch,
  onApplyPreset,
  activeTab,
  onTabChange,
  onOpenCloudPresets
}) => {
  const [customUnit, setCustomUnit] = useState<'KB' | 'MB'>('KB');
  const [customVal, setCustomVal] = useState<string>('100');

  const updateSetting = <K extends keyof ImageSettings>(key: K, value: ImageSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: value
    });
  };

  const handleTargetSizeClick = (kb: number) => {
    updateSetting('mode', 'targetSize');
    updateSetting('targetSizeKb', kb);
  };

  const handleCustomSizeChange = (valStr: string, unit: 'KB' | 'MB') => {
    setCustomVal(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const kb = unit === 'MB' ? Math.round(num * 1024) : Math.round(num);
      updateSetting('mode', 'targetSize');
      updateSetting('targetSizeKb', kb);
    }
  };

  const handleRotate = () => {
    const next = (settings.rotation + 90) % 360;
    updateSetting('rotation', next);
  };

  const isJpegAlphaWarning = settings.format === 'jpeg' && hasTransparencyInBatch;

  return (
    <div id="control-panel" className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
      {/* Top Segmented Controls */}
      <div className="flex border-b border-neutral-200 bg-neutral-50/70 p-1.5 gap-1.5 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => onTabChange('target')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'target'
              ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/80'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Smart Target Size</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('resize')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'resize'
              ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/80'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span>Image Resizer</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('format')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'format'
              ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/80'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span>Format & Quality</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('presets')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'presets'
              ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/80'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span>Upload Presets</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6">

        {/* TAB 1: SMART TARGET SIZE (Compressor) */}
        {activeTab === 'target' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  Target File Size Limit (KB / MB)
                </h4>
                <p className="text-xs text-neutral-500">
                  Select a maximum limit for your forms. mekit automatically optimizes quality to stay under your cap.
                </p>
              </div>

              {settings.mode !== 'targetSize' && (
                <button
                  type="button"
                  onClick={() => updateSetting('mode', 'targetSize')}
                  className="text-xs text-amber-700 font-semibold hover:underline self-start sm:self-auto min-h-[32px] inline-flex items-center"
                >
                  Enable Target Size Mode
                </button>
              )}
            </div>

            {/* Quick target buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[20, 50, 100, 200, 500, 1024].map((kb) => {
                const label = kb >= 1024 ? '1 MB' : `${kb} KB`;
                const isSelected = settings.mode === 'targetSize' && settings.targetSizeKb === kb;
                return (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => handleTargetSizeClick(kb)}
                    className={`py-2.5 px-2 sm:px-3 text-xs font-bold rounded-lg border transition-all text-center min-h-[42px] flex items-center justify-center ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Custom target input */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-xs font-semibold text-neutral-700 whitespace-nowrap">
                Custom Limit:
              </span>
              <div className="flex items-center gap-2 flex-1 w-full sm:max-w-xs">
                <input
                  type="number"
                  min="5"
                  max="100000"
                  value={customVal}
                  onChange={(e) => handleCustomSizeChange(e.target.value, customUnit)}
                  placeholder="e.g. 75"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 min-h-[38px]"
                />
                <div className="flex rounded-lg border border-neutral-300 overflow-hidden shrink-0 min-h-[38px]">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomUnit('KB');
                      handleCustomSizeChange(customVal, 'KB');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold ${
                      customUnit === 'KB'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-600'
                    }`}
                  >
                    KB
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomUnit('MB');
                      handleCustomSizeChange(customVal, 'MB');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold ${
                      customUnit === 'MB'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-600'
                    }`}
                  >
                    MB
                  </button>
                </div>
              </div>
            </div>

            {/* Downscale fallback options */}
            <div className="space-y-3 pt-2 border-t border-neutral-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowDownscaleForTarget}
                  onChange={(e) => updateSetting('allowDownscaleForTarget', e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-800">
                    Allow dimension downscaling if needed (Recommended)
                  </span>
                  <p className="text-xs text-neutral-500">
                    If quality compression alone cannot reach small targets (like 20 KB or 50 KB), mekit will safely reduce resolution to hit your target.
                  </p>
                </div>
              </label>

              {settings.allowDownscaleForTarget && (
                <div className="pl-6 space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Minimum allowed resolution scale:</span>
                    <span className="font-mono font-bold text-neutral-900">{settings.minDimensionPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    step="5"
                    value={settings.minDimensionPct}
                    onChange={(e) => updateSetting('minDimensionPct', Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>20% (Aggressive downscaling for tiny limits)</span>
                    <span>90% (Strictly preserves dimensions)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: IMAGE RESIZER */}
        {activeTab === 'resize' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  Dimensions, Cropping & Orientation
                </h4>
                <p className="text-xs text-neutral-500">
                  Scale by pixels, percentage, fit within bounds, or crop without distortion.
                </p>
              </div>

              {/* Verified preset quick select */}
              {/* Verified preset quick select */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <span className="text-xs text-neutral-500 font-medium">Preset:</span>
                <select
                  aria-label="Preset dimension selector"
                  onChange={(e) => {
                    const preset = DIMENSION_PRESETS.find((p) => `${p.width}x${p.height}` === e.target.value);
                    if (preset) {
                      updateSetting('resizeMode', 'fit');
                      updateSetting('targetWidth', preset.width);
                      updateSetting('targetHeight', preset.height);
                      updateSetting('lockAspectRatio', true);
                    }
                  }}
                  className="w-full sm:w-auto text-xs px-2.5 py-2 min-h-[38px] rounded-lg border border-neutral-300 bg-white text-neutral-800"
                >
                  <option value="">Select platform preset...</option>
                  {DIMENSION_PRESETS.map((p, i) => (
                    <option key={i} value={`${p.width}x${p.height}`}>
                      {p.label} ({p.width}×{p.height})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resize Mode Selector */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {(
                [
                  { id: 'none', label: 'Original Size' },
                  { id: 'fit', label: 'Fit Inside (Contain)' },
                  { id: 'crop', label: 'Crop (Cover)' },
                  { id: 'dimensions', label: 'Exact Dimensions' },
                  { id: 'percentage', label: 'Scale by %' }
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => updateSetting('resizeMode', mode.id as ResizeMode)}
                  className={`px-3 py-2 min-h-[38px] text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center text-center ${
                    settings.resizeMode === mode.id
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Inputs based on resizeMode */}
            {settings.resizeMode === 'percentage' ? (
              <div className="p-4 bg-neutral-50 rounded-xl space-y-3 border border-neutral-200">
                <div className="flex justify-between text-xs font-medium text-neutral-700">
                  <span>Scale Percentage:</span>
                  <span className="font-mono font-bold text-neutral-900">{settings.percentage}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={settings.percentage}
                  onChange={(e) => updateSetting('percentage', Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => updateSetting('percentage', pct)}
                      className="py-1.5 min-h-[36px] text-xs font-mono rounded-lg bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 flex items-center justify-center"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            ) : settings.resizeMode !== 'none' ? (
              <div className="p-4 bg-neutral-50 rounded-xl space-y-4 border border-neutral-200">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      value={settings.targetWidth || ''}
                      onChange={(e) => updateSetting('targetWidth', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 1920"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 bg-white text-neutral-900 min-h-[38px]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => updateSetting('lockAspectRatio', !settings.lockAspectRatio)}
                    title={settings.lockAspectRatio ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
                    className={`mt-5 p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg border transition-colors ${
                      settings.lockAspectRatio
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-600 border-neutral-300'
                    }`}
                  >
                    {settings.lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      value={settings.targetHeight || ''}
                      onChange={(e) => updateSetting('targetHeight', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 1080"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 bg-white text-neutral-900 min-h-[38px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowUpscale}
                      onChange={(e) => updateSetting('allowUpscale', e.target.checked)}
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="text-xs text-neutral-700">
                      Allow enlarging images smaller than target bounds (upscaling)
                    </span>
                  </label>
                </div>
              </div>
            ) : null}

            {/* Rotation & Flip Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 border-t border-neutral-200">
              <span className="text-xs font-semibold text-neutral-700 w-full sm:w-auto">
                Orientation:
              </span>

              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-2 min-h-[38px] text-xs font-medium rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate 90° ({settings.rotation}°)</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting('flipH', !settings.flipH)}
                className={`flex items-center gap-1.5 px-3 py-2 min-h-[38px] text-xs font-medium rounded-lg border transition-colors ${
                  settings.flipH
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip H</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting('flipV', !settings.flipV)}
                className={`flex items-center gap-1.5 px-3 py-2 min-h-[38px] text-xs font-medium rounded-lg border transition-colors ${
                  settings.flipV
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                <FlipVertical className="w-3.5 h-3.5" />
                <span>Flip V</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: FORMAT & QUALITY */}
        {activeTab === 'format' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Image Format & Manual Quality
              </h4>
              <p className="text-xs text-neutral-500">
                Convert file formats and adjust compression quality for JPEG and WebP.
              </p>
            </div>

            {/* Format Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">
                Target File Format:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: 'original', label: 'Match Original', desc: 'Preserve input extension' },
                    { id: 'jpeg', label: 'JPEG (.jpg)', desc: 'Best universal compatibility' },
                    { id: 'webp', label: 'WebP (.webp)', desc: 'Modern small size & alpha' },
                    { id: 'png', label: 'PNG (.png)', desc: 'Lossless & transparency' }
                  ] as const
                ).map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => updateSetting('format', fmt.id as ImageFormat)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      settings.format === fmt.id
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{fmt.label}</div>
                    <div className="text-[11px] opacity-75 mt-0.5">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transparency Advisory */}
            {isJpegAlphaWarning && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <strong className="font-semibold">Transparency Notice:</strong> One or more selected images contain transparent areas. The JPEG format does not support transparency; transparent regions will be rendered on a solid white background. If you need transparency preserved, select <strong>WebP</strong> or <strong>PNG</strong>.
                </div>
              </div>
            )}

            {/* Mode: Target Size vs Manual Quality */}
            <div className="p-4 bg-neutral-50 rounded-xl space-y-4 border border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="text-xs font-semibold text-neutral-800">
                  Compression Mode:
                </span>
                <div className="grid grid-cols-2 sm:flex gap-1 bg-white p-1 rounded-lg border border-neutral-200 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => updateSetting('mode', 'targetSize')}
                    className={`px-3 py-2 min-h-[38px] text-xs font-semibold rounded transition-colors flex items-center justify-center text-center ${
                      settings.mode === 'targetSize'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600'
                    }`}
                  >
                    Target Size
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSetting('mode', 'manualQuality')}
                    className={`px-3 py-2 min-h-[38px] text-xs font-semibold rounded transition-colors flex items-center justify-center text-center ${
                      settings.mode === 'manualQuality'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600'
                    }`}
                  >
                    Manual Quality
                  </button>
                </div>
              </div>

              {settings.mode === 'manualQuality' && (
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <div className="flex justify-between text-xs text-neutral-700">
                    <span>Encoding Quality:</span>
                    <span className="font-mono font-bold text-neutral-900">{Math.round(settings.quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={Math.round(settings.quality * 100)}
                    onChange={(e) => updateSetting('quality', Number(e.target.value) / 100)}
                    className="w-full h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Smallest File (5%)</span>
                    <span>Balanced (80%)</span>
                    <span>Max Quality (100%)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Privacy Strip */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={settings.stripExif}
                  onChange={(e) => updateSetting('stripExif', e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>Strip GPS, camera model, and personal EXIF metadata (Recommended for privacy)</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: UPLOAD PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            {onOpenCloudPresets && (
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Custom Cloud Presets</h5>
                    <p className="text-[11px] text-neutral-600">Save, reuse, and sync your favorite compression specifications</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenCloudPresets}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg shadow-2xs transition-colors shrink-0"
                >
                  Manage Presets
                </button>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Workflow Presets
              </h4>
              <p className="text-xs text-neutral-500">
                One-click general presets for job applications, university registrations, ID scans, and social media. You can tweak any value afterwards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {UPLOAD_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onApplyPreset(preset.id)}
                  className="p-3.5 text-left rounded-xl border border-neutral-200 bg-neutral-50/70 hover:border-neutral-400 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-amber-700 transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 font-semibold">Apply</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 line-clamp-2">
                    {preset.description}
                  </div>
                  <div className="text-[11px] font-mono text-amber-800 mt-2 font-medium">
                    {preset.tag}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Action Footer Bar */}
      <div className="p-4 bg-neutral-50/90 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="text-xs text-neutral-600 text-center sm:text-left w-full sm:w-auto">
          {settings.mode === 'targetSize' ? (
            <span>
              Target: <strong className="font-mono text-neutral-900 font-semibold">{settings.targetSizeKb} KB</strong> limit · Format: <strong className="text-neutral-900 font-semibold">{settings.format.toUpperCase()}</strong>
            </span>
          ) : (
            <span>
              Quality: <strong className="font-mono text-neutral-900 font-semibold">{Math.round(settings.quality * 100)}%</strong> · Format: <strong className="text-neutral-900 font-semibold">{settings.format.toUpperCase()}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            disabled={isProcessing || totalImages === 0}
            onClick={onProcessAll}
            className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs sm:text-sm font-bold text-white bg-neutral-950 rounded-xl hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Images...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Process All ({totalImages})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
