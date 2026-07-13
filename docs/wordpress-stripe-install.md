# Instalar hooks de Stripe en WordPress

Estos hooks conectan Directorist con Stripe para que:

- **Publicar** un anuncio pendiente → cobre la membresía anual
- **Mover a papelera** → cancele la suscripción sin cobrar

Archivo a instalar: `docs/wordpress-stripe-hooks.php`

---

## Paso 1 — Clave secreta de Stripe en wp-config.php

**Recomendado:** no pegar la clave dentro del tema. Agregarla en `wp-config.php` (en la raíz de WordPress, junto a las otras `define`).

1. Acceder al hosting (Piensa Solutions) → administrador de archivos
2. Abrir `public_html/wp-config.php`
3. **Antes** de la línea `/* That's all, stop editing! */`, agregar:

```php
// Blue Passport — Stripe (usar sk_test_... para pruebas, sk_live_... en producción)
define('BLUE_PASSPORT_STRIPE_SECRET_KEY', 'sk_test_XXXXXXXXXXXX');
```

4. Guardar

> La clave secreta está en Stripe Dashboard → Developers → API keys → **Secret key**

---

## Paso 2 — Pegar el código en functions.php del tema activo

1. En WP Admin: **Apariencia → Editor de archivos de temas**
   - O por FTP/archivos: `public_html/wp-content/themes/<tema-activo>/functions.php`

2. Identificar el **tema activo** (Apariencia → Temas → el que dice "Activo")

3. Abrir `functions.php` de ese tema

4. Ir al **final del archivo** (después de todo el código existente)

5. Copiar y pegar **todo** el contenido de `wordpress-stripe-hooks.php` (sin el `<?php` duplicado si `functions.php` ya empieza con `<?php`)

   - Si `functions.php` ya tiene `<?php` en la primera línea, pegar el contenido **desde la línea 12** en adelante (sin el segundo `<?php`)
   - O pegar el archivo completo si el editor lo permite y no rompe el archivo

6. Guardar / actualizar archivo

---

## Paso 3 — Verificar que el anuncio tiene session_id

Los anuncios creados desde el formulario de Blue Passport deben tener el meta `_stripe_session_id`.

Para comprobar (opcional):

1. WP Admin → Directorist → Listings
2. Editar un anuncio creado desde el formulario
3. En la base de datos o con un plugin de custom fields, verificar que existe `_stripe_session_id`

Si el anuncio se creó con el flujo nuevo (API), ya debería estar guardado.

---

## Paso 4 — Probar en modo test

Usar `sk_test_...` en `wp-config.php` y una suscripción de prueba.

### Probar cobro (Publish)

1. Crear un anuncio de prueba desde el formulario (tarjeta `4242 4242 4242 4242`)
2. En Directorist, el anuncio queda **Pendiente**
3. Clic en **Publish**
4. En Stripe Dashboard (modo test) → Customers / Subscriptions
5. Verificar que se cobró la membresía anual

### Probar cancelación (Papelera)

1. Otro anuncio de prueba en **Pendiente**
2. Clic en **Papelera** o **Reject**
3. En Stripe Dashboard → la suscripción debe aparecer **cancelada**
4. Sin cobro

---

## Paso 5 — Pasar a producción

1. Cambiar en `wp-config.php`:
   ```php
   define('BLUE_PASSPORT_STRIPE_SECRET_KEY', 'sk_live_XXXXXXXXXXXX');
   ```
2. Usar productos y precios **live** en el API (`blue-passport-api/.env`)
3. Repetir una prueba con un cobro real pequeño si hace falta

---

## Resumen para el cliente

| Qué | Dónde |
|-----|--------|
| Clave secreta Stripe | `wp-config.php` |
| Lógica cobro/cancelación | `functions.php` del tema activo |
| Anuncios pendientes | Directorist → Listings → Pendiente |

## Si algo no funciona

- Confirmar que `BLUE_PASSPORT_STRIPE_SECRET_KEY` está definida (test o live según el entorno)
- Confirmar que el anuncio tiene `_stripe_session_id` en meta
- Revisar que la suscripción en Stripe sigue en **trialing** antes de publicar
- Verificar que el tema activo es el mismo donde se pegó `functions.php`
