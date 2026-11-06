const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { defaultData, slugify } = require('./defaultData');

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CACHE_FILE = path.join(DATA_DIR, 'cms-cache.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

class SupabaseCMSStore {
  constructor() {
    this.supabaseUrl = (process.env.SUPABASE_URL || 'https://grmodtzcbaidbmgczohq.supabase.co').replace(/\/$/, '');
    this.secretKey = process.env.SUPABASE_SECRET_KEY || '';
    this.publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
    this.cmsBucket = 'aarvicloud-cms';
    this.mediaBucket = 'aarvicloud-media';
    this.stateObjectPath = 'cms-state-v1.json';
    this.state = null;
    this.pgTablesReady = false;
    this.supabaseConnected = false;
    this.lastSyncAt = null;
  }

  getHeaders(extra = {}) {
    return {
      apikey: this.secretKey,
      Authorization: `Bearer ${this.secretKey}`,
      ...extra
    };
  }

  loadLocalCache() {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const raw = fs.readFileSync(CACHE_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return this.mergeWithDefaults(parsed);
      }
    } catch (err) {
      console.error('Failed to read local CMS cache:', err.message);
    }
    return JSON.parse(JSON.stringify(defaultData));
  }

  saveLocalCache(state) {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(state, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write local CMS cache:', err.message);
    }
  }

  mergeWithDefaults(loaded) {
    const base = JSON.parse(JSON.stringify(defaultData));
    if (!loaded || typeof loaded !== 'object') return base;
    return {
      siteSettings: { ...base.siteSettings, ...(loaded.siteSettings || {}) },
      pageSeo: { ...base.pageSeo, ...(loaded.pageSeo || {}) },
      homeContent: { ...base.homeContent, ...(loaded.homeContent || {}) },
      aboutContent: { ...base.aboutContent, ...(loaded.aboutContent || {}) },
      contactContent: { ...base.contactContent, ...(loaded.contactContent || {}) },
      footerContent: { ...base.footerContent, ...(loaded.footerContent || {}) },
      caseStudiesPageContent: { ...base.caseStudiesPageContent, ...(loaded.caseStudiesPageContent || {}) },
      blogs: Array.isArray(loaded.blogs) && loaded.blogs.length > 0 ? loaded.blogs : base.blogs,
      portfolioProjects: Array.isArray(loaded.portfolioProjects) && loaded.portfolioProjects.length > 0 ? loaded.portfolioProjects : base.portfolioProjects,
      caseStudies: Array.isArray(loaded.caseStudies) && loaded.caseStudies.length > 0 ? loaded.caseStudies : base.caseStudies,
      customPages: Array.isArray(loaded.customPages) ? loaded.customPages : base.customPages,
      contactSubmissions: Array.isArray(loaded.contactSubmissions) ? loaded.contactSubmissions : []
    };
  }

  async init() {
    this.state = this.loadLocalCache();
    this.saveLocalCache(this.state);

    if (!this.secretKey) {
      console.warn('No SUPABASE_SECRET_KEY configured; running on local cache.');
      return;
    }

    try {
      await this.ensureBuckets();
      await this.ensureAdminUser();
      await this.checkPostgresTables();

      // Pull existing cloud state from Supabase Storage if present
      const cloudState = await this.pullCloudState();
      if (cloudState) {
        this.state = this.mergeWithDefaults(cloudState);
        this.saveLocalCache(this.state);
      } else {
        await this.pushCloudState();
      }

      if (this.pgTablesReady) {
        await this.syncToPostgresTables();
      }

      this.supabaseConnected = true;
      this.lastSyncAt = new Date().toISOString();
      console.log('Supabase CMS Store initialized securely (Supabase URL hidden from client).');
    } catch (err) {
      console.warn('Supabase cloud init warning (continuing with local cache + retry):', err.message);
    }
  }

  async ensureBuckets() {
    const res = await fetch(`${this.supabaseUrl}/storage/v1/bucket`, {
      headers: this.getHeaders()
    });
    if (!res.ok) return;
    const buckets = await res.json();
    const names = new Set((buckets || []).map((b) => b.name || b.id));

    for (const bucketName of [this.cmsBucket, this.mediaBucket]) {
      if (!names.has(bucketName)) {
        await fetch(`${this.supabaseUrl}/storage/v1/bucket`, {
          method: 'POST',
          headers: this.getHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            id: bucketName,
            name: bucketName,
            public: false
          })
        });
      }
    }
  }

  async ensureAdminUser() {
    const adminEmail = (process.env.ADMIN_EMAIL || 'rathodjayraj94@gmail.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Aarvicloud@2026';

    const listRes = await fetch(`${this.supabaseUrl}/auth/v1/admin/users`, {
      headers: this.getHeaders()
    });
    if (!listRes.ok) return;
    const data = await listRes.json();
    const users = data.users || [];
    const existing = users.find((u) => (u.email || '').toLowerCase() === adminEmail);

    if (!existing) {
      await fetch(`${this.supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: this.getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: { role: 'super_admin', name: 'Jayraj Rathod' }
        })
      });
    }
  }

  async checkPostgresTables() {
    try {
      const res = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        headers: this.getHeaders()
      });
      if (!res.ok) {
        this.pgTablesReady = false;
        return false;
      }
      const swagger = await res.json();
      const paths = Object.keys(swagger.paths || {});
      this.pgTablesReady = paths.includes('/site_settings') && paths.includes('/blogs');
      return this.pgTablesReady;
    } catch {
      this.pgTablesReady = false;
      return false;
    }
  }

  async pullCloudState() {
    try {
      const res = await fetch(
        `${this.supabaseUrl}/storage/v1/object/${this.cmsBucket}/${this.stateObjectPath}`,
        { headers: this.getHeaders() }
      );
      if (!res.ok) return null;
      const text = await res.text();
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  async pushCloudState() {
    if (!this.secretKey || !this.state) return;
    try {
      const payload = JSON.stringify(this.state);
      const putRes = await fetch(
        `${this.supabaseUrl}/storage/v1/object/${this.cmsBucket}/${this.stateObjectPath}`,
        {
          method: 'POST',
          headers: this.getHeaders({
            'Content-Type': 'application/json',
            'x-upsert': 'true'
          }),
          body: payload
        }
      );
      if (putRes.ok) {
        this.supabaseConnected = true;
        this.lastSyncAt = new Date().toISOString();
      }
    } catch (err) {
      console.warn('Failed to push state to Supabase Storage:', err.message);
    }
  }

  async syncToPostgresTables() {
    const ready = await this.checkPostgresTables();
    if (!ready) return { synced: false, reason: 'Postgres tables not yet created in SQL Editor' };

    try {
      const s = this.state.siteSettings;
      // 1. Upsert site_settings
      await fetch(`${this.supabaseUrl}/rest/v1/site_settings?on_conflict=id`, {
        method: 'POST',
        headers: this.getHeaders({
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        }),
        body: JSON.stringify({
          id: 'global',
          site_name: s.siteName,
          site_domain: s.siteDomain,
          default_meta_title: s.defaultMetaTitle,
          default_meta_description: s.defaultMetaDescription,
          default_keywords: s.defaultKeywords,
          default_meta_robots: s.defaultMetaRobots,
          favicon_url: s.faviconUrl,
          default_og_image: s.defaultOgImage,
          og_image_width: Number(s.ogImageWidth || 1200),
          og_image_height: Number(s.ogImageHeight || 630),
          robots_txt: s.robotsTxt,
          google_site_verification: s.googleSiteVerification || '',
          updated_at: new Date().toISOString()
        })
      });

      // 2. Upsert page_seo
      const seoRows = Object.values(this.state.pageSeo || {}).map((p) => ({
        page_key: p.pageKey,
        route_path: p.routePath,
        meta_title: p.metaTitle,
        meta_description: p.metaDescription,
        target_keywords: p.targetKeywords || '',
        meta_robots: p.metaRobots || 'index, follow',
        og_title: p.ogTitle || p.metaTitle,
        og_description: p.ogDescription || p.metaDescription,
        og_image: p.ogImage || s.defaultOgImage,
        og_url: p.ogUrl || `${s.siteDomain}${p.routePath}`,
        canonical_url: p.canonicalUrl || `${s.siteDomain}${p.routePath}`,
        h1_heading: p.h1Heading || '',
        priority: Number(p.priority || 0.8),
        changefreq: p.changefreq || 'weekly',
        updated_at: new Date().toISOString()
      }));
      if (seoRows.length > 0) {
        await fetch(`${this.supabaseUrl}/rest/v1/page_seo?on_conflict=page_key`, {
          method: 'POST',
          headers: this.getHeaders({
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          }),
          body: JSON.stringify(seoRows)
        });
      }

      // 3. Upsert page_sections
      const sections = [
        { section_key: 'home', content: this.state.homeContent },
        { section_key: 'about', content: this.state.aboutContent },
        { section_key: 'contact', content: this.state.contactContent },
        { section_key: 'footer', content: this.state.footerContent },
        { section_key: 'case_studies_page', content: this.state.caseStudiesPageContent }
      ];
      await fetch(`${this.supabaseUrl}/rest/v1/page_sections?on_conflict=section_key`, {
        method: 'POST',
        headers: this.getHeaders({
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        }),
        body: JSON.stringify(sections)
      });

      // 4. Upsert blogs
      const blogRows = (this.state.blogs || []).map((b) => ({
        id: Number(b.id),
        slug: b.slug || slugify(b.title),
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        image: b.image,
        author: b.author || 'AarviCloud Team',
        date: b.date,
        read_time: b.readTime || '8 min read',
        category: b.category || 'Cloud',
        tags: Array.isArray(b.tags) ? b.tags : ['Cloud', 'AI'],
        published: b.published !== false,
        meta_title: b.metaTitle || `${b.title} | AarviCloud`,
        meta_description: b.metaDescription || b.excerpt,
        target_keywords: b.targetKeywords || '',
        meta_robots: b.metaRobots || 'index, follow',
        og_title: b.ogTitle || b.title,
        og_description: b.ogDescription || b.excerpt,
        og_image: b.ogImage || b.image,
        og_url: b.ogUrl || `${s.siteDomain}/blog/${b.slug || b.id}`,
        updated_at: new Date().toISOString()
      }));
      if (blogRows.length > 0) {
        await fetch(`${this.supabaseUrl}/rest/v1/blogs?on_conflict=id`, {
          method: 'POST',
          headers: this.getHeaders({
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          }),
          body: JSON.stringify(blogRows)
        });
      }

      // 5. Upsert portfolio_projects
      const portfolioRows = (this.state.portfolioProjects || []).map((p, idx) => ({
        id: Number(p.id),
        slug: p.slug || slugify(p.title),
        title: p.title,
        category: p.category || 'Development',
        image: p.image,
        description: p.desc || p.description || '',
        tech: Array.isArray(p.tech) ? p.tech : [],
        url: p.url || '',
        featured_on_home: Boolean(p.featuredOnHome),
        sort_order: idx,
        published: p.published !== false,
        updated_at: new Date().toISOString()
      }));
      if (portfolioRows.length > 0) {
        await fetch(`${this.supabaseUrl}/rest/v1/portfolio_projects?on_conflict=id`, {
          method: 'POST',
          headers: this.getHeaders({
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          }),
          body: JSON.stringify(portfolioRows)
        });
      }

      // 6. Upsert case_studies
      const csRows = (this.state.caseStudies || []).map((c) => ({
        id: Number(c.id),
        slug: c.slug || slugify(c.title),
        title: c.title,
        section_category: c.sectionCategory || 'Fortune 500 Clients',
        badge_category: c.badgeCategory || c.sectionCategory || 'Enterprise',
        image: c.image,
        is_new: c.isNew !== false,
        challenge: c.challenge || '',
        solution: c.solution || '',
        results: c.results || '',
        tech: Array.isArray(c.tech) ? c.tech : [],
        features: Array.isArray(c.features) ? c.features : [],
        stats: Array.isArray(c.stats) ? c.stats : [],
        published: c.published !== false,
        meta_title: c.metaTitle || `${c.title} Case Study | AarviCloud`,
        meta_description: c.metaDescription || c.challenge || '',
        target_keywords: c.targetKeywords || '',
        meta_robots: c.metaRobots || 'index, follow',
        og_title: c.ogTitle || `${c.title} Case Study | AarviCloud`,
        og_description: c.ogDescription || c.results || '',
        og_image: c.ogImage || c.image,
        og_url: c.ogUrl || `${s.siteDomain}/case-study/${c.slug || c.id}`,
        updated_at: new Date().toISOString()
      }));
      if (csRows.length > 0) {
        await fetch(`${this.supabaseUrl}/rest/v1/case_studies?on_conflict=id`, {
          method: 'POST',
          headers: this.getHeaders({
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          }),
          body: JSON.stringify(csRows)
        });
      }

      // 7. Upsert custom_pages
      const customRows = (this.state.customPages || []).map((cp) => ({
        id: Number(cp.id),
        slug: cp.slug || slugify(cp.title),
        title: cp.title,
        subtitle: cp.subtitle || '',
        badge: cp.badge || 'AarviCloud Solutions',
        hero_image: cp.heroImage || '',
        content_sections: Array.isArray(cp.contentSections) ? cp.contentSections : [],
        cta_title: cp.ctaTitle || 'Ready to Transform Your Business?',
        cta_text: cp.ctaText || '',
        cta_btn_text: cp.ctaBtnText || 'Contact Us',
        cta_btn_link: cp.ctaBtnLink || '/contact',
        show_in_navbar: Boolean(cp.showInNavbar),
        show_in_footer: Boolean(cp.showInFooter),
        published: cp.published !== false,
        meta_title: cp.metaTitle || `${cp.title} | AarviCloud`,
        meta_description: cp.metaDescription || cp.subtitle || '',
        target_keywords: cp.targetKeywords || '',
        meta_robots: cp.metaRobots || 'index, follow',
        og_title: cp.ogTitle || cp.title,
        og_description: cp.ogDescription || cp.subtitle || '',
        og_image: cp.ogImage || s.defaultOgImage,
        og_url: cp.ogUrl || `${s.siteDomain}/p/${cp.slug}`,
        priority: Number(cp.priority || 0.8),
        changefreq: cp.changefreq || 'weekly',
        updated_at: new Date().toISOString()
      }));
      if (customRows.length > 0) {
        await fetch(`${this.supabaseUrl}/rest/v1/custom_pages?on_conflict=id`, {
          method: 'POST',
          headers: this.getHeaders({
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          }),
          body: JSON.stringify(customRows)
        });
      }

      return { synced: true };
    } catch (err) {
      return { synced: false, reason: err.message };
    }
  }

  async persist() {
    this.saveLocalCache(this.state);
    await this.pushCloudState();
    if (this.pgTablesReady) {
      await this.syncToPostgresTables();
    }
  }

  async verifyAdminCredentials(email, password) {
    const expectedEmail = (process.env.ADMIN_EMAIL || 'rathodjayraj94@gmail.com').trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Aarvicloud@2026';

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = String(password || '');

    // Timing-safe check against configured admin credentials
    const emailMatch = cleanEmail === expectedEmail;
    const passBufA = Buffer.from(cleanPass);
    const passBufB = Buffer.from(expectedPassword);
    const passMatch =
      passBufA.length === passBufB.length &&
      crypto.timingSafeEqual(passBufA, passBufB);

    if (emailMatch && passMatch) {
      return { valid: true, email: expectedEmail, authProvider: 'supabase-verified' };
    }

    // Also allow verifying via Supabase Auth password grant if password was updated in Supabase
    if (this.publishableKey && cleanEmail === expectedEmail) {
      try {
        const res = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            apikey: this.publishableKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: cleanEmail, password: cleanPass })
        });
        if (res.ok) {
          return { valid: true, email: cleanEmail, authProvider: 'supabase-auth' };
        }
      } catch {
        // Ignore network error and fail closed
      }
    }

    return { valid: false };
  }

  async uploadMedia(filename, mimeType, buffer) {
    const safeName = `${Date.now()}-${String(filename || 'upload.png').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const localPath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(localPath, buffer);

    if (this.secretKey) {
      try {
        await fetch(
          `${this.supabaseUrl}/storage/v1/object/${this.mediaBucket}/${safeName}`,
          {
            method: 'POST',
            headers: this.getHeaders({
              'Content-Type': mimeType || 'application/octet-stream',
              'x-upsert': 'true'
            }),
            body: buffer
          }
        );
      } catch (err) {
        console.warn('Supabase media upload warning:', err.message);
      }
    }

    return `/api/media/${safeName}`;
  }

  async getMedia(filename) {
    const cleanName = path.basename(String(filename || ''));
    const localPath = path.join(UPLOADS_DIR, cleanName);
    if (fs.existsSync(localPath)) {
      return {
        buffer: fs.readFileSync(localPath),
        contentType: this.guessMimeType(cleanName)
      };
    }

    if (this.secretKey) {
      try {
        const res = await fetch(
          `${this.supabaseUrl}/storage/v1/object/${this.mediaBucket}/${cleanName}`,
          { headers: this.getHeaders() }
        );
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.writeFileSync(localPath, buffer);
          return {
            buffer,
            contentType: res.headers.get('content-type') || this.guessMimeType(cleanName)
          };
        }
      } catch {
        // ignore
      }
    }
    return null;
  }

  guessMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.svg') return 'image/svg+xml';
    if (ext === '.png') return 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    if (ext === '.webp') return 'image/webp';
    if (ext === '.ico') return 'image/x-icon';
    return 'application/octet-stream';
  }
}

module.exports = { SupabaseCMSStore, slugify };
