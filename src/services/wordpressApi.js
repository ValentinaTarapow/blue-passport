import { buildQueryString, normalizeProfessional, stripHtml } from '../utils/helpers';

const API_BASE = import.meta.env.VITE_WP_API_URL || '/wp-json/wp/v2';

const DEFAULT_PARAMS = {
  _embed: true,
};

/**
 * Centralized fetch wrapper for WordPress REST API.
 */
async function apiFetch(endpoint, params = {}) {
  const query = buildQueryString({ ...DEFAULT_PARAMS, ...params });
  const url = `${API_BASE}${endpoint}${query}`;

  const response = await fetch(url, {
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
  return apiFetch('/pages', { per_page: 100, ...params });
}

/**
 * Fetch a single page by slug.
 */
export async function getPage(slug) {
  const pages = await apiFetch('/pages', { slug, per_page: 1 });
  if (!pages.length) {
    const error = new Error(`Page not found: ${slug}`);
    error.status = 404;
    throw error;
  }
  return pages[0];
}

/**
 * Fetch all Directorist professional listings.
 */
export async function getProfessionals(params = {}) {
  const { search, categoryId, locationId, ...rest } = params;

  const listings = await apiFetch('/at_biz_dir', {
    per_page: 100,
    orderby: 'date',
    order: 'desc',
    ...(search ? { search } : {}),
    ...(categoryId ? { 'at_biz_dir-category': categoryId } : {}),
    ...(locationId ? { 'at_biz_dir-location': locationId } : {}),
    ...rest,
  });
  return listings.map(normalizeProfessional);
}

/**
 * Fetch professional categories from Directorist taxonomy.
 */
export async function getProfessionalCategories() {
  const terms = await apiFetch('/at_biz_dir-category', {
    per_page: 100,
    orderby: 'name',
    order: 'asc',
    _embed: false,
  });

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
  const terms = await apiFetch('/at_biz_dir-location', {
    per_page: 100,
    orderby: 'name',
    order: 'asc',
    _embed: false,
  });

  return terms.map((term) => ({
    id: term.id,
    name: stripHtml(term.name),
    slug: term.slug,
  }));
}

/**
 * Fetch a single professional by ID.
 */
export async function getProfessional(id) {
  const listing = await apiFetch(`/at_biz_dir/${id}`);
  return normalizeProfessional(listing);
}

export default {
  getPages,
  getPage,
  getProfessionals,
  getProfessional,
  getProfessionalCategories,
  getProfessionalLocations,
};
