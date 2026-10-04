import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Sparkles, Filter } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function ThumbnailGalleryPage({ onBackToHome }) {
  const { thumbnails } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxThumb, setLightboxThumb] = useState(null);

  const list = Array.isArray(thumbnails) ? thumbnails : [];

  const categories = useMemo(() => {
    const set = new Set();
    list.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [list]);

  const filteredThumbnails = useMemo(() => {
    if (selectedCategory === 'All') return list;
    return list.filter(
      (item) => (item.category || '').toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [list, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#05060b] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] blur-[160px] pointer-events-none opacity-20"
        style={{ backgroundColor: themeConfig.primaryColor }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back navigation & Header */}
        <div className="mb-12 space-y-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer box-glow-hover"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: themeConfig.primaryColor }} />
            <span>{language === 'hi' ? 'पोर्टफोलियो पर वापस जाएं' : 'Return to Portfolio'}</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div
                className="text-xs font-mono uppercase tracking-widest font-bold"
                style={{ color: themeConfig.primaryColor }}
              >
                {t('thumbnails_badge')}
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-heading">
                {t('thumbnails_heading')}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                {language === 'hi'
                  ? 'यूट्यूब, टेक और गेमिंग क्रिएटर्स के लिए तैयार किए गए हाई-इम्पैक्ट और सिनेमैटिक थंबनेल्स का संग्रह।'
                  : 'Explore custom-crafted visual concepts, YouTube thumbnails, and key art designed for maximum audience engagement, atmospheric illumination, and high-retention storytelling.'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-x-auto box-glow max-w-full">
              <div className="px-2 text-slate-500 hidden sm:block">
                <Filter className="w-3.5 h-3.5" />
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                  style={
                    selectedCategory === cat
                      ? {
                          background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                        }
                      : {}
                  }
                >
                  {cat === 'All' ? (language === 'hi' ? 'सभी' : 'All') : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredThumbnails.length === 0 && (
          <div className="p-10 text-center text-slate-500 font-mono text-sm rounded-3xl bg-[#0c1022] border border-white/[0.06]">
            Abhi koi thumbnail nahi hai.
          </div>
        )}

        {/* Thumbnails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredThumbnails.map((thumb) => (
              <motion.div
                layout
                key={thumb._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                data-cursor="thumbnail"
                onClick={() => setLightboxThumb(thumb)}
                className="group relative rounded-3xl overflow-hidden bg-[#0c1022] border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-300 shadow-xl cursor-pointer flex flex-col box-glow-hover"
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
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold backdrop-blur-md border border-white/20 shadow-md"
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
                      className="px-3.5 py-1.5 rounded-xl text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 box-glow"
                      style={{
                        background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>{t('thumbnails_modal_open')}</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Client: {thumb.client || 'Original Concept'}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-heading leading-snug">
                      {thumb.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-2 pt-1">
                    {thumb.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxThumb && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
              onClick={() => setLightboxThumb(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#090c18] border border-white/[0.1] shadow-2xl p-5 sm:p-8 space-y-4 box-glow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className="text-xs font-mono uppercase tracking-wider font-bold"
                      style={{ color: themeConfig.primaryColor }}
                    >
                      {lightboxThumb.category} · {lightboxThumb.client || 'Original Concept'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                      {lightboxThumb.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setLightboxThumb(null)}
                    className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.08] box-glow">
                  <img
                    src={lightboxThumb.image}
                    alt={lightboxThumb.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {lightboxThumb.description}
                </p>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => setLightboxThumb(null)}
                    className="px-5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}