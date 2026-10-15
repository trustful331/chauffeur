const rawApiUrl =
  import.meta.env.VITE_API_BASE_URL || "https://chaufeer-tau.vercel.app";
const cleanApiUrl = rawApiUrl.replace(/\/+$/, "");
const apiEndpoint = cleanApiUrl.endsWith("/api")
  ? cleanApiUrl
  : `${cleanApiUrl}/api`;

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "786451244943-fd7ti4s94nmq06lihcm5ms5gc24ma0mp.apps.googleusercontent.com";

export { apiEndpoint, GOOGLE_CLIENT_ID };
export default apiEndpoint;

