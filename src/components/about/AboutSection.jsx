import { motion } from 'motion/react';
import { Cpu, Terminal, Sparkles, GraduationCap, MapPin } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function AboutSection() {
  const { profile, siteSettings } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();

  const bio =
    language === 'hi'
      ? t('about_bio_1')
      : profile?.bio || siteSettings?.aboutText || 'Driven developer and creative designer crafting intelligent web systems and visuals.';
  const course = profile?.course || 'B.Tech CSE (AI & ML)';
  const college = profile?.college || 'Khwaja Moinuddin Chisti Language University';
  const location = profile?.location || 'Lucknow, India';

  const pillars = [
    {
      icon: Terminal,
      title: language === 'hi' ? t('about_feature_fullstack') : 'Full Stack Engineering',
      desc:
        language === 'hi'
          ? 'React, Node.js, Express, MongoDB, और आधुनिक JavaScript आर्किटेक्चर के साथ सुरक्षित, स्केलेबल वेब ऐप्स का निर्माण।'
          : 'Building responsive, scalable web applications with React, Node.js, Express, MongoDB, and modern JavaScript architectures.',
    },
    {
      icon: Cpu,
      title: language === 'hi' ? t('about_feature_ai') : 'AI & Machine Learning',
      desc:
        language === 'hi'
          ? 'बी.टेक सीएसई (एआई व एमएल) में न्यूरल नेटवर्क, कंप्यूटर विज़न, Python और व्यावहारिक मशीन लर्निंग अनुप्रयोगों पर कार्य।'
          : 'Pursuing B.Tech in CSE (AI & ML). Exploring computer vision, neural network architectures, Python, TensorFlow, and intelligent screening tools.',
    },
    {
      icon: Sparkles,
      title: language === 'hi' ? t('about_feature_creative') : 'Thumbnail & Visual Design',
      desc:
        language === 'hi'
          ? 'यूट्यूब क्रिएटर्स के लिए हाई-रिटेंशन, सिनेमाई और आकर्षक 3D थंबनेल डिज़ाइन्स जो व्यूज और रिटेंशन को अधिकतम करते हैं।'
          : 'Crafting high-retention, cinematic thumbnails engineered for click-through impact, storytelling depth, and volumetric illumination.',
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#070914]/80 border-t border-white/[0.04]">
      {/* Background ambient lighting */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 blur-[140px] pointer-events-none opacity-20"
        style={{ backgroundColor: themeConfig.secondaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div
            className="text-xs font-mono uppercase tracking-widest font-bold"
            style={{ color: themeConfig.primaryColor }}
          >
            01. {t('nav_about').toUpperCase()}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            {language === 'hi' ? (
              t('about_heading_main')
            ) : (
              <>
                Developer Mindset. <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${themeConfig.primaryColor}, #ffffff, ${themeConfig.secondaryColor})`,
                  }}
                >
                  Creative Precision.
                </span>
              </>
            )}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
            {bio}
          </p>
        </div>

        {/* 3 Pillars Grid with box glow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-[#0c1020]/80 border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 shadow-xl relative overflow-hidden box-glow-hover"
              >
                <div
                  className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md box-glow"
                  style={{ borderColor: `${themeConfig.primaryColor}50` }}
                >
                  <Icon className="w-6 h-6" style={{ color: themeConfig.primaryColor }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-heading tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Academic Anchor Banner with box glow */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0b0e1b] via-[#11162a] to-[#0b0e1b] border border-white/[0.08] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl box-glow">
          <div className="flex items-center gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-950 font-black shrink-0 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
              }}
            >
              <GraduationCap className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div
                className="text-xs font-mono tracking-wider uppercase font-bold"
                style={{ color: themeConfig.primaryColor }}
              >
                {language === 'hi' ? 'उच्च शिक्षा विवरण' : 'Academic Foundation'}
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white font-heading">
                {course} · {college}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {language === 'hi' ? 'बैच 2025 – 2029 · लखनऊ, उत्तर प्रदेश' : 'Cohort: 2025 – 2029 · Lucknow, Uttar Pradesh, India'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
