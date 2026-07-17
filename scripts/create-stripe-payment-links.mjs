import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const SUCCESS_URL = 'https://thebluepassport.org/blue-passport/success';

const PLANS = [
  {
    id: 'crew',
    env: 'VITE_STRIPE_PLAN_CREW',
    amount: 15000,
    name: 'Blue Crew Member',
    description:
      'Annual membership for onboard megayacht professionals. Includes directory listing and Validación Blue (€50 listing + €100 credential validation).',
  },
  {
    id: 'expert',
    env: 'VITE_STRIPE_PLAN_EXPERT',
    amount: 15000,
    name: 'Blue Expert Member',
    description:
      'Annual membership for technical, legal or service professionals. Includes directory listing and Elite Yacht Protocol certification (€50 listing + €100 course).',
  },
  {
    id: 'partner',
    env: 'VITE_STRIPE_PLAN_PARTNER',
    amount: 5000,
    name: 'Blue Certified Partner',
    description:
      'Annual directory membership for professionals and companies with a valid Blue Certificate. Includes featured profile and Blue Certified Partner badge. Credential validation fees are waived.',
  },
];

function getStripeKey() {
  const mcp = JSON.parse(readFileSync(resolve(root, '.cursor/mcp.json'), 'utf8'));
  const auth = mcp.mcpServers?.stripe?.headers?.Authorization;

  if (!auth?.startsWith('Bearer ')) {
    throw new Error('Stripe secret key not found in .cursor/mcp.json');
  }

  return auth.slice(7);
}

async function stripe(path, method = 'GET', body) {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${getStripeKey()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body ? new URLSearchParams(body).toString() : undefined,
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`${method} ${path}: ${data.error.message}`);
  }

  return data;
}

async function findProduct(planId) {
  const query = `active:'true' AND metadata['blue_passport_plan_id']:'${planId}'`;
  const result = await stripe(`/products/search?query=${encodeURIComponent(query)}`);
  return result.data[0] ?? null;
}

async function findPrice(productId, amount) {
  const result = await stripe(`/prices?product=${productId}&active=true&limit=100`);

  return (
    result.data.find(
      (price) =>
        price.unit_amount === amount &&
        price.currency === 'eur' &&
        price.recurring?.interval === 'year',
    ) ?? null
  );
}

async function findPaymentLink(planId) {
  const result = await stripe('/payment_links?limit=100&active=true');
  return result.data.find((link) => link.metadata?.blue_passport_plan_id === planId) ?? null;
}

async function ensurePlan(plan) {
  let product = await findProduct(plan.id);

  if (!product) {
    product = await stripe('/products', 'POST', {
      name: plan.name,
      description: plan.description,
      'metadata[blue_passport_plan_id]': plan.id,
    });
    console.log(`Created product: ${plan.id}`);
  } else if (product.name !== plan.name || product.description !== plan.description) {
    product = await stripe(`/products/${product.id}`, 'POST', {
      name: plan.name,
      description: plan.description,
    });
    console.log(`Updated product: ${plan.id}`);
  } else {
    console.log(`Reusing product: ${plan.id}`);
  }

  let price = await findPrice(product.id, plan.amount);

  if (!price) {
    price = await stripe('/prices', 'POST', {
      product: product.id,
      unit_amount: String(plan.amount),
      currency: 'eur',
      'recurring[interval]': 'year',
      'metadata[blue_passport_plan_id]': plan.id,
    });
    console.log(`Created price: ${plan.id} (€${plan.amount / 100}/year)`);
  } else {
    console.log(`Reusing price: ${plan.id}`);
  }

  let paymentLink = await findPaymentLink(plan.id);

  if (!paymentLink) {
    paymentLink = await stripe('/payment_links', 'POST', {
      'line_items[0][price]': price.id,
      'line_items[0][quantity]': '1',
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': SUCCESS_URL,
      'metadata[blue_passport_plan_id]': plan.id,
      billing_address_collection: 'auto',
      allow_promotion_codes: 'false',
    });
    console.log(`Created payment link: ${plan.id}`);
  } else {
    console.log(`Reusing payment link: ${plan.id}`);
  }

  return {
    env: plan.env,
    url: paymentLink.url,
  };
}

function updateEnvFile(links) {
  const envPath = resolve(root, '.env');
  let env = readFileSync(envPath, 'utf8');

  for (const { env: key, url } of links) {
    const pattern = new RegExp(`^${key}=.*$`, 'm');

    if (pattern.test(env)) {
      env = env.replace(pattern, `${key}=${url}`);
    } else {
      env += `\n${key}=${url}`;
    }
  }

  env = env.replace(/^VITE_STRIPE_MOCK=.*$/m, 'VITE_STRIPE_MOCK=false');

  writeFileSync(envPath, env, 'utf8');
}

const links = [];

for (const plan of PLANS) {
  links.push(await ensurePlan(plan));
}

updateEnvFile(links);

console.log('\nPayment links ready:');
for (const link of links) {
  console.log(`${link.env}=${link.url}`);
}
