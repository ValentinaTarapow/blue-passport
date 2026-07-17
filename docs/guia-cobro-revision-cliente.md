# Guía de cobro Blue Passport — revisión de 7 días

Guía para el equipo / cliente. Explica qué pasa con el dinero desde que alguien se registra hasta que se aprueba o rechaza su perfil.

---

## Idea en una frase

**El solicitante deja la tarjeta, pero no se cobra nada hasta que ustedes aprueban el perfil.**  
Si lo rechazan (o no lo revisan a tiempo), **no se cobra**.

## Lo esencial

- **Mientras está pendiente:** no se cobra y **no se publica** en el directorio.
- **Al instante:** el equipo recibe un **email** cuando el perfil queda pendiente de revisión (nombre, email, plan y link directo a WordPress).
- **Al día 5:** el equipo recibe un **recordatorio** si la solicitud todavía no fue revisada.
- **Si se rechaza** (papelera o auto-rechazo al día 7): **no se cobra** y **no se publica**.
- **Si se acepta:** usá **«Aprobar y cobrar»**. Stripe intenta cobrar el año.
  - Si el pago **sale OK** → ahí recién se publica.
  - Si el pago **falla** (tarjeta dada de baja, sin fondos, etc.) → **no se publica** y el listing sigue pendiente.

**Safeguard:** el perfil solo queda público si el cobro se confirma. Publicar a mano sin cobro queda bloqueado.

---

## Cómo se enteran de una solicitud nueva

No hace falta entrar a WordPress “por si acaso”. El flujo de avisos es:

1. **Email inmediato** — en cuanto el solicitante completa el perfil y el listing queda *Pending*, llegan a:
   - `pagos@thebluepassport.es`
   - `tarapow.v@gmail.com`
2. **Email recordatorio (día 5)** — si todavía no lo revisaron.
3. **Email de auto-rechazo (día 7)** — si nadie decidió a tiempo (también le llega aviso al solicitante).

En el email inmediato vienen: nombre, email del solicitante, plan y un **link directo** para abrir el listing en WordPress.

También pueden ver todos los pendientes en **Directorist → Listings** (filtro *Pending*).

---

## Qué ve el solicitante

1. Elige su plan (**Blue Crew** o **Blue Expert**, 150 € / año; o **Blue Certified Partner**, 50 € / año).
2. En Stripe deja los datos de la tarjeta.
3. **En ese momento el cobro es €0.** Solo se vincula la tarjeta.
4. Completa su perfil (foto, bio, especialidades, etc.).
5. Su anuncio queda **pendiente de revisión** (no aparece público todavía).
6. Ustedes reciben el email y deciden: **aprobar y cobrar** o **rechazar**.

---

## Los 7 días de revisión

Tienen **7 días** para revisar cada solicitud.

| Día | Qué pasa |
|-----|----------|
| **Día 0** | Se registra, deja la tarjeta (€0) y completa el perfil. El listing queda *Pending*. **Ustedes reciben un email inmediato** con el link para revisar. |
| **Días 1–4** | Tiempo para revisar con calma. |
| **Día 5** | Reciben un **email recordatorio** si todavía no lo revisaron. |
| **Día 7** | Si sigue sin decisión → el sistema **lo rechaza solo**, cancela la suscripción y **no cobra**. El solicitante recibe un aviso por email. |

> Importante: el plazo de 7 días es una **ventana de revisión**, no un cobro automático al día 7.  
> Al día 7, si no aprobaron, **no se cobra**: se cancela.

---

## Qué hacer ustedes en WordPress

Entran desde el **link del email**, o por **Directorist → Listings** (anuncios pendientes).

### Aprobar (Aprobar y cobrar)

1. Abren el listing (o lo ven en la lista).
2. Lo revisan (datos, foto, categoría, etc.).
3. Hacen clic en **«Aprobar y cobrar»** (en la lista de listings o en el panel lateral del listing).
4. **No** usen solo el botón “Publicar” de WordPress: está bloqueado sin cobro confirmado.

**Resultado si el pago sale OK:** Stripe cobra el año y el perfil se publica en el directorio.

**Resultado si el pago falla:** el listing **sigue pendiente**, aparece el motivo del error, y **no** se publica. Pueden contactar al solicitante para que actualice la tarjeta y reintentar.

### Rechazar (Papelera)

1. Abren el listing.
2. Lo mandan a **Trash / Papelera**.

**Resultado:** Stripe **cancela** la suscripción.  
**€0 cobrado.** El perfil no se publica.

---

## Resumen visual

```
Registro + tarjeta
        │
        ▼
     Cobro €0
   (tarjeta vinculada)
        │
        ▼
  Completa el perfil
        │
        ▼
  Listing PENDING
  + email al equipo
  (7 días para revisar)
        │
   ┌────┴────────────┐
   ▼                 ▼
Aprobar y cobrar   Papelera
   │                 │
   ▼                 ▼
Intenta cobrar    Cancela
   │              sin cobro
   ├─ OK → Publica
   └─ Falla → Sigue pending
```

---

## Preguntas frecuentes

### ¿Por qué Stripe muestra “trial” o “período de prueba”?
Porque técnicamente es una suscripción con 7 días de trial. Así se guarda la tarjeta sin cobrar. No es un “gratis para siempre”: es el tiempo de revisión.

### ¿Se cobra algo al registrarse?
No. €0 al registrar la tarjeta.

### ¿Cuándo se cobra de verdad?
Solo cuando ustedes usan **«Aprobar y cobrar»** y Stripe confirma el pago.

### ¿Cómo nos enteramos de una solicitud nueva?
Les llega un **email inmediato** apenas el perfil queda pendiente, con nombre, email, plan y link a WordPress. Si no lo revisan, el día 5 llega un recordatorio.

### ¿Y si la tarjeta ya no sirve al momento de aprobar?
El cobro falla, **no se publica**, y el listing queda pendiente con el error visible.

### ¿Y si lo rechazamos?
No se cobra. La suscripción se cancela.

### ¿Y si nos olvidamos de revisarlo?
Al día 7 el sistema lo rechaza solo y cancela sin cobro. Antes les llegan: el email inmediato (día 0) y el recordatorio (día 5).

### ¿El solicitante puede ver su perfil en el directorio mientras está pendiente?
No. Solo aparece público después de un cobro confirmado.

### ¿Qué planes hay?
| Plan | Precio anual | Incluye |
|------|----------------|---------|
| Blue Crew Member | 150 € | Directorio (50 €) + Validación Blue (100 €) |
| Blue Expert Member | 150 € | Directorio (50 €) + Elite Yacht Protocol (100 €) |
| Blue Certified Partner | 50 € | Solo directorio (titulares de Blue Certificate vigente) |

---

## Qué decirle al solicitante (texto sugerido)

> Al registrarte vinculás tu tarjeta, pero **no se cobra nada** hasta que nuestro equipo revise y apruebe tu perfil (hasta 7 días).  
> Si tu solicitud no es aceptada, **no se realiza ningún cobro**.  
> Si es aceptada, el cobro se confirma antes de publicar tu perfil en el directorio.

---

## Checklist rápido para el admin

- [ ] Revisar el **email inmediato** (o listings en estado **Pending**)
- [ ] Antes del día 7: decidir **Aprobar y cobrar** o **Papelera**
- [ ] Si aprueban → verificar mensaje “Pago confirmado. Listing publicado.”
- [ ] Si el cobro falla → contactar al solicitante y reintentar después
- [ ] Si rechazan → no hace falta hacer nada más en Stripe (se cancela solo)

---

*Documento interno para The Blue Passport. Si algo no coincide con lo que ven en Stripe o WordPress, avisar al equipo técnico.*
