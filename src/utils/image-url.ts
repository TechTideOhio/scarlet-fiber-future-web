export function optimizeImageUrl(value: string, fallback: string, width?: number): string {
  if (!value) return fallback;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "images.unsplash.com" || url.username || url.password) return value;
    url.searchParams.set("auto", "format");
    url.searchParams.set("q", "80");
    if (width) url.searchParams.set("w", String(width));
    return url.toString();
  } catch {
    return value;
  }
}
