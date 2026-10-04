import React, { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan & Violet',
    nameHi: 'साइबर स्यान और वॉयलेट',
    primaryColor: '#00f2fe',
    secondaryColor: '#8b5cf6',
    accentGlow: 'rgba(0, 242, 254, 0.35)',
    bgHex: '#05070e',
    previewGradient: 'from-cyan-400 to-violet-500',
  },
  {
    id: 'neon-emerald',
    name: 'Neon Matrix Emerald',
    nameHi: 'नियॉन एमराल्ड मैट्रिक्स',
    primaryColor: '#00f59b',
    secondaryColor: '#10b981',
    accentGlow: 'rgba(0, 245, 155, 0.35)',
    bgHex: '#030a06',
    previewGradient: 'from-emerald-400 to-teal-400',
  },
  {
    id: 'supernova-sunset',
    name: 'Supernova Amber & Coral',
    nameHi: 'सुपरनोवा अंबर और कोरल',
    primaryColor: '#ff9900',
    secondaryColor: '#ff416c',
    accentGlow: 'rgba(255, 153, 0, 0.35)',
    bgHex: '#0a0508',
    previewGradient: 'from-amber-400 to-rose-500',
  },
  {
    id: 'quantum-violet',
    name: 'Quantum Electric Plasma',
    nameHi: 'क्वांटम इलेक्ट्रिक प्लाज्मा',
    primaryColor: '#a855f7',
    secondaryColor: '#3b82f6',
    accentGlow: 'rgba(168, 85, 247, 0.35)',
    bgHex: '#070617',
    previewGradient: 'from-violet-500 to-blue-500',
  },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nikit_portfolio_theme');
      if (saved && THEMES.some((t) => t.id === saved)) return saved;
    }
    return 'cyber-cyan';
  });

  const themeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nikit_portfolio_theme', theme);

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    // Dynamic CSS custom variables
    root.style.setProperty('--theme-primary', themeConfig.primaryColor);
    root.style.setProperty('--theme-secondary', themeConfig.secondaryColor);
    root.style.setProperty('--theme-glow', themeConfig.accentGlow);
    root.style.setProperty('--theme-bg', themeConfig.bgHex);

    // Update body background
    document.body.style.backgroundColor = themeConfig.bgHex;
  }, [theme, themeConfig]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const cycleNextTheme = () => {
    const currentIndex = THEMES.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setThemeState(THEMES[nextIndex].id);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig,
        setTheme,
        availableThemes: THEMES,
        cycleNextTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
