import { useState, useRef, useEffect } from 'react';
import { Terminal, X, Play, RefreshCw, Copy, Check, Sparkles, Code2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function JavaScriptConsole({ isOpen, onClose }) {
  const { profile, skills, projects, thumbnails, education } = usePortfolio();
  const { theme, cycleNextTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const [inputCommand, setInputCommand] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const terminalEndRef = useRef(null);

  // Ready-to-run JS snippets
  const quickSnippets = [
    { label: 'nikit.getProfile()', cmd: 'nikit.getProfile()' },
    { label: 'nikit.getSkills()', cmd: 'nikit.getSkills()' },
    { label: 'nikit.getProjects()', cmd: 'nikit.getProjects()' },
    { label: 'nikit.getEducation()', cmd: 'nikit.getEducation()' },
    { label: 'nikit.cycleTheme()', cmd: 'nikit.cycleTheme()' },
    { label: 'nikit.toggleLang()', cmd: 'nikit.toggleLang()' },
  ];

  const [history, setHistory] = useState([
    {
      input: '// JavaScript Interactive Developer Runtime initialized',
      output: {
        runtime: 'V8 JavaScript / React 19 / ES2024',
        target: 'NIKIT KUMAR GUPTA – Full Stack Developer & Thumbnail Designer',
        degree: 'B.Tech CSE (AI & ML) 2nd Year',
        location: 'Lucknow, India',
        help: 'Type `nikit.help()` or click a quick action above to run real JavaScript.',
      },
      type: 'info',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, history]);

  if (!isOpen) return null;

  // Execute JavaScript in sandboxed context with 'nikit' API object
  const executeCommand = (cmdToRun) => {
    const code = (cmdToRun !== undefined ? cmdToRun : inputCommand).trim();
    if (!code) return;

    const time = new Date().toLocaleTimeString();

    if (code.toLowerCase() === 'clear' || code.toLowerCase() === 'cls') {
      setHistory([]);
      setInputCommand('');
      return;
    }

    try {
      // Define the 'nikit' interactive JavaScript object
      const nikit = {
        name: profile?.name || 'NIKIT KUMAR GUPTA',
        displayName: profile?.displayName || 'NIKIT KUMAR',
        tagline: profile?.tagline || 'FULL STACK DEVELOPER • THUMBNAIL DESIGNER',
        college: profile?.college || 'Khwaja Moinuddin Chisti Language University, Lucknow',
        course: profile?.course || 'B.Tech CSE (AI & ML)',
        year: profile?.currentYear || '2nd Year',
        duration: '2025 - 2029',
        location: profile?.location || 'Lucknow, India',
        email: profile?.email || 'onlyynikit@gmail.com',
        getProfile: () => ({
          ...profile,
          focus: 'Full Stack Web Engineering + AI & Machine Learning + High-Retention Visual Art',
          status: 'Open to high-impact software engineering and thumbnail design roles',
        }),
        getSkills: () =>
          skills && skills.length > 0
            ? skills.map((s) => ({ name: s.name, category: s.category, proficiency: s.proficiencyLevel || 'Proficient' }))
            : [
                { category: 'Frontend', name: 'React', proficiency: 'Advanced' },
                { category: 'Backend', name: 'Node.js', proficiency: 'Advanced' },
                { category: 'AI & ML', name: 'Python / TensorFlow', proficiency: 'Intermediate' },
                { category: 'Design', name: 'YouTube Thumbnails', proficiency: 'Expert' },
              ],
        getProjects: () =>
          projects && projects.length > 0
            ? projects.map((p) => ({ title: p.name, tech: p.techStack, link: p.liveUrl }))
            : [
                { title: 'DermaDetect AI', tech: ['React', 'Node.js', 'TensorFlow', 'Python'] },
                { title: 'Collabry', tech: ['React', 'Express', 'MongoDB', 'WebSockets'] },
              ],
        getEducation: () =>
          education && education.length > 0
            ? education.map((e) => ({ school: e.institution, level: e.level, duration: `${e.startYear} - ${e.endYear}` }))
            : [
                { school: 'Khwaja Moinuddin Chisti Language University', level: 'B.Tech CSE (AI & ML)', duration: '2025 - 2029' },
                { school: 'Kedarnath Uchh Vidyalay', level: '12th Standard', duration: '2023 - 2025' },
                { school: 'Rohtas Public School', level: 'Secondary School', duration: 'Foundational' },
              ],
        cycleTheme: () => {
          cycleNextTheme();
          return `Theme switched successfully! Current active palette: ${theme}`;
        },
        toggleLang: () => {
          toggleLanguage();
          return `Language toggled! Current language: ${language === 'en' ? 'Hindi (हिन्दी)' : 'English'}`;
        },
        help: () => [
          'nikit.getProfile()        - Returns full biographical and identity JSON',
          'nikit.getSkills()         - Inspect categorized technical & creative skill sets',
          'nikit.getProjects()       - View active live software deployments',
          'nikit.getEducation()      - Inspect university & schooling timeline',
          'nikit.cycleTheme()        - Dynamically switch portfolio modern color theme',
          'nikit.toggleLang()        - Switch UI language between English and Hindi',
          'clear                     - Clear the terminal console',
        ],
      };

      // Safely evaluate expression
      const evalFn = new Function('nikit', `"use strict"; return (${code});`);
      const result = evalFn(nikit);

      setHistory((prev) => [
        ...prev,
        {
          input: code,
          output: result === undefined ? 'undefined' : result,
          type: 'success',
          timestamp: time,
        },
      ]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        {
          input: code,
          output: err?.message || String(err),
          type: 'error',
          timestamp: time,
        },
      ]);
    }

    setInputCommand('');
  };

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[85vh] max-h-[720px] rounded-3xl bg-[#090b14] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden text-slate-200 font-mono box-glow">
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan-300">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Nikit.JS Developer Console</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Interactive ES2024
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => executeCommand('clear')}
              className="p-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
              title="Clear terminal"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Clickable JS Actions Bar */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Quick JS:
          </span>
          {quickSnippets.map((item, idx) => (
            <button
              key={idx}
              onClick={() => executeCommand(item.cmd)}
              className="px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all shrink-0 cursor-pointer text-xs"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Terminal Output Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-mono leading-relaxed">
          {history.map((item, idx) => {
            const formattedOutput =
              typeof item.output === 'object'
                ? JSON.stringify(item.output, null, 2)
                : String(item.output);

            return (
              <div key={idx} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">❯</span>
                    <span className="text-white font-medium">{item.input}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    <button
                      onClick={() => handleCopy(formattedOutput, idx)}
                      className="p-1 hover:text-white rounded"
                      title="Copy output"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl border text-[11px] sm:text-xs overflow-x-auto ${
                    item.type === 'error'
                      ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                      : item.type === 'info'
                      ? 'bg-slate-900/60 border-cyan-500/20 text-cyan-200'
                      : 'bg-black/40 border-white/[0.06] text-emerald-300'
                  }`}
                >
                  <pre className="whitespace-pre-wrap">{formattedOutput}</pre>
                </div>
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Bar */}
        <div className="p-3 bg-slate-900/90 border-t border-white/[0.08] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeCommand();
            }}
            className="flex items-center gap-2 bg-black/60 border border-cyan-500/30 focus-within:border-cyan-400 rounded-xl px-3.5 py-2 transition-all shadow-inner"
          >
            <span className="text-cyan-400 font-bold text-sm">❯</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="Type JavaScript (e.g. nikit.getSkills(), 2 + 2, nikit.cycleTheme())..."
              className="flex-1 bg-transparent text-white placeholder-slate-400 text-xs font-mono focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputCommand.trim()}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-bold text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Play className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">Run</span>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
            <span>Protip: Press Enter to execute command. Try `nikit.help()`</span>
            <span className="hidden sm:inline">JavaScript ES2024 Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
