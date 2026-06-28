# Design: Foundation + Public Home

**Date:** 2026-06-27
**Status:** Approved (pending spec review)
**Scope:** First implementation slice — apply SpaceIA design tokens, scaffold the
feature-based folder structure, build the PublicLayout, and build the landing Home
page with placeholder pages for the other MVP public routes.

## Goal

Deliver a visible, working public landing page that establishes the design system and
architectural patterns the rest of the SpaceIA frontend will follow. After this slice,
`http://localhost:4200` shows a styled Home page with working navigation between MVP
public routes.

## Out of scope (this slice)

- Auth, login page, route guards (next slice).
- Client and admin portals.
- API/environment wiring.
- Real content for SpaceIA / Contacto / Cotizador pages (placeholders only).
- Dark-mode tuning (light-first; dark block retained but not refined).

## 1. Design tokens (`src/styles.css`)

Replace the default spartan grayscale palette with SpaceIA tokens, exact to CLAUDE.md.
Values written as hex (Tailwind v4 + spartan preset accept any color space).

| Token | Value |
|---|---|
| `--primary` | `#2563EB` (Blue 600) |
| `--primary-foreground` | `#FFFFFF` |
| `--secondary` | `#06B6D4` (Cyan 500) |
| `--accent` | `#8B5CF6` (Violet 500 — AI features only) |
| `--background` | `#F8FAFC` (Slate 50) |
| `--card` | `#FFFFFF` |
| `--card-foreground` / `--foreground` | `#0F172A` (Slate 900) |
| `--muted-foreground` | `#64748B` (Slate 500) |
| `--border` / `--input` | `#E2E8F0` (Slate 200) |
| `--ring` | `#2563EB` |
| `--radius` | `0.5rem` |

- Use `rounded-md` for buttons/inputs, `rounded-lg` for cards (per design system).
- Add **Inter** font: Google Fonts `<link>` + preconnect in `src/index.html`, set
  `--font-sans` to `'Inter', ...system fallbacks`.
- Keep the existing `:root.dark` block; defer tuning.

## 2. Folder scaffold

Per CLAUDE.md feature-based architecture:

```
src/app/
├── core/                       # empty now (guards/services later slices)
├── shared/ui/                  # spartan hlm components, added via CLI as needed
├── layouts/
│   └── public-layout/          # public-layout.ts  (header + footer + <router-outlet>)
└── features/public/
    ├── home/
    │   ├── home.ts
    │   └── sections/
    │       ├── hero/
    │       ├── features/
    │       ├── how-it-works/
    │       └── cta-band/
    ├── spaceia/                # placeholder page
    ├── contacto/               # placeholder page
    └── cotizador/              # placeholder page
```

## 3. Routing (`src/app/app.routes.ts`)

Lazy-loaded. PublicLayout wraps the public children.

```
'' → PublicLayout (component route)
   '' (index)   → Home
   'spaceia'    → Spaceia    (placeholder)
   'contacto'   → Contacto   (placeholder)
   'cotizador'  → Cotizador  (placeholder)
```

- Navbar "Iniciar sesión" links to `/login`. The login page is built in the auth
  slice; until then the link is a safe no-content target deferred to that slice (not
  created in this slice). Mark it clearly so it is not a silent dead link.

## 4. PublicLayout (`layouts/public-layout/`)

- **Header:** sticky, `bg-card` with thin bottom `border-border`. Brand text "SpaceIA"
  (links to `/`). Nav links: Home, SpaceIA, Contacto, Cotizador. "Iniciar sesión"
  button (outline) → `/login`. Responsive: on mobile, collapse nav into a simple
  disclosure toggle.
- **Footer:** nav links repeated + "© Lattice Systems" + product tagline.
- Uses semantic landmarks: `<header>`, `<nav>`, `<main>` (router-outlet), `<footer>`.

## 5. Home sections

Each section is its own standalone component composed inside `home.ts`.

- **Hero:** headline + subhead + two CTAs (Cotizar → `/cotizador`, primary; Contacto →
  `/contacto`, outline) + product visual placeholder via `NgOptimizedImage`.
- **Features:** 3-card grid — AI, IoT, Automation — each with a Lucide icon
  (`@ng-icons/lucide`). Violet `--accent` reserved exclusively for the AI card.
- **HowItWorks:** 3–4 numbered steps explaining the ecosystem flow.
- **CtaBand:** final call-to-action band → `/cotizador`.

## 6. Components & conventions

- Standalone components (no `standalone: true` — default in v20+).
- `input()`/`output()` functions; signals + `computed()` for any state.
- Native control flow (`@if`, `@for`); `class` bindings (no `ngClass`).
- `inject()` over constructor injection.
- Inline templates for the small section components; external template acceptable for
  PublicLayout if it grows.
- English-only code, naming per CLAUDE.md.

## 7. Testing & accessibility

- Vitest spec per component: renders without error + asserts key content/links present.
- Accessibility (must pass AXE, WCAG AA): semantic landmarks, `alt` text on images,
  visible focus states, color contrast (tokens chosen are AA-compliant), keyboard-
  operable nav and mobile disclosure.

## Acceptance

- `ng serve` shows a styled Home page at `/` with the 4 sections.
- Nav links route to Home / SpaceIA / Contacto / Cotizador placeholders.
- Tokens applied (blue primary, cyan secondary, Inter font, slate background).
- Component specs pass; no AXE violations on the rendered pages.
