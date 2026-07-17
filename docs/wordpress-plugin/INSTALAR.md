# Instalar el plugin Blue Passport API en WordPress

Este plugin reemplaza a la API Node (`blue-passport-api`). Todo el flujo de pago corre en WordPress:

- `POST /wp-json/blue-passport/v1/create-checkout-session` — crea el Checkout de Stripe con trial de 7 días
- `GET /wp-json/blue-passport/v1/checkout-session/{id}` — verifica el pago
- `GET/POST /wp-json/blue-passport/v1/applications/...` — guarda la aplicación y el perfil
- `POST /wp-json/blue-passport/v1/contact` — formulario de contacto (CF7 o wp_mail → pagos@…)
- `POST .../publish-draft` — crea el listing de Directorist en **pending**
- Al usar **Aprobar y cobrar** → Stripe cobra; solo si el pago OK se publica
- Al mandar a **papelera** (sin cobro previo) → cancela la suscripción sin cobro
- Publicar a mano sin cobro confirmado → queda bloqueado (vuelve a pending)

---

## Paso 1 — Subir el plugin (FileZilla)

1. Conectate por sFTP (`a07.stretch.live`, usuario `su1218139`)
2. Navegá a `public/wp-content/plugins/`
3. Creá una carpeta nueva: clic derecho → **Create directory** → `blue-passport-api`
4. Entrá a esa carpeta y subí el archivo `blue-passport-api.php` (arrastralo desde tu Mac, está en `docs/wordpress-plugin/`)

Resultado: `public/wp-content/plugins/blue-passport-api/blue-passport-api.php`

## Paso 2 — Configurar wp-config.php

Ya tenés `BLUE_PASSPORT_STRIPE_SECRET_KEY`. Agregá debajo (antes de "That's all, stop editing!"):

```php
// Blue Passport — Stripe prices (Dashboard → Products → cada plan → Price ID)
define('BLUE_PASSPORT_STRIPE_PRICE_CREW', 'price_1TuH9U4liFjrlSo91IMKSCI7');   // 150 €/año — Blue Crew Member
define('BLUE_PASSPORT_STRIPE_PRICE_EXPERT', 'price_1TuHBZ4liFjrlSo9oj6EAIf6'); // 150 €/año — Blue Expert Member
define('BLUE_PASSPORT_STRIPE_PRICE_PARTNER', 'price_1TuIpe4liFjrlSo9OU6ZihxR'); // 50 €/año — Blue Certified Partner

// Dominio donde vive el front React (Vercel o el propio dominio)
define('BLUE_PASSPORT_FRONTEND_URL', 'https://thebluepassport.org');

// Email de avisos (nueva solicitud, día 5, auto-rechazo día 7). Varios separados por coma.
// tarapow.v@gmail.com se agrega siempre desde el plugin.
define('BLUE_PASSPORT_ADMIN_EMAIL', 'pagos@thebluepassport.es,tarapow.v@gmail.com');

// Opcional: ID del formulario Contact Form 7 (Contacto → editar form → shortcode id="123")
// define('BLUE_PASSPORT_CF7_FORM_ID', 123);
```

> Los **Price IDs** salen de Stripe Dashboard → Products → clic en el producto → sección Pricing → `price_...`
> Cada variable lleva un `price_...`, **no** un `prod_...`.

> En Contact Form 7 configurá el mail **To:** `pagos@thebluepassport.es`. Idealmente campos `your-name`, `your-email`, `your-message` (el plugin también acepta aliases).

## Paso 3 — Activar el plugin

1. WP Admin → **Plugins**
2. Buscá **Blue Passport API** → **Activar**

Si al activar da error fatal por funciones duplicadas: borrá de `functions.php` del tema los hooks de Stripe que hayas pegado antes (el plugin ya los incluye).

## Paso 4 — Configurar el front React

En Vercel (o `.env` de producción):

```env
VITE_API_URL=https://thebluepassport.org/wp-json/blue-passport/v1
VITE_WP_API_URL=https://thebluepassport.org/wp-json/wp/v2
VITE_CONTACT_EMAIL=pagos@thebluepassport.es
```

## Paso 5 — Probar en modo test

1. Poné `sk_test_...` y Price IDs de test en `wp-config.php`
2. En el sitio: `/blue-passport/become-a-member` → completar → pagar con `4242 4242 4242 4242`
3. Verificá:
   - Stripe (test) → Customers → suscripción en **trialing**, €0 cobrado
   - Redirige a `/payment/success` → completar perfil
   - WP Admin → Directorist → Listings → aparece **Pending**
4. **Aprobar y cobrar** el listing → en Stripe la suscripción pasa a **active**, cobra el año y el listing se publica
5. Si el cobro falla (tarjeta inválida) → listing **sigue pending**, no se publica
6. Con otro listing de prueba: **Papelera** → en Stripe la suscripción queda **canceled**, sin cobro

> No uses solo “Publicar” de WordPress para listings Blue Passport: el plugin lo bloquea hasta confirmar el pago.

### Revisión automática (días 5 y 7)

El plugin agenda un cron diario (`bpapi_daily_review_check`):

- **Día 5:** email al admin (`BLUE_PASSPORT_ADMIN_EMAIL` o `admin_email`) recordando revisar.
- **Día 7:** si sigue pending → auto-papelera → cancela Stripe sin cobro + email al solicitante.

Tras subir el plugin nuevo: **Plugins → desactivar Blue Passport API → Activar** (para registrar el cron), o simplemente esperá el próximo `init` (también se auto-agenda).

Para forzar una prueba: editá el meta `_bp_review_deadline` del listing a una fecha pasada y ejecutá el evento con el plugin **WP Crontrol** → Events → `bpapi_daily_review_check` → Run now.

## Paso 6 — Pasar a live

1. Cambiar `sk_test_` → `sk_live_` y Price IDs test → live en `wp-config.php`
2. Hacer una prueba real (se puede reembolsar desde el Dashboard)

---

## Dónde ver las aplicaciones

WP Admin → menú **BP Applications**: una entrada por cada persona que inició el checkout, con su estado (`pending_payment`, `paid_pending_profile`, `pending_review`, `approved`, `rejected`).
