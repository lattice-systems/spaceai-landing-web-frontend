import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

const NAV = [
  {
    heading: 'Producto',
    links: [
      { label: 'App Móvil',        href: '/spaceai', fragment: 'movil'  },
      { label: 'Control de Acceso', href: '/spaceai', fragment: 'acceso' },
      { label: 'Kiosco SIDE',      href: '/spaceai', fragment: 'kiosco' },
      { label: 'Robot Autónomo',   href: '/spaceai', fragment: 'robot'  },
    ],
  },
  {
    heading: 'Empresa',
    links: [
      { label: 'Nosotros',    href: '/nosotros',    fragment: '' },
      { label: 'Casos de uso', href: '/casos-de-uso', fragment: '' },
      { label: 'FAQ',         href: '/faq',         fragment: '' },
      { label: 'Contacto',    href: '/contacto',    fragment: '' },
    ],
  },
  {
    heading: 'Plataforma',
    links: [
      { label: 'Solicitar cotización', href: '/cotizador',   fragment: '' },
      { label: 'Iniciar sesión',       href: '/auth/login',  fragment: '' },
      { label: 'Portal cliente',       href: '/client',      fragment: '' },
      { label: 'Soporte',              href: '/contacto',    fragment: '' },
    ],
  },
] as const;

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-border bg-card">

      <!-- Main grid -->
      <div class="mx-auto max-w-7xl px-6 py-12 lg:px-16">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          <!-- Brand column -->
          <div class="sm:col-span-2 lg:col-span-1">
            <a routerLink="/" class="mb-4 inline-flex items-center" aria-label="SpaceIA — inicio">
              <img
                ngSrc="/spaceai-logo.png"
                alt="SpaceIA"
                width="96"
                height="64"
                class="h-7 w-auto dark:hidden"
              />
              <img
                ngSrc="/spaceai-logo-dark-variant.png"
                alt="SpaceIA"
                width="96"
                height="64"
                class="hidden h-7 w-auto dark:block"
              />
            </a>
            <p class="mb-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              El ecosistema inteligente que conecta IA, IoT y automatización
              para transformar la experiencia universitaria.
            </p>
            <p class="text-xs text-muted-foreground/70">
              Desarrollado por&nbsp;<span class="font-medium text-muted-foreground">Lattice Systems</span>
            </p>
          </div>

          <!-- Nav columns -->
          @for (col of nav; track col.heading) {
            <div>
              <h3 class="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
                {{ col.heading }}
              </h3>
              <ul class="space-y-3">
                @for (link of col.links; track link.label) {
                  <li>
                    <a
                      [routerLink]="link.href"
                      [fragment]="link.fragment || undefined"
                      class="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    >
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }

        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-border">
        <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row lg:px-16">
          <p class="text-xs text-muted-foreground">
            © {{ year }} Lattice Systems. Todos los derechos reservados.
          </p>
          <nav class="flex items-center gap-5" aria-label="Legal">
            <a
              routerLink="/privacidad"
              class="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Política de privacidad
            </a>
            <a
              routerLink="/terminos"
              class="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Términos de uso
            </a>
          </nav>
        </div>
      </div>

    </footer>
  `,
})
export class Footer {
  protected readonly nav  = NAV;
  protected readonly year = new Date().getFullYear();
}
