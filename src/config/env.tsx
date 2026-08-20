const apiEndpoint = `https://chaufeer.vercel.app/api`;
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "786451244943-fd7ti4s94nmq06lihcm5ms5gc24ma0mp.apps.googleusercontent.com";

export { apiEndpoint, GOOGLE_CLIENT_ID };
export default apiEndpoint;

