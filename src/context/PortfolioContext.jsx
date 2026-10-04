import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

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

  // --------------------------------------------------
  // Load all portfolio data
  // --------------------------------------------------

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        profData,
        eduData,
        skillsData,
        projData,
        thumbData,
        settingsData,
      ] = await Promise.all([
        api.getProfile().catch(() => null),
        api.getEducation().catch(() => []),
        api.getSkills().catch(() => []),
        api.getProjects().catch(() => []),
        api.getThumbnails().catch(() => []),
        api.getSettings().catch(() => ({})),
      ]);

      if (profData) {
        setProfile(profData);
      }

      if (Array.isArray(eduData)) {
        setEducation(eduData);
      }

      if (Array.isArray(skillsData)) {
        setSkills(skillsData);
      }

      if (Array.isArray(projData)) {
        setProjects(projData);
      }

      if (Array.isArray(thumbData)) {
        setThumbnails(thumbData);
      }

      if (settingsData) {
        if (settingsData.siteSettings) {
          setSiteSettings(settingsData.siteSettings);
        }

        if (settingsData.threeSettings) {
          setThreeSettings(settingsData.threeSettings);
        }
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load portfolio details'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);


  // ==================================================
  // PROFILE
  // ==================================================

  const updateProfile = async (data) => {
    const updated = await api.updateProfile(data);

    setProfile(updated);

    return updated;
  };


  // ==================================================
  // EDUCATION
  // ==================================================

  const addEducation = async (data) => {
    const created = await api.createEducation(data);

    setEducation((prev) => [...prev, created]);

    return created;
  };

  const updateEducation = async (id, data) => {
    const updated = await api.updateEducation(id, data);

    setEducation((prev) =>
      prev.map((item) =>
        item._id === id ? updated : item
      )
    );

    return updated;
  };

  const deleteEducation = async (id) => {
    await api.deleteEducation(id);

    setEducation((prev) =>
      prev.filter((item) => item._id !== id)
    );

    return true;
  };


  // ==================================================
  // SKILLS
  // ==================================================

  const addSkill = async (data) => {
    const created = await api.createSkill(data);

    setSkills((prev) => [...prev, created]);

    return created;
  };

  const updateSkill = async (id, data) => {
    const updated = await api.updateSkill(id, data);

    setSkills((prev) =>
      prev.map((item) =>
        item._id === id ? updated : item
      )
    );

    return updated;
  };

  const deleteSkill = async (id) => {
    await api.deleteSkill(id);

    setSkills((prev) =>
      prev.filter((item) => item._id !== id)
    );

    return true;
  };


  // ==================================================
  // PROJECTS
  // ==================================================

  const addProject = async (data) => {
    const created = await api.createProject(data);

    setProjects((prev) => [...prev, created]);

    return created;
  };

  const updateProject = async (id, data) => {
    const updated = await api.updateProject(id, data);

    setProjects((prev) =>
      prev.map((item) =>
        item._id === id ? updated : item
      )
    );

    return updated;
  };

  const deleteProject = async (id) => {
    await api.deleteProject(id);

    setProjects((prev) =>
      prev.filter((item) => item._id !== id)
    );

    return true;
  };


  // ==================================================
  // THUMBNAILS
  // ==================================================

  const addThumbnail = async (data) => {
    const created = await api.createThumbnail(data);

    setThumbnails((prev) => [...prev, created]);

    return created;
  };

  const updateThumbnail = async (id, data) => {
    const updated = await api.updateThumbnail(id, data);

    setThumbnails((prev) =>
      prev.map((item) =>
        item._id === id ? updated : item
      )
    );

    return updated;
  };

  const deleteThumbnail = async (id) => {
    await api.deleteThumbnail(id);

    setThumbnails((prev) =>
      prev.filter((item) => item._id !== id)
    );

    return true;
  };


  // ==================================================
  // SETTINGS
  // ==================================================

  const updateSiteSettings = async (data) => {
    const updated = await api.updateSiteSettings(data);

    setSiteSettings(updated);

    return updated;
  };

  const updateThreeSettings = async (data) => {
    const updated = await api.updateThreeSettings(data);

    setThreeSettings(updated);

    return updated;
  };


  // ==================================================
  // LOCAL STATE HELPERS
  // ==================================================

  const updateProfileLocal = (updated) => {
    setProfile(updated);
  };

  const updateSiteSettingsLocal = (updated) => {
    setSiteSettings(updated);
  };

  const updateThreeSettingsLocal = (updated) => {
    setThreeSettings(updated);
  };


  // ==================================================
  // CONTEXT
  // ==================================================

  return (
    <PortfolioContext.Provider
      value={{
        // Data
        profile,
        education,
        skills,
        projects,
        thumbnails,
        siteSettings,
        threeSettings,

        // Loading / errors
        isLoading,
        error,

        // Refresh
        refreshData,

        // Profile
        updateProfile,

        // Education
        addEducation,
        updateEducation,
        deleteEducation,

        // Skills
        addSkill,
        updateSkill,
        deleteSkill,

        // Projects
        addProject,
        updateProject,
        deleteProject,

        // Thumbnails
        addThumbnail,
        updateThumbnail,
        deleteThumbnail,

        // Settings
        updateSiteSettings,
        updateThreeSettings,

        // Local helpers
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
    throw new Error(
      'usePortfolio must be used within a PortfolioProvider'
    );
  }

  return context;
}