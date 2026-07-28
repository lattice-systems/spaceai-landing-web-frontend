import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { DocumentsService } from '../../../core/services/documents.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { SupportTicketsService } from '../../../core/services/support-tickets.service';

@Component({
  selector: 'app-client-dashboard',
  imports: [RouterLink, HlmButtonImports, HlmCardImports],
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
            <div hlmCardContent>
              <p class="text-muted-foreground text-sm">{{ stat.label }}</p>
              <p class="text-foreground mt-3 text-3xl font-semibold">{{ stat.value }}</p>
              <p class="text-muted-foreground mt-2 text-xs">{{ stat.note }}</p>
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
            @for (activity of recentActivity(); track activity.title) {
              <div class="bg-background/70 border-border rounded-lg border p-4">
                <p class="text-foreground text-sm font-medium">{{ activity.title }}</p>
                <p class="text-muted-foreground mt-1 text-xs">{{ activity.category }}</p>
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
  private readonly documentsService = inject(DocumentsService);
  private readonly quotesService = inject(QuotesService);
  private readonly supportTicketsService = inject(SupportTicketsService);

  private readonly clientId = this.authService.user()?.clientId ?? null;

  private readonly client = toSignal(
    this.clientId ? this.clientsService.getById(this.clientId) : of(null),
    { initialValue: null },
  );

  private readonly documents = toSignal(this.documentsService.list(), { initialValue: [] });

  private readonly quotes = toSignal(this.quotesService.listAll(), { initialValue: [] });

  private readonly tickets = toSignal(this.supportTicketsService.list(), { initialValue: [] });

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

  protected readonly stats = computed(() => [
    {
      label: 'Cotizaciones',
      value: String(this.quotes().length),
      note: 'Propuestas comerciales registradas',
    },
    {
      label: 'Documentos',
      value: String(this.documents().length),
      note: 'Guías y recursos disponibles',
    },
    {
      label: 'Tickets abiertos',
      value: String(this.tickets().filter((t) => t.status !== 'Cerrado').length),
      note: 'Seguimiento de soporte',
    },
  ]);

  protected readonly recentActivity = computed(() => [
    ...this.documents().map((d) => ({ title: d.title, category: 'Documentación técnica' })),
    ...this.tickets().map((t) => ({ title: t.subject, category: 'Soporte' })),
    ...this.quotes().map((q) => ({ title: `Cotización · ${q.institutionName}`, category: 'Comercial' })),
  ]);
}
