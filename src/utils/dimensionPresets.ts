import { DimensionPreset } from '../types';

export const DIMENSION_PRESETS: DimensionPreset[] = [
  // Social Media Presets
  {
    category: 'Social Media',
    label: 'Instagram Square (1:1)',
    width: 1080,
    height: 1080,
    description: 'Standard Instagram feed square post'
  },
  {
    category: 'Social Media',
    label: 'Instagram Portrait (4:5)',
    width: 1080,
    height: 1350,
    description: 'Optimal tall feed post for mobile screens'
  },
  {
    category: 'Social Media',
    label: 'Instagram Story / Reel (9:16)',
    width: 1080,
    height: 1920,
    description: 'Full vertical screen for stories and short videos'
  },
  {
    category: 'Social Media',
    label: 'YouTube Thumbnail (16:9)',
    width: 1280,
    height: 720,
    description: 'Standard 720p HD video thumbnail'
  },
  {
    category: 'Social Media',
    label: 'Twitter / X Header',
    width: 1500,
    height: 500,
    description: 'Standard 3:1 aspect ratio profile banner'
  },
  {
    category: 'Social Media',
    label: 'LinkedIn Profile Banner',
    width: 1584,
    height: 396,
    description: '4:1 wide background header for personal profiles'
  },
  {
    category: 'Social Media',
    label: 'Facebook Page Cover',
    width: 820,
    height: 312,
    description: 'Standard desktop and mobile cover banner'
  },

  // Web & Forms
  {
    category: 'Web & Documents',
    label: 'Passport / ID Photo (1:1)',
    width: 600,
    height: 600,
    description: '2×2 inch digital passport photo standard (300 DPI)'
  },
  {
    category: 'Web & Documents',
    label: 'Full HD Web Banner (16:9)',
    width: 1920,
    height: 1080,
    description: 'Full screen desktop hero banner'
  },
  {
    category: 'Web & Documents',
    label: 'Blog OpenGraph / Article (1.91:1)',
    width: 1200,
    height: 630,
    description: 'Standard social share card (og:image)'
  },
  {
    category: 'Web & Documents',
    label: 'Email Newsletter Header',
    width: 600,
    height: 200,
    description: 'Compatible 600px email template width'
  },
  {
    category: 'Web & Documents',
    label: 'Compact Web Thumbnail',
    width: 400,
    height: 400,
    description: 'Card and grid thumbnail square'
  }
];
