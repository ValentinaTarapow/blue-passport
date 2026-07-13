/**
 * Stripe Payment Link env vars.
 * Replace mock:// URLs with real https://buy.stripe.com/... links from the client.
 * Set VITE_STRIPE_MOCK=false (or remove it) before production deploy.
 */
export const STRIPE_MOCK_ENABLED = import.meta.env.VITE_STRIPE_MOCK === 'true';

export const STRIPE_PAYMENT_LINKS = {
  annual_protocol:
    import.meta.env.VITE_STRIPE_PLAN_ANNUAL_PROTOCOL ||
    import.meta.env.VITE_STRIPE_PLAN_STANDARD ||
    import.meta.env.VITE_BLUE_PASSPORT_PAYMENT_LINK ||
    '',
  annual_protocol_course: import.meta.env.VITE_STRIPE_PLAN_ANNUAL_PROTOCOL_COURSE || '',
  partner_protocol:
    import.meta.env.VITE_STRIPE_PLAN_PARTNER_PROTOCOL ||
    import.meta.env.VITE_STRIPE_PLAN_PARTNER ||
    '',
  partner_protocol_course: import.meta.env.VITE_STRIPE_PLAN_PARTNER_PROTOCOL_COURSE || '',
};

export function isStripeMockLink(paymentLink) {
  return STRIPE_MOCK_ENABLED || (paymentLink || '').startsWith('mock://');
}

export function hasStripePaymentLinksConfigured() {
  return Object.values(STRIPE_PAYMENT_LINKS).some(Boolean);
}
