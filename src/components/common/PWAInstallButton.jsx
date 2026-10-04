import { useState } from 'react';
import { Smartphone, Download, CheckCircle, X, Share2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall.js';

export function PWAInstallButton({ variant = 'mobile-drawer' }) {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setShowModal(false), 2500);
      }
    } else {
      setShowModal(true);
    }
  };

  // If already installed
  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
        <CheckCircle className="w-4 h-4" />
        <span>Installed on Device</span>
      </div>
    );
  }

  // Strictly only show for sidebar / mobile drawer as explicitly requested
  return (
    <>
      <button
        onClick={() => (isInstallable ? handleInstallClick() : setShowModal(true))}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-teal-500/15 to-violet-500/20 hover:from-cyan-500/30 hover:to-violet-500/30 border border-cyan-400/40 text-white text-xs font-semibold shadow-lg shadow-cyan-500/10 cursor-pointer transition-all box-glow-hover"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="font-bold text-white">Download App</div>
            <div className="text-[10px] text-cyan-300 font-mono">Phone me install karein</div>
          </div>
        </div>
        <Download className="w-4 h-4 text-cyan-400" />
      </button>

      {/* Download / Install Instruction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0b0e1b] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl text-white space-y-6 box-glow">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-violet-500/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Download Web App
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Install Nikit Kumar's App on your phone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct install trigger if browser event is active */}
            {isInstallable && !installSuccess && (
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                  <span>One-Click Phone Install Available</span>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Install To Phone Now</span>
                </button>
              </div>
            )}

            {installSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>App installed successfully! Check your phone's home screen.</span>
              </div>
            )}

            {/* Step-by-Step Mobile Instructions */}
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Installation Guide (Android & iPhone):
              </div>

              {/* Android Guide */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android Phone (Chrome / Edge / Brave):</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Browser ke top-right corner me <strong>3 dots (⋮)</strong> tap karein.</li>
                  <li>Menu me <strong className="text-white">"Install App"</strong> ya <strong className="text-white">"Add to Home Screen"</strong> select karein.</li>
                  <li>App turant aapke phone ke app drawer me download ho jayegi.</li>
                </ol>
              </div>

              {/* iPhone / iOS Guide */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Apple iPhone / iPad (Safari):</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Safari me bottom bar me <strong className="text-white">Share button [⎋]</strong> tap karein.</li>
                  <li>Scroll karke <strong className="text-white">"Add to Home Screen" [+]</strong> par tap karein.</li>
                  <li>Top right me <strong className="text-white">"Add"</strong> tap karein — app icon home screen par aa jayega!</li>
                </ol>
              </div>
            </div>

            {/* Benefits */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>✓ Offline Available</span>
              <span>·</span>
              <span>✓ Fullscreen Experience</span>
              <span>·</span>
              <span>✓ Fast & Light</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
