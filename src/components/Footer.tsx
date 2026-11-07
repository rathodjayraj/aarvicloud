import { Link } from 'react-router-dom';
import footerLogoDefault from '../assets/footer_logo.png';
import { useCMS } from '../context/CMSContext';
import './Footer.css';

const Footer = () => {
  const { cms } = useCMS();
  const fc = cms.footerContent || {};

  const defaultQuickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Our Services', path: '/about' },
    { label: 'Digital Marketing', path: '/digital-marketing' },
    { label: 'Our work', path: '/portfolio' },
    { label: 'Case Studies', path: '/case-studies' },
    { label: 'Blog', path: '/blog' },
    { label: 'Who we are', path: '/about' }
  ];

  const defaultServiceLinks = [
    { label: 'Digital Marketing & SEO', path: '/digital-marketing' },
    { label: 'Our AI Edge', path: '/p/ai-cloud-consulting-services' },
    { label: 'Mobile App Development', path: '/contact' },
    { label: 'Web Development', path: '/contact' },
    { label: 'Custom ERP & CRM Development', path: '/p/erp-development-company-rajkot' },
    { label: 'Shopify Development', path: '/contact' }
  ];

  const quickLinks = fc.quickLinks || defaultQuickLinks;
  const serviceLinks = fc.serviceLinks || defaultServiceLinks;
  const customFooterPages = (cms.customPages || []).filter((cp) => cp.showInFooter && cp.published !== false);

  const phone = fc.phone || '+91 88664 87551';
  const brandDesc =
    fc.brandDescription ||
    'We empower enterprises and startups worldwide with scalable, secure, and intelligent AI-driven solutions that transform industries and redefine growth.';
  const footerLogo =
    cms.siteSettings?.footerLogoUrl && cms.siteSettings.footerLogoUrl !== '/logo.png'
      ? cms.siteSettings.footerLogoUrl
      : cms.siteSettings?.headerLogoUrl && cms.siteSettings.headerLogoUrl !== '/logo.png'
      ? cms.siteSettings.headerLogoUrl
      : '/footer_logo.png';
  const siteName = cms.siteSettings?.siteName || 'AarviCloud';
  const footerBgMode = cms.siteSettings?.footerLogoBgMode || 'transparent';
  const socialLinks = fc.socialLinks || {
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    behance: 'https://behance.net',
    dribbble: 'https://dribbble.com'
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Top Partners Bar */}
        <div className="partner-bar">
          <span className="partners-label">{fc.partnersLabel || 'Our Partners :'}</span>
          <div className="partner-logos">
            <div className="partner-logo azure-logo">
              <svg viewBox="0 0 23 23" width="20" height="20" fill="currentColor">
                <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
              </svg>
              <span>Microsoft Azure</span>
            </div>

            <div className="partner-logo aws-logo">
              <span>aws</span>
              <svg viewBox="0 0 32 10" width="34" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M2 2c8 5 20 5 28 0" />
                <path d="M26 6l4-4-5-1" />
              </svg>
            </div>

            <div className="partner-logo shopify-logo">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3z" />
              </svg>
              <span className="shopify-text">shopify <span className="partners-text">partners</span></span>
            </div>

            <div className="partner-logo gcp-logo">
              <div className="gcp-text">
                <span className="gcp-main">Google Cloud</span>
                <span className="gcp-sub">Partner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Footer Grid */}
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className={`logo footer-logo-${footerBgMode}`}>
              <img
                src={footerLogo}
                alt={siteName}
                className="logo-img"
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  if (!t.src.endsWith('/footer_logo.png')) {
                    t.src = '/footer_logo.png';
                  } else {
                    t.src = footerLogoDefault;
                  }
                }}
              />
            </Link>
            <p>{brandDesc}</p>
            <div className="footer-contact-info">
              <div className="contact-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="contact-icon">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <h4>{fc.quickLinksTitle || 'LINKS'}</h4>
            <ul>
              {quickLinks.map((item: any, idx: number) => (
                <li key={idx}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h4>{fc.servicesTitle || 'SERVICES'}</h4>
            <ul>
              {serviceLinks.map((item: any, idx: number) => (
                <li key={idx}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
              {customFooterPages.map((cp) => (
                <li key={cp.id}>
                  <Link to={`/p/${cp.slug}`}>{cp.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-social-col">
            <h4>{fc.socialTitle || 'FOLLOW US ON'}</h4>
            <div className="social-icon-row">
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-circle" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}

              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-circle" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}

              {socialLinks.behance && (
                <a href={socialLinks.behance} target="_blank" rel="noopener noreferrer" className="social-circle" aria-label="Behance">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M8.07 5c.61 0 1.15.08 1.62.24.47.16.86.39 1.17.69.3.3.53.67.68 1.11.15.43.22.92.22 1.45 0 .76-.17 1.39-.5 1.9-.34.5-.85.9-1.53 1.18.84.23 1.48.65 1.9 1.25.43.6.64 1.38.64 2.33 0 .6-.09 1.13-.27 1.6-.18.47-.46.86-.83 1.18-.37.31-.83.56-1.39.73-.55.17-1.22.25-1.99.25H2V5h6.07zm-2.9 5.09h2.36c.64 0 1.11-.12 1.42-.37.31-.24.46-.61.46-1.11 0-.49-.15-.84-.46-1.07-.31-.22-.78-.34-1.42-.34H5.17v2.89zm0 5.86h2.52c.69 0 1.21-.14 1.55-.42.34-.28.51-.69.51-1.21 0-.52-.17-.92-.51-1.19-.34-.27-.86-.4-1.55-.4H5.17v3.22zm15.4-3.13c0 .08.01.19.01.32h-5.2c.03.74.25 1.31.66 1.7.41.39.98.59 1.7.59.55 0 1.02-.12 1.42-.37.4-.25.68-.61.85-1.08h2.31c-.24.91-.76 1.64-1.55 2.19-.79.55-1.8.82-3.03.82-1.01 0-1.89-.19-2.65-.56a4.87 4.87 0 0 1-1.88-1.63c-.49-.69-.73-1.5-.73-2.42 0-.91.24-1.72.71-2.42.47-.7 1.1-1.24 1.88-1.61.79-.37 1.67-.56 2.65-.56.97 0 1.83.18 2.58.55.75.37 1.35.89 1.8 1.57.46.68.68 1.48.68 2.42zm-2.4-.93c-.02-.68-.22-1.2-.6-1.57-.38-.37-.88-.56-1.5-.56-.63 0-1.14.19-1.51.57-.37.38-.56.9-.58 1.56h5.19zM15 6h5v1h-5V6z"/>
                  </svg>
                </a>
              )}

              {socialLinks.dribbble && (
                <a href={socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="social-circle" aria-label="Dribbble">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.458c-.31-.772-1.815-4.103-5.263-5.83 1.455-2.22 2.062-4.04 2.195-4.475C17.2 4.887 14.808 6.463 13.435 7.643 11.233 5.438 8.766 3.738 8.423 3.51a10.05 10.05 0 0 0-4.488 3.013c.092.17.653 1.258 1.9 3.064-2.825 1.096-5.748 1.156-6.196 1.162a9.92 9.92 0 0 0 3.398 6.096c.44-.015 3.704-.203 7.034-1.688 1.18 2.023 2.115 3.992 2.378 4.582a9.94 9.94 0 0 0 5.436-2.585c-.097-.24-.962-2.316-2.316-4.664a25.5 25.5 0 0 0 4.912.871z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="footer-bottom">
          <p>{fc.copyrightText || `© ${new Date().getFullYear()} AarviCloud IT Solutions. All rights reserved.`}</p>
          <div className="bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/admin" style={{ opacity: 0.5, fontSize: '0.8rem' }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
