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
  AlertCircle,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePortfolio } from "../../context/PortfolioContext.jsx";
import { api } from "../../services/api.js";

const inp =
  "w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white";
const sel =
  "w-full px-3 py-2 rounded-xl bg-[#0a0e1b] border border-white/[0.08] text-sm text-white";
const lbl = "text-xs font-mono text-slate-400";
const btnPrimary =
  "px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer";
const addBtn =
  "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer";

const PROFILE_FIELDS = [
  ["name", "Full Name"],
  ["displayName", "Display Name"],
  ["course", "Course"],
  ["currentYear", "Current Year"],
  ["college", "College / University"],
  ["location", "Current Location"],
  ["email", "Contact Email"],
  ["githubUrl", "GitHub Profile URL"],
  ["linkedinUrl", "LinkedIn Profile URL"],
  ["skillsHighlight", "Card Skills Highlight (Comma separated)"]
];

// Upload se pehle image chhoti kar deta hai (max 1920px) taaki upload fail na ho
function compressImage(file, maxSize = 1920, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith("image/")) {
      reject(new Error("Sirf image file allowed hai (JPG, PNG, WEBP)"));
      return;
    }

    // GIF / SVG ko jaisa hai waisa bhejo
    if (file.type === "image/gif" || file.type === "image/svg+xml") {
      const r = new FileReader();
      r.onload = () => resolve({ data: r.result, type: file.type });
      r.onerror = () => reject(new Error("File read failed"));
      r.readAsDataURL(file);
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      const outType = file.type === "image/png" ? "image/png" : "image/jpeg";

      if (outType === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      resolve({ data: canvas.toDataURL(outType, quality), type: outType });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image read nahi ho payi. JPG ya PNG try karo."));
    };

    img.src = url;
  });
}
// 755px ya usse chhoti screen = mobile
const MOBILE_QUERY = "(max-width: 755px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handler = (e) => setIsMobile(e.matches);

    setIsMobile(mql.matches);

    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
    } else {
      mql.addListener(handler);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handler);
      } else {
        mql.removeListener(handler);
      }
    };
  }, []);

  return isMobile;
}

export function AdminDashboard({ onBackToSite }) {
  const { logout } = useAuth();
  const {
    profile,
    education,
    skills,
    siteSettings,
    threeSettings,
    refreshPortfolio,
    updateSiteSettingsState,
    updateThreeSettingsState
  } = usePortfolio();

  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [messages, setMessages] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [adminProjects, setAdminProjects] = useState([]);
  const [adminThumbs, setAdminThumbs] = useState([]);
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

  // ---------- sidebar (mobile drawer) behaviour ----------

  // Desktop pe aate hi drawer band
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  // Drawer khula ho to piche ka scroll lock + Esc se band
  useEffect(() => {
    if (!(isMobile && sidebarOpen)) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobile, sidebarOpen]);

  const selectTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // ---------- data loaders ----------

  const loadMessages = () =>
    api
      .getMessages()
      .then((res) => setMessages(Array.isArray(res) ? res : res?.messages || []))
      .catch(() => {});

  const loadMedia = () =>
    api
      .getMedia()
      .then((res) => setMediaList(Array.isArray(res) ? res : res?.media || []))
      .catch(() => {});

  const loadAdminLists = () => {
    api
      .getAllProjectsAdmin()
      .then((res) => setAdminProjects(res?.projects || []))
      .catch(() => {});
    api
      .getAllThumbnailsAdmin()
      .then((res) => setAdminThumbs(res?.thumbnails || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadMessages();
    loadMedia();
    loadAdminLists();
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.database) setDbStatus(data.database);
      })
      .catch(() => {});
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
      const { _id, createdAt, updatedAt, ...rest } = threeSettings;
      setThreeForm((prev) => ({ ...prev, ...rest }));
    }
  }, [threeSettings]);

  // ---------- helpers ----------

  const showFeedback = (msg, isError = false) => {
    if (isError) {
      setErrorStatus(msg);
      setTimeout(() => setErrorStatus(null), 4000);
    } else {
      setSaveStatus(msg);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Har action ko safe tarike se chalata hai, error bhi dikhata hai
  const runAction = async (fn, successMsg) => {
    try {
      await fn();
      await refreshPortfolio();
      loadAdminLists();
      showFeedback(successMsg);
      return true;
    } catch (err) {
      showFeedback(err?.message || "Action failed", true);
      return false;
    }
  };
const handleImageUpload = async (file, callback) => {
  try {
    showFeedback("Uploading...");
    const { data, type } = await compressImage(file);
    const res = await api.uploadMedia(file.name, data, type);
    callback(res.item.url);
    loadMedia();
    showFeedback("Image uploaded and applied!");
  } catch (err) {
    showFeedback(err?.message || "Image upload failed", true);
  }
};

  const handleSaveProfile = async () => {
    try {
      await api.updateProfile({
        ...profileForm,
        skillsHighlight: profileForm.skillsHighlight
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      });
      await refreshPortfolio();
      showFeedback("Profile updated successfully!");
    } catch (err) {
      showFeedback(err?.message || "Failed to update profile", true);
    }
  };

  const handleSaveSiteSettings = async () => {
    try {
      const res = await api.updateSiteSettings(siteForm);
      updateSiteSettingsState(res.settings);
      showFeedback("Site settings saved!");
    } catch (err) {
      showFeedback(err?.message || "Failed to save settings", true);
    }
  };

  const handleSave3DSettings = async () => {
    try {
      const { _id, createdAt, updatedAt, ...payload } = threeForm;
      const res = await api.updateThreeSettings(payload);
      updateThreeSettingsState(res.settings);
      showFeedback("3D visual settings applied!");
    } catch (err) {
      showFeedback(err?.message || "Failed to save 3D settings", true);
    }
  };

  const handleSaveEducation = async () => {
    const e = editingEducation;

    if (
      !e.institution?.trim() ||
      !e.level?.trim() ||
      !e.startYear?.trim() ||
      !e.endYear?.trim()
    ) {
      showFeedback("Institution, Level, Start Year aur End Year bharna zaroori hai", true);
      return;
    }

    const ok = await runAction(async () => {
      if (e._id) {
        await api.updateEducation(e._id, e);
      } else {
        await api.addEducation(e);
      }
    }, "Education saved!");

    if (ok) setEditingEducation(null);
  };

  const tabs = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "education", label: "Education / Journey", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Sparkles },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "thumbnails", label: "Thumbnails", icon: ImageIcon },
    {
      id: "messages",
      label: `Messages (${messages.filter((m) => !m.read).length})`,
      icon: MessageSquare
    },
    { id: "media", label: "Media Library", icon: Upload },
    { id: "3d", label: "3D Settings", icon: Sliders },
    { id: "settings", label: "Site Settings", icon: Settings }
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  // ---------- layout classes ----------

  const asideClass = isMobile
    ? `fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-[#080c18] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0 shadow-2xl shadow-black/60" : "-translate-x-full"
      }`
    : "w-64 sticky top-0 h-screen bg-[#080c18] border-r border-white/[0.08] flex flex-col shrink-0";

  const mainClass = isMobile
    ? "flex-1 min-w-0 p-4 pt-20 overflow-y-auto"
    : "flex-1 min-w-0 p-6 md:p-10 overflow-y-auto";

  return (
    <div
      className={`min-h-screen bg-[#060810] text-slate-100 flex ${
        isMobile ? "flex-col" : "flex-row"
      }`}
    >
      {/* ---------- Mobile top bar ---------- */}
      {isMobile && (
        <header className="fixed top-0 inset-x-0 z-40 h-14 px-3 flex items-center justify-between gap-3 bg-[#080c18]/95 backdrop-blur-md border-b border-white/[0.08]">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <div className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase leading-none">
              Admin Console
            </div>
            <div className="text-sm font-bold text-white truncate mt-0.5">
              {currentTab?.label}
            </div>
          </div>

          <button
            onClick={onBackToSite}
            aria-label="View live site"
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white"
            title="View Live Site"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </header>
      )}

      {/* ---------- Mobile overlay ---------- */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---------- Sidebar (desktop: fixed, mobile: drawer) ---------- */}
      <aside className={asideClass}>
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              PORTFOLIO CMS
            </div>
            <div className="text-base font-bold text-white tracking-tight">Admin Console</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToSite}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white"
              title="View Live Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => selectTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 ${
                  isMobile ? "py-3" : "py-2.5"
                } rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
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

      {/* ---------- Main ---------- */}
      <main className={mainClass}>
        {saveStatus && (
          <div className="fixed top-16 md:top-6 right-4 md:right-6 left-4 md:left-auto z-[60] p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 shadow-2xl backdrop-blur-md">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}
        {errorStatus && (
          <div className="fixed top-16 md:top-6 right-4 md:right-6 left-4 md:left-auto z-[60] p-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 shadow-2xl backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        {/* 1. OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 max-w-5xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Platform Overview</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Real-time metrics and portfolio status
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#090d18] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400">Total Projects</div>
                <div className="text-2xl font-bold text-white mt-1">{adminProjects.length}</div>
                <div className="text-[11px] text-cyan-400 mt-1">
                  {adminProjects.filter((p) => p.published).length} Published
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#090d18] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400">Thumbnails</div>
                <div className="text-2xl font-bold text-white mt-1">{adminThumbs.length}</div>
                <div className="text-[11px] text-cyan-400 mt-1">
                  {adminThumbs.filter((t) => t.featured).length} Featured
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
                <div
                  className={`text-base font-bold mt-1.5 ${
                    dbStatus?.connectedToMongo ? "text-emerald-400" : "text-cyan-400"
                  }`}
                >
                  {dbStatus?.storageType || "Checking..."}
                </div>
                <div
                  className="text-[10px] font-mono text-slate-400 mt-1 truncate"
                  title={dbStatus?.hint}
                >
                  {dbStatus?.connectedToMongo ? "Cluster Connected" : "Not connected"}
                </div>
              </div>
            </div>

            {dbStatus && !dbStatus.connectedToMongo && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-slate-300">
                MongoDB connected nahi hai. Atlas ke Network Access mein{" "}
                <code className="px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 font-mono text-[11px]">
                  0.0.0.0/0
                </code>{" "}
                add karo aur <code>MONGODB_URI</code> check karo.
              </div>
            )}

            <div className="p-6 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                QUICK ACTIONS
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => selectTab("projects")}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
                >
                  + Add New Project
                </button>
                <button
                  onClick={() => selectTab("thumbnails")}
                  className="px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold"
                >
                  + Upload Thumbnail
                </button>
                <button
                  onClick={() => selectTab("profile")}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-xs font-semibold"
                >
                  Update Profile Info
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Profile & Identity</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Manage personal brand details, photos, and academic metadata
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-cyan-500/40 shrink-0">
                  {profileForm.photo && (
                    <img
                      src={profileForm.photo}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="space-y-2 min-w-0 flex-1">
                  <label className={lbl}>Profile Photo (3D Card & About)</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (url) =>
                            setProfileForm((p) => ({ ...p, photo: url }))
                          );
                        }
                        e.target.value = "";
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
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 w-full sm:w-64"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Photo upload hone ke baad "Save Profile Changes" zaroor dabao.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROFILE_FIELDS.slice(0, 2).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <label className={lbl}>{label}</label>
                    <input
                      type="text"
                      value={profileForm[key]}
                      onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                      className={inp}
                    />
                  </div>
                ))}

                <div className="space-y-1 md:col-span-2">
                  <label className={lbl}>Tagline</label>
                  <input
                    type="text"
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className={inp}
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className={lbl}>Bio Statement</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className={`${inp} resize-none`}
                  />
                </div>

                {PROFILE_FIELDS.slice(2).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <label className={lbl}>{label}</label>
                    <input
                      type={key === "email" ? "email" : "text"}
                      value={profileForm[key]}
                      onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                      className={inp}
                    />
                  </div>
                ))}
              </div>

              <button onClick={handleSaveProfile} className={btnPrimary}>
                Save Profile Changes
              </button>
            </div>
          </div>
        )}

        {/* 3. EDUCATION */}
        {activeTab === "education" && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Education & Journey</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Configure school 10th/12th and university timeline mappings
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingEducation({
                    institution: "",
                    level: "",
                    field: "",
                    startYear: "",
                    endYear: "",
                    description: "",
                    location: "",
                    order: education.length + 1
                  })
                }
                className={addBtn}
              >
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            </div>

            <div className="space-y-4">
              {education.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-mono text-sm rounded-2xl bg-[#0a0e1b] border border-white/[0.06]">
                  Abhi koi education entry nahi hai.
                </div>
              )}
              {education.map((edu) => (
                <div
                  key={edu._id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-mono text-cyan-400">
                      {edu.level} ({edu.startYear} - {edu.endYear})
                    </div>
                    <div className="text-base font-bold text-white break-words">{edu.institution}</div>
                    {edu.field && <div className="text-xs text-slate-300">{edu.field}</div>}
                    {edu.description && (
                      <p className="text-xs text-slate-400 pt-1 break-words">{edu.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingEducation(edu)}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        runAction(() => api.deleteEducation(edu._id), "Education item removed")
                      }
                      className="p-2 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {editingEducation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-cyan-500/30 space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    {editingEducation._id ? "Edit Education Entry" : "Add Education Entry"}
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Institution (e.g. Kedarnath Uchh Vidyalay)"
                      value={editingEducation.institution || ""}
                      onChange={(e) =>
                        setEditingEducation({ ...editingEducation, institution: e.target.value })
                      }
                      className={inp}
                    />
                    <input
                      type="text"
                      placeholder="Level (e.g. Higher Secondary (12th) or Secondary (10th))"
                      value={editingEducation.level || ""}
                      onChange={(e) =>
                        setEditingEducation({ ...editingEducation, level: e.target.value })
                      }
                      className={inp}
                    />
                    <input
                      type="text"
                      placeholder="Field / Specialization"
                      value={editingEducation.field || ""}
                      onChange={(e) =>
                        setEditingEducation({ ...editingEducation, field: e.target.value })
                      }
                      className={inp}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Start Year"
                        value={editingEducation.startYear || ""}
                        onChange={(e) =>
                          setEditingEducation({ ...editingEducation, startYear: e.target.value })
                        }
                        className={inp}
                      />
                      <input
                        type="text"
                        placeholder="End Year"
                        value={editingEducation.endYear || ""}
                        onChange={(e) =>
                          setEditingEducation({ ...editingEducation, endYear: e.target.value })
                        }
                        className={inp}
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      rows={3}
                      value={editingEducation.description || ""}
                      onChange={(e) =>
                        setEditingEducation({ ...editingEducation, description: e.target.value })
                      }
                      className={`${inp} resize-none`}
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
                      onClick={handleSaveEducation}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950"
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. SKILLS */}
        {activeTab === "skills" && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Skills Manager</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Manage skill tags, categories, and proficiency tiers
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingSkill({
                    name: "",
                    category: "Frontend",
                    proficiencyLevel: "Advanced",
                    order: skills.length + 1
                  })
                }
                className={addBtn}
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((sk) => (
                <div
                  key={sk._id}
                  className="p-3.5 rounded-xl bg-[#0a0e1b] border border-white/[0.08] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{sk.name}</div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      {sk.category} · {sk.proficiencyLevel}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingSkill(sk)}
                      className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => runAction(() => api.deleteSkill(sk._id), "Skill deleted")}
                      className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {editingSkill && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-cyan-500/30 space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    {editingSkill._id ? "Edit Skill" : "Add New Skill"}
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Skill Name (e.g. React)"
                      value={editingSkill.name || ""}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      className={inp}
                    />
                    <select
                      value={editingSkill.category || "Frontend"}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, category: e.target.value })
                      }
                      className={sel}
                    >
                      {["Frontend", "Backend", "Database", "AI/ML", "Programming", "Tools", "Design"].map(
                        (c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        )
                      )}
                    </select>
                    <select
                      value={editingSkill.proficiencyLevel || "Advanced"}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, proficiencyLevel: e.target.value })
                      }
                      className={sel}
                    >
                      {["Beginner", "Intermediate", "Advanced", "Expert"].map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
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
                        if (!editingSkill.name?.trim()) {
                          showFeedback("Skill name bharna zaroori hai", true);
                          return;
                        }
                        const ok = await runAction(async () => {
                          if (editingSkill._id) {
                            await api.updateSkill(editingSkill._id, editingSkill);
                          } else {
                            await api.addSkill(editingSkill);
                          }
                        }, "Skill saved!");
                        if (ok) setEditingSkill(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950"
                    >
                      Save Skill
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Project Management</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Full CRUD for public projects, cover images, and live links
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingProject({
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
                    order: adminProjects.length + 1
                  })
                }
                className={addBtn}
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminProjects.map((proj) => (
                <div
                  key={proj._id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-3"
                >
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08]">
                    <img src={proj.coverImage} alt={proj.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                      <span>{proj.category}</span>
                      <span>{proj.published ? "Published" : "Draft"}</span>
                    </div>
                    <div className="text-lg font-bold text-white mt-1 break-words">{proj.name}</div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.shortDescription}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
                    <div className="flex gap-1 flex-wrap min-w-0">
                      {(proj.techStack || []).slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="p-2 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          runAction(() => api.deleteProject(proj._id), "Project deleted")
                        }
                        className="p-2 rounded-lg bg-rose-950/30 text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {editingProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-8 rounded-3xl bg-[#0c101d] border border-cyan-500/30 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    {editingProject._id ? "Edit Project" : "New Project"}
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={editingProject.name || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                      className={inp}
                    />
                    <input
                      type="text"
                      placeholder="Short Description"
                      value={editingProject.shortDescription || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, shortDescription: e.target.value })
                      }
                      className={inp}
                    />
                    <textarea
                      placeholder="Long Description / Case Study"
                      rows={4}
                      value={editingProject.longDescription || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, longDescription: e.target.value })
                      }
                      className={`${inp} resize-none`}
                    />

                    <div className="space-y-1.5">
                      <label className={lbl}>Cover Image</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProject.coverImage || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, coverImage: e.target.value })
                          }
                          className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white"
                        />
                        <input
                          type="file"
                          id="proj-cover-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (url) =>
                                setEditingProject((p) => ({ ...p, coverImage: url }))
                              );
                            }
                            e.target.value = "";
                          }}
                        />
                        <label
                          htmlFor="proj-cover-upload"
                          className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] cursor-pointer flex items-center gap-1 shrink-0"
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
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          techStack: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        })
                      }
                      className={inp}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="GitHub URL"
                        value={editingProject.githubUrl || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, githubUrl: e.target.value })
                        }
                        className={inp}
                      />
                      <input
                        type="text"
                        placeholder="Live Demo URL"
                        value={editingProject.liveUrl || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, liveUrl: e.target.value })
                        }
                        className={inp}
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingProject.published}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, published: e.target.checked })
                          }
                          className="w-4 h-4 accent-cyan-500"
                        />
                        Published
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingProject.featured}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, featured: e.target.checked })
                          }
                          className="w-4 h-4 accent-cyan-500"
                        />
                        Featured
                      </label>
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
                        const p = editingProject;
                        if (!p.name?.trim() || !p.shortDescription?.trim() || !p.coverImage?.trim()) {
                          showFeedback(
                            "Project name, short description aur cover image zaroori hain",
                            true
                          );
                          return;
                        }
                        const ok = await runAction(async () => {
                          if (p._id) {
                            await api.updateProject(p._id, p);
                          } else {
                            await api.addProject(p);
                          }
                        }, "Project saved!");
                        if (ok) setEditingProject(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. THUMBNAILS */}
        {activeTab === "thumbnails" && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Thumbnail Portfolio</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Upload high-retention thumbnail art, configure clients & categories
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingThumbnail({
                    title: "",
                    client: "",
                    category: "Technology & AI",
                    description: "",
                    image: "/src/assets/images/thumbnail_design_showcase_1791095752422.jpg",
                    clientUrl: "",
                    date: "2026",
                    featured: true,
                    published: true,
                    order: adminThumbs.length + 1
                  })
                }
                className={addBtn}
              >
                <Plus className="w-4 h-4" />
                <span>Upload Thumbnail</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminThumbs.map((thumb) => (
                <div
                  key={thumb._id}
                  className="p-4 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-3"
                >
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08]">
                    <img src={thumb.image} alt={thumb.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-cyan-400">
                      {thumb.category} {thumb.published ? "" : "· Draft"}
                    </div>
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
                        onClick={() =>
                          runAction(() => api.deleteThumbnail(thumb._id), "Thumbnail deleted")
                        }
                        className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {editingThumbnail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-cyan-500/30 space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    {editingThumbnail._id ? "Edit Thumbnail" : "Add New Thumbnail"}
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={editingThumbnail.title || ""}
                      onChange={(e) =>
                        setEditingThumbnail({ ...editingThumbnail, title: e.target.value })
                      }
                      className={inp}
                    />
                    <input
                      type="text"
                      placeholder="Client Name (e.g. Apex Gaming)"
                      value={editingThumbnail.client || ""}
                      onChange={(e) =>
                        setEditingThumbnail({ ...editingThumbnail, client: e.target.value })
                      }
                      className={inp}
                    />
                    <input
                      type="text"
                      placeholder="Category (e.g. Technology & AI, Gaming, Storytelling)"
                      value={editingThumbnail.category || ""}
                      onChange={(e) =>
                        setEditingThumbnail({ ...editingThumbnail, category: e.target.value })
                      }
                      className={inp}
                    />

                    <div className="space-y-1">
                      <label className={lbl}>Thumbnail Image</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingThumbnail.image || ""}
                          onChange={(e) =>
                            setEditingThumbnail({ ...editingThumbnail, image: e.target.value })
                          }
                          className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white"
                        />
                        <input
                          type="file"
                          id="thumb-file-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (url) =>
                                setEditingThumbnail((t) => ({ ...t, image: url }))
                              );
                            }
                            e.target.value = "";
                          }}
                        />
                        <label
                          htmlFor="thumb-file-upload"
                          className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] cursor-pointer flex items-center gap-1 shrink-0"
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
                      onChange={(e) =>
                        setEditingThumbnail({ ...editingThumbnail, description: e.target.value })
                      }
                      className={`${inp} resize-none`}
                    />

                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingThumbnail.published}
                          onChange={(e) =>
                            setEditingThumbnail({ ...editingThumbnail, published: e.target.checked })
                          }
                          className="w-4 h-4 accent-cyan-500"
                        />
                        Published
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingThumbnail.featured}
                          onChange={(e) =>
                            setEditingThumbnail({ ...editingThumbnail, featured: e.target.checked })
                          }
                          className="w-4 h-4 accent-cyan-500"
                        />
                        Featured
                      </label>
                    </div>
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
                        const t = editingThumbnail;
                        if (!t.title?.trim() || !t.image?.trim()) {
                          showFeedback("Title aur image zaroori hain", true);
                          return;
                        }
                        const ok = await runAction(async () => {
                          if (t._id) {
                            await api.updateThumbnail(t._id, t);
                          } else {
                            await api.addThumbnail(t);
                          }
                        }, "Thumbnail saved!");
                        if (ok) setEditingThumbnail(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950"
                    >
                      Save Thumbnail
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Inbound Messages</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Direct inquiries submitted through the contact section
              </p>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-sm rounded-2xl bg-[#0a0e1b] border border-white/[0.06]">
                  No messages received yet.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      msg.read
                        ? "bg-[#090c17]/60 border-white/[0.06]"
                        : "bg-[#0d1424] border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{msg.name}</span>
                          <span className="text-xs font-mono text-cyan-400 break-all">
                            ({msg.email})
                          </span>
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed break-words">
                          {msg.message}
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 mt-2">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={async () => {
                            try {
                              await api.markMessageRead(msg._id, !msg.read);
                              await loadMessages();
                              showFeedback("Status updated");
                            } catch (err) {
                              showFeedback(err?.message || "Failed to update", true);
                            }
                          }}
                          className="p-2 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white"
                          title={msg.read ? "Mark as Unread" : "Mark as Read"}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await api.deleteMessage(msg._id);
                              await loadMessages();
                              showFeedback("Message deleted");
                            } catch (err) {
                              showFeedback(err?.message || "Failed to delete", true);
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-950/30 text-rose-400"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 8. MEDIA LIBRARY */}
        {activeTab === "media" && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
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
                    if (file) handleImageUpload(file, () => {});
                    e.target.value = "";
                  }}
                />
                <label htmlFor="direct-media-upload" className={addBtn}>
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>

            {mediaList.length === 0 && (
              <div className="p-8 text-center text-slate-500 font-mono text-sm rounded-2xl bg-[#0a0e1b] border border-white/[0.06]">
                Abhi koi image upload nahi hui.
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {mediaList.map((item) => (
                <div
                  key={item._id}
                  className="p-3 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-2"
                >
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
                        try {
                          await api.deleteMedia(item._id);
                          await loadMedia();
                          showFeedback("Media removed");
                        } catch (err) {
                          showFeedback(err?.message || "Failed to delete media", true);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. 3D SETTINGS */}
        {activeTab === "3d" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">3D Visual Engine Settings</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Calibrate Three.js particle densities, camera physics, and tilt intensity
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="text-sm font-semibold text-white">Enable 3D Hero Particles</div>
                  <div className="text-xs text-slate-400">Three.js WebGL canvas background</div>
                </div>
                <input
                  type="checkbox"
                  checked={!!threeForm.hero3dEnabled}
                  onChange={(e) => setThreeForm({ ...threeForm, hero3dEnabled: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded shrink-0"
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
                  onChange={(e) =>
                    setThreeForm({ ...threeForm, particleDensity: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Animation Velocity Intensity</span>
                  <span className="text-cyan-400">
                    {Number(threeForm.animationIntensity).toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={threeForm.animationIntensity}
                  onChange={(e) =>
                    setThreeForm({ ...threeForm, animationIntensity: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">3D ID Card Tilt Sensitivity</span>
                  <span className="text-cyan-400">
                    {Number(threeForm.cardTiltIntensity).toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={threeForm.cardTiltIntensity}
                  onChange={(e) =>
                    setThreeForm({ ...threeForm, cardTiltIntensity: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <div>
                  <div className="text-sm font-semibold text-white">Custom Cursor Effects</div>
                  <div className="text-xs text-slate-400">
                    Contextual glow and action rings on desktop
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!!threeForm.cursorEffects}
                  onChange={(e) => setThreeForm({ ...threeForm, cursorEffects: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded shrink-0"
                />
              </div>

              <button onClick={handleSave3DSettings} className={btnPrimary}>
                Apply 3D Settings
              </button>
            </div>
          </div>
        )}

        {/* 10. SITE SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Site Configuration</h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Global titles, meta descriptions, and footer parameters
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0e1b] border border-white/[0.08] space-y-4">
              <div className="space-y-1">
                <label className={lbl}>Site Title</label>
                <input
                  type="text"
                  value={siteForm.siteTitle}
                  onChange={(e) => setSiteForm({ ...siteForm, siteTitle: e.target.value })}
                  className={inp}
                />
              </div>
              <div className="space-y-1">
                <label className={lbl}>Meta Description</label>
                <input
                  type="text"
                  value={siteForm.metaDescription}
                  onChange={(e) => setSiteForm({ ...siteForm, metaDescription: e.target.value })}
                  className={inp}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={lbl}>Hero Heading</label>
                  <input
                    type="text"
                    value={siteForm.heroHeading}
                    onChange={(e) => setSiteForm({ ...siteForm, heroHeading: e.target.value })}
                    className={inp}
                  />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Hero Subtitle</label>
                  <input
                    type="text"
                    value={siteForm.heroSubtitle}
                    onChange={(e) => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })}
                    className={inp}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={lbl}>Footer Text</label>
                <input
                  type="text"
                  value={siteForm.footerText}
                  onChange={(e) => setSiteForm({ ...siteForm, footerText: e.target.value })}
                  className={inp}
                />
              </div>

              <button onClick={handleSaveSiteSettings} className={btnPrimary}>
                Save Site Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}