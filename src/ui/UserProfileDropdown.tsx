import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown, LogOut, LayoutDashboard, User, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectAuthDisplayName, selectAuthUser } from "src/store/slices/auth/selectors";
import type { AuthUser } from "src/store/slices/auth/types";
import { signOut, getProfile } from "src/api/auth";
import { clearSession } from "src/store/slices/auth";
import { Spinner } from "./Spinner";

export function UserProfileDropdown() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const displayName = useAppSelector(selectAuthDisplayName);
  const authUser = useAppSelector(selectAuthUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((data) => {
        if (isMounted && data.profile_image_url) {
          setAvatarUrl(data.profile_image_url);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      dispatch(clearSession());
    } catch {
      // Local session is cleared even if API logout fails.
    } finally {
      setIsLoggingOut(false);
    }
    navigate("/");
  };

  const currentPhoto =
    avatarUrl ||
    (authUser && typeof authUser === "object"
      ? (authUser as AuthUser).profile_image_url
      : "");
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex items-center gap-1 rounded-full p-0.5 hover:bg-[#FFF9EB] transition-colors focus:outline-none group">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-maseer-green text-white font-serif font-bold text-sm shadow-sm ring-2 ring-maseer-gold/30">
          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt={displayName}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-maseer-muted group-hover:text-maseer-green transition" aria-hidden="true" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="z-50 mt-2 w-56 origin-top-right rounded-xl border border-maseer-line/40 bg-white p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] focus:outline-none [--anchor-gap:8px]"
      >
        <div className="px-3 py-2.5">
          <p className="font-lato text-xs text-maseer-muted font-medium">
            Logged in as
          </p>
          <p className="truncate font-lato text-sm font-bold text-maseer-green-text mt-0.5">
            {displayName}
          </p>
        </div>
        <div className="h-[1px] bg-maseer-line/30 my-1" />

        {authUser && typeof authUser === "object" && (authUser as AuthUser).currentRole === "admin" && (
          <>
            <MenuItem>
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-lato text-sm text-maseer-green-text transition data-[focus]:bg-maseer-surface focus:outline-none"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0 text-maseer-muted" />
                <span>Access Admin Dashboard</span>
              </button>
            </MenuItem>
            <div className="h-[1px] bg-maseer-line/30 my-1" />
          </>
        )}

        <MenuItem>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-lato text-sm text-maseer-green-text transition data-[focus]:bg-maseer-surface focus:outline-none"
          >
            <User className="h-4 w-4 shrink-0 text-maseer-gold" />
            <span>My Profile</span>
          </button>
        </MenuItem>

        <MenuItem>
          <button
            type="button"
            onClick={() => navigate("/reservations")}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-lato text-sm text-maseer-green-text transition data-[focus]:bg-maseer-surface focus:outline-none"
          >
            <Calendar className="h-4 w-4 shrink-0 text-maseer-gold" />
            <span>My Reservations</span>
          </button>
        </MenuItem>

        <div className="h-[1px] bg-maseer-line/30 my-1" />

        <MenuItem>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-lato text-sm text-red-600 transition data-[focus]:bg-red-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Spinner size="sm" className="text-red-600" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0 text-red-500" />
            )}
            {isLoggingOut ? "Logging out..." : "Sign Out"}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
