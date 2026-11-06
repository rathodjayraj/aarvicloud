import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CustomPage from './pages/CustomPage';
import DigitalMarketing from './pages/DigitalMarketing';
import AdminPanel from './pages/AdminPanel';
import FluidCursor from './components/FluidCursor';
import ScrollToTop from './components/ScrollToTop';
import FooterCTA from './components/FooterCTA';
import { CMSProvider } from './context/CMSContext';
import './index.css';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`app ${isAdmin ? 'admin-layout' : ''}`}>
      <ScrollToTop />
      {!isAdmin && <FluidCursor />}
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? 'admin-main' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-study/:id" element={<CaseStudyDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/p/:slug" element={<CustomPage />} />
          <Route path="/digital-marketing" element={<DigitalMarketing />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      {!isAdmin && <FooterCTA />}
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CMSProvider>
      <Router>
        <AppContent />
      </Router>
    </CMSProvider>
  );
}

export default App;
