import { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import { CustomCursor } from './components/common/CustomCursor.jsx';
import { LoadingScreen } from './components/common/LoadingScreen.jsx';
import { JavaScriptConsole } from './components/common/JavaScriptConsole.jsx';
import { HeroSection } from './components/hero/HeroSection.jsx';
import { AboutSection } from './components/about/AboutSection.jsx';
import { SkillsSection } from './components/skills/SkillsSection.jsx';
import { JourneySection } from './components/journey/JourneySection.jsx';
import { ProjectsSection } from './components/projects/ProjectsSection.jsx';
import { ThumbnailShowcaseSection } from './components/thumbnails/ThumbnailShowcaseSection.jsx';
import { ThumbnailGalleryPage } from './components/thumbnails/ThumbnailGalleryPage.jsx';
import { ContactSection } from './components/contact/ContactSection.jsx';
import { AdminLogin } from './components/admin/AdminLogin.jsx';
import { AdminDashboard } from './components/admin/AdminDashboard.jsx';

function PortfolioApp() {
  const { isAuthenticated } = useAuth();
  const { siteSettings } = usePortfolio();

  const [currentView, setCurrentView] = useState('main');
  const [currentSection, setCurrentSection] = useState('home');
  const [, setSelectedThumbnail] = useState(null);
  const [isJsConsoleOpen, setIsJsConsoleOpen] = useState(false);

  // Sync document title with CMS site settings
  useEffect(() => {
    if (siteSettings?.siteTitle) {
      document.title = siteSettings.siteTitle;
    }
  }, [siteSettings]);

  // Handle URL hash or path on initial load
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path === '/admin') {
      setCurrentView(isAuthenticated ? 'admin' : 'admin-login');
    } else if (path === '/thumbnails') {
      setCurrentView('thumbnails');
    } else if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    }
  }, [isAuthenticated]);

  // Section observer for sticky navbar indicator
  useEffect(() => {
    if (currentView !== 'main') return;

    const sections = ['home', 'about', 'journey', 'projects', 'thumbnails', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setCurrentSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavigate = (id) => {
    if (currentView !== 'main') {
      setCurrentView('main');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // View routing
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onBackToSite={() => setCurrentView('main')}
        onLoginSuccess={() => setCurrentView('admin')}
      />
    );
  }

  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onBackToSite={() => setCurrentView('main')}
          onLoginSuccess={() => setCurrentView('admin')}
        />
      );
    }
    return <AdminDashboard onBackToSite={() => setCurrentView('main')} />;
  }

  if (currentView === 'thumbnails') {
    return (
      <>
        <CustomCursor />
        <Navbar
          currentSection="thumbnails"
          onNavigate={handleNavigate}
          onOpenThumbnailsPage={() => setCurrentView('thumbnails')}
          onOpenAdmin={() => setCurrentView(isAuthenticated ? 'admin' : 'admin-login')}
          onOpenJsConsole={() => setIsJsConsoleOpen(true)}
        />
        <ThumbnailGalleryPage onBackToHome={() => setCurrentView('main')} />
        <Footer
          onOpenAdmin={() => setCurrentView(isAuthenticated ? 'admin' : 'admin-login')}
          onNavigate={handleNavigate}
          onOpenJsConsole={() => setIsJsConsoleOpen(true)}
        />
        <JavaScriptConsole
          isOpen={isJsConsoleOpen}
          onClose={() => setIsJsConsoleOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-100 transition-colors duration-400">
      {/* Cinematic Loading Overlay */}
      <LoadingScreen />

      {/* GPU Custom Cursor */}
      <CustomCursor />

      {/* Sticky 3-Zone Navigation (Download App button strictly in sidebar / mobile menu drawer) */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onOpenThumbnailsPage={() => setCurrentView('thumbnails')}
        onOpenAdmin={() => setCurrentView(isAuthenticated ? 'admin' : 'admin-login')}
        onOpenJsConsole={() => setIsJsConsoleOpen(true)}
      />

      {/* Hero Section with Three.js 3D Space and 3D ID Card */}
      <HeroSection
        onExploreProjects={() => handleNavigate('projects')}
        onExploreThumbnails={() => setCurrentView('thumbnails')}
        onOpenJsConsole={() => setIsJsConsoleOpen(true)}
      />

      {/* About Section */}
      <AboutSection />

      {/* Technical Skills Section */}
      <SkillsSection />

      {/* Education / Academic Journey Timeline */}
      <JourneySection />

      {/* Projects Showcase & Interactive Preview Window */}
      <ProjectsSection />

      {/* Thumbnail Design Section */}
      <ThumbnailShowcaseSection
        onViewAll={() => setCurrentView('thumbnails')}
        onOpenThumbnailModal={(thumb) => {
          setSelectedThumbnail(thumb);
          setCurrentView('thumbnails');
        }}
      />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setCurrentView(isAuthenticated ? 'admin' : 'admin-login')}
        onNavigate={handleNavigate}
        onOpenJsConsole={() => setIsJsConsoleOpen(true)}
      />

      {/* Interactive JavaScript Console Modal */}
      <JavaScriptConsole
        isOpen={isJsConsoleOpen}
        onClose={() => setIsJsConsoleOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <PortfolioApp />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </PortfolioProvider>
  );
}
