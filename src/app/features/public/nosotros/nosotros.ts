import { animate, style, transition, trigger } from '@angular/animations';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  viewChildren,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideEye,
  lucideLayers,
  lucideMapPin,
  lucideShieldCheck,
  lucideTarget,
  lucideUsers,
  lucideZap,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

// ─── Data ────────────────────────────────────────────────────────────────────

const HISTORIA = [
  {
    overline: 'EL PROBLEMA',
    text: 'Los campus universitarios operaban con decenas de sistemas desconectados. Los estudiantes hacían filas para trámites que debían tomar segundos.',
  },
  {
    overline: '2025 — LATTICE SYSTEMS',
    text: 'Fundamos Lattice Systems para construir la capa de inteligencia que conecta todo: accesos, orientación, logística y datos — en un solo ecosistema.',
  },
  {
    overline: '2026 — SPACEIA EN VIVO',
    text: 'SpaceIA entró en operación piloto en la Universidad Tecnológica de León. Lo que aprendemos con ellos define cada nueva versión.',
  },
];

const VALORES = [
  { icon: 'lucideZap',         title: 'Innovación',              desc: 'Buscamos formas más inteligentes de resolver problemas reales del campus.' },
  { icon: 'lucideShieldCheck', title: 'Calidad',                 desc: 'Entregamos soluciones que funcionan bien desde el primer día, sin parches.' },
  { icon: 'lucideEye',         title: 'Transparencia',           desc: 'Comunicación directa con clientes y equipo. Sin sorpresas.' },
  { icon: 'lucideUsers',       title: 'Orientación al cliente',  desc: 'Las necesidades del campus guían cada decisión de producto.' },
  { icon: 'lucideLayers',      title: 'Trabajo en equipo',       desc: 'Cada disciplina aporta — software, hardware, IA y robótica juntos.' },
  { icon: 'lucideTarget',      title: 'Compromiso',              desc: 'Cumplimos lo que prometemos. El campus confía en nosotros.' },
];

interface Stat { num: string; label: string; }
const STATS: Stat[] = [
  { num: '2025', label: 'Fundación de Lattice Systems' },
  { num: '2026', label: 'Lanzamiento de SpaceIA' },
  { num: '6',    label: 'Personas en el equipo' },
];

const EQUIPO = [
  { initials: 'DO', name: 'Daniel Ojeda Luna',             cargo: 'Cloud & DevOps' },
  { initials: 'EO', name: 'Emmanuel Ortiz Reyes',          cargo: 'Backend' },
  { initials: 'JP', name: 'Juan Pablo Rea Cano',           cargo: 'Frontend' },
  { initials: 'JN', name: 'Jael Neftali Vargas Grijalva',  cargo: 'Hardware & IoT' },
  { initials: 'HG', name: 'Haziel Gutiérrez Hernández',    cargo: 'Robótica' },
  { initials: 'EM', name: 'Emiliano Mendoza Maldonado',    cargo: 'IA & NLP' },
];

// ─── Animation helpers ───────────────────────────────────────────────────────

function observe1(el: HTMLElement, cb: () => void): void {
  const obs = new IntersectionObserver(
    ([e]) => { if (e.isIntersecting) { cb(); obs.disconnect(); } },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' },
  );
  obs.observe(el);
}

function countUp(el: HTMLElement | undefined, raw: string, dur = 1000): void {
  if (!el) return;
  const isPercent = raw.endsWith('%');
  const end = parseFloat(raw);
  if (Number.isNaN(end)) { el.textContent = raw; return; }
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.round(end * ease);
    el.textContent = isPercent ? `${val}%` : String(val);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ─── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-nosotros',
  imports: [RouterLink, HlmButtonImports, NgIcon, NgOptimizedImage],
  providers: [
    provideIcons({ lucideMapPin, lucideZap, lucideUsers, lucideLayers, lucideShieldCheck, lucideEye, lucideTarget }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeSlideInDelay', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms 200ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  styles: [`
    :host { display: block; }

    .sec-anim {
      opacity: 0; transform: translateY(20px);
      transition: opacity 600ms cubic-bezier(0.23,1,0.32,1),
                  transform 600ms cubic-bezier(0.23,1,0.32,1);
    }
    .sec-anim.visible { opacity: 1; transform: none; }

    .card-anim {
      opacity: 0; transform: translateY(24px);
      transition: opacity 700ms cubic-bezier(0.23,1,0.32,1),
                  transform 700ms cubic-bezier(0.23,1,0.32,1);
    }
    .card-anim.visible { opacity: 1; transform: none; }

    .stat-anim {
      opacity: 0;
      transition: opacity 600ms cubic-bezier(0.23,1,0.32,1);
    }
    .stat-anim.visible { opacity: 1; }

    @media (prefers-reduced-motion: reduce) {
      .sec-anim, .card-anim, .stat-anim { transition: none; opacity: 1; transform: none; }
    }
  `],
  template: `
    <!-- ── 1. Hero ──────────────────────────────────────────────────────── -->
    <section class="relative flex min-h-[50vh] flex-col justify-center overflow-hidden px-6 py-24 sm:px-10 lg:px-16">
      <div
        class="pointer-events-none absolute inset-0"
        style="background: radial-gradient(ellipse 60% 70% at 30% 50%, oklch(0.715 0.143 215.221 / 0.07) 0%, transparent 65%)"
        aria-hidden="true"
      ></div>

      <div @fadeSlideIn class="relative z-10 mx-auto max-w-3xl">
        <!-- Logo -->
        <div class="mb-8">
          <img
            ngSrc="/lattice_systems-logo.png"
            alt="Lattice Systems"
            width="600"
            height="600"
            class="h-16 w-auto dark:hidden"
            priority
          />
          <img
            ngSrc="/latticesystems-logo-dark-variant.png"
            alt="Lattice Systems"
            width="600"
            height="600"
            class="hidden h-16 w-auto dark:block"
            priority
          />
        </div>

        <!-- Location badge -->
        <div class="mb-5 flex items-center gap-2">
          <ng-icon name="lucideMapPin" size="14" class="text-muted-foreground" aria-hidden="true" />
          <span class="text-xs font-medium text-muted-foreground">León, Guanajuato, México</span>
        </div>

        <h1 class="mb-4 text-5xl font-extrabold leading-[1.06] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
          Construimos el<br class="hidden sm:block" /> campus del futuro.
        </h1>

        <p @fadeSlideInDelay class="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Construimos el sistema nervioso del campus universitario moderno.
          IA, IoT y automatización al servicio de la comunidad académica.
        </p>
      </div>
    </section>

    <!-- ── 2. Historia — Split ───────────────────────────────────────────── -->
    <section class="py-14 sm:py-20">
      <div class="mx-auto max-w-7xl px-6 lg:px-16">
        <div class="grid gap-12 lg:grid-cols-[1fr_1.4fr]">

          <!-- Left sticky label -->
          <div #histLeft class="sec-anim lg:sticky lg:top-24 lg:self-start">
            <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/70">NUESTRA HISTORIA</p>
            <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Por qué<br /> construimos SpaceIA.
            </h2>
            <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
              Todo empezó con una observación simple: los campus mexicanos tenían tecnología de sobra,
              pero ningún sistema que la conectara.
            </p>
          </div>

          <!-- Right: 3 story points -->
          <div class="flex flex-col gap-8">
            @for (h of historia; track h.overline; let i = $index) {
              <div #histCard class="card-anim border-l-2 border-primary/25 pl-5">
                <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/70">{{ h.overline }}</p>
                <p class="text-sm leading-relaxed text-muted-foreground">{{ h.text }}</p>
              </div>
            }
          </div>

        </div>
      </div>
    </section>

    <!-- ── 3. Valores ────────────────────────────────────────────────────── -->
    <section class="bg-gradient-to-b from-transparent via-muted/30 to-transparent py-14 sm:py-20">
      <div class="mx-auto max-w-7xl px-6 lg:px-16">

        <div #valHeader class="sec-anim mb-12 max-w-xl">
          <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/70">VALORES</p>
          <h2 class="text-3xl font-bold tracking-tight text-foreground">Lo que nos mueve.</h2>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (v of valores; track v.title; let i = $index) {
            <div #valCard class="card-anim flex flex-col gap-3 rounded-lg border border-border bg-card p-6">
              <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <ng-icon [name]="v.icon" size="20" class="text-primary" aria-hidden="true" />
              </div>
              <h3 class="font-semibold tracking-tight text-foreground">{{ v.title }}</h3>
              <p class="text-sm leading-relaxed text-muted-foreground">{{ v.desc }}</p>
            </div>
          }
        </div>

      </div>
    </section>

    <!-- ── 4. En números ────────────────────────────────────────────────── -->
    <section class="py-14 sm:py-20">
      <div class="mx-auto max-w-7xl px-6 lg:px-16">

        <div #numHeader class="sec-anim mb-10 max-w-xl">
          <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/70">EN NÚMEROS</p>
          <h2 class="text-3xl font-bold tracking-tight text-foreground">Dónde estamos hoy.</h2>
        </div>

        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
          @for (s of stats; track s.label; let i = $index) {
            <div #statCell class="stat-anim border-t-2 border-primary/25 pt-5"
              [style.transition-delay]="i * 80 + 'ms'">
              <span #statNum class="mb-1 block text-5xl font-bold tabular-nums text-primary"></span>
              <span class="text-sm leading-snug text-muted-foreground">{{ s.label }}</span>
            </div>
          }
        </div>

      </div>
    </section>

    <!-- ── 5. Equipo ─────────────────────────────────────────────────────── -->
    <section class="bg-gradient-to-b from-transparent via-muted/30 to-transparent py-14 sm:py-20">
      <div class="mx-auto max-w-7xl px-6 lg:px-16">

        <div #teamHeader class="sec-anim mb-12 max-w-xl">
          <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/70">EQUIPO</p>
          <h2 class="text-3xl font-bold tracking-tight text-foreground">Las personas detrás.</h2>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          @for (p of equipo; track p.name; let i = $index) {
            <div #teamCard class="card-anim flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center">
              <div
                class="flex size-14 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary"
                aria-hidden="true"
              >{{ p.initials }}</div>
              <div>
                <p class="text-sm font-semibold text-foreground">{{ p.name }}</p>
                <p class="mt-0.5 text-xs text-muted-foreground">{{ p.cargo }}</p>
              </div>
            </div>
          }
        </div>

      </div>
    </section>

    <!-- ── 6. CTA ─────────────────────────────────────────────────────────── -->
    <section class="border-y border-border bg-card py-20">
      <div #ctaSection class="sec-anim mx-auto max-w-2xl px-6 text-center">
        <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/70">ÚNETE</p>
        <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          ¿Quieres construir<br class="hidden sm:block" /> con nosotros?
        </h2>
        <p class="mb-8 text-base leading-relaxed text-muted-foreground">
          Estamos construyendo el campus del futuro desde León.<br class="hidden sm:block" />
          Cuéntanos qué estás buscando.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <a hlmBtn size="lg" routerLink="/contacto">Contáctanos</a>
          <a hlmBtn size="lg" variant="outline" routerLink="/cotizador">Solicitar cotización</a>
        </div>
      </div>
    </section>
  `,
})
export class Nosotros {
  protected readonly historia = HISTORIA;
  protected readonly valores  = VALORES;
  protected readonly stats    = STATS;
  protected readonly equipo   = EQUIPO;

  private readonly zone = inject(NgZone);

  private readonly histLeftRef  = viewChildren<ElementRef>('histLeft');
  private readonly histCards    = viewChildren<ElementRef>('histCard');
  private readonly valHeaderRef = viewChildren<ElementRef>('valHeader');
  private readonly valCards     = viewChildren<ElementRef>('valCard');
  private readonly numHeaderRef = viewChildren<ElementRef>('numHeader');
  private readonly statCells    = viewChildren<ElementRef>('statCell');
  private readonly statNums     = viewChildren<ElementRef>('statNum');
  private readonly teamHeaderRef = viewChildren<ElementRef>('teamHeader');
  private readonly teamCards    = viewChildren<ElementRef>('teamCard');
  private readonly ctaRef       = viewChildren<ElementRef>('ctaSection');

  constructor() {
    afterNextRender(() => {
      // Historia
      this.histLeftRef()[0] && observe1(this.histLeftRef()[0].nativeElement, () =>
        this.histLeftRef()[0].nativeElement.classList.add('visible')
      );
      this.histCards().forEach((ref, i) => {
        const el = ref.nativeElement as HTMLElement;
        observe1(el, () => setTimeout(() => el.classList.add('visible'), i * 110));
      });

      // Valores
      this.valHeaderRef()[0] && observe1(this.valHeaderRef()[0].nativeElement, () =>
        this.valHeaderRef()[0].nativeElement.classList.add('visible')
      );
      this.valCards().forEach((ref, i) => {
        const el = ref.nativeElement as HTMLElement;
        observe1(el, () => setTimeout(() => el.classList.add('visible'), i * 80));
      });

      // Números
      this.numHeaderRef()[0] && observe1(this.numHeaderRef()[0].nativeElement, () =>
        this.numHeaderRef()[0].nativeElement.classList.add('visible')
      );
      this.statCells().forEach((ref, i) => {
        const cell  = ref.nativeElement as HTMLElement;
        const numEl = this.statNums()[i]?.nativeElement as HTMLElement;
        observe1(cell, () => setTimeout(() => {
          cell.classList.add('visible');
          this.zone.runOutsideAngular(() => countUp(numEl, STATS[i].num));
        }, i * 80));
      });

      // Equipo
      this.teamHeaderRef()[0] && observe1(this.teamHeaderRef()[0].nativeElement, () =>
        this.teamHeaderRef()[0].nativeElement.classList.add('visible')
      );
      this.teamCards().forEach((ref, i) => {
        const el = ref.nativeElement as HTMLElement;
        observe1(el, () => setTimeout(() => el.classList.add('visible'), i * 80));
      });

      // CTA
      this.ctaRef()[0] && observe1(this.ctaRef()[0].nativeElement, () =>
        this.ctaRef()[0].nativeElement.classList.add('visible')
      );
    });
  }
}
