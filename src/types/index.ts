export interface IProfile {
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
}

export interface IEducation {
  _id: string;
  institution: string;
  level: string;
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
  category: string;
  icon?: string;
  proficiencyLevel?: string;
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
  particleDensity: number;
  animationIntensity: number;
  glowIntensity: number;
  cardTiltIntensity: number;
  mouseParallaxIntensity: number;
  cursorEffects: boolean;
  reducedMotionFallback: boolean;
  accentColor: string;
}
