export interface IProfile {
  _id?: string;
  name: string;
  displayName: string;
  tagline: string;
  bio: string;
  photo: string;
  course: string;
  currentYear: string;
  college: string;
  collegeStart: string;
  collegeEnd: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  skillsHighlight: string[];
  updatedAt?: string;
}

export interface IEducation {
  _id: string;
  institution: string;
  level: string; // e.g. "School (10th)", "Higher Secondary (12th)", "B.Tech CSE (AI & ML)"
  field?: string;
  startYear: string;
  endYear: string;
  description: string;
  location: string;
  image?: string;
  achievements?: string[];
  order: number;
}

export interface ISkill {
  _id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'AI/ML' | 'Programming' | 'Tools' | 'Design' | string;
  icon?: string;
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;
  order: number;
}

export interface IProject {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
}

export interface IThumbnail {
  _id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  image: string;
  clientUrl?: string;
  date: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface IMediaItem {
  _id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface ISiteSettings {
  siteTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  footerText: string;
}

export interface IThreeSettings {
  hero3dEnabled: boolean;
  particleDensity: number; // 20 to 120
  animationIntensity: number; // 0.5 to 1.5
  glowIntensity: number; // 0.2 to 1.2
  cardTiltIntensity: number; // 0.2 to 2.0
  mouseParallaxIntensity: number; // 0.2 to 2.0
  cursorEffects: boolean;
  reducedMotionFallback: boolean;
  accentColor: string; // 'cyan' | 'amber' | 'emerald' | 'violet'
}

// Runtime object exports so Node.js ESM value imports never error
export const IProfile = {};
export const IEducation = {};
export const ISkill = {};
export const IProject = {};
export const IThumbnail = {};
export const IMessage = {};
export const IMediaItem = {};
export const ISiteSettings = {};
export const IThreeSettings = {};

