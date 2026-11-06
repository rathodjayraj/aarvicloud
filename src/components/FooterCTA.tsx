import { Link, useLocation } from 'react-router-dom';
import './FooterCTA.css';

const FooterCTA = () => {
  const location = useLocation();

  // Hide the CTA on the contact page
  if (location.pathname === '/contact') {
    return null;
  }

  return (
    <section className="footer-cta">
      {/* Background Orbiting Balls Animation */}
      <div className="orbit-container">
        <div className="orbit-ring orbit-ring-1">
          <div className="orbit-ball orbit-ball-gold"></div>
        </div>
        <div className="orbit-ring orbit-ring-2">
          <div className="orbit-ball orbit-ball-silver"></div>
        </div>
        <div className="orbit-ring orbit-ring-3">
          <div className="orbit-ball orbit-ball-cyan"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container cta-content-wrap">
        <span className="cta-subtitle">Need help with a project?</span>
        <h2 className="cta-heading-gradient">Let's talk!</h2>
        <p className="cta-desc">
          Every enterprise is unique. Let's design a tailored AI framework that elevates your business performance.
        </p>
        <Link to="/contact" className="cta-btn-pill">
          Contact us
        </Link>
      </div>
    </section>
  );
};

export default FooterCTA;
