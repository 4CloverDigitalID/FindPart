import { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Compass, Flame, MessageCircle,
  UserCircle, Bell, LogOut, Search, X
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

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

// Hook untuk deteksi mobile
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

export default function MainLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { logoutMutation } = useAuth();
  const currentUser = user;

  const isMobile = useIsMobile();

  // Desktop: collapsed/expanded. Mobile: hidden/shown
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Saat resize ke mobile, otomatis tutup sidebar
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    api.get("/matches").then((res) => {
      const data = res.data?.data || res.data || [];
      setMatches(Array.isArray(data) ? data : []);
    });
  }, []);

  const isStartup = currentUser?.role === "startup";

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

  const handleLogout = async () => {
    try { await logoutMutation.mutateAsync(); } catch {}
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
    { icon: Compass, label: "Discover", to: "/swipe" },
    { icon: Flame, label: "Matches", to: "/matches" },
    { icon: MessageCircle, label: "Messages", to: "/matches" },
    { icon: UserCircle, label: "Profile", to: "/profile" },
  ];

  // Sidebar width logic
  const sidebarWidth = isMobile ? 240 : sidebarOpen ? 240 : 72;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">

      {/* OVERLAY — hanya di mobile saat sidebar terbuka */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        style={{
          width: sidebarWidth,
          transition: "width 0.25s ease, transform 0.25s ease",
          // Di mobile: slide in/out dari kiri
          transform: isMobile
            ? sidebarOpen ? "translateX(0)" : "translateX(-100%)"
            : "translateX(0)",
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          height: "100%",
        }}
        className="flex flex-col bg-white border-r border-gray-100 shrink-0 overflow-hidden z-30 shadow-sm"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 gap-3 border-b border-gray-100">
          {(sidebarOpen || !isMobile) && (
            <span
              style={{ fontFamily: "poppins" }}
              className="font-semibold text-lg text-gray-900 whitespace-nowrap overflow-hidden"
            >
              FindPart
            </span>
          )}
          {/* Tombol X untuk tutup sidebar di mobile */}
          {isMobile && sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to + label}
              to={to}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                ${isActive
                  ? "bg-yellow-400 text-black"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"}`
              }
            >
              <Icon size={18} className="shrink-0" />
              {(sidebarOpen || isMobile) && (
                <span className="text-sm font-semibold whitespace-nowrap">
                  {label}
                </span>
              )}
              {/* Icon-only mode di desktop collapsed */}
              {!sidebarOpen && !isMobile && null}
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar user={currentUser} size={32} />
            {(sidebarOpen || isMobile) && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-800 truncate">{currentUser?.name || "User"}</div>
                <div className="text-[10px] text-gray-400 capitalize">{currentUser?.role || "member"}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-red-50 text-black cursor-pointer hover:text-red-400 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN — di mobile tidak perlu margin karena sidebar adalah overlay */}
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{
          marginLeft: isMobile ? 0 : undefined,
        }}
      >

        {/* HEADER */}
        <header className="h-16 flex items-center gap-4 px-6 border-b border-gray-100 bg-white shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <LayoutDashboard size={16} />
          </button>

          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search matches..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Bell size={18} />
                {matches.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-800">Notifications</span>
                  </div>
                  <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                    {matches.slice(0, 5).map((m, i) => {
                      const other = isStartup ? m.talent : m.startup;
                      return (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <Avatar user={other} size={32} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-800 truncate">
                              New match with {other?.name}
                            </div>
                            <div className="text-[10px] text-gray-400">{timeAgo(m.matched_at)}</div>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                        </div>
                      );
                    })}
                    {matches.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-300">No notifications yet</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link to="/profile">
              <Avatar user={currentUser} size={34} ring />
            </Link>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}