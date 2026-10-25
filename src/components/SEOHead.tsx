import React, { useEffect } from 'react';
import { getSeoMetaForPath, CANONICAL_ORIGIN } from '../utils/seoData';

interface SEOHeadProps {
  path: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ path }) => {
  const meta = getSeoMetaForPath(path);

  useEffect(() => {
    // 1. Update Title
    document.title = meta.title;

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          tag.name = selector.slice(11, -2);
        } else if (selector.startsWith('meta[property=')) {
          tag.setAttribute('property', selector.slice(15, -2));
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
    };

    // Helper for link tags (canonical)
    const setLinkTag = (rel: string, href: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!tag) {
        tag = document.createElement('link');
        tag.rel = rel;
        document.head.appendChild(tag);
      }
      tag.href = href;
    };

    // 2. Meta description
    setMetaTag('meta[name="description"]', 'content', meta.description);

    // 3. Canonical URL
    setLinkTag('canonical', meta.canonical);

    // 4. OpenGraph tags
    setMetaTag('meta[property="og:title"]', 'content', meta.title);
    setMetaTag('meta[property="og:description"]', 'content', meta.description);
    setMetaTag('meta[property="og:url"]', 'content', meta.canonical);

    // 5. Twitter Card tags
    setMetaTag('meta[name="twitter:title"]', 'content', meta.title);
    setMetaTag('meta[name="twitter:description"]', 'content', meta.description);

    // 6. Robots indexability
    const is404 = meta.breadcrumbLabel === '404';
    setMetaTag('meta[name="robots"]', 'content', is404 ? 'noindex, follow' : 'index, follow');

    // 7. Dynamic JSON-LD Structured Data
    let schemaScript = document.getElementById('dynamic-seo-json') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'dynamic-seo-json';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemas: any[] = [];

    // WebSite & WebApplication on home & tools
    if (path === '/' || path.includes('compress') || path.includes('resize') || path.includes('convert') || path.includes('batch')) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: meta.title,
        url: meta.canonical,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        description: meta.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      });
    }

    // BreadcrumbList for subpages
    if (path !== '/' && !is404) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${CANONICAL_ORIGIN}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: meta.breadcrumbLabel,
            item: meta.canonical
          }
        ]
      });
    }

    schemaScript.textContent = JSON.stringify(schemas);
  }, [meta, path]);

  return null;
};
