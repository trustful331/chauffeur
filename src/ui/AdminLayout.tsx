import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectAuthUser } from "src/store/slices/auth/selectors";
import { clearSession } from "src/store/slices/auth";
import { signOut } from "src/api/auth";
import { images } from "../assets/images";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react";
import type { AuthUser } from "src/store/slices/auth/types";

export function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const adminUser = useAppSelector(selectAuthUser) as AuthUser | "";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
    { to: "/admin/drivers", label: "Drivers", icon: Users },
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

  return (
    <div className="min-h-screen bg-[#F4F5F4] lg:flex">
      {/* ── Desktop Sidebar ──────────────────────────────────────── */}
      <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col justify-between border-r border-[#1a3822] bg-[#062111] p-6 text-white lg:flex">
        <div className="flex flex-col gap-8">
          {/* Logo & Badge */}
          <div className="flex items-center gap-3">
            <img
              src={images.logo}
              alt="Maseer"
              className="h-[40px] w-auto object-contain brightness-0 invert"
            />
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
      <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#E5E7EB] bg-[#062111] px-6 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <img
            src={images.logo}
            alt="Maseer"
            className="h-[36px] w-auto object-contain brightness-0 invert"
          />
          <span
            className="rounded-full px-2 py-0.5 font-lato text-[9px] font-bold uppercase tracking-[0.1em] text-maseer-gold"
            style={{
              background: "rgba(249,187,0,0.12)",
              border: "1px solid rgba(249,187,0,0.25)",
            }}
          >
            Admin
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-lg p-1.5 hover:bg-[#0b331b] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
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
          <div className="flex items-center gap-2 font-lato text-sm text-maseer-muted">
            <span className="font-semibold text-maseer-green-text">Admin</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#1a2e1f] font-medium">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="rounded-full border border-maseer-green bg-transparent px-4 py-1.5 font-lato text-[11px] font-bold uppercase tracking-[0.05em] text-maseer-green transition hover:bg-maseer-green hover:text-white"
            >
              View Website
            </Link>
            <div className="h-4 w-[1px] bg-gray-200" />
            {adminUser && typeof adminUser === "object" && (
              <p className="font-lato text-[13px] text-maseer-muted">
                Logged in as:{" "}
                <span className="font-semibold text-maseer-green-text">
                  {adminUser.full_name}
                </span>
              </p>
            )}
            <div className="h-4 w-[1px] bg-gray-200" />
            <button
              onClick={handleSignOut}
              className="font-lato text-[13px] font-semibold text-red-500 transition hover:text-red-700"
            >
              Sign out
            </button>
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
