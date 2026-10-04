import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            onComplete?.();
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 14) + 6;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05060b] text-white px-6 select-none"
        >
          {/* Subtle ambient glow */}
          <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          {/* Minimal 3D Geometric Ring */}
          <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-25" />
            <div
              className="w-24 h-24 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-500/60 animate-spin"
              style={{ animationDuration: '1.2s' }}
            />
            <div
              className="absolute w-16 h-16 rounded-full border border-transparent border-b-cyan-300 border-l-blue-400 animate-spin"
              style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
            />
            {/* Tabular counter */}
            <div className="absolute font-mono text-xs tracking-wider text-cyan-300 tabular-nums font-semibold">
              {Math.min(100, progress)}%
            </div>
          </div>

          {/* Typography */}
          <div className="text-center space-y-2 z-10">
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 font-heading"
            >
              NIKIT <span className="text-cyan-400">KUMAR GUPTA</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs sm:text-sm font-medium tracking-widest text-slate-400 uppercase font-mono"
            >
              FULL STACK DEVELOPER <span className="text-cyan-400">·</span> THUMBNAIL DESIGNER
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="w-48 sm:w-64 h-[2px] bg-slate-800 rounded-full mt-8 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
