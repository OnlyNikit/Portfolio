import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Layers, X, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function ProjectsSection() {
  const { projects } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [caseStudyProject, setCaseStudyProject] = useState(null);

  const activeProject = projects[selectedProjectIndex] || projects[0];

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[#05070e] border-t border-white/[0.04]">
      {/* Ambient background glow */}
      <div
        className="absolute left-1/3 top-1/4 -translate-x-1/2 w-[550px] h-[500px] blur-[150px] pointer-events-none opacity-20"
        style={{ backgroundColor: themeConfig.primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div
              className="text-xs font-mono uppercase tracking-widest font-bold"
              style={{ color: themeConfig.primaryColor }}
            >
              04. {t('projects_badge').toUpperCase()}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
              {language === 'hi' ? t('projects_heading') : 'Engineering Showcase.'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'hi'
                ? 'फुल-स्टैक आर्किटेक्चर और मशीन लर्निंग सिस्टम्स जो आधुनिक तकनीकों पर आधारित हैं।'
                : 'Full-stack architectures and machine learning systems built with modern paradigms.'}
            </p>
          </div>

          {/* Project Switcher Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-x-auto box-glow">
            {projects.map((proj, idx) => (
              <button
                key={proj._id}
                onClick={() => setSelectedProjectIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedProjectIndex === idx
                    ? 'text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
                style={
                  selectedProjectIndex === idx
                    ? {
                        background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                      }
                    : {}
                }
              >
                {proj.name}
              </button>
            ))}
          </div>
        </div>

        {/* Large Interactive Project Preview Window with box-glow */}
        <div className="relative rounded-3xl bg-[#0a0d1c] border border-white/[0.08] hover:border-cyan-500/40 p-6 sm:p-10 shadow-2xl shadow-black/80 transition-all group overflow-hidden box-glow-hover">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Live Preview Display */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  data-cursor="project"
                  className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-slate-950 aspect-[16/10] shadow-2xl group/preview cursor-pointer box-glow"
                  onClick={() => setCaseStudyProject(activeProject)}
                >
                  {/* Browser window header */}
                  <div className="px-4 py-2.5 bg-[#0e1224] border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]">
                      preview // {activeProject.slug}
                    </div>
                    <div
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm"
                      style={{
                        backgroundColor: `${themeConfig.primaryColor}20`,
                        color: themeConfig.primaryColor,
                      }}
                    >
                      {language === 'hi' ? 'लाइव प्रीव्यू' : 'LIVE PREVIEW'}
                    </div>
                  </div>

                  {/* Screenshot Image */}
                  <div className="relative w-full h-[calc(100%-37px)] overflow-hidden bg-slate-900">
                    <img
                      src={activeProject.coverImage}
                      alt={activeProject.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover/preview:scale-105 transition-transform duration-500"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span
                        className="px-4 py-2 rounded-xl text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 box-glow"
                        style={{
                          background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>{language === 'hi' ? 'केस स्टडी देखें' : 'Inspect Case Study'}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Project Details Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <div
                      className="text-xs font-mono uppercase tracking-widest font-bold"
                      style={{ color: themeConfig.primaryColor }}
                    >
                      {activeProject.category || 'Full Stack Project'}
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                      {activeProject.name}
                    </h3>
                  </div>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {activeProject.shortDescription}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      {language === 'hi' ? 'टेक्नोलॉजी स्टैक' : 'TECHNOLOGY STACK'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-semibold transition-colors box-glow-hover"
                      >
                        <Github className="w-4 h-4" />
                        <span>{t('projects_source_code')}</span>
                      </a>
                    )}

                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-md transition-all box-glow"
                        style={{
                          background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                        }}
                      >
                        <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                        <span>{t('projects_live_demo')}</span>
                      </a>
                    )}

                    <button
                      onClick={() => setCaseStudyProject(activeProject)}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'विस्तार से पढ़ें' : 'Full Architecture'}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Case Study Modal Overlay */}
        <AnimatePresence>
          {caseStudyProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#090c18] border border-white/[0.1] shadow-2xl overflow-y-auto text-white p-6 sm:p-10 space-y-6 box-glow"
              >
                <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
                  <div className="space-y-1">
                    <span
                      className="text-xs font-mono uppercase tracking-wider font-bold"
                      style={{ color: themeConfig.primaryColor }}
                    >
                      {caseStudyProject.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                      {caseStudyProject.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setCaseStudyProject(null)}
                    className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.08]">
                  <img
                    src={caseStudyProject.coverImage}
                    alt={caseStudyProject.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white font-heading">
                    {language === 'hi' ? 'प्रोजेक्ट अवलोकन व आर्किटेक्चर' : 'Architecture & Overview'}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {caseStudyProject.longDescription || caseStudyProject.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                  <button
                    onClick={() => setCaseStudyProject(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    {language === 'hi' ? 'बंद करें' : 'Close'}
                  </button>
                  {caseStudyProject.liveUrl && (
                    <a
                      href={caseStudyProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 box-glow"
                      style={{
                        background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                      }}
                    >
                      <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                      <span>{t('projects_live_demo')}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
