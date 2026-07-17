# Desplegar el front React en thebluepassport.org (junto a WordPress)

El visitante ve React. El admin de WordPress sigue en `/wp-admin` para aprobar/rechazar listings.

```
thebluepassport.org/           → React (SPA)
thebluepassport.org/wp-admin   → WordPress Admin ✅
thebluepassport.org/wp-json/…  → API WP + Blue Passport ✅
```

---

## Paso 1 — Build local

En el proyecto:

```bash
npm run build
```

Se genera la carpeta `dist/` con `index.html`, `assets/`, etc.

## Paso 2 — Subir con FileZilla (sin borrar WordPress)

Andá a `/home/www/public/` (la misma carpeta donde están `wp-admin`, `wp-content`, `wp-config.php`).

### Subí desde `dist/`:
- `index.html` → sobrescribe el `index.html` de WordPress (está bien)
- carpeta `assets/`
- lo que haya en `dist/` (favicon, etc.)

### NO borres nunca:
- `wp-admin/`
- `wp-content/`
- `wp-includes/`
- `wp-config.php`
- `wp-login.php`
- `xmlrpc.php`
- archivos `wp-*.php`

Si te pregunta sobrescribir `index.html` → **Sí**.  
Si te pregunta sobrescribir carpetas de WordPress → **No**.

## Paso 3 — .htaccess (SPA + WP)

En la raíz `/home/www/public/` tiene que existir un `.htaccess` que:

1. Deje pasar `wp-admin`, `wp-login`, `wp-json`, `wp-content`, `wp-includes`
2. Mande el resto de rutas al `index.html` de React (`/about`, `/blue-passport`, etc.)

Archivo listo en el repo: `docs/wordpress-plugin/htaccess-react-wp.txt`

1. Descargá / abrí ese archivo
2. En FileZilla, en `/home/www/public/`, si ya hay `.htaccess`:
   - Descargalo como backup (`htaccess-backup.txt`)
   - Reemplazá el contenido por el del archivo del repo **o** fusioná las reglas `RewriteRule` de React con las de WP
3. Si no hay `.htaccess`, subí el del repo y renombralo a `.htaccess`

En FileZilla: **Server** → **Force showing hidden files** para ver archivos que empiezan con punto.

## Paso 4 — Comprobar

| URL | Qué debería pasar |
|-----|-------------------|
| `https://thebluepassport.org/` | Home de React |
| `https://thebluepassport.org/about` | About (sin 404) |
| `https://thebluepassport.org/wp-admin` | Login / panel WP |
| `https://thebluepassport.org/wp-json/blue-passport/v1` | JSON del plugin |

## Paso 5 — Env del front

Como el front vive en el mismo dominio, en el build (antes de `npm run build`) el `.env` ya puede ser:

```env
VITE_API_URL=https://thebluepassport.org/wp-json/blue-passport/v1
VITE_WP_API_URL=https://thebluepassport.org/wp-json/wp/v2
VITE_CONTACT_EMAIL=pagos@thebluepassport.es
```

En `wp-config.php` dejá:

```php
define('BLUE_PASSPORT_FRONTEND_URL', 'https://thebluepassport.org');
```

Así Stripe vuelve a `/payment/success` en el mismo dominio.

---

## Flujo diario del admin

1. Usuario se registra en la web React → Stripe trial → perfil
2. Listing queda **Pending** en Directorist
3. Vos entrás a `https://thebluepassport.org/wp-admin`
4. Directorist → Listings → **Publish** (cobra) o **Trash** (cancela)
