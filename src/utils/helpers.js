/**
 * Strip HTML tags and decode entities from WordPress rendered content.
 */
export function stripHtml(html = '') {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent?.trim() ?? '';
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text = '', maxLength = 160) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

/**
 * Extract featured image URL from WordPress _embedded data.
 */
export function getFeaturedImage(item, size = 'large') {
  const media = item?._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;

  return (
    media.media_details?.sizes?.[size]?.source_url ||
    media.source_url ||
    null
  );
}

/**
 * Extract taxonomy terms from _embedded data.
 */
export function getTaxonomyTerms(item, taxonomy) {
  const terms = item?._embedded?.['wp:term']?.flat() ?? [];
  return terms.filter((term) => term.taxonomy === taxonomy);
}

/**
 * Pick the most specific Directorist category (child over parent).
 */
export function pickPrimaryCategory(categories = []) {
  if (!categories.length) return null;
  return categories.find((category) => category._links?.up) ?? categories.at(-1);
}

/**
 * Normalize a Directorist listing into a consistent professional shape.
 */
export function normalizeProfessional(item) {
  if (!item) return null;

  const categories = getTaxonomyTerms(item, 'at_biz_dir-category');
  const locations = getTaxonomyTerms(item, 'at_biz_dir-location');
  const primaryCategory = pickPrimaryCategory(categories);
  const meta = item.meta ?? {};

  const excerpt =
    item.uagb_excerpt ||
    item.excerpt?.rendered ||
    item.content?.rendered ||
    '';

  return {
    id: item.id,
    slug: item.slug,
    name: stripHtml(item.title?.rendered),
    description: stripHtml(excerpt),
    biography: item.content?.rendered ?? '',
    category: stripHtml(primaryCategory?.name ?? 'Professional'),
    categories: categories.map((category) => stripHtml(category.name)),
    location: locations.map((loc) => stripHtml(loc.name)).join(', '),
    featuredImage: getFeaturedImage(item),
    email: meta._email ?? meta.email ?? '',
    phone: meta._phone ?? meta.phone ?? '',
    website: meta._website ?? meta.website ?? '',
    raw: item,
  };
}

/**
 * Build query string from params object.
 */
export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}
