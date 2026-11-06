import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './BlogDetail.css';

function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} style={{ color: 'var(--text-main)' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderStructuredContent(raw: string) {
  const lines = String(raw || '').split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${keyPrefix}`}>
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineBold(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(String(index));
      return;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2).trim());
      return;
    }
    flushList(String(index));

    if (line.startsWith('###### ')) {
      elements.push(<h6 key={index}>{line.slice(7)}</h6>);
    } else if (line.startsWith('##### ')) {
      elements.push(<h5 key={index}>{line.slice(6)}</h5>);
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={index}>{line.slice(5)}</h4>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={index}>{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={index}>{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      // Convert any accidental # inside body to H2 so the page keeps a single H1
      elements.push(<h2 key={index}>{line.slice(2)}</h2>);
    } else {
      elements.push(<p key={index}>{renderInlineBold(line)}</p>);
    }
  });

  flushList('end');
  return elements;
}

function renderArticleBody(content: string) {
  if (!content) return null;
  // If content contains HTML tags (e.g. from Tiny Editor WYSIWYG), render HTML directly
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return <div className="html-article-body" dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return renderStructuredContent(content);
}

const BlogDetail = () => {
  const { id } = useParams();
  const { cms } = useCMS();

  const post = (cms.blogs || []).find(
    (p) => String(p.id) === String(id) || p.slug === id
  );

  if (!post) {
    return (
      <div className="blog-detail section-padding">
        <SEOHead title="Article Not Found | AarviCloud Blog" robots="noindex, nofollow" />
        <div className="container">
          <h1>Article Not Found</h1>
          <Link to="/blog" className="back-link">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const tags = Array.isArray(post.tags) && post.tags.length > 0 ? post.tags : ['Cloud', 'Technology', 'AI'];

  return (
    <div className="blog-detail section-padding">
      <SEOHead
        title={post.metaTitle || `${post.title} | AarviCloud`}
        description={post.metaDescription || post.excerpt}
        keywords={post.targetKeywords || tags.join(', ')}
        robots={post.metaRobots || 'index, follow'}
        ogTitle={post.ogTitle || post.title}
        ogDescription={post.ogDescription || post.excerpt}
        ogImage={post.ogImage || post.image}
        ogUrl={post.ogUrl}
        canonicalUrl={post.canonicalUrl}
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.ogImage || post.image,
          author: {
            '@type': 'Person',
            name: post.author
          },
          publisher: {
            '@type': 'Organization',
            name: cms.siteSettings.siteName || 'AarviCloud IT Solutions'
          },
          datePublished: post.date
        }}
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/blog" className="back-link">
            <ArrowLeft size={18} /> Back to Articles
          </Link>

          <div className="detail-header">
            <span className="blog-tag">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="blog-meta">
              <span>
                <User size={16} /> {post.author}
              </span>
              <span>
                <Calendar size={16} /> {post.date}
              </span>
              <span>
                <Clock size={16} /> {post.readTime || '8 min read'}
              </span>
            </div>
          </div>

          <div className="detail-image">
            <img src={post.image} alt={post.title} />
          </div>

          <div className="detail-content">
            <p className="excerpt">{post.excerpt}</p>
            <div className="main-content">{renderArticleBody(post.content)}</div>

            <div className="detail-footer">
              <div className="tags">
                <Tag size={16} />
                {tags.map((tag, idx) => (
                  <span key={idx}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;
