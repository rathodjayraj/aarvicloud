import './AnimatedIcon.css';

// 1. Cloud Solutions
export const CloudIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon cloud-icon">
    <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.54-3.5-3.54-6-7-6a6.5 6.5 0 0 0-6.5 6.5c0 1.5.5 3 1.5 4" />
    <line x1="9" y1="11" x2="9" y2="19" stroke="#00bcd4" strokeDasharray="4 2" className="flow-up" />
    <line x1="13" y1="13" x2="13" y2="19" stroke="#00bcd4" strokeDasharray="4 2" className="flow-down" />
    <circle cx="9" cy="11" r="1.5" fill="#00bcd4" className="pulse" />
    <circle cx="13" cy="13" r="1.5" fill="#00bcd4" className="pulse-delayed" />
  </svg>
);

// 2. Cyber Security
export const SecurityIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon security-icon">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 11l3 3 5-5" stroke="#00bcd4" strokeDasharray="15" strokeDashoffset="15" className="draw-check" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="#00bcd4" strokeWidth="1.5" className="scanner" />
  </svg>
);

// 3. Digital Transformation
export const TransformIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon transform-icon">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    <circle cx="13" cy="2.2" r="1.8" fill="#00bcd4" className="pulse" />
    <circle cx="11" cy="21.8" r="1.8" fill="#00bcd4" className="pulse-delayed" />
  </svg>
);

// 4. Data Analytics
export const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon analytics-icon">
    <line x1="18" y1="20" x2="18" y2="10" stroke="#00bcd4" className="grow-bar-1" />
    <line x1="12" y1="20" x2="12" y2="4" className="grow-bar-2" />
    <line x1="6" y1="20" x2="6" y2="14" stroke="#00bcd4" className="grow-bar-3" />
    <path d="M3 18l6-6 4 4 8-8" />
  </svg>
);

// 5. IT Consulting
export const ConsultingIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon consulting-icon">
    <circle cx="12" cy="5" r="3" />
    <circle cx="6" cy="18" r="3" stroke="#00bcd4" />
    <circle cx="18" cy="18" r="3" stroke="#00bcd4" />
    <line x1="12" y1="8" x2="7.5" y2="15.5" stroke="#00bcd4" strokeDasharray="5" className="flow-dash-1" />
    <line x1="12" y1="8" x2="16.5" y2="15.5" stroke="#00bcd4" strokeDasharray="5" className="flow-dash-2" />
  </svg>
);

// 6. App Development
export const AppIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon app-icon">
    <rect x="2" y="3" width="14" height="11" rx="2" />
    <line x1="2" y1="14" x2="16" y2="14" />
    <rect x="15" y="9" width="7" height="12" rx="1.5" stroke="#00bcd4" />
    <circle cx="18.5" cy="18" r="1.5" fill="#00bcd4" className="pulse" />
  </svg>
);

// 7. CRM Development
export const CrmIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon crm-icon">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#00bcd4" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#00bcd4" />
  </svg>
);

// 8. ERP Development
export const ErpIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon erp-icon">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#00bcd4" className="spin-gear" />
  </svg>
);

// 9. UI/UX Design
export const UiUxIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon uiux-icon">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" stroke="#00bcd4" />
    <circle cx="15" cy="15" r="2" stroke="#00bcd4" />
    <path d="M9 9h6v6" stroke="#00bcd4" strokeDasharray="4 2" className="dash-move" />
  </svg>
);

// 10. SEO Optimization
export const SeoIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon seo-icon">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#00bcd4" className="pulse" />
    <line x1="8" y1="11" x2="14" y2="11" stroke="#00bcd4" strokeDasharray="3" />
  </svg>
);

// 11. Digital Marketing
export const MarketingIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon marketing-icon">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" stroke="#00bcd4" strokeWidth="3" className="chat-dots" />
  </svg>
);

// --- About Us Core Values ---

// 12. Mission
export const MissionIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon mission-icon">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" stroke="#00bcd4" />
    <circle cx="12" cy="12" r="2" fill="#00bcd4" className="target-radar" />
  </svg>
);

// 13. Vision
export const VisionIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon vision-icon">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.75 0L12 5.67l-1.09-1.06a5.5 5.5 0 0 0-7.75 7.75l1.09 1.09 7.75 7.75 7.75-7.75 1.09-1.09a5.5 5.5 0 0 0 0-7.75z" stroke="#00bcd4" className="heart-beat" />
  </svg>
);

// 14. Commitment
export const CommitmentIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon commitment-icon">
    <circle cx="12" cy="8" r="7" className="award-shine" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" stroke="#00bcd4" />
  </svg>
);

// 15. Core Security
export const CoreSecurityIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon security-check-icon">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 11l3 3 5-5" stroke="#00bcd4" className="draw-check" strokeDasharray="15" strokeDashoffset="15" />
  </svg>
);
