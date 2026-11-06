import { motion } from 'framer-motion';
import './InfoPages.css';

const TermsOfService = () => {
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
            <h1>Terms of <span className="gradient-text">Service</span></h1>
            <p>Last updated: June 8, 2026</p>
          </div>
          
          <div className="info-body">
            <p>Welcome to AarviCloud! These terms and conditions outline the rules and regulations for the use of AarviCloud's Website, located at hello@aarvicloud.com.</p>
            <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use AarviCloud if you do not agree to take all of the terms and conditions stated on this page.</p>
            
            <h2>1. Intellectual Property Rights</h2>
            <p>Other than the content you own, under these Terms, AarviCloud and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website.</p>
            
            <h2>2. Restrictions</h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul>
              <li>Publishing any Website material in any other media without prior consent</li>
              <li>Selling, sublicensing, and/or otherwise commercializing any Website material</li>
              <li>Publicly performing and/or showing any Website material</li>
              <li>Using this Website in any way that is or may be damaging to this Website</li>
              <li>Using this Website in any way that impacts user access to this Website</li>
              <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity</li>
            </ul>
            
            <h2>3. No Warranties</h2>
            <p>This Website is provided "as is," with all faults, and AarviCloud expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>
            
            <h2>4. Limitation of Liability</h2>
            <p>In no event shall AarviCloud, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. AarviCloud, including its officers, directors, and employees, shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.</p>
            
            <h2>5. Indemnification</h2>
            <p>You hereby indemnify to the fullest extent AarviCloud from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>
            
            <h2>6. Severability</h2>
            <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.</p>
            
            <h2>7. Governing Law & Jurisdiction</h2>
            <p>These Terms will be governed by and interpreted in accordance with the laws of the State of Gujarat, India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Rajkot for the resolution of any disputes.</p>
            
            <h2>8. Contact Information</h2>
            <p>If you have any queries regarding any of our terms, please contact us at <strong>hello@aarvicloud.com</strong> or call us at <strong>+91 88664 87551</strong>.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
