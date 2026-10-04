import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on pointer fine devices (desktop with mouse)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      const projectEl = target.closest('[data-cursor="project"]');
      const thumbnailEl = target.closest('[data-cursor="thumbnail"]');
      const buttonEl = target.closest('button, a, [role="button"]');

      if (projectEl) {
        setCursorVariant('project');
        setCursorText('VIEW');
      } else if (thumbnailEl) {
        setCursorVariant('thumbnail');
        setCursorText('OPEN');
      } else if (buttonEl) {
        setCursorVariant('button');
        setCursorText('');
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isTextCursor = cursorVariant === 'project' || cursorVariant === 'thumbnail';
  const isButtonHover = cursorVariant === 'button';

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out select-none"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        left: -12,
        top: -12,
      }}
    >
      {/* Outer ambient glow */}
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-200 ${
          isTextCursor
            ? 'w-16 h-16 -ml-5 -mt-5 bg-cyan-400 text-slate-950 font-bold text-[10px] tracking-widest shadow-[0_0_25px_rgba(0,242,254,0.6)]'
            : isButtonHover
            ? 'w-10 h-10 -ml-2 -mt-2 bg-cyan-400/20 border border-cyan-400/80 shadow-[0_0_20px_rgba(0,242,254,0.4)]'
            : 'w-6 h-6 bg-cyan-400/30 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,242,254,0.4)]'
        }`}
      >
        {isTextCursor && <span>{cursorText}</span>}
      </div>

      {/* Center pinpoint */}
      {!isTextCursor && (
        <div className="absolute left-[9px] top-[9px] w-1.5 h-1.5 rounded-full bg-cyan-300" />
      )}
    </div>
  );
}
