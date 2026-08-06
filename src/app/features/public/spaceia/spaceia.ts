import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChildren,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBot,
  lucideDatabase,
  lucideFingerprint,
  lucideMonitor,
  lucideRoute,
  lucideShieldCheck,
  lucideSmartphone,
  lucideSparkles,
  lucideWorkflow,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const PRODUCTS = [
  {
    id: 'movil',
    eyebrow: 'Aplicación móvil',
    icon: 'lucideSmartphone',
    title: 'Campus en la palma del estudiante',
    body: 'Credencial digital, avisos, orientación, servicios y comunicación institucional en una sola experiencia.',
    signal: 'Identidad y comunicación',
    points: [
      'Identidad universitaria',
      'Servicios para estudiantes',
      'Notificaciones y seguimiento',
    ],
  },
  {
    id: 'acceso',
    eyebrow: 'Control de acceso',
    icon: 'lucideFingerprint',
    title: 'Entradas seguras y medibles',
    body: 'Acceso inteligente con QR e IoT para edificios, laboratorios, estacionamientos y eventos.',
    signal: 'Accesos y trazabilidad',
    points: ['Reglas por perfil', 'Registro de entradas', 'Operación conectada'],
  },
  {
    id: 'kiosco',
    eyebrow: 'Kiosco SIDE',
    icon: 'lucideMonitor',
    title: 'Atención con IA dentro del campus',
    body: 'Asistente físico para resolver dudas, ubicar servicios y reducir filas en puntos de alta demanda.',
    signal: 'Atención autoservicio',
    points: ['IA conversacional', 'Mapas y orientación', 'Atención autoservicio'],
  },
  {
    id: 'robot',
    eyebrow: 'Robot autónomo',
    icon: 'lucideBot',
    title: 'Guía física para espacios complejos',
    body: 'Robot de orientación para visitantes, alumnos y personal en recorridos, admisiones y eventos.',
    signal: 'Orientación presencial',
    points: ['Navegación autónoma', 'Recorridos guiados', 'Presencia tecnológica visible'],
  },
] as const;

const FLOW = [
  {
    label: 'Identidad',
    icon: 'lucideShieldCheck',
    body: 'Cada persona entra con perfil, permisos y contexto institucional.',
  },
  {
    label: 'Movimiento',
    icon: 'lucideRoute',
    body: 'Accesos, rutas y visitas dejan señales útiles para operar mejor.',
  },
  {
    label: 'Atención',
    icon: 'lucideSparkles',
    body: 'App, kiosco y robot responden dudas antes de que lleguen a ventanilla.',
  },
  {
    label: 'Datos',
    icon: 'lucideDatabase',
    body: 'La operación se convierte en métricas para decidir prioridades.',
  },
] as const;

const LAYERS = [
  'Identidad digital',
  'Reglas de acceso',
  'Atención con IA',
  'Orientación física',
  'Analítica operativa',
] as const;

const SHOWCASE = [
  { device: 'device device-macbook-pro device-spacegray', screen: '/screenshots/admin.png', alt: 'Panel de administración SpaceIA',    label: 'Panel administrativo' },
  { device: 'device device-ipad-pro device-silver',       screen: '/screenshots/side.png',  alt: 'Kiosco SIDE en tablet',              label: 'Kiosco SIDE' },
  { device: 'device device-iphone-x',                     screen: '/mobile/movil-qr.jpeg',  alt: 'Credencial digital en la app móvil', label: 'App móvil' },
] as const;

function observe1(el: HTMLElement, cb: () => void): void {
  const obs = new IntersectionObserver(
    ([e]) => { if (e.isIntersecting) { cb(); obs.disconnect(); } },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' },
  );
  obs.observe(el);
}

@Component({
  selector: 'app-spaceia',
  imports: [RouterLink, HlmButtonImports, NgIcon, NgOptimizedImage],
  providers: [
    provideIcons({
      lucideSmartphone,
      lucideFingerprint,
      lucideMonitor,
      lucideBot,
      lucideShieldCheck,
      lucideRoute,
      lucideSparkles,
      lucideDatabase,
      lucideWorkflow,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }

    .signal-line {
      background-image: linear-gradient(
        to bottom,
        transparent,
        color-mix(in oklch, var(--primary), transparent 42%),
        transparent
      );
    }

    .pulse-node {
      animation: node-pulse 2.8s cubic-bezier(0.23, 1, 0.32, 1) infinite;
    }

    .pulse-node:nth-child(2) {
      animation-delay: 0.35s;
    }

    .pulse-node:nth-child(3) {
      animation-delay: 0.7s;
    }

    .pulse-node:nth-child(4) {
      animation-delay: 1.05s;
    }

    @keyframes node-pulse {
      0%,
      100% {
        transform: scale(1);
        opacity: 0.72;
      }

      45% {
        transform: scale(1.04);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pulse-node {
        animation: none;
      }
    }

    .showcase-stage {
      display: flex;
      justify-content: center;
    }

    /* devices.css usa tamaños fijos grandes (MacBook 600px, etc). Se reduce el
       track con zoom para que quepa sin desbordar: en móvil apilado en columna
       (cada dispositivo cabe en el viewport), en desktop en fila los 3 juntos. */
    .showcase-track {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
      zoom: 0.62;
    }

    @media (min-width: 1024px) {
      .showcase-track {
        flex-direction: row;
        align-items: flex-end;
        gap: 2.5rem;
        zoom: 0.78;
      }
    }

    .showcase-item {
      opacity: 0;
      transform: translateY(28px) scale(0.96);
      transition:
        opacity 700ms cubic-bezier(0.23, 1, 0.32, 1),
        transform 700ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    .showcase-item.visible {
      opacity: 1;
      transform: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .showcase-item {
        transition: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  template: `
    <main class="bg-background">
      <section
        class="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-16"
      >
        <div>
          <div
            class="border-border bg-card mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
          >
            <ng-icon name="lucideWorkflow" class="text-primary text-[length:--spacing(4)]" />
            <span class="text-muted-foreground text-xs font-medium">
              Capa operativa para universidades
            </span>
          </div>

          <h1 class="text-foreground max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            SpaceIA convierte el campus moderno en una operación conectada.
          </h1>
          <p class="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            No es otra app aislada. Es un ecosistema que une identidad, accesos, atención con IA,
            orientación física y datos operativos para que la institución vea qué pasa y actúe más
            rápido.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a hlmBtn size="lg" routerLink="/cotizador">Diseñar propuesta</a>
            <a hlmBtn size="lg" variant="outline" routerLink="/contacto">Agendar diagnóstico</a>
          </div>

          <dl class="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            <div class="border-border bg-card rounded-lg border p-4">
              <dt class="text-muted-foreground text-xs">Módulos</dt>
              <dd class="text-foreground mt-1 text-2xl font-bold">4</dd>
            </div>
            <div class="border-border bg-card rounded-lg border p-4">
              <dt class="text-muted-foreground text-xs">Capas</dt>
              <dd class="text-foreground mt-1 text-2xl font-bold">5</dd>
            </div>
            <div class="border-border bg-card rounded-lg border p-4">
              <dt class="text-muted-foreground text-xs">Enfoque</dt>
              <dd class="text-foreground mt-1 text-2xl font-bold">24/7</dd>
            </div>
          </dl>
        </div>

        <div
          class="border-border bg-card relative min-h-[520px] overflow-hidden rounded-lg border p-5 shadow-sm"
        >
          <div class="mb-5 flex items-center justify-between gap-4">
            <div>
              <p class="text-primary text-xs font-semibold tracking-widest uppercase">
                Vista operativa
              </p>
              <h2 class="text-card-foreground mt-1 text-lg font-bold">Campus conectado</h2>
            </div>
            <span class="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-medium">
              Demo visual
            </span>
          </div>

          <div
            class="border-border bg-background relative grid min-h-[390px] place-items-center rounded-lg border p-4"
          >
            <div
              class="signal-line absolute inset-y-10 left-1/2 w-px -translate-x-1/2"
              aria-hidden="true"
            ></div>
            <div
              class="signal-line absolute inset-x-10 top-1/2 h-px -translate-y-1/2 rotate-90 md:rotate-0"
              aria-hidden="true"
            ></div>

            <div
              class="pulse-node border-border bg-card absolute top-5 left-5 rounded-lg border p-4 shadow-sm"
            >
              <ng-icon name="lucideSmartphone" class="text-primary text-[length:--spacing(6)]" />
              <p class="text-card-foreground mt-2 text-xs font-medium">App</p>
            </div>
            <div
              class="pulse-node border-border bg-card absolute top-5 right-5 rounded-lg border p-4 shadow-sm"
            >
              <ng-icon name="lucideFingerprint" class="text-primary text-[length:--spacing(6)]" />
              <p class="text-card-foreground mt-2 text-xs font-medium">Acceso</p>
            </div>
            <div
              class="pulse-node border-border bg-card absolute bottom-5 left-5 rounded-lg border p-4 shadow-sm"
            >
              <ng-icon name="lucideMonitor" class="text-primary text-[length:--spacing(6)]" />
              <p class="text-card-foreground mt-2 text-xs font-medium">SIDE</p>
            </div>
            <div
              class="pulse-node border-border bg-card absolute right-5 bottom-5 rounded-lg border p-4 shadow-sm"
            >
              <ng-icon name="lucideBot" class="text-primary text-[length:--spacing(6)]" />
              <p class="text-card-foreground mt-2 text-xs font-medium">Robot</p>
            </div>

            <div
              class="border-primary/35 bg-card relative flex size-40 flex-col items-center justify-center rounded-full border text-center shadow-sm"
            >
              <span
                class="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-lg"
              >
                <ng-icon name="lucideWorkflow" class="text-[length:--spacing(6)]" />
              </span>
              <p class="text-card-foreground mt-3 text-sm font-bold">SpaceIA Core</p>
              <p class="text-muted-foreground mt-1 px-5 text-xs leading-snug">
                identidad, reglas, IA y métricas
              </p>
            </div>
          </div>

          <div class="mt-5 grid gap-2 sm:grid-cols-5">
            @for (layer of layers; track layer) {
              <div
                class="border-border bg-background text-foreground rounded-md border p-3 text-xs font-medium"
              >
                {{ layer }}
              </div>
            }
          </div>
        </div>
      </section>

      <section class="border-border bg-card border-y">
        <div class="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-4 lg:px-16">
          @for (item of flow; track item.label) {
            <article class="flex gap-4">
              <div
                class="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-lg"
              >
                <ng-icon [name]="item.icon" class="text-[length:--spacing(5)]" />
              </div>
              <div>
                <h2 class="text-card-foreground text-sm font-semibold">{{ item.label }}</h2>
                <p class="text-muted-foreground mt-1 text-sm leading-relaxed">{{ item.body }}</p>
              </div>
            </article>
          }
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-6 py-20 lg:px-16">
        <div class="mb-10 max-w-2xl">
          <p class="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
            Módulos del ecosistema
          </p>
          <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Cada producto resuelve un momento concreto del campus.
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-4">
          @for (product of products; track product.id) {
            <a
              routerLink="/spaceai"
              [fragment]="product.id"
              class="border-border bg-card text-card-foreground hover:border-primary/50 rounded-lg border p-4 transition-colors"
            >
              <ng-icon [name]="product.icon" class="text-primary text-[length:--spacing(5)]" />
              <span class="mt-3 block text-sm font-semibold">{{ product.eyebrow }}</span>
              <span class="text-muted-foreground mt-1 block text-xs">{{ product.signal }}</span>
            </a>
          }
        </div>
      </section>

      <section class="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-24 lg:px-16">
        @for (product of products; track product.id; let i = $index) {
          <article
            [id]="product.id"
            class="border-border bg-card grid scroll-mt-28 gap-8 rounded-lg border p-6 md:grid-cols-[0.85fr_1.15fr] md:p-8"
          >
            <div class="flex gap-4">
              <div
                class="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-lg"
              >
                <ng-icon [name]="product.icon" class="text-primary text-[length:--spacing(6)]" />
              </div>
              <div>
                <p class="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
                  {{ product.eyebrow }}
                </p>
                <h2 class="text-card-foreground text-2xl font-bold tracking-tight">
                  {{ product.title }}
                </h2>
                <p class="text-muted-foreground mt-4 text-sm leading-relaxed">
                  {{ product.body }}
                </p>
              </div>
            </div>
            <ul class="grid content-start gap-3 sm:grid-cols-3">
              @for (point of product.points; track point) {
                <li
                  class="border-border bg-background text-foreground rounded-md border p-4 text-sm font-medium"
                >
                  {{ point }}
                </li>
              }
            </ul>
          </article>
        }
      </section>

      <section class="showcase-sec bg-background mx-auto max-w-7xl px-6 py-20 lg:px-16">
        <div class="mb-14 max-w-2xl">
          <p class="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
            Míralo en acción
          </p>
          <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Una sola plataforma, en cada pantalla del campus.
          </h2>
        </div>
        <div class="showcase-stage">
          <div class="showcase-track">
          @for (item of showcase; track item.label; let i = $index) {
            <figure
              #showcaseItem
              class="showcase-item flex flex-col items-center gap-4"
              [style.transition-delay]="i * 120 + 'ms'"
            >
              <div [class]="item.device">
                <div class="device-frame">
                  <img class="device-screen" [src]="item.screen" [alt]="item.alt" />
                </div>
                <div class="device-stripe"></div>
                <div class="device-header"></div>
                <div class="device-sensors"></div>
                <div class="device-btns"></div>
                <div class="device-power"></div>
                @if (item.device.includes('iphone')) {
                  <div class="device-home"></div>
                }
              </div>
              <figcaption class="text-muted-foreground text-sm font-medium">
                {{ item.label }}
              </figcaption>
            </figure>
          }
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-6 py-20 lg:px-16">
        <div class="mb-10 max-w-2xl">
          <p class="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
            Hardware propio
          </p>
          <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            El carrito inteligente, en físico.
          </h2>
          <p class="text-muted-foreground mt-4 text-base leading-relaxed">
            Diseño y ensamblaje propios: sensórica, cómputo a bordo y batería en un chasis pensado
            para el campus.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <figure class="border-border bg-muted relative aspect-[4/5] overflow-hidden rounded-lg border">
            <img
              ngSrc="/cart/carrito-completo.jpeg"
              alt="Carrito inteligente SpaceIA — unidad completa con mástil sensor"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              class="object-contain"
            />
          </figure>
          <figure class="border-border bg-muted relative aspect-[4/5] overflow-hidden rounded-lg border">
            <img
              ngSrc="/cart/carrito-parteabajo.jpeg"
              alt="Carrito inteligente SpaceIA — base motriz y sensórica"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              class="object-contain"
            />
          </figure>
        </div>
      </section>

      <section class="bg-muted">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-16">
          <div>
            <p class="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
              Implementación gradual
            </p>
            <h2 class="text-foreground text-3xl font-bold tracking-tight">
              Arranca por el dolor más visible y crece sin rehacer la operación.
            </h2>
          </div>
          <div class="grid gap-3">
            <div class="border-border bg-card rounded-lg border p-5">
              <p class="text-card-foreground text-sm font-semibold">1. Diagnóstico del campus</p>
              <p class="text-muted-foreground mt-2 text-sm">
                Mapeo de accesos, servicios, filas, orientación y sistemas existentes.
              </p>
            </div>
            <div class="border-border bg-card rounded-lg border p-5">
              <p class="text-card-foreground text-sm font-semibold">2. Primer módulo medible</p>
              <p class="text-muted-foreground mt-2 text-sm">
                Se prioriza app, acceso, kiosco o robot según impacto operativo.
              </p>
            </div>
            <div class="border-border bg-card rounded-lg border p-5">
              <p class="text-card-foreground text-sm font-semibold">3. Ecosistema conectado</p>
              <p class="text-muted-foreground mt-2 text-sm">
                Los módulos comparten identidad, reglas y datos para operar como una sola capa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class Spaceia {
  protected readonly products = PRODUCTS;
  protected readonly flow = FLOW;
  protected readonly layers = LAYERS;
  protected readonly showcase = SHOWCASE;

  private readonly showcaseItems = viewChildren<ElementRef>('showcaseItem');

  constructor() {
    afterNextRender(() => {
      this.showcaseItems().forEach((ref, i) => {
        const el = ref.nativeElement as HTMLElement;
        observe1(el, () => setTimeout(() => el.classList.add('visible'), i * 120));
      });
    });
  }
}
