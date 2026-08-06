# Showcase: fotos de equipo, carrito físico y device frames — Design

**Fecha:** 2026-08-06
**Proyecto:** `spaceai-landing-web-frontend` (Angular 20, Tailwind, spartan/ui)
**Objetivo:** Integrar fotos reales del equipo, fotos del carrito físico, y un showcase de las apps del ecosistema dentro de marcos de dispositivo (laptop/teléfono/tablet) estilo GSA — en la página de producto `/spaceia`.

## Fuentes de imágenes (ya en el working tree, en `../images/`)

- Equipo: `perfil-ojeda.jpeg`, `perfil-emmanuel.jpeg`, `perfil-jael.jpeg`, `perfil-haziel.jpeg`, `perfil-emiliano.jpeg` (5 de 6).
- Carrito: `carrito/carrito-completo.jpeg`, `carrito/carrito-parteabajo.jpeg`.
- Móvil: **las manda el usuario** (specs abajo).

## Decisiones tomadas

- **Marcos de dispositivo:** vendorear [`devices.css`](https://github.com/picturepan2/devices.css/) (Yan Zhu, MIT) como un único `.css` — sin dependencia npm de React. `react-device-frameset` descartado (es React; la landing es Angular).
- **Ubicación showcase:** página producto `/spaceia`.
- **Animación estilo GSA:** IntersectionObserver + transforms CSS, mismo patrón que `nosotros.ts`. **Sin** GSAP (no meter dep nueva).
- **MacBook frame:** Playwright hace login con credenciales demo (`admin@spaceia.com` / `Admin123!`) en la web desplegada y captura el dashboard admin.
- **SIDE:** es la raíz `/` de la web app (`OnsiteComponent`, "Kiosco Inteligente") — Playwright captura esa página.
- **Juan Pablo Rea (Frontend):** sin foto → placeholder avatar gris local (SVG) hasta que llegue la real.

## Parte 1 — Fotos de equipo (`features/public/nosotros/nosotros.ts`)

- Copiar 5 fotos a `public/team/` (nombres kebab: `ojeda.jpeg`, etc.).
- Crear `public/team/placeholder.svg` (silueta gris neutra) para Juan Pablo.
- Agregar campo `foto` a cada objeto de `EQUIPO`.
- Reemplazar el círculo de iniciales por `<img ngSrc>` circular (`size-14`, `rounded-full`, `object-cover`), con `alt` = nombre. Mantener `initials` como respaldo textual accesible no es necesario; `alt` cubre a11y.
- Respetar `NgOptimizedImage` (ya importado): `ngSrc`, `width`/`height`, sin base64.

## Parte 2 — Carrito físico (`features/public/spaceia/spaceia.ts`)

- Copiar las 2 fotos a `public/cart/`.
- Sección nueva "Carrito inteligente": galería de 2 fotos (grid 2-col en desktop, stack en móvil) con tarjeta shadcn (`border border-border rounded-lg`), eyebrow + título + copy corto de hardware.
- Son fotos de hardware real → NO van en device frame; van como galería de producto físico.

## Parte 3 — Showcase device frames (`features/public/spaceia/spaceia.ts`)

Sección nueva "Míralo en acción" con 3 marcos:

| Frame | Contenido | Fuente |
|---|---|---|
| MacBook Pro | Dashboard admin web | Playwright (login demo) |
| iPhone 14 Pro | App móvil (QR / home / chat IA) | Usuario manda |
| iPad Pro | Vista SIDE (raíz `/`) + tablet acceso/carrito | Playwright web desplegada |

- Vendorear `devices.css` en `src/styles.css` (o `public/vendor/devices.min.css` importado en `angular.json`/`styles`).
- Cada frame: markup de `devices.css` con `<img ngSrc>` dentro de `.device-screen`.
- Animación: al entrar en viewport, fade + translateY + leve scale, escalonado. Reutilizar helper `observe1` estilo `nosotros.ts`. Respetar `prefers-reduced-motion`.
- Reservar espacio (aspect-ratio fijo) para el iPhone aunque la foto no llegue aún → placeholder gris con leyenda "Screenshot pendiente".

## Parte 4 — Script Playwright (`scripts/screenshots.mjs` o similar)

- Captura contra dos orígenes (flag/env): Azure `https://app.spaceai.latticesystems.dev` y local `http://localhost:4200`.
- Pasos:
  1. SIDE: ir a `/`, esperar carga, screenshot → `public/screenshots/side.png` (viewport tablet, ej. 1024×768).
  2. Acceso: `/tablet/access` → `access.png`.
  3. Carrito web: `/tablet/cart` → `cart.png`.
  4. Admin: `/login`, llenar `admin@spaceia.com` / `Admin123!`, submit, esperar `/admin`, screenshot dashboard → `admin.png` (viewport laptop, ej. 1440×900).
- Playwright como devDependency (justificado: herramienta de captura, no runtime). Chromium headless.
- Documentar en el propio script que las credenciales demo son públicas de demo (no secretos reales).

## Specs para el usuario (screenshots móvil)

| Pantalla | Formato | Nombre destino |
|---|---|---|
| Credencial QR | PNG vertical ~9:19.5 (1170×2532) | `public/mobile/movil-qr.png` |
| Avisos / home | mismo | `public/mobile/movil-home.png` |
| Chat IA | mismo | `public/mobile/movil-chat.png` |

Sin barra de estado del emulador (o recortada). Fondo real de la app.

## Fuera de alcance

- No tocar la app móvil ni el backend.
- No crear la vista SIDE dedicada en la web (P0 en el otro repo, aparte).
- No pagos, no nuevas rutas de portal.

## Riesgos / notas

- Si la web desplegada requiere que `/tablet/*` tenga contexto de dispositivo/QR y no renderiza limpio, se captura en local con datos mock.
- `devices.css` fija tamaños en px; los screenshots deben respetar el aspect-ratio del `.device-screen` de cada dispositivo o se ven estirados.
- Commits atómicos por parte (equipo / carrito / showcase / script) + push, por convención del workspace.
