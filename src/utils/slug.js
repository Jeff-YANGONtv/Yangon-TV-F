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
 * 
 * NOTE: This is now a legacy helper. We should prefer using item.slug from the backend.
 */
export function toSlugWithId(title, id) {
  return toSlug(title);
}

/**
 * Extract the title portion from a slug.
 * This helper is mostly for display or fallback purposes.
 */
export function extractTitleFromSlug(slug) {
  if (!slug) return '';
  // Since backend slugs might have -1, -2 for uniqueness, 
  // and titles like "Crime 101" result in "crime-101",
  // we should be careful about stripping trailing digits.
  // If the slug matches the backend pattern (name-suffix), 
  // we just return the slug itself or handle it based on requirements.
  return slug;
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
