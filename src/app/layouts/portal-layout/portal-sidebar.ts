import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideBookOpen,
  lucideChartNoAxesColumn,
  lucideFileText,
  lucideHome,
  lucideLifeBuoy,
  lucideLogOut,
  lucideQuote,
  lucideUser,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

const MAIN_NAV = [
  { label: 'Dashboard', route: '/client', icon: 'lucideChartNoAxesColumn', exact: true },
  { label: 'Documentación', route: '/client/documentos', icon: 'lucideBookOpen', exact: false },
  { label: 'Cotizaciones', route: '/client/cotizaciones', icon: 'lucideQuote', exact: false },
  { label: 'Soporte', route: '/client/soporte', icon: 'lucideLifeBuoy', exact: false },
  { label: 'Perfil', route: '/client/perfil', icon: 'lucideUser', exact: false },
] as const;

const SECONDARY_NAV = [
  { label: 'Inicio público', route: '/', icon: 'lucideHome' },
  { label: 'Login', route: '/auth/login', icon: 'lucideLogOut' },
] as const;

@Component({
  selector: 'app-portal-sidebar',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, NgIcon, HlmSidebarImports],
  providers: [
    provideIcons({
      lucideBell,
      lucideBookOpen,
      lucideChartNoAxesColumn,
      lucideFileText,
      lucideHome,
      lucideLifeBuoy,
      lucideLogOut,
      lucideQuote,
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
              <a hlmSidebarMenuButton size="lg" routerLink="/client/perfil">
                <span
                  class="bg-sidebar-accent text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <ng-icon name="lucideFileText" />
                </span>
                <span class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">Cuenta cliente</span>
                  <span class="text-muted-foreground truncate text-xs">Documentos y soporte</span>
                </span>
                <ng-icon name="lucideBell" />
              </a>
            </li>
          </ul>
        </hlm-sidebar-footer>
      </hlm-sidebar>

      <ng-content />
    </div>
  `,
})
export class PortalSidebar {
  protected readonly mainNav = MAIN_NAV;
  protected readonly secondaryNav = SECONDARY_NAV;
}
