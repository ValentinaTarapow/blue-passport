export const CHECKOUT_PLANS = [
  {
    id: 'crew',
    price: '€150 / year',
  },
  {
    id: 'expert',
    price: '€150 / year',
  },
  {
    id: 'partner',
    price: '€50 / year',
  },
];

export function getCheckoutPlanById(planId) {
  return CHECKOUT_PLANS.find((plan) => plan.id === planId) ?? CHECKOUT_PLANS[0];
}
