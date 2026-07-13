import { STRIPE_PAYMENT_LINKS } from '../config/stripeEnv';
import { isValidPartnerCode } from './partnerDiscountCodes';

/**
 * Annual membership via Stripe Payment Links.
 * - annual_protocol: €50/year — applicant already has yacht/megayacht protocol training
 * - annual_protocol_course: €150/year — includes Elite Yacht Protocol (+€100)
 * Partner codes use separate Stripe links (amount configured in Stripe).
 */
export const BLUE_PASSPORT_PLANS = [
  {
    id: 'annual_protocol',
    stripePaymentLink: STRIPE_PAYMENT_LINKS.annual_protocol,
  },
  {
    id: 'annual_protocol_course',
    stripePaymentLink: STRIPE_PAYMENT_LINKS.annual_protocol_course,
  },
  {
    id: 'partner_protocol',
    stripePaymentLink: STRIPE_PAYMENT_LINKS.partner_protocol,
  },
  {
    id: 'partner_protocol_course',
    stripePaymentLink: STRIPE_PAYMENT_LINKS.partner_protocol_course,
  },
];

export function getPlanById(planId) {
  return BLUE_PASSPORT_PLANS.find((plan) => plan.id === planId) ?? BLUE_PASSPORT_PLANS[0];
}

export function resolveApplicationPlan({ hasProtocolTraining, partnerCode }) {
  const isPartner = isValidPartnerCode(partnerCode);

  if (hasProtocolTraining) {
    return isPartner ? 'partner_protocol' : 'annual_protocol';
  }

  return isPartner ? 'partner_protocol_course' : 'annual_protocol_course';
}
