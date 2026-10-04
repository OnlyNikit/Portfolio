import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Image as ImageIcon,
  MessageSquare,
  Sliders,
  Settings,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Check,
  Upload,
  Copy,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePortfolio } from "../../context/PortfolioContext.jsx";
import { api } from "../../services/api.js";
export function AdminDashboard({ onBackToSite }) {
  const { logout } = useAuth();
  const {
    profile,
    education,
    skills,
    projects,
    thumbnails,
    siteSettings,
    threeSettings,
    refreshPortfolio,
    updateSiteSettingsState,
    updateThreeSettingsState
  } = usePortfolio();
  const [activeTab, setActiveTab] = useState("overview");
  const [messages, setMessages] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    displayName: "",
    tagline: "",
    bio: "",
    photo: "",
    course: "",
    currentYear: "",
    college: "",
    collegeStart: "",
    collegeEnd: "",
    location: "",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    skillsHighlight: ""
  });
  const [siteForm, setSiteForm] = useState({
    siteTitle: "",
    metaDescription: "",
    heroHeading: "",
    heroSubtitle: "",
    aboutText: "",
    contactEmail: "",
    githubUrl: "",
    linkedinUrl: "",
    footerText: ""
  });
  const [threeForm, setThreeForm] = useState({
    hero3dEnabled: true,
    particleDensity: 60,
    animationIntensity: 1,
    glowIntensity: 0.8,
    cardTiltIntensity: 1,
    mouseParallaxIntensity: 0.8,
    cursorEffects: true,
    reducedMotionFallback: true,
    accentColor: "cyan"
  });
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingThumbnail, setEditingThumbnail] = useState(null);
  useEffect(() => {
    api.getMessages().then(setMessages).catch(() => {
    });
    api.getMedia().then(setMediaList).catch(() => {
    });
    fetch("/api/health").then((res) => res.json()).then((data) => {
      if (data.database) setDbStatus(data.database);
    }).catch(() => {
    });
  }, []);
  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        displayName: profile.displayName || "",
        tagline: profile.tagline || "",
        bio: profile.bio || "",
        photo: profile.photo || "",
        course: profile.course || "",
        currentYear: profile.currentYear || "",
        college: profile.college || "",
        collegeStart: profile.collegeStart || "",
        collegeEnd: profile.collegeEnd || "",
        location: profile.location || "",
        email: profile.email || "",
        githubUrl: profile.githubUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        skillsHighlight: (profile.skillsHighlight || []).join(", ")
      });
    }
  }, [profile]);
  useEffect(() => {
    if (siteSettings) {
      setSiteForm({
        siteTitle: siteSettings.siteTitle || "",
        metaDescription: siteSettings.metaDescription || "",
        heroHeading: siteSettings.heroHeading || "",
        heroSubtitle: siteSettings.heroSubtitle || "",
        aboutText: siteSettings.aboutText || "",
        contactEmail: siteSettings.contactEmail || "",
        githubUrl: siteSettings.githubUrl || "",
        linkedinUrl: siteSettings.linkedinUrl || "",
        footerText: siteSettings.footerText || ""
      });
    }
  }, [siteSettings]);
  useEffect(() => {
    if (threeSettings) {
      setThreeForm({ ...threeSettings });
    }
  }, [threeSettings]);
  const showFeedback = (msg, isError = false) => {
    if (isError) {
      setErrorStatus(msg);
      setTimeout(() => setErrorStatus(null), 4e3);
    } else {
      setSaveStatus(msg);
      setTimeout(() => setSaveStatus(null), 3e3);
    }
  };
  const handleImageUpload = async (file, callback) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const res = await api.uploadMedia(file.name, base64, file.type);
        callback(res.item.url);
        api.getMedia().then(setMediaList).catch(() => {
        });
        showFeedback("Image uploaded and applied!");
      } catch (err) {
        showFeedback(err.message || "Image upload failed", true);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleSaveProfile = async () => {
    try {
      await api.updateProfile({
        ...profileForm,
        skillsHighlight: profileForm.skillsHighlight.split(",").map((s) => s.trim()).filter(Boolean)
      });
      await refreshPortfolio();
      showFeedback("Profile updated successfully!");
    } catch (err) {
      showFeedback(err.message || "Failed to update profile", true);
    }
  };
  const handleSaveSiteSettings = async () => {
    try {
      const res = await api.updateSiteSettings(siteForm);
      updateSiteSettingsState(res.settings);
      showFeedback("Site settings saved!");
    } catch (err) {
      showFeedback(err.message || "Failed to save settings", true);
    }
  };
  const handleSave3DSettings = async () => {
    try {
      const res = await api.updateThreeSettings(threeForm);
      updateThreeSettingsState(res.settings);
      showFeedback("3D visual settings applied!");
    } catch (err) {
      showFeedback(err.message || "Failed to save 3D settings", true);
    }
  };
  return <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col md:flex-row">
      {
    /* Sidebar Navigation */
  }
      <aside className="w-full md:w-64 bg-[#080c18] border-r border-white/[0.08] flex flex-col shrink-0">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              PORTFOLIO CMS
            </div>
            <div className="text-base font-bold text-white tracking-tight">Admin Console</div>
          </div>
          <button
    onClick={onBackToSite}
    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white"
    title="View Live Site"
  >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {[
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "education", label: "Education / Journey", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Sparkles },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "thumbnails", label: "Thumbnails", icon: ImageIcon },
    { id: "messages", label: `Messages (${messages.filter((m) => !m.read).length})`, icon: MessageSquare },
    { id: "media", label: "Media Library", icon: Upload },
    { id: "3d", label: "3D Settings", icon: Sliders },
    { id: "settings", label: "Site Settings", icon: Settings }
  ].map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${isActive ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30" : "text-slate-400 hover:text-white hover:bg-white/[0.03]"}`}
    >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>;
  })}
        </nav>

        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <button
    onClick={logout}
    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 transition-colors cursor-pointer"
  >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {
    /* Main Content Area */
  }
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {
    /* Floating feedback alert */
  }
        {saveStatus && <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 shadow-2xl backdrop-blur-md">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{saveStatus}</span>
          </div>}
        {errorStatus && <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 shadow-2xl backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorStatus}</span>
          </div>}

        {
    /* 1. OVERVIEW TAB */
  }
        {activeTab === "overview" && <div className="space-y-8 max-w-5xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Platform Overview</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Real-time metrics and portfolio status
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#090d18] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400">Total Projects</div>
                <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
                <div className="text-[11px] text-cyan-400 mt-1">
                  {projects.filter((p) => p.published).length} Published
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#090d18] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400">Thumbnails</div>
                <div className="text-2xl font-bold text-white mt-1">{thumbnails.length}</div>
                <div className="text-[11px] text-cyan-400 mt-1">
                  {thumbnails.filter((t) => t.featured).length} Featured
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#090d18] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400">Inbound Messages</div>
                <div className="text-2xl font-bold text-white mt-1">{messages.length}</div>
                <div className="text-[11px] text-amber-400 mt-1">
                  {messages.filter((m) => !m.read).length} Unread
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#090d18] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400">Database Storage</div>
                <div className={`text-base font-bold mt-1.5 ${dbStatus?.connectedToMongo ? "text-emerald-400" : "text-cyan-400"}`}>
                  {dbStatus?.storageType || "Local JSON Store"}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1 truncate" title={dbStatus?.hint}>
                  {dbStatus?.connectedToMongo ? "Cluster Connected" : "Auto-failover Active"}
                </div>
              </div>
            </div>

            {dbStatus && !dbStatus.connectedToMongo && <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 animate-pulse" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-white">Database Status: </span>
                  <span>
                    Your portfolio is running smoothly on the high-resilience persistent local store with full CRUD capabilities. To sync live with MongoDB Atlas, add <code className="px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 font-mono text-[11px]">0.0.0.0/0</code> to your Atlas <strong>Network Access</strong> IP access list.
                  </span>
                </div>
              </div>}

            <div className="p-6 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                QUICK ACTIONS
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
    onClick={() => setActiveTab("projects")}
    className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
  >
                  + Add New Project
                </button>
                <button
    onClick={() => setActiveTab("thumbnails")}
    className="px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold"
  >
                  + Upload Thumbnail
                </button>
                <button
    onClick={() => setActiveTab("profile")}
    className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-xs font-semibold"
  >
                  Update Profile Info
                </button>
              </div>
            </div>
          </div>}

        {
    /* 2. PROFILE TAB */
  }
        {activeTab === "profile" && <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Profile & Identity</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Manage personal brand details, photos, and academic metadata
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-6">
              {
    /* Profile Photo Slot with Direct Upload */
  }
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-cyan-500/40 shrink-0">
                  <img
    src={profileForm.photo}
    alt="Profile Avatar"
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.style.display = "none";
    }}
  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400">Profile Photo (3D Card & About)</label>
                  <div className="flex items-center gap-3">
                    <input
    type="file"
    id="avatar-upload"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file, (url) => setProfileForm({ ...profileForm, photo: url }));
      }
    }}
  />
                    <label
    htmlFor="avatar-upload"
    className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] cursor-pointer flex items-center gap-1.5"
  >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload New Photo</span>
                    </label>
                    <input
    type="text"
    value={profileForm.photo}
    onChange={(e) => setProfileForm({ ...profileForm, photo: e.target.value })}
    placeholder="/image-url.jpg"
    className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 w-64"
  />
                  </div>
                </div>
              </div>

              {
    /* Form Grid */
  }
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Full Name</label>
                  <input
    type="text"
    value={profileForm.name}
    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:border-cyan-400"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Display Name</label>
                  <input
    type="text"
    value={profileForm.displayName}
    onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:border-cyan-400"
  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-mono text-slate-400">Tagline</label>
                  <input
    type="text"
    value={profileForm.tagline}
    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:border-cyan-400"
  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-mono text-slate-400">Bio Statement</label>
                  <textarea
    rows={3}
    value={profileForm.bio}
    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:border-cyan-400 resize-none"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Course</label>
                  <input
    type="text"
    value={profileForm.course}
    onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Current Year</label>
                  <input
    type="text"
    value={profileForm.currentYear}
    onChange={(e) => setProfileForm({ ...profileForm, currentYear: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">College / University</label>
                  <input
    type="text"
    value={profileForm.college}
    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Current Location</label>
                  <input
    type="text"
    value={profileForm.location}
    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Contact Email</label>
                  <input
    type="email"
    value={profileForm.email}
    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">GitHub Profile URL</label>
                  <input
    type="text"
    value={profileForm.githubUrl}
    onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">LinkedIn Profile URL</label>
                  <input
    type="text"
    value={profileForm.linkedinUrl}
    onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Card Skills Highlight (Comma separated)</label>
                  <input
    type="text"
    value={profileForm.skillsHighlight}
    onChange={(e) => setProfileForm({ ...profileForm, skillsHighlight: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
              </div>

              <button
    onClick={handleSaveProfile}
    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
  >
                Save Profile Changes
              </button>
            </div>
          </div>}

        {
    /* 3. EDUCATION TAB */
  }
        {activeTab === "education" && <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Education & Journey</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Configure school 10th/12th and university timeline mappings
                </p>
              </div>
              <button
    onClick={() => setEditingEducation({ institution: "", level: "", startYear: "", endYear: "", description: "", location: "", order: education.length + 1 })}
    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
  >
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            </div>

            <div className="space-y-4">
              {education.map((edu) => <div key={edu._id} className="p-5 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-cyan-400">{edu.level} ({edu.startYear} - {edu.endYear})</div>
                    <div className="text-base font-bold text-white">{edu.institution}</div>
                    {edu.field && <div className="text-xs text-slate-300">{edu.field}</div>}
                    {edu.description && <p className="text-xs text-slate-400 pt-1">{edu.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
    onClick={() => setEditingEducation(edu)}
    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white"
  >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
    onClick={async () => {
      await api.deleteEducation(edu._id);
      await refreshPortfolio();
      showFeedback("Education item removed");
    }}
    className="p-2 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 text-rose-400"
  >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>)}
            </div>

            {
    /* Education Edit Modal */
  }
            {editingEducation && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0c101d] border border-cyan-500/30 space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    {editingEducation._id ? "Edit Education Entry" : "Add Education Entry"}
                  </h3>
                  <div className="space-y-3">
                    <input
    type="text"
    placeholder="Institution (e.g. Kedarnath Uchh Vidyalay)"
    value={editingEducation.institution || ""}
    onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <input
    type="text"
    placeholder="Level (e.g. Higher Secondary (12th) or Secondary (10th))"
    value={editingEducation.level || ""}
    onChange={(e) => setEditingEducation({ ...editingEducation, level: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <input
    type="text"
    placeholder="Field / Specialization"
    value={editingEducation.field || ""}
    onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <div className="grid grid-cols-2 gap-3">
                      <input
    type="text"
    placeholder="Start Year"
    value={editingEducation.startYear || ""}
    onChange={(e) => setEditingEducation({ ...editingEducation, startYear: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                      <input
    type="text"
    placeholder="End Year"
    value={editingEducation.endYear || ""}
    onChange={(e) => setEditingEducation({ ...editingEducation, endYear: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    </div>
                    <textarea
    placeholder="Description"
    rows={3}
    value={editingEducation.description || ""}
    onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white resize-none"
  />
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button
    onClick={() => setEditingEducation(null)}
    className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs text-slate-300"
  >
                      Cancel
                    </button>
                    <button
    onClick={async () => {
      if (editingEducation._id) {
        await api.updateEducation(editingEducation._id, editingEducation);
      } else {
        await api.addEducation(editingEducation);
      }
      setEditingEducation(null);
      await refreshPortfolio();
      showFeedback("Education updated!");
    }}
    className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950"
  >
                      Save Entry
                    </button>
                  </div>
                </div>
              </div>}
          </div>}

        {
    /* 4. SKILLS TAB */
  }
        {activeTab === "skills" && <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Skills Manager</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Manage skill tags, categories, and proficiency tiers
                </p>
              </div>
              <button
    onClick={() => setEditingSkill({ name: "", category: "Frontend", proficiencyLevel: "Advanced", order: skills.length + 1 })}
    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
  >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((sk) => <div key={sk._id} className="p-3.5 rounded-xl bg-[#0a0e1b] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{sk.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{sk.category} · {sk.proficiencyLevel}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
    onClick={() => setEditingSkill(sk)}
    className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white"
  >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
    onClick={async () => {
      await api.deleteSkill(sk._id);
      await refreshPortfolio();
      showFeedback("Skill deleted");
    }}
    className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400"
  >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>)}
            </div>

            {
    /* Skill Edit Modal */
  }
            {editingSkill && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-md p-6 rounded-3xl bg-[#0c101d] border border-cyan-500/30 space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    {editingSkill._id ? "Edit Skill" : "Add New Skill"}
                  </h3>
                  <div className="space-y-3">
                    <input
    type="text"
    placeholder="Skill Name (e.g. React)"
    value={editingSkill.name || ""}
    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <select
    value={editingSkill.category || "Frontend"}
    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-[#0a0e1b] border border-white/[0.08] text-sm text-white"
  >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Programming">Programming</option>
                      <option value="Tools">Tools</option>
                      <option value="Design">Design</option>
                    </select>
                    <select
    value={editingSkill.proficiencyLevel || "Advanced"}
    onChange={(e) => setEditingSkill({ ...editingSkill, proficiencyLevel: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-[#0a0e1b] border border-white/[0.08] text-sm text-white"
  >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button
    onClick={() => setEditingSkill(null)}
    className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs text-slate-300"
  >
                      Cancel
                    </button>
                    <button
    onClick={async () => {
      if (editingSkill._id) {
        await api.updateSkill(editingSkill._id, editingSkill);
      } else {
        await api.addSkill(editingSkill);
      }
      setEditingSkill(null);
      await refreshPortfolio();
      showFeedback("Skill saved!");
    }}
    className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950"
  >
                      Save Skill
                    </button>
                  </div>
                </div>
              </div>}
          </div>}

        {
    /* 5. PROJECTS TAB */
  }
        {activeTab === "projects" && <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Project Management</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Full CRUD for public projects, cover images, and live links
                </p>
              </div>
              <button
    onClick={() => setEditingProject({
      name: "",
      shortDescription: "",
      longDescription: "",
      coverImage: "/src/assets/images/project_dermadetect_1791095728960.jpg",
      galleryImages: [],
      techStack: ["React", "Node.js", "MongoDB"],
      githubUrl: "",
      liveUrl: "",
      category: "Full Stack",
      featured: true,
      published: true,
      order: projects.length + 1
    })}
    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
  >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => <div key={proj._id} className="p-5 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08]">
                    <img src={proj.coverImage} alt={proj.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                      <span>{proj.category}</span>
                      <span>{proj.published ? "Published" : "Draft"}</span>
                    </div>
                    <div className="text-lg font-bold text-white mt-1">{proj.name}</div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.shortDescription}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <div className="flex gap-1">
                      {proj.techStack.slice(0, 3).map((t, idx) => <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300">
                          {t}
                        </span>)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
    onClick={() => setEditingProject(proj)}
    className="p-2 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white"
  >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
    onClick={async () => {
      await api.deleteProject(proj._id);
      await refreshPortfolio();
      showFeedback("Project deleted");
    }}
    className="p-2 rounded-lg bg-rose-950/30 text-rose-400"
  >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>

            {
    /* Project Edit Modal */
  }
            {editingProject && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-[#0c101d] border border-cyan-500/30 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    {editingProject._id ? "Edit Project" : "New Project"}
                  </h3>
                  <div className="space-y-3">
                    <input
    type="text"
    placeholder="Project Name"
    value={editingProject.name || ""}
    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <input
    type="text"
    placeholder="Short Description"
    value={editingProject.shortDescription || ""}
    onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <textarea
    placeholder="Long Description / Case Study"
    rows={4}
    value={editingProject.longDescription || ""}
    onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white resize-none"
  />

                    {
    /* Cover image upload */
  }
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">Cover Image</label>
                      <div className="flex gap-2">
                        <input
    type="text"
    value={editingProject.coverImage || ""}
    onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white"
  />
                        <input
    type="file"
    id="proj-cover-upload"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file, (url) => setEditingProject({ ...editingProject, coverImage: url }));
      }
    }}
  />
                        <label
    htmlFor="proj-cover-upload"
    className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] cursor-pointer flex items-center gap-1"
  >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                        </label>
                      </div>
                    </div>

                    <input
    type="text"
    placeholder="Tech Stack (Comma-separated: React, Python, MongoDB)"
    value={(editingProject.techStack || []).join(", ")}
    onChange={(e) => setEditingProject({
      ...editingProject,
      techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
    })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <div className="grid grid-cols-2 gap-3">
                      <input
    type="text"
    placeholder="GitHub URL"
    value={editingProject.githubUrl || ""}
    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                      <input
    type="text"
    placeholder="Live Demo URL"
    value={editingProject.liveUrl || ""}
    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button
    onClick={() => setEditingProject(null)}
    className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs text-slate-300"
  >
                      Cancel
                    </button>
                    <button
    onClick={async () => {
      if (editingProject._id) {
        await api.updateProject(editingProject._id, editingProject);
      } else {
        await api.addProject(editingProject);
      }
      setEditingProject(null);
      await refreshPortfolio();
      showFeedback("Project saved!");
    }}
    className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950"
  >
                      Save Project
                    </button>
                  </div>
                </div>
              </div>}
          </div>}

        {
    /* 6. THUMBNAILS TAB */
  }
        {activeTab === "thumbnails" && <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Thumbnail Portfolio</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Upload high-retention thumbnail art, configure clients & categories
                </p>
              </div>
              <button
    onClick={() => setEditingThumbnail({
      title: "",
      client: "",
      category: "Technology & AI",
      description: "",
      image: "/src/assets/images/thumbnail_design_showcase_1791095752422.jpg",
      clientUrl: "",
      date: "2026",
      featured: true,
      published: true,
      order: thumbnails.length + 1
    })}
    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
  >
                <Plus className="w-4 h-4" />
                <span>Upload Thumbnail</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {thumbnails.map((thumb) => <div key={thumb._id} className="p-4 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08]">
                    <img src={thumb.image} alt={thumb.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-cyan-400">{thumb.category}</div>
                    <div className="text-sm font-bold text-white truncate mt-0.5">{thumb.title}</div>
                    <div className="text-xs text-slate-400">{thumb.client || "Original Concept"}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-500">Order: {thumb.order}</span>
                    <div className="flex items-center gap-2">
                      <button
    onClick={() => setEditingThumbnail(thumb)}
    className="p-1.5 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white"
  >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
    onClick={async () => {
      await api.deleteThumbnail(thumb._id);
      await refreshPortfolio();
      showFeedback("Thumbnail deleted");
    }}
    className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400"
  >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>

            {
    /* Thumbnail Edit Modal */
  }
            {editingThumbnail && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0c101d] border border-cyan-500/30 space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    {editingThumbnail._id ? "Edit Thumbnail" : "Add New Thumbnail"}
                  </h3>
                  <div className="space-y-3">
                    <input
    type="text"
    placeholder="Title"
    value={editingThumbnail.title || ""}
    onChange={(e) => setEditingThumbnail({ ...editingThumbnail, title: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <input
    type="text"
    placeholder="Client Name (e.g. Apex Gaming)"
    value={editingThumbnail.client || ""}
    onChange={(e) => setEditingThumbnail({ ...editingThumbnail, client: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                    <input
    type="text"
    placeholder="Category (e.g. Technology & AI, Gaming, Storytelling)"
    value={editingThumbnail.category || ""}
    onChange={(e) => setEditingThumbnail({ ...editingThumbnail, category: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />

                    {
    /* Image Upload */
  }
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Thumbnail Image</label>
                      <div className="flex gap-2">
                        <input
    type="text"
    value={editingThumbnail.image || ""}
    onChange={(e) => setEditingThumbnail({ ...editingThumbnail, image: e.target.value })}
    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white"
  />
                        <input
    type="file"
    id="thumb-file-upload"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file, (url) => setEditingThumbnail({ ...editingThumbnail, image: url }));
      }
    }}
  />
                        <label
    htmlFor="thumb-file-upload"
    className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] cursor-pointer flex items-center gap-1"
  >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                        </label>
                      </div>
                    </div>

                    <textarea
    placeholder="Description & Creative Notes"
    rows={3}
    value={editingThumbnail.description || ""}
    onChange={(e) => setEditingThumbnail({ ...editingThumbnail, description: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white resize-none"
  />
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button
    onClick={() => setEditingThumbnail(null)}
    className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs text-slate-300"
  >
                      Cancel
                    </button>
                    <button
    onClick={async () => {
      if (editingThumbnail._id) {
        await api.updateThumbnail(editingThumbnail._id, editingThumbnail);
      } else {
        await api.addThumbnail(editingThumbnail);
      }
      setEditingThumbnail(null);
      await refreshPortfolio();
      showFeedback("Thumbnail saved!");
    }}
    className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950"
  >
                      Save Thumbnail
                    </button>
                  </div>
                </div>
              </div>}
          </div>}

        {
    /* 7. MESSAGES TAB */
  }
        {activeTab === "messages" && <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Inbound Messages</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Direct inquiries submitted through the contact section
              </p>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? <div className="p-8 text-center text-slate-500 font-mono text-sm rounded-2xl bg-[#0a0e1b] border border-white/[0.06]">
                  No messages received yet.
                </div> : messages.map((msg) => <div
    key={msg._id}
    className={`p-5 rounded-2xl border transition-all ${msg.read ? "bg-[#090c17]/60 border-white/[0.06]" : "bg-[#0d1424] border-cyan-500/40 shadow-lg shadow-cyan-500/5"}`}
  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{msg.name}</span>
                          <span className="text-xs font-mono text-cyan-400">({msg.email})</span>
                          {!msg.read && <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                              NEW
                            </span>}
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{msg.message}</p>
                        <div className="text-[10px] font-mono text-slate-500 mt-2">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
    onClick={async () => {
      await api.markMessageRead(msg._id, !msg.read);
      const updated = await api.getMessages();
      setMessages(updated);
      showFeedback("Status updated");
    }}
    className="p-2 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white"
    title={msg.read ? "Mark as Unread" : "Mark as Read"}
  >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
    onClick={async () => {
      await api.deleteMessage(msg._id);
      const updated = await api.getMessages();
      setMessages(updated);
      showFeedback("Message deleted");
    }}
    className="p-2 rounded-lg bg-rose-950/30 text-rose-400"
    title="Delete Message"
  >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>)}
            </div>
          </div>}

        {
    /* 8. MEDIA LIBRARY */
  }
        {activeTab === "media" && <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Media Library</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Upload images, copy URLs, and manage storage assets
                </p>
              </div>
              <div>
                <input
    type="file"
    id="direct-media-upload"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file, () => {
        });
      }
    }}
  />
                <label
    htmlFor="direct-media-upload"
    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
  >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((item) => <div key={item._id} className="p-3 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-white/[0.06]">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs text-white truncate font-medium">{item.name}</div>
                  <div className="flex items-center justify-between pt-1">
                    <button
    onClick={() => {
      navigator.clipboard.writeText(item.url);
      showFeedback("URL copied to clipboard!");
    }}
    className="p-1.5 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
  >
                      <Copy className="w-3 h-3 text-cyan-400" />
                      <span>Copy</span>
                    </button>
                    <button
    onClick={async () => {
      await api.deleteMedia(item._id);
      api.getMedia().then(setMediaList);
      showFeedback("Media removed");
    }}
    className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400"
  >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>)}
            </div>
          </div>}

        {
    /* 9. 3D SETTINGS TAB */
  }
        {activeTab === "3d" && <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">3D Visual Engine Settings</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Calibrate Three.js particle densities, camera physics, and tilt intensity
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="text-sm font-semibold text-white">Enable 3D Hero Particles</div>
                  <div className="text-xs text-slate-400">Three.js WebGL canvas background</div>
                </div>
                <input
    type="checkbox"
    checked={threeForm.hero3dEnabled}
    onChange={(e) => setThreeForm({ ...threeForm, hero3dEnabled: e.target.checked })}
    className="w-5 h-5 accent-cyan-500 rounded"
  />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Particle Density</span>
                  <span className="text-cyan-400">{threeForm.particleDensity}</span>
                </div>
                <input
    type="range"
    min="20"
    max="120"
    value={threeForm.particleDensity}
    onChange={(e) => setThreeForm({ ...threeForm, particleDensity: Number(e.target.value) })}
    className="w-full accent-cyan-500"
  />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Animation Velocity Intensity</span>
                  <span className="text-cyan-400">{threeForm.animationIntensity.toFixed(1)}x</span>
                </div>
                <input
    type="range"
    min="0.2"
    max="2.0"
    step="0.1"
    value={threeForm.animationIntensity}
    onChange={(e) => setThreeForm({ ...threeForm, animationIntensity: Number(e.target.value) })}
    className="w-full accent-cyan-500"
  />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">3D ID Card Tilt Sensitivity</span>
                  <span className="text-cyan-400">{threeForm.cardTiltIntensity.toFixed(1)}x</span>
                </div>
                <input
    type="range"
    min="0.2"
    max="2.0"
    step="0.1"
    value={threeForm.cardTiltIntensity}
    onChange={(e) => setThreeForm({ ...threeForm, cardTiltIntensity: Number(e.target.value) })}
    className="w-full accent-cyan-500"
  />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-sm font-semibold text-white">Custom Cursor Effects</div>
                  <div className="text-xs text-slate-400">Contextual glow and action rings on desktop</div>
                </div>
                <input
    type="checkbox"
    checked={threeForm.cursorEffects}
    onChange={(e) => setThreeForm({ ...threeForm, cursorEffects: e.target.checked })}
    className="w-5 h-5 accent-cyan-500 rounded"
  />
              </div>

              <button
    onClick={handleSave3DSettings}
    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
  >
                Apply 3D Settings
              </button>
            </div>
          </div>}

        {
    /* 10. SITE SETTINGS TAB */
  }
        {activeTab === "settings" && <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Site Configuration</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Global titles, meta descriptions, and footer parameters
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Site Title</label>
                <input
    type="text"
    value={siteForm.siteTitle}
    onChange={(e) => setSiteForm({ ...siteForm, siteTitle: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Meta Description</label>
                <input
    type="text"
    value={siteForm.metaDescription}
    onChange={(e) => setSiteForm({ ...siteForm, metaDescription: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Hero Heading</label>
                  <input
    type="text"
    value={siteForm.heroHeading}
    onChange={(e) => setSiteForm({ ...siteForm, heroHeading: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Hero Subtitle</label>
                  <input
    type="text"
    value={siteForm.heroSubtitle}
    onChange={(e) => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Footer Text</label>
                <input
    type="text"
    value={siteForm.footerText}
    onChange={(e) => setSiteForm({ ...siteForm, footerText: e.target.value })}
    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white"
  />
              </div>

              <button
    onClick={handleSaveSiteSettings}
    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
  >
                Save Site Settings
              </button>
            </div>
          </div>}
      </main>
    </div>;
}
