import { stripHtml } from './helpers';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * True when WordPress/editor already sent structured markup worth keeping.
 */
function hasStructuredHtml(html = '') {
  return /<(h[1-6]|ul|ol|li|blockquote)\b/i.test(html);
}

const CERT_BADGE_RE = /^\s*blue\s+certificate\s+holder\s*$/i;
const COVERAGE_HEADING_RE =
  /^(cobertura|coverage|áreas?\s+de\s+cobertura|coverage\s+areas?)$/i;

function isCertBadgeText(text = '') {
  return CERT_BADGE_RE.test(text.trim());
}

function isCoverageHeading(text = '') {
  return COVERAGE_HEADING_RE.test(text.trim());
}

/** Split "Panamá, Estados Unidos, Centroamérica, Sudamérica y el Caribe." into tags. */
function parseCoverageItems(text = '') {
  const cleaned = text.replace(/[.。]+$/u, '').trim();
  if (!cleaned) return [];

  return cleaned
    .split(/\s*[,;•·|]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Read Cobertura / Coverage items from biography HTML (fallback when Locations are empty).
 */
export function extractCoverageFromBiography(html = '') {
  if (!html?.trim() || typeof DOMParser === 'undefined') return [];

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const items = [];

  const push = (list) => {
    list.forEach((item) => {
      if (item && !items.includes(item)) items.push(item);
    });
  };

  const consumeAfterHeading = (heading) => {
    let next = heading.nextElementSibling;
    while (next) {
      if (/^H[1-4]$/.test(next.tagName)) break;
      if (next.matches('ul, ol')) {
        next.querySelectorAll('li').forEach((li) => {
          const text = (li.textContent || '').trim();
          if (!text) return;
          const parts = parseCoverageItems(text);
          if (parts.length > 1) push(parts);
          else push([text.replace(/[.。]+$/u, '').trim()]);
        });
        break;
      }
      if (next.matches('p, div')) {
        const text = (next.textContent || '').trim();
        if (!text) {
          next = next.nextElementSibling;
          continue;
        }
        push(parseCoverageItems(text));
        break;
      }
      break;
    }
  };

  [...doc.body.querySelectorAll('h3, h4')].forEach((heading) => {
    const title = (heading.textContent || '').trim();
    if (!isCoverageHeading(title)) return;
    consumeAfterHeading(heading);
  });

  [...doc.body.querySelectorAll('p, li, div')].forEach((el) => {
    const raw = (el.textContent || '').trim();
    if (isCoverageHeading(raw)) return;
    const colon = raw.indexOf(':');
    if (colon === -1) return;
    const title = raw.slice(0, colon).trim();
    if (!isCoverageHeading(title)) return;
    push(parseCoverageItems(raw.slice(colon + 1)));
  });

  return items;
}

function renderCoverageHtml(title, items) {
  if (!items.length) return '';
  const tags = items
    .map((item) => `<li class="bio-tag">${escapeHtml(item)}</li>`)
    .join('');
  return (
    `<div class="bio-coverage">` +
    `<h3 class="bio-section">${escapeHtml(title)}</h3>` +
    `<ul class="bio-tags">${tags}</ul>` +
    `</div>`
  );
}

function buildCoverageElement(doc, title, items) {
  const wrap = doc.createElement('div');
  wrap.className = 'bio-coverage';

  const heading = doc.createElement('h3');
  heading.className = 'bio-section';
  heading.textContent = title;
  wrap.appendChild(heading);

  const list = doc.createElement('ul');
  list.className = 'bio-tags';
  items.forEach((item) => {
    const li = doc.createElement('li');
    li.className = 'bio-tag';
    li.textContent = item;
    list.appendChild(li);
  });
  wrap.appendChild(list);
  return wrap;
}

/** Remove Cobertura/Coverage blocks when locations taxonomy already supplies tags. */
function stripCoverageSections(doc) {
  [...doc.body.querySelectorAll('h3, h4')].forEach((heading) => {
    const title = (heading.textContent || '').trim();
    if (!isCoverageHeading(title)) return;

    let next = heading.nextElementSibling;
    while (next) {
      if (/^H[1-4]$/.test(next.tagName)) break;
      if (next.matches('ul, ol, p, div')) {
        const remove = next;
        next = next.nextElementSibling;
        remove.remove();
        // Only drop the immediate coverage body
        break;
      }
      break;
    }
    heading.remove();
  });

  [...doc.body.querySelectorAll(':scope > p, :scope > div.bio-item, :scope > .bio-coverage')].forEach(
    (el) => {
      if (el.classList?.contains('bio-coverage')) {
        el.remove();
        return;
      }
      const raw = (el.textContent || '').trim();
      if (isCoverageHeading(raw)) {
        el.remove();
        return;
      }
      const colon = raw.indexOf(':');
      if (colon === -1) return;
      const title = raw.slice(0, colon).trim();
      if (isCoverageHeading(title)) el.remove();
    },
  );
}

/** Place coverage tags first in the bio (before tagline / sections). */
function promoteCoverageBlocks(doc) {
  const coverages = [...doc.body.querySelectorAll(':scope > .bio-coverage')];
  if (!coverages.length) return;

  const first = doc.body.firstElementChild;
  coverages.forEach((el, index) => {
    if (index === 0) {
      if (first && first !== el) doc.body.insertBefore(el, first);
      return;
    }
    coverages[index - 1].after(el);
  });
}

/**
 * Turn Cobertura / Coverage sections into visible tag chips.
 */
function transformCoverageSections(doc) {
  [...doc.body.querySelectorAll('h3, h4')].forEach((heading) => {
    const title = (heading.textContent || '').trim();
    if (!isCoverageHeading(title)) return;

    const items = [];
    const toRemove = [];
    let next = heading.nextElementSibling;

    while (next) {
      if (/^H[1-4]$/.test(next.tagName)) break;

      if (next.matches('ul, ol')) {
        next.querySelectorAll('li').forEach((li) => {
          const text = (li.textContent || '').trim();
          if (!text) return;
          const parts = parseCoverageItems(text);
          if (parts.length > 1) items.push(...parts);
          else items.push(text.replace(/[.。]+$/u, '').trim());
        });
        toRemove.push(next);
        break;
      }

      if (next.matches('p, div')) {
        // Skip empty wrappers
        const text = (next.textContent || '').trim();
        if (!text) {
          toRemove.push(next);
          next = next.nextElementSibling;
          continue;
        }
        // Don't swallow the next real section
        if (isCoverageHeading(text) || (text.length < 40 && !text.includes(',') && !text.includes('.'))) {
          break;
        }
        items.push(...parseCoverageItems(text));
        toRemove.push(next);
        break;
      }

      break;
    }

    if (!items.length) return;

    const coverage = buildCoverageElement(doc, title, items);
    heading.replaceWith(coverage);
    toRemove.forEach((el) => el.remove());
  });

  // "Cobertura: Panamá, …" as a single paragraph / bio-item
  [...doc.body.querySelectorAll(':scope > p, :scope > div.bio-item')].forEach((el) => {
    const raw = (el.textContent || '').trim();
    const colon = raw.indexOf(':');
    if (colon === -1) return;
    const title = raw.slice(0, colon).trim();
    if (!isCoverageHeading(title)) return;
    const items = parseCoverageItems(raw.slice(colon + 1));
    if (!items.length) return;
    el.replaceWith(buildCoverageElement(doc, title, items));
  });

  // <p><strong>Cobertura</strong></p> + following paragraph/list
  [...doc.body.querySelectorAll(':scope > p')].forEach((el) => {
    if (el.closest('.bio-coverage')) return;
    const title = (el.textContent || '').trim();
    if (!isCoverageHeading(title)) return;

    const items = [];
    const toRemove = [];
    let next = el.nextElementSibling;

    while (next) {
      if (/^H[1-4]$/.test(next.tagName) || next.classList?.contains('bio-coverage')) break;
      if (next.matches('ul, ol')) {
        next.querySelectorAll('li').forEach((li) => {
          const text = (li.textContent || '').trim();
          if (!text) return;
          const parts = parseCoverageItems(text);
          if (parts.length > 1) items.push(...parts);
          else items.push(text.replace(/[.。]+$/u, '').trim());
        });
        toRemove.push(next);
        break;
      }
      if (next.matches('p')) {
        const text = (next.textContent || '').trim();
        if (!text) {
          toRemove.push(next);
          next = next.nextElementSibling;
          continue;
        }
        if (isCoverageHeading(text)) break;
        items.push(...parseCoverageItems(text));
        toRemove.push(next);
        break;
      }
      break;
    }

    if (!items.length) return;
    el.replaceWith(buildCoverageElement(doc, title, items));
    toRemove.forEach((node) => node.remove());
  });
}

/**
 * Remove "Blue Certificate Holder" from bio body — it already appears as the profile badge.
 */
function stripCertBadgeFromElement(el) {
  if (!el) return;

  // Drop child nodes that are only the badge (e.g. <strong>Blue Certificate Holder</strong>)
  [...el.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (isCertBadgeText(node.textContent || '')) node.remove();
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName.toLowerCase();
    if (tag === 'br') return;
    if (isCertBadgeText(node.textContent || '')) {
      // Also remove a preceding <br> so we don't leave a blank line
      const prev = node.previousSibling;
      if (prev?.nodeType === Node.ELEMENT_NODE && prev.tagName.toLowerCase() === 'br') {
        prev.remove();
      }
      node.remove();
    }
  });

  // Clean leftover trailing/leading <br>
  while (el.firstChild?.nodeType === Node.ELEMENT_NODE && el.firstChild.tagName === 'BR') {
    el.removeChild(el.firstChild);
  }
  while (el.lastChild?.nodeType === Node.ELEMENT_NODE && el.lastChild.tagName === 'BR') {
    el.removeChild(el.lastChild);
  }

  if (!(el.textContent || '').trim()) el.remove();
}

/**
 * Strip editor junk attributes but keep safe formatting tags.
 */
function sanitizeStructuredHtml(html = '', options = {}) {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc.body.querySelectorAll('script, style, iframe, object, embed').forEach((el) => el.remove());

  const allowed = new Set([
    'H1', 'H2', 'H3', 'H4', 'P', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I',
    'BR', 'BLOCKQUOTE', 'A', 'SPAN',
  ]);

  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType !== Node.ELEMENT_NODE) return;

      if (!allowed.has(child.tagName)) {
        const parent = child.parentNode;
        while (child.firstChild) parent.insertBefore(child.firstChild, child);
        parent.removeChild(child);
        return;
      }

      [...child.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name === 'href' && child.tagName === 'A') {
          const href = child.getAttribute('href') || '';
          if (!/^(https?:|mailto:|tel:)/i.test(href)) child.removeAttribute('href');
          return;
        }
        child.removeAttribute(attr.name);
      });

      walk(child);
    });
  };

  walk(doc.body);

  // Drop leading h1/h2 name — already shown in the profile header
  doc.body.querySelectorAll('h1, h2').forEach((el, index) => {
    if (index === 0) {
      el.remove();
      return;
    }
    const h3 = doc.createElement('h3');
    h3.className = 'bio-section';
    h3.innerHTML = el.innerHTML;
    el.replaceWith(h3);
  });

  doc.body.querySelectorAll('h3, h4').forEach((el) => {
    el.className = 'bio-section';
  });

  doc.body.querySelectorAll('ul, ol').forEach((el) => {
    el.className = 'bio-list';
  });

  doc.body.querySelectorAll('li').forEach((el) => {
    el.className = 'bio-list-item';
  });

  doc.body.querySelectorAll('blockquote').forEach((el) => {
    el.className = 'bio-quote';
    // Flatten ChatGPT/editor wrappers inside quotes
    const text = el.textContent?.trim();
    if (text) el.textContent = text.replace(/^[«"]\s*|\s*[»"]$/g, '').trim();
  });

  // Remove badge copy only — keep intro taglines (e.g. Fine Dining line)
  doc.body.querySelectorAll(':scope > p').forEach((el) => {
    const text = el.textContent || '';
    if (isCertBadgeText(text)) {
      el.remove();
      return;
    }
    stripCertBadgeFromElement(el);
  });

  // First short intro paragraph → highlight (tagline)
  const paragraphs = [...doc.body.querySelectorAll(':scope > p')];
  if (paragraphs[0]) {
    const text = paragraphs[0].textContent?.trim() || '';
    if (text.length > 0 && text.length < 220) {
      paragraphs[0].className = 'bio-highlight';
    }
  }

  doc.body.querySelectorAll(':scope > p').forEach((el) => {
    if (!el.className) el.className = 'bio-paragraph';
  });

  // Quoted plain paragraph → quote block
  doc.body.querySelectorAll(':scope > p.bio-paragraph').forEach((el) => {
    const text = (el.textContent || '').trim();
    const quoteMatch = text.match(/^[«"]\s*(.+?)\s*[»"]$/s);
    if (quoteMatch) {
      const quote = doc.createElement('blockquote');
      quote.className = 'bio-quote';
      quote.textContent = quoteMatch[1];
      el.replaceWith(quote);
    }
  });

  // Coverage always renders as tags inside the bio (never in the profile header).
  if (options.coverageTags?.length) {
    stripCoverageSections(doc);
    injectCoverageBlock(doc, options.coverageLabel || 'Coverage', options.coverageTags);
  } else {
    transformCoverageSections(doc);
    promoteCoverageBlocks(doc);
  }

  return doc.body.innerHTML;
}

function injectCoverageBlock(doc, title, items) {
  const unique = [...new Set(items.map((item) => String(item).trim()).filter(Boolean))];
  if (!unique.length) return;

  const coverage = buildCoverageElement(doc, title, unique);
  const highlight = doc.body.querySelector(':scope > .bio-highlight');
  if (highlight) {
    highlight.before(coverage);
    return;
  }
  const firstSection = doc.body.querySelector(':scope > h3, :scope > .bio-section');
  if (firstSection) {
    firstSection.before(coverage);
    return;
  }
  doc.body.insertBefore(coverage, doc.body.firstChild);
}

function classifyBlock(text, index) {
  const trimmed = text.trim();
  if (!trimmed) return '';
  if (isCertBadgeText(trimmed)) return '';

  const quoteMatch = trimmed.match(/^«\s*(.+?)\s*»$/s);
  if (quoteMatch) {
    return `<blockquote class="bio-quote">${escapeHtml(quoteMatch[1])}</blockquote>`;
  }

  if (/^".+"$/.test(trimmed)) {
    return `<blockquote class="bio-quote">${escapeHtml(trimmed.slice(1, -1).trim())}</blockquote>`;
  }

  const colonIndex = trimmed.indexOf(':');
  if (colonIndex !== -1) {
    const title = trimmed.slice(0, colonIndex).trim();
    const rest = trimmed.slice(colonIndex + 1).trim();

    if (isCoverageHeading(title) && rest) {
      return renderCoverageHtml(title, parseCoverageItems(rest));
    }

    if (!rest) {
      return `<h3 class="bio-section">${escapeHtml(title)}</h3>`;
    }

    if (index === 0 && title.length < 80) {
      return `<div class="bio-lead"><span class="bio-lead-name">${escapeHtml(title)}:</span> <em class="bio-lead-tagline">${escapeHtml(rest)}</em></div>`;
    }

    if (title.length < 80 && !title.includes('.')) {
      return `<div class="bio-item"><strong class="bio-item-title">${escapeHtml(title)}</strong><p class="bio-item-text">${escapeHtml(rest)}</p></div>`;
    }
  }

  // Standalone short headings (Perfil, Especialidades, …)
  if (
    trimmed.length < 40 &&
    !trimmed.includes('.') &&
    /^[A-ZÁÉÍÓÚÑ]/.test(trimmed) &&
    !trimmed.includes('|')
  ) {
    return `<h3 class="bio-section">${escapeHtml(trimmed)}</h3>`;
  }

  if (index === 1 && trimmed.length < 160) {
    return `<p class="bio-highlight">${escapeHtml(trimmed)}</p>`;
  }

  return `<p class="bio-paragraph">${escapeHtml(trimmed)}</p>`;
}

function formatPlainBlocks(blocks) {
  const htmlParts = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const trimmed = block.trim();

    if (isCoverageHeading(trimmed)) {
      let itemsText = '';
      if (i + 1 < blocks.length) {
        const next = blocks[i + 1].trim();
        const nextIsHeading =
          next.length < 40 &&
          !next.includes('.') &&
          !next.includes(',') &&
          /^[A-ZÁÉÍÓÚÑ]/.test(next) &&
          !next.includes('|');
        if (!nextIsHeading && !isCertBadgeText(next)) {
          itemsText = next;
          i += 1;
        }
      }
      const items = parseCoverageItems(itemsText);
      if (items.length) {
        htmlParts.push(renderCoverageHtml(trimmed, items));
        continue;
      }
    }

    htmlParts.push(classifyBlock(block, i));
  }

  return htmlParts.join('');
}

function splitIntoBlocks(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const blocks = [];

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) blocks.push(text);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.tagName.toLowerCase();

    if (tag === 'p' || tag === 'blockquote' || tag === 'h2' || tag === 'h3' || tag === 'li') {
      const innerHtml = node.innerHTML ?? '';
      const parts = innerHtml
        .split(/<br\b[^>]*>/i)
        .map((part) => stripHtml(part).trim())
        .filter(Boolean);

      if (parts.length) {
        parts.forEach((part) => blocks.push(part));
      } else {
        const text = node.textContent?.trim();
        if (text) blocks.push(text);
      }
      return;
    }

    if (tag === 'br') return;

    [...node.childNodes].forEach(walk);
  };

  [...doc.body.childNodes].forEach(walk);

  if (blocks.length === 0) {
    const plain = stripHtml(html);
    if (!plain) return [];
    return plain.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  }

  return blocks;
}

/**
 * Format Directorist/WP biography HTML for the profile page.
 * Keeps structured markup (headings/lists); falls back to plain-text heuristics.
 * Coverage always appears in the bio as tags (from locations taxonomy and/or Cobertura text).
 *
 * @param {string} html
 * @param {{ coverageTags?: string[], coverageLabel?: string }} [options]
 */
export function formatBiography(html = '', options = {}) {
  if (!html?.trim()) {
    if (options.coverageTags?.length) {
      const doc = new DOMParser().parseFromString('', 'text/html');
      injectCoverageBlock(doc, options.coverageLabel || 'Coverage', options.coverageTags);
      return doc.body.innerHTML;
    }
    return '';
  }

  if (hasStructuredHtml(html)) {
    return sanitizeStructuredHtml(html, options);
  }

  const blocks = splitIntoBlocks(html);
  // Skip a bare name line at the top (already in the profile header)
  const start =
    blocks[0] &&
    blocks[0].length < 80 &&
    !blocks[0].includes('|') &&
    !blocks[0].includes('.') &&
    !blocks[0].includes(':')
      ? 1
      : 0;

  let out = formatPlainBlocks(blocks.slice(start));
  const doc = new DOMParser().parseFromString(out || '<p></p>', 'text/html');

  if (options.coverageTags?.length) {
    stripCoverageSections(doc);
    injectCoverageBlock(doc, options.coverageLabel || 'Coverage', options.coverageTags);
  } else {
    promoteCoverageBlocks(doc);
  }

  return doc.body.innerHTML;
}
