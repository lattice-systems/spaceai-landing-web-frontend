import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { PortalHeader } from './portal-header';
import { PortalSidebar } from './portal-sidebar';

@Component({
  selector: 'app-portal-layout',
  imports: [RouterOutlet, HlmSidebarImports, PortalHeader, PortalSidebar],
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
  `,
})
export class PortalLayout {}
