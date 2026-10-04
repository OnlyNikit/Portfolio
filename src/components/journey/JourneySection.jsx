import { motion } from 'motion/react';
import { Calendar, MapPin, GraduationCap, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function JourneySection() {
  const { education } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();

  return (
    <section id="journey" className="py-24 relative overflow-hidden bg-[#05070e] border-t border-white/[0.04]">
      {/* Background illumination */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[600px] h-[500px] blur-[150px] pointer-events-none opacity-15"
        style={{ backgroundColor: themeConfig.secondaryColor }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <div
            className="text-xs font-mono uppercase tracking-widest font-bold"
            style={{ color: themeConfig.primaryColor }}
          >
            02. {t('journey_badge').toUpperCase()}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            {language === 'hi' ? t('journey_heading') : 'The Journey.'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {language === 'hi'
              ? 'जो सफर बचपन में technology के प्रति curiosity से शुरू हुआ, वह आज learning, experimenting, freelancing और real-world products बनाने की journey बन चुका है।'
              : 'What started with a childhood curiosity about technology turned into a journey of learning, experimenting, freelancing, and building real-world products.'}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical central glowing line */}
          <div
            className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-[2px] sm:-translate-x-1/2 opacity-60"
            style={{
              background: `linear-gradient(to bottom, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
              boxShadow: `0 0 14px ${themeConfig.accentGlow}`,
            }}
          />

          <div className="space-y-12">
            {education.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Badge with glow */}
                  <div
                    className="absolute left-4 sm:left-1/2 -translate-x-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-[#080b18] border-2 shadow-lg z-10 box-glow"
                    style={{
                      borderColor: themeConfig.primaryColor,
                      boxShadow: `0 0 18px ${themeConfig.accentGlow}`,
                    }}
                  >
                    <GraduationCap className="w-4 h-4" style={{ color: themeConfig.primaryColor }} />
                  </div>

                  {/* Spacer for two-sided alignment */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Content Card with glow */}
                  <div className={`w-full sm:w-1/2 pl-12 sm:pl-0 ${isEven ? 'sm:pr-12' : 'sm:pl-12'}`}>
                    <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1022]/90 border border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-xl shadow-black/40 group backdrop-blur-xl box-glow-hover">
                      {/* Year & Level */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                        <span
                          className="text-xs font-mono font-bold"
                          style={{ color: themeConfig.primaryColor }}
                        >
                          {item.level}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {item.startYear} – {item.endYear || (language === 'hi' ? 'वर्तमान' : 'Present')}
                          </span>
                        </div>
                      </div>

                      {/* Institution Name */}
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors font-heading">
                        {item.institution}
                      </h3>

                      {/* Field of Study */}
                      {item.field && (
                        <div className="text-xs font-mono text-cyan-400 mt-1">
                          {item.field}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Location & Key Highlights */}
                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>{item.location}</span>
                        </div>

                        {item.achievements && item.achievements.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                            <CheckCircle className="w-3 h-3 text-cyan-400" />
                            <span>{item.achievements[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
