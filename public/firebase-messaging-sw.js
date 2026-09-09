// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Firebase configuration provided by backend
const firebaseConfig = {
  apiKey: "AIzaSyDn7nzI170WOmF2eFPRlkFZY48w39LpmDQ",
  authDomain: "chauffeer.firebaseapp.com",
  projectId: "chauffeer",
  storageBucket: "chauffeer.firebasestorage.app",
  messagingSenderId: "680908779064",
  appId: "1:680908779064:web:2a4e30d92e3ccb087680cd",
  measurementId: "G-QM69DW8B0T",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Instantly activate updated service worker without waiting
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Helper to broadcast push messages to all active open tabs
function postToClients(payload) {
  self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
    for (const client of windowClients) {
      client.postMessage({
        type: "FCM_NOTIFICATION_RECEIVED",
        payload: payload,
      });
    }
  });
}

// Handle background push messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  // Send message to active open web tabs so foreground toast appears
  postToClients(payload);

  const notificationTitle =
    payload.notification?.title || payload.data?.title || "Chauffeur Notification";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      payload.data?.message ||
      payload.data?.body ||
      "You have a new update.",
    icon: payload.notification?.icon || "/favicon.svg",
    badge: "/favicon.svg",
    data: payload.data || {},
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Focus or open browser window on notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification?.data?.link || event.notification?.data?.url || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
