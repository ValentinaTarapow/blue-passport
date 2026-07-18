import { buildQueryString, normalizeProfessional, stripHtml } from '../utils/helpers';

const API_BASE = import.meta.env.VITE_WP_API_URL || '/wp-json/wp/v2';

/** Directory list: skip full content/author/terms embed — only featured media. */
const LIST_FIELDS = [
  'id',
  'slug',
  'date',
  'modified',
  'title',
  'excerpt',
  'uagb_excerpt',
  'featured_media',
  'at_biz_dir-category',
  'at_biz_dir-location',
  'bp_contact',
  'status',
  '_links',
  '_embedded',
].join(',');

/**
 * Centralized fetch wrapper for WordPress REST API.
 * Host sends Cache-Control max-age ~28 days on REST; bust shared CDN caches per request.
 */
async function apiFetch(endpoint, params = {}, { bustCache = false } = {}) {
  const query = buildQueryString({
    ...params,
    ...(bustCache ? { _cb: Date.now() } : {}),
  });
  const url = `${API_BASE}${endpoint}${query}`;

  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.endpoint = endpoint;
    throw error;
  }

  return response.json();
}

/**
 * Fetch all WordPress pages.
 */
export async function getPages(params = {}) {
  return apiFetch('/pages', { per_page: 100, _embed: true, ...params });
}

/**
 * Fetch a single page by slug.
 */
export async function getPage(slug) {
  const pages = await apiFetch('/pages', { slug, per_page: 1, _embed: true });
  if (!pages.length) {
    const error = new Error(`Page not found: ${slug}`);
    error.status = 404;
    throw error;
  }
  return pages[0];
}

/**
 * Fetch Directorist professional listings (lightweight card payload).
 */
export async function getProfessionals(params = {}) {
  const { search, categoryId, locationId, ...rest } = params;

  const listings = await apiFetch(
    '/at_biz_dir',
    {
      per_page: 100,
      orderby: 'modified',
      order: 'desc',
      _embed: 'wp:featuredmedia',
      _fields: LIST_FIELDS,
      ...(search ? { search } : {}),
      ...(categoryId ? { 'at_biz_dir-category': categoryId } : {}),
      ...(locationId ? { 'at_biz_dir-location': locationId } : {}),
      ...rest,
    },
    { bustCache: true },
  );
  return listings.map((item) => normalizeProfessional(item, { detail: false }));
}

/**
 * Fetch professional categories from Directorist taxonomy.
 */
export async function getProfessionalCategories() {
  const terms = await apiFetch(
    '/at_biz_dir-category',
    {
      per_page: 100,
      orderby: 'name',
      order: 'asc',
      _fields: 'id,name,parent,slug',
    },
    { bustCache: true },
  );

  return terms.map((term) => ({
    id: term.id,
    name: stripHtml(term.name),
    parent: term.parent ?? 0,
    slug: term.slug,
  }));
}

/**
 * Fetch professional locations from Directorist taxonomy.
 */
export async function getProfessionalLocations() {
  const terms = await apiFetch(
    '/at_biz_dir-location',
    {
      per_page: 100,
      orderby: 'name',
      order: 'asc',
      _fields: 'id,name,slug',
    },
    { bustCache: true },
  );

  return terms.map((term) => ({
    id: term.id,
    name: stripHtml(term.name),
    slug: term.slug,
  }));
}

/**
 * Fetch a single professional by ID (full detail payload).
 */
export async function getProfessional(id) {
  const listing = await apiFetch(
    `/at_biz_dir/${id}`,
    {
      _embed: true,
      _fields: [
        'id',
        'slug',
        'status',
        'title',
        'content',
        'excerpt',
        'uagb_excerpt',
        'featured_media',
        'at_biz_dir-category',
        'at_biz_dir-location',
        'bp_contact',
        'meta',
        '_links',
        '_embedded',
      ].join(','),
    },
    { bustCache: true },
  );
  return normalizeProfessional(listing, { detail: true });
}

export default {
  getPages,
  getPage,
  getProfessionals,
  getProfessional,
  getProfessionalCategories,
  getProfessionalLocations,
};
