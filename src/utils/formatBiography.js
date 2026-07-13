import { stripHtml } from './helpers';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function classifyBlock(text, index) {
  const trimmed = text.trim();
  if (!trimmed) return '';

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

  if (index === 1 && trimmed.length < 160) {
    return `<p class="bio-highlight">${escapeHtml(trimmed)}</p>`;
  }

  return `<p class="bio-paragraph">${escapeHtml(trimmed)}</p>`;
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
        .split(/<br\s*\/?>/i)
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

export function formatBiography(html = '') {
  if (!html?.trim()) return '';

  const blocks = splitIntoBlocks(html);
  return blocks.map((block, index) => classifyBlock(block, index)).join('');
}
