import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChildren,
} from '@angular/core';

interface Stat    { raw: string; label: string; }
interface Feature { tag: string; title: string; desc: string; }

const STATS: Stat[] = [
  { raw: '70%',  label: 'Reducción en tiempos de espera administrativa' },
  { raw: '3×',   label: 'Más rápida la orientación estudiantil' },
  { raw: '24/7', label: 'Asistencia IA sin interrupción' },
  { raw: '100%', label: 'Control de accesos digitalizado' },
];

// Tags encode the domain, not a sequence — 01/02/03 would lie about the relationship
const FEATURES: Feature[] = [
  {
    tag: 'PROCESOS',
    title: 'Automatiza los procesos críticos',
    desc: 'Accesos, orientación y soporte se gestionan sin intervención manual. Tu equipo se enfoca en lo que importa.',
  },
  {
    tag: 'COMUNIDAD',
    title: 'Conecta a toda la comunidad',
    desc: 'Estudiantes, docentes y personal con información institucional en tiempo real desde cualquier punto del campus.',
  },
  {
    tag: 'CONTROL',
    title: 'Un ecosistema, control total',
    desc: 'Seguridad, métricas y operaciones en un solo panel. Visibilidad completa sin añadir complejidad.',
  },
];

@Component({
  selector: 'app-beneficios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    .header-anim {
      opacity: 0; transform: translateY(20px);
      transition: opacity 600ms cubic-bezier(0.23,1,0.32,1),
                  transform 600ms cubic-bezier(0.23,1,0.32,1);
    }
    .header-anim.visible { opacity: 1; transform: none; }

    .stat-cell {
      opacity: 0;
      transition: opacity 600ms cubic-bezier(0.23,1,0.32,1);
    }
    .stat-cell.visible { opacity: 1; }

    .feat-anim {
      opacity: 0; transform: translateY(24px);
      transition: opacity 700ms cubic-bezier(0.23,1,0.32,1),
                  transform 700ms cubic-bezier(0.23,1,0.32,1);
    }
    .feat-anim.visible { opacity: 1; transform: none; }

    @media (prefers-reduced-motion: reduce) {
      .header-anim, .stat-cell, .feat-anim { transition: none; opacity: 1; transform: none; }
    }
  `],
  template: `
    <section class="bg-gradient-to-b from-transparent via-muted/40 to-transparent py-14 sm:py-20">
      <div class="mx-auto max-w-7xl px-6 lg:px-16">

        <div
          #header
          class="header-anim mx-auto mb-12 max-w-2xl text-center"
          [class.visible]="headerVisible()"
        >
          <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Por qué las instituciones<br class="hidden sm:block" /> eligen SpaceIA
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            Resultados concretos desde el primer día de operación.
          </p>
        </div>

        <!-- Stats: open grid, no card/box -->
        <div class="mb-14 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          @for (s of stats; track s.raw; let i = $index) {
            <div
              #statCell
              class="stat-cell border-t-2 border-primary/25 pt-5"
              [style.transition-delay]="i * 70 + 'ms'"
            >
              <span
                #statNum
                class="mb-1 block text-4xl font-bold tabular-nums text-primary sm:text-5xl"
              ></span>
              <span class="text-xs leading-snug text-muted-foreground sm:text-sm">{{ s.label }}</span>
            </div>
          }
        </div>

        <!--
          Features: left-border accent encodes "capability domain", not sequence.
          No numbers — the three items are parallel, not ordered steps.
        -->
        <div class="grid gap-8 sm:grid-cols-3">
          @for (f of features; track f.tag; let i = $index) {
            <div
              #featEl
              class="feat-anim border-l-2 border-primary/25 pl-5"
            >
              <span class="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary/70">
                {{ f.tag }}
              </span>
              <h3 class="mb-2 text-lg font-bold tracking-tight text-foreground">{{ f.title }}</h3>
              <p class="text-sm leading-relaxed text-muted-foreground">{{ f.desc }}</p>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class Beneficios {
  protected readonly stats    = STATS;
  protected readonly features = FEATURES;
  protected readonly headerVisible = signal(false);

  private readonly zone      = inject(NgZone);
  private readonly headerRef = viewChildren<ElementRef>('header');
  private readonly statCells = viewChildren<ElementRef>('statCell');
  private readonly statNums  = viewChildren<ElementRef>('statNum');
  private readonly featEls   = viewChildren<ElementRef>('featEl');

  constructor() {
    afterNextRender(() => {
      const h = this.headerRef()[0];
      if (h) observe1(h.nativeElement, () => this.headerVisible.set(true));

      this.statCells().forEach((ref, i) => {
        const cell  = ref.nativeElement as HTMLElement;
        const numEl = this.statNums()[i]?.nativeElement as HTMLElement;
        observe1(cell, () => {
          setTimeout(() => {
            cell.classList.add('visible');
            this.zone.runOutsideAngular(() => countUp(numEl, STATS[i].raw));
          }, i * 80);
        });
      });

      this.featEls().forEach((ref, i) => {
        const el = ref.nativeElement as HTMLElement;
        observe1(el, () => setTimeout(() => el.classList.add('visible'), i * 110));
      });
    });
  }
}

function observe1(el: HTMLElement, cb: () => void): void {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { cb(); obs.disconnect(); }
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
  obs.observe(el);
}

function countUp(el: HTMLElement | undefined, raw: string, dur = 1100): void {
  if (!el) return;
  if (raw === '24/7') { el.textContent = '24/7'; return; }
  const isPercent = raw.endsWith('%');
  const isX       = raw.endsWith('×');
  const end       = parseFloat(raw);
  const t0        = performance.now();
  const tick = (now: number) => {
    const p    = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val  = Math.round(end * ease);
    el.textContent = isPercent ? `${val}%` : isX ? `${val}×` : String(val);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
