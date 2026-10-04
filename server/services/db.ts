import mongoose, { Schema, type Model } from 'mongoose';

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

/* ---------- helper: immutable / auto fields hata do ---------- */
function clean<T extends Record<string, any>>(updates: T): Partial<T> {
  const { _id, __v, createdAt, updatedAt, ...rest } = (updates || {}) as any;
  return rest;
}

/* ---------- Schemas ---------- */

const profileSchema = new Schema(
  {
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    tagline: { type: String, default: '' },
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
    skillsHighlight: { type: [String], default: [] }
  },
  { timestamps: true, versionKey: false }
);

const educationSchema = new Schema(
  {
    _id: { type: String, required: true },
    institution: { type: String, required: true },
    level: { type: String, required: true },
    field: { type: String, default: '' },
    startYear: { type: String, default: '' },
    endYear: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
    achievements: { type: [String], default: [] },
    order: { type: Number, default: 1 }
  },
  { timestamps: false, versionKey: false }
);

const skillSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, default: 'Code' },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    order: { type: Number, default: 1 }
  },
  { timestamps: false, versionKey: false }
);

const projectSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, default: '' },
    coverImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
    videoUrl: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    category: { type: String, default: 'Full Stack' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, versionKey: false }
);

const thumbnailSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    client: { type: String, default: '' },
    category: { type: String, default: 'YouTube' },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    clientUrl: { type: String, default: '' },
    date: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 1 }
  },
  { timestamps: false, versionKey: false }
);

const messageSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, versionKey: false }
);

const siteSettingsSchema = new Schema(
  {
    siteTitle: { type: String, default: '' },
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
    footerText: { type: String, default: '' }
  },
  { timestamps: true, versionKey: false }
);

const threeSettingsSchema = new Schema(
  {
    hero3dEnabled: { type: Boolean, default: true },
    particleDensity: { type: Number, default: 65 },
    animationIntensity: { type: Number, default: 1 },
    glowIntensity: { type: Number, default: 0.85 },
    cardTiltIntensity: { type: Number, default: 1 },
    mouseParallaxIntensity: { type: Number, default: 0.8 },
    cursorEffects: { type: Boolean, default: true },
    reducedMotionFallback: { type: Boolean, default: true },
    accentColor: { type: String, default: 'cyan' }
  },
  { timestamps: true, versionKey: false }
);

const mediaSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, versionKey: false }
);

/* ---------- Models ---------- */

const Profile =
  (mongoose.models.Profile as Model<IProfile>) ||
  mongoose.model<IProfile>('Profile', profileSchema);

const Education =
  (mongoose.models.Education as Model<IEducation>) ||
  mongoose.model<IEducation>('Education', educationSchema);

const Skill =
  (mongoose.models.Skill as Model<ISkill>) ||
  mongoose.model<ISkill>('Skill', skillSchema);

const Project =
  (mongoose.models.Project as Model<IProject>) ||
  mongoose.model<IProject>('Project', projectSchema);

const Thumbnail =
  (mongoose.models.Thumbnail as Model<IThumbnail>) ||
  mongoose.model<IThumbnail>('Thumbnail', thumbnailSchema);

const Message =
  (mongoose.models.Message as Model<IMessage>) ||
  mongoose.model<IMessage>('Message', messageSchema);

const SiteSettings =
  (mongoose.models.SiteSettings as Model<ISiteSettings>) ||
  mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);

const ThreeSettings =
  (mongoose.models.ThreeSettings as Model<IThreeSettings>) ||
  mongoose.model<IThreeSettings>('ThreeSettings', threeSettingsSchema);

const Media =
  (mongoose.models.Media as Model<IMediaItem>) ||
  mongoose.model<IMediaItem>('Media', mediaSchema);

/* ---------- Default Data ---------- */

const defaultProfile: IProfile = {
  name: 'NIKIT KUMAR GUPTA',
  displayName: 'NIKIT KUMAR',
  tagline: 'FULL STACK DEVELOPER • THUMBNAIL DESIGNER',
  bio: '',
  photo: '',
  course: 'B.Tech CSE (AI & ML)',
  currentYear: '2nd Year',
  college: 'Khwaja Moinuddin Chisti Language University',
  collegeStart: '2025',
  collegeEnd: '2029',
  location: 'Lucknow, India',
  email: '',
  githubUrl: '',
  linkedinUrl: '',
  skillsHighlight: [
    'React',
    'Node.js',
    'MongoDB',
    'Python',
    'AI/ML',
    'Thumbnail Design'
  ]
};

const defaultSiteSettings: ISiteSettings = {
  siteTitle: 'NIKIT KUMAR • Full Stack Developer & Thumbnail Designer',
  metaDescription: '',
  heroHeading: 'NIKIT KUMAR',
  heroSubtitle: 'FULL STACK DEVELOPER • THUMBNAIL DESIGNER',
  aboutText: '',
  contactEmail: '',
  githubUrl: '',
  linkedinUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
  footerText: '© 2026 NIKIT KUMAR'
};

const defaultThreeSettings: IThreeSettings = {
  hero3dEnabled: true,
  particleDensity: 65,
  animationIntensity: 1,
  glowIntensity: 0.85,
  cardTiltIntensity: 1,
  mouseParallaxIntensity: 0.8,
  cursorEffects: true,
  reducedMotionFallback: true,
  accentColor: 'cyan'
};

/* ---------- Database Service ---------- */

class DatabaseService {
  private isMongoConnected = false;

  async init(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (!mongoUri) {
      throw new Error(
        'MONGODB_URI is not configured. MongoDB is required in production.'
      );
    }

    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 20000,
          autoIndex: true
        });
      }

      this.isMongoConnected = true;
      console.log('✅ Successfully connected to MongoDB Atlas');

      await this.seedDefaults();
    } catch (error) {
      this.isMongoConnected = false;
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  getDbStatus() {
    return {
      connectedToMongo: this.isMongoConnected,
      storageType: this.isMongoConnected ? 'MongoDB Atlas' : 'Unavailable',
      hint: this.isMongoConnected
        ? 'Connected and active'
        : 'MongoDB connection is unavailable'
    };
  }

  private async seedDefaults(): Promise<void> {
    if (!(await Profile.exists({}))) {
      await Profile.create(defaultProfile);
      console.log('🌱 Default profile created');
    }

    if (!(await SiteSettings.exists({}))) {
      await SiteSettings.create(defaultSiteSettings);
    }

    if (!(await ThreeSettings.exists({}))) {
      await ThreeSettings.create(defaultThreeSettings);
    }
  }

  /* ----- Profile ----- */

  async getProfile(): Promise<IProfile | null> {
    const profile = await Profile.findOne().lean();
    return profile as IProfile | null;
  }

  async updateProfile(updates: Partial<IProfile>): Promise<IProfile | null> {
    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: clean(updates) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return profile as IProfile;
  }

  /* ----- Education ----- */

  async getEducation(): Promise<IEducation[]> {
    const items = await Education.find().sort({ order: 1 }).lean();
    return items as IEducation[];
  }

  async addEducation(item: Omit<IEducation, '_id'>): Promise<IEducation> {
    const newItem = { ...item, _id: `edu-${Date.now()}` };
    await Education.create(newItem);
    return newItem as IEducation;
  }

  async updateEducation(
    id: string,
    updates: Partial<IEducation>
  ): Promise<IEducation | null> {
    const updated = await Education.findByIdAndUpdate(
      id,
      { $set: clean(updates) },
      { new: true }
    ).lean();

    return updated as IEducation | null;
  }

  async deleteEducation(id: string): Promise<boolean> {
    const result = await Education.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async reorderEducation(orderedIds: string[]): Promise<void> {
    await Promise.all(
      orderedIds.map((id, index) =>
        Education.updateOne({ _id: id }, { $set: { order: index + 1 } })
      )
    );
  }

  /* ----- Skills ----- */

  async getSkills(): Promise<ISkill[]> {
    const skills = await Skill.find().sort({ order: 1 }).lean();
    return skills as ISkill[];
  }

  async addSkill(item: Omit<ISkill, '_id'>): Promise<ISkill> {
    const newItem = { ...item, _id: `sk-${Date.now()}` };
    await Skill.create(newItem);
    return newItem as ISkill;
  }

  async updateSkill(
    id: string,
    updates: Partial<ISkill>
  ): Promise<ISkill | null> {
    const updated = await Skill.findByIdAndUpdate(
      id,
      { $set: clean(updates) },
      { new: true }
    ).lean();

    return updated as ISkill | null;
  }

  async deleteSkill(id: string): Promise<boolean> {
    const result = await Skill.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  /* ----- Projects ----- */

  // publishedOnly = true  -> sirf published (public site)
  // publishedOnly = false -> sab projects (admin)
  async getProjects(publishedOnly = false): Promise<IProject[]> {
    const filter = publishedOnly ? { published: true } : {};
    const projects = await Project.find(filter).sort({ order: 1 }).lean();
    return projects as IProject[];
  }

  async getProjectBySlug(slug: string): Promise<IProject | null> {
    const project = await Project.findOne({ slug: slug.toLowerCase() }).lean();
    return project as IProject | null;
  }

  async addProject(
    project: Omit<IProject, '_id' | 'createdAt'>
  ): Promise<IProject> {
    const newProject = {
      ...project,
      _id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    await Project.create(newProject);
    return newProject as IProject;
  }

  async updateProject(
    id: string,
    updates: Partial<IProject>
  ): Promise<IProject | null> {
    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: clean(updates) },
      { new: true }
    ).lean();

    return updated as IProject | null;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await Project.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  /* ----- Thumbnails ----- */

  async getThumbnails(publishedOnly = false): Promise<IThumbnail[]> {
    const filter = publishedOnly ? { published: true } : {};
    const thumbnails = await Thumbnail.find(filter).sort({ order: 1 }).lean();
    return thumbnails as IThumbnail[];
  }

  async addThumbnail(thumbnail: Omit<IThumbnail, '_id'>): Promise<IThumbnail> {
    const newThumbnail = { ...thumbnail, _id: `thumb-${Date.now()}` };
    await Thumbnail.create(newThumbnail);
    return newThumbnail as IThumbnail;
  }

  async updateThumbnail(
    id: string,
    updates: Partial<IThumbnail>
  ): Promise<IThumbnail | null> {
    const updated = await Thumbnail.findByIdAndUpdate(
      id,
      { $set: clean(updates) },
      { new: true }
    ).lean();

    return updated as IThumbnail | null;
  }

  async deleteThumbnail(id: string): Promise<boolean> {
    const result = await Thumbnail.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  /* ----- Messages ----- */

  async getMessages(): Promise<IMessage[]> {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    return messages as IMessage[];
  }

  async addMessage(
    name: string,
    email: string,
    message: string
  ): Promise<IMessage> {
    const newMessage = {
      _id: `msg-${Date.now()}`,
      name,
      email,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    await Message.create(newMessage);
    return newMessage as IMessage;
  }

  async markMessageRead(id: string, read = true): Promise<boolean> {
    const result = await Message.updateOne({ _id: id }, { $set: { read } });
    return result.matchedCount === 1;
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await Message.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  /* ----- Site Settings ----- */

  async getSiteSettings(): Promise<ISiteSettings | null> {
    const settings = await SiteSettings.findOne().lean();
    return settings as ISiteSettings | null;
  }

  async updateSiteSettings(
    updates: Partial<ISiteSettings>
  ): Promise<ISiteSettings | null> {
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: clean(updates) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return settings as ISiteSettings;
  }

  /* ----- 3D Settings ----- */

  async getThreeSettings(): Promise<IThreeSettings | null> {
    const settings = await ThreeSettings.findOne().lean();
    return settings as IThreeSettings | null;
  }

  async updateThreeSettings(
    updates: Partial<IThreeSettings>
  ): Promise<IThreeSettings | null> {
    const settings = await ThreeSettings.findOneAndUpdate(
      {},
      { $set: clean(updates) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return settings as IThreeSettings;
  }

  /* ----- Media ----- */

  async getMedia(): Promise<IMediaItem[]> {
    const media = await Media.find().sort({ createdAt: -1 }).lean();
    return media as IMediaItem[];
  }

  async addMedia(
    item: Omit<IMediaItem, '_id' | 'createdAt'>
  ): Promise<IMediaItem> {
    const newMedia = {
      ...item,
      _id: `media-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    await Media.create(newMedia);
    return newMedia as IMediaItem;
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await Media.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}

export const dbService = new DatabaseService();