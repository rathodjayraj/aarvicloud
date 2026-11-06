import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './InfoPages.css';

const CustomPage = () => {
  const { slug } = useParams();
  const { cms } = useCMS();

  const cleanSlug = String(slug || '').replace(/^\/+/, '');
  const page = (cms.customPages || []).find(
    (p) => p.slug === cleanSlug || p.slug === `/${cleanSlug}`
  );

  if (!page) {
    return (
      <div className="info-page section-padding" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <SEOHead title="Page Not Found | AarviCloud" robots="noindex, nofollow" />
        <div className="container text-center">
          <h1>404 - Page Not Found</h1>
          <p style={{ margin: '1.5rem 0', color: 'var(--text-dim)' }}>
            The requested page does not exist or may have been moved.
          </p>
          <Link to="/" className="btn-primary">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-dynamic-page">
      <SEOHead
        title={page.metaTitle || `${page.title} | AarviCloud`}
        description={page.metaDescription || page.subtitle}
        keywords={page.targetKeywords}
        robots={page.metaRobots || 'index, follow'}
        ogTitle={page.ogTitle || page.title}
        ogDescription={page.ogDescription || page.subtitle}
        ogImage={page.ogImage || page.heroImage}
        ogUrl={page.ogUrl}
      />

      <section className="about-hero section-padding">
        <div className="container">
          <Link to="/" className="back-link" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={18} /> Home
          </Link>
          <motion.div
            className="about-header text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {page.badge && (
              <span className="section-badge-pill" style={{ marginBottom: '1rem' }}>
                {page.badge}
              </span>
            )}
            <h1 style={{ fontSize: '3rem', margin: '0.5rem 0 1.5rem' }}>{page.title}</h1>
            {page.subtitle && (
              <p className="subtitle" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
                {page.subtitle}
              </p>
            )}
          </motion.div>

          {page.heroImage && (
            <div style={{ maxWidth: '900px', margin: '2rem auto 4rem', borderRadius: '1.5rem', overflow: 'hidden' }}>
              <img src={page.heroImage} alt={page.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          {/* Structured Content Sections (H2-H6) */}
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {(page.contentSections || []).map((sec, idx) => {
              const HeadingTag = sec.headingLevel || 'h2';
              return (
                <div key={idx} className="glass-card" style={{ padding: '2.5rem' }}>
                  <HeadingTag style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>
                    {sec.heading}
                  </HeadingTag>
                  <p style={{ color: 'var(--text-dim)', lineHeight: '1.7', marginBottom: sec.bullets?.length ? '1.5rem' : '0' }}>
                    {sec.body}
                  </p>
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                          <Check size={18} className="text-primary" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div style={{ maxWidth: '900px', margin: '4rem auto 0' }}>
            <div className="glass-card text-center" style={{ padding: '3.5rem 2rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{page.ctaTitle}</h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>{page.ctaText}</p>
              <Link to={page.ctaBtnLink || '/contact'} className="btn-primary">
                {page.ctaBtnText || 'Get Started'} <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomPage;
