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

  // ==================================================
  // LOAD ALL PORTFOLIO DATA
  // ==================================================

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
          console.error('Settings load failed:', err);
          return {};
        }),
      ]);

      // --------------------------------------------------
      // PROFILE
      // Backend:
      // { success: true, profile: {...} }
      // --------------------------------------------------

      if (profData) {
        setProfile(
          profData.profile ??
          profData.data ??
          profData
        );
      } else {
        setProfile(null);
      }

      // --------------------------------------------------
      // EDUCATION
      // Backend:
      // [...]
      // --------------------------------------------------

      const normalizedEducation = Array.isArray(eduData)
        ? eduData
        : Array.isArray(eduData?.education)
          ? eduData.education
          : Array.isArray(eduData?.data)
            ? eduData.data
            : [];

      setEducation(normalizedEducation);

      // --------------------------------------------------
      // SKILLS
      // Backend:
      // [...]
      // --------------------------------------------------

      const normalizedSkills = Array.isArray(skillsData)
        ? skillsData
        : Array.isArray(skillsData?.skills)
          ? skillsData.skills
          : Array.isArray(skillsData?.data)
            ? skillsData.data
            : [];

      setSkills(normalizedSkills);

      // --------------------------------------------------
      // PROJECTS
      // Backend:
      // { success: true, projects: [...] }
      // --------------------------------------------------

      const normalizedProjects = Array.isArray(projData)
        ? projData
        : Array.isArray(projData?.projects)
          ? projData.projects
          : Array.isArray(projData?.data)
            ? projData.data
            : [];

      setProjects(normalizedProjects);

      // --------------------------------------------------
      // THUMBNAILS
      // Backend:
      // { success: true, thumbnails: [...] }
      // --------------------------------------------------

      const normalizedThumbnails = Array.isArray(thumbData)
        ? thumbData
        : Array.isArray(thumbData?.thumbnails)
          ? thumbData.thumbnails
          : Array.isArray(thumbData?.data)
            ? thumbData.data
            : [];

      setThumbnails(normalizedThumbnails);

      // --------------------------------------------------
      // SETTINGS
      // Backend:
      // {
      //   success: true,
      //   settings: {
      //     siteSettings,
      //     threeSettings
      //   }
      // }
      // --------------------------------------------------

      const settings = settingsData?.settings ?? settingsData ?? {};

      if (settings.siteSettings) {
        setSiteSettings(settings.siteSettings);
      } else if (settings.site) {
        setSiteSettings(settings.site);
      }

      if (settings.threeSettings) {
        setThreeSettings(settings.threeSettings);
      } else if (settings.three) {
        setThreeSettings(settings.three);
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
    const response = await api.updateProfile(data);

    const updated =
      response?.profile ??
      response?.data ??
      response;

    setProfile(updated);

    return updated;
  };


  // ==================================================
  // EDUCATION
  // ==================================================

  const addEducation = async (data) => {
    const response = await api.addEducation(data);

    const created =
      response?.item ??
      response?.education ??
      response?.data ??
      response;

    setEducation((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      created,
    ]);

    return created;
  };

  const updateEducation = async (id, data) => {
    const response = await api.updateEducation(id, data);

    const updated =
      response?.item ??
      response?.education ??
      response?.data ??
      response;

    setEducation((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) =>
        item._id === id ? updated : item
      )
    );

    return updated;
  };

  const deleteEducation = async (id) => {
    await api.deleteEducation(id);

    setEducation((prev) =>
      (Array.isArray(prev) ? prev : []).filter(
        (item) => item._id !== id
      )
    );

    return true;
  };


  // ==================================================
  // SKILLS
  // ==================================================

  const addSkill = async (data) => {
    const response = await api.addSkill(data);

    const created =
      response?.item ??
      response?.skill ??
      response?.data ??
      response;

    setSkills((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      created,
    ]);

    return created;
  };

  const updateSkill = async (id, data) => {
    const response = await api.updateSkill(id, data);

    const updated =
      response?.item ??
      response?.skill ??
      response?.data ??
      response;

    setSkills((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) =>
        item._id === id ? updated : item
      )
    );

    return updated;
  };

  const deleteSkill = async (id) => {
    await api.deleteSkill(id);

    setSkills((prev) =>
      (Array.isArray(prev) ? prev : []).filter(
        (item) => item._id !== id
      )
    );

    return true;
  };


  // ==================================================
  // PROJECTS
  // ==================================================

  const addProject = async (data) => {
    const response = await api.addProject(data);

    const created =
      response?.project ??
      response?.item ??
      response?.data ??
      response;

    setProjects((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      created,
    ]);

    return created;
  };

  const updateProject = async (id, data) => {
    const response = await api.updateProject(id, data);

    const updated =
      response?.project ??
      response?.item ??
      response?.data ??
      response;

    setProjects((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) =>
        item._id === id ? updated : item
      )
    );

    return updated;
  };

  const deleteProject = async (id) => {
    await api.deleteProject(id);

    setProjects((prev) =>
      (Array.isArray(prev) ? prev : []).filter(
        (item) => item._id !== id
      )
    );

    return true;
  };


  // ==================================================
  // THUMBNAILS
  // ==================================================

  const addThumbnail = async (data) => {
    const response = await api.addThumbnail(data);

    const created =
      response?.thumbnail ??
      response?.item ??
      response?.data ??
      response;

    setThumbnails((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      created,
    ]);

    return created;
  };

  const updateThumbnail = async (id, data) => {
    const response = await api.updateThumbnail(id, data);

    const updated =
      response?.thumbnail ??
      response?.item ??
      response?.data ??
      response;

    setThumbnails((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) =>
        item._id === id ? updated : item
      )
    );

    return updated;
  };

  const deleteThumbnail = async (id) => {
    await api.deleteThumbnail(id);

    setThumbnails((prev) =>
      (Array.isArray(prev) ? prev : []).filter(
        (item) => item._id !== id
      )
    );

    return true;
  };


  // ==================================================
  // SETTINGS
  // ==================================================

  const updateSiteSettings = async (data) => {
    const response = await api.updateSiteSettings(data);

    const updated =
      response?.siteSettings ??
      response?.settings ??
      response?.data ??
      response;

    setSiteSettings(updated);

    return updated;
  };

  const updateThreeSettings = async (data) => {
    const response = await api.updateThreeSettings(data);

    const updated =
      response?.threeSettings ??
      response?.settings ??
      response?.data ??
      response;

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
        // ----------------------------------------------
        // DATA
        // ----------------------------------------------

        profile,
        education,
        skills,
        projects,
        thumbnails,
        siteSettings,
        threeSettings,

        // ----------------------------------------------
        // LOADING / ERROR
        // ----------------------------------------------

        isLoading,
        error,

        // ----------------------------------------------
        // REFRESH
        // ----------------------------------------------

        refreshData,

        // ----------------------------------------------
        // PROFILE
        // ----------------------------------------------

        updateProfile,

        // ----------------------------------------------
        // EDUCATION
        // ----------------------------------------------

        addEducation,
        updateEducation,
        deleteEducation,

        // ----------------------------------------------
        // SKILLS
        // ----------------------------------------------

        addSkill,
        updateSkill,
        deleteSkill,

        // ----------------------------------------------
        // PROJECTS
        // ----------------------------------------------

        addProject,
        updateProject,
        deleteProject,

        // ----------------------------------------------
        // THUMBNAILS
        // ----------------------------------------------

        addThumbnail,
        updateThumbnail,
        deleteThumbnail,

        // ----------------------------------------------
        // SETTINGS
        // ----------------------------------------------

        updateSiteSettings,
        updateThreeSettings,

        // ----------------------------------------------
        // LOCAL HELPERS
        // ----------------------------------------------

        updateProfileLocal,
        updateSiteSettingsLocal,
        updateThreeSettingsLocal,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}


// ==================================================
// HOOK
// ==================================================

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error(
      'usePortfolio must be used within a PortfolioProvider'
    );
  }

  return context;
}