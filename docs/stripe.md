===============================================================================
GUÍA DE INTEGRACIÓN: REACT (VITE) + WORDPRESS (DIRECTORIST) + STRIPE
===============================================================================
Servidor de Alojamiento: Piensa Solutions
Dominio: thebluepassport.org
Repositorios: `blue-passport` (React) + `blue-passport-api` (Node)
===============================================================================

Esta guía describe el flujo de **autorizar y capturar** para suscripciones de Stripe:

- El cliente vincula su tarjeta con un **período de prueba de 7 días** (€0 temporalmente).
- Si el equipo **aprueba** en WordPress (publicar): se cobra el año completo al instante.
- Si se **rechaza** (papelera): se cancela la suscripción y no se debita nada.

-------------------------------------------------------------------------------
1. DIAGRAMA DE FLUJO DEL SISTEMA
-------------------------------------------------------------------------------

[Cliente elige plan en React] ──> [Stripe Checkout — trial 7 días]
                           │
                           ▼
[Cliente completa perfil en React] ──> [API Node POST a WordPress]
                                              │ (status: pending, _stripe_session_id)
                                              ▼
                                   [WordPress guarda como PENDIENTE]
                                              │
               ┌──────────────────────────────┴──────────────────────────────┐
               ▼ (Si el equipo Aprueba)                                     ▼ (Si el equipo Rechaza)
    [Clic en "Publicar" en WP]                                   [Clic en "Mover a Papelera" en WP]
               │                                                              │
               ▼                                                              ▼
[WP termina período de prueba]                                    [WP cancela la suscripción]
  -> Stripe cobra el año completo                                   -> Costo €0 para todos
  -> Anuncio visible en React

-------------------------------------------------------------------------------
2. CONFIGURAR CREDENCIALES EN WORDPRESS
-------------------------------------------------------------------------------

Para que el backend (`blue-passport-api`) inserte perfiles en Directorist sin exponer
contraseñas de admin en el frontend:

1. Iniciar sesión: https://thebluepassport.org/wp-admin
2. Usuarios → Perfil
3. Contraseñas de aplicación → crear una llamada `Formulario React`
4. Copiar el código de 24 caracteres generado
5. Configurar en `blue-passport-api/.env`:

   WP_USERNAME=tu_usuario_admin
   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx

-------------------------------------------------------------------------------
3. CONFIGURAR STRIPE (PARA EL CLIENTE)
-------------------------------------------------------------------------------

El cliente debe crear su cuenta en Stripe y configurar:

### A. Productos y precios recurrentes (3 planes)

| Plan API | Producto Stripe | Price ID | Tarifa |
|----------|-----------------|----------|--------|
| `crew` | Blue Crew Member | `price_1TuH9U4liFjrlSo91IMKSCI7` | 150 €/año |
| `expert` | Blue Expert Member | `price_1TuHBZ4liFjrlSo9oj6EAIf6` | 150 €/año |
| `partner` | Blue Certified Partner | `price_1TuIpe4liFjrlSo9OU6ZihxR` | 50 €/año |

Crew y Expert incluyen 50 € de cuota anual de directorio + 100 € de validación (Crew) o certificación Elite Yacht Protocol (Expert). Partner es solo la cuota de directorio (50 €) para titulares de Blue Certificate vigente.

Variables en `wp-config.php` (plugin WordPress):

| Variable | Price ID |
|----------|----------|
| `BLUE_PASSPORT_STRIPE_PRICE_CREW` | `price_1TuH9U4liFjrlSo91IMKSCI7` |
| `BLUE_PASSPORT_STRIPE_PRICE_EXPERT` | `price_1TuHBZ4liFjrlSo9oj6EAIf6` |
| `BLUE_PASSPORT_STRIPE_PRICE_PARTNER` | `price_1TuIpe4liFjrlSo9OU6ZihxR` |

Cada variable debe contener un **Price ID** (`price_...`), no un Product ID (`prod_...`).

### B. Claves en el backend

```env
STRIPE_SECRET_KEY=sk_test_...   # o sk_live_... en producción
STRIPE_WEBHOOK_SECRET=whsec_... # opcional pero recomendado
STRIPE_TRIAL_DAYS=7
```

### C. URLs de retorno

```env
SUCCESS_URL=https://thebluepassport.org/payment/success
CANCEL_URL=https://thebluepassport.org/payment/cancel
```

El trial de 7 días se configura automáticamente en el backend al crear la Checkout Session.

-------------------------------------------------------------------------------
4. RUTAS EN REACT
-------------------------------------------------------------------------------

| Ruta | Descripción |
|------|-------------|
| `/blue-passport/become-a-member` | Formulario corto + selección de plan |
| `/payment/success?session_id=` | Confirmación post-checkout |
| `/blue-passport/profile?applicationId=` | Perfil completo |
| `/crear-anuncio?session_id=` | Alias compatible con esta guía |

### Flujo técnico

1. React llama `POST /api/create-checkout-session` con plan y datos básicos.
2. El API crea la Checkout Session con `trial_period_days: 7`.
3. Stripe redirige a `/payment/success?session_id={CHECKOUT_SESSION_ID}`.
4. El usuario completa el perfil.
5. React llama `POST /api/applications/:id/profile` y luego `POST /api/applications/:id/publish-draft`.
6. El API hace `POST /wp-json/wp/v2/at_biz_dir` con:
   - `status: "pending"`
   - `meta._stripe_session_id: <session_id>`

> **Nota:** El POST a WordPress lo hace el backend con Basic Auth, no el frontend.
> Esto es más seguro que exponer credenciales en React.

-------------------------------------------------------------------------------
5. AUTOMATIZAR STRIPE EN WORDPRESS (functions.php)
-------------------------------------------------------------------------------

Instalar el archivo incluido en el repo:

`docs/wordpress-stripe-hooks.php`

Pegar su contenido al final del `functions.php` del tema activo en WordPress.

Configurar la clave secreta en `wp-config.php`:

```php
define('BLUE_PASSPORT_STRIPE_SECRET_KEY', 'sk_live_...');
```

### Qué hace

- **Publicar** un listing `pending` → termina el trial (`trial_end: now`) → cobra el año.
- **Mover a papelera** → cancela la suscripción sin cobrar.

-------------------------------------------------------------------------------
6. DESPLEGAR EN PIENSA SOLUTIONS
-------------------------------------------------------------------------------

### React (frontend)

```bash
npm run build
```

Subir el contenido de `/dist` a `public_html` (sin borrar `wp-admin`, `wp-content`, `wp-includes`).

### API Node (backend)

Desplegar `blue-passport-api` en un proceso Node (PM2, etc.) accesible desde el hosting.
En desarrollo, Vite hace proxy de `/api` → `localhost:3001`.

### .htaccess (coexistencia React + WordPress)

```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

RewriteRule ^wp-admin(/.*)?$ - [L]
RewriteRule ^wp-login\.php$ - [L]
RewriteRule ^wp-json(/.*)?$ - [L]
RewriteCond %{REQUEST_URI} ^/wp-content/ [NC]
RewriteRule .* - [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```

-------------------------------------------------------------------------------
7. DESARROLLO LOCAL
-------------------------------------------------------------------------------

```bash
# Terminal 1 — API
cd ../blue-passport-api && npm run dev

# Terminal 2 — React
cd blue-passport && npm run dev
```

Tarjeta de prueba Stripe: `4242 4242 4242 4242`

-------------------------------------------------------------------------------
8. CHECKLIST ANTES DE PRODUCCIÓN
-------------------------------------------------------------------------------

- [ ] Cuenta Stripe activa con datos fiscales y bancarios
- [ ] 4 Price IDs configurados en `blue-passport-api/.env`
- [ ] `STRIPE_TRIAL_DAYS=7`
- [ ] `SUCCESS_URL` y `CANCEL_URL` apuntan a thebluepassport.org
- [ ] `WP_USERNAME` y `WP_APP_PASSWORD` configurados
- [ ] Hooks PHP instalados en WordPress
- [ ] `BLUE_PASSPORT_STRIPE_SECRET_KEY` en wp-config.php
- [ ] API Node desplegada y accesible
- [ ] React compilado y subido a public_html

===============================================================================
