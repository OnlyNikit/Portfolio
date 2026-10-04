import mongoose, { Schema } from 'mongoose';

// User / Admin Model
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

// Profile Model
const ProfileSchema = new Schema({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  tagline: { type: String, required: true },
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
  course: { type: String, default: '' },
  currentYear: { type: String, default: '' },
  college: { type: String, default: '' },
  collegeStart: { type: String, default: '' },
  collegeEnd: { type: String, default: '' },
  location: { type: String, default: '' },
  email: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  skillsHighlight: [{ type: String }],
}, { timestamps: true });

// Education Model
const EducationSchema = new Schema({
  institution: { type: String, required: true },
  level: { type: String, required: true },
  field: { type: String, default: '' },
  startYear: { type: String, required: true },
  endYear: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  image: { type: String, default: '' },
  achievements: [{ type: String }],
  order: { type: Number, default: 0, index: true },
}, { timestamps: true });

// Skill Model
const SkillSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  icon: { type: String, default: '' },
  proficiencyLevel: { type: String, default: 'Intermediate' },
  order: { type: Number, default: 0, index: true },
}, { timestamps: true });

// Project Model
const ProjectSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, default: '' },
  coverImage: { type: String, required: true },
  galleryImages: [{ type: String }],
  videoUrl: { type: String, default: '' },
  techStack: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  category: { type: String, default: 'Full Stack' },
  featured: { type: Boolean, default: false, index: true },
  published: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0, index: true },
}, { timestamps: true });

// Thumbnail Model
const ThumbnailSchema = new Schema({
  title: { type: String, required: true },
  client: { type: String, default: '' },
  category: { type: String, default: 'YouTube' },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  clientUrl: { type: String, default: '' },
  date: { type: String, default: '' },
  featured: { type: Boolean, default: false, index: true },
  published: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0, index: true },
}, { timestamps: true });

// Message Model
const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false, index: true },
}, { timestamps: true });

// Site Settings Model
const SiteSettingsSchema = new Schema({
  siteTitle: { type: String, required: true },
  metaDescription: { type: String, default: '' },
  heroHeading: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  aboutText: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  twitterUrl: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  footerText: { type: String, default: '' },
}, { timestamps: true });

// 3D Settings Model
const ThreeSettingsSchema = new Schema({
  hero3dEnabled: { type: Boolean, default: true },
  particleDensity: { type: Number, default: 60 },
  animationIntensity: { type: Number, default: 1.0 },
  glowIntensity: { type: Number, default: 0.8 },
  cardTiltIntensity: { type: Number, default: 1.0 },
  mouseParallaxIntensity: { type: Number, default: 0.9 },
  cursorEffects: { type: Boolean, default: true },
  reducedMotionFallback: { type: Boolean, default: true },
  accentColor: { type: String, default: 'cyan' },
}, { timestamps: true });

// Media Model
const MediaSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, default: 0 },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const EducationModel = mongoose.models.Education || mongoose.model('Education', EducationSchema);
export const SkillModel = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const ThumbnailModel = mongoose.models.Thumbnail || mongoose.model('Thumbnail', ThumbnailSchema);
export const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const SiteSettingsModel = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
export const ThreeSettingsModel = mongoose.models.ThreeSettings || mongoose.model('ThreeSettings', ThreeSettingsSchema);
export const MediaModel = mongoose.models.Media || mongoose.model('Media', MediaSchema);
