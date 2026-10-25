import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserCheck, ShieldCheck, LogOut, Sparkles } from 'lucide-react';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPresets?: () => void;
  onOpenHistory?: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onOpenPresets,
  onOpenHistory,
}) => {
  const { user, isGuest, signInGoogle, signInAnonymous, logout, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setModalError(null);
    try {
      const loggedUser = await signInGoogle();
      if (loggedUser) {
        onClose();
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (
        e?.code === 'auth/popup-closed-by-user' ||
        e?.code === 'auth/cancelled-popup-request'
      ) {
        // User voluntarily dismissed popup
        return;
      }
      if (e?.code === 'auth/popup-blocked') {
        setModalError('Sign-in popup was blocked by your browser. Please allow popups for mekit.online.');
        return;
      }
      setModalError(e.message || 'Unable to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setModalError(null);
    try {
      await signInAnonymous();
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setModalError(e.message || 'Unable to start guest session');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logout();
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setModalError(e.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-sm font-bold text-neutral-900">
                {user ? (isGuest ? 'Guest Session' : 'Account & Cloud Sync') : 'Sign In to Mekit'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                Sync compression presets & audit history
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {(modalError || error) && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {modalError || error}
            </div>
          )}

          {user ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-12 h-12 rounded-full border border-neutral-200 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-base">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-neutral-900 truncate">
                      {user.displayName || (isGuest ? 'Guest User' : 'Mekit User')}
                    </p>
                    {isGuest && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700">
                        Local Guest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {user.email || 'Presets and history saved in this browser'}
                  </p>
                </div>
              </div>

              {/* Quick links to Presets and History */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {onOpenPresets && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPresets();
                    }}
                    className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-neutral-900 block">Saved Presets</span>
                    <span className="text-[11px] text-neutral-500">Manage target specs</span>
                  </button>
                )}
                {onOpenHistory && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenHistory();
                    }}
                    className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-neutral-900 block">Processing Log</span>
                    <span className="text-[11px] text-neutral-500">Audit past savings</span>
                  </button>
                )}
              </div>

              {/* If user is guest, offer optional Google sign-in for multi-device sync */}
              {isGuest && (
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2">
                  <p className="text-xs text-neutral-700">
                    Want to access your presets on other computers? Sign in with Google anytime.
                  </p>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleGoogleLogin}
                    className="w-full py-2 px-3 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors shadow-2xs flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              )}

              {/* Sign Out / End Session Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {isGuest ? 'Reset Guest Session' : 'Sign Out'}
              </button>
            </div>
          ) : (
            /* Logged Out / Login View */
            <div className="space-y-4">
              <p className="text-xs text-neutral-600 leading-relaxed">
                Connect your account to save custom compression presets, sync dimensions across devices, and keep an audit history of your image savings.
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 text-sm font-semibold text-neutral-900 bg-white border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-neutral-200 w-full" />
                <span className="bg-white px-2 text-[11px] text-neutral-400 uppercase font-medium tracking-wider">
                  or
                </span>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleGuestLogin}
                className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-neutral-600" />
                Continue as Guest
              </button>

              {/* Privacy Notice */}
              <div className="pt-2 flex items-start gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>100% In-Browser Privacy:</strong> Your photos are processed exclusively on your device and never uploaded to our servers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
