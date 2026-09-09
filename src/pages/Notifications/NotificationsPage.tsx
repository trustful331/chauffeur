import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Check,
  Car,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  MapPin,
  AlertTriangle,
  Inbox,
  RefreshCw,
  Search,
  ArrowRight,
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
import { selectAuthUser } from "src/store/slices/auth/selectors";
import type { AuthUser } from "src/store/slices/auth/types";
import { Spinner } from "src/ui/Spinner";

export function NotificationsPage() {
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser);
  const isAdmin = authUser && typeof authUser === "object" && (authUser as AuthUser).currentRole === "admin";

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadNotifications = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const isReadParam = activeTab === "all" ? undefined : activeTab === "read";
      const res = await fetchNotifications({ is_read: isReadParam, limit: 100 });
      if (res && res.success && Array.isArray(res.data)) {
        setNotifications(res.data);
        if (res.unread_count !== undefined) {
          setUnreadCount(res.unread_count);
        } else {
          setUnreadCount(res.data.filter((n) => !n.is_read).length);
        }
      }
    } catch (error) {
      console.warn("Failed to load notifications:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [activeTab]);

  const handleMarkOne = async (e: React.MouseEvent, item: NotificationItem) => {
    e.stopPropagation();
    if (item.is_read || markingId === item.id) return;
    setMarkingId(item.id);
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await markNotificationAsRead(item.id);
    } catch {
      loadNotifications(true);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAll = async () => {
    if (unreadCount === 0 || isMarkingAll) return;
    setIsMarkingAll(true);
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      await markAllNotificationsAsRead();
    } catch {
      loadNotifications(true);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.is_read) {
      markNotificationAsRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

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

  const getNotifIcon = (type: NotificationType) => {
    const t = (type || "").toLowerCase();
    if (t.includes("completed")) {
      return {
        icon: <CheckCircle2 className="h-5 w-5" />,
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }
    if (t.includes("cancelled")) {
      return {
        icon: <XCircle className="h-5 w-5" />,
        bg: "bg-red-50 text-red-700 border-red-200",
      };
    }
    if (t.includes("progress") || t.includes("start")) {
      return {
        icon: <Clock className="h-5 w-5" />,
        bg: "bg-blue-50 text-blue-700 border-blue-200",
      };
    }
    if (t.includes("quote_priced") || t.includes("fare") || t.includes("price")) {
      return {
        icon: <DollarSign className="h-5 w-5" />,
        bg: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    if (t.includes("long_distance") || t.includes("waiting")) {
      return {
        icon: <MapPin className="h-5 w-5" />,
        bg: "bg-orange-50 text-orange-700 border-orange-200",
      };
    }
    if (t.includes("expired")) {
      return {
        icon: <AlertTriangle className="h-5 w-5" />,
        bg: "bg-slate-100 text-slate-700 border-slate-200",
      };
    }
    return {
      icon: <Car className="h-5 w-5" />,
      bg: "bg-maseer-gold/20 text-maseer-green border-maseer-gold/30",
    };
  };

  const location = useLocation();
  const isCurrentlyInAdmin = location.pathname.startsWith("/admin");

  // Filter items by role (admin vs client) with fallback so no notifications are lost
  const roleFiltered = notifications.filter((n) => {
    const role = (n.recipient_role || "").toLowerCase().trim();
    if (!role) return true;

    if (isCurrentlyInAdmin) {
      return role === "admin";
    } else {
      const hasClientAlerts = notifications.some((item) => {
        const r = (item.recipient_role || "").toLowerCase().trim();
        return r !== "admin";
      });
      return hasClientAlerts ? role !== "admin" : true;
    }
  });

  const activeList = roleFiltered.length > 0 ? roleFiltered : notifications;

  const displayUnreadCount = activeList.filter((n) => !n.is_read).length;

  const filteredItems = activeList.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (n.title || "").toLowerCase().includes(q) ||
      (n.message || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 font-lato">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-6 md:p-8 border border-maseer-line/60 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-maseer-green/10 text-maseer-green">
                <Bell className="h-4.5 w-4.5" />
              </span>
              <p className="eyebrow text-maseer-gold">ACTIVITY FEED</p>
            </div>
            <h1 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-maseer-green-text">
              Notifications
            </h1>
            <p className="mt-1 text-xs text-maseer-muted">
              Stay updated with your bookings, price quotes, and chauffeur schedule
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                disabled={isMarkingAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-maseer-line/70 bg-white px-4 py-2.5 text-xs font-bold text-maseer-green-text hover:bg-maseer-surface transition shadow-sm disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4 text-maseer-gold" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => loadNotifications(false)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-maseer-line/70 bg-white px-4 py-2.5 text-xs font-bold text-maseer-green-text hover:bg-maseer-surface transition shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-maseer-line/60 shadow-sm">
          {/* Tabs */}
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-maseer-green text-white shadow-sm"
                  : "text-maseer-muted hover:bg-gray-50 hover:text-maseer-green-text"
              }`}
            >
              All ({roleFiltered.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("unread")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "unread"
                  ? "bg-maseer-green text-white shadow-sm"
                  : "text-maseer-muted hover:bg-gray-50 hover:text-maseer-green-text"
              }`}
            >
              <span>Unread</span>
              {displayUnreadCount > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {displayUnreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("read")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "read"
                  ? "bg-maseer-green text-white shadow-sm"
                  : "text-maseer-muted hover:bg-gray-50 hover:text-maseer-green-text"
              }`}
            >
              Read
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3.5 py-2 text-xs font-semibold text-maseer-green-text outline-none focus:border-maseer-gold focus:bg-white transition"
            />
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-maseer-line/60 shadow-sm">
            <Spinner size="lg" className="text-maseer-gold" />
            <p className="mt-4 text-xs font-bold text-maseer-muted">
              Loading your notifications...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-maseer-line/60 text-center shadow-sm p-8 space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-maseer-cream/70 text-maseer-gold">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-maseer-green-text">
              {searchQuery
                ? "No matching notifications found"
                : activeTab === "unread"
                ? "No unread notifications"
                : "You don't have any notifications"}
            </h3>
            <p className="text-xs text-maseer-muted max-w-sm">
              {searchQuery
                ? "Try searching for another keyword or clear the search filter."
                : "When your bookings update or when admin prices quotes, alerts will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const { icon, bg } = getNotifIcon(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition cursor-pointer ${
                    item.is_read
                      ? "border-maseer-line/50 bg-white hover:border-maseer-gold/50 hover:shadow-md"
                      : "border-amber-200/80 bg-[#FFFDF7] shadow-sm hover:border-maseer-gold hover:shadow-md"
                  }`}
                >
                  {/* Left Highlight bar for unread */}
                  {!item.is_read && (
                    <span className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r bg-maseer-gold" />
                  )}

                  {/* Icon & Details */}
                  <div className="flex items-start gap-3.5 pl-1 min-w-0 flex-1">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${bg} transition group-hover:scale-105 shadow-xs`}
                    >
                      {icon}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm ${
                            item.is_read
                              ? "font-semibold text-gray-800"
                              : "font-bold text-maseer-green-text"
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.is_read && (
                          <span className="rounded-full bg-maseer-gold/20 px-2 py-0.5 text-[9.5px] font-bold text-maseer-green">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-maseer-muted leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-3 pt-0.5 text-[11px] text-gray-400">
                        <span>{formatNotificationTime(item.created_at)}</span>
                        {item.booking_id && (
                          <span className="font-mono text-gray-500">
                            Ref: #{item.booking_id.slice(-6)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions right side */}
                  <div className="flex items-center gap-2 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {!item.is_read && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkOne(e, item)}
                        disabled={markingId === item.id}
                        className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-maseer-green transition"
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Mark read</span>
                      </button>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-maseer-gold group-hover:translate-x-0.5 transition">
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
