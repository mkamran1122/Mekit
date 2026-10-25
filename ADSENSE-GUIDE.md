# Google AdSense Readiness & Integration Guide for Mekit.online

This guide explains how **[mekit.online](https://mekit.online)** was prepared for Google AdSense compliance and provides exact step-by-step instructions for submitting your website, adding your code snippet, and activating ad placements upon approval.

---

## 1. AdSense Readiness Audit & Implemented Enhancements

To meet Google AdSense's strict quality and policy requirements, the codebase has been outfitted with:

1. **Mandatory Legal & Trust Pages:**
   - **About Us (`/about`):** Authentic description of why Mekit was built, its client-side processing architecture, mission, and user principles without fake stats.
   - **Contact Us (`/contact`):** Fully working contact submission form + direct email channel placeholder (`support@mekit.online`), response expectations (24–48 hours), and troubleshooting guidelines.
   - **Privacy Policy (`/privacy`):** Fully compliant with Google AdSense requirements. Discloses:
     - Verified 100% client-side in-browser processing (zero server file collection).
     - Automatic EXIF geolocation and metadata stripping.
     - Third-party advertising disclosures: Google's use of cookies, DoubleClick DART cookies, personalized ad serving, and user opt-out links ([Google Ads Settings](https://www.google.com/settings/ads) and [aboutads.info](https://www.aboutads.info)).
     - Local storage usage for interface preferences.
   - **Terms of Service (`/terms`):** Clear terms on intellectual property (user retains 100% image ownership), acceptable use, and disclaimer of warranties.
   - **Disclaimer (`/disclaimer`):** Explains target size tolerances due to browser codec implementations, user responsibility for third-party portal criteria (e.g. government, visa, university portals), non-affiliation with third-party institutions, and advertising disclaimer.

2. **High-Value Original Content:**
   - **Homepage Overview (`/`):** Comprehensive breakdown of the 4 core tools (Smart Compressor, Exact Resizer, Format Converter, Batch Studio), a 3-step workflow guide, and a format selection matrix.
   - **Step-by-Step Tutorials (`/tutorials`):** 7 comprehensive, original guides covering start-to-finish workflows, target KB compression, aspect-ratio preservation, bulk ZIP export, format comparison (JPG vs PNG vs WebP), troubleshooting, and in-browser security.
   - **Technical Transparency (`/how-it-works` & `/faq`):** Detailed architectural explanations of HTML5 Canvas, WebCodecs, and binary search quality convergence.

3. **Consent & Privacy Architecture:**
   - **Cookie Consent Banner (`CookieConsent.tsx`):** Informs users about local storage and advertising cookies with "Accept All", "Essential Only", and direct link to `/privacy`.

4. **Policy-Compliant Ad Architecture:**
   - **Disabled by Default:** `ADS_CONFIG.ADS_ENABLED = false` in `src/config/ads.ts`. No empty ad boxes or unauthorized requests occur during review.
   - **Zero Fake Ads:** Does not display placeholder graphics that imitate Google advertisements.
   - **Accidental Click Prevention:** Ad slots are situated safely down the page, separated from upload dropzones, file pickers, and download buttons.
   - **Excluded from Legal Pages:** Advertisements are strictly excluded from `/privacy`, `/terms`, `/disclaimer`, `/contact`, `/about`, and `/404`.
   - **Cumulative Layout Shift (CLS) Protection:** Containers reserve minimum vertical height when active to avoid sudden page jumps.

---

## 2. How to Submit Your Site for Google AdSense Review

### Step 1: Confirm Live Hosting on Custom Domain
Ensure your site is deployed to your custom domain: `https://mekit.online`.

### Step 2: Sign Up for Google AdSense
1. Visit [https://www.google.com/adsense](https://www.google.com/adsense) and sign in with your Google account.
2. Click **Sites** → **Add site**.
3. Enter your domain: `https://mekit.online`.

### Step 3: Add the AdSense Verification Script
1. Open `/index.html` in your project.
2. Locate the commented AdSense section near line 60:
   ```html
   <!-- 
     GOOGLE ADSENSE INTEGRATION (UNCOMMENT AFTER ADSENSE APPROVAL):
     1. Replace ca-pub-XXXXXXXXXXXXXXXX with your actual Google AdSense Publisher ID.
     2. In src/config/ads.ts, set ADS_CONFIG.ADS_ENABLED = true and enter your publisher/slot IDs.
     
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   -->
   ```
3. Uncomment the `<script>` tag and replace `ca-pub-XXXXXXXXXXXXXXXX` with your unique Publisher ID provided in your AdSense dashboard.
4. Save `/index.html`, rebuild (`npm run build`), and deploy to Netlify.

### Step 4: Request Site Review
1. Return to your Google AdSense dashboard.
2. Check the box confirming you have added the script to your site.
3. Click **Request review**.
4. Google will review the site. The review typically takes from a few days up to 2 weeks.

---

## 3. How to Enable Ads After Approval

Once you receive an email from Google confirming that your site is approved:

### Step 1: Create Ad Units in AdSense Dashboard
1. Go to your AdSense Dashboard → **Ads** → **By ad unit**.
2. Create **Display ad** units (set to **Responsive**):
   - Unit 1: `Mekit Homepage Mid` (copy the data-ad-slot number)
   - Unit 2: `Mekit Homepage Bottom` (copy the data-ad-slot number)
   - Unit 3: `Mekit Tool Bottom` (copy the data-ad-slot number)
   - Unit 4: `Mekit Tutorials Content` (copy the data-ad-slot number)
   - Unit 5: `Mekit How It Works Bottom` (copy the data-ad-slot number)
   - Unit 6: `Mekit FAQ Bottom` (copy the data-ad-slot number)

### Step 2: Configure `src/config/ads.ts`
Open `/src/config/ads.ts` and update the configuration:

```typescript
export const ADS_CONFIG = {
  // 1. Turn on ads
  ADS_ENABLED: true,

  // 2. Paste your real Publisher ID
  PUBLISHER_ID: 'ca-pub-XXXXXXXXXXXXXXXX',

  // 3. Paste the slot IDs created in step 1
  SLOTS: {
    HOMEPAGE_MID: '1234567890',
    HOMEPAGE_BOTTOM: '2345678901',
    TOOL_INFO_BOTTOM: '3456789012',
    TUTORIALS_IN_CONTENT: '4567890123',
    HOW_IT_WORKS_BOTTOM: '5678901234',
    FAQ_BOTTOM: '6789012345',
  },

  // Leave false for production
  SHOW_TEST_OUTLINE: false,
};
```

### Step 3: Build & Deploy
Run:
```bash
npm run build
```
Deploy the generated `dist/` directory to Netlify. AdSense will begin serving live advertisements in the configured locations.

---

## 4. Ad Locations & Policy Compliance Rules

All ad placements in Mekit use the isolated `<AdSlot />` component (`src/components/ads/AdSlot.tsx`):

| Page / Route | Ad Location | Safety Distance & Policy Rationale |
| :--- | :--- | :--- |
| **Homepage (`/`)** | Mid-page (below tool guides) | Located 800px+ below upload/download buttons; clearly labeled "Advertisement". |
| **Homepage (`/`)** | Page Bottom (above footer) | Separated from all interactive controls; zero accidental clicks. |
| **Tools (`/compress-image`, etc.)** | Tool Guide Bottom | Positioned at the very end of tool specifications and FAQ text, far from image upload dropzones. |
| **Tutorials (`/tutorials`)** | In-Content Footer | Positioned at the conclusion of each tutorial article. |
| **How It Works (`/how-it-works`)** | Section Bottom | Placed after architectural explanation cards. |
| **FAQ (`/faq`)** | Accordion Bottom | Placed below all collapsible question panels. |
| **Legal Pages (`/privacy`, `/terms`, etc.)** | **NONE** | No ads are rendered on legal or contact pages to maintain high institutional trust. |

---

## 5. Important AdSense Policies to Maintain Compliance

1. **Never Click Your Own Ads:**
   Do not click live ads on your own website, even to test them. Google's invalid traffic algorithms detect and penalize publisher clicks immediately.
2. **Never Encourage Clicks:**
   Do not write phrases like "Support us by clicking ads" or "Check out our sponsors". Google policies only permit standard labels like "Advertisement" or "Sponsored Links" (which `AdSlot` automatically provides).
3. **Keep Tool Usability Primary:**
   Ensure image compression, resizing, and downloads remain instant, unobstructed, and intuitive for users on all screen sizes.
4. **ads.txt Requirement:**
   Once approved, Google AdSense will provide an `ads.txt` file (e.g. `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`).
   Place this file into `/public/ads.txt` so it is accessible at `https://mekit.online/ads.txt`.
