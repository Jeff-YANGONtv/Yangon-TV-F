/**
 * Parse a streaming link and return structured data:
 * - type: 'iframe' | 'youtube' | 'nstream' | 'direct'
 * - src: the actual URL to embed/play
 * - raw: the original full link string (for nstream/iframe, this is the full HTML)
 */

export function parseStreamLink(link) {
  if (!link || typeof link !== 'string') return null;

  // Case 1: Full iframe HTML tag from backend (nstream, custom embeds, etc.)
  if (link.includes('<iframe') || link.includes('src=')) {
    const iframeMatch = link.match(/src\s*=\s*["']([^"']+)["']/);
    const src = iframeMatch ? iframeMatch[1] : '';
    if (src.includes('nstream.cc')) {
      return { type: 'nstream', src, raw: link };
    }
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      return { type: 'youtube', src, raw: link };
    }
    return { type: 'iframe', src, raw: link };
  }

  // Case 2: Plain YouTube URL
  if (link.includes('youtube.com') || link.includes('youtu.be')) {
    return { type: 'youtube', src: link, raw: link };
  }

  // Case 3: nstream.cc direct URL (no iframe wrapper)
  if (link.includes('nstream.cc')) {
    return { type: 'nstream', src: link, raw: link };
  }

  // Case 4: Direct video file
  if (link.includes('.mp4') || link.includes('.webm') || link.includes('.mkv')) {
    return { type: 'direct', src: link, raw: link };
  }

  // Default: treat as direct video
  return { type: 'direct', src: link, raw: link };
}

/**
 * Encode stream link for URL-safe passing.
 * For iframe/nstream types: base64 encode the FULL raw HTML (not just src).
 * For youtube/direct types: base64 encode just the src URL.
 * Format: "{type}:{base64payload}"
 */
export function encodeStreamLink(link) {
  const parsed = parseStreamLink(link);
  if (!parsed) return '';

  // For iframe/nstream — encode the full raw HTML so the player works exactly as backend provides
  if (parsed.type === 'iframe' || parsed.type === 'nstream') {
    const payload = btoa(unescape(encodeURIComponent(parsed.raw)));
    return `${parsed.type}:${payload}`;
  }

  // For youtube/direct — encode just the src URL
  const srcBase64 = btoa(unescape(encodeURIComponent(parsed.src)));
  return `${parsed.type}:${srcBase64}`;
}

/**
 * Decode stream link from URL-safe format back to parsed data.
 */
export function decodeStreamLink(encoded) {
  if (!encoded) return null;

  try {
    const colonIdx = encoded.indexOf(':');
    if (colonIdx === -1) return null;

    const type = encoded.substring(0, colonIdx);
    const payloadBase64 = encoded.substring(colonIdx + 1);
    const decoded = decodeURIComponent(escape(atob(payloadBase64)));

    if (type === 'iframe' || type === 'nstream') {
      // payload is the full raw HTML — re-parse it
      const parsed = parseStreamLink(decoded);
      return parsed || { type, src: decoded, raw: decoded };
    }

    return { type, src: decoded, raw: decoded };
  } catch {
    return null;
  }
}

/**
 * Get YouTube embed URL from any YouTube URL format.
 */
export function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  return null;
}

/**
 * Extract just the source URL from an iframe HTML string.
 */
export function extractSrcFromIframe(html) {
  const match = html.match(/src\s*=\s*["']([^"']+)["']/);
  return match ? match[1] : null;
}
