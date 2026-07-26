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
 * Create a slug that includes an id suffix to ensure uniqueness
 * e.g. "the-dark-knight-42" for movie with id=42
 */
export function toSlugWithId(title, id) {
  const slug = toSlug(title);
  return id ? `${slug}-${id}` : slug;
}

/**
 * Extract the numeric id from a slug
 * e.g. "the-dark-knight-42" -> 42
 */
export function extractIdFromSlug(slug) {
  if (!slug) return null;
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
