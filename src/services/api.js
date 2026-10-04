const TOKEN_KEY = "nikit_admin_jwt";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(endpoint, options = {}) {
  const headers = new Headers(options.headers || {});

  if (
    !headers.has("Content-Type") &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        `Request failed with status ${response.status}`,
    );
  }

  return data;
}

export const api = {
  // =========================================================
  // AUTH
  // =========================================================

  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  getCurrentUser: () =>
    request("/api/auth/me"),

  changePassword: (currentPassword, newPassword) =>
    request("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }),

  // =========================================================
  // PROFILE
  // =========================================================

  getProfile: () =>
    request("/api/profile"),

  updateProfile: (data) =>
    request("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // =========================================================
  // EDUCATION
  // =========================================================

  getEducation: () =>
    request("/api/education"),

  createEducation: (data) =>
    request("/api/education", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Compatibility alias for AdminDashboard
  addEducation: (data) =>
    request("/api/education", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEducation: (id, data) =>
    request(`/api/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEducation: (id) =>
    request(`/api/education/${id}`, {
      method: "DELETE",
    }),

  // =========================================================
  // SKILLS
  // =========================================================

  getSkills: () =>
    request("/api/skills"),

  createSkill: (data) =>
    request("/api/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Compatibility alias for AdminDashboard
  addSkill: (data) =>
    request("/api/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSkill: (id, data) =>
    request(`/api/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSkill: (id) =>
    request(`/api/skills/${id}`, {
      method: "DELETE",
    }),

  // =========================================================
  // PROJECTS
  // =========================================================

  getProjects: () =>
    request("/api/projects"),

  // Backend route is GET /api/projects/all
  getAllProjectsAdmin: () =>
    request("/api/projects/all"),

  createProject: (data) =>
    request("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Compatibility alias for AdminDashboard
  addProject: (data) =>
    request("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProject: (id, data) =>
    request(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProject: (id) =>
    request(`/api/projects/${id}`, {
      method: "DELETE",
    }),

  // =========================================================
  // THUMBNAILS
  // =========================================================

  getThumbnails: () =>
    request("/api/thumbnails"),

  // Backend route is GET /api/thumbnails/all
  getAllThumbnailsAdmin: () =>
    request("/api/thumbnails/all"),

  createThumbnail: (data) =>
    request("/api/thumbnails", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Compatibility alias for AdminDashboard
  addThumbnail: (data) =>
    request("/api/thumbnails", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateThumbnail: (id, data) =>
    request(`/api/thumbnails/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteThumbnail: (id) =>
    request(`/api/thumbnails/${id}`, {
      method: "DELETE",
    }),

  // =========================================================
  // MESSAGES
  // =========================================================

  sendMessage: (name, email, message) =>
    request("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    }),

  getMessages: () =>
    request("/api/messages"),

  markMessageRead: (id, read = true) =>
    request(`/api/messages/${id}/read`, {
      method: "PUT",
      body: JSON.stringify({
        read,
      }),
    }),

  deleteMessage: (id) =>
    request(`/api/messages/${id}`, {
      method: "DELETE",
    }),

  // =========================================================
  // SETTINGS
  // =========================================================

  getSettings: () =>
    request("/api/settings"),

  // Backend route is PUT /api/settings
  updateSiteSettings: (data) =>
    request("/api/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getThreeSettings: () =>
    request("/api/settings/three"),

  updateThreeSettings: (data) =>
    request("/api/settings/three", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // =========================================================
  // MEDIA
  // =========================================================

  getMedia: () =>
    request("/api/media"),

  /*
   * AdminDashboard currently calls:
   *
   * api.uploadMedia(file.name, base64, file.type)
   *
   * So API must support that signature.
   */
  uploadMedia: (name, data, type) =>
    request("/api/media/upload", {
      method: "POST",
      body: JSON.stringify({
        name,
        data,
        type,
      }),
    }),

  deleteMedia: (id) =>
    request(`/api/media/${id}`, {
      method: "DELETE",
    }),
};