import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api.js';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [threeSettings, setThreeSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [profData, eduData, skillsData, projData, thumbData, settingsData] =
        await Promise.all([
          api.getProfile().catch(() => null),
          api.getEducation().catch(() => []),
          api.getSkills().catch(() => []),
          api.getProjects().catch(() => []),
          api.getThumbnails().catch(() => []),
          api.getSettings().catch(() => ({})),
        ]);

      if (profData) setProfile(profData);
      if (Array.isArray(eduData)) setEducation(eduData);
      if (Array.isArray(skillsData)) setSkills(skillsData);
      if (Array.isArray(projData)) setProjects(projData);
      if (Array.isArray(thumbData)) setThumbnails(thumbData);
      if (settingsData) {
        if (settingsData.siteSettings) setSiteSettings(settingsData.siteSettings);
        if (settingsData.threeSettings) setThreeSettings(settingsData.threeSettings);
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
      setError(err.message || 'Failed to load portfolio details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateProfileLocal = (updated) => setProfile(updated);
  const updateSiteSettingsLocal = (updated) => setSiteSettings(updated);
  const updateThreeSettingsLocal = (updated) => setThreeSettings(updated);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        education,
        skills,
        projects,
        thumbnails,
        siteSettings,
        threeSettings,
        isLoading,
        error,
        refreshData,
        updateProfileLocal,
        updateSiteSettingsLocal,
        updateThreeSettingsLocal,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
