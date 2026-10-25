import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ProcessingHistoryRecord,
  getUserProcessingHistory,
  clearUserHistory,
} from '../services/firebase';
import { History, Trash2, X, ShieldCheck, Download, Sparkles, LogIn } from 'lucide-react';
import { formatBytes } from '../utils/imageProcessor';

interface ProcessingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const ProcessingHistoryModal: React.FC<ProcessingHistoryModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ProcessingHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
    }
  }, [isOpen, user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const records = await getUserProcessingHistory(user.uid, 50);
      setHistory(records);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!user || history.length === 0) return;
    setClearing(true);
    try {
      await clearUserHistory(user.uid);
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    } finally {
      setClearing(false);
    }
  };

  const exportAsCsv = () => {
    if (history.length === 0) return;
    const headers = ['Timestamp', 'File Name', 'Tool', 'Original Size', 'Compressed Size', 'Savings %', 'Format'];
    const rows = history.map((item) => [
      new Date(item.timestamp).toLocaleString(),
      `"${item.fileName.replace(/"/g, '""')}"`,
      item.tool,
      item.originalBytes,
      item.compressedBytes,
      `${item.savingsPercent}%`,
      item.format,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mekit-processing-history-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-xl bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0">
              <History className="w-4 h-4 text-neutral-800" />
            </div>
            <div>
              <h2 id="history-modal-title" className="text-sm font-bold text-neutral-900">
                Processing Audit History
              </h2>
              <p className="text-[11px] text-neutral-500">
                Summary logs of your client-side optimizations
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {!user ? (
            <div className="p-6 rounded-xl border border-neutral-200 bg-neutral-50 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-900">Sign in to track history</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Automatically track your compression savings, bandwidth saved, and file reduction audit logs across sessions.
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
              {/* Privacy Banner */}
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-950 leading-relaxed">
                  <strong>Zero Image Storage:</strong> Only lightweight performance metrics (file names, bytes, and savings ratios) are recorded. Your images never leave your browser memory.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Recent Activity ({history.length})
                </span>
                {history.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={exportAsCsv}
                      className="px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export CSV
                    </button>
                    <button
                      type="button"
                      disabled={clearing}
                      onClick={handleClear}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Log List */}
              {loading ? (
                <div className="py-8 text-center text-xs text-neutral-400">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-neutral-200 rounded-xl space-y-1">
                  <p className="text-xs font-medium text-neutral-600">No processing logs yet</p>
                  <p className="text-[11px] text-neutral-400">
                    When you compress or resize images in Mekit, your savings stats will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((record) => (
                    <div
                      key={record.id}
                      className="p-3 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {record.fileName}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                          <span className="capitalize">{record.tool}</span>
                          <span>•</span>
                          <span>{formatBytes(record.originalBytes)} → {formatBytes(record.compressedBytes)}</span>
                          <span>•</span>
                          <span className="font-mono text-neutral-700 uppercase bg-neutral-100 px-1 py-0.2 rounded text-[10px]">
                            {record.format}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          -{record.savingsPercent}%
                        </span>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          {new Date(record.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
