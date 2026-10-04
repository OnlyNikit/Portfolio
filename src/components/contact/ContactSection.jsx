import { useState } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { api } from '../../services/api.js';

export function ContactSection() {
  const { profile, siteSettings } = usePortfolio();
  const { themeConfig } = useTheme();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const contactEmail = profile?.email || siteSettings?.contactEmail || 'onlyynikit@gmail.com';
  const githubUrl = profile?.githubUrl || siteSettings?.githubUrl || 'https://github.com';
  const linkedinUrl = profile?.linkedinUrl || siteSettings?.linkedinUrl || 'https://linkedin.com';
  const location = profile?.location || 'Lucknow, India';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.sendMessage(formData.name, formData.email, formData.message);
      setSuccessMsg(t('contact_success'));
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to submit message. Please try again or reach out via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#070914] border-t border-white/[0.04]">
      {/* Background radial glow */}
      <div
        className="absolute right-1/3 bottom-10 w-[600px] h-[500px] blur-[150px] pointer-events-none opacity-20"
        style={{ backgroundColor: themeConfig.secondaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Identity */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div
                className="text-xs font-mono uppercase tracking-widest font-bold"
                style={{ color: themeConfig.primaryColor }}
              >
                06. {t('contact_badge').toUpperCase()}
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
                {language === 'hi' ? (
                  t('contact_heading')
                ) : (
                  <>
                    Let's Build Something <br />
                    <span
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${themeConfig.primaryColor}, #ffffff, ${themeConfig.secondaryColor})`,
                      }}
                    >
                      Extraordinary.
                    </span>
                  </>
                )}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed pt-2">
                {language === 'hi'
                  ? 'चाहे सॉफ्टवेयर प्रोजेक्ट्स, AI/ML इंजीनियरिंग हो या हाई-इम्पैक्ट थंबनेल डिज़ाइन्स — बेझिझक संपर्क करें!'
                  : 'Whether you want to discuss full-stack software systems, AI pipelines, or high-converting YouTube thumbnail design, feel free to drop a message.'}
              </p>
            </div>

            {/* Direct Cards with box glow */}
            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c1022] border border-white/[0.08] hover:border-cyan-500/40 transition-all group box-glow-hover"
              >
                <div
                  className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md box-glow"
                  style={{ borderColor: `${themeConfig.primaryColor}50` }}
                >
                  <Mail className="w-5 h-5" style={{ color: themeConfig.primaryColor }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Email Address
                  </div>
                  <div className="text-sm font-semibold text-white truncate">{contactEmail}</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c1022] border border-white/[0.08] box-glow">
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-rose-400 shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {language === 'hi' ? 'स्थान' : 'Base Location'}
                  </div>
                  <div className="text-sm font-semibold text-white truncate">{location}</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition-colors box-glow-hover"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition-colors box-glow-hover"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Transmission Form with box glow */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0c1022]/90 border border-white/[0.08] shadow-2xl relative backdrop-blur-xl box-glow">
              <h3 className="text-xl font-bold text-white mb-6 font-heading">
                {language === 'hi' ? 'सीधा संदेश भेजें' : 'Send a Direct Message'}
              </h3>

              {successMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 box-glow">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3 box-glow">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    {t('contact_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe / Recruiter"
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/[0.1] focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    {t('contact_email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. contact@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/[0.1] focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    {t('contact_message')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, idea, or role..."
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/[0.1] focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl text-slate-950 font-bold text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 box-glow"
                  style={{
                    background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                    boxShadow: `0 10px 25px -5px ${themeConfig.accentGlow}`,
                  }}
                >
                  <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>
                    {isSubmitting ? t('contact_sending') : t('contact_send')}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
