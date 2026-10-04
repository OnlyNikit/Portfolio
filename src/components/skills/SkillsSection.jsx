import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  Server,
  Database,
  Brain,
  Terminal,
  Wrench,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function SkillsSection() {
  const { skills } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set();
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [skills]);

  const groupedSkills = useMemo(() => {
    const map = new Map();
    const list =
      activeCategory === 'All'
        ? skills
        : skills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

    list.forEach((skill) => {
      const cat = skill.category || 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(skill);
    });

    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [skills, activeCategory]);

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return Code;
      case 'backend':
        return Server;
      case 'database':
        return Database;
      case 'ai/ml':
        return Brain;
      case 'programming':
        return Terminal;
      case 'tools':
        return Wrench;
      case 'design':
        return Palette;
      default:
        return Code;
    }
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[#070914] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div
              className="text-xs font-mono uppercase tracking-widest font-bold"
              style={{ color: themeConfig.primaryColor }}
            >
              03. {t('skills_badge').toUpperCase()}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
              {language === 'hi' ? t('skills_heading') : 'Technical Arsenal & Stack.'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'hi'
                ? 'आधुनिक जावास्क्रिप्ट, वेब फ्रेमवर्क्स, डेटाबेस और क्रिएटिव थंबनेल डिज़ाइन्स में दक्षता।'
                : 'Rigorous foundations in modern JavaScript runtimes, full-stack web platforms, machine learning, and high-retention thumbnail art.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'text-slate-950 font-bold shadow-md box-glow'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.08]'
                  }`}
                  style={
                    isSelected
                      ? {
                          background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                        }
                      : {}
                  }
                >
                  {cat === 'All' ? (language === 'hi' ? 'सभी' : 'All') : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Cards Grid with box glow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {groupedSkills.map((group) => {
              const Icon = getCategoryIcon(group.category);

              return (
                <motion.div
                  layout
                  key={group.category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 sm:p-7 rounded-3xl bg-[#0c1022]/80 border border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-xl shadow-black/30 group box-glow-hover"
                >
                  <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-white/[0.06]">
                    <div
                      className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md box-glow"
                      style={{ borderColor: `${themeConfig.primaryColor}50` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: themeConfig.primaryColor }} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-heading">
                        {group.category}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {group.items.length} {language === 'hi' ? 'दक्षताएं' : 'Skills Mastered'}
                      </span>
                    </div>
                  </div>

                  {/* Skills Pill List */}
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill, idx) => (
                      <span
                        key={skill._id || idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-slate-200 group-hover:border-cyan-500/30 transition-colors"
                      >
                        <CheckCircle2
                          className="w-3 h-3 shrink-0"
                          style={{ color: themeConfig.primaryColor }}
                        />
                        <span>{skill.name}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
