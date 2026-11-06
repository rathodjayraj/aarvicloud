import React, { useState, useEffect } from 'react';
import { 
  Lock, Save, RefreshCw, Plus, Trash2, Edit3, 
  Globe, FileText, Briefcase, Mail, Check, ExternalLink, Database, Layers,
  Sun, Moon, AlertTriangle, ArrowLeft, Sparkles
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import TinyEditor from '../components/TinyEditor';
import './AdminPanel.css';

function slugify(text: string) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const AdminPanel = () => {
  const { cms, refreshCMS } = useCMS();
  const [token, setToken] = useState(() => localStorage.getItem('aarvicloud_admin_jwt') || '');
  const [, setAdminUser] = useState<any>(null);

  // Light / Dark Theme Mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Login form
  const [loginEmail, setLoginEmail] = useState('rathodjayraj94@gmail.com');
  const [loginPassword, setLoginPassword] = useState('Aarvicloud@2026');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Data & Tabs
  const [activeTab, setActiveTab] = useState<'seo' | 'pageseo' | 'blogs' | 'portfolio' | 'casestudies' | 'custompages' | 'sections' | 'contacts' | 'system'>('seo');
  const [adminData, setAdminData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Selected sub-items for editing
  const [selectedPageSeoKey, setSelectedPageSeoKey] = useState<string>('home');
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<any>(null);
  const [editingCustomPage, setEditingCustomPage] = useState<any>(null);

  // Fetch Admin Full CMS State with timeout & recovery handling
  const fetchAdminData = async (authToken: string) => {
    setLoadingData(true);
    setDataError('');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const res = await fetch('/api/admin/cms', {
        headers: { Authorization: `Bearer ${authToken}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
        setDataError('');
      } else if (res.status === 401) {
        setToken('');
        localStorage.removeItem('aarvicloud_admin_jwt');
      } else {
        const errJson = await res.json().catch(() => ({}));
        setDataError(errJson.error || `Server responded with status ${res.status}. Ensure backend server is running on port 5000.`);
      }
    } catch (err: any) {
      console.warn('Admin CMS fetch failed:', err);
      setDataError(
        err.name === 'AbortError'
          ? 'Connection timed out. The backend server on port 5000 is taking too long to respond.'
          : 'Cannot connect to backend server. Make sure "npm run server" is running on port 5000.'
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setAdminUser(data.user);
        localStorage.setItem('aarvicloud_admin_jwt', data.token);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Server network error. Ensure server is running on port 5000.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setToken('');
    setAdminData(null);
    localStorage.removeItem('aarvicloud_admin_jwt');
  };

  const notifySave = (msg = 'Changes saved successfully to Supabase!') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 4000);
    refreshCMS();
  };

  // 1. Save Site Settings (Favicon, 1200x630 OG Image, robots.txt, domain)
  const saveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/site-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(adminData.siteSettings)
    });
    if (res.ok) {
      notifySave('Site & Global SEO settings saved & synced to Supabase!');
      refreshCMS();
    }
  };

  // Image Upload Handler (Proxies through backend, hides Supabase Storage URL)
  const handleFileUpload = async (file: File, onDone: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          dataUrl: base64
        })
      });
      if (res.ok) {
        const data = await res.json();
        onDone(data.url);
      } else {
        alert('File upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. Save Per-Page SEO
  const savePageSeo = async (pageKey: string) => {
    const pageConfig = adminData.pageSeo[pageKey];
    const res = await fetch(`/api/admin/page-seo/${pageKey}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(pageConfig)
    });
    if (res.ok) {
      notifySave(`Page SEO for "${pageKey}" saved & synced!`);
    }
  };

  // 3. Blog Save & Delete
  const saveBlog = async (blogObj: any) => {
    const isNew = !blogObj.id || blogObj.id === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/admin/blogs' : `/api/admin/blogs/${blogObj.id}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(blogObj)
    });
    if (res.ok) {
      const d = await res.json();
      setAdminData((prev: any) => ({ ...prev, blogs: d.blogs }));
      setEditingBlog(null);
      notifySave('Blog post saved! XML Sitemap automatically updated.');
    }
  };

  const deleteBlog = async (id: number) => {
    if (!window.confirm('Delete this blog post? It will be removed from sitemap.xml automatically.')) return;
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const d = await res.json();
      setAdminData((prev: any) => ({ ...prev, blogs: d.blogs }));
      notifySave('Blog deleted & sitemap.xml updated.');
    }
  };

  // 4. Portfolio Save & Delete
  const savePortfolio = async (item: any) => {
    const isNew = !item.id || item.id === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/admin/portfolio' : `/api/admin/portfolio/${item.id}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(item)
    });
    if (res.ok) {
      const d = await res.json();
      setAdminData((prev: any) => ({ ...prev, portfolioProjects: d.portfolioProjects }));
      setEditingPortfolio(null);
      notifySave('Portfolio project saved & sitemap.xml updated!');
    }
  };

  const deletePortfolio = async (id: number) => {
    if (!window.confirm('Delete this portfolio project? It will be removed from sitemap.xml automatically.')) return;
    const res = await fetch(`/api/admin/portfolio/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const d = await res.json();
      setAdminData((prev: any) => ({ ...prev, portfolioProjects: d.portfolioProjects }));
      notifySave('Portfolio project deleted & sitemap.xml updated.');
    }
  };

  // 5. Case Study Save & Delete
  const saveCaseStudy = async (cs: any) => {
    const isNew = !cs.id || cs.id === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/admin/case-studies' : `/api/admin/case-studies/${cs.id}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cs)
    });
    if (res.ok) {
      const d = await res.json();
      setAdminData((prev: any) => ({ ...prev, caseStudies: d.caseStudies }));
      setEditingCaseStudy(null);
      notifySave('Case study saved! XML Sitemap automatically updated.');
    }
  };

  const deleteCaseStudy = async (id: number) => {
    if (!window.confirm('Delete this case study? It will be removed from sitemap.xml automatically.')) return;
    const res = await fetch(`/api/admin/case-studies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const d = await res.json();
      setAdminData((prev: any) => ({ ...prev, caseStudies: d.caseStudies }));
      notifySave('Case study deleted & sitemap.xml updated.');
    }
  };

  // 6. Custom SEO Pages Save & Delete
  const saveCustomPage = async (cp: any) => {
    const isNew = !cp.id || cp.id === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/admin/custom-pages' : `/api/admin/custom-pages/${cp.id}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cp)
    });
    if (res.ok) {
      const d = await res.json();
      setAdminData((prev: any) => ({ ...prev, customPages: d.customPages }));
      setEditingCustomPage(null);
      notifySave('Custom SEO page saved! Available at /p/:slug and in sitemap.xml.');
    }
  };

  const deleteCustomPage = async (id: number) => {
    if (!window.confirm('Delete this custom page? It will be removed from sitemap.xml.')) return;
    const res = await fetch(`/api/admin/custom-pages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const d = await res.json();
      setAdminData((prev: any) => ({ ...prev, customPages: d.customPages }));
      notifySave('Custom page deleted.');
    }
  };

  // 7. Sync Supabase Tables
  const triggerSupabaseSync = async () => {
    const res = await fetch('/api/admin/sync-supabase', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const d = await res.json();
      notifySave(d.message);
      fetchAdminData(token);
    }
  };

  // Not logged in -> Render Login Screen
  if (!token) {
    return (
      <div className="admin-login-wrapper">
        <SEOHead title="Admin Login | AarviCloud Control Panel" robots="noindex, nofollow" />
        <div className="admin-login-card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleTheme}
              className="admin-btn-action"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ borderRadius: '2rem', padding: '0.3rem 0.75rem' }}
            >
              {theme === 'dark' ? <Sun size={14} style={{ color: '#f59e0b' }} /> : <Moon size={14} style={{ color: '#4f46e5' }} />}
              <span style={{ fontSize: '0.8rem' }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1rem' }}>
              <Lock size={32} />
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>AarviCloud Admin</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              Sign in with your Supabase credentials to manage content &amp; SEO.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-form-group">
              <label>Admin Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            {loginError && (
              <div style={{ color: '#ef4444', fontSize: '0.88rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.6rem 0.8rem', borderRadius: '0.4rem' }}>
                {loginError}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            <a href="/" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ← Back to Website
            </a>
            <span>🔒 Strict URL Security</span>
          </div>
        </div>
      </div>
    );
  }

  // 1. Actively Loading Screen (with timeout hint)
  if (loadingData && !adminData && !dataError) {
    return (
      <div className="admin-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <SEOHead title="Loading Admin Panel..." robots="noindex, nofollow" />
        <RefreshCw size={36} className="animate-spin text-primary" style={{ margin: '0 auto 1.5rem' }} />
        <h2>Loading AarviCloud CMS &amp; SEO Engine...</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.6rem' }}>
          Connecting to backend server on port 5000...
        </p>
      </div>
    );
  }

  // 2. Failed to load Admin Data -> Clear actionable recovery screen
  if (dataError || !adminData) {
    return (
      <div className="admin-login-wrapper">
        <SEOHead title="Backend Offline | AarviCloud Admin" robots="noindex, nofollow" />
        <div className="admin-login-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: '#ef4444', marginBottom: '1rem' }}>
            <AlertTriangle size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Backend Server Offline</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
            {dataError || 'The admin panel cannot connect to the Express server on port 5000.'}
          </p>

          <div style={{ background: 'var(--bg-input, rgba(0,0,0,0.04))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Why this happens &amp; How to fix:</strong>
            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
              Vite (frontend) is running, but the Express backend server (<code>node server/index.js</code>) is not running on port 5000.
            </p>
            <ol style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6', color: 'var(--text-dim)' }}>
              <li>Open a terminal in the project directory: <code>d:\aarvicloud</code></li>
              <li>Start the server: <code style={{ color: 'var(--primary)', fontWeight: 600 }}>npm run server</code></li>
              <li>Once running, click <strong>Retry Connection</strong> below.</li>
            </ol>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ justifyContent: 'center', width: '100%' }}
              onClick={() => fetchAdminData(token)}
            >
              <RefreshCw size={16} /> Retry Connection
            </button>

            <button
              type="button"
              className="admin-btn-action"
              style={{ justifyContent: 'center', width: '100%', padding: '0.65rem' }}
              onClick={() => {
                setAdminData({
                  ...cms,
                  systemStatus: {
                    supabaseConnected: false,
                    pgTablesReady: false,
                    lastSyncAt: new Date().toISOString(),
                    projectName: 'Aarvicloud (Standby Cache)',
                    networkProxyActive: false
                  }
                });
                setDataError('');
              }}
            >
              <Database size={16} /> Load Available Standby CMS Data
            </button>

            <button
              type="button"
              className="admin-btn-action admin-btn-danger"
              style={{ justifyContent: 'center', width: '100%', padding: '0.65rem' }}
              onClick={handleLogout}
            >
              <ArrowLeft size={16} /> Sign Out &amp; Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ss = adminData.siteSettings || {};
  const sys = adminData.systemStatus || {};

  return (
    <div className="admin-container">
      <SEOHead title="AarviCloud Admin Panel | Dynamic CMS &amp; SEO Suite" robots="noindex, nofollow" />

      {/* Admin Top Sticky Bar */}
      <div className="admin-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <img
            src={ss.headerLogoUrl || '/logo.png'}
            alt="Brand Logo"
            style={{ height: '30px', width: 'auto', maxHeight: '30px', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700 }}>AarviCloud Admin</h2>
          <span className={`admin-badge ${sys.supabaseConnected ? 'badge-success' : 'badge-warning'}`}>
            {sys.supabaseConnected ? '● Supabase Connected' : '● Local Cache'}
          </span>
          <span className="admin-badge badge-info">
            🔒 Network URL Hidden
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {saveStatus && (
            <span style={{ color: '#10b981', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Check size={16} /> {saveStatus}
            </span>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="admin-btn-action"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={15} style={{ color: '#f59e0b' }} /> : <Moon size={15} style={{ color: '#4f46e5' }} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <a href="/" target="_blank" rel="noreferrer" className="admin-btn-action">
            <ExternalLink size={14} /> View Website
          </a>
          <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="admin-btn-action">
            <Globe size={14} /> /sitemap.xml
          </a>
          <a href="/robots.txt" target="_blank" rel="noreferrer" className="admin-btn-action">
            <FileText size={14} /> /robots.txt
          </a>
          <button onClick={handleLogout} className="admin-btn-action admin-btn-danger">
            Sign Out
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button className={`admin-tab-btn ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>
            <Globe size={16} /> Global SEO &amp; Branding
          </button>
          <button className={`admin-tab-btn ${activeTab === 'pageseo' ? 'active' : ''}`} onClick={() => setActiveTab('pageseo')}>
            <FileText size={16} /> Page SEO (Meta/OG/Robots)
          </button>
          <button className={`admin-tab-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
            <Edit3 size={16} /> Blogs ({adminData.blogs?.length || 0})
          </button>
          <button className={`admin-tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
            <Briefcase size={16} /> Portfolio ({adminData.portfolioProjects?.length || 0})
          </button>
          <button className={`admin-tab-btn ${activeTab === 'casestudies' ? 'active' : ''}`} onClick={() => setActiveTab('casestudies')}>
            <Layers size={16} /> Case Studies ({adminData.caseStudies?.length || 0})
          </button>
          <button className={`admin-tab-btn ${activeTab === 'custompages' ? 'active' : ''}`} onClick={() => setActiveTab('custompages')}>
            <Plus size={16} /> Custom SEO Pages ({adminData.customPages?.length || 0})
          </button>
          <button className={`admin-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
            <Mail size={16} /> Inquiries ({adminData.contactSubmissions?.length || 0})
          </button>
          <button className={`admin-tab-btn ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
            <Database size={16} /> Supabase &amp; SQL Schema
          </button>
        </div>

        {/* TAB 1: Global SEO & Branding (Favicon, 1200x630 OG Image, robots.txt) */}
        {activeTab === 'seo' && (
          <form onSubmit={saveSiteSettings} className="admin-card">
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={22} className="text-primary" /> Global SEO &amp; Branding Settings
            </h2>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Website Name</label>
                <input
                  type="text"
                  value={ss.siteName || ''}
                  onChange={(e) => setAdminData({ ...adminData, siteSettings: { ...ss, siteName: e.target.value } })}
                />
              </div>

              <div className="admin-form-group">
                <label>Production Domain (for Canonical, og:url, and sitemap.xml)</label>
                <input
                  type="text"
                  value={ss.siteDomain || ''}
                  onChange={(e) => setAdminData({ ...adminData, siteSettings: { ...ss, siteDomain: e.target.value } })}
                />
              </div>

              <div className="admin-form-group">
                <label>Global Default Meta Robots (Indexability)</label>
                <select
                  value={ss.defaultMetaRobots || 'index, follow'}
                  onChange={(e) => setAdminData({ ...adminData, siteSettings: { ...ss, defaultMetaRobots: e.target.value } })}
                >
                  <option value="index, follow">index, follow (Allow Search Engines to Index &amp; Crawl)</option>
                  <option value="noindex, follow">noindex, follow (Do Not Index, But Follow Links)</option>
                  <option value="index, nofollow">index, nofollow (Index Page, Do Not Follow Links)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Complete Disallow from Indexing)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Google Site Verification ID</label>
                <input
                  type="text"
                  placeholder="e.g. google-site-verification code"
                  value={ss.googleSiteVerification || ''}
                  onChange={(e) => setAdminData({ ...adminData, siteSettings: { ...ss, googleSiteVerification: e.target.value } })}
                />
              </div>
            </div>

            {/* Header Logo / Brand Icon */}
            <div className="admin-subcard" style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Header Logo / Brand Icon (Navbar)</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Appears at the top of every page in the primary navigation header. Recommended: High-res transparent PNG, SVG, or WEBP (e.g. 180×45px).
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '180px', height: '70px', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: '0.5rem' }}>
                  <img
                    src={ss.headerLogoUrl || '/header_logo.jpg'}
                    alt="Header Logo Preview"
                    style={{ maxHeight: '46px', maxWidth: '160px', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <input
                    type="text"
                    value={ss.headerLogoUrl || ''}
                    placeholder="/logo.png or https://..."
                    onChange={(e) => setAdminData({ ...adminData, siteSettings: { ...ss, headerLogoUrl: e.target.value } })}
                    style={{ marginBottom: '0.6rem' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], (url) => {
                            setAdminData({ ...adminData, siteSettings: { ...ss, headerLogoUrl: url } });
                            notifySave('Header Logo uploaded & updated dynamically!');
                          });
                        }
                      }}
                    />
                    {ss.headerLogoUrl && ss.headerLogoUrl !== '/logo.png' && (
                      <button
                        type="button"
                        className="admin-btn-action"
                        onClick={() => setAdminData({ ...adminData, siteSettings: { ...ss, headerLogoUrl: '/logo.png' } })}
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Logo / Brand Icon */}
            <div className="admin-subcard" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Footer Logo / Brand Icon (Footer Section)</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Appears in the website footer above the mission statement. Previewed on the actual footer dark background (#0f0f11).
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '180px', height: '74px', borderRadius: '0.5rem', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f11', padding: '0.5rem' }}>
                  <div className={`logo footer-logo-${ss.footerLogoBgMode || 'card'}`} style={{ margin: 0 }}>
                    <img
                      src={ss.footerLogoUrl || '/footer_logo.jpg'}
                      alt="Footer Logo Preview"
                      style={{ maxHeight: '44px', maxWidth: '150px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <input
                    type="text"
                    value={ss.footerLogoUrl || ''}
                    placeholder="Leave empty to use Header Logo, or enter /logo.png or https://..."
                    onChange={(e) => setAdminData({ ...adminData, siteSettings: { ...ss, footerLogoUrl: e.target.value } })}
                    style={{ marginBottom: '0.6rem' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], (url) => {
                            setAdminData({ ...adminData, siteSettings: { ...ss, footerLogoUrl: url } });
                            notifySave('Footer Logo uploaded & updated dynamically!');
                          });
                        }
                      }}
                    />
                    {ss.headerLogoUrl && ss.footerLogoUrl !== ss.headerLogoUrl && (
                      <button
                        type="button"
                        className="admin-btn-action"
                        onClick={() => setAdminData({ ...adminData, siteSettings: { ...ss, footerLogoUrl: ss.headerLogoUrl } })}
                      >
                        Copy Header Logo
                      </button>
                    )}
                    {ss.footerLogoUrl && (
                      <button
                        type="button"
                        className="admin-btn-action"
                        onClick={() => setAdminData({ ...adminData, siteSettings: { ...ss, footerLogoUrl: '' } })}
                      >
                        Reset / Same as Header
                      </button>
                    )}
                  </div>

                  <div style={{ marginTop: '0.85rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Footer Logo Display Mode:
                    </label>
                    <select
                      value={ss.footerLogoBgMode || 'card'}
                      onChange={(e) => setAdminData({ ...adminData, siteSettings: { ...ss, footerLogoBgMode: e.target.value as any } })}
                      style={{ maxWidth: '420px' }}
                    >
                      <option value="card">Crisp White Badge Card (Recommended: 100% visible for dark/colored logos)</option>
                      <option value="glow">Light Glow Outline (Transparent with subtle contrast aura)</option>
                      <option value="transparent">Transparent (As uploaded - only for white/light logos)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Custom Favicon */}
            <div className="admin-subcard" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Upload Custom Favicon</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
                  <img src={ss.faviconUrl || '/logo.png'} alt="Favicon Preview" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/x-icon"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], (url) => {
                          setAdminData({ ...adminData, siteSettings: { ...ss, faviconUrl: url } });
                          notifySave('Favicon uploaded and updated dynamically!');
                        });
                      }
                    }}
                  />
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                    Recommended: 64×64 PNG, SVG, or ICO. Automatically updates &lt;link rel="icon"&gt; across the site.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload / Set 1200x630 Default OG Image */}
            <div className="admin-subcard" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Default 1200×630 Open Graph (og:image)</h3>
              <div style={{ display: 'flex', alignItems: 'start', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ width: '240px', height: '126px', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', overflow: 'hidden', background: 'var(--bg-dark)' }}>
                  <img src={ss.defaultOgImage || '/api/og-default.svg'} alt="OG Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], (url) => {
                          setAdminData({ ...adminData, siteSettings: { ...ss, defaultOgImage: url } });
                          notifySave('1200×630 og:image uploaded and updated dynamically!');
                        });
                      }
                    }}
                  />
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="admin-btn-action"
                      onClick={() => {
                        setAdminData({ ...adminData, siteSettings: { ...ss, defaultOgImage: '/api/og-default.svg' } });
                      }}
                    >
                      Reset to Default 1200×630 Dynamic SVG Banner
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                    Standard Facebook, LinkedIn, WhatsApp &amp; Twitter Card preview dimension is exactly 1200×630.
                  </p>
                </div>
              </div>
            </div>

            {/* robots.txt editor */}
            <div style={{ marginTop: '1.5rem' }}>
              <div className="admin-form-group">
                <label>robots.txt Configuration (Served dynamically at /robots.txt)</label>
                <textarea
                  rows={6}
                  style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                  value={ss.robotsTxt || ''}
                  onChange={(e) => setAdminData({ ...adminData, siteSettings: { ...ss, robotsTxt: e.target.value } })}
                />
              </div>
            </div>

            {/* Live Brand Palette & Heading Typography Showcase (H1 - H4) */}
            <div className="admin-subcard" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} color="#1994E2" /> Official Brand Identity &amp; Typography Hierarchy (H1 - H4)
                  </h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                    Standardized design system active across all AarviCloud website pages.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge-sky">Sky Blue: #1994E2</span>
                  <span className="badge-orange">Orange: #EF7F1A</span>
                </div>
              </div>

              {/* Color Swatches */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(25, 148, 226, 0.08)', border: '1px solid rgba(25, 148, 226, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1994E2', boxShadow: '0 0 10px rgba(25, 148, 226, 0.5)' }}></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1994E2' }}>Primary Sky Blue</div>
                      <code style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>#1994E2</code>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Used for active links, primary buttons, hero glows, and trust elements.</p>
                </div>

                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(239, 127, 26, 0.08)', border: '1px solid rgba(239, 127, 26, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#EF7F1A', boxShadow: '0 0 10px rgba(239, 127, 26, 0.5)' }}></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#EF7F1A' }}>Accent Orange</div>
                      <code style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>#EF7F1A</code>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Used for CTA highlights, badges, conversion buttons, and gradient endings.</p>
                </div>

                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #1994E2 0%, #EF7F1A 100%)', boxShadow: '0 0 10px rgba(25, 148, 226, 0.3)' }}></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Brand Dual-Gradient</div>
                      <code style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>#1994E2 ➔ #EF7F1A</code>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Applied to main headlines, gradient text, and primary action buttons.</p>
                </div>
              </div>

              {/* Live H1 - H4 Hierarchy Showcase */}
              <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', marginBottom: '1.25rem', fontWeight: 700 }}>
                  Live Typography Scale &amp; Header Examples (H1 to H4)
                </div>

                {/* H1 Example */}
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#1994E2', color: '#fff', fontWeight: 700 }}>H1</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>clamp(2.3rem, 4.8vw, 3.8rem) &bull; Bold 800 &bull; Page Hero Headline</span>
                  </div>
                  <h1 style={{ margin: 0, fontSize: 'clamp(1.9rem, 3.6vw, 2.7rem)', lineHeight: 1.18 }}>
                    Architecting the Future with <span className="gradient-text">AI, Cloud, and Code</span>
                  </h1>
                </div>

                {/* H2 Example */}
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#EF7F1A', color: '#fff', fontWeight: 700 }}>H2</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>clamp(1.8rem, 3.2vw, 2.6rem) &bull; SemiBold 750 &bull; Section Title</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', lineHeight: 1.25 }}>
                    Comprehensive Enterprise Solutions <span style={{ color: '#1994E2' }}>for Digital Scale</span>
                  </h2>
                </div>

                {/* H3 Example */}
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(25, 148, 226, 0.2)', color: '#1994E2', fontWeight: 700 }}>H3</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>clamp(1.35rem, 2.2vw, 1.85rem) &bull; Medium 650 &bull; Feature &amp; Card Title</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', lineHeight: 1.35 }}>
                    High-Velocity Cloud Migration &amp; <span style={{ color: '#EF7F1A' }}>DevSecOps Pipelines</span>
                  </h3>
                </div>

                {/* H4 Example */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(239, 127, 26, 0.2)', color: '#EF7F1A', fontWeight: 700 }}>H4</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>clamp(1.1rem, 1.6vw, 1.35rem) &bull; Regular 600 &bull; Sub-Module &amp; Subsection Header</span>
                  </div>
                  <h4 style={{ margin: 0, fontSize: 'clamp(1.02rem, 1.3vw, 1.22rem)', lineHeight: 1.4, color: 'var(--text-main)' }}>
                    Distributed Microservice Mesh &bull; Automated CI/CD Checkpoints &bull; Real-Time Telemetry
                  </h4>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button type="submit" className="btn-primary">
                <Save size={18} style={{ marginRight: '6px' }} /> Save Global SEO Settings
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Per-Page SEO (Home, About, Portfolio, CaseStudies, Blog, Contact, Privacy, Terms) */}
        {activeTab === 'pageseo' && (
          <div className="admin-card">
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} className="text-primary" /> Per-Page SEO &amp; Heading (H1) Configuration
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {Object.keys(adminData.pageSeo || {}).map((key) => (
                <button
                  key={key}
                  className={`admin-tab-btn ${selectedPageSeoKey === key ? 'active' : ''}`}
                  onClick={() => setSelectedPageSeoKey(key)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {key}
                </button>
              ))}
            </div>

            {adminData.pageSeo?.[selectedPageSeoKey] && (
              <div>
                {(() => {
                  const p = adminData.pageSeo[selectedPageSeoKey];
                  return (
                    <div className="admin-form-grid">
                      <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Meta Title (&lt;title&gt;) [Target 50-60 characters]</label>
                        <input
                          type="text"
                          value={p.metaTitle || ''}
                          onChange={(e) => {
                            const updated = { ...p, metaTitle: e.target.value, ogTitle: e.target.value };
                            setAdminData({
                              ...adminData,
                              pageSeo: { ...adminData.pageSeo, [selectedPageSeoKey]: updated }
                            });
                          }}
                        />
                        <span style={{ fontSize: '0.78rem', color: (p.metaTitle?.length || 0) > 60 ? '#f59e0b' : 'var(--text-dim)' }}>
                          Length: {p.metaTitle?.length || 0} characters
                        </span>
                      </div>

                      <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Meta Description (&lt;meta name="description"&gt;) [Target 120-160 characters]</label>
                        <textarea
                          rows={3}
                          value={p.metaDescription || ''}
                          onChange={(e) => {
                            const updated = { ...p, metaDescription: e.target.value, ogDescription: e.target.value };
                            setAdminData({
                              ...adminData,
                              pageSeo: { ...adminData.pageSeo, [selectedPageSeoKey]: updated }
                            });
                          }}
                        />
                        <span style={{ fontSize: '0.78rem', color: (p.metaDescription?.length || 0) > 160 ? '#f59e0b' : 'var(--text-dim)' }}>
                          Length: {p.metaDescription?.length || 0} characters
                        </span>
                      </div>

                      <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Target Keywords in Titles &amp; Copy (Comma Separated)</label>
                        <input
                          type="text"
                          value={p.targetKeywords || ''}
                          onChange={(e) => {
                            const updated = { ...p, targetKeywords: e.target.value };
                            setAdminData({
                              ...adminData,
                              pageSeo: { ...adminData.pageSeo, [selectedPageSeoKey]: updated }
                            });
                          }}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Meta Robots Tag (Indexability)</label>
                        <select
                          value={p.metaRobots || 'index, follow'}
                          onChange={(e) => {
                            const updated = { ...p, metaRobots: e.target.value };
                            setAdminData({
                              ...adminData,
                              pageSeo: { ...adminData.pageSeo, [selectedPageSeoKey]: updated }
                            });
                          }}
                        >
                          <option value="index, follow">index, follow (Included in /sitemap.xml)</option>
                          <option value="noindex, follow">noindex, follow (Excluded from /sitemap.xml)</option>
                          <option value="noindex, nofollow">noindex, nofollow (Complete block)</option>
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label>Primary Heading (H1)</label>
                        <input
                          type="text"
                          value={p.h1Heading || ''}
                          onChange={(e) => {
                            const updated = { ...p, h1Heading: e.target.value };
                            setAdminData({
                              ...adminData,
                              pageSeo: { ...adminData.pageSeo, [selectedPageSeoKey]: updated }
                            });
                          }}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Custom og:image for this page (Leave empty for default 1200×630)</label>
                        <input
                          type="text"
                          value={p.ogImage || ''}
                          onChange={(e) => {
                            const updated = { ...p, ogImage: e.target.value };
                            setAdminData({
                              ...adminData,
                              pageSeo: { ...adminData.pageSeo, [selectedPageSeoKey]: updated }
                            });
                          }}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Sitemap Priority (0.1 to 1.0)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="1.0"
                          value={p.priority ?? 0.8}
                          onChange={(e) => {
                            const updated = { ...p, priority: parseFloat(e.target.value) };
                            setAdminData({
                              ...adminData,
                              pageSeo: { ...adminData.pageSeo, [selectedPageSeoKey]: updated }
                            });
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
                        <button type="button" className="btn-primary" onClick={() => savePageSeo(selectedPageSeoKey)}>
                          <Save size={18} style={{ marginRight: '6px' }} /> Save Page SEO for "{selectedPageSeoKey}"
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Dynamic Blogs (Full CRUD + Auto XML Sitemap + Heading H1-H6) */}
        {activeTab === 'blogs' && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Manage Blog Posts</h2>
              <button
                className="btn-primary"
                onClick={() =>
                  setEditingBlog({
                    id: 'new',
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '## Section Title (H2)\nYour content here with target keywords.\n\n### Sub-heading (H3)\nDetailed points here.\n- Key feature point 1\n- Key feature point 2',
                    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
                    author: 'AarviCloud Team',
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    readTime: '8 min read',
                    category: 'Cloud',
                    tags: ['Cloud', 'AI'],
                    published: true,
                    metaTitle: '',
                    metaDescription: '',
                    targetKeywords: '',
                    canonicalUrl: '',
                    metaRobots: 'index, follow'
                  })
                }
              >
                <Plus size={16} /> Create New Blog Post
              </button>
            </div>

            {editingBlog ? (
              <div className="admin-edit-panel">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                  {editingBlog.id === 'new' ? 'New Blog Post' : `Edit: ${editingBlog.title}`}
                </h3>

                <div className="admin-form-grid">
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Blog Title (Becomes H1 on the page)</label>
                    <input
                      type="text"
                      value={editingBlog.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const siteDomain = (adminData?.siteSettings?.siteDomain || 'https://aarvicloud.com').replace(/\/$/, '');
                        const newSlug = slugify(newTitle);
                        const isNew = editingBlog.id === 'new';
                        setEditingBlog({
                          ...editingBlog,
                          title: newTitle,
                          slug: isNew && (!editingBlog.slug || editingBlog.slug === slugify(editingBlog.title)) ? newSlug : editingBlog.slug,
                          metaTitle: isNew && (!editingBlog.metaTitle || editingBlog.metaTitle === `${editingBlog.title} | AarviCloud`) ? `${newTitle} | AarviCloud` : editingBlog.metaTitle,
                          canonicalUrl: isNew && (!editingBlog.canonicalUrl || editingBlog.canonicalUrl.includes('/blog/')) ? `${siteDomain}/blog/${newSlug}` : editingBlog.canonicalUrl
                        });
                      }}
                      placeholder="e.g. ERP Development Company Rajkot India: The Complete 2026 Guide"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>URL Slug (e.g. /blog/erp-development-company-rajkot)</label>
                    <input
                      type="text"
                      value={editingBlog.slug}
                      onChange={(e) => {
                        const newSlug = e.target.value;
                        const siteDomain = (adminData?.siteSettings?.siteDomain || 'https://aarvicloud.com').replace(/\/$/, '');
                        setEditingBlog({
                          ...editingBlog,
                          slug: newSlug,
                          canonicalUrl: !editingBlog.canonicalUrl || editingBlog.canonicalUrl.includes('/blog/') ? `${siteDomain}/blog/${newSlug}` : editingBlog.canonicalUrl
                        });
                      }}
                      placeholder="erp-development-company-rajkot"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Featured Image URL (or upload below)</label>
                    <input
                      type="text"
                      value={editingBlog.image}
                      onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ marginTop: '0.4rem' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], (url) => setEditingBlog({ ...editingBlog, image: url }));
                        }
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Meta Robots (Indexability)</label>
                    <select
                      value={editingBlog.metaRobots || 'index, follow'}
                      onChange={(e) => setEditingBlog({ ...editingBlog, metaRobots: e.target.value })}
                    >
                      <option value="index, follow">index, follow (Appears in /sitemap.xml)</option>
                      <option value="noindex, follow">noindex, follow (Excluded from sitemap)</option>
                    </select>
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Blog Excerpt (Introductory summary)</label>
                    <textarea
                      rows={2}
                      value={editingBlog.excerpt}
                      onChange={(e) => {
                        const newExcerpt = e.target.value;
                        const isNew = editingBlog.id === 'new';
                        setEditingBlog({
                          ...editingBlog,
                          excerpt: newExcerpt,
                          metaDescription: isNew && (!editingBlog.metaDescription || editingBlog.metaDescription === editingBlog.excerpt) ? newExcerpt : editingBlog.metaDescription
                        });
                      }}
                    />
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Structured Article Body (Tiny Editor WYSIWYG & Markdown)</label>
                    <TinyEditor
                      value={editingBlog.content}
                      onChange={(content) => setEditingBlog({ ...editingBlog, content })}
                      placeholder="Write your article headings, paragraphs, bullet lists, bold text, links, and tables..."
                      minHeight={380}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>SEO Meta Title</label>
                    <input
                      type="text"
                      value={editingBlog.metaTitle || ''}
                      placeholder={editingBlog.title ? `${editingBlog.title} | AarviCloud` : 'Meta Title'}
                      onChange={(e) => setEditingBlog({ ...editingBlog, metaTitle: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Target Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      value={editingBlog.targetKeywords || ''}
                      placeholder="ERP Rajkot, Cloud Development, AI"
                      onChange={(e) => setEditingBlog({ ...editingBlog, targetKeywords: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>SEO Meta Description (Recommended 140 - 160 characters)</label>
                      <span style={{ fontSize: '0.8rem', color: (editingBlog.metaDescription || '').length > 160 ? '#f59e0b' : 'var(--text-muted)' }}>
                        {(editingBlog.metaDescription || '').length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={editingBlog.metaDescription || ''}
                      placeholder="Concise, keyword-rich summary of this article that will appear in Google search snippets..."
                      onChange={(e) => setEditingBlog({ ...editingBlog, metaDescription: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Canonical URL (Auto-generated by default; edit only if syndicating)</label>
                    <input
                      type="text"
                      value={editingBlog.canonicalUrl || ''}
                      placeholder={`${(adminData?.siteSettings?.siteDomain || 'https://aarvicloud.com').replace(/\/$/, '')}/blog/${editingBlog.slug || 'slug'}`}
                      onChange={(e) => setEditingBlog({ ...editingBlog, canonicalUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-primary" onClick={() => saveBlog(editingBlog)}>
                    <Save size={16} /> Save Blog Post
                  </button>
                  <button type="button" className="admin-btn-action" onClick={() => setEditingBlog(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Slug / URL</th>
                  <th>Date</th>
                  <th>Robots</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(adminData.blogs || []).map((blog: any) => (
                  <tr key={blog.id}>
                    <td style={{ fontWeight: 600 }}>{blog.title}</td>
                    <td><span className="admin-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>{blog.category}</span></td>
                    <td>
                      <a href={`/blog/${blog.slug || blog.id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        /blog/{blog.slug || blog.id} <ExternalLink size={12} />
                      </a>
                    </td>
                    <td>{blog.date}</td>
                    <td>
                      <span className={`admin-badge ${(blog.metaRobots || 'index').includes('noindex') ? 'badge-warning' : 'badge-success'}`}>
                        {blog.metaRobots || 'index, follow'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button className="admin-btn-action" onClick={() => setEditingBlog(blog)}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="admin-btn-action admin-btn-danger" onClick={() => deleteBlog(blog.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: Portfolio Projects */}
        {activeTab === 'portfolio' && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Manage Portfolio Projects</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                  Every project detail page automatically generates its XML sitemap entry, canonical URL, and rich SEO metadata.
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={() =>
                  setEditingPortfolio({
                    id: 'new',
                    title: '',
                    slug: '',
                    category: 'Development',
                    desc: '',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop',
                    tech: ['React', 'Node.js'],
                    url: '',
                    featuredOnHome: false,
                    published: true,
                    metaTitle: '',
                    metaDescription: '',
                    targetKeywords: '',
                    canonicalUrl: '',
                    metaRobots: 'index, follow'
                  })
                }
              >
                <Plus size={16} /> Add Portfolio Project
              </button>
            </div>

            {editingPortfolio && (
              <div className="admin-edit-panel">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                  {editingPortfolio.id === 'new' ? 'New Portfolio Project' : `Edit: ${editingPortfolio.title}`}
                </h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Project Title</label>
                    <input
                      type="text"
                      value={editingPortfolio.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const siteDomain = (adminData?.siteSettings?.siteDomain || 'https://aarvicloud.com').replace(/\/$/, '');
                        const newSlug = slugify(newTitle);
                        const isNew = editingPortfolio.id === 'new';
                        setEditingPortfolio({
                          ...editingPortfolio,
                          title: newTitle,
                          slug: isNew && (!editingPortfolio.slug || editingPortfolio.slug === slugify(editingPortfolio.title)) ? newSlug : editingPortfolio.slug,
                          metaTitle: isNew && (!editingPortfolio.metaTitle || editingPortfolio.metaTitle === `${editingPortfolio.title} | AarviCloud Portfolio`) ? `${newTitle} | AarviCloud Portfolio` : editingPortfolio.metaTitle,
                          canonicalUrl: isNew && (!editingPortfolio.canonicalUrl || editingPortfolio.canonicalUrl.includes('/portfolio/')) ? `${siteDomain}/portfolio/${newSlug}` : editingPortfolio.canonicalUrl
                        });
                      }}
                      placeholder="e.g. Delta Terminal V3 - Algo Trading"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>URL Slug (e.g. /portfolio/delta-terminal-v3)</label>
                    <input
                      type="text"
                      value={editingPortfolio.slug || ''}
                      onChange={(e) => {
                        const newSlug = e.target.value;
                        const siteDomain = (adminData?.siteSettings?.siteDomain || 'https://aarvicloud.com').replace(/\/$/, '');
                        setEditingPortfolio({
                          ...editingPortfolio,
                          slug: newSlug,
                          canonicalUrl: !editingPortfolio.canonicalUrl || editingPortfolio.canonicalUrl.includes('/portfolio/') ? `${siteDomain}/portfolio/${newSlug}` : editingPortfolio.canonicalUrl
                        });
                      }}
                      placeholder="delta-terminal-v3-algo-trading"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Category (Development, Cloud, Security, etc.)</label>
                    <input
                      type="text"
                      value={editingPortfolio.category}
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, category: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Live URL (Optional)</label>
                    <input
                      type="text"
                      value={editingPortfolio.url || ''}
                      placeholder="https://..."
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, url: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Featured on Home Page?</label>
                    <select
                      value={editingPortfolio.featuredOnHome ? 'true' : 'false'}
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, featuredOnHome: e.target.value === 'true' })}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes (Show in Home Featured Section)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Meta Robots (Indexability)</label>
                    <select
                      value={editingPortfolio.metaRobots || 'index, follow'}
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, metaRobots: e.target.value })}
                    >
                      <option value="index, follow">index, follow (Appears in /sitemap.xml)</option>
                      <option value="noindex, follow">noindex, follow (Excluded from sitemap)</option>
                    </select>
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Project Image URL (or upload)</label>
                    <input
                      type="text"
                      value={editingPortfolio.image}
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, image: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ marginTop: '0.4rem' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], (url) => setEditingPortfolio({ ...editingPortfolio, image: url }));
                        }
                      }}
                    />
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Description (Project Summary)</label>
                    <textarea
                      rows={3}
                      value={editingPortfolio.desc}
                      onChange={(e) => {
                        const newDesc = e.target.value;
                        const isNew = editingPortfolio.id === 'new';
                        setEditingPortfolio({
                          ...editingPortfolio,
                          desc: newDesc,
                          metaDescription: isNew && (!editingPortfolio.metaDescription || editingPortfolio.metaDescription === editingPortfolio.desc) ? newDesc : editingPortfolio.metaDescription
                        });
                      }}
                    />
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Tech Tags (Comma Separated, e.g. React, Node.js, AWS)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingPortfolio.tech) ? editingPortfolio.tech.join(', ') : editingPortfolio.tech || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingPortfolio({
                          ...editingPortfolio,
                          tech: val.split(',').map((s: string) => s.trim()),
                          targetKeywords: !editingPortfolio.targetKeywords ? val : editingPortfolio.targetKeywords
                        });
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>SEO Meta Title</label>
                    <input
                      type="text"
                      value={editingPortfolio.metaTitle || ''}
                      placeholder={editingPortfolio.title ? `${editingPortfolio.title} | AarviCloud Portfolio` : 'Meta Title'}
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, metaTitle: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Target Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      value={editingPortfolio.targetKeywords || ''}
                      placeholder="React, FinTech, Algo Trading, WebSockets"
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, targetKeywords: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>SEO Meta Description (Recommended 140 - 160 characters)</label>
                      <span style={{ fontSize: '0.8rem', color: (editingPortfolio.metaDescription || '').length > 160 ? '#f59e0b' : 'var(--text-muted)' }}>
                        {(editingPortfolio.metaDescription || '').length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={editingPortfolio.metaDescription || ''}
                      placeholder="Concise overview of the project, features, and engineering accomplishments for search engines..."
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, metaDescription: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Canonical URL (Auto-generated by default; edit only if necessary)</label>
                    <input
                      type="text"
                      value={editingPortfolio.canonicalUrl || ''}
                      placeholder={`${(adminData?.siteSettings?.siteDomain || 'https://aarvicloud.com').replace(/\/$/, '')}/portfolio/${editingPortfolio.slug || 'slug'}`}
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, canonicalUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-primary" onClick={() => savePortfolio(editingPortfolio)}>
                    <Save size={16} /> Save Project
                  </button>
                  <button type="button" className="admin-btn-action" onClick={() => setEditingPortfolio(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Slug / URL</th>
                  <th>Robots</th>
                  <th>Featured</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(adminData.portfolioProjects || []).map((p: any) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.title}</td>
                    <td>{p.category}</td>
                    <td>
                      <a
                        href={`/portfolio/${p.slug || slugify(p.title) || p.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                      >
                        /portfolio/{p.slug || slugify(p.title) || p.id} <ExternalLink size={12} />
                      </a>
                    </td>
                    <td>
                      <span className={`admin-badge ${p.metaRobots?.includes('noindex') ? 'badge-warning' : 'badge-success'}`}>
                        {p.metaRobots || 'index, follow'}
                      </span>
                    </td>
                    <td>
                      {p.featuredOnHome ? (
                        <span className="admin-badge badge-success">★ Featured</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button className="admin-btn-action" onClick={() => setEditingPortfolio(p)}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="admin-btn-action admin-btn-danger" onClick={() => deletePortfolio(p.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: Case Studies (Auto XML Sitemap) */}
        {activeTab === 'casestudies' && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Manage Case Studies</h2>
              <button
                className="btn-primary"
                onClick={() =>
                  setEditingCaseStudy({
                    id: 'new',
                    title: '',
                    slug: '',
                    sectionCategory: 'Fortune 500 Clients',
                    badgeCategory: 'Enterprise',
                    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
                    challenge: 'Client operational challenge description...',
                    solution: 'Engineering solution implemented by AarviCloud...',
                    results: 'Measurable metric improvements (e.g. 60% faster response times)...',
                    tech: ['React', 'Node.js', 'AWS'],
                    features: ['Real-time sync', 'Zero downtime deployment', 'High concurrency'],
                    stats: ['60% Faster Performance', '1M+ Active Users', 'Enterprise Security'],
                    published: true,
                    metaRobots: 'index, follow'
                  })
                }
              >
                <Plus size={16} /> Create Case Study
              </button>
            </div>

            {editingCaseStudy && (
              <div className="admin-edit-panel">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                  {editingCaseStudy.id === 'new' ? 'New Case Study' : `Edit: ${editingCaseStudy.title}`}
                </h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editingCaseStudy.title}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, title: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>URL Slug (e.g. merchinator-ecommerce-platform)</label>
                    <input
                      type="text"
                      value={editingCaseStudy.slug}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, slug: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Section Category (Fortune 500 Clients, Healthcare, BFSI, ReactJS, etc.)</label>
                    <input
                      type="text"
                      value={editingCaseStudy.sectionCategory}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, sectionCategory: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Meta Robots (Indexability in Sitemap)</label>
                    <select
                      value={editingCaseStudy.metaRobots || 'index, follow'}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, metaRobots: e.target.value })}
                    >
                      <option value="index, follow">index, follow (Included in /sitemap.xml)</option>
                      <option value="noindex, follow">noindex, follow (Excluded)</option>
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>The Challenge</label>
                    <textarea
                      rows={3}
                      value={editingCaseStudy.challenge}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, challenge: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Our Solution</label>
                    <textarea
                      rows={3}
                      value={editingCaseStudy.solution}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, solution: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Results</label>
                    <textarea
                      rows={2}
                      value={editingCaseStudy.results}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, results: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-primary" onClick={() => saveCaseStudy(editingCaseStudy)}>
                    <Save size={16} /> Save Case Study
                  </button>
                  <button type="button" className="admin-btn-action" onClick={() => setEditingCaseStudy(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Section</th>
                  <th>URL / Slug</th>
                  <th>Robots</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(adminData.caseStudies || []).map((c: any) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>{c.sectionCategory}</td>
                    <td>
                      <a href={`/case-study/${c.slug || c.id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        /case-study/{c.slug || c.id} <ExternalLink size={12} />
                      </a>
                    </td>
                    <td>
                      <span className={`admin-badge ${(c.metaRobots || 'index').includes('noindex') ? 'badge-warning' : 'badge-success'}`}>
                        {c.metaRobots || 'index, follow'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button className="admin-btn-action" onClick={() => setEditingCaseStudy(c)}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="admin-btn-action admin-btn-danger" onClick={() => deleteCaseStudy(c.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: Custom SEO Pages (Auto added to /sitemap.xml & routable at /p/:slug) */}
        {activeTab === 'custompages' && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Create &amp; Manage Custom SEO Pages</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  Every new page automatically appears in <strong>/sitemap.xml</strong> and is accessible at <strong>/p/:slug</strong>!
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={() =>
                  setEditingCustomPage({
                    id: 'new',
                    title: '',
                    slug: '',
                    subtitle: '',
                    badge: 'AarviCloud Solutions',
                    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
                    contentSections: [
                      {
                        headingLevel: 'h2',
                        heading: 'Primary Section Heading (H2)',
                        body: 'Body paragraph with high-impact keywords.',
                        bullets: ['Key benefit 1', 'Key benefit 2', 'Key benefit 3']
                      }
                    ],
                    ctaTitle: 'Ready to Accelerate Your Digital Transformation?',
                    ctaText: 'Schedule a free consultation with our senior engineers.',
                    ctaBtnText: 'Book Free Demo',
                    ctaBtnLink: '/contact',
                    showInNavbar: false,
                    showInFooter: true,
                    published: true,
                    metaTitle: '',
                    metaDescription: '',
                    targetKeywords: '',
                    metaRobots: 'index, follow',
                    priority: 0.8
                  })
                }
              >
                <Plus size={16} /> Create New Dynamic Page
              </button>
            </div>

            {editingCustomPage && (
              <div className="admin-edit-panel">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                  {editingCustomPage.id === 'new' ? 'Create New Page' : `Edit: ${editingCustomPage.title}`}
                </h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Page Title (H1)</label>
                    <input
                      type="text"
                      value={editingCustomPage.title}
                      onChange={(e) => setEditingCustomPage({ ...editingCustomPage, title: e.target.value })}
                      placeholder="e.g. Custom ERP & CRM Development in Rajkot"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>URL Slug (/p/:slug)</label>
                    <input
                      type="text"
                      value={editingCustomPage.slug}
                      onChange={(e) => setEditingCustomPage({ ...editingCustomPage, slug: e.target.value })}
                      placeholder="e.g. custom-erp-development-rajkot"
                    />
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={editingCustomPage.subtitle}
                      onChange={(e) => setEditingCustomPage({ ...editingCustomPage, subtitle: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Meta Robots (Indexability)</label>
                    <select
                      value={editingCustomPage.metaRobots || 'index, follow'}
                      onChange={(e) => setEditingCustomPage({ ...editingCustomPage, metaRobots: e.target.value })}
                    >
                      <option value="index, follow">index, follow (Added to /sitemap.xml)</option>
                      <option value="noindex, follow">noindex, follow (Excluded from sitemap)</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Show in Footer Links?</label>
                    <select
                      value={editingCustomPage.showInFooter ? 'true' : 'false'}
                      onChange={(e) => setEditingCustomPage({ ...editingCustomPage, showInFooter: e.target.value === 'true' })}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Meta Title (&lt;title&gt;)</label>
                    <input
                      type="text"
                      value={editingCustomPage.metaTitle || ''}
                      placeholder={editingCustomPage.title}
                      onChange={(e) => setEditingCustomPage({ ...editingCustomPage, metaTitle: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Target Keywords in Titles &amp; Copy</label>
                    <input
                      type="text"
                      value={editingCustomPage.targetKeywords || ''}
                      onChange={(e) => setEditingCustomPage({ ...editingCustomPage, targetKeywords: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-primary" onClick={() => saveCustomPage(editingCustomPage)}>
                    <Save size={16} /> Save &amp; Publish Page to /sitemap.xml
                  </button>
                  <button type="button" className="admin-btn-action" onClick={() => setEditingCustomPage(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>URL Route</th>
                  <th>Robots</th>
                  <th>Footer Link</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(adminData.customPages || []).map((cp: any) => (
                  <tr key={cp.id}>
                    <td style={{ fontWeight: 600 }}>{cp.title}</td>
                    <td>
                      <a href={`/p/${cp.slug}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        /p/{cp.slug} <ExternalLink size={12} />
                      </a>
                    </td>
                    <td>
                      <span className={`admin-badge ${(cp.metaRobots || 'index').includes('noindex') ? 'badge-warning' : 'badge-success'}`}>
                        {cp.metaRobots || 'index, follow'}
                      </span>
                    </td>
                    <td>{cp.showInFooter ? 'Yes' : 'No'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button className="admin-btn-action" onClick={() => setEditingCustomPage(cp)}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="admin-btn-action admin-btn-danger" onClick={() => deleteCustomPage(cp.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 7: Contact Form Inquiries */}
        {activeTab === 'contacts' && (
          <div className="admin-card">
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={22} className="text-primary" /> Contact Form Inquiries ({adminData.contactSubmissions?.length || 0})
            </h2>

            {(!adminData.contactSubmissions || adminData.contactSubmissions.length === 0) ? (
              <p style={{ color: 'var(--text-dim)' }}>No contact submissions received yet.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.contactSubmissions.map((inq: any) => (
                    <tr key={inq.id}>
                      <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>{inq.name}</td>
                      <td><a href={`mailto:${inq.email}`} style={{ color: 'var(--primary)' }}>{inq.email}</a></td>
                      <td>{inq.phone || 'N/A'}</td>
                      <td style={{ maxWidth: '300px' }}>{inq.message}</td>
                      <td>
                        <span className={`admin-badge ${inq.status === 'new' ? 'badge-warning' : 'badge-success'}`}>
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 8: Supabase Status & SQL Schema */}
        {activeTab === 'system' && (
          <div className="admin-card">
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={22} className="text-primary" /> Supabase Connection &amp; SQL Schema
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="admin-stat-box">
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Project Name</span>
                <h4 style={{ margin: '0.3rem 0 0', fontSize: '1.1rem' }}>{sys.projectName || 'Aarvicloud'}</h4>
              </div>
              <div className="admin-stat-box">
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Network Security</span>
                <h4 style={{ margin: '0.3rem 0 0', fontSize: '1.1rem', color: '#10b981' }}>Strict Proxy (URL Hidden)</h4>
              </div>
              <div className="admin-stat-box">
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Postgres Relational Tables</span>
                <h4 style={{ margin: '0.3rem 0 0', fontSize: '1.1rem', color: sys.pgTablesReady ? '#10b981' : '#f59e0b' }}>
                  {sys.pgTablesReady ? 'Active & In Sync' : 'Ready for SQL Setup'}
                </h4>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <button className="btn-primary" onClick={triggerSupabaseSync}>
                <RefreshCw size={16} /> Sync Cloud State to Supabase
              </button>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Supabase SQL Schema Script (Optional: Run in Supabase SQL Editor)
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              All CMS content is already persisted live in Supabase Cloud Storage. To also create relational Postgres tables, copy and execute the script below in your Supabase Dashboard &gt; SQL Editor:
            </p>
            <textarea
              readOnly
              rows={12}
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.82rem', background: 'var(--bg-dark)', color: 'var(--text-dim)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}
              value={sys.sqlSchema || '-- SQL Schema available in supabase/schema.sql'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
