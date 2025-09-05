import { env } from "../lib/env";

/**
 * Utility functions for URL generation
 */
export class UrlUtils {
  /**
   * Convert a relative path to a full URL
   * @param relativePath - The relative path (e.g., "/uploads/profile-pictures/image.jpg")
   * @returns Full URL (e.g., "http://localhost:3001/uploads/profile-pictures/image.jpg")
   */
  static toFullUrl(relativePath: string | null): string | null {
    if (!relativePath) return null;

    // If it's already a full URL, return as is
    if (
      relativePath.startsWith("http://") ||
      relativePath.startsWith("https://")
    ) {
      return relativePath;
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = relativePath.startsWith("/")
      ? relativePath.substring(1)
      : relativePath;

    return `${env.API_URL}/${cleanPath}`;
  }

  /**
   * Convert full URL back to relative path
   * @param fullUrl - The full URL
   * @returns Relative path
   */
  static toRelativePath(fullUrl: string | null): string | null {
    if (!fullUrl) return null;

    // If it's already a relative path, return as is
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      return fullUrl;
    }

    // Extract the path part from the full URL
    try {
      const url = new URL(fullUrl);
      return url.pathname;
    } catch {
      return fullUrl;
    }
  }
}
