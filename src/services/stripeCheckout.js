import { isStripeMockLink } from '../config/stripeEnv';

function buildMockCheckoutUrl(application) {
  const url = new URL('/blue-passport/success', window.location.origin);

  if (application?.id) {
    url.searchParams.set('application_id', application.id);
  }

  if (application?.email) {
    url.searchParams.set('prefilled_email', application.email);
  }

  return url.toString();
}

/**
 * Build a Stripe Payment Link URL with prefilled email and application reference.
 * client_reference_id requires Checkout Sessions API (backend); for Payment Links we
 * persist the application id in sessionStorage before redirect.
 *
 * When VITE_STRIPE_MOCK=true or links use mock://, redirects locally to /blue-passport/success.
 */
export function buildStripePaymentUrl(paymentLink, application) {
  if (!paymentLink) return null;

  if (isStripeMockLink(paymentLink)) {
    return buildMockCheckoutUrl(application);
  }

  if (!application?.email) return paymentLink;

  try {
    const url = new URL(paymentLink);
    url.searchParams.set('prefilled_email', application.email);
    return url.toString();
  } catch {
    const separator = paymentLink.includes('?') ? '&' : '?';
    return `${paymentLink}${separator}prefilled_email=${encodeURIComponent(application.email)}`;
  }
}
