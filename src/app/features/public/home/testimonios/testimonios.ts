import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { ReviewsService } from '../../../../core/services/reviews.service';

interface Testimonio {
  id: string;
  quote: string;
  name: string;
  institution: string;
  initials: string;
}

const AUTOPLAY_MS = 5500;
const FADE_MS     = 280;

function initialsOf(institutionName: string): string {
  const words = institutionName.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 3).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'SP';
}

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
    @if (testimonios().length > 0) {
      <section class="py-14 sm:py-20">
        <div class="mx-auto max-w-4xl px-6 lg:px-16">

          <!-- Header -->
          <div #sectionEl class="section-anim mb-12 text-center">
            <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
              Resultados en producción
            </p>
            <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Lo que dicen las instituciones que ya usan SpaceIA
            </h2>
          </div>

          <!-- Card: quote — fade interno al cambiar slide -->
          <div
            class="section-anim rounded-2xl border border-border bg-card p-8 sm:p-12"
            style="transition-delay: 120ms"
          >
            <div #cardBody class="card-body">

              <!-- Comilla decorativa -->
              <div class="mb-5 select-none text-6xl font-black leading-none text-primary/20" aria-hidden="true">"</div>

              <!-- Quote -->
              <blockquote class="mb-8 text-base leading-relaxed text-foreground sm:text-lg">
                {{ current()?.quote }}
              </blockquote>

              <!-- Author -->
              <div class="flex items-center gap-4 border-t border-border pt-6">
                <div
                  class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                  aria-hidden="true"
                >
                  {{ current()?.initials }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-foreground">{{ current()?.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ current()?.institution }}</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Controls -->
          @if (testimonios().length > 1) {
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

              @for (t of testimonios(); track t.id; let i = $index) {
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
          }

        </div>
      </section>
    }
  `,
})
export class Testimonios {
  private readonly reviewsService = inject(ReviewsService);

  protected readonly testimonios = signal<Testimonio[]>([]);
  protected readonly idx     = signal(0);
  protected readonly current = computed(() => this.testimonios()[this.idx()]);

  private readonly destroyRef   = inject(DestroyRef);
  private readonly sectionRef   = viewChildren<ElementRef>('sectionEl');
  private readonly cardBodyRef  = viewChildren<ElementRef>('cardBody');

  private paused  = false;
  private busy    = false;
  private timerId?: ReturnType<typeof setInterval>;

  constructor() {
    this.reviewsService.listAll().subscribe((reviews) => {
      const approved = reviews.filter((r) => r.status === 'Approved');
      this.testimonios.set(
        approved.map((r) => ({
          id: r.id,
          quote: r.comment,
          name: r.contactPerson || r.institutionName,
          institution: r.institutionName,
          initials: initialsOf(r.institutionName),
        })),
      );
      if (approved.length > 0) this.armIntersectionObserver();
    });
  }

  private armIntersectionObserver(): void {
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

  protected next(): void { this.change((this.idx() + 1) % this.testimonios().length); }
  protected prev(): void { this.change((this.idx() - 1 + this.testimonios().length) % this.testimonios().length); }
  protected goTo(i: number): void { this.change(i); }

  private change(next: number): void {
    if (this.busy || next === this.idx()) return;
    this.busy = true;
    this.resetTimer();

    const bodyEl = this.cardBodyRef()[0]?.nativeElement as HTMLElement | undefined;
    if (bodyEl) bodyEl.classList.add('fading');

    setTimeout(() => {
      this.idx.set(next);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (bodyEl) bodyEl.classList.remove('fading');
        this.busy = false;
      }));
    }, FADE_MS);
  }

  private startAutoplay(): void {
    this.timerId = setInterval(() => {
      if (!this.paused) this.change((this.idx() + 1) % this.testimonios().length);
    }, AUTOPLAY_MS);
  }

  private resetTimer(): void {
    clearInterval(this.timerId);
    this.startAutoplay();
  }
}
