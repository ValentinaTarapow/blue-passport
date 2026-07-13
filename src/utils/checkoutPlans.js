export const CHECKOUT_PLANS = [
  {
    id: 'standard',
    price: '€50 / year',
  },
  {
    id: 'standard_course',
    price: '€150 / year',
  },
  {
    id: 'partner',
    price: '€25 / year',
  },
  {
    id: 'partner_course',
    price: '€125 / year',
  },
];

export function getCheckoutPlanById(planId) {
  return CHECKOUT_PLANS.find((plan) => plan.id === planId) ?? CHECKOUT_PLANS[0];
}
