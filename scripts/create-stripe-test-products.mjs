/**
 * Create Blue Passport Stripe products + annual prices in TEST mode.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/create-stripe-test-products.mjs
 *
 * Prints Price IDs to paste into wp-config.php.
 */

const SECRET = process.env.STRIPE_SECRET_KEY || '';

if (!SECRET.startsWith('sk_test_')) {
  console.error('Set STRIPE_SECRET_KEY to a sk_test_... key (Test mode only).');
  process.exit(1);
}

const PRODUCTS = [
  {
    env: 'BLUE_PASSPORT_STRIPE_PRICE_CREW',
    name: 'Blue Crew Member',
    description:
      'Annual membership for onboard megayacht professionals. Includes directory listing and Validación Blue (€50 listing + €100 credential validation).',
    amount: 15000, // €150.00
  },
  {
    env: 'BLUE_PASSPORT_STRIPE_PRICE_EXPERT',
    name: 'Blue Expert Member',
    description:
      'Annual membership for technical, legal or service professionals. Includes directory listing and Elite Yacht Protocol certification (€50 listing + €100 course).',
    amount: 15000, // €150.00
  },
  {
    env: 'BLUE_PASSPORT_STRIPE_PRICE_PARTNER',
    name: 'Blue Certified Partner',
    description:
      'Annual directory membership for Blue Certificate holders. Featured profile and Blue Certified Partner badge; credential validation fees waived (€50 annual directory fee).',
    amount: 5000, // €50.00
  },
];

async function stripeForm(path, params) {
  const body = new URLSearchParams(params);
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || JSON.stringify(data));
  }
  return data;
}

async function main() {
  console.log('Creating TEST products and yearly prices...\n');
  const lines = [];

  for (const product of PRODUCTS) {
    const created = await stripeForm('/products', {
      name: product.name,
      description: product.description,
    });

    const price = await stripeForm('/prices', {
      product: created.id,
      currency: 'eur',
      unit_amount: String(product.amount),
      'recurring[interval]': 'year',
    });

    console.log(`✓ ${product.name}`);
    console.log(`  product: ${created.id}`);
    console.log(`  price:   ${price.id} (€${(product.amount / 100).toFixed(0)}/year)\n`);

    lines.push(`define('${product.env}', '${price.id}');`);
  }

  console.log('--- Paste into wp-config.php (TEST) ---\n');
  console.log("define('BLUE_PASSPORT_STRIPE_SECRET_KEY', 'sk_test_...');");
  for (const line of lines) console.log(line);
  console.log("define('BLUE_PASSPORT_FRONTEND_URL', 'https://thebluepassport.org');");
  console.log("define('BLUE_PASSPORT_TRIAL_DAYS', 7);");
}

main().catch((error) => {
  console.error('Failed:', error.message);
  process.exit(1);
});
