import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectAuthUser } from "src/store/slices/auth/selectors";
import { clearSession } from "src/store/slices/auth";
import { signOut } from "src/api/auth";
import { images } from "../assets/images";
import { 
  LayoutDashboard, 
  Car, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Bell,
  Search,
  ChevronDown,
  Globe,
  Shield,
  MapPin,
  MessageSquare
} from "lucide-react";
import type { AuthUser } from "src/store/slices/auth/types";
import { MaseerLogo } from "./MaseerLogo";

export function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const adminUser = useAppSelector(selectAuthUser) as AuthUser | "";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/fleet", label: "Fleet", icon: Car },
    { to: "/admin/services", label: "Service Coverage", icon: MapPin },
    { to: "/admin/reviews", label: "Customer Reviews", icon: MessageSquare },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // Ignore API failure
    }
    dispatch(clearSession());
    navigate("/admin/login");
  };

  const getPageTitle = () => {
    const activeItem = menuItems.find((item) => item.to === location.pathname);
    return activeItem ? activeItem.label : "Admin Panel";
  };

  const mockNotifications = [
    {
      id: 1,
      title: "New Booking Request",
      description: "Booking #1042 received from Sarah Jenkins.",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Driver Online",
      description: "Chauffeur David Miller is now active.",
      time: "20m ago",
      unread: true,
    },
    {
      id: 3,
      title: "Fleet Service Alert",
      description: "Mercedes S-Class (TX-904) due for service.",
      time: "2h ago",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F4] lg:flex">
      {/* ── Desktop Sidebar ──────────────────────────────────────── */}
      <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col justify-between border-r border-[#1a3822] bg-[#062111] px-6 text-white lg:flex">
        <div className="flex flex-col gap-4">
          {/* Logo & Badge */}
          <div className="flex items-center gap-3">
           <MaseerLogo />
            <span
              className="rounded-full px-2.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-[0.12em] text-maseer-gold"
              style={{
                background: "rgba(249,187,0,0.12)",
                border: "1px solid rgba(249,187,0,0.25)",
              }}
            >
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3.5 rounded-xl px-4 py-3 font-lato text-[14px] font-semibold transition-all duration-150",
                      isActive
                        ? "bg-[#0b331b] text-maseer-gold border-l-4 border-maseer-gold pl-3"
                        : "text-white/70 hover:bg-[#082a16] hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer/Logout */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
          {adminUser && typeof adminUser === "object" && (
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-maseer-gold text-maseer-green-text font-serif font-bold text-sm">
                {adminUser.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-lato text-[13px] font-bold text-white">
                  {adminUser.full_name}
                </p>
                <p className="truncate font-lato text-[11px] text-white/50">
                  {adminUser.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 font-lato text-[14px] font-semibold text-red-400 transition hover:bg-[#2c1212] hover:text-red-300"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#1a3822] bg-[#062111] px-6 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <img
            src={images.logo}
            alt="Maseer"
            className="h-[32px] w-auto object-contain brightness-0 invert"
          />
          <span
            className="rounded-full px-2 py-0.5 font-lato text-[8px] font-bold uppercase tracking-[0.1em] text-maseer-gold"
            style={{
              background: "rgba(249,187,0,0.12)",
              border: "1px solid rgba(249,187,0,0.25)",
            }}
          >
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick website link for mobile */}
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b331b] text-maseer-gold hover:bg-[#0c4021] transition"
            aria-label="View Website"
          >
            <Globe className="h-4 w-4" />
          </Link>
          
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-1.5 hover:bg-[#0b331b] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* ── Mobile Sidebar Slide-Over ────────────────────────────── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative flex w-[280px] max-w-xs flex-1 flex-col justify-between bg-[#062111] p-6 text-white">
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[#0b331b] transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img
                  src={images.logo}
                  alt="Maseer"
                  className="h-[36px] w-auto object-contain brightness-0 invert"
                />
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3.5 rounded-xl px-4 py-3 font-lato text-[14px] font-semibold transition-all duration-150",
                          isActive
                            ? "bg-[#0b331b] text-maseer-gold border-l-4 border-maseer-gold pl-3"
                            : "text-white/70 hover:bg-[#082a16] hover:text-white",
                        ].join(" ")
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Footer/Logout */}
            <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
              {adminUser && typeof adminUser === "object" && (
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-maseer-gold text-maseer-green-text font-serif font-bold text-sm">
                    {adminUser.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-lato text-[13px] font-bold text-white">
                      {adminUser.full_name}
                    </p>
                    <p className="truncate font-lato text-[11px] text-white/50">
                      {adminUser.email}
                    </p>
                  </div>
                </div>
              )}

              <Link
                to="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 font-lato text-[14px] font-semibold text-maseer-gold transition hover:bg-[#082a16] hover:text-white"
              >
                <span className="flex h-5 w-5 items-center justify-center font-bold">🌐</span>
                <span>View Website</span>
              </Link>

              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  handleSignOut();
                }}
                className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 font-lato text-[14px] font-semibold text-red-400 transition hover:bg-[#2c1212] hover:text-red-300"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Sign out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content Container ───────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top bar for desktop */}
        <header className="sticky top-0 z-20 hidden h-[68px] items-center justify-between border-b border-[#E5E7EB] bg-white px-8 shadow-sm lg:flex">
          {/* Left: Breadcrumbs & Search */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 font-lato text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-maseer-surface-card text-maseer-green">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-semibold text-maseer-green">Admin</span>
              <ChevronRight className="h-3.5 w-3.5 text-maseer-muted/60" />
              <span className="font-medium text-[#1a2e1f]">{getPageTitle()}</span>
            </div>

            {/* Interactive Mock Search */}
            <div className="relative hidden xl:block w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maseer-muted" />
              <input
                type="text"
                placeholder="Search bookings, fleet..."
                className="w-full rounded-xl border border-maseer-line bg-[#F8FAF8] py-1.5 pl-9 pr-10 font-lato text-[13px] text-maseer-green-text placeholder-maseer-muted outline-none transition focus:border-maseer-gold focus:bg-white focus:ring-1 focus:ring-maseer-gold"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-maseer-line bg-white px-1.5 py-0.5 font-lato text-[9px] font-bold text-maseer-muted shadow-sm select-none">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right: Actions, Notifications, Profile Dropdown */}
          <div className="flex items-center gap-5">
            {/* View Website */}
            <Link
              to="/"
              className="group flex items-center gap-2 rounded-full border border-maseer-green/20 bg-transparent px-4 py-1.5 font-lato text-[11px] font-bold uppercase tracking-[0.05em] text-maseer-green transition hover:border-maseer-green hover:bg-maseer-green hover:text-white"
            >
              <Globe className="h-3.5 w-3.5 text-maseer-green transition group-hover:text-white" />
              <span>View Website</span>
            </Link>

            {/* Divider */}
            <div className="h-4 w-[1px] bg-gray-200" />

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-maseer-surface-card ${
                  notificationsOpen ? 'border-maseer-gold bg-maseer-surface-card text-maseer-gold' : 'border-[#E5E7EB] bg-white text-[#1a2e1f]'
                }`}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-[320px] origin-top-right rounded-2xl border border-maseer-line bg-white p-4 shadow-card ring-1 ring-black/5 transition-all">
                  <div className="mb-3 flex items-center justify-between border-b border-maseer-line pb-2">
                    <h3 className="font-lato text-sm font-bold text-maseer-green-text">Notifications</h3>
                    <span className="rounded bg-red-50 px-2 py-0.5 font-lato text-[10px] font-semibold text-red-600">2 New</span>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex flex-col gap-0.5 rounded-xl p-2.5 transition hover:bg-maseer-surface-card ${
                          notif.unread ? "bg-maseer-surface-card" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-lato text-[12px] font-bold text-maseer-green-text leading-tight">{notif.title}</p>
                          <span className="shrink-0 font-lato text-[10px] text-maseer-muted">{notif.time}</span>
                        </div>
                        <p className="font-lato text-[11px] text-maseer-muted leading-snug">{notif.description}</p>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 w-full border-t border-maseer-line pt-2 text-center font-lato text-[11px] font-bold text-maseer-gold hover:text-maseer-gold-bright transition">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            {adminUser && typeof adminUser === "object" && (
              <div className="relative flex items-center" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white p-1 pr-3 shadow-sm transition hover:border-maseer-gold hover:bg-[#F8FAF8]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-maseer-gold text-maseer-green-text font-serif font-bold text-xs shadow-inner">
                    {adminUser.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="truncate font-lato text-[12px] font-bold text-maseer-green-text leading-none">
                      {adminUser.full_name}
                    </p>
                    <p className="font-lato text-[9px] font-semibold text-maseer-gold uppercase tracking-[0.05em] mt-0.5 leading-none">
                      Admin
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-[#1a2e1f]/60 transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-[44px] z-50 w-[240px] origin-top-right rounded-2xl border border-maseer-line bg-white p-4 shadow-card ring-1 ring-black/5 transition-all">
                    {/* User Card */}
                    <div className="flex items-center gap-3 border-b border-maseer-line pb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maseer-gold text-maseer-green-text font-serif font-bold text-sm">
                        {adminUser.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-lato text-[13px] font-bold text-maseer-green-text leading-tight">
                          {adminUser.full_name}
                        </p>
                        <p className="truncate font-lato text-[11px] text-maseer-muted leading-tight">
                          {adminUser.email}
                        </p>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex flex-col gap-1 pt-3">
                      <Link
                        to="/"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-lato text-[13px] font-semibold text-maseer-muted transition hover:bg-maseer-surface-card hover:text-maseer-green-text"
                      >
                        <Globe className="h-4 w-4 text-maseer-muted" />
                        <span>View Website</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-lato text-[13px] font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 text-left w-full"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 px-8 py-10 max-md:px-6 max-md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
