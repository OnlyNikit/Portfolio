import React, { createContext, useContext, useEffect, useState } from 'react';

export const DICTIONARY = {
  // Navigation
  nav_home: { en: 'Home', hi: 'होम' },
  nav_about: { en: 'About', hi: 'परिचय' },
  nav_journey: { en: 'Journey', hi: 'शिक्षा यात्रा' },
  nav_projects: { en: 'Projects', hi: 'प्रोजेक्ट्स' },
  nav_thumbnails: { en: 'Thumbnails', hi: 'थंबनेल' },
  nav_contact: { en: 'Contact', hi: 'संपर्क' },
  nav_admin: { en: 'Admin', hi: 'एडमिन' },
  nav_app_download: { en: 'App Download', hi: 'ऐप डाउनलोड' },
  nav_js_console: { en: 'JS Console', hi: 'JS कंसोल' },

  // Hero Section
  hero_student_badge: { en: 'B.Tech CSE (AI & ML) · 2nd Year', hi: 'बी.टेक सीएसई (एआई व एमएल) · द्वितीय वर्ष' },
  hero_tagline: { en: 'FULL STACK DEVELOPER • THUMBNAIL DESIGNER', hi: 'फुल स्टैक डेवलपर • थंबनेल डिज़ाइनर' },
  hero_subheading: { en: 'Undergraduate engineer at Khwaja Moinuddin Chisti Language University, Lucknow, bridging AI architectures, modern full stack platforms, and cinematic visual design.', hi: 'ख्वाजा मोईनुद्दीन चिश्ती भाषा विश्वविद्यालय, लखनऊ के छात्र — आर्टिफिशियल इंटेलिजेंस, आधुनिक फुल स्टैक वेब और सिनेमैटिक विज़ुअल डिज़ाइन का संयोजन।' },
  hero_explore_projects: { en: 'Explore Projects', hi: 'प्रोजेक्ट्स देखें' },
  hero_thumbnail_gallery: { en: 'Thumbnail Gallery', hi: 'थंबनेल गैलरी' },
  hero_download_app: { en: 'Download Web App', hi: 'वेब ऐप डाउनलोड करें' },
  hero_js_interactive: { en: 'Run JavaScript Console', hi: 'जावास्क्रिप्ट कंसोल चलाएं' },

  // ID Card
  id_card_status: { en: 'ACTIVE STUDENT & CREATOR', hi: 'सक्रिय छात्र व क्रिएटर' },
  id_card_focus: { en: 'AI/ML & Web Engineering', hi: 'एआई/एमएल व वेब इंजीनियरिंग' },
  id_card_location: { en: 'Lucknow, Uttar Pradesh', hi: 'लखनऊ, उत्तर प्रदेश' },
  id_card_tap_hint: { en: 'Move cursor or touch to rotate 3D badge', hi: '3D बैज घुमाने के लिए कर्सर हिलाएं' },

  // About Section
  about_badge: { en: 'About Nikit Kumar', hi: 'निकीत कुमार के बारे में' },
  about_heading_main: { en: 'Developer Mindset. Creative Precision.', hi: 'डेवलपर सोच। क्रिएटिव दृष्टिकोण।' },
  about_bio_1: { en: 'I am a passionate Full Stack Developer and Thumbnail Designer currently in my 2nd Year of B.Tech CSE (AI & ML) at Khwaja Moinuddin Chisti Language University in Lucknow, India (2025–2029).', hi: 'मैं एक फुल स्टैक डेवलपर और थंबनेल डिज़ाइनर हूँ, जो ख्वाजा मोईनुद्दीन चिश्ती भाषा विश्वविद्यालय, लखनऊ से बी.टेक सीएसई (एआई व एमएल) के दूसरे वर्ष (2025-2029) में अध्ययनरत हूँ।' },
  about_bio_2: { en: 'My dual focus combines robust backend logic and scalable databases with pixel-perfect frontend aesthetics, 3D interaction, and high-CTR thumbnail compositions for digital creators.', hi: 'मेरा उद्देश्य मजबूत बैकएंड आर्किटेक्चर, स्केलेबल डेटाबेस और आकर्षक 3D वेब अनुभव के साथ-साथ यूट्यूब क्रिएटर्स के लिए उच्च क्लिक-थ्रू-रेट (CTR) थंबनेल तैयार करना है।' },
  about_feature_ai: { en: 'AI & Machine Learning', hi: 'आर्टिफिशियल इंटेलिजेंस और मशीन लर्निंग' },
  about_feature_fullstack: { en: 'Full Stack Engineering', hi: 'फुल स्टैक वेब इंजीनियरिंग' },
  about_feature_creative: { en: 'High-Retention Design', hi: 'हाई-रिटेंशन थंबनेल डिज़ाइन' },

  // Skills
  skills_badge: { en: 'Technical Arsenal', hi: 'तकनीकी दक्षता' },
  skills_heading: { en: 'Mastered Technologies & Frameworks', hi: 'सीखे गए टूल्स और टेक्नोलॉजीज' },

  // Journey
  journey_badge: { en: 'THE JOURNEY', hi: 'मेरी यात्रा' },
  journey_heading: { en: 'Academic Milestones & Institutions', hi: 'शैक्षणिक संस्थान और उपलब्धियां' },
  journey_present: { en: 'Present', hi: 'वर्तमान' },

  // Projects
  projects_badge: { en: 'Engineered Works', hi: 'प्रोजेक्ट्स और अनुप्रयोग' },
  projects_heading: { en: 'Featured Software Deployments', hi: 'चुनिंदा लाइव प्रोजेक्ट्स' },
  projects_live_demo: { en: 'Live Demo', hi: 'लाइव डेमो' },
  projects_source_code: { en: 'Source Code', hi: 'सोर्स कोड' },
  projects_all_categories: { en: 'All Projects', hi: 'सभी प्रोजेक्ट्स' },

  // Thumbnails
  thumbnails_badge: { en: 'Creative Portfolio', hi: 'क्रिएटिव थंबनेल पोर्टफोलियो' },
  thumbnails_heading: { en: 'High-Retention YouTube Thumbnail Art', hi: 'हाई-रिटेंशन यूट्यूब थंबनेल डिज़ाइन्स' },
  thumbnails_view_all: { en: 'View All Thumbnails', hi: 'सभी थंबनेल देखें' },
  thumbnails_modal_open: { en: 'Click to Expand Preview', hi: 'बड़ा करके देखने के लिए क्लिक करें' },

  // Contact
  contact_badge: { en: 'Initiate Contact', hi: 'संपर्क करें' },
  contact_heading: { en: 'Let’s Build Something Extraordinary', hi: 'आइए मिलकर कुछ नया बनाएं' },
  contact_name: { en: 'Your Name', hi: 'आपका नाम' },
  contact_email: { en: 'Email Address', hi: 'ईमेल पता' },
  contact_subject: { en: 'Subject', hi: 'विषय' },
  contact_message: { en: 'Your Message', hi: 'संदेश' },
  contact_send: { en: 'Send Message', hi: 'संदेश भेजें' },
  contact_sending: { en: 'Sending Transmission...', hi: 'संदेश भेजा जा रहा है...' },
  contact_success: { en: 'Message sent successfully! Nikit will get back to you shortly.', hi: 'संदेश सफलतापूर्वक भेजा गया! निकीत जल्द ही आपसे संपर्क करेंगे।' },

  // PWA / App Download
  pwa_banner_title: { en: 'Download Nikit’s App on your Phone', hi: 'निकीत का ऐप अपने फ़ोन में डाउनलोड करें' },
  pwa_banner_desc: { en: 'Fast, smooth, fullscreen experience with offline access.', hi: 'बिना किसी रुकावट के तेज, फुलस्क्रीन और ऑफलाइन अनुभव।' },
  pwa_banner_btn: { en: 'Install App Now', hi: 'अभी इंस्टॉल करें' },
  pwa_dismiss: { en: 'Dismiss', hi: 'हटाएं' },

  // Theme
  theme_selector: { en: 'Color Theme', hi: 'रंग थीम' },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nikit_portfolio_lang');
      if (saved === 'en' || saved === 'hi') return saved;
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nikit_portfolio_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key, fallback = '') => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key]['en'];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
