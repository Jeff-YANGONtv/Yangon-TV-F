/**
 * Generate a URL-friendly slug from a title string.
 * Examples:
 *   "The Dark Knight" -> "the-dark-knight"
 *   "Iron Man 3" -> "iron-man-3"
 *   "Doctor Strange: Multiverse of Madness" -> "doctor-strange-multiverse-of-madness"
 */
export function toSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize('NFD')          // decompose accented chars
    .replace(/[\u0300-\u036f]/g, '')  // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')  // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');     // trim leading/trailing hyphens
}

/**
 * Create a clean slug from title only (no ID suffix).
 * e.g. "The Dark Knight" -> "the-dark-knight"
 */
export function toSlugWithId(title, id) {
  return toSlug(title);
}

/**
 * Extract the title portion from a slug (strip trailing numeric ID if present).
 * e.g. "the-dark-knight-42" -> "the-dark-knight"
 * e.g. "crime-101" -> "crime-101"
 */
export function extractTitleFromSlug(slug) {
  if (!slug) return '';
  // Remove trailing -<digits> if it looks like an ID suffix
  return slug.replace(/-\d+$/, '');
}

/**
 * Convert a slug back to a readable title for search queries.
 * e.g. "game-of-thrones" -> "Game Of Thrones"
 * e.g. "crime-101" -> "Crime 101"
 */
export function slugToTitle(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
