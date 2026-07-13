# Blue Passport — onboarding

Arquitectura detallada en [`docs/stripe.md`](./stripe.md).

```
React → Formulario corto → Stripe Checkout (trial 7 días) → Perfil completo → Backend → Directorist pending → Admin aprueba/rechaza
```

## Arquitectura

```
React (5180)
      │
      ▼
Node API (3001)  — blue-passport-api
      │
 ┌────┴────────┐
 ▼             ▼
Stripe     WordPress / Directorist
```

## Flujo (autorizar y capturar)

1. El usuario completa el formulario corto en `/blue-passport/become-a-member`.
2. Stripe Checkout vincula la tarjeta con **7 días de prueba** (`STRIPE_TRIAL_DAYS=7`).
3. Tras el checkout, vuelve a `/payment/success?session_id=...`.
4. Completa el perfil en `/blue-passport/profile` o `/crear-anuncio?session_id=...`.
5. El backend crea el anuncio en Directorist con `status: pending` y `meta._stripe_session_id`.
6. Si el admin **publica** en WordPress → se cobra el año completo (hook PHP).
7. Si el admin **mueve a papelera** → se cancela la suscripción sin cobro (hook PHP).

## Rutas React

| Ruta | Descripción |
|------|-------------|
| `/blue-passport` | Landing |
| `/blue-passport/become-a-member` | Formulario corto + plan |
| `/payment/success` | Checkout OK → CTA completar perfil |
| `/payment/cancel` | Checkout cancelado |
| `/blue-passport/profile?applicationId=` | Perfil completo post-checkout |
| `/crear-anuncio?session_id=` | Alias del perfil (compatible con la guía Stripe) |

## API (`blue-passport-api`)

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/create-checkout-session` | Crea Checkout Session con trial |
| `GET /api/checkout-session/:sessionId` | Verifica checkout (incluye trial) |
| `POST /api/applications/:id/profile` | Guarda perfil completo |
| `POST /api/applications/:id/publish-draft` | Crea listing **pending** en Directorist |

## Planes (body `plan`)

| ID | Tarifa |
|----|--------|
| `standard` | 50 €/año — con protocolo |
| `standard_course` | 150 €/año — con curso Elite Yacht Protocol |
| `partner` | 25 €/año — partner con protocolo |
| `partner_course` | 125 €/año — partner + curso |

## Configuración

### API (`blue-passport-api/.env`)

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_TRIAL_DAYS=7
STRIPE_PRICE_STANDARD=price_...
STRIPE_PRICE_STANDARD_COURSE=price_...
STRIPE_PRICE_PARTNER=price_...
STRIPE_PRICE_PARTNER_COURSE=price_...
SUCCESS_URL=https://thebluepassport.org/payment/success
CANCEL_URL=https://thebluepassport.org/payment/cancel
WP_USERNAME=...
WP_APP_PASSWORD=...
```

### React (`.env`)

```env
VITE_API_URL=/api
VITE_WP_API_URL=https://thebluepassport.org/wp-json/wp/v2
```

### WordPress

Instalar hooks de `docs/wordpress-stripe-hooks.php` en el `functions.php` del tema activo.

## Desarrollo local

```bash
# Terminal 1 — API
cd ../blue-passport-api && npm run dev

# Terminal 2 — React
npm run dev
```

## Admin

Directorist → **Pending** → Revisar → **Publish** (cobra) o **Trash** (cancela sin cobro).
