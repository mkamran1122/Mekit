import React, { useState } from 'react';
import { X, ShieldCheck, Send, Check } from 'lucide-react';

interface InfoModalProps {
  type: 'privacy' | 'terms' | 'about' | 'contact' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const [contactSent, setContactSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [messageInput, setMessageInput] = useState('');

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setContactSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-neutral-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <h3 className="text-base font-bold text-neutral-900 capitalize">
            {type === 'privacy' && 'Privacy Policy & Data Security'}
            {type === 'terms' && 'Terms of Service'}
            {type === 'about' && 'About mekit.online'}
            {type === 'contact' && 'Contact & Feedback'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-neutral-600 leading-relaxed bg-white">
          {type === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-900 font-medium border border-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Zero Server Uploads: All image processing takes place exclusively inside your local web browser.</span>
              </div>

              <h4 className="font-bold text-neutral-900 text-sm">
                1. No Server File Collection
              </h4>
              <p>
                When you drag or select an image on mekit.online, the binary data is read into your browser’s temporary memory using standard HTML5 Canvas and Blob APIs. At no point is your image transmitted over the internet to our servers or any third-party cloud computing service.
              </p>

              <h4 className="font-bold text-neutral-900 text-sm">
                2. EXIF Metadata Stripping
              </h4>
              <p>
                Photographs taken by smartphones and modern cameras often contain embedded Exchangeable Image File Format (EXIF) metadata. This may include precise GPS coordinates, device serial numbers, and camera settings. When you compress or resize an image using mekit.online, this sensitive metadata is not transferred into the new output file, protecting your personal privacy when sharing documents online.
              </p>

              <h4 className="font-bold text-neutral-900 text-sm">
                3. Cookies and Analytics
              </h4>
              <p>
                mekit.online does not use intrusive tracking cookies, nor do we track filenames, image contents, or personally identifiable data.
              </p>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900 text-sm">
                1. Free & Unrestricted Use
              </h4>
              <p>
                mekit.online is provided free of charge for personal, educational, commercial, and professional use. There are no subscriptions, mandatory account creations, or paywalls for core image compression and resizing functions.
              </p>

              <h4 className="font-bold text-neutral-900 text-sm">
                2. User Responsibility & Ownership
              </h4>
              <p>
                You retain all rights, ownership, and copyright to any images processed through mekit.online. Because images are processed locally on your hardware, you are solely responsible for ensuring you have the legal right to edit and format the files you select.
              </p>

              <h4 className="font-bold text-neutral-900 text-sm">
                3. Disclaimer of Warranties
              </h4>
              <p>
                mekit.online is provided "as is" without warranty of any kind. While our Smart Target algorithms strive to achieve your desired file size limits and maintain visual fidelity, we do not guarantee exact byte counts due to varying browser rendering implementations.
              </p>
            </div>
          )}

          {type === 'about' && (
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900 text-sm">
                Built for Speed, Privacy, and Real Utility
              </h4>
              <p>
                We built mekit.online because virtually every image compression website on the modern web has become hostile to users: riddled with intrusive full-screen popups, mandatory subscriptions, artificial daily limits, watermarks on downloaded files, and sketchy server uploads.
              </p>
              <p>
                mekit.online takes a different approach:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>100% Free:</strong> No credits, no paid upgrades, no watermarks.</li>
                <li><strong>Privacy First:</strong> Your files never touch a server.</li>
                <li><strong>Smart Target File Size:</strong> Solves the real frustration of hitting exact KB limits for online forms.</li>
                <li><strong>Fast Batch Processing:</strong> Download multiple images individually or as a clean ZIP archive.</li>
              </ul>
            </div>
          )}

          {type === 'contact' && (
            <div>
              {contactSent ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">
                    Thank you for your feedback!
                  </h4>
                  <p className="text-xs text-neutral-500">
                    We appreciate your ideas and bug reports to make mekit.online even better.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSent(false);
                      onClose();
                    }}
                    className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p>
                    Have a feature suggestion, found an edge case with a specific image, or want to say hello? Drop us a note below.
                  </p>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700">
                      Your Email (Optional, for replies)
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700">
                      Message / Feedback
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or bug details..."
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-bold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Feedback</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
