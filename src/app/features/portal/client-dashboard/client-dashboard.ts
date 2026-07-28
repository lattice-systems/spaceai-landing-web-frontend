import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideLifeBuoy, lucideQuote } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ClientDashboardSummaryResponse } from '../../../core/models/dashboard.model';

const EMPTY_SUMMARY: ClientDashboardSummaryResponse = {
  openTickets: 0,
  totalDocuments: 0,
  quotesByStatus: { pending: 0, approved: 0, rejected: 0 },
  recentActivity: [],
};

@Component({
  selector: 'app-client-dashboard',
  imports: [RouterLink, NgIcon, DatePipe, HlmButtonImports, HlmCardImports],
  providers: [provideIcons({ lucideFileText, lucideLifeBuoy, lucideQuote })],
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
        @for (stat of stats(); track stat.label) {
          <div hlmCard>
            <div hlmCardContent class="flex items-start justify-between gap-3">
              <div>
                <p class="text-muted-foreground text-sm">{{ stat.label }}</p>
                <p class="text-foreground mt-3 text-3xl font-semibold">{{ stat.value }}</p>
                <p class="text-muted-foreground mt-2 text-xs">{{ stat.note }}</p>
              </div>
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-full"
                [style.background]="'color-mix(in oklch, var(' + stat.chip + ') 14%, transparent)'"
                [style.color]="'var(' + stat.chip + ')'"
              >
                <ng-icon [name]="stat.icon" class="text-lg" />
              </span>
            </div>
          </div>
        }
      </div>

      <div class="grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div hlmCard>
          <div hlmCardHeader class="flex-row items-center justify-between gap-3">
            <div>
              <h2 hlmCardTitle>Información institucional</h2>
              <p hlmCardDescription>Datos de la cuenta registrada.</p>
            </div>
            <a hlmBtn variant="outline" size="sm" routerLink="/client/cotizaciones">Cotizaciones</a>
          </div>
          <div hlmCardContent class="grid gap-3">
            @for (field of clientInfo(); track field.label) {
              <div class="bg-background/70 border-border rounded-lg border p-4">
                <p class="text-muted-foreground text-xs">{{ field.label }}</p>
                <p class="text-foreground mt-1 text-sm font-medium">{{ field.value }}</p>
              </div>
            } @empty {
              <p class="text-muted-foreground text-sm">Cargando datos de la cuenta…</p>
            }
          </div>
        </div>

        <div hlmCard>
          <div hlmCardHeader>
            <h2 hlmCardTitle>Actividad reciente</h2>
          </div>
          <div hlmCardContent class="grid gap-3">
            @for (activity of summary().recentActivity; track activity.title + activity.date) {
              <div class="bg-background/70 border-border rounded-lg border p-4">
                <p class="text-foreground text-sm font-medium">{{ activity.title }}</p>
                <div class="mt-1 flex items-center justify-between gap-2">
                  <p class="text-muted-foreground text-xs">{{ activity.category }}</p>
                  <p class="text-muted-foreground text-xs">{{ activity.date | date: 'mediumDate' }}</p>
                </div>
              </div>
            } @empty {
              <p class="text-muted-foreground text-sm">Sin actividad reciente.</p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ClientDashboard {
  private readonly authService = inject(AuthService);
  private readonly clientsService = inject(ClientsService);
  private readonly dashboardService = inject(DashboardService);

  private readonly clientId = this.authService.user()?.clientId ?? null;

  private readonly client = toSignal(
    this.clientId ? this.clientsService.getById(this.clientId) : of(null),
    { initialValue: null },
  );

  protected readonly summary = toSignal(this.dashboardService.getClientSummary(), { initialValue: EMPTY_SUMMARY });

  protected readonly clientInfo = computed(() => {
    const client = this.client();
    if (!client) return [];
    return [
      { label: 'Institución', value: client.institutionName },
      { label: 'Contacto', value: client.contactPerson },
      { label: 'Correo', value: client.contactEmail },
      { label: 'Estado', value: client.status },
    ];
  });

  protected readonly stats = computed(() => {
    const s = this.summary();
    const totalQuotes = s.quotesByStatus.pending + s.quotesByStatus.approved + s.quotesByStatus.rejected;
    return [
      {
        label: 'Cotizaciones',
        value: String(totalQuotes),
        note: `${s.quotesByStatus.pending} pendiente(s) de respuesta`,
        icon: 'lucideQuote',
        chip: '--chip-violet',
      },
      {
        label: 'Documentos',
        value: String(s.totalDocuments),
        note: 'Guías y recursos disponibles',
        icon: 'lucideFileText',
        chip: '--chip-emerald',
      },
      {
        label: 'Tickets abiertos',
        value: String(s.openTickets),
        note: 'Seguimiento de soporte',
        icon: 'lucideLifeBuoy',
        chip: '--chip-amber',
      },
    ];
  });
}
