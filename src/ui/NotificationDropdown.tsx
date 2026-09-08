import { useState, useEffect, useRef, useTransition } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Car,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  MapPin,
  AlertTriangle,
  Inbox,
  RefreshCw,
} from "lucide-react";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  formatNotificationTime,
  type NotificationItem,
  type NotificationType,
} from "src/api/notification";
import { useAppSelector } from "src/store/hooks";
import { selectAuthUser, selectIsAuthenticated } from "src/store/slices/auth/selectors";
import type { AuthUser } from "src/store/slices/auth/types";

interface NotificationDropdownProps {
  align?: "left" | "right";
  className?: string;
}

export function NotificationDropdown({
  align = "right",
  className = "",
}: NotificationDropdownProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authUser = useAppSelector(selectAuthUser);
  const isAdmin = authUser && typeof authUser === "object" && (authUser as AuthUser).currentRole === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications
  const loadNotifications = async (silent = false) => {
    if (!isAuthenticated) return;
    if (!silent) setIsLoading(true);
    try {
      const res = await fetchNotifications({ limit: 40 });
      if (res && res.success && Array.isArray(res.data)) {
        startTransition(() => {
          setNotifications(res.data);
          setUnreadCount(
            res.unread_count !== undefined
              ? res.unread_count
              : res.data.filter((n) => !n.is_read).length
          );
        });
      }
    } catch (error) {
      // Silently ignore background polling errors
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Initial load + periodic poll every 20 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    loadNotifications(true);

    const interval = setInterval(() => {
      loadNotifications(true);
    }, 20_000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Reload fresh when opening dropdown
  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      loadNotifications(false);
    }
  };

  // Mark single item as read and handle navigation
  const handleItemClick = async (item: NotificationItem) => {
    if (!item.is_read) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      markNotificationAsRead(item.id);
    }

    setIsOpen(false);

    // Deep link navigation
    if (isAdmin) {
      if (item.booking_id) {
        navigate("/admin/bookings");
      } else if (item.quote_id || item.type.includes("quote")) {
        navigate("/admin/pricing");
      }
    } else {
      if (item.booking_id) {
        navigate("/reservations");
      } else if (item.quote_id || item.type.includes("quote")) {
        navigate("/booking");
      }
    }
  };

  // Mark all as read
  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unreadCount === 0 || isMarkingAll) return;
    setIsMarkingAll(true);
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      await markAllNotificationsAsRead();
    } catch {
      // Revert if API fails
      loadNotifications(true);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const location = useLocation();
  const isCurrentlyInAdmin = location.pathname.startsWith("/admin");

  if (!isAuthenticated) return null;

  // Filter items by role (admin vs client) with fallback so no notifications are lost
  const roleFilteredNotifications = notifications.filter((n) => {
    const role = (n.recipient_role || "").toLowerCase().trim();
    if (!role) return true;

    if (isCurrentlyInAdmin) {
      return role === "admin";
    } else {
      // On client website: show client/user alerts if present, or all alerts if none tagged
      const hasClientAlerts = notifications.some((item) => {
        const r = (item.recipient_role || "").toLowerCase().trim();
        return r !== "admin";
      });
      return hasClientAlerts ? role !== "admin" : true;
    }
  });

  const activeList = roleFilteredNotifications.length > 0 ? roleFilteredNotifications : notifications;

  const displayUnreadCount = activeList.filter((n) => !n.is_read).length;

  // Filter items (all vs unread)
  const filteredNotifications = activeList.filter((n) => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const getNotifIcon = (type: NotificationType) => {
    const t = (type || "").toLowerCase();
    if (t.includes("completed")) {
      return {
        icon: <CheckCircle2 className="h-4 w-4" />,
        bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      };
    }
    if (t.includes("cancelled")) {
      return {
        icon: <XCircle className="h-4 w-4" />,
        bg: "bg-red-50 text-red-600 border-red-100",
      };
    }
    if (t.includes("progress") || t.includes("start")) {
      return {
        icon: <Clock className="h-4 w-4" />,
        bg: "bg-blue-50 text-blue-600 border-blue-100",
      };
    }
    if (t.includes("quote_priced") || t.includes("fare") || t.includes("price")) {
      return {
        icon: <DollarSign className="h-4 w-4" />,
        bg: "bg-amber-50 text-amber-600 border-amber-100",
      };
    }
    if (t.includes("long_distance") || t.includes("waiting")) {
      return {
        icon: <MapPin className="h-4 w-4" />,
        bg: "bg-orange-50 text-orange-600 border-orange-100",
      };
    }
    if (t.includes("expired")) {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        bg: "bg-slate-100 text-slate-600 border-slate-200",
      };
    }
    // Default (booking created or general)
    return {
      icon: <Car className="h-4 w-4" />,
      bg: "bg-maseer-gold/15 text-maseer-green border-maseer-gold/30",
    };
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
          isOpen
            ? "border-maseer-gold bg-[#FFFBF0] text-maseer-gold shadow-sm"
            : "border-maseer-line/60 bg-white text-maseer-green hover:border-maseer-gold hover:bg-[#FFFDF7]"
        }`}
      >
        <Bell className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />

        {/* Unread Ping & Counter Badge */}
        {displayUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 font-lato text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-60" />
            <span className="relative">{displayUnreadCount > 9 ? "9+" : displayUnreadCount}</span>
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2.5 w-[360px] max-w-[calc(100vw-32px)] origin-top-${align} rounded-2xl border border-maseer-line/70 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.14)] ring-1 ring-black/5 z-50 overflow-hidden font-lato animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-[#FBF9F4] px-4 py-3.5">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-sm font-bold text-maseer-green-text">
                Notifications
              </h3>
              {displayUnreadCount > 0 ? (
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">
                  {displayUnreadCount} New
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                  All caught up
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {displayUnreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={isMarkingAll}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-maseer-gold hover:bg-maseer-gold/10 transition disabled:opacity-50"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => loadNotifications(false)}
                disabled={isLoading}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-maseer-green transition"
                title="Refresh"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex border-b border-gray-100 bg-white px-3 py-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1 transition ${
                filter === "all"
                  ? "bg-maseer-green text-white font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              All ({roleFilteredNotifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`ml-1 rounded-lg px-3 py-1 transition ${
                filter === "unread"
                  ? "bg-maseer-green text-white font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Unread ({displayUnreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100/70">
            {isLoading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <RefreshCw className="h-6 w-6 animate-spin text-maseer-gold mb-2" />
                <p className="text-xs font-medium">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-2.5">
                  <Inbox className="h-6 w-6 opacity-60" />
                </div>
                <h4 className="font-serif text-sm font-bold text-gray-800">
                  {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                </h4>
                <p className="mt-1 text-xs text-gray-500 max-w-[220px]">
                  {filter === "unread"
                    ? "You've read all your notifications."
                    : "You will be notified about bookings, quotes, and trip updates here."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const { icon, bg } = getNotifIcon(item.type);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                      item.is_read
                        ? "bg-white hover:bg-gray-50/80"
                        : "bg-[#FFFBF2] hover:bg-[#FFF8E6]"
                    }`}
                  >
                    {/* Unread Blue Indicator Bar on Left */}
                    {!item.is_read && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-maseer-gold" />
                    )}

                    {/* Icon Badge */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${bg} transition-transform group-hover:scale-105`}
                    >
                      {icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`truncate text-xs leading-tight ${
                            item.is_read
                              ? "font-semibold text-gray-800"
                              : "font-bold text-maseer-green-text"
                          }`}
                        >
                          {item.title}
                        </p>
                        <span className="shrink-0 text-[10px] font-medium text-gray-400">
                          {formatNotificationTime(item.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-[16px] text-gray-600 line-clamp-2">
                        {item.message}
                      </p>
                    </div>

                    {/* Check indicator if unread */}
                    {!item.is_read && (
                      <div className="flex shrink-0 self-center">
                        <span className="h-2 w-2 rounded-full bg-maseer-gold ring-4 ring-maseer-gold/20" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-[#FAF9F5] px-4 py-2.5">
            <span className="text-[10.5px] font-semibold text-gray-500">
              Click to view details
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(isAdmin ? "/admin/notifications" : "/notifications");
              }}
              className="text-[11px] font-bold text-maseer-gold hover:text-maseer-green transition flex items-center gap-1"
            >
              <span>View all</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
