/**
 * Stripe Payment Link env vars.
 * Replace mock:// URLs with real https://buy.stripe.com/... links from the client.
 * Set VITE_STRIPE_MOCK=false (or remove it) before production deploy.
 */
export const STRIPE_MOCK_ENABLED = import.meta.env.VITE_STRIPE_MOCK === 'true';

export const STRIPE_PAYMENT_LINKS = {
  crew: import.meta.env.VITE_STRIPE_PLAN_CREW || '',
  expert: import.meta.env.VITE_STRIPE_PLAN_EXPERT || '',
  partner: import.meta.env.VITE_STRIPE_PLAN_PARTNER || '',
};

export function isStripeMockLink(paymentLink) {
  return STRIPE_MOCK_ENABLED || (paymentLink || '').startsWith('mock://');
}

export function hasStripePaymentLinksConfigured() {
  return Object.values(STRIPE_PAYMENT_LINKS).some(Boolean);
}
