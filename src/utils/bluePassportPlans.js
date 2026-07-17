import { STRIPE_PAYMENT_LINKS } from '../config/stripeEnv';

/**
 * Annual membership via Stripe Payment Links / Checkout.
 * - crew: €150/year — Blue Crew Member (directory + Validación Blue)
 * - expert: €150/year — Blue Expert Member (directory + Elite Yacht Protocol)
 * - partner: €50/year — Blue Certified Partner (directory only; Blue Certificate holders)
 */
export const BLUE_PASSPORT_PLANS = [
  {
    id: 'crew',
    stripePaymentLink: STRIPE_PAYMENT_LINKS.crew,
  },
  {
    id: 'expert',
    stripePaymentLink: STRIPE_PAYMENT_LINKS.expert,
  },
  {
    id: 'partner',
    stripePaymentLink: STRIPE_PAYMENT_LINKS.partner,
  },
];

export function getPlanById(planId) {
  return BLUE_PASSPORT_PLANS.find((plan) => plan.id === planId) ?? BLUE_PASSPORT_PLANS[0];
}

/** Legacy apply form: onboard experience → Crew; otherwise Expert (+ Elite Yacht Protocol). */
export function resolveApplicationPlan({ hasProtocolTraining }) {
  return hasProtocolTraining ? 'crew' : 'expert';
}
