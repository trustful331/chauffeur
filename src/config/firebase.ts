import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
  isSupported,
  type Messaging,
} from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyDn7nzI170WOmF2eFPRlkFZY48w39LpmDQ",
  authDomain: "chauffeer.firebaseapp.com",
  projectId: "chauffeer",
  storageBucket: "chauffeer.firebasestorage.app",
  messagingSenderId: "680908779064",
  appId: "1:680908779064:web:2a4e30d92e3ccb087680cd",
  measurementId: "G-QM69DW8B0T",
};

export const VAPID_KEY =
  "BI8hMSbxTkAE_QNNp9BFeKs6ma1R5F40_E9hxKBDrETClnD8Ns91bxkPfBKjLqnCUZPiFEOc5fxranSpsznrtYI";

// Initialize Firebase App singleton
export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let messagingInstance: Messaging | null = null;

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    console.warn("Firebase Messaging is not supported in this browser environment.");
    return null;
  }

  if (!messagingInstance) {
    messagingInstance = getMessaging(firebaseApp);
  }
  return messagingInstance;
}

/**
 * Request notification permission from browser and fetch FCM Device Token
 */
export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("[FCM] Notifications not supported in this browser.");
    return null;
  }

  try {
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      console.info("[FCM] Notification permission status:", permission);
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      console.warn("[FCM] Messaging could not be initialized.");
      return null;
    }

    // Register the service worker explicitly
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
          scope: "/",
        });
        await swRegistration.update();
      } catch (swErr) {
        console.warn("[FCM] Service worker registration error:", swErr);
      }
    }

    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (currentToken) {
      console.log("[FCM] Device Token obtained:", currentToken);
      localStorage.setItem("fcm_device_token", currentToken);
      return currentToken;
    } else {
      console.warn("[FCM] No registration token returned by Firebase.");
      return null;
    }
  } catch (error) {
    console.error("[FCM] An error occurred while retrieving FCM token:", error);
    return null;
  }
}

/**
 * Listen for messages received while the app is in the foreground
 */
export async function setupForegroundMessageListener(
  onMessageReceived: (payload: any) => void
): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  return onMessage(messaging, (payload) => {
    console.log("[FCM Foreground Message]:", payload);
    onMessageReceived(payload);
  });
}

/**
 * Remove / unregister device token on logout
 */
export async function removeFCMToken(): Promise<boolean> {
  try {
    const messaging = await getFirebaseMessaging();
    if (messaging) {
      await deleteToken(messaging);
    }
    localStorage.removeItem("fcm_device_token");
    return true;
  } catch (error) {
    console.warn("Failed to delete FCM token:", error);
    return false;
  }
}
