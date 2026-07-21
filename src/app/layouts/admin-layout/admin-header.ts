import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-admin-header',
  imports: [
    RouterLink,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmSeparatorImports,
    HlmSidebarImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-16 shrink-0 items-center justify-between gap-3 px-4">
      <div class="flex min-w-0 items-center gap-2">
        <button hlmSidebarTrigger srOnlyText="Alternar menú"></button>
        <hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <nav hlmBreadcrumb aria-label="Ruta actual">
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem class="hidden sm:block">
              <a hlmBreadcrumbLink routerLink="/admin">Portal admin</a>
            </li>
            <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>Administración</span>
            </li>
          </ol>
        </nav>
      </div>

      <a hlmBtn variant="outline" size="sm" routerLink="/">Volver al sitio</a>
    </header>
  `,
})
export class AdminHeader {}
