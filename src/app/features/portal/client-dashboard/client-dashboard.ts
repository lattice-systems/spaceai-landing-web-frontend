import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const STATS = [
  { label: 'Productos activos', value: '2', note: 'Módulos SpaceIA asignados' },
  { label: 'Documentos', value: '5', note: 'Guías y recursos disponibles' },
  { label: 'Tickets abiertos', value: '1', note: 'Seguimiento de soporte' },
] as const;

const PRODUCTS = ['Aplicación móvil institucional', 'Control de acceso QR', 'Kiosco SIDE'] as const;

@Component({
  selector: 'app-client-dashboard',
  imports: [RouterLink, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 flex min-h-44 flex-col justify-between rounded-xl p-5">
        <div class="max-w-2xl">
          <p class="text-muted-foreground text-sm">Bienvenido</p>
          <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">
            Panel cliente SpaceIA
          </h1>
          <p class="text-muted-foreground mt-3 max-w-xl text-sm leading-6">
            Consulta módulos activos, documentación técnica, cotizaciones y soporte desde una sola
            vista.
          </p>
        </div>
        <div class="mt-5 flex flex-wrap gap-2">
          <a hlmBtn size="sm" routerLink="/client/documentos">Ver documentos</a>
          <a hlmBtn variant="outline" size="sm" routerLink="/client/soporte">Abrir soporte</a>
        </div>
      </div>

      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        @for (stat of stats; track stat.label) {
          <article class="bg-muted/50 rounded-xl p-4">
            <p class="text-muted-foreground text-sm">{{ stat.label }}</p>
            <p class="text-foreground mt-3 text-3xl font-semibold">{{ stat.value }}</p>
            <p class="text-muted-foreground mt-2 text-xs">{{ stat.note }}</p>
          </article>
        }
      </div>

      <div class="grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section class="bg-muted/50 rounded-xl p-5">
          <div class="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-foreground text-base font-semibold">Productos adquiridos</h2>
              <p class="text-muted-foreground mt-1 text-sm">Módulos asociados a la cuenta.</p>
            </div>
            <a hlmBtn variant="outline" size="sm" routerLink="/client/cotizaciones">Cotizaciones</a>
          </div>
          <div class="grid gap-3">
            @for (product of products; track product) {
              <div class="bg-background/70 border-border rounded-lg border p-4">
                <p class="text-foreground text-sm font-medium">{{ product }}</p>
                <div class="bg-muted mt-3 h-2 rounded-full"></div>
              </div>
            }
          </div>
        </section>

        <section class="bg-muted/50 rounded-xl p-5">
          <h2 class="text-foreground text-base font-semibold">Actividad reciente</h2>
          <div class="mt-5 grid gap-3">
            <div class="bg-background/70 border-border rounded-lg border p-4">
              <p class="text-foreground text-sm font-medium">Manual de instalación disponible</p>
              <p class="text-muted-foreground mt-1 text-xs">Documentación técnica</p>
            </div>
            <div class="bg-background/70 border-border rounded-lg border p-4">
              <p class="text-foreground text-sm font-medium">Ticket en revisión</p>
              <p class="text-muted-foreground mt-1 text-xs">Soporte</p>
            </div>
            <div class="bg-background/70 border-border rounded-lg border p-4">
              <p class="text-foreground text-sm font-medium">Cotización pendiente</p>
              <p class="text-muted-foreground mt-1 text-xs">Comercial</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  `,
})
export class ClientDashboard {
  protected readonly stats = STATS;
  protected readonly products = PRODUCTS;
}
