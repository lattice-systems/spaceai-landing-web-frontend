import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBot,
  lucideFingerprint,
  lucideMenu,
  lucideMonitor,
  lucideSmartphone,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

const PRODUCT_ITEMS = [
  {
    label: 'Aplicación Móvil',
    icon: 'lucideSmartphone',
    fragment: 'movil',
    description: 'App campus para estudiantes y personal',
  },
  {
    label: 'Control de Acceso',
    icon: 'lucideFingerprint',
    fragment: 'acceso',
    description: 'Acceso inteligente con QR e IoT',
  },
  {
    label: 'Kiosco SIDE',
    icon: 'lucideMonitor',
    fragment: 'kiosco',
    description: 'Asistente con IA conversacional',
  },
  {
    label: 'Robot Autónomo',
    icon: 'lucideBot',
    fragment: 'robot',
    description: 'Guía física con navegación autónoma',
  },
] as const;

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIcon, HlmNavigationMenuImports, HlmButtonImports],
  providers: [
    provideIcons({ lucideMenu, lucideX, lucideSmartphone, lucideFingerprint, lucideMonitor, lucideBot }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('mobileMenu', [
      state('closed', style({ height: '0', opacity: 0 })),
      state('open', style({ height: '*', opacity: 1 })),
      transition('closed <=> open', animate('200ms ease-out')),
    ]),
  ],
  template: `
    <header class="fixed top-0 right-0 left-0 z-50 bg-background/80 pb-px backdrop-blur-sm after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        <!-- Logo -->
        <a routerLink="/" class="select-none text-xl font-bold tracking-tight text-foreground">
          Space<span class="text-primary">IA</span>
        </a>

        <!-- Desktop nav -->
        <nav hlmNavigationMenu aria-label="Navegación principal" class="hidden md:flex">
          <ul hlmNavigationMenuList>
            <li hlmNavigationMenuItem>
              <a hlmNavigationMenuLink routerLink="/nosotros" routerLinkActive #nosotros="routerLinkActive"
                 [active]="nosotros.isActive">
                Nosotros
              </a>
            </li>

            <li hlmNavigationMenuItem>
              <button hlmNavigationMenuTrigger>Productos</button>
              <hlm-navigation-menu-content *hlmNavigationMenuPortal>
                <ul class="grid w-96 grid-cols-2 gap-1 p-3">
                  @for (item of productItems; track item.fragment) {
                    <li>
                      <a hlmNavigationMenuLink routerLink="/spaceai" [fragment]="item.fragment">
                        <div class="flex flex-col gap-1">
                          <div class="flex items-center gap-2">
                            <ng-icon [name]="item.icon" class="size-4 shrink-0 text-primary" />
                            <span class="text-sm font-medium">{{ item.label }}</span>
                          </div>
                          <p class="text-xs leading-snug text-muted-foreground">{{ item.description }}</p>
                        </div>
                      </a>
                    </li>
                  }
                </ul>
              </hlm-navigation-menu-content>
            </li>

            <li hlmNavigationMenuItem>
              <a hlmNavigationMenuLink routerLink="/casos-de-uso" routerLinkActive
                 #casos="routerLinkActive" [active]="casos.isActive">
                Casos de Uso
              </a>
            </li>
            <li hlmNavigationMenuItem>
              <a hlmNavigationMenuLink routerLink="/faq" routerLinkActive
                 #faq="routerLinkActive" [active]="faq.isActive">
                FAQ
              </a>
            </li>
            <li hlmNavigationMenuItem>
              <a hlmNavigationMenuLink routerLink="/contacto" routerLinkActive
                 #contacto="routerLinkActive" [active]="contacto.isActive">
                Contacto
              </a>
            </li>
          </ul>
        </nav>

        <!-- Desktop CTAs -->
        <div class="hidden items-center gap-2 md:flex">
          <a hlmBtn variant="ghost" size="sm" routerLink="/auth/login">Iniciar sesión</a>
          <a hlmBtn size="sm" routerLink="/cotizador">Cotizar</a>
        </div>

        <!-- Mobile hamburger -->
        <button
          hlmBtn
          variant="ghost"
          size="icon"
          class="md:hidden"
          [attr.aria-expanded]="mobileOpen()"
          aria-controls="mobile-menu"
          aria-label="Abrir menú"
          (click)="toggleMobile()"
        >
          <span class="relative size-5">
            <ng-icon
              name="lucideMenu"
              class="absolute inset-0 transition-all duration-150"
              [class]="mobileOpen() ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'"
            />
            <ng-icon
              name="lucideX"
              class="absolute inset-0 transition-all duration-150"
              [class]="mobileOpen() ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'"
            />
          </span>
        </button>
      </div>

      <!-- Mobile menu -->
      <div
        id="mobile-menu"
        [@mobileMenu]="mobileOpen() ? 'open' : 'closed'"
        class="overflow-hidden md:hidden"
      >
        <nav class="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 pb-4 sm:px-6" aria-label="Menú móvil">
          <a
            routerLink="/nosotros"
            class="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            (click)="mobileOpen.set(false)"
          >Nosotros</a>

          <div class="px-3 py-2">
            <p class="mb-1 text-sm font-medium text-foreground">SpaceIA</p>
            @for (item of productItems; track item.fragment) {
              <a
                routerLink="/spaceai"
                [fragment]="item.fragment"
                class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                (click)="mobileOpen.set(false)"
              >
                <ng-icon [name]="item.icon" class="size-3.5 shrink-0 text-primary" />
                {{ item.label }}
              </a>
            }
          </div>

          <a
            routerLink="/casos-de-uso"
            class="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            (click)="mobileOpen.set(false)"
          >Casos de Uso</a>
          <a
            routerLink="/faq"
            class="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            (click)="mobileOpen.set(false)"
          >FAQ</a>
          <a
            routerLink="/contacto"
            class="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            (click)="mobileOpen.set(false)"
          >Contacto</a>

          <div class="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            <a hlmBtn variant="outline" size="sm" routerLink="/auth/login" (click)="mobileOpen.set(false)">
              Iniciar sesión
            </a>
            <a hlmBtn size="sm" routerLink="/cotizador" (click)="mobileOpen.set(false)">Cotizar</a>
          </div>
        </nav>
      </div>
    </header>
  `,
})
export class Navbar {
  protected readonly productItems = PRODUCT_ITEMS;
  protected readonly mobileOpen = signal(false);

  protected toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }
}
