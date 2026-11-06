import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Tag, Layers, CheckCircle2, ShieldCheck, Sparkles, Rocket } from 'lucide-react';
import { useCMS, type DynamicPortfolioProject } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './PortfolioDetail.css';

const fallbackProjects: DynamicPortfolioProject[] = [
  { id: 18, slug: 'delta-terminal-v3-algo-trading', title: 'Delta Terminal V3 - Algo Trading', category: 'Development', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop', desc: 'An algorithmic trading software featuring real-time crypto and asset streaming using Delta Exchange API.', tech: ['React', 'Delta API', 'WebSockets'], url: 'https://delta.gujjucode.com/' },
  { id: 17, slug: 'ambajis-online-shopping', title: "Ambaji's Online Shopping", category: 'Development', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop', desc: 'An all-in-one grocery e-commerce web platform and mobile application featuring live stock tracking.', tech: ['Laravel', 'React Native', 'MySQL'], url: 'https://ambajis.com/' },
  { id: 16, slug: 'ai-beard-mustache-filter-pro', title: 'AI Beard & Mustache Filter Pro', category: 'Development', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2080&auto=format&fit=crop', desc: 'An AI-powered mobile application built for virtual try-ons of beard and mustache styles.', tech: ['Flutter', 'Dart', 'TensorFlow Lite'], url: 'https://play.google.com/store/apps/details?id=com.ai.beard.mustache.filter.pro' },
  { id: 15, slug: 'divya-rathod-beauty-salon', title: 'Divya Rathod Beauty Salon', category: 'Development', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop', desc: 'A premium beauty salon website featuring a custom online appointment booking system.', tech: ['React', 'Node.js', 'MongoDB'], url: 'https://divyarathod.com/' },
  { id: 14, slug: 'global-link-holidays', title: 'Global Link Holidays', category: 'Development', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop', desc: 'An interactive tour and travel booking platform providing seamless holiday planning.', tech: ['React', 'Node.js'], url: 'https://globallinkholidays.com/' },
  { id: 1, slug: 'global-bank-cloud-migration', title: 'Global Bank Cloud Migration', category: 'Cloud', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop', desc: 'Seamless migration of legacy banking systems to a hybrid cloud infrastructure.', tech: ['AWS', 'Terraform', 'Kubernetes'], url: '' },
  { id: 2, slug: 'e-commerce-security-audit', title: 'E-Commerce Security Audit', category: 'Security', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop', desc: 'Comprehensive security overhaul for a multi-million dollar retail platform.', tech: ['OWASP', 'Wireshark', 'Burp Suite'], url: '' },
  { id: 3, slug: 'aviation-management-app', title: 'Aviation Management App', category: 'Development', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop', desc: 'Real-time flight tracking and resource management application.', tech: ['React', 'Node.js', 'PostgreSQL'], url: '' },
  { id: 4, slug: 'ai-powered-log-analysis', title: 'AI-Powered Log Analysis', category: 'Security', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop', desc: 'Implementing machine learning to detect anomalies in server logs.', tech: ['Python', 'TensorFlow', 'ELK Stack'], url: '' },
  { id: 5, slug: 'telecom-network-optimization', title: 'Telecom Network Optimization', category: 'Cloud', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop', desc: 'Optimizing high-traffic network nodes for 5G readiness.', tech: ['5G', 'Docker', 'Go'], url: '' },
  { id: 6, slug: 'healthtech-patient-portal', title: 'HealthTech Patient Portal', category: 'Development', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop', desc: 'Secure and HIPAA-compliant communication platform for doctors and patients.', tech: ['React', 'Express', 'MongoDB'], url: '' },
  { id: 7, slug: 'mern-real-estate-platform', title: 'MERN Real-Estate Platform', category: 'Development', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop', desc: 'A full-featured property listing and management system built with the MERN stack.', tech: ['MongoDB', 'Express', 'React', 'Node.js'], url: '' },
  { id: 8, slug: 'python-ai-sentiment-analyzer', title: 'Python AI Sentiment Analyzer', category: 'Development', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop', desc: 'Advanced natural language processing tool for analyzing customer feedback in real-time.', tech: ['Python', 'NLTK', 'Flask'], url: '' },
  { id: 9, slug: 'mern-inventory-system', title: 'MERN Inventory System', category: 'Development', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop', desc: 'Cloud-based inventory tracking with real-time updates and analytics.', tech: ['MongoDB', 'Express', 'React', 'Node.js'], url: '' },
  { id: 10, slug: 'python-automated-trading-bot', title: 'Python Automated Trading Bot', category: 'Development', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop', desc: 'Algorithm-driven trading platform for automated cryptocurrency analysis and execution.', tech: ['Python', 'Binance API', 'Pandas'], url: '' },
  { id: 11, slug: 'smart-hrms', title: 'Smart HRMS', category: 'Development', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop', desc: 'Automate payroll, attendance, and recruitment with AI-driven insights.', tech: ['React', 'Node.js', 'MySQL'], url: '' },
  { id: 12, slug: 'edutech-pro', title: 'EduTech Pro', category: 'Development', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop', desc: 'Comprehensive management system for schools and colleges with E-Learning integration.', tech: ['React', 'Express', 'PostgreSQL'], url: '' },
  { id: 13, slug: 'enterprise-core', title: 'Enterprise Core', category: 'Development', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', desc: 'Unified ERP solution for inventory, finance, and supply chain management.', tech: ['Angular', 'Java', 'Spring Boot'], url: '' }
];

function slugify(text: string) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const PortfolioDetail = () => {
  const { id } = useParams();
  const { cms } = useCMS();

  const allProjects =
    cms.portfolioProjects && cms.portfolioProjects.length > 0
      ? cms.portfolioProjects
      : fallbackProjects;

  const project = allProjects.find((p) => {
    const slug = p.slug || slugify(p.title);
    return String(p.id) === String(id) || slug === id;
  });

  if (!project) {
    return (
      <div className="portfolio-detail-section section-padding">
        <SEOHead title="Project Not Found | AarviCloud Portfolio" robots="noindex, nofollow" />
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2>Project Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
            The requested portfolio case study or showcase does not exist or may have been unlisted.
          </p>
          <Link to="/portfolio" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const domain = (cms.siteSettings?.siteDomain || 'https://aarvicloud.com').replace(/\/$/, '');
  const slug = project.slug || slugify(project.title) || String(project.id);
  const techList = Array.isArray(project.tech) ? project.tech : [];

  const metaTitle = project.metaTitle || `${project.title} | AarviCloud Portfolio Case Study`;
  const metaDescription =
    project.metaDescription ||
    project.desc ||
    `Explore how AarviCloud engineered ${project.title} using ${techList.join(', ')}. Scalable cloud solutions and custom software.`;
  const targetKeywords = project.targetKeywords || (techList.length > 0 ? techList.join(', ') : 'Portfolio, AarviCloud');
  const canonicalUrl = project.canonicalUrl || `${domain}/portfolio/${slug}`;
  const metaRobots = project.metaRobots || 'index, follow';

  // Related projects
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && (p.category === project.category || !project.category))
    .slice(0, 3);

  return (
    <div className="portfolio-detail-page section-padding">
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        keywords={targetKeywords}
        canonicalUrl={canonicalUrl}
        robots={metaRobots}
        ogTitle={project.ogTitle || metaTitle}
        ogDescription={project.ogDescription || metaDescription}
        ogImage={project.ogImage || project.image}
        ogUrl={canonicalUrl}
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          headline: project.title,
          description: metaDescription,
          image: project.ogImage || project.image,
          author: {
            '@type': 'Organization',
            name: cms.siteSettings.siteName || 'AarviCloud IT Solutions'
          },
          url: canonicalUrl
        }}
      />

      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="portfolio-detail-nav">
          <Link to="/portfolio" className="portfolio-back-btn">
            <ArrowLeft size={16} /> Back to All Portfolio Projects
          </Link>
          <span className="portfolio-detail-category-pill">{project.category}</span>
        </div>

        {/* Hero Section */}
        <div className="portfolio-detail-hero">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="portfolio-detail-title"
          >
            {project.title}
          </motion.h1>

          <p className="portfolio-detail-desc">{project.desc}</p>

          {/* Action Row */}
          <div className="portfolio-hero-actions">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <span>Launch Live Project</span>
                <ExternalLink size={16} />
              </a>
            ) : null}
            <Link
              to="/contact"
              className="admin-btn-action"
              style={{ padding: '0.75rem 1.4rem', borderRadius: '10px', textDecoration: 'none' }}
            >
              Request Similar Project
            </Link>
          </div>
        </div>

        {/* Media Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="portfolio-detail-showcase"
        >
          <img src={project.image} alt={project.title} className="portfolio-detail-img" />
        </motion.div>

        {/* Project Meta Grid */}
        <div className="portfolio-meta-grid">
          <div className="portfolio-meta-card glass-card">
            <div className="meta-card-header">
              <Layers size={20} className="meta-card-icon" />
              <h3>Technology Stack</h3>
            </div>
            <div className="portfolio-tags-flex">
              {techList.length > 0 ? (
                techList.map((tech, idx) => (
                  <span key={idx} className="tech-tag-badge">
                    <Tag size={12} /> {tech}
                  </span>
                ))
              ) : (
                <span className="text-muted">Cloud & Web Development</span>
              )}
            </div>
          </div>

          <div className="portfolio-meta-card glass-card">
            <div className="meta-card-header">
              <ShieldCheck size={20} className="meta-card-icon" />
              <h3>Engineering Architecture</h3>
            </div>
            <ul className="meta-features-list">
              <li>
                <CheckCircle2 size={16} color="#10b981" /> Production-grade high availability & performance
              </li>
              <li>
                <CheckCircle2 size={16} color="#10b981" /> Cloud security, zero-trust authentication & data encryption
              </li>
              <li>
                <CheckCircle2 size={16} color="#10b981" /> Responsive UI/UX engineered for peak engagement
              </li>
            </ul>
          </div>
        </div>

        {/* In-Depth Engineering Overview */}
        <div className="portfolio-in-depth-card glass-card">
          <div className="section-title-wrap">
            <Sparkles size={20} color="#1994E2" />
            <h2>Project Architecture & Execution</h2>
          </div>
          <p>
            {project.title} was engineered by the AarviCloud technical team following industry best practices
            in modern distributed systems, clean code architecture, and high-velocity continuous integration.
            Every component is fine-tuned to guarantee rapid load times, resilient uptime, and seamless responsiveness
            across all screen sizes and modern web standards.
          </p>
          <p>
            Our deployment pipeline integrates automated security auditing, SEO tag verification, and rigorous
            functional verification to ensure that business goals and digital growth trajectories are realized
            reliably from launch.
          </p>

          {project.url && (
            <div className="portfolio-live-link-box">
              <span>Verified Deployment:</span>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.url} <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Bottom CTA Card */}
        <div className="portfolio-cta-banner glass-card">
          <div className="cta-banner-content">
            <Rocket size={32} color="#4f46e5" />
            <div>
              <h3>Have a project in mind similar to {project.title}?</h3>
              <p>Let our architects and engineers scope, design, and deliver your next cloud or software solution.</p>
            </div>
          </div>
          <Link to="/contact" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Discuss Your Project
          </Link>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="portfolio-related-section">
            <h2>Related Projects</h2>
            <div className="portfolio-related-grid">
              {relatedProjects.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/portfolio/${rp.slug || slugify(rp.title) || rp.id}`}
                  className="related-project-card glass-card"
                >
                  <img src={rp.image} alt={rp.title} />
                  <div className="related-project-info">
                    <span className="related-cat">{rp.category}</span>
                    <h4>{rp.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetail;
