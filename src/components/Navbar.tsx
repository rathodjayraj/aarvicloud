import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import headerLogoDefault from '../assets/header_logo.png';
import { useCMS } from '../context/CMSContext';
import './Navbar.css';


const Navbar = () => {
  const { cms } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const headerLogo =
    cms.siteSettings?.headerLogoUrl && cms.siteSettings.headerLogoUrl !== '/logo.png'
      ? cms.siteSettings.headerLogoUrl
      : '/header_logo.png';
  const siteName = cms.siteSettings?.siteName || 'AarviCloud';

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Digital Marketing', path: '/digital-marketing' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img
            src={headerLogo}
            alt={siteName}
            className="logo-img"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              if (!t.src.endsWith('/header_logo.png')) {
                t.src = '/header_logo.png';
              } else {
                t.src = headerLogoDefault;
              }
            }}
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={isActive(link.path) ? 'active' : ''}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <div className="nav-action-pill">
              <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/contact" className="nav-btn-link">Let's talk</Link>
            </div>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ul className="mobile-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={isActive(link.path) ? 'active' : ''}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <div className="nav-action-pill">
                  <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <Link to="/contact" className="nav-btn-link">Let's talk</Link>
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
