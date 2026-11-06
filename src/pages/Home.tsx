import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cloud, Zap, BarChart, Globe, ArrowRight, Heart, ShoppingBag, Factory, Landmark, Truck, HandCoins, Code, Bot, MessageSquare, Cpu, Check, Network, Layout, Lightbulb, Briefcase, Building2, Handshake, Smartphone, Settings, Search, Database, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CloudIcon, SecurityIcon, TransformIcon, AnalyticsIcon, ConsultingIcon, AppIcon, CrmIcon, ErpIcon, UiUxIcon, SeoIcon, MarketingIcon } from '../components/AnimatedIcon';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './Home.css';

const iconMap: Record<string, React.ReactNode> = {
  CloudIcon: <CloudIcon />,
  SecurityIcon: <SecurityIcon />,
  TransformIcon: <TransformIcon />,
  AnalyticsIcon: <AnalyticsIcon />,
  ConsultingIcon: <ConsultingIcon />,
  AppIcon: <AppIcon />,
  CrmIcon: <CrmIcon />,
  ErpIcon: <ErpIcon />,
  UiUxIcon: <UiUxIcon />,
  SeoIcon: <SeoIcon />,
  MarketingIcon: <MarketingIcon />
};

const industryIcons: Record<string, React.ReactNode> = {
  Healthcare: <Heart size={18} />,
  'Private Investments': <HandCoins size={18} />,
  Retail: <ShoppingBag size={18} />,
  Manufacturing: <Factory size={18} />,
  Finance: <Landmark size={18} />,
  Logistics: <Truck size={18} />
};

const ClientLogos = () => {
  const logos = (
    <div className="logos-group">
      <div className="logo-item atoa-logo">
        <span>atoa</span>
      </div>
      <div className="logo-item seylabs-logo">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
        <span>seylabs</span>
      </div>
      <div className="logo-item cashify-logo">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="9 11 12 14 22 4"/>
        </svg>
        <span>CASHIFY</span>
      </div>
      <div className="logo-item ancileo-logo">
        <span>Ancileo</span>
      </div>
      <div className="logo-item wedia-logo">
        <span>wedia</span>
      </div>
      <div className="logo-item networked-logo">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z" />
        </svg>
        <span>networked</span>
      </div>
      <div className="logo-item siemens-logo">
        <span>SIEMENS</span>
      </div>
    </div>
  );

  return (
    <div className="client-logos-marquee">
      <div className="logos-track">
        {logos}
        {logos}
      </div>
    </div>
  );
};

const Home = () => {
  const { cms } = useCMS();
  const hc = cms.homeContent || {};

  const defaultServices = [
    { iconKey: 'CloudIcon', title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure designed for modern business agility and performance.' },
    { iconKey: 'SecurityIcon', title: 'Cyber Security', desc: 'Advanced threat protection and security audits to keep your digital assets safe.' },
    { iconKey: 'TransformIcon', title: 'Digital Transformation', desc: 'Modernize your workflow with AI-driven automation and cutting-edge tech stacks.' },
    { iconKey: 'AnalyticsIcon', title: 'Data Analytics', desc: 'Turn your raw data into actionable insights with our expert BI solutions.' },
    { iconKey: 'ConsultingIcon', title: 'IT Consulting', desc: 'Strategic technology planning to align your IT with your business goals.' },
    { iconKey: 'AppIcon', title: 'App Development', desc: 'Custom web and mobile applications built with a focus on UX and scalability.' },
    { iconKey: 'CrmIcon', title: 'CRM Development', desc: 'Custom Customer Relationship Management systems to streamline sales, marketing, and client communications.' },
    { iconKey: 'ErpIcon', title: 'ERP Development', desc: 'Enterprise Resource Planning solutions to integrate core processes like finance, HR, manufacturing, and supply chain.' },
    { iconKey: 'UiUxIcon', title: 'UI/UX Design', desc: 'User-centric design solutions producing intuitive, gorgeous, and engaging digital interfaces.' },
    { iconKey: 'SeoIcon', title: 'SEO Optimization', desc: 'Search engine optimization strategies to drive organic traffic, improve rankings, and boost search visibility.' },
    { iconKey: 'MarketingIcon', title: 'Digital Marketing', desc: 'Result-driven marketing campaigns, social media management, and paid advertising to grow your brand.' }
  ];

  const servicesList = hc.servicesSection?.services || defaultServices;

  const defaultAiToolGroups = [
    {
      title: 'AI-Powered Coding Assistants',
      icon: <Code size={20} />,
      tools: [
        { name: 'Cursor AI', value: '98%' },
        { name: 'Github Copilot', value: '95%' },
        { name: 'Claude Code', value: '92%' }
      ]
    },
    {
      title: 'Agents for MVPs',
      icon: <Bot size={20} />,
      tools: [
        { name: 'Lovable AI', value: '85%' },
        { name: 'Bolt', value: '88%' },
        { name: 'Vercel', value: '87%' }
      ]
    },
    {
      title: 'AI Productivity Tools',
      icon: <MessageSquare size={20} />,
      tools: [
        { name: 'ChatGPT', value: '90%' },
        { name: 'Claude', value: '89%' },
        { name: 'Gemini', value: '85%' }
      ]
    },
    {
      title: 'AI Automation Tools',
      icon: <Cpu size={20} />,
      tools: [
        { name: 'n8n', value: '83%' },
        { name: 'Make (Integromat)', value: '80%' },
        { name: 'Zapier AI Actions', value: '86%' },
        { name: 'LangChain / CrewAI', value: '81%' }
      ]
    }
  ];

  const aiGroupIcons = [<Code size={20} />, <Bot size={20} />, <MessageSquare size={20} />, <Cpu size={20} />];
  const aiToolGroups = (hc.aiToolsSection?.groups || defaultAiToolGroups).map((g: any, idx: number) => ({
    ...g,
    icon: g.icon || aiGroupIcons[idx % aiGroupIcons.length]
  }));

  const techStack = {
    'Hi-Tech': [
      { name: 'IoT', icon: <Cpu size={32} /> },
      { name: 'Blockchain', icon: <Shield size={32} /> },
      { name: 'AR/VR', icon: <Layout size={32} /> },
      { name: 'Robotics', icon: <Bot size={32} /> }
    ],
    'AI/ML': [
      { name: 'TensorFlow', icon: <Cpu size={32} /> },
      { name: 'PyTorch', icon: <Cpu size={32} /> },
      { name: 'Keras', icon: <Cpu size={32} /> },
      { name: 'Scikit-learn', icon: <BarChart size={32} /> },
      { name: 'Hugging Face Transformers', icon: <MessageSquare size={32} /> },
      { name: 'FastAI', icon: <Zap size={32} /> },
      { name: 'XGBoost', icon: <BarChart size={32} /> },
      { name: 'LightGBM', icon: <BarChart size={32} /> },
      { name: 'OpenCV', icon: <Layout size={32} /> },
      { name: 'Apache Spark MLlib', icon: <Settings size={32} /> },
      { name: 'NLP frameworks (NLTK, SpaCy)', icon: <MessageSquare size={32} /> },
      { name: 'AutoML platforms', icon: <Zap size={32} /> }
    ],
    'Cloud/DevOps': [
      { name: 'AWS', icon: <Cloud size={32} /> },
      { name: 'Microsoft Azure', icon: <Cloud size={32} /> },
      { name: 'Google Cloud Platform', icon: <Cloud size={32} /> },
      { name: 'Alibaba Cloud', icon: <Cloud size={32} /> },
      { name: 'Kubernetes', icon: <Network size={32} /> },
      { name: 'Docker', icon: <ShoppingBag size={32} /> },
      { name: 'Podman', icon: <ShoppingBag size={32} /> },
      { name: 'Terraform', icon: <Factory size={32} /> },
      { name: 'Pulumi', icon: <Factory size={32} /> },
      { name: 'Ansible', icon: <Settings size={32} /> },
      { name: 'GitHub Actions', icon: <Code size={32} /> },
      { name: 'GitLab CI/CD', icon: <Code size={32} /> },
      { name: 'CircleCI', icon: <Code size={32} /> },
      { name: 'Argo CD', icon: <Zap size={32} /> },
      { name: 'Jenkins X', icon: <Code size={32} /> },
      { name: 'Helm', icon: <Layout size={32} /> },
      { name: 'Istio', icon: <Network size={32} /> }
    ],
    'Frontend': [
      { name: 'React.js', icon: <Zap size={32} /> },
      { name: 'Angular', icon: <Shield size={32} /> },
      { name: 'Vue.js', icon: <Check size={32} /> },
      { name: 'Svelte', icon: <Zap size={32} /> },
      { name: 'Solid js', icon: <Zap size={32} /> },
      { name: 'Next.js', icon: <Layout size={32} /> },
      { name: 'Nuxt.js', icon: <Layout size={32} /> },
      { name: 'Remix', icon: <Layout size={32} /> },
      { name: 'Astro', icon: <Layout size={32} /> },
      { name: 'Typescript', icon: <Code size={32} /> },
      { name: 'Redux', icon: <Code size={32} /> },
      { name: 'Tailwind CSS', icon: <Layout size={32} /> },
      { name: 'Bootstrap', icon: <Layout size={32} /> },
      { name: 'HTML5', icon: <Layout size={32} /> },
      { name: 'CSS3', icon: <Layout size={32} /> },
      { name: 'JavaScript', icon: <Code size={32} /> },
      { name: 'Webpack', icon: <Settings size={32} /> },
      { name: 'Vite', icon: <Zap size={32} /> },
      { name: 'Lit', icon: <Layout size={32} /> }
    ],
    'Backend': [
      { name: 'Node.js', icon: <Zap size={32} /> },
      { name: 'Express.js', icon: <Zap size={32} /> },
      { name: 'NestJS', icon: <Shield size={32} /> },
      { name: 'ASP.NET Core', icon: <Landmark size={32} /> },
      { name: 'ASP.NET MVC', icon: <Landmark size={32} /> },
      { name: 'Python', icon: <Code size={32} /> },
      { name: 'Django', icon: <Shield size={32} /> },
      { name: 'FastAPI', icon: <Zap size={32} /> },
      { name: 'Flask', icon: <Code size={32} /> }
    ],
    'Mobile': [
      { name: 'React Native', icon: <Smartphone size={32} /> },
      { name: 'Flutter', icon: <Smartphone size={32} /> },
      { name: 'Swift (iOS)', icon: <Smartphone size={32} /> },
      { name: 'Kotlin (Android)', icon: <Smartphone size={32} /> },
      { name: 'Xamarin', icon: <Smartphone size={32} /> },
      { name: 'Ionic', icon: <Smartphone size={32} /> },
      { name: 'Unity', icon: <Layout size={32} /> }
    ],
    'Database': [
      { name: 'PostgreSQL', icon: <Database size={32} /> },
      { name: 'MongoDB', icon: <Database size={32} /> },
      { name: 'Redis', icon: <Database size={32} /> },
      { name: 'MySQL', icon: <Database size={32} /> },
      { name: 'MariaDB', icon: <Database size={32} /> },
      { name: 'Cassandra', icon: <Database size={32} /> },
      { name: 'DynamoDB', icon: <Database size={32} /> },
      { name: 'Oracle', icon: <Database size={32} /> },
      { name: 'Firebase', icon: <Database size={32} /> },
      { name: 'Supabase', icon: <Database size={32} /> },
      { name: 'Snowflake', icon: <Database size={32} /> }
    ],
    'CMS/Ecommerce': [
      { name: 'WordPress', icon: <Globe size={32} /> },
      { name: 'WooCommerce', icon: <ShoppingBag size={32} /> },
      { name: 'Magento', icon: <ShoppingBag size={32} /> },
      { name: 'Shopify', icon: <ShoppingBag size={32} /> },
      { name: 'Shopify Hydrogen', icon: <Zap size={32} /> },
      { name: 'BigCommerce', icon: <ShoppingBag size={32} /> },
      { name: 'Joomla', icon: <Layout size={32} /> },
      { name: 'PrestaShop', icon: <ShoppingBag size={32} /> },
      { name: 'Wix', icon: <Layout size={32} /> },
      { name: 'Squarespace', icon: <Layout size={32} /> },
      { name: 'OpenCart', icon: <ShoppingBag size={32} /> },
      { name: 'Craft CMS', icon: <Layout size={32} /> },
      { name: 'Strapi', icon: <Layout size={32} /> },
      { name: 'Sanity', icon: <Layout size={32} /> },
      { name: 'Contentful', icon: <Layout size={32} /> },
      { name: 'Salesforce Commerce Cloud', icon: <Cloud size={32} /> },
      { name: 'Webflow', icon: <Layout size={32} /> },
      { name: 'CommerceTools', icon: <ShoppingBag size={32} /> }
    ],
    'Testing & QA': [
      { name: 'Selenium', icon: <Shield size={32} /> },
      { name: 'Cypress', icon: <Shield size={32} /> },
      { name: 'Playwright', icon: <Shield size={32} /> },
      { name: 'Jest', icon: <Check size={32} /> },
      { name: 'Appium', icon: <Smartphone size={32} /> },
      { name: 'Mocha', icon: <Check size={32} /> },
      { name: 'Puppeteer', icon: <Search size={32} /> },
      { name: 'Postman', icon: <Zap size={32} /> },
      { name: 'JMeter', icon: <BarChart size={32} /> },
      { name: 'K6', icon: <Zap size={32} /> }
    ],
    'Monitoring & Logging': [
      { name: 'Prometheus', icon: <BarChart size={32} /> },
      { name: 'Grafana', icon: <BarChart size={32} /> },
      { name: 'ELK Stack', icon: <Search size={32} /> },
      { name: 'New Relic', icon: <Zap size={32} /> }
    ],
    'API Management': [
      { name: 'Kong', icon: <Zap size={32} /> },
      { name: 'Apigee', icon: <Shield size={32} /> },
      { name: 'AWS API Gateway', icon: <Cloud size={32} /> },
      { name: 'MuleSoft', icon: <Network size={32} /> }
    ],
    'Security & Compliance': [
      { name: 'Auth0', icon: <Shield size={32} /> },
      { name: 'Okta', icon: <Shield size={32} /> },
      { name: 'Vault', icon: <Shield size={32} /> },
      { name: 'Checkov', icon: <Check size={32} /> }
    ]
  };

  const [activeTechCategory, setActiveTechCategory] = useState('Frontend');
  const [activeIndustry, setActiveIndustry] = useState('Healthcare');

  const defaultIndustryData: Record<string, any> = {
    Healthcare: {
      title: 'AI for Healthcare Industry',
      quote: '"Precision Diagnostics, Compassionate Care"',
      desc: 'Deploy AI models that help doctors diagnose diseases faster, optimize patient scheduling, and predict hospital readmissions to improve care quality.',
      impacts: ['Improve diagnostic accuracy by 25%', 'Reduce administrative overhead by 30%', 'Enhance patient triage and flow management.'],
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop'
    },
    'Private Investments': {
      title: 'AI for Venture Capital & Private Equity',
      quote: '"Smarter Investments, Stronger Returns"',
      desc: 'Deploy AI models that analyze market dynamics, identify undervalued opportunities, and optimize portfolio performance.',
      impacts: ['Make investment decisions with foresight', 'Reducing risk while maximizing ROI.'],
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2104&auto=format&fit=crop'
    },
    Retail: {
      title: 'AI for Retail Industry',
      quote: '"Personalization at Scale, Efficiency in Motion"',
      desc: 'From hyper-personalized recommendations to intelligent inventory and demand forecasting, AI transforms retail end-to-end.',
      impacts: ['Boost customer loyalty', 'Cut waste', 'Streamline operations.'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'
    },
    Manufacturing: {
      title: 'AI for Smart Manufacturing',
      quote: '"Zero Downtime, Maximized Throughput"',
      desc: 'Predict equipment failures before they happen, optimize supply chains in real-time, and automate quality control with computer vision.',
      impacts: ['Reduce unscheduled downtime by 45%', 'Optimize production throughput', 'Improve product quality assurance.'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
    },
    Finance: {
      title: 'AI for Financial Services',
      quote: '"Data-Driven Trust and Risk Mitigation"',
      desc: 'Harness AI for fraud detection, credit risk analysis, and real-time compliance monitoring.',
      impacts: ['Safeguard transactions', 'Improve customer trust', 'Strengthen financial governance.'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
    },
    Logistics: {
      title: 'AI for Logistics & Supply Chain',
      quote: '"Delivering Intelligence Across Every Mile"',
      desc: 'Optimize routes, automate warehouses, and forecast demand with AI-powered supply chain solutions.',
      impacts: ['Ensure faster deliveries', 'Cost-efficient logistics operations', 'Reliable end-to-end deliveries.'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop'
    }
  };

  const industryData = hc.industriesSection?.industries || defaultIndustryData;
  const currentData = industryData[activeIndustry] || industryData.Healthcare || defaultIndustryData.Healthcare;

  const defaultProducts = [
    {
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      badge: 'HR Tech',
      iconKey: 'ConsultingIcon',
      title: 'Smart HRMS',
      desc: 'Automate payroll, attendance, and recruitment with AI-driven insights.',
      features: ['Payroll Automation', 'Self-Service Portal', 'Performance Mgmt'],
      btnText: 'Explore HRMS',
      btnLink: '/contact'
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2104&auto=format&fit=crop',
      badge: 'EdTech',
      iconKey: 'UiUxIcon',
      title: 'EduTech Pro',
      desc: 'Comprehensive management system for schools and colleges.',
      features: ['Student Info System', 'Fee Management', 'E-Learning Integration'],
      btnText: 'Explore EduTech',
      btnLink: '/contact'
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
      badge: 'Enterprise',
      iconKey: 'ErpIcon',
      title: 'Enterprise Core',
      desc: 'Unified ERP solution for inventory, finance, and supply chain.',
      features: ['Inventory Control', 'Financial Accounting', 'CRM & Sales'],
      btnText: 'Explore ERP',
      btnLink: '/contact'
    }
  ];

  const products = hc.productsSection?.products || defaultProducts;

  const featuredPortfolio = (cms.portfolioProjects || []).filter((p) => p.featuredOnHome);
  const featuredCases =
    featuredPortfolio.length > 0
      ? featuredPortfolio
      : hc.featuredCasesSection?.cases || [
          {
            title: 'Delta Terminal V3 - Algo Trading',
            category: 'Development',
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop',
            desc: 'An algorithmic trading software featuring real-time crypto and asset streaming using Delta Exchange API.',
            tech: ['React', 'Delta API', 'WebSockets'],
            url: 'https://delta.gujjucode.com/'
          },
          {
            title: 'Global Link Holidays',
            category: 'Development',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
            desc: 'An interactive tour and travel booking platform providing seamless holiday planning.',
            tech: ['React', 'Node.js'],
            url: 'https://globallinkholidays.com/'
          }
        ];

  const statsList = hc.statsSection || [
    { value: '250+', label: 'Projects Completed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '15+', label: 'Years Experience' },
    { value: '50+', label: 'Expert Engineers' }
  ];

  return (
    <div className="home">
      <SEOHead pageKey="home" />

      {/* Hero Section (H1) */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        <div className="container hero-container">
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge-ai">
              <span className="green-dot"></span>
              {hc.hero?.badge || '✦ Global Digital Engineering Partner'}
            </span>
            <h1>
              {hc.hero?.h1Prefix || 'Architecting the future with'}{' '}
              <span className="gradient-text-hero">{hc.hero?.h1Highlight || 'AI, Cloud, and Code.'}</span>
            </h1>
          </motion.div>

          <motion.div
            className="hero-right"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              {hc.hero?.description ||
                'We engineer production-grade Generative AI, secure cloud architectures, and robust custom software systems that empower modern enterprises to scale.'}
            </p>
            <div className="hero-btns">
              <Link to={hc.hero?.ctaLink || '/contact'} className="btn-primary-pill">
                {hc.hero?.ctaText || 'Consult Our Experts'}
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="client-logos-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ClientLogos />
        </motion.div>
      </section>

      {/* Services Section (H2 -> H3) */}
      <section className="services section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-badge-pill">{hc.servicesSection?.badge || 'Services'}</span>
            <h2>{hc.servicesSection?.h2 || 'Comprehensive AI Solutions Tailored for Enterprise Transformation'}</h2>
            <p>
              {hc.servicesSection?.subtitle ||
                'We engineer advanced AI frameworks and deploy scalable solutions that optimize processes, empower decision-making, and accelerate innovation.'}
            </p>
          </div>

          <div className="services-grid">
            {servicesList.map((service: any, index: number) => (
              <motion.div
                key={index}
                className="service-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ translateY: -10 }}
              >
                <div className="service-icon">{iconMap[service.iconKey] || <CloudIcon />}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies Section (H2 -> H3) */}
      <section className="featured-cases section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-badge-pill">{hc.featuredCasesSection?.badge || 'Case Studies'}</span>
            <h2>{hc.featuredCasesSection?.h2 || 'Real-World Solutions of Digital Engineering'}</h2>
            <p>
              {hc.featuredCasesSection?.subtitle ||
                'Real-world projects demonstrating our capability in delivering high-impact, custom software development.'}
            </p>
          </div>

          <div className="cases-grid">
            {featuredCases.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                className="case-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -10 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="case-image">
                  <img src={item.image} alt={item.title} />
                  <span className="case-category">{item.category}</span>
                </div>
                <div className="case-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="case-tech">
                    {(item.tech || []).map((t: string, tIdx: number) => (
                      <span key={tIdx} className="tech-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="case-link">
                      Launch Project <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section (H2 -> H3) */}
      <section className="industries section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-badge-pill">{hc.industriesSection?.badge || 'Industries'}</span>
            <h2>{hc.industriesSection?.h2 || 'Redefining Sectors Through Smart AI Automation'}</h2>
            <p>
              {hc.industriesSection?.subtitle ||
                'We deploy purpose-built AI models to streamline operations and unlock new efficiency gains across diverse industries.'}
            </p>
          </div>

          <div className="industries-tabs-nav">
            {Object.keys(industryData).map((key) => {
              const isActive = activeIndustry === key;
              return (
                <button
                  key={key}
                  className={`industry-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveIndustry(key)}
                >
                  <span className="tab-icon">{industryIcons[key] || <Heart size={18} />}</span>
                  <span className="tab-label">{key}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndustry}
              className="industry-showcase-panel glass-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="showcase-info">
                <h3>{currentData.title}</h3>
                <span className="showcase-quote">{currentData.quote}</span>
                <p className="showcase-desc">{currentData.desc}</p>

                <div className="showcase-impact-card">
                  <span className="impact-title">Impact</span>
                  <ul className="impact-list">
                    {(currentData.impacts || []).map((imp: string, idx: number) => (
                      <li key={idx}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="impact-check-icon">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <polyline points="8 12 11 15 16 10" />
                        </svg>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="showcase-media">
                <img src={currentData.image} alt={currentData.title} className="showcase-img" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* AI Tools Section (H2 -> H3) */}
      <section className="ai-tools section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-badge-pill">{hc.aiToolsSection?.badge || 'Productivity'}</span>
            <h2>{hc.aiToolsSection?.h2 || 'Accelerate Product Development by 10X'}</h2>
            <p>
              {hc.aiToolsSection?.subtitle ||
                'We leverage advanced AI engineering systems to launch your Minimum Viable Product in just 15 days.'}
            </p>
          </div>

          <div className="ai-tools-grid">
            {aiToolGroups.map((group: any, index: number) => (
              <motion.div
                key={index}
                className="tool-group-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="tool-group-header">
                  <h3>{group.title}</h3>
                </div>
                <div className="tool-list">
                  {(group.tools || []).map((tool: any, tIndex: number) => (
                    <div key={tIndex} className="tool-item">
                      <div className="tool-info">
                        <span className="tool-icon-placeholder">{group.icon}</span>
                        <span className="tool-name">{tool.name}</span>
                      </div>
                      <div className="tool-stats">
                        <div className="stats-dots"></div>
                        <span className="tool-value">{tool.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section (H2 -> H3) */}
      <section className="products section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-badge-pill">{hc.productsSection?.badge || 'Our Solutions'}</span>
            <h2>{hc.productsSection?.h2 || 'Enterprise-Ready Platforms Built for Growth'}</h2>
            <p>
              {hc.productsSection?.subtitle ||
                'Accelerate your business operations with our robust, scalable, and intelligent software platforms.'}
            </p>
          </div>

          <div className="products-grid">
            {products.map((product: any, index: number) => (
              <motion.div
                key={index}
                className="product-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                  <span className="product-badge">{product.badge}</span>
                </div>
                <div className="product-content">
                  <div className="product-icon-wrap">{iconMap[product.iconKey] || <ErpIcon />}</div>
                  <h3>{product.title}</h3>
                  <p>{product.desc}</p>
                  <ul className="product-features">
                    {(product.features || []).map((feature: string, fIndex: number) => (
                      <li key={fIndex}>
                        <Check size={16} className="check-icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={product.btnLink || '/contact'} className="product-btn">
                    {product.btnText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work With Section (H2 -> H3) */}
      <section className="work-with section-padding">
        <div className="container">
          <div className="section-header align-left">
            <h2>{hc.workWithSection?.h2 || 'We work with'}</h2>
            <p>{hc.workWithSection?.subtitle || 'Tailored Technology Services for Every Business—from Startups to Enterprises.'}</p>
          </div>

          <div className="work-with-grid">
            <motion.div
              className="work-card startup"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
            >
              <div className="work-card-header">
                <div className="work-icon-circle">
                  <Lightbulb size={24} />
                </div>
                <h3>{hc.workWithSection?.cards?.[0]?.title || 'Startups Business'}</h3>
              </div>
              <p>
                {hc.workWithSection?.cards?.[0]?.desc ||
                  'Our expertise in MVP development, rapid prototyping, and flexible engagement models, enables us to give startups the ability to transition from MVP to full-scale product launch.'}
              </p>
            </motion.div>

            <motion.div
              className="work-card small-biz"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="work-card-header">
                <div className="work-icon-circle">
                  <Briefcase size={24} />
                </div>
                <h3>{hc.workWithSection?.cards?.[1]?.title || 'Small Business'}</h3>
              </div>
              <p>
                {hc.workWithSection?.cards?.[1]?.desc ||
                  "Small businesses are always looking to scale and enhance efficiency through technology. That's where we add immense value with end-to-end custom technology solutions under one roof."}
              </p>
            </motion.div>

            <motion.div
              className="work-card enterprise-biz"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="work-card-header">
                <div className="work-icon-circle">
                  <Building2 size={24} />
                </div>
                <h3>{hc.workWithSection?.cards?.[2]?.title || 'Enterprise Business'}</h3>
              </div>
              <p>
                {hc.workWithSection?.cards?.[2]?.desc ||
                  'We are a high-end product development company, building enterprise grade tech solutions that drive real business impact for clients worldwide.'}
              </p>
            </motion.div>

            <motion.div
              className="work-card agency-biz"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="work-card-header">
                <div className="work-icon-circle">
                  <Handshake size={24} />
                </div>
                <h3>{hc.workWithSection?.cards?.[3]?.title || 'Agency Business'}</h3>
              </div>
              <p>
                {hc.workWithSection?.cards?.[3]?.desc ||
                  'We offer a no-obligation business analysis process, 360 degree technology consultation, go-to-market strategy, and tailored services to help agencies scale efficiently.'}
              </p>
            </motion.div>

            <motion.div
              className="work-card cta-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3>{hc.workWithSection?.ctaCard?.title || 'Bringing Innovation Together'}</h3>
              <p>
                {hc.workWithSection?.ctaCard?.desc ||
                  "AarviCloud's R&D team keeps us ahead of the curve in technology adoption and execution, ensuring our clients always benefit from the latest innovations and cutting-edge solutions."}
              </p>
              <Link to={hc.workWithSection?.ctaCard?.btnLink || '/contact'} className="work-cta-btn">
                {hc.workWithSection?.ctaCard?.btnText || 'Get in Touch!'} <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section (H2) */}
      <section className="tech-stack section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-badge-pill">Tech Stack</span>
            <h2>Technologies We Master to Build the Future</h2>
            <p>Our curated ecosystem of advanced tools, frameworks, and programming languages we use to engineer custom enterprise products.</p>
          </div>

          <div className="ts-container">
            <div className="ts-sidebar">
              {Object.keys(techStack).map((cat) => (
                <button
                  key={cat}
                  className={`ts-nav-item ${activeTechCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveTechCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="ts-main glass-card">
              <motion.div
                className="ts-grid"
                key={activeTechCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {techStack[activeTechCategory as keyof typeof techStack].map((tech, index) => (
                  <div key={index} className="tech-item">
                    <div className="tech-icon-wrap">{tech.icon}</div>
                    <span className="tech-name">{tech.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats section-padding">
        <div className="container stats-grid">
          {statsList.map((st: any, idx: number) => (
            <div key={idx} className="stat-item">
              <h3>{st.value}</h3>
              <p>{st.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
