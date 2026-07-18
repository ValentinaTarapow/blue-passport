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
 * Prefers the requested size, then common card-friendly sizes.
 */
export function getFeaturedImage(item, size = 'medium') {
  const media = item?._embedded?.['wp:featuredmedia']?.[0];
  if (!media) {
    const uagb = item?.uagb_featured_image_src;
    if (Array.isArray(uagb)) return uagb[0] || null;
    if (typeof uagb === 'string') return uagb || null;
    if (uagb && typeof uagb === 'object') {
      return uagb[size] || uagb.medium || uagb.thumbnail || uagb.full || null;
    }
    return null;
  }

  const sizes = media.media_details?.sizes ?? {};
  return (
    sizes[size]?.source_url ||
    sizes.medium?.source_url ||
    sizes.thumbnail?.source_url ||
    sizes.directorist_preview?.source_url ||
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
 * @param {object} item
 * @param {{ detail?: boolean }} [options] — detail includes full biography/content.
 */
export function normalizeProfessional(item, { detail = false } = {}) {
  if (!item) return null;

  const embeddedCategories = getTaxonomyTerms(item, 'at_biz_dir-category');
  const embeddedLocations = getTaxonomyTerms(item, 'at_biz_dir-location');
  const categoryIds = (item['at_biz_dir-category'] ?? []).map(Number).filter(Boolean);
  const locationIds = (item['at_biz_dir-location'] ?? []).map(Number).filter(Boolean);
  const categoryById = new Map(
    embeddedCategories.map((category) => [Number(category.id), category]),
  );
  const displayCategoryTerms = pickDisplayCategoryTerms(embeddedCategories);
  const primaryCategory = displayCategoryTerms[0] || pickPrimaryCategory(embeddedCategories);
  const meta = item.meta ?? {};
  const contact = item.bp_contact ?? {};

  const excerpt =
    item.uagb_excerpt ||
    item.excerpt?.rendered ||
    (detail ? item.content?.rendered : '') ||
    '';

  const social = Array.isArray(contact.social)
    ? contact.social.filter((link) => link?.id && link?.url)
    : [];

  const linkedin =
    social.find((link) => link.id === 'linkedin')?.url ||
    meta._linkedin ||
    '';

  const address = String(
    contact.address || meta._address || meta.address || '',
  ).trim();
  const coverage = embeddedLocations.map((loc) => stripHtml(loc.name)).filter(Boolean);
  const taxonomyLocation = coverage.join(', ');
  const categoryNames = displayCategoryTerms.map((category) => stripHtml(category.name));
  const categoryDirectories = displayCategoryTerms.map((category) =>
    resolveCategoryDirectoryName(category, categoryById),
  );

  return {
    id: item.id,
    slug: item.slug,
    name: stripHtml(item.title?.rendered),
    description: stripHtml(excerpt),
    biography: detail ? (item.content?.rendered ?? '') : '',
    category: categoryNames[0] || stripHtml(primaryCategory?.name ?? ''),
    categories: categoryNames,
    categoryDirectories,
    categoryIds,
    locationIds,
    coverage,
    location: taxonomyLocation || address,
    address,
    physicalAddress: address,
    featuredImage: getFeaturedImage(item, detail ? 'large' : 'medium'),
    email: contact.email || meta._email || meta.email || '',
    phone: contact.phone || meta._phone || meta.phone || '',
    whatsapp: contact.whatsapp || contact.phone2 || meta._phone2 || '',
    website: contact.website || meta._website || meta.website || '',
    linkedin,
    social,
    isCertificateHolder: resolveCertificateHolder(contact, item),
  };
}

function resolveCertificateHolder(contact = {}, item = {}) {
  const flag = contact.certificateHolder;
  if (flag === true || flag === 1 || flag === '1' || flag === 'yes') return true;
  if (flag === false || flag === 0 || flag === '0' || flag === 'no') return false;
  // Until the plugin flag is deployed, published directory profiles show the seal.
  return item?.status ? item.status === 'publish' : true;
}

/**
 * Prefer leaf specialties when parents were auto-selected with children
 * (e.g. show "Nanny · Pet Sitter", not "Household · Nanny · Pet Sitter").
 */
export function pickDisplayCategoryTerms(terms = []) {
  if (!terms.length) return [];

  const leaves = terms.filter(
    (term) => !terms.some((other) => Number(other.parent) === Number(term.id)),
  );
  const preferred = leaves.filter((term) => Number(term.parent) > 0);
  return preferred.length ? preferred : leaves.length ? leaves : terms;
}

/**
 * Parent directory name for a specialty term (empty when it is already a root).
 */
function resolveCategoryDirectoryName(term, byId) {
  const parentId = Number(term?.parent);
  if (!parentId) return '';
  const parent = byId.get(parentId);
  return parent ? stripHtml(parent.name).trim() : '';
}

/**
 * Human-readable specialties string for cards and profile header.
 * Leaf specialties include their parent directory in parentheses when available,
 * e.g. "Psicología & Coaching Naval (Wellbeing)".
 */
export function formatProfessionalCategories(professional) {
  const list = (professional?.categories || []).filter(Boolean);
  if (!list.length) return professional?.category || '';

  const directories = professional?.categoryDirectories || [];
  if (!directories.some(Boolean)) return list.join(' · ');

  const groups = [];
  list.forEach((name, index) => {
    const directory = directories[index] || '';
    const last = groups[groups.length - 1];
    if (last && last.directory === directory) {
      last.names.push(name);
      return;
    }
    groups.push({ directory, names: [name] });
  });

  return groups
    .map(({ directory, names }) =>
      directory ? `${names.join(' · ')} (${directory})` : names.join(' · '),
    )
    .join(' · ');
}

/**
 * Fill category labels from taxonomy terms when the list payload only has IDs.
 */
export function withResolvedCategories(professional, taxonomy = []) {
  if (!professional) return null;

  if (professional.categoryIds?.length && taxonomy.length) {
    const byId = new Map(taxonomy.map((category) => [Number(category.id), category]));
    const matched = professional.categoryIds
      .map((id) => byId.get(Number(id)))
      .filter(Boolean);

    if (matched.length) {
      const display = pickDisplayCategoryTerms(matched);
      const names = display.map((category) => category.name).filter(Boolean);
      if (names.length) {
        return {
          ...professional,
          category: names[0],
          categories: names,
          categoryDirectories: display.map((category) =>
            resolveCategoryDirectoryName(category, byId),
          ),
        };
      }
    }
  }

  const existing = (professional.categories || []).filter(Boolean);
  if (existing.length) {
    return {
      ...professional,
      category: professional.category || existing[0],
      categories: existing,
      categoryDirectories:
        professional.categoryDirectories?.length === existing.length
          ? professional.categoryDirectories
          : existing.map(() => ''),
    };
  }

  if (professional.category) {
    return {
      ...professional,
      categories: [professional.category],
      categoryDirectories: professional.categoryDirectories?.length
        ? professional.categoryDirectories
        : [''],
    };
  }

  return professional;
}

/**
 * Resolve Directorist location term IDs (and keep address as fallback).
 */
export function withResolvedLocations(professional, taxonomy = []) {
  if (!professional) return null;
  if (!professional.locationIds?.length || !taxonomy.length) return professional;

  const byId = new Map(taxonomy.map((location) => [Number(location.id), location]));
  const names = professional.locationIds
    .map((id) => byId.get(Number(id))?.name)
    .filter(Boolean);

  if (!names.length) return professional;

  const taxonomyLocation = names.join(', ');
  return {
    ...professional,
    coverage: names,
    location: taxonomyLocation || professional.location || professional.address || '',
    address: professional.address || professional.physicalAddress || '',
    physicalAddress: professional.physicalAddress || professional.address || '',
  };
}

/**
 * Resolve category + location labels for directory cards.
 */
export function withResolvedTaxonomies(professional, categories = [], locations = []) {
  return withResolvedLocations(
    withResolvedCategories(professional, categories),
    locations,
  );
}

/**
 * Build a WhatsApp chat URL from a phone number or existing wa.me link.
 */
export function toWhatsAppUrl(value = '') {
  const trimmed = String(value).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
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
