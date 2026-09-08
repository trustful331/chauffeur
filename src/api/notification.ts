import { apiGet, getErrorMessage } from "src/config/axios";

export type NotificationType =
  | "booking_created"
  | "booking_cancelled"
  | "booking_completed"
  | "booking_inprogress"
  | "long_distance_quote"
  | "quote_priced"
  | "quote_expired"
  | string;

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  booking_id?: string | null;
  quote_id?: string | null;
  is_read: boolean;
  recipient_role?: "admin" | "client" | string;
  meta?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
};

export type NotificationListResponse = {
  success: boolean;
  count?: number;
  unread_count?: number;
  data: NotificationItem[];
  message?: string;
};

export type UnreadCountResponse = {
  success: boolean;
  data: {
    unread_count: number;
  };
  message?: string;
};

export type SimpleNotificationResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
};

/**
 * 1) Fetch notifications list for logged-in user with unread_count
 * GET /api/notifications/get
 */
export async function fetchNotifications(query?: {
  is_read?: boolean;
  limit?: number;
}): Promise<NotificationListResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (query?.is_read !== undefined) {
      searchParams.append("is_read", String(query.is_read));
    }
    if (query?.limit !== undefined) {
      searchParams.append("limit", String(query.limit));
    }
    const qStr = searchParams.toString();
    const endpoint = `notifications/get${qStr ? `?${qStr}` : ""}`;
    const response = await apiGet<NotificationListResponse>(endpoint);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load notifications"), { cause: error });
  }
}

/**
 * 2) Fetch only unread count for bell dot
 * GET /api/notifications/unread-count
 */
export async function fetchUnreadCount(): Promise<number> {
  try {
    const response = await apiGet<UnreadCountResponse>("notifications/unread-count");
    if (response && response.success && response.data) {
      return Number(response.data.unread_count || 0);
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * 3) Mark single notification as read
 * GET /api/notifications/{id}/read
 */
export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const response = await apiGet<SimpleNotificationResponse>(`notifications/${id}/read`);
    return response?.success !== false;
  } catch (error) {
    console.warn(`Failed to mark notification ${id} as read:`, error);
    return false;
  }
}

/**
 * 4) Mark all notifications as read
 * GET /api/notifications/mark-all-read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const response = await apiGet<SimpleNotificationResponse>("notifications/mark-all-read");
    return response?.success !== false;
  } catch (error) {
    console.warn("Failed to mark all notifications as read:", error);
    return false;
  }
}

/**
 * Formats ISO timestamp to human friendly relative time (e.g. 'Just now', '5m ago', '2h ago')
 */
export function formatNotificationTime(dateStr?: string | null): string {
  if (!dateStr) return "Just now";
  try {
    const d = new Date(dateStr);
    const now = Date.now();
    const diffSec = Math.floor((now - d.getTime()) / 1000);

    if (diffSec < 45) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}
