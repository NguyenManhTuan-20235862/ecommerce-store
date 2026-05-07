const BACKEND_ORIGIN =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads/")) return `${BACKEND_ORIGIN}${path}`;
  return path;
}
