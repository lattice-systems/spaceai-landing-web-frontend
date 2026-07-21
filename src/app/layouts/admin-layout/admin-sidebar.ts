import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBeaker,
  lucideBox,
  lucideHome,
  lucideLogOut,
  lucideMail,
  lucidePackage,
  lucideQuote,
  lucideReceipt,
  lucideStar,
  lucideTruck,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AuthService } from '../../core/services/auth.service';

const MAIN_NAV = [
  { label: 'Usuarios', route: '/admin/usuarios', icon: 'lucideUsers' },
  { label: 'Productos', route: '/admin/productos', icon: 'lucideBox' },
  { label: 'Materia prima', route: '/admin/materiales', icon: 'lucideBeaker' },
  { label: 'Recetas', route: '/admin/recetas', icon: 'lucidePackage' },
  { label: 'Proveedores', route: '/admin/proveedores', icon: 'lucideTruck' },
  { label: 'Compras', route: '/admin/compras', icon: 'lucideReceipt' },
  { label: 'Cotizaciones', route: '/admin/cotizaciones', icon: 'lucideQuote' },
  { label: 'Reseñas', route: '/admin/resenas', icon: 'lucideStar' },
  { label: 'Mensajes', route: '/admin/mensajes', icon: 'lucideMail' },
] as const;

const SECONDARY_NAV = [{ label: 'Inicio público', route: '/', icon: 'lucideHome' }] as const;

@Component({
  selector: 'app-admin-sidebar',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, NgIcon, HlmSidebarImports],
  providers: [
    provideIcons({
      lucideBeaker,
      lucideBox,
      lucideHome,
      lucideLogOut,
      lucideMail,
      lucidePackage,
      lucideQuote,
      lucideReceipt,
      lucideStar,
      lucideTruck,
      lucideUsers,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar variant="inset">
        <hlm-sidebar-header>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton size="lg" routerLink="/admin" aria-label="SpaceIA admin">
                <span
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
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
                  <span class="text-muted-foreground truncate text-xs">Portal admin</span>
                </span>
              </a>
            </li>
          </ul>
        </hlm-sidebar-header>

        <hlm-sidebar-content>
          <hlm-sidebar-group>
            <div hlmSidebarGroupLabel>Administración</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (item of mainNav; track item.route) {
                  <li hlmSidebarMenuItem>
                    <a
                      hlmSidebarMenuButton
                      [routerLink]="item.route"
                      routerLinkActive
                      #active="routerLinkActive"
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
            <div hlmSidebarGroupLabel>Cuenta</div>
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
              <a hlmSidebarMenuButton size="lg" routerLink="/admin">
                <span class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{{ fullName() ?? 'Cuenta admin' }}</span>
                  <span class="text-muted-foreground truncate text-xs">{{
                    user()?.email ?? ''
                  }}</span>
                </span>
              </a>
            </li>
            <li hlmSidebarMenuItem>
              <button
                hlmSidebarMenuButton
                type="button"
                (click)="logout()"
                [tooltip]="'Cerrar sesión'"
              >
                <ng-icon name="lucideLogOut" />
                <span>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </hlm-sidebar-footer>
      </hlm-sidebar>

      <ng-content />
    </div>
  `,
})
export class AdminSidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mainNav = MAIN_NAV;
  protected readonly secondaryNav = SECONDARY_NAV;
  protected readonly user = this.authService.user;
  protected readonly fullName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : null;
  });

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
