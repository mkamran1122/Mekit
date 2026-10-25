import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CloudPreset,
  getUserPresets,
  saveUserPreset,
  deleteUserPreset,
} from '../services/firebase';
import { ImageSettings } from '../types';
import { Bookmark, Plus, Trash2, Check, X, Sparkles, LogIn } from 'lucide-react';

interface CloudPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: ImageSettings;
  onApplySettings: (settings: Partial<ImageSettings>) => void;
  onOpenAuth: () => void;
}

export const CloudPresetsModal: React.FC<CloudPresetsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onApplySettings,
  onOpenAuth,
}) => {
  const { user, isGuest } = useAuth();
  const [presets, setPresets] = useState<CloudPreset[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [newPresetTitle, setNewPresetTitle] = useState('');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadPresets();
    }
  }, [isOpen, user]);

  const loadPresets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserPresets(user.uid);
      setPresets(data);
    } catch (e) {
      console.error('Failed to load presets:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPresetTitle.trim()) return;

    setSavingNew(true);
    try {
      const presetId = `preset-${Date.now()}`;
      const newPreset: Omit<CloudPreset, 'userId' | 'createdAt' | 'updatedAt'> = {
        id: presetId,
        title: newPresetTitle.trim(),
        mode:
          currentSettings.mode === 'targetSize'
            ? 'compress'
            : currentSettings.resizeMode !== 'none'
            ? 'resize'
            : 'convert',
        quality: Math.round(currentSettings.quality * 100),
        targetSizeKb: currentSettings.targetSizeKb,
        width: currentSettings.targetWidth,
        height: currentSettings.targetHeight,
        format: currentSettings.format,
        maintainAspectRatio: currentSettings.lockAspectRatio,
      };

      await saveUserPreset(user.uid, newPreset);
      setNewPresetTitle('');
      await loadPresets();
    } catch (err) {
      console.error('Error saving preset:', err);
    } finally {
      setSavingNew(false);
    }
  };

  const handleDelete = async (presetId: string) => {
    if (!user) return;
    try {
      await deleteUserPreset(user.uid, presetId);
      setPresets((prev) => prev.filter((p) => p.id !== presetId));
    } catch (err) {
      console.error('Failed to delete preset:', err);
    }
  };

  const handleApply = (preset: CloudPreset) => {
    onApplySettings({
      format: preset.format as ImageSettings['format'],
      quality: (preset.quality || 80) / 100,
      targetSizeKb: preset.targetSizeKb || 100,
      lockAspectRatio: preset.maintainAspectRatio,
      targetWidth: preset.width,
      targetHeight: preset.height,
      mode: preset.mode === 'compress' ? 'targetSize' : 'manualQuality',
      resizeMode: preset.width || preset.height ? 'fit' : 'none',
    });
    setAppliedId(preset.id);
    setTimeout(() => {
      setAppliedId(null);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="presets-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 id="presets-modal-title" className="text-sm font-bold text-neutral-900">
                Cloud Image Presets
              </h2>
              <p className="text-[11px] text-neutral-500">
                Save & reuse target KB limits, dimensions, and formats
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {!user ? (
            <div className="p-6 rounded-xl border border-neutral-200 bg-neutral-50 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-900">Sign in to sync presets</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Save your recurring client requirements (e.g., &quot;Shopify Product 1000x1000 WebP&quot; or &quot;Gov Portal &lt; 50KB&quot;) to your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In or Continue as Guest
              </button>
            </div>
          ) : (
            <>
              {/* Save Current Settings Form */}
              <form onSubmit={handleSaveCurrent} className="p-3.5 sm:p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-xs font-bold text-neutral-900">
                    Save Active Settings as Preset
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600">
                    {currentSettings.format.toUpperCase()} • {currentSettings.targetSizeKb} KB
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newPresetTitle}
                    onChange={(e) => setNewPresetTitle(e.target.value)}
                    placeholder="e.g., Passport Photo 50KB or Blog Hero WebP"
                    maxLength={60}
                    className="flex-1 px-3 py-2 min-h-[38px] text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900 placeholder:text-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={savingNew || !newPresetTitle.trim()}
                    className="px-4 py-2 min-h-[38px] text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Preset
                  </button>
                </div>
              </form>

              {/* Presets List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Your Cloud Presets ({presets.length})
                </h3>

                {loading ? (
                  <div className="py-8 text-center text-xs text-neutral-400">Loading presets...</div>
                ) : presets.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-neutral-200 rounded-xl space-y-1">
                    <p className="text-xs font-medium text-neutral-600">No saved presets yet</p>
                    <p className="text-[11px] text-neutral-400">
                      Configure your compression target above and click Save to store it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {presets.map((preset) => (
                      <div
                        key={preset.id}
                        className="p-3 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-neutral-900 truncate">
                            {preset.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                            <span className="font-mono text-neutral-700 bg-neutral-100 px-1.5 py-0.2 rounded">
                              {preset.format.toUpperCase()}
                            </span>
                            {preset.targetSizeKb && (
                              <span>Limit: {preset.targetSizeKb} KB</span>
                            )}
                            {preset.width && preset.height && (
                              <span>{preset.width}x{preset.height}px</span>
                            )}
                            <span>{preset.quality}% Q</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleApply(preset)}
                            className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                          >
                            {appliedId === preset.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                Applied!
                              </>
                            ) : (
                              'Apply'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(preset.id)}
                            aria-label={`Delete preset ${preset.title}`}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
