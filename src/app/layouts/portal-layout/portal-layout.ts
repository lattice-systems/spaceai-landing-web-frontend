import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { PortalHeader } from './portal-header';
import { PortalSidebar } from './portal-sidebar';

@Component({
  selector: 'app-portal-layout',
  imports: [RouterOutlet, HlmSidebarImports, HlmToasterImports, PortalHeader, PortalSidebar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <app-portal-sidebar>
      <main hlmSidebarInset>
        <app-portal-header />
        <router-outlet />
      </main>
    </app-portal-sidebar>
    <hlm-toaster richColors closeButton />
  `,
})
export class PortalLayout {}
