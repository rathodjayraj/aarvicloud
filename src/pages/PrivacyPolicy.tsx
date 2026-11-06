import { motion } from 'framer-motion';
import './InfoPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="info-page section-padding">
      <div className="container">
        <motion.div 
          className="info-content glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="info-header">
            <h1>Privacy <span className="gradient-text">Policy</span></h1>
            <p>Last updated: June 8, 2026</p>
          </div>
          
          <div className="info-body">
            <p>At AarviCloud, accessible from hello@aarvicloud.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AarviCloud and how we use it.</p>
            
            <h2>1. Information We Collect</h2>
            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
            <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
              <li>Provide, operate, and maintain our website and services</li>
              <li>Improve, personalize, and expand our website and services</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>
            
            <h2>3. Log Files</h2>
            <p>AarviCloud follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
            
            <h2>4. Security of Your Information</h2>
            <p>We take appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal data. We use secure servers, encryption methods, and robust access controls to protect sensitive information submitted via our contact forms.</p>
            
            <h2>5. Your Data Protection Rights</h2>
            <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
            <ul>
              <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
              <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
              <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
              <li><strong>The right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
            </ul>
            
            <h2>6. Contact Us</h2>
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <strong>hello@aarvicloud.com</strong> or call us at <strong>+91 88664 87551</strong>.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
