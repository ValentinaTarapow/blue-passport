const PARTNER_CODES = (import.meta.env.VITE_PARTNER_DISCOUNT_CODES || '')
  .split(',')
  .map((code) => code.trim().toUpperCase())
  .filter(Boolean);

export function normalizePartnerCode(code) {
  return (code || '').trim().toUpperCase();
}

export function isValidPartnerCode(code) {
  const normalized = normalizePartnerCode(code);
  return normalized.length > 0 && PARTNER_CODES.includes(normalized);
}
