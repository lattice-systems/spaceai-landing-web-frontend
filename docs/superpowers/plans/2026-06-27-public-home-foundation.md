# Foundation + Public Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply SpaceIA design tokens, scaffold the feature-based folder structure, and ship a styled public landing Home page with working navigation to placeholder MVP routes.

**Architecture:** Feature-based Angular 22 standalone components. A `PublicLayout` (header + footer + `<router-outlet>`) wraps lazy-loaded public routes. The Home page composes four focused section components. Styling via Tailwind v4 + spartan/ui (helm components pre-generated in `libs/ui/*`, imported through `@spartan-ng/helm/*` path aliases).

**Tech Stack:** Angular 22, TypeScript, Tailwind CSS v4, spartan/ui (@spartan-ng/helm), @ng-icons/lucide, Vitest, NgOptimizedImage.

## Global Constraints

- Standalone components only; never set `standalone: true` (default in v20+).
- Use `input()`/`output()` functions, signals, `computed()`; no decorators for I/O.
- Native control flow (`@if`, `@for`); `class` bindings only (no `ngClass`/`ngStyle`).
- `inject()` over constructor injection.
- English-only code, naming, routes. PascalCase classes, camelCase members.
- Inline templates for small components.
- `NgOptimizedImage` for static images (not base64).
- Spartan helm imported via `@spartan-ng/helm/<name>` (e.g. `HlmButtonImports`, `HlmCardImports`).
- Lucide icons via `provideIcons({...})` + `NgIcon`, names like `lucideBrain`.
- Design tokens (hex): primary `#2563EB`, secondary `#06B6D4`, accent `#8B5CF6` (AI only), background `#F8FAFC`, card `#FFFFFF`, border/input `#E2E8F0`, foreground `#0F172A`, muted-foreground `#64748B`, radius `0.5rem`. `rounded-md` buttons, `rounded-lg` cards.
- Accessibility: pass AXE / WCAG AA — semantic landmarks, alt text, visible focus, keyboard-operable nav.
- Tests run with: `npx ng test` or `npx vitest run`.

## File Structure

- `src/styles.css` — modify `:root` token block, set `--font-sans` to Inter.
- `src/index.html` — modify `<head>`: add Inter Google Fonts links.
- `src/app/features/public/spaceia/spaceia.ts` — placeholder page.
- `src/app/features/public/contacto/contacto.ts` — placeholder page.
- `src/app/features/public/cotizador/cotizador.ts` — placeholder page.
- `src/app/features/public/home/sections/hero/hero.ts` — Hero section.
- `src/app/features/public/home/sections/features/features.ts` — Features grid.
- `src/app/features/public/home/sections/how-it-works/how-it-works.ts` — steps.
- `src/app/features/public/home/sections/cta-band/cta-band.ts` — final CTA band.
- `src/app/features/public/home/home.ts` — composes the four sections.
- `src/app/layouts/public-layout/public-layout.ts` — header + footer + outlet.
- `src/app/app.routes.ts` — modify: lazy routes under PublicLayout.
- `src/app/app.ts`, `src/app/app.html`, `src/app/app.css` — modify: reduce shell to `<router-outlet>`.
- `src/app/app.spec.ts` — modify: replace title assertion with outlet assertion.
- Co-located `*.spec.ts` next to each new component.

---

### Task 1: Design tokens + Inter font

**Files:**
- Modify: `src/styles.css:14-48` (`:root` block) and `:root` `--font-sans`
- Modify: `src/index.html:3-9` (`<head>`)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties consumed by every later component via Tailwind utilities (`bg-primary`, `text-foreground`, etc.). No TS symbols.

> CSS/config is not unit-testable; this task is verified by build success + grep, not a failing spec.

- [ ] **Step 1: Add Inter font links to `index.html`**

Replace the `<head>` contents so it includes, after the `<title>` line:

```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
```

- [ ] **Step 2: Set SpaceIA tokens in `styles.css`**

In the `:root` block, set `--font-sans` and override the light-theme tokens (leave `:root.dark` untouched):

```css
  --font-sans:
    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, 'Noto Sans', sans-serif;

  --radius: 0.5rem;
  --background: #f8fafc;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --popover: #ffffff;
  --popover-foreground: #0f172a;
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --secondary: #06b6d4;
  --secondary-foreground: #ffffff;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #8b5cf6;
  --accent-foreground: #ffffff;
  --destructive: #ef4444;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #2563eb;
```

- [ ] **Step 3: Verify build + tokens applied**

Run: `npx ng build 2>&1 | tail -5`
Expected: `Application bundle generation complete.` (CSS `:dir()` warnings from vendor CSS are pre-existing and harmless.)
Run: `grep -c "#2563eb" src/styles.css`
Expected: `2` (primary + ring).

- [ ] **Step 4: Commit**

```bash
git add src/styles.css src/index.html
git commit -m "feat(theme): apply SpaceIA design tokens and Inter font"
```

---

### Task 2: Placeholder public pages

**Files:**
- Create: `src/app/features/public/spaceia/spaceia.ts`
- Create: `src/app/features/public/spaceia/spaceia.spec.ts`
- Create: `src/app/features/public/contacto/contacto.ts`
- Create: `src/app/features/public/contacto/contacto.spec.ts`
- Create: `src/app/features/public/cotizador/cotizador.ts`
- Create: `src/app/features/public/cotizador/cotizador.spec.ts`

**Interfaces:**
- Consumes: design tokens (Task 1).
- Produces: `Spaceia`, `Contacto`, `Cotizador` standalone component classes (default exports not used; named exports), each with selector `app-spaceia` / `app-contacto` / `app-cotizador`. Consumed by router in Task 9.

- [ ] **Step 1: Write the failing test for Spaceia**

`src/app/features/public/spaceia/spaceia.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { Spaceia } from './spaceia';

describe('Spaceia', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Spaceia] }).compileComponents();
  });

  it('renders a heading', async () => {
    const fixture = TestBed.createComponent(Spaceia);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('SpaceIA');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/features/public/spaceia/spaceia.spec.ts`
Expected: FAIL — cannot find module `./spaceia`.

- [ ] **Step 3: Implement the three placeholder pages**

`src/app/features/public/spaceia/spaceia.ts`:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-spaceia',
  template: `
    <section class="mx-auto max-w-3xl px-6 py-24">
      <h1 class="text-foreground text-3xl font-bold">SpaceIA</h1>
      <p class="text-muted-foreground mt-3">Página en construcción.</p>
    </section>
  `,
})
export class Spaceia {}
```

`src/app/features/public/contacto/contacto.ts` (same shape, `app-contacto`, heading `Contacto`):

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  template: `
    <section class="mx-auto max-w-3xl px-6 py-24">
      <h1 class="text-foreground text-3xl font-bold">Contacto</h1>
      <p class="text-muted-foreground mt-3">Página en construcción.</p>
    </section>
  `,
})
export class Contacto {}
```

`src/app/features/public/cotizador/cotizador.ts` (same shape, `app-cotizador`, heading `Cotizador`):

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-cotizador',
  template: `
    <section class="mx-auto max-w-3xl px-6 py-24">
      <h1 class="text-foreground text-3xl font-bold">Cotizador</h1>
      <p class="text-muted-foreground mt-3">Página en construcción.</p>
    </section>
  `,
})
export class Cotizador {}
```

- [ ] **Step 4: Add specs for Contacto and Cotizador**

`src/app/features/public/contacto/contacto.spec.ts` (mirror Spaceia spec, import `Contacto`, expect `'Contacto'`).
`src/app/features/public/cotizador/cotizador.spec.ts` (mirror Spaceia spec, import `Cotizador`, expect `'Cotizador'`).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/app/features/public/`
Expected: PASS — 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/app/features/public/spaceia src/app/features/public/contacto src/app/features/public/cotizador
git commit -m "feat(public): add placeholder spaceia, contacto, cotizador pages"
```

---

### Task 3: Hero section

**Files:**
- Create: `src/app/features/public/home/sections/hero/hero.ts`
- Create: `src/app/features/public/home/sections/hero/hero.spec.ts`

**Interfaces:**
- Consumes: design tokens; `HlmButtonImports` from `@spartan-ng/helm/button`.
- Produces: `Hero` standalone component, selector `app-hero`. Consumed by `Home` (Task 7).

- [ ] **Step 1: Write the failing test**

`hero.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Hero } from './hero';

describe('Hero', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders headline and both CTA links', async () => {
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBeTruthy();
    const hrefs = Array.from(el.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/cotizador');
    expect(hrefs).toContain('/contacto');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/features/public/home/sections/hero/hero.spec.ts`
Expected: FAIL — cannot find module `./hero`.

- [ ] **Step 3: Implement Hero**

`hero.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, HlmButtonImports],
  template: `
    <section class="mx-auto max-w-5xl px-6 py-24 text-center">
      <h1 class="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
        La plataforma universitaria inteligente
      </h1>
      <p class="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
        SpaceIA integra IA, IoT y automatización para transformar tu campus.
      </p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a hlmBtn routerLink="/cotizador">Cotizar ahora</a>
        <a hlmBtn variant="outline" routerLink="/contacto">Contactar</a>
      </div>
    </section>
  `,
})
export class Hero {}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/features/public/home/sections/hero/hero.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/features/public/home/sections/hero
git commit -m "feat(home): add hero section"
```

---

### Task 4: Features section

**Files:**
- Create: `src/app/features/public/home/sections/features/features.ts`
- Create: `src/app/features/public/home/sections/features/features.spec.ts`

**Interfaces:**
- Consumes: design tokens; `HlmCardImports` from `@spartan-ng/helm/card`; `NgIcon`/`provideIcons` from `@ng-icons/core`; `lucideBrain`, `lucideCpu`, `lucideWorkflow` from `@ng-icons/lucide`.
- Produces: `Features` standalone component, selector `app-features`. Consumed by `Home` (Task 7).

- [ ] **Step 1: Write the failing test**

`features.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { Features } from './features';

describe('Features', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Features] }).compileComponents();
  });

  it('renders three feature cards', async () => {
    const fixture = TestBed.createComponent(Features);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('[hlmCard]').length).toBe(3);
  });

  it('reserves the accent color for the AI card only', async () => {
    const fixture = TestBed.createComponent(Features);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.text-accent').length).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/features/public/home/sections/features/features.spec.ts`
Expected: FAIL — cannot find module `./features`.

- [ ] **Step 3: Implement Features**

`features.ts`:

```typescript
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideCpu, lucideWorkflow } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-features',
  imports: [NgIcon, HlmCardImports],
  providers: [provideIcons({ lucideBrain, lucideCpu, lucideWorkflow })],
  template: `
    <section class="mx-auto max-w-6xl px-6 py-20">
      <h2 class="text-foreground text-center text-3xl font-bold">Un ecosistema, tres pilares</h2>
      <div class="mt-12 grid gap-6 sm:grid-cols-3">
        <div hlmCard class="p-6">
          <ng-icon name="lucideBrain" class="text-accent" size="28" />
          <h3 hlmCardTitle class="mt-4">Inteligencia Artificial</h3>
          <p hlmCardDescription class="mt-2">
            Modelos que asisten, predicen y automatizan decisiones del campus.
          </p>
        </div>
        <div hlmCard class="p-6">
          <ng-icon name="lucideCpu" class="text-secondary" size="28" />
          <h3 hlmCardTitle class="mt-4">IoT</h3>
          <p hlmCardDescription class="mt-2">
            Sensores y dispositivos conectados que miden el entorno en tiempo real.
          </p>
        </div>
        <div hlmCard class="p-6">
          <ng-icon name="lucideWorkflow" class="text-primary" size="28" />
          <h3 hlmCardTitle class="mt-4">Automatización</h3>
          <p hlmCardDescription class="mt-2">
            Flujos que conectan datos y acciones sin intervención manual.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class Features {}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/features/public/home/sections/features/features.spec.ts`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/features/public/home/sections/features
git commit -m "feat(home): add features section with AI accent"
```

---

### Task 5: How-It-Works section

**Files:**
- Create: `src/app/features/public/home/sections/how-it-works/how-it-works.ts`
- Create: `src/app/features/public/home/sections/how-it-works/how-it-works.spec.ts`

**Interfaces:**
- Consumes: design tokens. No spartan imports.
- Produces: `HowItWorks` standalone component, selector `app-how-it-works`. Consumed by `Home` (Task 7).

- [ ] **Step 1: Write the failing test**

`how-it-works.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { HowItWorks } from './how-it-works';

describe('HowItWorks', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HowItWorks] }).compileComponents();
  });

  it('renders three numbered steps', async () => {
    const fixture = TestBed.createComponent(HowItWorks);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('li').length).toBe(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/features/public/home/sections/how-it-works/how-it-works.spec.ts`
Expected: FAIL — cannot find module `./how-it-works`.

- [ ] **Step 3: Implement HowItWorks**

`how-it-works.ts`:

```typescript
import { Component } from '@angular/core';

interface Step {
  readonly number: number;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-how-it-works',
  template: `
    <section class="bg-card border-border border-y">
      <div class="mx-auto max-w-5xl px-6 py-20">
        <h2 class="text-foreground text-center text-3xl font-bold">Cómo funciona</h2>
        <ol class="mt-12 grid gap-8 sm:grid-cols-3">
          @for (step of steps; track step.number) {
            <li class="text-center">
              <span
                class="bg-primary text-primary-foreground mx-auto flex h-10 w-10 items-center justify-center rounded-full font-semibold"
                >{{ step.number }}</span
              >
              <h3 class="text-foreground mt-4 font-semibold">{{ step.title }}</h3>
              <p class="text-muted-foreground mt-2 text-sm">{{ step.description }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class HowItWorks {
  protected readonly steps: readonly Step[] = [
    { number: 1, title: 'Conecta', description: 'Integramos sensores y datos de tu campus.' },
    { number: 2, title: 'Analiza', description: 'La IA procesa y detecta oportunidades.' },
    { number: 3, title: 'Automatiza', description: 'Acciones que se ejecutan solas.' },
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/features/public/home/sections/how-it-works/how-it-works.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/features/public/home/sections/how-it-works
git commit -m "feat(home): add how-it-works section"
```

---

### Task 6: CTA band section

**Files:**
- Create: `src/app/features/public/home/sections/cta-band/cta-band.ts`
- Create: `src/app/features/public/home/sections/cta-band/cta-band.spec.ts`

**Interfaces:**
- Consumes: design tokens; `HlmButtonImports`; `RouterLink`.
- Produces: `CtaBand` standalone component, selector `app-cta-band`. Consumed by `Home` (Task 7).

- [ ] **Step 1: Write the failing test**

`cta-band.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CtaBand } from './cta-band';

describe('CtaBand', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaBand],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders a CTA link to the cotizador', async () => {
    const fixture = TestBed.createComponent(CtaBand);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const hrefs = Array.from(el.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/cotizador');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/features/public/home/sections/cta-band/cta-band.spec.ts`
Expected: FAIL — cannot find module `./cta-band`.

- [ ] **Step 3: Implement CtaBand**

`cta-band.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, HlmButtonImports],
  template: `
    <section class="mx-auto max-w-4xl px-6 py-24 text-center">
      <h2 class="text-foreground text-3xl font-bold">¿Listo para empezar?</h2>
      <p class="text-muted-foreground mx-auto mt-4 max-w-xl">
        Solicita una cotización y lleva la inteligencia a tu universidad.
      </p>
      <div class="mt-8">
        <a hlmBtn routerLink="/cotizador">Cotizar ahora</a>
      </div>
    </section>
  `,
})
export class CtaBand {}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/features/public/home/sections/cta-band/cta-band.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/features/public/home/sections/cta-band
git commit -m "feat(home): add cta band section"
```

---

### Task 7: Home page (composition)

**Files:**
- Create: `src/app/features/public/home/home.ts`
- Create: `src/app/features/public/home/home.spec.ts`

**Interfaces:**
- Consumes: `Hero`, `Features`, `HowItWorks`, `CtaBand` (Tasks 3–6).
- Produces: `Home` standalone component, selector `app-home`. Consumed by router (Task 9).

- [ ] **Step 1: Write the failing test**

`home.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('composes all four landing sections', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-hero')).toBeTruthy();
    expect(el.querySelector('app-features')).toBeTruthy();
    expect(el.querySelector('app-how-it-works')).toBeTruthy();
    expect(el.querySelector('app-cta-band')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/features/public/home/home.spec.ts`
Expected: FAIL — cannot find module `./home`.

- [ ] **Step 3: Implement Home**

`home.ts`:

```typescript
import { Component } from '@angular/core';
import { Hero } from './sections/hero/hero';
import { Features } from './sections/features/features';
import { HowItWorks } from './sections/how-it-works/how-it-works';
import { CtaBand } from './sections/cta-band/cta-band';

@Component({
  selector: 'app-home',
  imports: [Hero, Features, HowItWorks, CtaBand],
  template: `
    <app-hero />
    <app-features />
    <app-how-it-works />
    <app-cta-band />
  `,
})
export class Home {}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/features/public/home/home.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/features/public/home/home.ts src/app/features/public/home/home.spec.ts
git commit -m "feat(home): compose landing page from sections"
```

---

### Task 8: PublicLayout

**Files:**
- Create: `src/app/layouts/public-layout/public-layout.ts`
- Create: `src/app/layouts/public-layout/public-layout.spec.ts`

**Interfaces:**
- Consumes: design tokens; `RouterLink`, `RouterLinkActive`, `RouterOutlet`; `HlmButtonImports`; `NgIcon`/`provideIcons` with `lucideMenu`, `lucideX`.
- Produces: `PublicLayout` standalone component, selector `app-public-layout`, with a `menuOpen` signal toggled by `toggleMenu()`. Consumed by router (Task 9).

- [ ] **Step 1: Write the failing test**

`public-layout.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PublicLayout } from './public-layout';

describe('PublicLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLayout],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders header, main outlet, footer landmarks', async () => {
    const fixture = TestBed.createComponent(PublicLayout);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('header')).toBeTruthy();
    expect(el.querySelector('nav')).toBeTruthy();
    expect(el.querySelector('main router-outlet')).toBeTruthy();
    expect(el.querySelector('footer')).toBeTruthy();
  });

  it('links to the login page', async () => {
    const fixture = TestBed.createComponent(PublicLayout);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const hrefs = Array.from(el.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/login');
  });

  it('toggles the mobile menu signal', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    const cmp = fixture.componentInstance;
    expect(cmp.menuOpen()).toBe(false);
    cmp.toggleMenu();
    expect(cmp.menuOpen()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/layouts/public-layout/public-layout.spec.ts`
Expected: FAIL — cannot find module `./public-layout`.

- [ ] **Step 3: Implement PublicLayout**

`public-layout.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

interface NavLink {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'app-public-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideMenu, lucideX })],
  template: `
    <header class="bg-card border-border sticky top-0 z-40 border-b">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a routerLink="/" class="text-foreground text-lg font-bold">SpaceIA</a>

        <nav class="hidden items-center gap-6 sm:flex" aria-label="Principal">
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="text-foreground"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-muted-foreground hover:text-foreground text-sm"
              >{{ link.label }}</a
            >
          }
          <a hlmBtn variant="outline" size="sm" routerLink="/login">Iniciar sesión</a>
        </nav>

        <button
          hlmBtn
          variant="ghost"
          size="icon"
          class="sm:hidden"
          type="button"
          [attr.aria-expanded]="menuOpen()"
          aria-label="Abrir menú"
          (click)="toggleMenu()"
        >
          <ng-icon [name]="menuOpen() ? 'lucideX' : 'lucideMenu'" size="20" />
        </button>
      </div>

      @if (menuOpen()) {
        <nav class="border-border border-t px-6 py-4 sm:hidden" aria-label="Móvil">
          <ul class="flex flex-col gap-3">
            @for (link of links; track link.path) {
              <li>
                <a
                  [routerLink]="link.path"
                  class="text-muted-foreground hover:text-foreground block text-sm"
                  (click)="closeMenu()"
                  >{{ link.label }}</a
                >
              </li>
            }
            <li>
              <a hlmBtn variant="outline" size="sm" routerLink="/login" (click)="closeMenu()"
                >Iniciar sesión</a
              >
            </li>
          </ul>
        </nav>
      }
    </header>

    <main>
      <router-outlet />
    </main>

    <footer class="bg-card border-border border-t">
      <div
        class="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© 2026 Lattice Systems · SpaceIA</p>
        <nav class="flex gap-4" aria-label="Pie de página">
          @for (link of links; track link.path) {
            <a [routerLink]="link.path" class="hover:text-foreground">{{ link.label }}</a>
          }
        </nav>
      </div>
    </footer>
  `,
})
export class PublicLayout {
  protected readonly links: readonly NavLink[] = [
    { path: '/', label: 'Home' },
    { path: '/spaceia', label: 'SpaceIA' },
    { path: '/contacto', label: 'Contacto' },
    { path: '/cotizador', label: 'Cotizador' },
  ];

  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/layouts/public-layout/public-layout.spec.ts`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/layouts/public-layout
git commit -m "feat(layout): add public layout with responsive nav and footer"
```

---

### Task 9: Wire routes + reduce app shell

**Files:**
- Modify: `src/app/app.routes.ts` (replace empty array)
- Modify: `src/app/app.ts` (reduce to router-outlet shell)
- Modify: `src/app/app.html` (replace with single outlet)
- Modify: `src/app/app.css` (leave empty)
- Modify: `src/app/app.spec.ts` (replace title test)

**Interfaces:**
- Consumes: `PublicLayout` (Task 8), `Home` (Task 7), `Spaceia`/`Contacto`/`Cotizador` (Task 2).
- Produces: routed application. Terminal task — nothing consumes it.

- [ ] **Step 1: Update the app shell test (failing)**

Replace `src/app/app.spec.ts` with:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/app.spec.ts`
Expected: FAIL — current `App` imports `HlmButtonImports`/`NgIcon` and renders the old shell; the title assertion is gone and the outlet-only shell does not exist yet (or fails compiling against old `app.html`).

- [ ] **Step 3: Reduce the app shell**

`src/app/app.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

`src/app/app.html`:

```html
<router-outlet />
```

`src/app/app.css`: leave empty (no rules).

- [ ] **Step 4: Wire the routes**

`src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home/home').then((m) => m.Home),
      },
      {
        path: 'spaceia',
        loadComponent: () =>
          import('./features/public/spaceia/spaceia').then((m) => m.Spaceia),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/public/contacto/contacto').then((m) => m.Contacto),
      },
      {
        path: 'cotizador',
        loadComponent: () =>
          import('./features/public/cotizador/cotizador').then((m) => m.Cotizador),
      },
    ],
  },
];
```

> Note: `/login` is referenced by the navbar but is intentionally NOT routed in this slice — it belongs to the auth slice. Until then it resolves to nothing (no matching route). This is a known, documented gap, not a silent dead link.

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — all specs green.

- [ ] **Step 6: Verify build + manual smoke**

Run: `npx ng build 2>&1 | tail -5`
Expected: `Application bundle generation complete.`
Then `npx ng serve` and confirm at `http://localhost:4200`: Home shows hero + features + how-it-works + cta, nav routes to SpaceIA/Contacto/Cotizador placeholders, mobile menu toggles.

- [ ] **Step 7: Commit**

```bash
git add src/app/app.routes.ts src/app/app.ts src/app/app.html src/app/app.css src/app/app.spec.ts
git commit -m "feat(routing): wire public layout and landing routes"
```

---

## Self-Review Notes

- **Spec coverage:** tokens+font (T1), folder scaffold (T1–T9 create the dirs), routing (T9), PublicLayout header/footer/mobile (T8), Hero/Features/HowItWorks/CtaBand (T3–T6), Home composition (T7), placeholders (T2), testing+a11y landmarks (every task's spec + T8 landmarks). All spec sections mapped.
- **Login gap:** navbar links `/login` with no route this slice — documented in T9 Step 4, matches spec section 3.
- **Type consistency:** component class names and selectors (`Home`/`app-home`, `Hero`/`app-hero`, `Features`/`app-features`, `HowItWorks`/`app-how-it-works`, `CtaBand`/`app-cta-band`, `Spaceia`/`Contacto`/`Cotizador`, `PublicLayout`/`app-public-layout`) used identically in producing and consuming tasks. `menuOpen()`/`toggleMenu()`/`closeMenu()` consistent in T8.
- **Helm selectors verified:** `[hlmCard]`, `[hlmCardTitle]`, `[hlmCardDescription]`, `a[hlmBtn]`, all confirmed against `libs/ui/*`.
