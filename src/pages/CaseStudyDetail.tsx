import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Shield, Users, BarChart } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './CaseStudyDetail.css';

const fallbackCaseStudies: Record<string, any> = {
  '1': {
    id: 1,
    slug: 'merchinator-ecommerce-platform',
    title: 'Merchinator - E-commerce Platform',
    badgeCategory: 'Fortune 500',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    challenge: 'The client needed to scale their legacy e-commerce platform to handle over 1 million daily active users while maintaining sub-second response times.',
    solution: 'We implemented a microservices architecture using Node.js and React, deployed on AWS with auto-scaling and Redis caching.',
    results: 'Response times improved by 60%, and the platform now easily handles peak traffic during holiday seasons.',
    tech: ['React', 'Node.js', 'AWS', 'Redis', 'PostgreSQL'],
    features: ['Real-time Inventory Management', 'AI-Powered Recommendations', 'Multi-Currency Support', 'Advanced Analytics Dashboard'],
    stats: ['60% Faster Performance', '1M+ Active Users', 'Enterprise Grade Security']
  },
  '2': {
    id: 2,
    slug: 'edward-jones-financial-app',
    title: 'Edward Jones - Financial App',
    badgeCategory: 'Fortune 500',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
    challenge: 'Updating a complex financial management system with high security requirements and real-time data processing.',
    solution: 'Built a secure cloud-native application using ReactJS and Java Spring Boot with end-to-end encryption.',
    results: 'Increased advisor productivity by 40% and improved client engagement through the new portal.',
    tech: ['ReactJS', 'Spring Boot', 'Azure', 'MongoDB', 'Kafka'],
    features: ['Portfolio Management', 'Secure Messaging', 'Real-time Market Data', 'Automated Reporting'],
    stats: ['40% Higher Productivity', '1M+ Active Users', 'Enterprise Grade Security']
  },
  '6': {
    id: 6,
    slug: 'medisight-healthcare-ai',
    title: 'Medisight - Healthcare AI',
    badgeCategory: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2070&auto=format&fit=crop',
    challenge: 'Developing an AI-driven platform for medical image analysis to assist doctors in early diagnosis.',
    solution: 'Leveraged Python and TensorFlow to build deep learning models, integrated with a React frontend.',
    results: 'Diagnostic accuracy increased by 25%, and diagnosis time was reduced by half.',
    tech: ['Python', 'TensorFlow', 'React', 'FastAPI', 'AWS S3'],
    features: ['Automated Image Labeling', 'Cloud-based Image Storage', 'Doctor Collaboration Tools', 'Detailed Report Generation'],
    stats: ['25% Higher Accuracy', '50% Faster Triage', 'Enterprise Grade Security']
  }
};

const CaseStudyDetail = () => {
  const { id } = useParams();
  const { cms } = useCMS();

  const found = (cms.caseStudies || []).find(
    (c) => String(c.id) === String(id) || c.slug === id
  );

  const study = found || fallbackCaseStudies[id || '1'] || fallbackCaseStudies['1'];
  const displayTitle = study.fullTitle || study.title;
  const stats = study.stats || ['60% Faster Performance', '1M+ Active Users', 'Enterprise Grade Security'];
  const statIcons = [<BarChart size={20} />, <Users size={20} />, <Shield size={20} />];

  return (
    <div className="case-study-detail">
      <SEOHead
        title={study.metaTitle || `${displayTitle} | Case Study | AarviCloud`}
        description={study.metaDescription || study.challenge}
        keywords={study.targetKeywords || (study.tech || []).join(', ')}
        robots={study.metaRobots || 'index, follow'}
        ogTitle={study.ogTitle || displayTitle}
        ogDescription={study.ogDescription || study.results}
        ogImage={study.ogImage || study.image}
        ogUrl={study.ogUrl}
        ogType="article"
      />

      {/* Hero Section (H1) */}
      <section
        className="cs-hero"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${study.image})` }}
      >
        <div className="container">
          <Link to="/case-studies" className="back-link">
            <ArrowLeft size={20} /> Back to Case Studies
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="cs-hero-content"
          >
            <span className="cs-badge">{study.badgeCategory || study.sectionCategory || 'Enterprise'}</span>
            <h1>{displayTitle}</h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section (H2) */}
      <section className="cs-content section-padding">
        <div className="container cs-grid-layout">
          <div className="cs-main-content">
            <div className="cs-section">
              <h2>The Challenge</h2>
              <p>{study.challenge}</p>
            </div>

            <div className="cs-section">
              <h2>Our Solution</h2>
              <p>{study.solution}</p>
            </div>

            <div className="cs-section">
              <h2>Results</h2>
              <p>{study.results}</p>
            </div>

            <div className="cs-section">
              <h2>Key Features</h2>
              <ul className="cs-features-list">
                {(study.features || []).map((feature: string, index: number) => (
                  <li key={index}>
                    <CheckCircle2 className="text-primary" size={20} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="cs-sidebar-content">
            <div className="cs-sidebar-card glass-card">
              <h2>Technologies Used</h2>
              <div className="cs-tech-grid">
                {(study.tech || []).map((t: string, index: number) => (
                  <div key={index} className="cs-tech-tag">
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="cs-sidebar-card glass-card">
              <h2>Project Stats</h2>
              {stats.map((st: any, idx: number) => (
                <div className="cs-stat-item" key={idx}>
                  {statIcons[idx % statIcons.length]}
                  <span>{typeof st === 'string' ? st : st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetail;
