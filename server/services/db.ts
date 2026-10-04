import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import type {
  IProfile,
  IEducation,
  ISkill,
  IProject,
  IThumbnail,
  IMessage,
  ISiteSettings,
  IThreeSettings,
  IMediaItem
} from '../models/types.ts';

// Initial Seed Data
const defaultProfile: IProfile = {
  name: 'NIKIT KUMAR GUPTA',
  displayName: 'NIKIT KUMAR',
  tagline: 'FULL STACK DEVELOPER • THUMBNAIL DESIGNER',
  bio: 'Driven Full Stack Developer and Thumbnail Designer specializing in AI & Machine Learning applications, interactive 3D web environments, and high-impact visual design. Currently pursuing B.Tech in CSE (AI & ML) in Lucknow.',
  photo: '/src/assets/images/nikit_avatar_1791095716474.jpg',
  course: 'B.Tech CSE (AI & ML)',
  currentYear: '2nd Year',
  college: 'Khwaja Moinuddin Chisti Language University',
  collegeStart: '2025',
  collegeEnd: '2029',
  location: 'Lucknow, India',
  email: 'onlyynikit@gmail.com',
  githubUrl: 'https://github.com/placeholder-nikit',
  linkedinUrl: 'https://linkedin.com/in/placeholder-nikit',
  skillsHighlight: ['React', 'Node.js', 'MongoDB', 'Python', 'AI/ML', 'Thumbnail Design']
};

const defaultEducation: IEducation[] = [
  {
    _id: 'edu-1',
    institution: 'Khwaja Moinuddin Chisti Language University',
    level: 'Bachelor of Technology',
    field: 'Computer Science & Engineering (AI & ML)',
    startYear: '2025',
    endYear: '2029',
    description: 'Specializing in Artificial Intelligence and Machine Learning paradigms, distributed systems, full stack architectures, and modern web systems. Currently in 2nd Year.',
    location: 'Lucknow, Uttar Pradesh, India',
    achievements: ['Core Focus: Neural Networks & Full Stack Systems', 'Active Technical Developer & Designer'],
    order: 1
  },
  {
    _id: 'edu-2',
    institution: 'Kedarnath Uchh Vidyalay',
    level: 'Higher Secondary (12th)',
    field: 'Science & Mathematics',
    startYear: '2023',
    endYear: '2025',
    description: 'Foundational studies in Advanced Mathematics, Physics, and Computer Science fundamentals.',
    location: 'India',
    achievements: ['Strong analytical & algorithmic foundation'],
    order: 2
  },
  {
    _id: 'edu-3',
    institution: 'Rohtas Public School',
    level: 'Secondary Education (10th)',
    field: 'General Sciences & Mathematics',
    startYear: '2021',
    endYear: '2023',
    description: 'Completed secondary schooling with academic excellence and early enthusiasm for programming and design.',
    location: 'India',
    achievements: ['Science and Computer Application distinction'],
    order: 3
  }
];

const defaultSkills: ISkill[] = [
  // Frontend
  { _id: 'sk-1', name: 'React', category: 'Frontend', icon: 'Code', proficiencyLevel: 'Advanced', order: 1 },
  { _id: 'sk-2', name: 'JavaScript (ES6+)', category: 'Frontend', icon: 'FileCode', proficiencyLevel: 'Advanced', order: 2 },
  { _id: 'sk-3', name: 'HTML5 & CSS3', category: 'Frontend', icon: 'Layout', proficiencyLevel: 'Advanced', order: 3 },
  { _id: 'sk-4', name: 'Tailwind CSS', category: 'Frontend', icon: 'Palette', proficiencyLevel: 'Advanced', order: 4 },
  
  // Backend
  { _id: 'sk-5', name: 'Node.js', category: 'Backend', icon: 'Server', proficiencyLevel: 'Advanced', order: 5 },
  { _id: 'sk-6', name: 'Express.js', category: 'Backend', icon: 'Cpu', proficiencyLevel: 'Advanced', order: 6 },
  
  // Database
  { _id: 'sk-7', name: 'MongoDB', category: 'Database', icon: 'Database', proficiencyLevel: 'Advanced', order: 7 },
  { _id: 'sk-8', name: 'Mongoose', category: 'Database', icon: 'Layers', proficiencyLevel: 'Advanced', order: 8 },
  
  // AI/ML
  { _id: 'sk-9', name: 'Python', category: 'AI/ML', icon: 'Terminal', proficiencyLevel: 'Advanced', order: 9 },
  { _id: 'sk-10', name: 'TensorFlow', category: 'AI/ML', icon: 'Brain', proficiencyLevel: 'Intermediate', order: 10 },
  { _id: 'sk-11', name: 'Keras', category: 'AI/ML', icon: 'Network', proficiencyLevel: 'Intermediate', order: 11 },
  { _id: 'sk-12', name: 'FastAPI', category: 'AI/ML', icon: 'Zap', proficiencyLevel: 'Intermediate', order: 12 },
  
  // Programming
  { _id: 'sk-13', name: 'C++', category: 'Programming', icon: 'Binary', proficiencyLevel: 'Intermediate', order: 13 },
  { _id: 'sk-14', name: 'Data Structures & Algorithms', category: 'Programming', icon: 'GitGraph', proficiencyLevel: 'Intermediate', order: 14 },
  
  // Tools & Design
  { _id: 'sk-15', name: 'Git & GitHub', category: 'Tools', icon: 'GitBranch', proficiencyLevel: 'Advanced', order: 15 },
  { _id: 'sk-16', name: 'VS Code', category: 'Tools', icon: 'TerminalSquare', proficiencyLevel: 'Advanced', order: 16 },
  { _id: 'sk-17', name: 'Thumbnail Art & Composition', category: 'Design', icon: 'Image', proficiencyLevel: 'Expert', order: 17 }
];

const defaultProjects: IProject[] = [
  {
    _id: 'proj-1',
    name: 'DermaDetect AI',
    slug: 'dermadetect-ai',
    shortDescription: 'AI-powered skin health screening and diagnostic assistance platform.',
    longDescription: 'DermaDetect AI leverages deep learning vision architectures to assist users with preliminary screening and classification of dermatological conditions. Designed with an ultra-responsive React dashboard, Express backend, FastAPI inference service, and MongoDB diagnostic logging.',
    coverImage: '/src/assets/images/project_dermadetect_1791095728960.jpg',
    galleryImages: ['/src/assets/images/project_dermadetect_1791095728960.jpg'],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'FastAPI', 'TensorFlow/Keras'],
    githubUrl: 'https://github.com/placeholder-nikit/dermadetect-ai',
    liveUrl: 'https://dermadetect-ai-demo.placeholder.dev',
    category: 'AI & Healthcare',
    featured: true,
    published: true,
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'proj-2',
    name: 'Collabry',
    slug: 'collabry',
    shortDescription: 'Modern team collaboration and unified mail management platform.',
    longDescription: 'Collabry redefines workplace communication by unifying email threads, real-time team channels, and document collaboration into a cohesive, high-performance workspace with end-to-end task synchronization.',
    coverImage: '/src/assets/images/project_collabry_1791095740481.jpg',
    galleryImages: ['/src/assets/images/project_collabry_1791095740481.jpg'],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'WebSockets'],
    githubUrl: 'https://github.com/placeholder-nikit/collabry',
    liveUrl: 'https://collabry-demo.placeholder.dev',
    category: 'Full Stack & SaaS',
    featured: true,
    published: true,
    order: 2,
    createdAt: new Date().toISOString()
  }
];

const defaultThumbnails: IThumbnail[] = [
  {
    _id: 'thumb-1',
    title: 'The AI Singularity & Autonomous Agents',
    client: 'Tech Horizons Studio',
    category: 'Technology & AI',
    description: 'High-contrast 3D visual concept thumbnail engineered for maximum retention, featuring atmospheric lighting and volumetric glow.',
    image: '/src/assets/images/thumbnail_design_showcase_1791095752422.jpg',
    clientUrl: 'https://youtube.com',
    date: '2026',
    featured: true,
    published: true,
    order: 1
  },
  {
    _id: 'thumb-2',
    title: 'Cyber Mech: Battle of the Next Millennium',
    client: 'Apex Interactive Studios',
    category: 'Gaming & Sci-Fi',
    description: 'Cyberpunk mech action composition utilizing multi-layered rim illumination, cinematic color grading, and dynamic action focal points.',
    image: '/src/assets/images/thumbnail_gaming_ai_1791095764797.jpg',
    clientUrl: 'https://youtube.com',
    date: '2026',
    featured: true,
    published: true,
    order: 2
  }
];

const defaultSiteSettings: ISiteSettings = {
  siteTitle: 'NIKIT KUMAR • Full Stack Developer & Thumbnail Designer',
  metaDescription: 'Official portfolio and digital identity of Nikit Kumar: Full Stack Developer & Thumbnail Designer. B.Tech CSE (AI & ML) at Khwaja Moinuddin Chisti Language University, Lucknow.',
  heroHeading: 'NIKIT KUMAR',
  heroSubtitle: 'FULL STACK DEVELOPER • THUMBNAIL DESIGNER',
  aboutText: 'Passionate developer and visual storyteller bridging computer vision and modern web engineering. Currently studying B.Tech CSE (AI & ML) in Lucknow, India.',
  contactEmail: 'onlyynikit@gmail.com',
  githubUrl: 'https://github.com/placeholder-nikit',
  linkedinUrl: 'https://linkedin.com/in/placeholder-nikit',
  instagramUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
  footerText: '© 2026 NIKIT KUMAR. Built with React, Three.js, Node.js & MongoDB.'
};

const defaultThreeSettings: IThreeSettings = {
  hero3dEnabled: true,
  particleDensity: 65,
  animationIntensity: 1.0,
  glowIntensity: 0.85,
  cardTiltIntensity: 1.0,
  mouseParallaxIntensity: 0.8,
  cursorEffects: true,
  reducedMotionFallback: true,
  accentColor: 'cyan'
};

interface IStoreData {
  profile: IProfile;
  education: IEducation[];
  skills: ISkill[];
  projects: IProject[];
  thumbnails: IThumbnail[];
  messages: IMessage[];
  siteSettings: ISiteSettings;
  threeSettings: IThreeSettings;
  media: IMediaItem[];
  adminUser: {
    email: string;
    passwordHash: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'portfolio_store.json');

class DatabaseService {
  private data: IStoreData | null = null;
  private isMongoConnected = false;

  async init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'onlyynikit@gmail.com';
    const defaultAdminPass = process.env.ADMIN_PASSWORD || 'NikitAdminSecure2026!';
    const defaultPasswordHash = bcrypt.hashSync(defaultAdminPass, 10);

    if (fs.existsSync(STORE_PATH)) {
      try {
        const content = fs.readFileSync(STORE_PATH, 'utf-8');
        this.data = JSON.parse(content);
      } catch {
        this.data = null;
      }
    }

    if (!this.data) {
      this.data = {
        profile: defaultProfile,
        education: defaultEducation,
        skills: defaultSkills,
        projects: defaultProjects,
        thumbnails: defaultThumbnails,
        messages: [],
        siteSettings: defaultSiteSettings,
        threeSettings: defaultThreeSettings,
        media: [],
        adminUser: {
          email: defaultAdminEmail,
          passwordHash: defaultPasswordHash
        }
      };
      this.saveLocal();
    }

    // Try MongoDB if URI provided
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && mongoUri.trim() !== '') {
      // Prevent unhandled error event emissions on the default connection
      mongoose.connection.on('error', () => {
        // Silently handle background connection disconnects
      });

      try {
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 2500,
          connectTimeoutMS: 3000,
          socketTimeoutMS: 5000,
          autoIndex: false,
        });
        this.isMongoConnected = true;
        console.log('Successfully connected to MongoDB Cluster.');
      } catch {
        this.isMongoConnected = false;
        // Cleanly disconnect to cease any pending background reconnect sockets
        await mongoose.disconnect().catch(() => {});
        console.log(
          'Notice: MongoDB Atlas cluster was unreachable (likely IP whitelist constraint). Operating reliably with persistent local storage.'
        );
      }
    } else {
      console.log('MONGODB_URI not provided; running with local persistent JSON store.');
    }
  }

  getDbStatus() {
    return {
      connectedToMongo: this.isMongoConnected,
      storageType: this.isMongoConnected ? 'MongoDB Atlas' : 'Persistent Local Store',
      hint: this.isMongoConnected
        ? 'Connected and active'
        : 'If using MongoDB Atlas, whitelist IP 0.0.0.0/0 in Atlas Network Access'
    };
  }

  private saveLocal() {
    if (this.data) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    }
  }

  // Profile methods
  getProfile(): IProfile {
    return this.data!.profile;
  }

  updateProfile(updates: Partial<IProfile>): IProfile {
    this.data!.profile = {
      ...this.data!.profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveLocal();
    return this.data!.profile;
  }

  // Education methods
  getEducation(): IEducation[] {
    return [...this.data!.education].sort((a, b) => a.order - b.order);
  }

  addEducation(item: Omit<IEducation, '_id'>): IEducation {
    const newItem: IEducation = {
      ...item,
      _id: 'edu-' + Date.now()
    };
    this.data!.education.push(newItem);
    this.saveLocal();
    return newItem;
  }

  updateEducation(id: string, updates: Partial<IEducation>): IEducation | null {
    const idx = this.data!.education.findIndex(e => e._id === id);
    if (idx === -1) return null;
    this.data!.education[idx] = { ...this.data!.education[idx], ...updates };
    this.saveLocal();
    return this.data!.education[idx];
  }

  deleteEducation(id: string): boolean {
    const initialLen = this.data!.education.length;
    this.data!.education = this.data!.education.filter(e => e._id !== id);
    this.saveLocal();
    return this.data!.education.length < initialLen;
  }

  reorderEducation(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const item = this.data!.education.find(e => e._id === id);
      if (item) item.order = index + 1;
    });
    this.saveLocal();
  }

  // Skills methods
  getSkills(): ISkill[] {
    return [...this.data!.skills].sort((a, b) => a.order - b.order);
  }

  addSkill(item: Omit<ISkill, '_id'>): ISkill {
    const newItem: ISkill = {
      ...item,
      _id: 'sk-' + Date.now()
    };
    this.data!.skills.push(newItem);
    this.saveLocal();
    return newItem;
  }

  updateSkill(id: string, updates: Partial<ISkill>): ISkill | null {
    const idx = this.data!.skills.findIndex(s => s._id === id);
    if (idx === -1) return null;
    this.data!.skills[idx] = { ...this.data!.skills[idx], ...updates };
    this.saveLocal();
    return this.data!.skills[idx];
  }

  deleteSkill(id: string): boolean {
    const initialLen = this.data!.skills.length;
    this.data!.skills = this.data!.skills.filter(s => s._id !== id);
    this.saveLocal();
    return this.data!.skills.length < initialLen;
  }

  // Projects methods
  getProjects(publishedOnly = false): IProject[] {
    let list = this.data!.projects;
    if (publishedOnly) {
      list = list.filter(p => p.published);
    }
    return [...list].sort((a, b) => a.order - b.order);
  }

  getProjectBySlug(slug: string): IProject | undefined {
    return this.data!.projects.find(p => p.slug === slug);
  }

  addProject(project: Omit<IProject, '_id' | 'createdAt'>): IProject {
    const newProj: IProject = {
      ...project,
      _id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data!.projects.push(newProj);
    this.saveLocal();
    return newProj;
  }

  updateProject(id: string, updates: Partial<IProject>): IProject | null {
    const idx = this.data!.projects.findIndex(p => p._id === id);
    if (idx === -1) return null;
    this.data!.projects[idx] = { ...this.data!.projects[idx], ...updates };
    this.saveLocal();
    return this.data!.projects[idx];
  }

  deleteProject(id: string): boolean {
    const initialLen = this.data!.projects.length;
    this.data!.projects = this.data!.projects.filter(p => p._id !== id);
    this.saveLocal();
    return this.data!.projects.length < initialLen;
  }

  // Thumbnails methods
  getThumbnails(publishedOnly = false): IThumbnail[] {
    let list = this.data!.thumbnails;
    if (publishedOnly) {
      list = list.filter(t => t.published);
    }
    return [...list].sort((a, b) => a.order - b.order);
  }

  addThumbnail(thumb: Omit<IThumbnail, '_id'>): IThumbnail {
    const newThumb: IThumbnail = {
      ...thumb,
      _id: 'thumb-' + Date.now()
    };
    this.data!.thumbnails.push(newThumb);
    this.saveLocal();
    return newThumb;
  }

  updateThumbnail(id: string, updates: Partial<IThumbnail>): IThumbnail | null {
    const idx = this.data!.thumbnails.findIndex(t => t._id === id);
    if (idx === -1) return null;
    this.data!.thumbnails[idx] = { ...this.data!.thumbnails[idx], ...updates };
    this.saveLocal();
    return this.data!.thumbnails[idx];
  }

  deleteThumbnail(id: string): boolean {
    const initialLen = this.data!.thumbnails.length;
    this.data!.thumbnails = this.data!.thumbnails.filter(t => t._id !== id);
    this.saveLocal();
    return this.data!.thumbnails.length < initialLen;
  }

  // Messages methods
  getMessages(): IMessage[] {
    return [...this.data!.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addMessage(name: string, email: string, message: string): IMessage {
    const msg: IMessage = {
      _id: 'msg-' + Date.now(),
      name,
      email,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.data!.messages.unshift(msg);
    this.saveLocal();
    return msg;
  }

  markMessageRead(id: string, read = true): boolean {
    const msg = this.data!.messages.find(m => m._id === id);
    if (msg) {
      msg.read = read;
      this.saveLocal();
      return true;
    }
    return false;
  }

  deleteMessage(id: string): boolean {
    const initialLen = this.data!.messages.length;
    this.data!.messages = this.data!.messages.filter(m => m._id !== id);
    this.saveLocal();
    return this.data!.messages.length < initialLen;
  }

  // Settings
  getSiteSettings(): ISiteSettings {
    return this.data!.siteSettings;
  }

  updateSiteSettings(updates: Partial<ISiteSettings>): ISiteSettings {
    this.data!.siteSettings = { ...this.data!.siteSettings, ...updates };
    this.saveLocal();
    return this.data!.siteSettings;
  }

  getThreeSettings(): IThreeSettings {
    return this.data!.threeSettings;
  }

  updateThreeSettings(updates: Partial<IThreeSettings>): IThreeSettings {
    this.data!.threeSettings = { ...this.data!.threeSettings, ...updates };
    this.saveLocal();
    return this.data!.threeSettings;
  }

  // Media
  getMedia(): IMediaItem[] {
    return this.data!.media;
  }

  addMedia(item: Omit<IMediaItem, '_id' | 'createdAt'>): IMediaItem {
    const newMedia: IMediaItem = {
      ...item,
      _id: 'media-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data!.media.unshift(newMedia);
    this.saveLocal();
    return newMedia;
  }

  deleteMedia(id: string): boolean {
    const initialLen = this.data!.media.length;
    this.data!.media = this.data!.media.filter(m => m._id !== id);
    this.saveLocal();
    return this.data!.media.length < initialLen;
  }

  // Admin Auth credentials
  getAdminUser() {
    return this.data!.adminUser;
  }

  updateAdminPassword(newHash: string) {
    this.data!.adminUser.passwordHash = newHash;
    this.saveLocal();
  }
}

export const dbService = new DatabaseService();
