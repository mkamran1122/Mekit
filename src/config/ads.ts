/**
 * Google AdSense Configuration for Mekit.online
 *
 * ============================================================================
 * GOOGLE ADSENSE INTEGRATION GUIDE (AFTER ACCOUNT APPROVAL):
 * ============================================================================
 * 
 * 1. Submit https://mekit.online to Google AdSense for site review.
 * 2. In /index.html, uncomment or add the official Google AdSense script tag:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 *    (Replace ca-pub-XXXXXXXXXXXXXXXX with your actual Publisher ID).
 * 3. Once approved by Google:
 *    - Change `ADS_ENABLED` below from false to true.
 *    - Paste your Publisher ID into `PUBLISHER_ID`.
 *    - In your Google AdSense Dashboard -> Ads -> By ad unit:
 *      Create your responsive ad units and paste each unit's slot number into `SLOTS`.
 * 4. Build and deploy: `npm run build`.
 *
 * NOTE: When ADS_ENABLED is false, no ads are requested or rendered, preventing
 * policy violations, unwanted network requests, and layout shift.
 */

export interface AdSlotsConfig {
  /** Responsive banner placed below the homepage educational content */
  HOMEPAGE_MID: string;
  /** Responsive banner placed at the bottom of the homepage above the footer */
  HOMEPAGE_BOTTOM: string;
  /** Placed at the bottom of specific tool specification pages (far from buttons) */
  TOOL_INFO_BOTTOM: string;
  /** Clean horizontal banner placed below tutorial articles */
  TUTORIALS_IN_CONTENT: string;
  /** Placed at the bottom of the How It Works architecture page */
  HOW_IT_WORKS_BOTTOM: string;
  /** Placed at the bottom of the FAQ accordion section */
  FAQ_BOTTOM: string;
}

export const ADS_CONFIG = {
  /**
   * Global toggle. Keep FALSE until your site is approved by Google AdSense
   * and you have added your actual publisher script to /index.html.
   */
  ADS_ENABLED: false,

  /**
   * Your Google AdSense Publisher ID.
   * Example: 'ca-pub-1234567890123456'
   * Keep empty until approved! DO NOT use fake or test IDs.
   */
  PUBLISHER_ID: '',

  /**
   * Specific Ad Unit Slot IDs from your AdSense dashboard.
   * Example: '1234567890'
   */
  SLOTS: {
    HOMEPAGE_MID: '',
    HOMEPAGE_BOTTOM: '',
    TOOL_INFO_BOTTOM: '',
    TUTORIALS_IN_CONTENT: '',
    HOW_IT_WORKS_BOTTOM: '',
    FAQ_BOTTOM: '',
  } as AdSlotsConfig,

  /**
   * Developer preview mode:
   * When true and ADS_ENABLED is false, renders a subtle, clean outline
   * with the slot name to help verify layout positions in local testing.
   * Defaults to false so production is pristine.
   */
  SHOW_TEST_OUTLINE: false,
};
