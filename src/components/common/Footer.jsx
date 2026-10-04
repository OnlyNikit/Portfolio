import { Github, Linkedin, Shield, Code2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function Footer({ onOpenAdmin, onNavigate, onOpenJsConsole }) {
  const { siteSettings, profile } = usePortfolio();
  const { themeConfig } = useTheme();
  const { language } = useLanguage();

  const footerText =
    language === 'hi'
      ? '© 2026 निकीत कुमार गुप्ता · फुल स्टैक डेवलपर • थंबनेल डिज़ाइनर'
      : siteSettings?.footerText || '© 2026 Nikit Kumar Gupta. Full Stack Developer • Thumbnail Designer.';
  const githubUrl = profile?.githubUrl || siteSettings?.githubUrl || 'https://github.com';
  const linkedinUrl = profile?.linkedinUrl || siteSettings?.linkedinUrl || 'https://linkedin.com';

  return (
    <footer className="py-12 bg-[#04060c] border-t border-white/[0.06] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-center sm:text-left">
          <button
            onClick={() => onNavigate?.('home')}
            className="text-white font-bold tracking-tight hover:text-cyan-400 transition-colors cursor-pointer font-heading text-sm"
          >
            NIKIT KUMAR
          </button>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span>{footerText}</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {onOpenJsConsole && (
            <button
              onClick={onOpenJsConsole}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 font-mono text-[11px]"
              title="Open JavaScript Developer Console"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>JS Console</span>
            </button>
          )}

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors p-1"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors p-1"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer p-1"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
