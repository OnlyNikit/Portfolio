const TOKEN_KEY = 'nikit_admin_jwt';

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

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => request('/api/auth/me'),

  changePassword: (currentPassword, newPassword) =>
    request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Profile
  getProfile: () => request('/api/profile'),
  updateProfile: (data) =>
    request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Education
  getEducation: () => request('/api/education'),
  createEducation: (data) =>
    request('/api/education', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEducation: (id, data) =>
    request(`/api/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteEducation: (id) =>
    request(`/api/education/${id}`, {
      method: 'DELETE',
    }),

  // Skills
  getSkills: () => request('/api/skills'),
  createSkill: (data) =>
    request('/api/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSkill: (id, data) =>
    request(`/api/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSkill: (id) =>
    request(`/api/skills/${id}`, {
      method: 'DELETE',
    }),

  // Projects
  getProjects: () => request('/api/projects'),
  getAllProjectsAdmin: () => request('/api/projects/admin/all'),
  createProject: (data) =>
    request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id, data) =>
    request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: (id) =>
    request(`/api/projects/${id}`, {
      method: 'DELETE',
    }),

  // Thumbnails
  getThumbnails: () => request('/api/thumbnails'),
  getAllThumbnailsAdmin: () => request('/api/thumbnails/admin/all'),
  createThumbnail: (data) =>
    request('/api/thumbnails', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateThumbnail: (id, data) =>
    request(`/api/thumbnails/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteThumbnail: (id) =>
    request(`/api/thumbnails/${id}`, {
      method: 'DELETE',
    }),

  // Messages
  sendMessage: (name, email, message) =>
    request('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
    }),
  getMessages: () => request('/api/messages'),
  markMessageRead: (id) =>
    request(`/api/messages/${id}/read`, {
      method: 'PATCH',
    }),
  deleteMessage: (id) =>
    request(`/api/messages/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getSettings: () => request('/api/settings'),
  updateSiteSettings: (data) =>
    request('/api/settings/site', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateThreeSettings: (data) =>
    request('/api/settings/three', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Media
  getMedia: () => request('/api/media'),
  uploadMedia: (data) =>
    request('/api/media/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteMedia: (id) =>
    request(`/api/media/${id}`, {
      method: 'DELETE',
    }),
};
