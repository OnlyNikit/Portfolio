import { motion } from 'motion/react';
import { ArrowDown, Code, Sparkles, FolderGit2, Image as ImageIcon, Terminal, Cpu } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { ThreeBackground } from './ThreeBackground.jsx';
import { ThreeIdCard } from './ThreeIdCard.jsx';

export function HeroSection({
  onExploreProjects,
  onExploreThumbnails,
  onOpenJsConsole,
}) {
  const { profile, siteSettings } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();

  const displayName = profile?.displayName || siteSettings?.heroHeading || 'NIKIT KUMAR';
  const college = profile?.college || 'Khwaja Moinuddin Chisti Language University';
  const course = profile?.course || 'B.Tech CSE (AI & ML)';
  const currentYear = profile?.currentYear || '2nd Year';
  const location = profile?.location || 'Lucknow, India';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* 3D WebGL Particle Canvas */}
      <ThreeBackground />

      {/* Atmospheric radial ambient light */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] blur-[150px] pointer-events-none -z-10 opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${themeConfig.primaryColor} 0%, ${themeConfig.secondaryColor} 50%, transparent 80%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Identity */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Subtle editorial kicker */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/30 text-xs text-slate-300 font-mono box-glow">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: themeConfig.primaryColor }}
              />
              <span className="text-white font-medium">
                {language === 'hi' ? t('hero_student_badge') : `${course} · ${currentYear}`}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{location}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05] font-heading">
                {displayName.split(' ')[0]} <br className="hidden sm:inline" />
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${themeConfig.primaryColor}, #ffffff, ${themeConfig.secondaryColor})`,
                  }}
                >
                  {displayName.split(' ').slice(1).join(' ') || 'KUMAR'}
                </span>
              </h1>

              <p
                className="text-sm sm:text-base md:text-lg font-mono tracking-widest font-semibold uppercase pt-1"
                style={{ color: themeConfig.primaryColor }}
              >
                {t('hero_tagline')}
              </p>
            </div>

            {/* Narrative Prose */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {language === 'hi' ? (
                t('hero_subheading')
              ) : (
                <>
                  Undergraduate engineer at{' '}
                  <span className="text-white font-medium">{college}</span> bridging artificial intelligence
                  architectures, modern full-stack web platforms, and high-retention visual storytelling.
                </>
              )}
            </p>

            {/* Action Buttons: Explore, Thumbnails & JS Console (NO download button here as requested - strictly in sidebar) */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onExploreProjects}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-950 transition-all shadow-lg cursor-pointer box-glow-hover"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                  boxShadow: `0 10px 25px -5px ${themeConfig.accentGlow}`,
                }}
              >
                <Code className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform stroke-[2.5]" />
                <span>{t('hero_explore_projects')}</span>
              </button>

              <button
                onClick={onExploreThumbnails}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.12] hover:border-cyan-500/40 text-sm font-semibold transition-all cursor-pointer box-glow-hover"
              >
                <ImageIcon className="w-4 h-4" style={{ color: themeConfig.primaryColor }} />
                <span>{t('hero_thumbnail_gallery')}</span>
              </button>

              {/* Interactive JavaScript Console Trigger */}
              {onOpenJsConsole && (
                <button
                  onClick={onOpenJsConsole}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-xs sm:text-sm font-mono font-medium transition-all cursor-pointer box-glow-hover"
                  title="Run real JavaScript in interactive console"
                >
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>JS Console</span>
                </button>
              )}
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Stack & Web Engineering</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>AI & Machine Learning</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>High-CTR Thumbnail Design</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Digital Identity Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <ThreeIdCard />
          </motion.div>
        </div>
      </div>

      {/* Floating scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer hidden md:flex flex-col items-center gap-1"
        onClick={() => {
          const el = document.getElementById('about');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Explore</span>
        <ArrowDown className="w-4 h-4 text-cyan-400" />
      </motion.div>
    </section>
  );
}
