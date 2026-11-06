import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ArrowRight, Briefcase, Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MissionIcon, VisionIcon, CommitmentIcon, CoreSecurityIcon } from '../components/AnimatedIcon';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './About.css';
import ownerImg from '../assets/onwner.jpg';

const valueIcons: Record<string, React.ReactNode> = {
  MissionIcon: <MissionIcon />,
  VisionIcon: <VisionIcon />,
  CommitmentIcon: <CommitmentIcon />,
  CoreSecurityIcon: <CoreSecurityIcon />
};

const About = () => {
  const { cms } = useCMS();
  const ac = cms.aboutContent || {};
  const [activeModel, setActiveModel] = useState<'fixed' | 'dedicated'>('fixed');

  const defaultValues = [
    {
      iconKey: 'MissionIcon',
      title: 'Our Mission',
      desc: 'To engineer secure, scalable cloud solutions and custom software systems that empower global enterprises to achieve operational excellence.'
    },
    {
      iconKey: 'VisionIcon',
      title: 'Our Vision',
      desc: 'To pioneer next-generation digital engineering, setting the global standard for AI integrations and secure IT infrastructure solutions.'
    },
    {
      iconKey: 'CommitmentIcon',
      title: 'Our Commitment',
      desc: 'To deliver unmatched technical expertise and support that guarantees project success, from discovery to global deployment.'
    },
    {
      iconKey: 'CoreSecurityIcon',
      title: 'Core Security',
      desc: 'To embed security-first engineering practices in every layer, safeguarding enterprise assets with advanced threat mitigation.'
    }
  ];

  const defaultTimeline = [
    { year: '2011', title: 'Company Founding', desc: 'AarviCloud was established with a vision to simplify enterprise cloud adoption.' },
    { year: '2015', title: 'International Growth', desc: 'Expanded our services globally, delivering tailored custom software and cloud solutions to international markets.' },
    { year: '2019', title: 'SecOps Infrastructure', desc: 'Formed our dedicated cyber security division to engineer hardened architectures for data protection.' },
    { year: '2023', title: 'Enterprise AI Integration', desc: 'Pioneered the integration of generative AI pipelines and intelligent automation systems into client workflows.' }
  ];

  const defaultSteps = [
    { title: 'Tech Discovery', desc: 'We analyze your technical requirements, codebases, and existing cloud infrastructure.' },
    { title: 'AI & Cloud Architecture', desc: 'Designing a secure, scalable blueprint and roadmap tailored for your systems.' },
    { title: 'Digital Deployment', desc: 'Building, testing, and deploying robust applications with high uptime.' },
    { title: 'Continuous Monitoring', desc: 'Ongoing optimization, performance tuning, and proactively mitigating threats.' }
  ];

  const values = ac.values || defaultValues;
  const timeline = ac.timeline || defaultTimeline;
  const steps = ac.steps || defaultSteps;
  const team = (ac.team && ac.team.length > 0 ? ac.team : [{ name: 'Jayraj Rathod', role: 'CEO & Founder', image: ownerImg }]).map(
    (m: any) => ({
      ...m,
      image: m.image || ownerImg
    })
  );

  const paragraphs = ac.whoWeAreParagraphs || [
    'Since 2011, AarviCloud has been a trusted digital transformation partner and custom software development company. We specialize in helping modern enterprises navigate the complex landscapes of cloud computing, custom software engineering, and corporate cyber security consulting.',
    'Our global team of senior engineers and certified cloud architects work around the clock to ensure your IT infrastructures are fully optimized, secure, and ready to scale. We build high-availability architectures and integrate generative AI pipelines to automate your operations and maximize productivity.'
  ];

  const features = ac.features || [
    { value: '12+ Years', label: 'In Industry' },
    { value: '500+', label: 'Global Clients' }
  ];

  return (
    <div className="about">
      <SEOHead pageKey="about" />

      {/* Hero Section (H1 -> H2 -> H3) */}
      <section className="about-hero section-padding">
        <div className="container">
          <motion.div
            className="about-header text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>
              {ac.heroTitlePrefix || 'About'}{' '}
              <span className="gradient-text">{ac.heroTitleHighlight || 'AarviCloud'}</span>
            </h1>
            <p className="subtitle">
              {ac.heroSubtitle || 'Innovating secure enterprise AI, Cloud Solutions, and Software Engineering.'}
            </p>
          </motion.div>

          <div className="about-grid">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>{ac.whoWeAreHeading || 'Who We Are'}</h2>
              {paragraphs.map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
              <div className="about-features">
                {features.map((feat: any, idx: number) => (
                  <div className="feature" key={idx}>
                    <h3>{feat.value}</h3>
                    <p>{feat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="about-image"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="image-stack">
                <img
                  src={ac.aboutImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop'}
                  alt="AarviCloud Engineering Team"
                  className="img-main"
                />
                <div className="img-accent glass-card">
                  <Award size={40} className="text-primary" />
                  <h3>{ac.awardBadgeText || 'Award Winning IT Partner'}</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Section (H2 -> H3) */}
      <section className="journey section-padding surface-bg">
        <div className="container">
          <div className="section-header text-center">
            <h2>
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p>{ac.journeySubtitle || 'From humble beginnings to global reach.'}</p>
          </div>
          <div className="timeline">
            {timeline.map((item: any, i: number) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content glass-card">
                  <span className="year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section (H2 -> H3) */}
      <section className="values section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2>
              Our Core <span className="gradient-text">Values</span>
            </h2>
            <p>{ac.valuesSubtitle || 'The principles that guide everything we do.'}</p>
          </div>
          <div className="values-grid">
            {values.map((v: any, i: number) => (
              <motion.div
                key={i}
                className="value-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="value-icon">{valueIcons[v.iconKey] || <MissionIcon />}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (H2 -> H3) */}
      <section className="team section-padding surface-bg">
        <div className="container">
          <div className="section-header text-center">
            <h2>
              Meet Our <span className="gradient-text">Leadership</span>
            </h2>
            <p>{ac.teamSubtitle || 'The visionaries behind our success.'}</p>
          </div>
          <div className="team-grid">
            {team.map((member: any, i: number) => (
              <motion.div
                key={i}
                className="team-card glass-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section (H2 -> H3) */}
      <section className="process section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2>
              How We <span className="gradient-text">Work</span>
            </h2>
            <p>{ac.processSubtitle || 'A proven methodology for digital success.'}</p>
          </div>
          <div className="process-grid">
            {steps.map((step: any, i: number) => (
              <motion.div
                key={i}
                className="process-step"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="step-number">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models Section (H2 -> H3 -> H4) */}
      <section className="engagement section-padding surface-bg">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge-pill">ENGAGEMENT MODELS THAT WORK FOR YOU</span>
            <h2 style={{ marginTop: '1.5rem' }}>
              Engagement Models <span className="gradient-text">That Work For You</span>
            </h2>
            <p>Choose the collaboration model that perfectly aligns with your project requirements, budget, and business objectives.</p>
          </div>

          <div className="model-tabs-container">
            <div className="model-tabs glass-card">
              <button
                className={`model-tab-btn ${activeModel === 'fixed' ? 'active-fixed' : ''}`}
                onClick={() => setActiveModel('fixed')}
              >
                <Briefcase size={18} /> Fixed-Scope Projects
              </button>
              <button
                className={`model-tab-btn ${activeModel === 'dedicated' ? 'active-dedicated' : ''}`}
                onClick={() => setActiveModel('dedicated')}
              >
                <Users size={18} /> Dedicated Team Model
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeModel === 'fixed' ? (
              <motion.div
                key="fixed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="model-content-card glass-card"
              >
                <div className="model-header-row">
                  <div className="model-icon-box box-fixed">
                    <Briefcase size={28} />
                  </div>
                  <div className="model-title-wrap">
                    <h3>Fixed-Scope Projects</h3>
                    <span className="model-badge badge-fixed">Best for Defined Projects</span>
                  </div>
                </div>

                <p className="model-desc">
                  Perfect for projects with clearly defined requirements and deliverables. You receive a comprehensive upfront quote covering all aspects—development, design, testing, deployment, and project management. Enjoy predictable costs, guaranteed timelines, and complete peace of mind.
                </p>

                <div className="benefits-container">
                  <h4>Key Benefits:</h4>
                  <ul className="benefits-list list-fixed">
                    <li>
                      <div className="check-circle circle-fixed"><Check size={14} /></div>
                      <span>Predictable costs with upfront comprehensive quote</span>
                    </li>
                    <li>
                      <div className="check-circle circle-fixed"><Check size={14} /></div>
                      <span>Guaranteed timelines and deliverables</span>
                    </li>
                    <li>
                      <div className="check-circle circle-fixed"><Check size={14} /></div>
                      <span>Complete peace of mind with fixed scope</span>
                    </li>
                    <li>
                      <div className="check-circle circle-fixed"><Check size={14} /></div>
                      <span>All-inclusive: development, design, testing & deployment</span>
                    </li>
                  </ul>
                </div>

                <div className="ideal-footer footer-fixed">
                  <strong>Ideal for:</strong> Product launches, platform migrations, feature implementations
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dedicated"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="model-content-card glass-card"
              >
                <div className="model-header-row">
                  <div className="model-icon-box box-dedicated">
                    <Users size={28} />
                  </div>
                  <div className="model-title-wrap">
                    <h3>Dedicated Team Model</h3>
                    <span className="model-badge badge-dedicated">Maximum Flexibility</span>
                  </div>
                </div>

                <p className="model-desc">
                  Extend your in-house capabilities with a dedicated team of specialists who work exclusively on your projects. This model offers maximum flexibility and control—scale resources up or down, pivot directions, and maintain direct communication with your team.
                </p>

                <div className="benefits-container">
                  <h4>Key Benefits:</h4>
                  <ul className="benefits-list list-dedicated">
                    <li>
                      <div className="check-circle circle-dedicated"><Check size={14} /></div>
                      <span>Scale resources up or down as needed</span>
                    </li>
                    <li>
                      <div className="check-circle circle-dedicated"><Check size={14} /></div>
                      <span>Direct communication with your dedicated team</span>
                    </li>
                    <li>
                      <div className="check-circle circle-dedicated"><Check size={14} /></div>
                      <span>Pay only for actual hours worked</span>
                    </li>
                    <li>
                      <div className="check-circle circle-dedicated"><Check size={14} /></div>
                      <span>Senior-level talent fully integrated into workflows</span>
                    </li>
                  </ul>
                </div>

                <div className="ideal-footer footer-dedicated">
                  <strong>Ideal for:</strong> Ongoing development, long-term projects, technology partnerships
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section (H2) */}
      <section className="about-cta section-padding">
        <div className="container">
          <motion.div
            className="cta-card glass-card text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>
              Ready to Transform Your <span className="gradient-text">Business</span>?
            </h2>
            <p>{ac.ctaSubtitle || 'Join over 500+ global clients who trust AarviCloud for their digital infrastructure.'}</p>
            <div className="cta-btns">
              <Link to={ac.ctaPrimaryLink || '/contact'} className="btn-primary">
                {ac.ctaPrimaryText || 'Work With Us'}
              </Link>
              <Link to={ac.ctaSecondaryLink || '/portfolio'} className="btn-secondary">
                {ac.ctaSecondaryText || 'View Our Work'} <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
