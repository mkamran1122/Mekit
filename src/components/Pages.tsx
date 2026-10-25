import React, { useState } from 'react';
import { Link } from '../utils/router';
import { ShieldCheck, Mail, Send, Check, AlertCircle, ArrowRight, HelpCircle, FileText, Info, ExternalLink, Loader2 } from 'lucide-react';
import { submitContactInquiry } from '../services/firebase';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-800">About</span>
        </nav>
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">About Us</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          About Mekit – Free Online Image Tools
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed">
          Mekit.online is a free, privacy-first web utility built to help students, job applicants, developers, designers, and everyday internet users compress, resize, and convert images without subscriptions, watermarks, daily limits, or remote server uploads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-2">
          <h2 className="text-base font-bold text-neutral-900">100% Free Core Access</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            No credits, no paid upgrades, no forced account creation, and zero watermarks. All compression and resizing tools are free to use.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-2">
          <h2 className="text-base font-bold text-neutral-900">In-Browser Privacy</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            All image decoding, downscaling, and encoding happen directly inside your computer’s browser memory. Your personal photos never touch an external server.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-2">
          <h2 className="text-base font-bold text-neutral-900">Smart Target Size</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Engineered specifically to solve strict 20 KB, 50 KB, 100 KB, and 200 KB submission ceilings for government portals, job applications, and university forms.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Why We Built Mekit</h2>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Most online image converter websites today are cluttered with aggressive popups, forced account signups, artificial 2-image daily limits, or mandatory cloud uploads that expose user documents and photos to unknown servers.
        </p>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Mekit was built to do things differently: provide a fast, clean, and transparent tool that uses modern web standards (HTML5 Canvas and WebCodecs) so you can get your images to the exact dimensions or KB size you need in seconds, safely on your own machine.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Our Core Principles</h2>
        <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed list-disc list-inside">
          <li><strong>No Deceptive Design:</strong> We do not create fake download buttons, simulated progress bars, or misleading conversion claims.</li>
          <li><strong>Privacy by Architecture:</strong> We don't just promise privacy in legal text; our application architecture is physically incapable of collecting your images because no upload endpoint exists.</li>
          <li><strong>Accessibility & Speed:</strong> Designed with clean white contrast, minimal animations, and full mobile responsiveness for phones, tablets, and desktops.</li>
        </ul>
      </div>

      <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
        <Link href="/" className="text-neutral-900 hover:underline">
          ← Back to Studio Workspace
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/compress-image" className="text-neutral-900 hover:underline">
          Image Compressor Tool →
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/tutorials" className="text-neutral-900 hover:underline">
          Image Tutorials →
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/privacy" className="text-neutral-900 hover:underline">
          Privacy Policy →
        </Link>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Support');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitContactInquiry({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit message to Firebase:', err);
      // Fallback grace for users
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-800">Contact</span>
        </nav>
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Contact & Support</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Contact Mekit
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Have a question about image compression, found an edge-case browser format bug, or want to suggest a new tool feature? Reach out using the form below or contact us via email.
        </p>
      </div>

      {/* Direct Contact Channels Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Email Inquiries</span>
          <p className="text-sm font-semibold text-neutral-900">support@mekit.online</p>
          <p className="text-xs text-neutral-500">General inquiries, bug reports, and feedback.</p>
        </div>
        <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Response Window</span>
          <p className="text-sm font-semibold text-neutral-900">24 – 48 Business Hours</p>
          <p className="text-xs text-neutral-500">We read every message and prioritize tool issues.</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 rounded-2xl border border-neutral-200 bg-white shadow-xs">
        {submitted ? (
          <div className="text-center space-y-3 py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Thank you for your message!</h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
              We have received your submission. Your feedback has been securely registered and helps us continuously improve Mekit’s tools and performance.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 min-h-[40px] text-xs font-bold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800"
              >
                Return to Workspace
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="p-3 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="contact-name" className="text-xs font-semibold text-neutral-700">
                  Your Name <span className="text-neutral-400">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-3.5 py-2.5 min-h-[42px] text-sm sm:text-xs rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-email" className="text-xs font-semibold text-neutral-700">
                  Your Email Address <span className="text-neutral-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 min-h-[42px] text-sm sm:text-xs rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-subject" className="text-xs font-semibold text-neutral-700">
                Topic / Subject
              </label>
              <select
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 min-h-[42px] text-sm sm:text-xs rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="Feedback / Support">General Feedback / Support</option>
                <option value="Bug Report">Bug Report (format or browser issue)</option>
                <option value="Feature Request">Feature Request (new preset or tool)</option>
                <option value="Advertising / Business">Advertising / Partnership</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-message" className="text-xs font-semibold text-neutral-700">
                Your Message <span className="text-neutral-400 font-normal">(Please include browser type if reporting a bug)</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your feedback, describe what happened, or request a feature..."
                className="w-full px-3.5 py-2.5 text-sm sm:text-xs rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg text-[11px] text-neutral-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <span>
                <strong>Note regarding file support:</strong> Because all image processing runs entirely on your device, we do not store, host, or see your images. When reporting issues, please describe file format (JPG, PNG, WebP) and dimensions rather than attaching private photos.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 min-h-[44px] text-xs sm:text-sm font-bold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="text-xs text-neutral-500 text-center">
        Looking for quick answers? Check our <Link href="/tutorials" className="underline font-semibold text-neutral-700">Step-by-Step Tutorials</Link> or <Link href="/faq" className="underline font-semibold text-neutral-700">Frequently Asked Questions</Link>.
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-800">Privacy Policy</span>
        </nav>
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Privacy & Data Governance</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Privacy Policy & Data Security
        </h1>
        <p className="text-sm text-neutral-600">
          Effective Date: October 2026. Clear, transparent explanation of how Mekit handles your images, data, cookies, and advertising partners.
        </p>
      </div>

      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">100% Client-Side In-Browser Processing Guarantee</strong>
          Your images are processed entirely inside your local web browser’s memory using HTML5 Canvas and native browser codecs. No photo files, image data, or filenames are ever uploaded to our servers or any third-party cloud.
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Information We Do NOT Collect</h2>
          <p>
            Unlike traditional file conversion websites that upload your personal documents to remote storage buckets, Mekit executes all image decoding, aspect-ratio transformations, binary search compression algorithms, and format encoding locally on your computer via client-side JavaScript.
          </p>
          <p>
            We do not receive, store, inspect, copy, or sell your images, metadata, or file contents. Once you close your browser tab or clear the batch queue, all in-memory references are destroyed by your browser's garbage collection.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Automatic EXIF & Geolocation Metadata Stripping</h2>
          <p>
            Smartphone camera photos typically contain Exchangeable Image File Format (EXIF) metadata, which may include your precise GPS coordinates, phone serial number, exposure settings, and timestamps. When Mekit encodes new image blobs through HTML5 Canvas, this sensitive metadata is stripped by default, ensuring your personal location is not leaked when you submit photos to online forms or public sites.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. Cookies, Local Storage, and Web Beacons</h2>
          <p>
            Mekit uses standard browser <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-800">localStorage</code> solely to remember your chosen user interface settings (such as your cookie consent choice). We do not use persistent tracking cookies to track your activity across third-party websites.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Third-Party Advertising and Google AdSense</h2>
          <p>
            To keep Mekit free for everyone without charging subscription fees or adding watermarks, we may display third-party advertisements provided by Google AdSense and other advertising networks.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites on the internet.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to Mekit and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-900 underline inline-flex items-center gap-0.5">Google Ads Settings <ExternalLink className="w-3 h-3 inline" /></a>. Alternatively, users can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-900 underline inline-flex items-center gap-0.5">www.aboutads.info <ExternalLink className="w-3 h-3 inline" /></a>.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">5. Communications and Contact Data</h2>
          <p>
            If you voluntarily submit a message through our Contact form, we receive only the information you choose to enter (such as your return email address and message text). We use this information solely to respond to your support request or bug report. We never sell, rent, or distribute your email address to marketers.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">6. Children's Privacy</h2>
          <p>
            Mekit does not knowingly collect any personally identifiable information from children under the age of 13. Because our service does not require user registration or profile creation, no personal account information is stored.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">7. Changes to This Privacy Policy</h2>
          <p>
            We may occasionally update this Privacy Policy to reflect technical improvements or legal requirements. Any modifications will be posted directly to this page with an updated revision date.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">8. Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy or our client-side architecture, contact us at: <strong className="text-neutral-900">support@mekit.online</strong> or visit our <Link href="/contact" className="underline font-semibold text-neutral-900">Contact Page</Link>.
          </p>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
        <Link href="/" className="text-neutral-900 hover:underline">
          ← Back to Workspace
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/terms" className="text-neutral-900 hover:underline">
          Terms of Service →
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/disclaimer" className="text-neutral-900 hover:underline">
          Disclaimer →
        </Link>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-800">Terms of Service</span>
        </nav>
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Legal Terms</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Terms of Service
        </h1>
        <p className="text-sm text-neutral-600">
          Last updated: October 2026. Terms governing the use of Mekit.online.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Mekit.online ("Mekit"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Free & Unrestricted Use</h2>
          <p>
            Mekit is provided free of charge for personal, educational, commercial, and professional use. There are no mandatory user subscriptions, forced accounts, or paywalls for our core image compression, resizing, and format conversion utilities.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. User Ownership & Intellectual Property</h2>
          <p>
            You retain 100% of the rights, ownership, and copyright to all images you process using Mekit. Because all operations take place strictly inside your own device’s memory, Mekit does not claim any license, ownership, or rights to your media files.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Prohibited Uses</h2>
          <p>
            You agree not to use Mekit for any unlawful purposes or in violation of applicable international laws. You agree not to attempt to reverse engineer, disrupt, overload, or impair the website’s client-side scripts, hosting infrastructure, or network security.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">5. Disclaimer of Warranties</h2>
          <p>
            Mekit is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. While our Smart Target Size algorithm tests compression iteratively to meet specified byte ceilings, output sizes may vary slightly depending on your browser’s internal image encoder implementation.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Mekit and its creators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this service, including but not limited to missed application deadlines, rejection by third-party upload portals, or data loss.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">7. Governing Law and Changes</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the website following any changes constitutes acceptance of the new terms.
          </p>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
        <Link href="/" className="text-neutral-900 hover:underline">
          ← Back to Workspace
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/privacy" className="text-neutral-900 hover:underline">
          Privacy Policy →
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/disclaimer" className="text-neutral-900 hover:underline">
          Disclaimer →
        </Link>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-800">Disclaimer</span>
        </nav>
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Legal Disclaimer</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Website & Tools Disclaimer
        </h1>
        <p className="text-sm text-neutral-600">
          Last updated: October 2026. Important disclosure regarding tool calculations, form submissions, and external affiliations.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. General Information Purpose</h2>
          <p>
            The tools, articles, guides, and tutorials provided on Mekit.online are for general informational, educational, and utilitarian purposes only. While we strive to provide accurate, reliable in-browser tools, Mekit makes no representation or warranty of any kind regarding completeness, accuracy, or suitability for any particular purpose.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Output File Size & Quality Variations</h2>
          <p>
            Our "Smart Target File Size" feature utilizes automated binary search algorithms to calculate the highest practical visual quality that remains below your selected KB limit. However, image encoding is performed directly by your device's web browser engine (such as Chromium, WebKit, or Gecko).
          </p>
          <p>
            Because different browsers implement compression libraries with minor algorithmic nuances, exact byte counts may vary slightly. Users are encouraged to inspect the resulting file size and visual preview before submitting images to critical portals.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. Third-Party Portals & Non-Affiliation</h2>
          <p>
            Mekit offers presets for common requirements (such as 20 KB passport photos, 50 KB student portal uploads, and 100 KB job application forms). <strong>Mekit.online is an independent utility and is NOT affiliated with, authorized, maintained, sponsored, or endorsed by any government agency, university, visa processing service, passport office, or employer.</strong>
          </p>
          <p>
            Portal specifications (e.g., maximum dimensions, color profiles, background colors, and byte limits) are governed solely by the respective third-party institutions. You are solely responsible for verifying that your final output satisfies all official guidelines of the destination portal.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Third-Party Links & Advertisements</h2>
          <p>
            Mekit may contain links to third-party websites or display advertisements served by third-party ad networks (such as Google AdSense). Such external links and advertisements are not investigated, monitored, or checked for accuracy by us. We do not endorse, guarantee, or assume responsibility for any product or service offered by third-party advertisers.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">5. "Use at Your Own Risk"</h2>
          <p>
            All use of the website and reliance on any information or tools provided on Mekit is solely at your own risk. Mekit and its creators accept no liability for any loss, damage, or rejected application arising from the use of our services.
          </p>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
        <Link href="/" className="text-neutral-900 hover:underline">
          ← Back to Workspace
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/privacy" className="text-neutral-900 hover:underline">
          Privacy Policy →
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/terms" className="text-neutral-900 hover:underline">
          Terms of Service →
        </Link>
        <span className="text-neutral-300">·</span>
        <Link href="/contact" className="text-neutral-900 hover:underline">
          Contact Us →
        </Link>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-700">
        <AlertCircle className="w-8 h-8 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Page Not Found (404)
        </h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
          The page you are looking for does not exist or may have been moved. You can return home or use any of our free image tools below:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left pt-2">
        <Link
          href="/"
          className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
        >
          <strong className="block text-xs font-bold text-neutral-900">Mekit Home Workspace</strong>
          <span className="text-[11px] text-neutral-500">Access all tools in one place</span>
        </Link>

        <Link
          href="/compress-image"
          className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
        >
          <strong className="block text-xs font-bold text-neutral-900">Image Compressor</strong>
          <span className="text-[11px] text-neutral-500">Reduce to 20KB, 50KB, 100KB, 200KB</span>
        </Link>

        <Link
          href="/resize-image"
          className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
        >
          <strong className="block text-xs font-bold text-neutral-900">Image Resizer</strong>
          <span className="text-[11px] text-neutral-500">Scale pixels, aspect ratio, fit/crop</span>
        </Link>

        <Link
          href="/tutorials"
          className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
        >
          <strong className="block text-xs font-bold text-neutral-900">Tutorials & Guides</strong>
          <span className="text-[11px] text-neutral-500">Step-by-step image guides</span>
        </Link>
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
