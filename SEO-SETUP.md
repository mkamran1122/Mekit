# SEO Setup and Technical Documentation for Mekit.online

This document details the complete Search Engine Optimization (SEO) setup, technical architecture, metadata catalog, sitemap, structured data schemas, and deployment instructions for **[mekit.online](https://mekit.online)**.

---

## 1. Core SEO Architecture & Canonical Strategy

### Domain & Protocol Standard
- **Preferred Canonical Origin:** `https://mekit.online`
- **Protocol:** Strict HTTPS
- **URL Path Standard:** Lowercase, hyphen-delimited, clean paths without trailing slashes (e.g. `https://mekit.online/compress-image`).
- **WWW / Apex Policy:** `mekit.online` is the canonical apex domain. If traffic arrives via `www.mekit.online` or HTTP, the hosting provider (e.g. Netlify, Cloudflare, Vercel) should 301-redirect to `https://mekit.online`.

---

## 2. Page Metadata Catalog

Every indexable page in **Mekit.online** has a distinct, human-readable title, keyword-rich meta description, matching OpenGraph / Twitter tags, and canonical reference:

| Route Path | Canonical URL | Title (`<title>`) | Meta Description |
| :--- | :--- | :--- | :--- |
| `/` | `https://mekit.online` | Mekit – Free Online Image Compressor & Resizer | Compress images to smaller file sizes, resize pixels, and convert supported image formats with Mekit. Free online tools with no account required. |
| `/compress-image` | `https://mekit.online/compress-image` | Free Image Compressor Online – Mekit | Compress JPG, PNG, and WebP images to exact target limits (20KB, 50KB, 100KB, 200KB) with zero quality loss and no server uploads. |
| `/resize-image` | `https://mekit.online/resize-image` | Free Image Resizer Online – Mekit | Resize image dimensions by width, height, or percentage while locking aspect ratio. Fast, browser-based, and completely free. |
| `/convert-image` | `https://mekit.online/convert-image` | Free Image Converter Online – Mekit | Convert images between JPG, PNG, and WebP formats instantly in your browser with transparency controls and quality tuning. |
| `/batch-processing` | `https://mekit.online/batch-processing` | Batch Image Compressor & Resizer – Mekit | Process dozens of images simultaneously in your browser. Apply custom presets, convert formats, and download in a clean ZIP archive. |
| `/tutorials` | `https://mekit.online/tutorials` | Image Compression & Resizing Tutorials – Mekit | Step-by-step guides for compressing images to strict KB limits, resizing photos for online forms, converting formats, and batch processing. |
| `/how-it-works` | `https://mekit.online/how-it-works` | How Mekit Works – Client-Side Privacy Architecture | Learn how Mekit compresses and resizes photos directly inside your web browser using HTML5 Canvas with zero cloud uploads. |
| `/faq` | `https://mekit.online/faq` | Frequently Asked Questions – Mekit Image Tools | Clear answers regarding target file size limits, lossless PNG compression, transparent JPEG conversion, EXIF stripping, and mobile compatibility. |
| `/about` | `https://mekit.online/about` | About Mekit – Free Online Image Tools | Discover Mekit's mission to provide honest, fast, privacy-first image compression and resizing tools without watermarks, subscriptions, or paywalls. |
| `/contact` | `https://mekit.online/contact` | Contact Mekit – Feedback & Support | Send feedback, report bugs, or request new features for Mekit's online image tools. |
| `/privacy` | `https://mekit.online/privacy` | Privacy Policy – Mekit In-Browser Image Processing | Read our privacy guarantee: all photo processing takes place locally on your computer. Zero server uploads, zero cookies, zero tracking. |
| `/terms` | `https://mekit.online/terms` | Terms of Service – Mekit Online Tools | Terms and acceptable use guidelines for Mekit's free browser-based image utility. |
| `/disclaimer` | `https://mekit.online/disclaimer` | Disclaimer – Mekit Online Image Tools | Official website and tools disclaimer regarding output variations, third-party portals, and independent utility status. |

---

## 3. Robots.txt Configuration

The file is located at `public/robots.txt` and served at root `https://mekit.online/robots.txt`:

```robots.txt
# robots.txt for mekit.online
User-agent: *
Allow: /

# XML Sitemap index location
Sitemap: https://mekit.online/sitemap.xml
```

---

## 4. XML Sitemap Specification

The XML sitemap is located at `public/sitemap.xml` and served at `https://mekit.online/sitemap.xml`. It complies with standard Sitemaps Protocol 0.9:

- Covers all 13 canonical pages.
- Priority `1.0` for homepage, `0.9` for primary tools (`/compress-image`, `/resize-image`), `0.8` for secondary tools (`/convert-image`, `/batch-processing`, `/tutorials`), `0.7` for architectural and help pages (`/how-it-works`, `/faq`), and `0.5` for institutional/legal pages (`/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`).
- Updated daily/weekly with standard change frequencies.

---

## 5. Structured Data (Schema.org JSON-LD)

Implemented directly in `src/components/SEOHead.tsx` and dynamically generated on every route:

1. **WebSite Schema (`@type: "WebSite"`):**
   - Declares site name, URL, description, and publisher metadata.
2. **WebApplication Schema (`@type: "WebApplication"`):**
   - Declares Mekit as a browser-based utility operating in the `MultimediaApplication` category.
   - States browser requirements, feature list, free pricing tier (`price: "0"`), and client-side operating environment.
3. **BreadcrumbList Schema (`@type: "BreadcrumbList"`):**
   - Provides search engines with structured navigation trails (`Home > Tool / Page`).
4. **FAQPage Schema (`@type: "FAQPage"`):**
   - Automatically injected on `/faq`, `/tutorials`, `/compress-image`, and `/resize-image` with accurate Q&A pairs to enable Google rich snippet search result cards.

---

## 6. Single Page Application (SPA) Routing & Netlify Setup

Because Mekit is built on Vite + React as a high-performance SPA, server redirects must serve `/index.html` for any client routes so that deep links don't return 404 from the static file host.

### Netlify Configuration (`public/_redirects`)
The static redirects file is located in `public/_redirects`:

```
# Direct static asset passthroughs
/robots.txt  /robots.txt  200
/sitemap.xml /sitemap.xml 200

# Client-side SPA routing fallback
/*  /index.html  200
```

### Domain Redirection on Netlify
In the Netlify Dashboard:
1. Navigate to **Site configuration** → **Domain management**.
2. Add custom domain `mekit.online`.
3. Set `mekit.online` as the **Primary domain**.
4. Netlify automatically configures `www.mekit.online` to redirect with a `301 Moved Permanently` to `https://mekit.online`.

---

## 7. Google Search Console Setup & Verification

Follow these steps to verify site ownership and submit your sitemap:

### Step 1: Add Property in Search Console
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Choose **URL prefix** and enter: `https://mekit.online`.

### Step 2: Verification Methods

#### Method A: HTML Tag (Recommended)
1. In Search Console, select **HTML tag** verification.
2. Copy the `<meta name="google-site-verification" content="YOUR_CODE" />`.
3. Paste the verification tag inside the `<head>` of `/index.html`.
4. Deploy the site, return to Search Console, and click **Verify**.

#### Method B: DNS TXT Record
1. Add a TXT record to your DNS provider (Namecheap, Cloudflare, GoDaddy, Google Domains, etc.):
   - **Host:** `@` (or leave blank)
   - **Type:** `TXT`
   - **Value:** `google-site-verification=YOUR_UNIQUE_CODE`
2. Wait a few minutes for DNS propagation, then click **Verify**.

### Step 3: Submit the Sitemap
1. In Google Search Console, click **Sitemaps** in the left sidebar.
2. In the "Add a new sitemap" input box, enter: `sitemap.xml`.
3. Click **Submit**.
4. Confirm that the status reports **Success** and that all 12 URLs are discovered.

---

## 8. Verifying Your SEO Implementation

You can verify your setup using standard diagnostic tools:

1. **Robots Test:**
   - Visit `https://mekit.online/robots.txt` in a browser. Confirm that `Sitemap: https://mekit.online/sitemap.xml` is present.
2. **Sitemap Test:**
   - Visit `https://mekit.online/sitemap.xml`. Verify that the XML tree renders cleanly without syntax errors.
3. **Canonical & Meta Tag Inspection:**
   - In Chrome, right-click on any page and choose **View Page Source** or open DevTools.
   - Inspect `<link rel="canonical" href="...">` and `<title>`.
4. **Structured Data Rich Results Test:**
   - Test any URL using Google's [Rich Results Test](https://search.google.com/test/rich-results) to validate JSON-LD schemas.
5. **Lighthouse Audit:**
   - Open Chrome DevTools → **Lighthouse** tab → Run **SEO & Accessibility** audit. Expected score: 100/100.
