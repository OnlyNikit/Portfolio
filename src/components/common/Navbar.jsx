import { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Shield, Code2, Palette, Globe } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PWAInstallButton } from './PWAInstallButton.jsx';

export function Navbar({
  currentSection = 'home',
  onNavigate,
  onOpenThumbnailsPage,
  onOpenAdmin,
  onOpenJsConsole,
}) {
  const { siteSettings, profile } = usePortfolio();
  const { themeConfig, availableThemes, setTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav_home') },
    { id: 'about', label: t('nav_about') },
    { id: 'journey', label: t('nav_journey') },
    { id: 'projects', label: t('nav_projects') },
    { id: 'thumbnails', label: t('nav_thumbnails') },
    { id: 'contact', label: t('nav_contact') },
  ];

  const handleLinkClick = (id) => {
    setMobileMenuOpen(false);
    if (id === 'thumbnails' && onOpenThumbnailsPage) {
      onOpenThumbnailsPage();
      return;
    }
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const githubUrl = profile?.githubUrl || siteSettings?.githubUrl || 'https://github.com';
  const linkedinUrl = profile?.linkedinUrl || siteSettings?.linkedinUrl || 'https://linkedin.com';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-[#05070e]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-xl shadow-black/50'
          : 'py-4 sm:py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="text-lg font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2.5 focus:outline-none"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-black text-slate-950 shadow-md box-glow"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
            }}
          >
            NK
          </div>
          <div className="flex flex-col text-left">
            <span className="leading-none text-base font-black text-white tracking-tight font-heading">
              NIKIT
            </span>
            <span
              className="leading-none text-[10px] font-mono tracking-widest font-bold uppercase mt-0.5"
              style={{ color: themeConfig.primaryColor }}
            >
              KUMAR
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-1 transition-colors hover:text-white cursor-pointer ${
                  isActive ? 'text-white font-bold' : 'text-slate-300'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                      boxShadow: `0 0 10px ${themeConfig.accentGlow}`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Controls (NO download button here as requested - download button only in sidebar) */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* JS Console Button */}
          {onOpenJsConsole && (
            <button
              onClick={onOpenJsConsole}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer box-glow-hover"
              title="Interactive JavaScript Developer Console"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>JS Console</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5" style={{ color: themeConfig.primaryColor }} />
            <span>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer box-glow-hover"
              title="Change Color Theme / कलर थीम"
            >
              <Palette className="w-4 h-4" style={{ color: themeConfig.primaryColor }} />
            </button>

            {themeMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#090c18] border border-white/[0.1] shadow-2xl p-2 z-50 text-xs space-y-1 backdrop-blur-xl box-glow">
                <div className="px-2.5 py-1.5 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  Color Themes
                </div>
                {availableThemes.map((tOption) => (
                  <button
                    key={tOption.id}
                    onClick={() => {
                      setTheme(tOption.id);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors ${
                      themeConfig.id === tOption.id
                        ? 'bg-cyan-500/15 text-white font-medium'
                        : 'text-slate-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{language === 'hi' ? tOption.nameHi : tOption.name}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: tOption.primaryColor }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-cyan-300 bg-white/[0.04] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-500/30 transition-all cursor-pointer"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          {onOpenJsConsole && (
            <button
              onClick={onOpenJsConsole}
              className="p-2 text-cyan-400 bg-cyan-500/10 rounded-xl border border-cyan-500/30"
              title="JS Console"
            >
              <Code2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-mono font-bold text-slate-300 bg-white/[0.05] rounded-xl border border-white/[0.1]"
          >
            {language === 'en' ? 'EN' : 'हि'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu / Sidebar (Download App button strictly kept here) */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#070914]/98 border-b border-white/[0.1] px-5 py-5 space-y-4 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Download App button in sidebar */}
          <div className="box-glow rounded-2xl overflow-hidden">
            <PWAInstallButton variant="mobile-drawer" />
          </div>

          {/* Theme selector in mobile drawer */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 box-glow">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" style={{ color: themeConfig.primaryColor }} />
              <span>{t('theme_selector')}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {availableThemes.map((tOption) => (
                <button
                  key={tOption.id}
                  onClick={() => setTheme(tOption.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs text-left ${
                    themeConfig.id === tOption.id
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/40'
                      : 'text-slate-300 bg-white/[0.02]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: tOption.primaryColor }}
                  />
                  <span className="truncate">
                    {language === 'hi' ? tOption.nameHi : tOption.name.split('&')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1.5 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left py-2.5 px-3.5 rounded-xl text-sm font-medium transition-colors ${
                  currentSection === link.id
                    ? 'text-cyan-400 bg-cyan-500/10 font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-xl"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
