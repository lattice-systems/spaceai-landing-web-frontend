import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { AdminHeader } from './admin-header';
import { AdminSidebar } from './admin-sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HlmSidebarImports, HlmToasterImports, AdminHeader, AdminSidebar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <app-admin-sidebar>
      <main hlmSidebarInset>
        <app-admin-header />
        <router-outlet />
      </main>
    </app-admin-sidebar>
    <hlm-toaster richColors closeButton />
  `,
})
export class AdminLayout {}
