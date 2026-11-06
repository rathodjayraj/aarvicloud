import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './Blog.css';

const Blog = () => {
  const { cms } = useCMS();
  const posts = cms.blogs || [];

  return (
    <div className="blog section-padding">
      <SEOHead pageKey="blog" />

      <div className="container">
        <div className="section-header">
          <h1>
            Our <span className="gradient-text">Blog</span>
          </h1>
          <p>Insights and updates from the world of enterprise AI, cloud architecture, and custom software solutions.</p>
        </div>

        <div className="blog-grid">
          {posts.map((post, index) => {
            const readTime =
              post.readTime || (post.id === 10 ? '22 min read' : post.id === 11 ? '18 min read' : '12 min read');
            const postSlug = post.slug || String(post.id);
            return (
              <motion.div
                key={post.id}
                className="blog-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="blog-img">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="blog-body">
                  <span className="blog-pill-tag">{post.category}</span>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <Link to={`/blog/${postSlug}`} className="read-article-link">
                      Read article
                    </Link>
                    <span className="blog-card-date">
                      {post.date} · {readTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blog;
