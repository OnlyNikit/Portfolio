import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { api } from '../services/api.js';

const PortfolioContext = createContext(null);

// Kisi bhi response se array nikalne ka helper
function toArray(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

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

  // silent = true -> loading screen nahi dikhegi (admin save ke baad)
  const refreshData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setError(null);

      const [
        profData,
        eduData,
        skillsData,
        projData,
        thumbData,
        siteRes,
        threeRes,
      ] = await Promise.all([
        api.getProfile().catch((err) => {
          console.error('Profile load failed:', err);
          return null;
        }),
        api.getEducation().catch((err) => {
          console.error('Education load failed:', err);
          return [];
        }),
        api.getSkills().catch((err) => {
          console.error('Skills load failed:', err);
          return [];
        }),
        api.getProjects().catch((err) => {
          console.error('Projects load failed:', err);
          return { projects: [] };
        }),
        api.getThumbnails().catch((err) => {
          console.error('Thumbnails load failed:', err);
          return { thumbnails: [] };
        }),
        api.getSettings().catch((err) => {
          console.error('Site settings load failed:', err);
          return null;
        }),
        api.getThreeSettings().catch((err) => {
          console.error('3D settings load failed:', err);
          return null;
        }),
      ]);

      setProfile(profData ? (profData.profile ?? profData.data ?? profData) : null);
      setEducation(toArray(eduData, 'education'));
      setSkills(toArray(skillsData, 'skills'));
      setProjects(toArray(projData, 'projects'));
      setThumbnails(toArray(thumbData, 'thumbnails'));

      // Backend: { success: true, settings: {...} }
      if (siteRes?.settings) setSiteSettings(siteRes.settings);
      if (threeRes?.settings) setThreeSettings(threeRes.settings);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load portfolio details'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ---------------- PROFILE ----------------

  const updateProfile = async (data) => {
    const response = await api.updateProfile(data);
    const updated = response?.profile ?? response?.data ?? response;
    setProfile(updated);
    return updated;
  };

  // ---------------- EDUCATION ----------------

  const addEducation = async (data) => {
    const response = await api.addEducation(data);
    const created = response?.item ?? response?.education ?? response?.data ?? response;
    setEducation((prev) => [...(Array.isArray(prev) ? prev : []), created]);
    return created;
  };

  const updateEducation = async (id, data) => {
    const response = await api.updateEducation(id, data);
    const updated = response?.item ?? response?.education ?? response?.data ?? response;
    setEducation((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => (item._id === id ? updated : item))
    );
    return updated;
  };

  const deleteEducation = async (id) => {
    await api.deleteEducation(id);
    setEducation((prev) => (Array.isArray(prev) ? prev : []).filter((i) => i._id !== id));
    return true;
  };

  // ---------------- SKILLS ----------------

  const addSkill = async (data) => {
    const response = await api.addSkill(data);
    const created = response?.item ?? response?.skill ?? response?.data ?? response;
    setSkills((prev) => [...(Array.isArray(prev) ? prev : []), created]);
    return created;
  };

  const updateSkill = async (id, data) => {
    const response = await api.updateSkill(id, data);
    const updated = response?.item ?? response?.skill ?? response?.data ?? response;
    setSkills((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => (item._id === id ? updated : item))
    );
    return updated;
  };

  const deleteSkill = async (id) => {
    await api.deleteSkill(id);
    setSkills((prev) => (Array.isArray(prev) ? prev : []).filter((i) => i._id !== id));
    return true;
  };

  // ---------------- PROJECTS ----------------

  const addProject = async (data) => {
    const response = await api.addProject(data);
    const created = response?.project ?? response?.item ?? response?.data ?? response;
    setProjects((prev) => [...(Array.isArray(prev) ? prev : []), created]);
    return created;
  };

  const updateProject = async (id, data) => {
    const response = await api.updateProject(id, data);
    const updated = response?.project ?? response?.item ?? response?.data ?? response;
    setProjects((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => (item._id === id ? updated : item))
    );
    return updated;
  };

  const deleteProject = async (id) => {
    await api.deleteProject(id);
    setProjects((prev) => (Array.isArray(prev) ? prev : []).filter((i) => i._id !== id));
    return true;
  };

  // ---------------- THUMBNAILS ----------------

  const addThumbnail = async (data) => {
    const response = await api.addThumbnail(data);
    const created = response?.thumbnail ?? response?.item ?? response?.data ?? response;
    setThumbnails((prev) => [...(Array.isArray(prev) ? prev : []), created]);
    return created;
  };

  const updateThumbnail = async (id, data) => {
    const response = await api.updateThumbnail(id, data);
    const updated = response?.thumbnail ?? response?.item ?? response?.data ?? response;
    setThumbnails((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => (item._id === id ? updated : item))
    );
    return updated;
  };

  const deleteThumbnail = async (id) => {
    await api.deleteThumbnail(id);
    setThumbnails((prev) => (Array.isArray(prev) ? prev : []).filter((i) => i._id !== id));
    return true;
  };

  // ---------------- SETTINGS ----------------

  const updateSiteSettings = async (data) => {
    const response = await api.updateSiteSettings(data);
    const updated = response?.settings ?? response?.data ?? response;
    setSiteSettings(updated);
    return updated;
  };

  const updateThreeSettings = async (data) => {
    const response = await api.updateThreeSettings(data);
    const updated = response?.settings ?? response?.data ?? response;
    setThreeSettings(updated);
    return updated;
  };

  // ---------------- LOCAL HELPERS ----------------

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

        // AdminDashboard ke liye aliases
        refreshPortfolio: () => refreshData(true),
        updateSiteSettingsState: updateSiteSettingsLocal,
        updateThreeSettingsState: updateThreeSettingsLocal,

        updateProfile,

        addEducation,
        updateEducation,
        deleteEducation,

        addSkill,
        updateSkill,
        deleteSkill,

        addProject,
        updateProject,
        deleteProject,

        addThumbnail,
        updateThumbnail,
        deleteThumbnail,

        updateSiteSettings,
        updateThreeSettings,

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