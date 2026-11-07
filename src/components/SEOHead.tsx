import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

interface SEOHeadProps {
  pageKey?: string;
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  jsonLd?: Record<string, any>;
}

function upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, id?: string, type?: string) {
  let el = (id ? document.getElementById(id) : document.head.querySelector(`link[rel="${rel}"]`)) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    if (id) el.id = id;
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
  if (type) el.type = type;
}

const SEOHead = ({
  pageKey,
  title,
  description,
  keywords,
  robots,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonicalUrl,
  ogType = 'website',
  jsonLd
}: SEOHeadProps) => {
  const { cms } = useCMS();
  const location = useLocation();
  const settings = cms.siteSettings;
  const pageConfig = pageKey ? cms.pageSeo?.[pageKey] : undefined;

  const domain = (settings.siteDomain || 'https://aarvicloud.com').replace(/\/$/, '');
  const currentUrl = `${domain}${location.pathname === '/' ? '/' : location.pathname}`;

  const resolvedTitle =
    title ||
    pageConfig?.metaTitle ||
    settings.defaultMetaTitle ||
    'AarviCloud | Enterprise AI, Cloud Solutions & Custom Software Development';

  const resolvedDesc =
    description ||
    pageConfig?.metaDescription ||
    settings.defaultMetaDescription ||
    'AarviCloud engineers production-grade Generative AI, secure cloud architectures, and custom software.';

  const resolvedKeywords =
    keywords ||
    pageConfig?.targetKeywords ||
    settings.defaultKeywords ||
    'AI Development, Cloud Solutions, ERP Development, AarviCloud';

  const resolvedRobots =
    robots ||
    pageConfig?.metaRobots ||
    settings.defaultMetaRobots ||
    'index, follow';

  const resolvedOgTitle = ogTitle || pageConfig?.ogTitle || resolvedTitle;
  const resolvedOgDesc = ogDescription || pageConfig?.ogDescription || resolvedDesc;

  const rawOgImage = ogImage || pageConfig?.ogImage || settings.defaultOgImage || '/api/og-default.svg';
  const resolvedOgImage = rawOgImage.startsWith('http')
    ? rawOgImage
    : `${domain}${rawOgImage.startsWith('/') ? rawOgImage : `/${rawOgImage}`}`;

  const resolvedOgUrl = ogUrl || pageConfig?.ogUrl || currentUrl;
  const resolvedCanonical = canonicalUrl || pageConfig?.canonicalUrl || resolvedOgUrl;

  useEffect(() => {
    // 1. Meta Title (<title>)
    document.title = resolvedTitle;

    // 2. Meta Description & Target Keywords
    upsertMeta('name', 'description', resolvedDesc);
    upsertMeta('name', 'keywords', resolvedKeywords);

    // 3. Meta Robots Tag (Indexability)
    upsertMeta('name', 'robots', resolvedRobots);
    upsertMeta('name', 'googlebot', resolvedRobots);

    // 4. Google Site Verification if configured
    if (settings.googleSiteVerification) {
      upsertMeta('name', 'google-site-verification', settings.googleSiteVerification);
    }

    // 5. Open Graph Tags (og:title, og:description, og:image 1200x630, og:url)
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:site_name', settings.siteName || 'AarviCloud IT Solutions');
    upsertMeta('property', 'og:title', resolvedOgTitle);
    upsertMeta('property', 'og:description', resolvedOgDesc);
    upsertMeta('property', 'og:image', resolvedOgImage);
    upsertMeta('property', 'og:image:width', String(settings.ogImageWidth || 1200));
    upsertMeta('property', 'og:image:height', String(settings.ogImageHeight || 630));
    upsertMeta('property', 'og:url', resolvedOgUrl);

    // 6. Twitter Cards
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', resolvedOgTitle);
    upsertMeta('name', 'twitter:description', resolvedOgDesc);
    upsertMeta('name', 'twitter:image', resolvedOgImage);

    // 7. Canonical URL
    upsertLink('canonical', resolvedCanonical);

    // 8. Custom Favicon
    const favUrl = settings.faviconUrl && settings.faviconUrl !== '/logo.png' ? settings.faviconUrl : '/PNG2_FAV.png';
    if (favUrl) {
      const favMime = favUrl.endsWith('.svg')
        ? 'image/svg+xml'
        : favUrl.endsWith('.ico')
        ? 'image/x-icon'
        : 'image/png';
      upsertLink('icon', favUrl, 'dynamic-favicon', favMime);
      upsertLink('apple-touch-icon', favUrl, 'dynamic-apple-icon');
    }

    // 9. Structured Data (JSON-LD)
    let scriptEl = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'seo-json-ld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    const defaultSchema = jsonLd || {
      '@context': 'https://schema.org',
      '@type': ogType === 'article' ? 'Article' : 'Organization',
      name: settings.siteName || 'AarviCloud IT Solutions',
      url: resolvedOgUrl,
      logo: `${domain}/logo.png`,
      description: resolvedDesc
    };
    scriptEl.textContent = JSON.stringify(defaultSchema);
  }, [
    resolvedTitle,
    resolvedDesc,
    resolvedKeywords,
    resolvedRobots,
    resolvedOgTitle,
    resolvedOgDesc,
    resolvedOgImage,
    resolvedOgUrl,
    resolvedCanonical,
    ogType,
    settings,
    domain,
    jsonLd
  ]);

  return null;
};

export default SEOHead;
