export function getImageUrl(path: string | undefined | null) {
  // 1. If no image exists, return the placeholder
  if (!path) return "/placeholder.svg"; 

  // 2. If it's already a full web URL (Cloudinary), return it as-is
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }

  // 3. If it's a local path (Legacy), prepend the Backend URL
  // Ensure we don't end up with double slashes if path starts with /
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${backendUrl}${cleanPath}`;
}