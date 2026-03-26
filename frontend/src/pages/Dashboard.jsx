import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap, Users, MessageCircle, TrendingUp, Sparkles, ChevronRight,
  Bell, LogOut, Search, Compass, Star, ArrowUpRight,
  Flame, Target, Award, LayoutDashboard, UserCircle,
  X, Check, Activity
} from "lucide-react";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";
import { useReadReceiptsStore } from "../store/readReceiptsStore";

// ── helpers ────────────────────────────────────────────────────────────────
const getAvatar = (user) => {
  if (!user) return null;
  if (user.avatar) {
    return user.avatar.startsWith("http")
      ? user.avatar
      : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000"}/storage/${user.avatar}`;
  }
  return null;
};

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ user, size = 40, ring = false }) {
  const src = getAvatar(user);
  const name = user?.name || "?";
  const colors = [
    "from-yellow-400 to-amber-500",
    "from-orange-400 to-yellow-500",
    "from-amber-400 to-yellow-400",
    "from-yellow-500 to-orange-400",
  ];
  const color = colors[(name.charCodeAt(0) || 0) % colors.length];

  return (
    <div
      style={{ width: size, height: size, flexShrink: 0 }}
      className={`rounded-full overflow-hidden ${ring ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-white" : ""}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-black`}
          style={{ fontSize: size * 0.35 }}
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, iconBg, accent }) {
  return (
    <div style={{ fontFamily: "poppins" }} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${iconBg} mb-4`}>
        <Icon size={18} className={accent} />
      </div>
      <div className="text-xl font-semibold text-gray-900 mb-0.5">{value}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
      {sub && <div className="text-xs text-yellow-600 mt-1 font-medium">{sub}</div>}
    </div>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">{children}</h2>
      {action}
    </div>
  );
}

// ── Match Row ──────────────────────────────────────────────────────────────
function MatchRow({ match, currentUser }) {
  const isStartup = currentUser?.role === "startup";
  const other = isStartup ? match.talent : match.startup;
  const profile = isStartup ? match.talent?.talentProfile : match.startup?.startupProfile;
  const subtitle = profile?.role_title || profile?.tagline || profile?.company_name || "FindPart member";
  const tags = profile?.skills?.slice(0, 2) || profile?.needs?.slice(0, 2) || [];

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-yellow-300 hover:shadow-sm group transition-all duration-200 cursor-pointer">
      <div className="relative">
        <Avatar user={other} size={46} ring />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm truncate">{other?.name || "Unknown"}</span>
          {match.status === "matched" && (
            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">MATCHED</span>
          )}
        </div>
        <div className="text-xs text-gray-400 truncate">{subtitle}</div>
        {tags.length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-xs text-gray-300">{timeAgo(match.matched_at)}</span>
        <Link
          to="/matches"
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700"
        >
          View <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// ── Conversation Row ──────────────────────────────────────────────────────
function ConvoRow({ convo, currentUser }) {
  const lastMsg = convo.messages?.[convo.messages.length - 1];
  const other = convo.participants?.find?.((p) => p.id !== convo.current_user_id) || null;

  const { readTimestamps } = useReadReceiptsStore();
  const lastRead = readTimestamps[convo.match_id];
  
  const isUnread = lastMsg 
    && lastMsg.sender_id !== currentUser?.id
    && (!lastRead || new Date(lastMsg.created_at) > new Date(lastRead));

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
      <Avatar user={other || { name: "Chat" }} size={38} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate flex items-center gap-2">
          {other?.name || `Conversation #${convo.id}`}
        </div>
        {lastMsg && (
          <div className={`text-xs truncate ${isUnread ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
            {lastMsg.message || lastMsg.body || lastMsg.content}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {lastMsg && (
          <span className={`text-[10px] ${isUnread ? 'text-yellow-600 font-bold tracking-wide' : 'text-gray-300'}`}>
            {timeAgo(lastMsg.created_at)}
          </span>
        )}
        {isUnread && (
          <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-sm" />
        )}
      </div>
    </div>
  );
}

// ── Profile Completion ──────────────────────────────────────────────────────
function ProfileStrength({ profile, role }) {
  const isStartup = role === "startup";
  const sp = profile?.startupProfile;
  const tp = profile?.talentProfile;

  const checks = isStartup
    ? [
        { label: "Company Name", done: !!sp?.company_name },
        { label: "Tagline", done: !!sp?.tagline },
        { label: "Description", done: !!sp?.pitch_description },
        { label: "Industry", done: !!sp?.industry },
        { label: "Needs listed", done: sp?.needs?.length > 0 },
        { label: "Avatar", done: !!profile?.avatar },
      ]
    : [
        { label: "Bio", done: !!tp?.bio },
        { label: "Role title", done: !!tp?.role_title },
        { label: "Skills listed", done: tp?.skills?.length > 0 },
        { label: "Experience", done: !!tp?.experience_years },
        { label: "Availability", done: !!tp?.availability },
        { label: "Avatar", done: !!profile?.avatar },
      ];

  const done = checks.filter((c) => c.done).length;
  const pct = Math.round((done / checks.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-700">Profile Strength</span>
        <span className={`text-sm font-black ${pct >= 80 ? "text-green-500" : pct >= 50 ? "text-yellow-500" : "text-red-400"}`}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? "bg-green-400" : pct >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="space-y-1.5">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${c.done ? "bg-green-100" : "bg-gray-100"}`}>
              {c.done ? <Check size={9} className="text-green-500" /> : <X size={9} className="text-gray-300" />}
            </div>
            <span className={c.done ? "text-gray-500" : "text-gray-300"}>{c.label}</span>
          </div>
        ))}
      </div>
      {pct < 100 && (
        <Link to="/profile" className="mt-4 w-full block text-center text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
          Complete profile →
        </Link>
      )}
    </div>
  );
}

// ── Activity Bar ────────────────────────────────────────────────────────────
function ActivityBar({ values = [] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm ${i === values.length - 1 ? "bg-yellow-400" : "bg-yellow-100"}`}
          style={{ height: `${Math.max((v / max) * 100, 8)}%` }}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { logoutMutation } = useAuth();

  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [meRes, matchRes] = await Promise.all([
        api.get("/me"),
        api.get("/matches"),
      ]);
      setProfile(meRes.data);
      const matchList = matchRes.data?.data || matchRes.data || [];
      const arr = Array.isArray(matchList) ? matchList : [];
      setMatches(arr);
      const convos = arr
        .filter((m) => m.conversation)
        .map((m) => ({
          ...m.conversation,
          participants: [m.startup, m.talent].filter(Boolean),
        }));
      setConversations(convos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await logoutMutation.mutateAsync(); } catch {}
    navigate("/login");
  };

  const currentUser = profile || user;
  const isStartup = currentUser?.role === "startup";

  const filteredMatches = matches.filter((m) => {
    if (!search) return true;
    const other = isStartup ? m.talent : m.startup;
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  const activityData = (() => {
    const counts = Array(7).fill(0);
    matches.forEach((m) => {
      if (!m.matched_at) return;
      const day = Math.min(6, Math.floor((Date.now() - new Date(m.matched_at)) / 86400000));
      if (day >= 0 && day < 7) counts[6 - day]++;
    });
    return counts;
  })();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard", active: true },
    { icon: Compass, label: "Discover", to: "/swipe" },
    { icon: Flame, label: "Matches", to: "/matches" },
    { icon: MessageCircle, label: "Messages", to: "/matches" },
    { icon: UserCircle, label: "Profile", to: "/profile" },
  ];

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
              <div className="w-8 h-8 border-2 border-yellow-300 border-t-yellow-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="p-6 max-w-7xl mx-auto space-y-6">

              {/* ── Hero Banner ── */}
              <div className="relative overflow-hidden rounded-3xl bg-yellow-400 p-8">
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-yellow-300/40" />
                <div className="absolute top-4 right-16 w-24 h-24 rounded-full bg-yellow-300/30" />
                <div className="absolute -bottom-4 right-32 w-32 h-32 rounded-full bg-black/5" />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-yellow-800/60" />
                      <span className="text-xs font-bold text-yellow-800/60 uppercase tracking-widest">
                        {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
                      </span>
                    </div>
                    <h1 style={{ fontFamily: "inter" }} className="text-3xl font-semibold text-black mb-1">
                      Hey, {currentUser?.name?.split(" ")[0] || "there"}
                    </h1>
                    <p className="text-black/60 text-sm max-w-sm">
                      {isStartup
                        ? "Your startup is live. Keep discovering amazing talent."
                        : "Ready to find your next opportunity? Let's go."}
                    </p>
                    <div className="flex gap-3 mt-5">
                      <Link
                        to="/swipe"
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors"
                      >
                        <Compass size={14} /> Start Swiping
                      </Link>
                      <Link
                        to="/matches"
                        className="flex items-center gap-2 bg-white/40 text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/60 transition-colors"
                      >
                        <Flame size={14} /> My Matches
                      </Link>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-center gap-3">
                    <div className="flex -space-x-3">
                      {matches.slice(0, 4).map((m, i) => {
                        const other = isStartup ? m.talent : m.startup;
                        return (
                          <div key={i} className="ring-2 ring-white rounded-full">
                            <Avatar user={other} size={44} />
                          </div>
                        );
                      })}
                      {matches.length > 4 && (
                        <div className="w-11 h-11 rounded-full bg-black/20 ring-2 ring-white flex items-center justify-center text-black text-xs font-bold">
                          +{matches.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-black/60 font-semibold">
                      {matches.length} total match{matches.length !== 1 ? "es" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Stats ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Flame} label="Total Matches" value={matches.length}
                  sub={matches.length > 0 ? "Keep it up!" : "Start swiping"}
                  iconBg="bg-yellow-100" accent="text-yellow-500" />
                <StatCard icon={MessageCircle} label="Conversations" value={conversations.length}
                  sub={conversations.length > 0 ? "Active chats" : "Chat your matches"}
                  iconBg="bg-blue-50" accent="text-blue-400" />
                <StatCard icon={Target} label="Profile Status"
                  value={currentUser?.startupProfile || currentUser?.talentProfile ? "Live" : "Setup"}
                  sub={currentUser?.startupProfile || currentUser?.talentProfile ? "Visible to others" : "Complete profile"}
                  iconBg="bg-green-50" accent="text-green-500" />
                <StatCard icon={TrendingUp} label="This Week"
                  value={matches.filter(m => m.matched_at && (Date.now() - new Date(m.matched_at)) < 7 * 86400000).length}
                  sub="New matches"
                  iconBg="bg-purple-50" accent="text-purple-400" />
              </div>

              {/* ── Main Grid ── */}
              <div className="grid lg:grid-cols-3 gap-6">

                {/* ── MATCHES LIST ── */}
                <div className="lg:col-span-2 space-y-4">
                  <SectionHeader action={
                    <Link to="/matches" className="flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                      See all <ArrowUpRight size={12} />
                    </Link>
                  }>
                    Recent Matches
                  </SectionHeader>

                  {filteredMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white border border-dashed border-gray-200 gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center">
                        <Flame size={24} className="text-yellow-400" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-400">No matches yet</div>
                        <div className="text-xs text-gray-300 mt-1">Start swiping to find your match</div>
                      </div>
                      <Link
                        to="/swipe"
                        className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-yellow-500 transition-colors"
                      >
                        <Compass size={14} /> Discover People
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredMatches.slice(0, 6).map((match, i) => (
                        <MatchRow key={match.id || i} match={match} currentUser={currentUser} />
                      ))}
                    </div>
                  )}

                  {/* Activity sparkline */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm font-bold text-gray-700">Match Activity</div>
                        <div className="text-xs text-gray-400">Last 7 days</div>
                      </div>
                      <Activity size={16} className="text-yellow-400" />
                    </div>
                    <ActivityBar values={activityData} />
                    <div className="flex justify-between mt-2">
                      {["M","T","W","T","F","S","S"].map((d, i) => (
                        <span key={i} className="text-[10px] text-gray-300 flex-1 text-center">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="space-y-5">
                  {/* Conversations */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <SectionHeader action={
                      <Link to="/matches" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                        Open
                      </Link>
                    }>
                      Messages
                    </SectionHeader>
                    {conversations.length === 0 ? (
                      <div className="text-center py-6">
                        <MessageCircle size={24} className="mx-auto text-gray-200 mb-2" />
                        <div className="text-xs text-gray-300">No messages yet</div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {conversations.slice(0, 4).map((c, i) => (
                          <ConvoRow key={c.id || i} convo={c} currentUser={currentUser} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Profile Strength */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <ProfileStrength profile={currentUser} role={currentUser?.role} />
                  </div>

          

                  {/* Role badge */}
                  <div className={`p-5 rounded-2xl border ${isStartup ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-100"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isStartup ? "bg-amber-100" : "bg-blue-100"}`}>
                        {isStartup ? <Award size={18} className="text-amber-500" /> : <Users size={18} className="text-blue-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 capitalize">{currentUser?.role || "Member"}</div>
                        <div className="text-xs text-gray-400">
                          {isStartup ? "Looking for talent" : "Open to opportunities"}
                        </div>
                      </div>
                    </div>
                    {isStartup && currentUser?.startupProfile && (
                      <div className="mt-3 pt-3 border-t border-amber-200/60">
                        <div className="text-xs font-bold text-gray-600 mb-1">{currentUser.startupProfile.company_name}</div>
                        <div className="text-xs text-gray-400 line-clamp-2">{currentUser.startupProfile.tagline}</div>
                      </div>
                    )}
                    {!isStartup && currentUser?.talentProfile && (
                      <div className="mt-3 pt-3 border-t border-blue-100">
                        <div className="text-xs font-bold text-gray-600 mb-1">{currentUser.talentProfile.role_title}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentUser.talentProfile.skills?.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-[10px] bg-blue-100 text-blue-500 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}