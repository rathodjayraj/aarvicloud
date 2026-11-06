import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Heart, Shield, GraduationCap, Factory, ShoppingBag, Truck, ShoppingCart, Globe, Phone, Zap, Database, ArrowRight, PlayCircle, Cloud } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './CaseStudies.css';

const fallbackCaseStudies = [
  { id: 1, slug: 'merchinator-ecommerce-platform', title: 'Merchinator', sectionCategory: 'Fortune 500 Clients', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, slug: 'edward-jones-financial-app', title: 'Edward Jones', sectionCategory: 'Fortune 500 Clients', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, slug: 'the-container-store-supply-chain', title: 'The Container Store', sectionCategory: 'Fortune 500 Clients', image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, slug: 'relatient-patient-engagement', title: 'Relatient', sectionCategory: 'Healthcare', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, slug: 'cardiacdata-analytics-platform', title: 'CardiacData Analytics', sectionCategory: 'Healthcare', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, slug: 'medisight-healthcare-ai', title: 'Medisight', sectionCategory: 'Healthcare', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2070&auto=format&fit=crop' },
  { id: 7, slug: 'highworth-capital-investment-portal', title: 'Highworth Capital', sectionCategory: 'BFSI', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop' },
  { id: 8, slug: 'westmere-insurance-group-claims-ai', title: 'Westmere Insurance Group', sectionCategory: 'BFSI', image: 'https://images.unsplash.com/photo-1509017174183-0b7e0278f1ec?q=80&w=2070&auto=format&fit=crop' },
  { id: 9, slug: 'gold-trust-capital-wealth-tech', title: 'Gold trust capital', sectionCategory: 'BFSI', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=2070&auto=format&fit=crop' },
  { id: 10, slug: 'greenova-clean-energy-iot', title: 'Greenova', sectionCategory: 'ReactJS', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop' },
  { id: 11, slug: 'recart-headless-commerce', title: 'ReCart', sectionCategory: 'ReactJS', image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop' },
  { id: 12, slug: 'signease-digital-signature-saas', title: 'Signease', sectionCategory: 'ReactJS', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop' },
  { id: 13, slug: 'educare-lms-platform', title: 'Educare', sectionCategory: 'VueJS', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2074&auto=format&fit=crop' },
  { id: 15, slug: 'intelli-market-pro-analytics', title: 'Intelli market pro', sectionCategory: 'VueJS', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop' },
  { id: 16, slug: 'shopwise-b2b-commerce', title: 'ShopWise', sectionCategory: 'AngularJS', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2089&auto=format&fit=crop' },
  { id: 17, slug: 'curex-treasury-fx-platform', title: 'CuRex', sectionCategory: 'AngularJS', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop' },
  { id: 18, slug: 'forecast-ease-demand-planning', title: 'Forecast ease', sectionCategory: 'AngularJS', image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2006&auto=format&fit=crop' }
];

const CaseStudies = () => {
  const { cms } = useCMS();
  const [activeTab, setActiveTab] = useState('Industries');
  const [searchQuery, setSearchQuery] = useState('');

  const industries = [
    { name: 'Healthcare', icon: <Heart size={18} /> },
    { name: 'BFSI', icon: <Shield size={18} /> },
    { name: 'Education', icon: <GraduationCap size={18} /> },
    { name: 'Manufacturing', icon: <Factory size={18} /> },
    { name: 'Retail', icon: <ShoppingBag size={18} /> },
    { name: 'Logistics & Transportation', icon: <Truck size={18} /> },
    { name: 'eCommerce', icon: <ShoppingCart size={18} /> },
    { name: 'Public Services', icon: <Globe size={18} /> },
    { name: 'Travel & Hospitality', icon: <Zap size={18} /> },
    { name: 'Telecommunications', icon: <Phone size={18} /> },
    { name: 'Real Estate', icon: <Database size={18} /> },
  ];

  const technologies = [
    { name: 'ReactJS', icon: <Zap size={18} /> },
    { name: 'VueJS', icon: <Zap size={18} /> },
    { name: 'AngularJS', icon: <Zap size={18} /> },
    { name: 'Ruby on Rails', icon: <Database size={18} /> },
    { name: 'NodeJs', icon: <Zap size={18} /> },
    { name: 'Golang', icon: <Zap size={18} /> },
    { name: 'Laravel', icon: <Zap size={18} /> },
    { name: 'PHP', icon: <Database size={18} /> },
    { name: '.Net', icon: <Shield size={18} /> },
    { name: 'Java', icon: <Database size={18} /> },
    { name: 'Apache', icon: <Globe size={18} /> },
    { name: 'Software', icon: <Factory size={18} /> },
    { name: 'Javascript', icon: <Zap size={18} /> },
    { name: 'Python', icon: <Database size={18} /> },
    { name: 'Snowflake', icon: <Database size={18} /> },
    { name: 'Data Science', icon: <Database size={18} /> },
    { name: 'RPA', icon: <Factory size={18} /> },
    { name: 'React Native', icon: <Phone size={18} /> },
    { name: 'Flutter', icon: <Phone size={18} /> },
    { name: 'Fullstack', icon: <Globe size={18} /> },
    { name: 'Salesforce', icon: <Cloud className="logo-icon" size={18} /> },
    { name: 'Databricks', icon: <Database size={18} /> },
    { name: 'Devops', icon: <Shield size={18} /> },
    { name: 'Blockchain', icon: <Shield size={18} /> },
    { name: 'Workflow Automation', icon: <Zap size={18} /> },
    { name: 'AI/ML', icon: <Zap size={18} /> },
    { name: 'Tableau', icon: <Database size={18} /> },
    { name: 'Web', icon: <Globe size={18} /> },
    { name: 'Power BI', icon: <Database size={18} /> },
    { name: 'Mobile App', icon: <Phone size={18} /> },
    { name: 'LLM', icon: <Zap size={18} /> },
    { name: 'Vibe Coding', icon: <Zap size={18} /> },
    { name: 'Joomla', icon: <Globe size={18} /> },
  ];

  const allCaseStudies =
    cms.caseStudies && cms.caseStudies.length > 0
      ? cms.caseStudies
      : fallbackCaseStudies;

  const q = searchQuery.trim().toLowerCase();
  const filteredStudies = q
    ? allCaseStudies.filter(
        (c: any) =>
          c.title?.toLowerCase().includes(q) ||
          c.sectionCategory?.toLowerCase().includes(q) ||
          (c.tech || []).some((t: string) => t.toLowerCase().includes(q))
      )
    : allCaseStudies;

  // Group case studies by sectionCategory
  const sectionNames = Array.from(new Set(filteredStudies.map((c: any) => c.sectionCategory || 'Fortune 500 Clients')));
  const caseStudySections = sectionNames.map((secTitle) => ({
    title: secTitle,
    projects: filteredStudies.filter((c: any) => (c.sectionCategory || 'Fortune 500 Clients') === secTitle)
  }));

  const recentlyAdded = filteredStudies.slice(0, 3);

  const clientExperiences = cms.caseStudiesPageContent?.clientExperiences || [
    {
      id: 1,
      name: 'John Smith',
      role: 'CTO, HealthTech',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'CEO, EduPro',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Director, FinanceCore',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
    }
  ];

  const tabs = ['Industries', 'Technologies'];
  const gridData = activeTab === 'Technologies' ? technologies : industries;

  return (
    <div className="case-studies section-padding">
      <SEOHead pageKey="case-studies" />

      <div className="container">
        <div className="cs-header">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>
            {cms.pageSeo?.['case-studies']?.h1Heading ||
              cms.caseStudiesPageContent?.h1Heading || (
                <>
                  Enterprise <span className="gradient-text">Case Studies</span>
                </>
              )}
          </h1>
          <p className="cs-subtitle">
            {cms.caseStudiesPageContent?.subtitle ||
              'We empower brands to achieve global product growth through digital transformation.'}
          </p>

          <div className="cs-search-container">
            <div className="cs-search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search Case Studies by Name, Industry, or Tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="cs-tabs-container">
          <div className="cs-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`cs-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="cs-industries-grid">
          {gridData.map((item, index) => (
            <motion.div
              key={item.name}
              className="industry-btn glass-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSearchQuery(searchQuery === item.name ? '' : item.name)}
              style={{ cursor: 'pointer' }}
            >
              <span className="ind-icon">{item.icon}</span>
              <span className="ind-name">{item.name}</span>
            </motion.div>
          ))}
        </div>

        {recentlyAdded.length > 0 && (
          <section className="cs-section">
            <div className="section-title-row">
              <h2>
                Recently Added <ArrowRight size={24} className="title-arrow" />
              </h2>
            </div>
            <div className="cs-grid">
              {recentlyAdded.map((study: any) => (
                <Link to={`/case-study/${study.slug || study.id}`} key={study.id}>
                  <motion.div className="cs-card glass-card" whileHover={{ y: -10 }}>
                    <div className="cs-img">
                      <img src={study.image} alt={study.title} />
                      <div className="new-tag">NEW</div>
                      <div className="cs-card-info">
                        <h3>{study.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="cs-section">
          <div className="section-title-row">
            <h2>
              Experience With AarviCloud <ArrowRight size={24} className="title-arrow" />
            </h2>
          </div>
          <div className="client-exp-grid">
            {clientExperiences.map((exp: any) => (
              <div key={exp.id} className="exp-card">
                <div className="exp-img">
                  <img src={exp.image} alt={exp.name} />
                  <div className="new-tag">NEW</div>
                  <div className="exp-overlay">
                    <div className="play-btn">
                      <PlayCircle size={48} />
                    </div>
                    <div className="exp-info">
                      <h3>Client Experience</h3>
                      <p>Watch the video</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {caseStudySections.map((section) => (
          <section key={section.title} className="cs-section">
            <div className="section-title-row">
              <h2>
                Case Study - {section.title} <ArrowRight size={24} className="title-arrow" />
              </h2>
            </div>
            <div className="cs-grid">
              {section.projects.map((study: any) => (
                <Link to={`/case-study/${study.slug || study.id}`} key={study.id}>
                  <motion.div className="cs-card glass-card" whileHover={{ y: -10 }}>
                    <div className="cs-img">
                      <img src={study.image} alt={study.title} />
                      <div className="new-tag">NEW</div>
                      <div className="cs-card-info">
                        <h3>{study.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default CaseStudies;
