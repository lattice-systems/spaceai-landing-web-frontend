import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideChartNoAxesColumn,
  lucideChevronsUpDown,
  lucideFileText,
  lucideHome,
  lucideLifeBuoy,
  lucideLogOut,
  lucideQuote,
  lucideStar,
  lucideUser,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { AuthService } from '../../core/services/auth.service';

const MAIN_NAV = [
  { label: 'Dashboard', route: '/client', icon: 'lucideChartNoAxesColumn', exact: true },
  { label: 'Documentación', route: '/client/documentos', icon: 'lucideBookOpen', exact: false },
  { label: 'Cotizaciones', route: '/client/cotizaciones', icon: 'lucideQuote', exact: false },
  { label: 'Soporte', route: '/client/soporte', icon: 'lucideLifeBuoy', exact: false },
  { label: 'Opiniones', route: '/client/opiniones', icon: 'lucideStar', exact: false },
  { label: 'Perfil', route: '/client/perfil', icon: 'lucideUser', exact: false },
] as const;

const SECONDARY_NAV = [{ label: 'Inicio público', route: '/', icon: 'lucideHome' }] as const;

@Component({
  selector: 'app-portal-sidebar',
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    NgIcon,
    HlmSidebarImports,
    HlmAvatarImports,
    HlmDropdownMenuImports,
  ],
  providers: [
    provideIcons({
      lucideBookOpen,
      lucideChartNoAxesColumn,
      lucideChevronsUpDown,
      lucideFileText,
      lucideHome,
      lucideLifeBuoy,
      lucideLogOut,
      lucideQuote,
      lucideStar,
      lucideUser,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar variant="inset">
        <hlm-sidebar-header>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton size="lg" routerLink="/client" aria-label="SpaceIA portal">
                <span
                  class="bg-card border-primary/25 flex aspect-square size-8 items-center justify-center rounded-lg border-2"
                >
                  <img
                    ngSrc="/spaceai-icon.png"
                    alt=""
                    width="64"
                    height="64"
                    class="size-5 rounded-sm object-contain"
                    priority
                  />
                </span>
                <span class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">SpaceIA</span>
                  <span class="text-muted-foreground truncate text-xs">Portal cliente</span>
                </span>
              </a>
            </li>
          </ul>
        </hlm-sidebar-header>

        <hlm-sidebar-content>
          <hlm-sidebar-group>
            <div hlmSidebarGroupLabel>Operación</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (item of mainNav; track item.route) {
                  <li hlmSidebarMenuItem>
                    <a
                      hlmSidebarMenuButton
                      [routerLink]="item.route"
                      routerLinkActive
                      #active="routerLinkActive"
                      [routerLinkActiveOptions]="{ exact: item.exact }"
                      [isActive]="active.isActive"
                      [tooltip]="item.label"
                    >
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.label }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </hlm-sidebar-group>

          <hlm-sidebar-separator />

          <hlm-sidebar-group>
            <div hlmSidebarGroupLabel>General</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (item of secondaryNav; track item.route) {
                  <li hlmSidebarMenuItem>
                    <a hlmSidebarMenuButton [routerLink]="item.route" [tooltip]="item.label">
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.label }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </hlm-sidebar-group>
        </hlm-sidebar-content>

        <hlm-sidebar-footer>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <button
                hlmSidebarMenuButton
                size="lg"
                [hlmDropdownMenuTrigger]="userMenu"
                [side]="menuSide()"
                align="end"
              >
                <hlm-avatar class="rounded-lg">
                  <span hlmAvatarFallback>{{ initials() }}</span>
                </hlm-avatar>
                <span class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{{ fullName() ?? 'Cuenta cliente' }}</span>
                  <span class="text-muted-foreground truncate text-xs">{{
                    user()?.email ?? 'Documentos y soporte'
                  }}</span>
                </span>
                <ng-icon name="lucideChevronsUpDown" class="ml-auto text-base" />
              </button>
            </li>
          </ul>
        </hlm-sidebar-footer>
      </hlm-sidebar>

      <ng-content />
    </div>

    <ng-template #userMenu>
      <hlm-dropdown-menu class="min-w-56 rounded-lg">
        <hlm-dropdown-menu-label>
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <hlm-avatar class="rounded-lg">
              <span hlmAvatarFallback>{{ initials() }}</span>
            </hlm-avatar>
            <span class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ fullName() ?? 'Cuenta cliente' }}</span>
              <span class="text-muted-foreground truncate text-xs">{{ user()?.email ?? '' }}</span>
            </span>
          </div>
        </hlm-dropdown-menu-label>
        <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem routerLink="/client/perfil">
          <ng-icon name="lucideUser" />
          Editar perfil
        </button>
        <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem variant="destructive" (click)="logout()">
          <ng-icon name="lucideLogOut" />
          Cerrar sesión
        </button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class PortalSidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sidebarService = inject(HlmSidebarService);

  protected readonly mainNav = MAIN_NAV;
  protected readonly secondaryNav = SECONDARY_NAV;
  protected readonly user = this.authService.user;
  protected readonly fullName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : null;
  });
  protected readonly initials = computed(() => {
    const user = this.user();
    if (!user) return 'CL';
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'CL';
  });
  protected readonly menuSide = computed(() => (this.sidebarService.isMobile() ? 'top' : 'right'));

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
