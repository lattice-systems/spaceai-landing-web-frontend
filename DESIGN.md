# Design

## Visual Theme

Product register. "Tech confiable" — Vercel/Fly.io-family precision with a fresher, more
committed accent than a typical flat gray SaaS admin. Light mode only has a real toggle path
today (dark tokens exist in `styles.css` as scaffolding but no UI control uses them yet).

**Before this pass:** background/secondary/muted/accent were all chroma-0 grays
(`oklch(x 0 0)`) — literally desaturated black-to-white, which reads as flat/washed-out
regardless of lightness. That was the root cause of "todo se ve muy blanco/apagado".

**After this pass:** every neutral carries a small chroma (0.006–0.014) toward the primary
hue (~250°, blue-indigo), so grays read as "cool slate", not "flat gray". Cards stay
near-white and pop slightly against a faintly tinted page background — the classic
Vercel/Linear layered-surface trick.

## Color Palette (OKLCH, light mode — see `src/styles.css` `:root`)

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.984 0.006 250)` | Page background, faint cool tint (was flat white) |
| `--card` | `oklch(0.995 0.003 250)` | Card/dialog surface, near-white, pops off bg |
| `--primary` | `oklch(0.551 0.202 258)` | Single accent: electric blue-indigo, richer/more saturated than before |
| `--secondary` / `--muted` | `oklch(0.955 0.012 250)` | Tinted slate, no longer chroma-0 |
| `--accent` | `oklch(0.93 0.03 258)` | Soft tinted hover/active surface (primary-family, low chroma) |
| `--destructive` | `oklch(0.577 0.215 25)` | Errors/reject actions |
| `--border` / `--input` | `oklch(0.906 0.010 250)` | Tinted hairlines, not flat gray |
| `--sidebar` | `oklch(0.972 0.008 250)` | Sidebar reads as a distinct layer from page bg |
| `--sidebar-accent` | `oklch(0.90 0.028 258)` | Active/hover nav item |

Dark-mode tokens mirrored with the same hue anchor (250) so if a toggle ships later it's
already coherent; not the focus of this pass (no UI control surfaces it yet).

**Rule:** one accent hue (250, blue-indigo) for all interactive UI (buttons, active nav, focus
rings, links). Status/semantic colors (badges: pending/approved/rejected, low-stock, etc.)
keep using `destructive`/`default`/`outline`/`secondary` badge variants already established
this session — not new hues bolted onto chrome.

## Typography

System font stack (`-apple-system, 'Segoe UI', Roboto...`), already in place — no change.
Numbers/currency in tables may use `font-mono`-tabular where already applied (kept as-is).

## Components

spartan/ui (`@spartan-ng/helm`) throughout — `hlmCard`, `hlmBadge`, `hlmTable`, `hlmDialog`,
`hlmButton`, `hlm-native-select`, `hlm-numbered-pagination`, `hlmSidebar*`. All are
CSS-variable-driven (`bg-card`, `bg-sidebar-accent`, `text-primary`, etc.) — the token pass in
`src/styles.css` re-skins every one of them without touching individual component files.
Radius: `--radius: 0.625rem` (10px), one scale, already consistent everywhere — not changed.

## Layout

Admin/client screens follow an established pattern (built out module-by-module this session):
compact header + toolbar (search/filters) + `hlmCard`-wrapped table + pagination; dialogs for
create/edit/detail. Dashboards (`admin-dashboard.ts`, `client-dashboard.ts`) are the one
surface allowed a more distinctive visual moment (Design Principle 5) — KPI cards + one
attention-grabbing chart, not another dense table.

## Motion

Minimal today (spartan's built-in dialog/dropdown transitions only). The dashboard chart
rebuild in this pass adds one deliberate entrance transition (radial progress animating in on
load) — motivated by "draw attention to the one distinctive widget on the page", not
decoration for its own sake. Respects `prefers-reduced-motion`.
