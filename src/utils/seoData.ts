export interface PageSeoMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  h1: string;
  breadcrumbLabel: string;
  schema?: any;
}

export const CANONICAL_ORIGIN = 'https://mekit.online';

export const SEO_PAGES: Record<string, PageSeoMeta> = {
  '/': {
    path: '/',
    title: 'Mekit – Free Online Image Compressor & Resizer',
    description: 'Compress images to smaller file sizes, resize pixels, and convert supported image formats with Mekit. Free online tools with no account required.',
    canonical: `${CANONICAL_ORIGIN}/`,
    h1: 'Get Your Images to the Right Size.',
    breadcrumbLabel: 'Home'
  },
  '/compress-image': {
    path: '/compress-image',
    title: 'Free Image Compressor Online – Mekit',
    description: 'Compress JPG, PNG, and WebP images to exact KB limits online for free. Fast, in-browser compression to 20KB, 50KB, 100KB, and 200KB without watermarks.',
    canonical: `${CANONICAL_ORIGIN}/compress-image`,
    h1: 'Free Online Image Compressor',
    breadcrumbLabel: 'Image Compressor'
  },
  '/resize-image': {
    path: '/resize-image',
    title: 'Free Image Resizer Online – Mekit',
    description: 'Resize image dimensions in pixels or percentages online for free. Lock aspect ratio, crop-to-fit, and use social media presets without distortion.',
    canonical: `${CANONICAL_ORIGIN}/resize-image`,
    h1: 'Free Online Image Resizer',
    breadcrumbLabel: 'Image Resizer'
  },
  '/convert-image': {
    path: '/convert-image',
    title: 'Free Image Format Converter Online – Mekit',
    description: 'Convert images between JPG, PNG, and WebP formats online for free. Fast, local in-browser conversion with automatic transparency handling.',
    canonical: `${CANONICAL_ORIGIN}/convert-image`,
    h1: 'Free Image Format Converter',
    breadcrumbLabel: 'Format Converter'
  },
  '/batch-processing': {
    path: '/batch-processing',
    title: 'Free Bulk & Batch Image Compressor – Mekit',
    description: 'Compress, resize, and convert multiple images in bulk online. Download individual files or all images at once in a ZIP archive for free.',
    canonical: `${CANONICAL_ORIGIN}/batch-processing`,
    h1: 'Batch Image Processing Studio',
    breadcrumbLabel: 'Batch Studio'
  },
  '/tutorials': {
    path: '/tutorials',
    title: 'Image Compression & Resizing Tutorials – Mekit',
    description: 'Learn how to compress images to 100KB, resize without distortion, choose between JPG, PNG, and WebP, and optimize images for online forms.',
    canonical: `${CANONICAL_ORIGIN}/tutorials`,
    h1: 'Image Compression & Resizing Tutorials',
    breadcrumbLabel: 'Tutorials'
  },
  '/how-it-works': {
    path: '/how-it-works',
    title: 'How Mekit Works – Client-Side In-Browser Processing',
    description: 'Learn how Mekit processes images 100% locally in your browser using HTML5 Canvas and WebCodecs with zero server uploads and EXIF metadata stripping.',
    canonical: `${CANONICAL_ORIGIN}/how-it-works`,
    h1: 'How Mekit Works',
    breadcrumbLabel: 'How It Works'
  },
  '/faq': {
    path: '/faq',
    title: 'Frequently Asked Questions – Mekit',
    description: 'Find answers about image file size limits, PNG losslessness, JPEG transparency, mobile support, and in-browser privacy on Mekit.',
    canonical: `${CANONICAL_ORIGIN}/faq`,
    h1: 'Frequently Asked Questions',
    breadcrumbLabel: 'FAQ'
  },
  '/about': {
    path: '/about',
    title: 'About Mekit – Free Online Image Tools',
    description: 'Learn about Mekit, a privacy-first web utility built to compress and resize images without subscriptions, watermarks, or cloud uploads.',
    canonical: `${CANONICAL_ORIGIN}/about`,
    h1: 'About Mekit',
    breadcrumbLabel: 'About'
  },
  '/contact': {
    path: '/contact',
    title: 'Contact Mekit',
    description: 'Get in touch with the Mekit team for feedback, questions, bug reports, and feature suggestions.',
    canonical: `${CANONICAL_ORIGIN}/contact`,
    h1: 'Contact Mekit',
    breadcrumbLabel: 'Contact'
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy – Mekit',
    description: 'Read Mekit\'s privacy policy. All image processing runs strictly in your browser memory with zero server uploads and automatic metadata stripping.',
    canonical: `${CANONICAL_ORIGIN}/privacy`,
    h1: 'Privacy Policy & Data Security',
    breadcrumbLabel: 'Privacy Policy'
  },
  '/terms': {
    path: '/terms',
    title: 'Terms & Conditions – Mekit',
    description: 'Review the terms and conditions for using Mekit\'s free online image compression, resizing, and conversion tools.',
    canonical: `${CANONICAL_ORIGIN}/terms`,
    h1: 'Terms & Conditions',
    breadcrumbLabel: 'Terms & Conditions'
  },
  '/disclaimer': {
    path: '/disclaimer',
    title: 'Disclaimer – Mekit Online Image Tools',
    description: 'Review Mekit\'s official website and tools disclaimer regarding output variations, third-party portals, and independent utility status.',
    canonical: `${CANONICAL_ORIGIN}/disclaimer`,
    h1: 'Website & Tools Disclaimer',
    breadcrumbLabel: 'Disclaimer'
  }
};

export function getSeoMetaForPath(pathname: string): PageSeoMeta {
  // Normalize trailing slash (except for root '/')
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (SEO_PAGES[cleanPath]) {
    return SEO_PAGES[cleanPath];
  }

  // Common aliases
  if (cleanPath === '/compressor') return SEO_PAGES['/compress-image'];
  if (cleanPath === '/resizer') return SEO_PAGES['/resize-image'];
  if (cleanPath === '/converter') return SEO_PAGES['/convert-image'];
  if (cleanPath === '/batch') return SEO_PAGES['/batch-processing'];
  if (cleanPath === '/guides') return SEO_PAGES['/tutorials'];

  // Default / 404 fallback
  return {
    path: cleanPath,
    title: 'Page Not Found – Mekit',
    description: 'The requested page could not be found. Explore Mekit\'s free online image compressor, resizer, and conversion tools.',
    canonical: `${CANONICAL_ORIGIN}${cleanPath}`,
    h1: 'Page Not Found (404)',
    breadcrumbLabel: '404'
  };
}
