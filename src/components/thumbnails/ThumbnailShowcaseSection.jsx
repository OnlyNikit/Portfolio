import { useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function ThumbnailShowcaseSection({
  onViewAll,
  onOpenThumbnailModal,
}) {
  const { thumbnails } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();

  // Pehle Featured, phir baaki. Max 4 dikhenge.
  const featuredThumbnails = useMemo(() => {
    const list = Array.isArray(thumbnails) ? thumbnails : [];
    const featured = list.filter((item) => item.featured);
    const rest = list.filter((item) => !item.featured);
    return [...featured, ...rest].slice(0, 4);
  }, [thumbnails]);

  return (
    <section id="thumbnails" className="py-24 relative overflow-hidden bg-[#060812] border-t border-white/[0.04]">
      {/* Glow highlight */}
      <div
        className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[150px] pointer-events-none opacity-15"
        style={{ backgroundColor: themeConfig.secondaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div
              className="text-xs font-mono uppercase tracking-widest font-bold"
              style={{ color: themeConfig.primaryColor }}
            >
              05. {t('thumbnails_badge').toUpperCase()}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
              {language === 'hi' ? t('thumbnails_heading') : 'Thumbnail Design Art.'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'hi'
                ? 'हाई-क्लिक-थ्रू-रेट (CTR) और सिनेमाई 3D थंबनेल्स जो यूट्यूब चैनलों और टेक ब्रांड्स के लिए विज़ुअल प्रभाव पैदा करते हैं।'
                : 'High-CTR, cinematic visual compositions crafted for leading tech, gaming, and creator channels. Engineered with dramatic lighting, 3D typography, and psychological retention triggers.'}
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] text-sm font-semibold transition-all hover:scale-[1.02] shadow-lg cursor-pointer whitespace-nowrap self-start md:self-auto box-glow-hover"
          >
            <span>{t('thumbnails_view_all')}</span>
            <ArrowRight className="w-4 h-4" style={{ color: themeConfig.primaryColor }} />
          </button>
        </div>

        {featuredThumbnails.length === 0 && (
          <div className="p-10 text-center text-slate-500 font-mono text-sm rounded-3xl bg-[#0c1022] border border-white/[0.06]">
            Thumbnails will be added soon.
          </div>
        )}

        {/* Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredThumbnails.map((thumb) => (
            <div
              key={thumb._id}
              data-cursor="thumbnail"
              onClick={() => onOpenThumbnailModal(thumb)}
              className="group relative rounded-3xl overflow-hidden bg-[#0c1022] border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/15 cursor-pointer flex flex-col box-glow-hover"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={thumb.image}
                  alt={thumb.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0.15';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="px-3 py-1 rounded-xl text-[11px] font-mono font-bold backdrop-blur-md border border-white/20 shadow-md box-glow"
                    style={{
                      backgroundColor: `${themeConfig.bgHex}dd`,
                      color: themeConfig.primaryColor,
                    }}
                  >
                    {thumb.category}
                  </span>
                </div>

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span
                    className="px-4 py-2 rounded-xl text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 box-glow"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{t('thumbnails_modal_open')}</span>
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="text-xs font-mono text-slate-400">
                  Client: {thumb.client || 'Original Concept'}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-heading leading-snug">
                  {thumb.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm line-clamp-2">
                  {thumb.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}