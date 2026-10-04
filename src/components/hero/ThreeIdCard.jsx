import { useState, useRef } from 'react';
import { Github, Linkedin, MapPin, Sparkles, Cpu } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function ThreeIdCard() {
  const { profile, threeSettings } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();
  const cardRef = useRef(null);

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const cardTiltMultiplier = threeSettings?.cardTiltIntensity ?? 1.0;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14 * cardTiltMultiplier;
    const rotateY = ((x - centerX) / centerX) * 14 * cardTiltMultiplier;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const photo = profile?.photo || '/src/assets/images/nikit_avatar_1791095716474.jpg';
  const fullName = profile?.name || 'NIKIT KUMAR GUPTA';
  const tagline = profile?.tagline || 'FULL STACK DEVELOPER • THUMBNAIL DESIGNER';
  const course = profile?.course || 'B.Tech CSE (AI & ML)';
  const currentYear = profile?.currentYear || '2nd Year';
  const college = profile?.college || 'Khwaja Moinuddin Chisti Language University';
  const location = profile?.location || 'Lucknow, India';
  const skillsHighlight =
    profile?.skillsHighlight && profile.skillsHighlight.length > 0
      ? profile.skillsHighlight
      : ['React', 'Node.js', 'MongoDB', 'Python', 'AI/ML'];
  const githubUrl = profile?.githubUrl || 'https://github.com';
  const linkedinUrl = profile?.linkedinUrl || 'https://linkedin.com';

  return (
    <div className="relative perspective-[1200px] w-full max-w-[430px] mx-auto select-none">
      {/* Glow aura behind card */}
      <div
        className="absolute -inset-3 rounded-3xl blur-2xl opacity-70 transition-all duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${themeConfig.primaryColor} 0%, ${themeConfig.secondaryColor} 60%, transparent 80%)`,
          transform: isHovered ? 'scale(1.06)' : 'scale(0.96)',
        }}
      />

      {/* Main 3D Card Shell */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
            isHovered ? 'translateZ(18px)' : 'translateZ(0px)'
          }`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        }}
        className="relative rounded-3xl bg-gradient-to-b from-[#0f1426] via-[#090c18] to-[#05070e] border border-cyan-500/40 p-6 sm:p-7 shadow-2xl shadow-black/90 overflow-hidden cursor-pointer backdrop-blur-xl box-glow"
      >
        {/* Dynamic Holographic Glare Sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.18) 0%, rgba(0, 242, 254, 0.12) 35%, transparent 70%)`,
            opacity: isHovered ? 1 : 0.4,
          }}
        />

        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: themeConfig.primaryColor }}
            />
            <span
              className="text-[10px] font-mono tracking-wider uppercase font-bold"
              style={{ color: themeConfig.primaryColor }}
            >
              {t('id_card_status')}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">ID: NK-2025/29</span>
        </div>

        {/* Central Identity Row */}
        <div className="pt-5 flex items-center gap-4 relative z-10">
          {/* Avatar frame with glow */}
          <div className="relative group shrink-0">
            <div
              className="absolute -inset-1 rounded-2xl blur-md opacity-80 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
              }}
            />
            <img
              src={photo}
              alt={fullName}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/20 shadow-md"
              loading="lazy"
            />
          </div>

          {/* Name & Academic Credentials */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>{course}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate font-heading">
              {fullName}
            </h2>
            <p className="text-xs font-mono font-medium text-slate-300 truncate">
              {tagline}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-0.5">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* University Info Block with glow */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] relative z-10 space-y-1 box-glow">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {language === 'hi' ? 'विश्वविद्यालय' : 'University Enrollment'}:
          </div>
          <p className="text-xs font-bold text-slate-200 leading-snug">
            {college}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
            <span>{language === 'hi' ? 'सत्र' : 'Duration'}: 2025 – 2029</span>
            <span
              className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold shadow-sm"
              style={{
                backgroundColor: `${themeConfig.primaryColor}25`,
                color: themeConfig.primaryColor,
                border: `1px solid ${themeConfig.primaryColor}50`,
              }}
            >
              {currentYear}
            </span>
          </div>
        </div>

        {/* Skills Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5 relative z-10">
          {skillsHighlight.slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('id_card_tap_hint')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
