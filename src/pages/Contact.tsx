import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import SEOHead from '../components/SEOHead';
import './Contact.css';

const Contact = () => {
  const { cms } = useCMS();
  const cc = cms.contactContent || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        let errorMsg = 'Failed to send message. Please try again.';
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch {
          // ignore
        }
        setStatus('error');
        setErrorMessage(errorMsg);
      }
    } catch {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again later.');
    }
  };

  return (
    <div className="contact section-padding">
      <SEOHead pageKey="contact" />

      <div className="container">
        <div className="section-header">
          <h1>
            {cc.h1Prefix || 'Contact'} <span className="gradient-text">{cc.h1Highlight || 'Us'}</span>
          </h1>
          <p>{cc.subtitle || "Have a project in mind? Let's build something amazing together."}</p>
        </div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="info-card glass-card">
              <h2>{cc.cardHeading || 'Get In Touch'}</h2>
              <p>{cc.cardDescription || "We're here to answer any questions you may have about our IT solutions."}</p>

              <div className="contact-methods">
                <div className="method">
                  <div className="method-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3>Email</h3>
                    <p>{cc.email || 'hello@aarvicloud.com'}</p>
                  </div>
                </div>
                <div className="method">
                  <div className="method-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3>Phone</h3>
                    <p>{cc.phone || '+91 88664 87551'}</p>
                  </div>
                </div>
                <div className="method">
                  <div className="method-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3>Office</h3>
                    <p>{cc.officeAddress || 'TWINSTAR, 150 Feet Ring Rd, near Nana Mava Road, Rajkot, Gujarat 360004'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form className="contact-form glass-card" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us about your project..."
                  required
                ></textarea>
              </div>

              {status === 'success' && (
                <div style={{ color: '#10b981', fontWeight: 500, fontSize: '0.95rem', margin: '0.5rem 0' }}>
                  Thank you! Your message has been sent and saved. We will get back to you shortly.
                </div>
              )}

              {status === 'error' && (
                <div style={{ color: '#ef4444', fontWeight: 500, fontSize: '0.95rem', margin: '0.5rem 0' }}>
                  {errorMessage}
                </div>
              )}

              <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <>
                    Sending... <Loader2 className="animate-spin" size={18} />
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
