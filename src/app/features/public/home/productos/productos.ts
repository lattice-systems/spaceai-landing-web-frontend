import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideBot,
  lucideFingerprint,
  lucideMonitor,
  lucideSmartphone,
} from '@ng-icons/lucide';

const PRODUCTOS = [
  {
    id: 'movil',
    label: 'Aplicación Móvil',
    icon: 'lucideSmartphone',
    color: '#22D3EE',
    fragment: 'movil',
    desc: 'Horarios, mapas, QR de identidad y notificaciones institucionales desde el smartphone del estudiante.',
  },
  {
    id: 'acceso',
    label: 'Control de Acceso',
    icon: 'lucideFingerprint',
    color: '#38BDF8',
    fragment: 'acceso',
    desc: 'Torniquetes y puertas gestionados con QR, NFC e IoT. Registro automático de entradas y salidas.',
  },
  {
    id: 'kiosco',
    label: 'Kiosco SIDE',
    icon: 'lucideMonitor',
    color: '#2DD4BF',
    fragment: 'kiosco',
    desc: 'Punto de información autónomo con IA conversacional. Atiende consultas de voz y texto en el campus.',
  },
  {
    id: 'robot',
    label: 'Robot Autónomo',
    icon: 'lucideBot',
    color: '#818CF8',
    fragment: 'robot',
    desc: 'Guía física inteligente que navega pasillos, detecta obstáculos y orienta visitantes de forma autónoma.',
  },
] as const;

@Component({
  selector: 'app-productos',
  imports: [RouterLink, NgIcon],
  providers: [
    provideIcons({ lucideSmartphone, lucideFingerprint, lucideMonitor, lucideBot, lucideArrowRight }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    /* Scroll entrance */
    .card-anim {
      opacity: 0;
      transform: translateY(40px);
      transition:
        opacity 700ms cubic-bezier(0.23, 1, 0.32, 1),
        transform 700ms cubic-bezier(0.23, 1, 0.32, 1),
        box-shadow 200ms ease,
        border-color 200ms ease;
    }
    .card-anim.visible { opacity: 1; transform: translateY(0); }

    .header-anim {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 600ms cubic-bezier(0.23, 1, 0.32, 1),
                  transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    .header-anim.visible { opacity: 1; transform: translateY(0); }

    /* Mouse spotlight inside card */
    .spotlight {
      background: radial-gradient(
        220px circle at var(--mx, 50%) var(--my, 50%),
        var(--spotlight, transparent),
        transparent 75%
      );
      opacity: 0;
      transition: opacity 300ms ease;
    }
    .card-wrap:hover .spotlight { opacity: 1; }

    /* Peeking icon */
    .card-icon {
      opacity: 0.22;
      transform: scale(1) rotate(0deg);
      transform-origin: top right;
      transition: opacity 450ms cubic-bezier(0.23, 1, 0.32, 1),
                  transform 500ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    .card-wrap:hover .card-icon {
      opacity: 0.50;
      transform: scale(1.15) rotate(5deg);
    }

    @media (prefers-reduced-motion: reduce) {
      .card-anim, .header-anim { transition: none; opacity: 1; transform: none; }
      .card-icon { transition: none; }
    }
  `],
  template: `
    <section class="py-12 sm:py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-16">

        <!-- Header — sin badge, overline text sutil -->
        <div
          #header
          class="header-anim mx-auto mb-14 max-w-2xl text-center"
          [class.visible]="headerVisible()"
        >
          <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
            Ecosistema SpaceIA
          </p>
          <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Un campus conectado de punta a punta
          </h2>
          <p class="text-base leading-relaxed text-muted-foreground">
            Cuatro productos integrados que automatizan procesos, modernizan espacios y elevan
            la experiencia de cada miembro de tu institución.
          </p>
        </div>

        <!-- Cards -->
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          @for (p of productos; track p.id; let i = $index) {
            <div
              #card
              class="card-anim card-wrap group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:-translate-y-1 hover:border-border/50 hover:shadow-lg"
              [class.visible]="cardVisible[i]()"
              [style.--spotlight]="p.color + '30'"
            >
              <!-- Mouse spotlight -->
              <div class="spotlight pointer-events-none absolute inset-0"></div>

              <!-- Peeking icon — right-0 top-0, clipped por overflow-hidden del card -->
              <div class="card-icon absolute -right-3 -top-3 flex size-20 items-center justify-center">
                <ng-icon [name]="p.icon" size="52" [style.color]="p.color" />
              </div>

              <!-- Content (pr leaves space for icon) -->
              <div class="relative flex flex-1 flex-col">
                <h3 class="mb-2 pr-10 text-sm font-semibold text-foreground">{{ p.label }}</h3>
                <p class="flex-1 text-sm leading-relaxed text-muted-foreground">{{ p.desc }}</p>

                <a
                  routerLink="/spaceai"
                  [fragment]="p.fragment"
                  class="mt-5 inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-150 hover:gap-2"
                >
                  Conocer más
                  <ng-icon name="lucideArrowRight" class="size-3" />
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class Productos {
  protected readonly productos = PRODUCTOS;
  protected readonly headerVisible = signal(false);
  protected readonly cardVisible = PRODUCTOS.map(() => signal(false));

  private readonly headerRef = viewChildren<ElementRef>('header');
  private readonly cardRefs = viewChildren<ElementRef>('card');

  constructor() {
    afterNextRender(() => {
      const h = this.headerRef()[0];
      if (h) {
        const obs = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) { this.headerVisible.set(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        obs.observe(h.nativeElement);
      }

      this.cardRefs().forEach((ref, i) => {
        const el = ref.nativeElement as HTMLElement;

        // Scroll visibility
        const visObs = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => this.cardVisible[i].set(true), i * 80);
            visObs.disconnect();
          }
        }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
        visObs.observe(el);

        // Spotlight: update CSS vars on mousemove — no Angular CD
        el.addEventListener('mousemove', (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
      });
    });
  }
}
