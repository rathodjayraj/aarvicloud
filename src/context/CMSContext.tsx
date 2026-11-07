import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { blogPosts as fallbackBlogs } from '../data/blogs';

export interface SiteSettings {
  siteName: string;
  siteDomain: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultKeywords: string;
  defaultMetaRobots: string;
  faviconUrl: string;
  headerLogoUrl?: string;
  footerLogoUrl?: string;
  footerLogoBgMode?: 'card' | 'glow' | 'transparent';
  defaultOgImage: string;
  ogImageWidth: number;
  ogImageHeight: number;
  robotsTxt: string;
  googleSiteVerification?: string;
}

export interface PageSEOConfig {
  pageKey: string;
  routePath: string;
  metaTitle: string;
  metaDescription: string;
  targetKeywords: string;
  metaRobots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  canonicalUrl: string;
  h1Heading: string;
  priority: number;
  changefreq: string;
}

export interface DynamicBlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string;
  canonicalUrl?: string;
  metaRobots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DynamicPortfolioProject {
  id: number;
  slug?: string;
  title: string;
  category: string;
  image: string;
  desc: string;
  tech: string[];
  url?: string;
  featuredOnHome?: boolean;
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string;
  canonicalUrl?: string;
  metaRobots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DynamicCaseStudy {
  id: number;
  slug: string;
  title: string;
  fullTitle?: string;
  sectionCategory: string;
  badgeCategory?: string;
  image: string;
  isNew?: boolean;
  challenge: string;
  solution: string;
  results: string;
  tech: string[];
  features: string[];
  stats: string[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string;
  metaRobots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export interface CustomPageSection {
  headingLevel: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  heading: string;
  body: string;
  bullets?: string[];
}

export interface DynamicCustomPage {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  heroImage: string;
  contentSections: CustomPageSection[];
  ctaTitle: string;
  ctaText: string;
  ctaBtnText: string;
  ctaBtnLink: string;
  showInNavbar: boolean;
  showInFooter: boolean;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  targetKeywords: string;
  metaRobots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  priority: number;
  changefreq: string;
}

export interface CMSData {
  siteSettings: SiteSettings;
  pageSeo: Record<string, PageSEOConfig>;
  homeContent: any;
  aboutContent: any;
  contactContent: any;
  footerContent: any;
  caseStudiesPageContent: any;
  blogs: DynamicBlogPost[];
  portfolioProjects: DynamicPortfolioProject[];
  caseStudies: DynamicCaseStudy[];
  customPages: DynamicCustomPage[];
}

const DOMAIN = 'https://aarvicloud.com';

const initialCMSData: CMSData = {
  siteSettings: {
    siteName: 'AarviCloud IT Solutions',
    siteDomain: DOMAIN,
    defaultMetaTitle: 'AarviCloud | Enterprise AI, Cloud Solutions & Custom Software Development Company',
    defaultMetaDescription: 'AarviCloud engineers production-grade Generative AI, secure cloud architectures, custom ERP/CRM software, and scalable web & mobile applications for global enterprises.',
    defaultKeywords: 'AI Development Company, Cloud Solutions, Custom Software Development Company, ERP Development Rajkot, CRM Software, Cyber Security Consulting, AarviCloud',
    defaultMetaRobots: 'index, follow',
    faviconUrl: '/logo.png',
    headerLogoUrl: '/header_logo.png',
    footerLogoUrl: '/footer_logo.png',
    footerLogoBgMode: 'transparent',
    defaultOgImage: `${DOMAIN}/api/og-default.svg`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${DOMAIN}/sitemap.xml`
  },
  pageSeo: {},
  homeContent: null,
  aboutContent: null,
  contactContent: null,
  footerContent: null,
  caseStudiesPageContent: null,
  blogs: fallbackBlogs.map((b) => ({
    ...b,
    slug: b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    readTime: b.id === 10 ? '22 min read' : b.id === 11 ? '18 min read' : '12 min read',
    tags: ['Cloud', 'Technology', 'AI'],
    published: true
  })),
  portfolioProjects: [],
  caseStudies: [],
  customPages: []
};

interface CMSContextType {
  cms: CMSData;
  loading: boolean;
  refreshCMS: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType>({
  cms: initialCMSData,
  loading: true,
  refreshCMS: async () => {}
});

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cms, setCms] = useState<CMSData>(initialCMSData);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshCMS = useCallback(async () => {
    try {
      const res = await fetch('/api/public/cms');
      if (res.ok) {
        const data = await res.json();
        setCms((prev) => ({
          ...prev,
          ...data,
          siteSettings: { ...prev.siteSettings, ...(data.siteSettings || {}) }
        }));
      }
    } catch (err) {
      console.warn('Using fallback CMS data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCMS();
  }, [refreshCMS]);

  return (
    <CMSContext.Provider value={{ cms, loading, refreshCMS }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);
