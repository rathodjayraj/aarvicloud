import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './Portfolio.css';

const fallbackProjects = [
  { id: 18, slug: 'delta-terminal-v3-algo-trading', title: 'Delta Terminal V3 - Algo Trading', category: 'Development', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop', desc: 'An algorithmic trading software featuring real-time crypto and asset streaming using Delta Exchange API.', tech: ['React', 'Delta API', 'WebSockets'], url: 'https://delta.gujjucode.com/' },
  { id: 17, slug: 'ambajis-online-shopping', title: "Ambaji's Online Shopping", category: 'Development', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop', desc: 'An all-in-one grocery e-commerce web platform and mobile application featuring live stock tracking.', tech: ['Laravel', 'React Native', 'MySQL'], url: 'https://ambajis.com/' },
  { id: 16, slug: 'ai-beard-mustache-filter-pro', title: 'AI Beard & Mustache Filter Pro', category: 'Development', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2080&auto=format&fit=crop', desc: 'An AI-powered mobile application built for virtual try-ons of beard and mustache styles.', tech: ['Flutter', 'Dart', 'TensorFlow Lite'], url: 'https://play.google.com/store/apps/details?id=com.ai.beard.mustache.filter.pro' },
  { id: 15, slug: 'divya-rathod-beauty-salon', title: 'Divya Rathod Beauty Salon', category: 'Development', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop', desc: 'A premium beauty salon website featuring a custom online appointment booking system.', tech: ['React', 'Node.js', 'MongoDB'], url: 'https://divyarathod.com/' },
  { id: 14, slug: 'global-link-holidays', title: 'Global Link Holidays', category: 'Development', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop', desc: 'An interactive tour and travel booking platform providing seamless holiday planning.', tech: ['React', 'Node.js'], url: 'https://globallinkholidays.com/' },
  { id: 1, slug: 'global-bank-cloud-migration', title: 'Global Bank Cloud Migration', category: 'Cloud', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop', desc: 'Seamless migration of legacy banking systems to a hybrid cloud infrastructure.', tech: ['AWS', 'Terraform', 'Kubernetes'] },
  { id: 2, slug: 'e-commerce-security-audit', title: 'E-Commerce Security Audit', category: 'Security', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop', desc: 'Comprehensive security overhaul for a multi-million dollar retail platform.', tech: ['OWASP', 'Wireshark', 'Burp Suite'] },
  { id: 3, slug: 'aviation-management-app', title: 'Aviation Management App', category: 'Development', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop', desc: 'Real-time flight tracking and resource management application.', tech: ['React', 'Node.js', 'PostgreSQL'] },
  { id: 4, slug: 'ai-powered-log-analysis', title: 'AI-Powered Log Analysis', category: 'Security', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop', desc: 'Implementing machine learning to detect anomalies in server logs.', tech: ['Python', 'TensorFlow', 'ELK Stack'] },
  { id: 5, slug: 'telecom-network-optimization', title: 'Telecom Network Optimization', category: 'Cloud', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop', desc: 'Optimizing high-traffic network nodes for 5G readiness.', tech: ['5G', 'Docker', 'Go'] },
  { id: 6, slug: 'healthtech-patient-portal', title: 'HealthTech Patient Portal', category: 'Development', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop', desc: 'Secure and HIPAA-compliant communication platform for doctors and patients.', tech: ['React', 'Express', 'MongoDB'] },
  { id: 7, slug: 'mern-real-estate-platform', title: 'MERN Real-Estate Platform', category: 'Development', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop', desc: 'A full-featured property listing and management system built with the MERN stack.', tech: ['MongoDB', 'Express', 'React', 'Node.js'] },
  { id: 8, slug: 'python-ai-sentiment-analyzer', title: 'Python AI Sentiment Analyzer', category: 'Development', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop', desc: 'Advanced natural language processing tool for analyzing customer feedback in real-time.', tech: ['Python', 'NLTK', 'Flask'] },
  { id: 9, slug: 'mern-inventory-system', title: 'MERN Inventory System', category: 'Development', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop', desc: 'Cloud-based inventory tracking with real-time updates and analytics.', tech: ['MongoDB', 'Express', 'React', 'Node.js'] },
  { id: 10, slug: 'python-automated-trading-bot', title: 'Python Automated Trading Bot', category: 'Development', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop', desc: 'Algorithm-driven trading platform for automated cryptocurrency analysis and execution.', tech: ['Python', 'Binance API', 'Pandas'] },
  { id: 11, slug: 'smart-hrms', title: 'Smart HRMS', category: 'Development', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop', desc: 'Automate payroll, attendance, and recruitment with AI-driven insights.', tech: ['React', 'Node.js', 'MySQL'] },
  { id: 12, slug: 'edutech-pro', title: 'EduTech Pro', category: 'Development', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop', desc: 'Comprehensive management system for schools and colleges with E-Learning integration.', tech: ['React', 'Express', 'PostgreSQL'] },
  { id: 13, slug: 'enterprise-core', title: 'Enterprise Core', category: 'Development', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', desc: 'Unified ERP solution for inventory, finance, and supply chain management.', tech: ['Angular', 'Java', 'Spring Boot'] }
];

const Portfolio = () => {
  const { cms } = useCMS();
  const [filter, setFilter] = useState('All');

  const projects =
    cms.portfolioProjects && cms.portfolioProjects.length > 0
      ? cms.portfolioProjects
      : fallbackProjects;

  const uniqueCats = Array.from(new Set(['Cloud', 'Security', 'Development', ...projects.map((p) => p.category)]));
  const categories = ['All', ...uniqueCats];

  const filteredProjects =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="portfolio section-padding">
      <SEOHead pageKey="portfolio" />

      <div className="container">
        <div className="section-header">
          <h1>
            Our <span className="gradient-text">Portfolio</span>
          </h1>
          <p>Explore some of our most impactful digital transformations across AI, Cloud, and Enterprise Software.</p>
        </div>

        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="portfolio-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="project-card glass-card"
              >
                <div className="project-img">
                  <img src={project.image} alt={project.title} />
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-overlay">
                      <ExternalLink size={30} />
                    </a>
                  ) : (
                    <div className="project-overlay">
                      <ExternalLink size={30} />
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <span className="project-cat">{project.category}</span>
                  <h2>
                    <Link to={`/portfolio/${project.slug || project.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {project.title}
                    </Link>
                  </h2>
                  <p>{project.desc}</p>
                  {project.tech && (
                    <div className="project-tech">
                      {project.tech.map((t, idx) => (
                        <span key={idx} className="tech-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <Link
                      to={`/portfolio/${project.slug || project.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: 'var(--primary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight size={14} />
                    </Link>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: 'var(--text-muted)',
                          fontSize: '0.85rem',
                          textDecoration: 'none'
                        }}
                      >
                        <span>Live Demo</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;
