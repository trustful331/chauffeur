const apiEndpoint = `https://chaufeer.vercel.app/api`;
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "not-configured";

export { apiEndpoint, GOOGLE_CLIENT_ID };
export default apiEndpoint;

