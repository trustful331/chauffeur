import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { requestFCMToken, setupForegroundMessageListener } from "src/config/firebase";
import { registerDeviceToken } from "src/api/notification";
import { playNotificationSound } from "src/config/sound";
import { useAppSelector } from "src/store/hooks";
import { selectIsAuthenticated } from "src/store/slices/auth/selectors";

export function useFirebaseMessaging() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [fcmToken, setFcmToken] = useState<string | null>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("fcm_device_token") : null;
  });
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | "unsupported">(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    return Notification.permission;
  });

  const initToken = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const token = await requestFCMToken();
      if (token) {
        setFcmToken(token);
        if ("Notification" in window) {
          setPermissionStatus(Notification.permission);
        }
        const registered = await registerDeviceToken(token, "web");
        if (registered) {
          toast.success("🔔 Push notifications active on this device!", {
            id: "fcm-connected",
            duration: 3500,
          });
        }
      }
      return token;
    } catch (err) {
      console.warn("Failed to initialize FCM messaging:", err);
      return null;
    }
  }, [isAuthenticated]);

  // Request token and sync when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        initToken();
      } else if (Notification.permission === "default") {
        // Attempt initToken directly
        initToken().catch(() => { });

        // Also display friendly interactive toast prompt
        toast(
          (t) => (
            <div className="flex items-center justify-between gap-3 w-full font-lato">
              <div className="flex-1 text-left">
                <p className="font-bold text-xs text-[#062111]">🔔 Enable Push Notifications</p>
                <p className="text-[11px] text-gray-600">Get instant updates on bookings and trips.</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  toast.dismiss(t.id);
                  const token = await initToken();
                  if (token) {
                    toast.success("Notifications enabled successfully!");
                  }
                }}
                className="px-2.5 py-1 bg-[#062111] text-[#E5C378] text-xs font-bold rounded-lg hover:bg-black transition shrink-0 cursor-pointer shadow-sm"
              >
                Enable
              </button>
            </div>
          ),
          {
            id: "fcm-permission-prompt",
            duration: 8000,
            position: "top-center",
          }
        );
      }
    }

    // Helper to display toast & trigger in-app updates with deduplication
    const seenRecentAlerts = new Set<string>();
    const triggerInAppAlert = (payload: any) => {
      console.log("[FCM] Triggering in-app alert with payload:", payload);
      const title =
        payload?.notification?.title ||
        payload?.data?.title ||
        payload?.title ||
        "New Notification";
      const body =
        payload?.notification?.body ||
        payload?.data?.message ||
        payload?.data?.body ||
        payload?.message ||
        "";
      const dedupeKey = `${title}::${body}`;

      if (seenRecentAlerts.has(dedupeKey)) return;
      seenRecentAlerts.add(dedupeKey);
      setTimeout(() => seenRecentAlerts.delete(dedupeKey), 4000);

      playNotificationSound();

      toast(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id);
              const link = payload?.data?.link || payload?.data?.url || payload?.link;
              if (link) {
                window.location.href = link;
              }
            }}
            className="cursor-pointer font-lato"
          >
            <p className="font-bold text-sm text-[#062111]">{title}</p>
            {body && <p className="text-xs text-gray-600 mt-0.5">{body}</p>}
          </div>
        ),
        {
          duration: 6000,
          position: "top-right",
          icon: "🔔",
        }
      );

      // Notify other components (like NotificationDropdown) to refresh in real time
      window.dispatchEvent(new CustomEvent("app:notification_received", { detail: payload }));
    };

    // 1. Set up foreground message listener from Firebase SDK
    let unsubscribe: (() => void) | null = null;
    setupForegroundMessageListener((payload) => {
      console.log("[FCM] Foreground push received from SDK:", payload);
      triggerInAppAlert(payload);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    // 2. Set up listener for messages broadcasted by the Service Worker
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "FCM_NOTIFICATION_RECEIVED") {
        console.log("[FCM] Service worker broadcast received:", event.data.payload);
        triggerInAppAlert(event.data.payload);
      }
    };

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleSwMessage);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleSwMessage);
      }
    };
  }, [isAuthenticated, initToken]);

  return {
    fcmToken,
    permissionStatus,
    requestPermissionAndToken: initToken,
  };
}
