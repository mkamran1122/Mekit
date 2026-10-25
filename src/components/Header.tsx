import React, { useState } from 'react';
import { ShieldCheck, Menu, X, User, Bookmark, History, Sparkles, ChevronDown } from 'lucide-react';
import { Link, useRouter } from '../utils/router';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  fileCount: number;
  onTriggerUpload: () => void;
  onOpenAuth: () => void;
  onOpenPresets: () => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fileCount,
  onTriggerUpload,
  onOpenAuth,
  onOpenPresets,
  onOpenHistory,
}) => {
  const { path } = useRouter();
  const { user, isGuest } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isCurrent = (route: string) => {
    if (route === '/' && path === '/') return true;
    if (route !== '/' && path.startsWith(route)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand: mekit.online */}
        <Link
          href="/"
          className="text-left group flex items-baseline gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded"
        >
          <span className="text-2xl font-extrabold tracking-tight text-neutral-900">
            mekit
          </span>
          <span className="text-xs font-bold text-amber-600">
            .online
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <Link
            href="/"
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              isCurrent('/') && path === '/'
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-900'
                : 'hover:text-neutral-950'
            }`}
          >
            Studio
          </Link>
          <Link
            href="/compress-image"
            scrollToId="control-panel"
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              isCurrent('/compress-image')
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-900'
                : 'hover:text-neutral-950'
            }`}
          >
            Compressor
          </Link>
          <Link
            href="/resize-image"
            scrollToId="control-panel"
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              isCurrent('/resize-image')
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-900'
                : 'hover:text-neutral-950'
            }`}
          >
            Resizer
          </Link>
          <Link
            href="/convert-image"
            scrollToId="control-panel"
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              isCurrent('/convert-image')
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-900'
                : 'hover:text-neutral-950'
            }`}
          >
            Converter
          </Link>
          <Link
            href="/tutorials"
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              isCurrent('/tutorials')
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-900'
                : 'hover:text-neutral-950'
            }`}
          >
            Tutorials
          </Link>
          <Link
            href="/how-it-works"
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              isCurrent('/how-it-works')
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-900'
                : 'hover:text-neutral-950'
            }`}
          >
            How It Works
          </Link>
          <Link
            href="/faq"
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              isCurrent('/faq')
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-900'
                : 'hover:text-neutral-950'
            }`}
          >
            FAQ
          </Link>
        </nav>

        {/* Action + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-500 mr-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% In-Browser</span>
          </div>

          {/* Cloud Tools Dropdown / Buttons */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-label="User Account Menu"
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full object-cover border border-neutral-300"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[80px] truncate">
                    {user.displayName ? user.displayName.split(' ')[0] : (isGuest ? 'Guest' : 'Account')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="font-bold text-neutral-900 truncate">
                          {user.displayName || (isGuest ? 'Guest Session' : 'User')}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {user.email || 'Cloud Synced'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenPresets();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                        <span>Saved Presets</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenHistory();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                      >
                        <History className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Processing History</span>
                      </button>
                      <div className="border-t border-neutral-100 my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                      >
                        <User className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Account Settings</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Cloud Sync</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onTriggerUpload();
              setMobileMenuOpen(false);
            }}
            className="px-2.5 sm:px-4 py-2 min-h-[40px] text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 flex items-center justify-center"
          >
            {fileCount > 0 ? `+ Add (${fileCount})` : '+ Add Images'}
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-neutral-950/20 backdrop-blur-2xs z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            aria-label="Mobile Navigation"
            className="relative z-40 md:hidden border-t border-neutral-200 bg-white px-4 py-3 shadow-xl space-y-1 animate-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
              isCurrent('/') && path === '/' ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>Studio Workspace</span>
            <span className="text-[10px] text-neutral-400">All Tools</span>
          </Link>

          <Link
            href="/compress-image"
            scrollToId="control-panel"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
              isCurrent('/compress-image') ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>Image Compressor</span>
            <span className="text-[10px] text-amber-600 font-mono">KB Limit</span>
          </Link>

          <Link
            href="/resize-image"
            scrollToId="control-panel"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
              isCurrent('/resize-image') ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>Image Resizer</span>
            <span className="text-[10px] text-neutral-400 font-mono">Dimensions</span>
          </Link>

          <Link
            href="/convert-image"
            scrollToId="control-panel"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
              isCurrent('/convert-image') ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>Format Converter</span>
            <span className="text-[10px] text-neutral-400 font-mono">JPG / PNG / WebP</span>
          </Link>

          <Link
            href="/batch-processing"
            scrollToId="workspace"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
              isCurrent('/batch-processing') ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>Batch Studio</span>
            <span className="text-[10px] text-neutral-400 font-mono">Bulk & ZIP</span>
          </Link>

          {/* Cloud features in mobile drawer */}
          <div className="pt-2 border-t border-neutral-100 my-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPresets();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Cloud Presets</span>
              </div>
              <span className="text-[10px] text-neutral-400">Saved Specs</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHistory();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-neutral-600" />
                <span>Processing History</span>
              </div>
              <span className="text-[10px] text-neutral-400">Audit Logs</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>{user ? (user.displayName || 'Account') : 'Sign In / Account'}</span>
              </div>
              <span className="text-[10px] text-amber-600 font-medium">
                {user ? (isGuest ? 'Guest' : 'Online') : 'Firebase'}
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-100 my-1">
            <Link
              href="/tutorials"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                isCurrent('/tutorials') ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span>Tutorials & Guides</span>
              <span className="text-[10px] text-neutral-400">Step-by-step</span>
            </Link>

            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                isCurrent('/how-it-works') ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span>How It Works</span>
              <span className="text-[10px] text-neutral-400">In-Browser</span>
            </Link>

            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                isCurrent('/faq') ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span>FAQ</span>
              <span className="text-[10px] text-neutral-400">Questions</span>
            </Link>
          </div>
        </nav>
      </>
      )}
    </header>
  );
};
