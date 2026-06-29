import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';

interface Testimonio {
  id: string;
  quote: string;
  name: string;
  role: string;
  institution: string;
  initials: string;
}

const TESTIMONIOS: Testimonio[] = [
  {
    id: 't1',
    quote: 'Redujimos el tiempo de espera en ventanilla un 68% en el primer trimestre. Los estudiantes resuelven trámites en segundos desde el kiosco — sin hacer fila.',
    name: 'Mtro. Carlos Ramírez',
    role: 'Director de Servicios Escolares',
    institution: 'Universidad Autónoma de Sonora',
    initials: 'UAS',
  },
  {
    id: 't2',
    quote: 'El Kiosco SIDE atiende más de 3,200 consultas al mes sin un solo asesor adicional. Es como tener un equipo de orientación disponible las 24 horas en cada pasillo.',
    name: 'Ing. Patricia Morales',
    role: 'Coordinadora de Tecnología Educativa',
    institution: 'Instituto Tecnológico de Hermosillo',
    initials: 'ITH',
  },
  {
    id: 't3',
    quote: 'Implementamos el control de acceso en todo el campus en menos de dos semanas. Desde el día uno, el 100% de nuestros accesos son digitales, trazables y sin papel.',
    name: 'Dr. Roberto Fuentes',
    role: 'Rector',
    institution: 'Universidad de Occidente',
    initials: 'UDO',
  },
];

const AUTOPLAY_MS = 5500;
const FADE_MS     = 280;

@Component({
  selector: 'app-testimonios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    .section-anim {
      opacity: 0; transform: translateY(20px);
      transition: opacity 600ms cubic-bezier(0.23,1,0.32,1),
                  transform 600ms cubic-bezier(0.23,1,0.32,1);
    }
    .section-anim.visible { opacity: 1; transform: none; }

    .card-body {
      transition: opacity 260ms ease;
    }
    .card-body.fading { opacity: 0; }

    @media (prefers-reduced-motion: reduce) {
      .section-anim { transition: none; opacity: 1; transform: none; }
      .card-body    { transition: none; }
    }
  `],
  template: `
    <section class="bg-muted/20 py-14 sm:py-20">
      <div class="mx-auto max-w-4xl px-6 lg:px-16">

        <!-- Header -->
        <div #sectionEl class="section-anim mb-12 text-center">
          <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
            Resultados en producción
          </p>
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Impacto medible desde el primer día
          </h2>
        </div>

        <!-- Card: quote con métrica — fade interno al cambiar slide -->
        <div
          class="section-anim rounded-2xl border border-border bg-card p-8 sm:p-12"
          style="transition-delay: 120ms"
        >
          <div #cardBody class="card-body">

            <!-- Comilla decorativa -->
            <div class="mb-5 select-none text-6xl font-black leading-none text-primary/20" aria-hidden="true">"</div>

            <!-- Quote con métrica embebida -->
            <blockquote class="mb-8 text-base leading-relaxed text-foreground sm:text-lg">
              {{ current().quote }}
            </blockquote>

            <!-- Author -->
            <div class="flex items-center gap-4 border-t border-border pt-6">
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                aria-hidden="true"
              >
                {{ current().initials }}
              </div>
              <div>
                <p class="text-sm font-semibold text-foreground">{{ current().name }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ current().role }}&nbsp;·&nbsp;{{ current().institution }}
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Controls -->
        <div
          class="mt-6 flex items-center justify-center gap-3"
          role="group"
          aria-label="Navegación de instituciones piloto"
        >
          <button
            (click)="prev()"
            class="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label="Institución anterior"
          >
            <svg class="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          @for (t of testimonios; track t.id; let i = $index) {
            <button
              (click)="goTo(i)"
              class="h-1.5 rounded-full transition-all duration-300"
              [class.w-6]="idx() === i"
              [class.bg-primary]="idx() === i"
              [class.w-1.5]="idx() !== i"
              [class.bg-muted-foreground]="idx() !== i"
              [class.opacity-30]="idx() !== i"
              [attr.aria-label]="'Ver resultado ' + (i + 1)"
              [attr.aria-current]="idx() === i ? 'true' : null"
            ></button>
          }

          <button
            (click)="next()"
            class="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label="Siguiente institución"
          >
            <svg class="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  `,
})
export class Testimonios {
  protected readonly testimonios = TESTIMONIOS;
  protected readonly idx         = signal(0);
  protected readonly current     = signal(TESTIMONIOS[0]);

  private readonly destroyRef   = inject(DestroyRef);
  private readonly sectionRef   = viewChildren<ElementRef>('sectionEl');
  private readonly cardBodyRef  = viewChildren<ElementRef>('cardBody');

  private paused  = false;
  private busy    = false;
  private timerId?: ReturnType<typeof setInterval>;

  constructor() {
    afterNextRender(() => {
      const el = this.sectionRef()[0]?.nativeElement as HTMLElement | undefined;
      if (!el) return;

      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          el.closest('section')
            ?.querySelectorAll<HTMLElement>('.section-anim')
            .forEach(n => n.classList.add('visible'));
          this.startAutoplay();
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(el);

      this.destroyRef.onDestroy(() => clearInterval(this.timerId));
    });
  }

  protected next(): void { this.change((this.idx() + 1) % TESTIMONIOS.length); }
  protected prev(): void { this.change((this.idx() - 1 + TESTIMONIOS.length) % TESTIMONIOS.length); }
  protected goTo(i: number): void { this.change(i); }

  private change(next: number): void {
    if (this.busy || next === this.idx()) return;
    this.busy = true;
    this.resetTimer();

    const bodyEl = this.cardBodyRef()[0]?.nativeElement as HTMLElement | undefined;
    if (bodyEl) bodyEl.classList.add('fading');

    setTimeout(() => {
      this.idx.set(next);
      this.current.set(TESTIMONIOS[next]);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (bodyEl) bodyEl.classList.remove('fading');
        this.busy = false;
      }));
    }, FADE_MS);
  }

  private startAutoplay(): void {
    this.timerId = setInterval(() => {
      if (!this.paused) this.change((this.idx() + 1) % TESTIMONIOS.length);
    }, AUTOPLAY_MS);
  }

  private resetTimer(): void {
    clearInterval(this.timerId);
    this.startAutoplay();
  }
}
