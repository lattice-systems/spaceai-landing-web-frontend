import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DocumentsService } from '../../../core/services/documents.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { SupportTicketsService } from '../../../core/services/support-tickets.service';

type PortalSectionKey = 'documentos' | 'cotizaciones' | 'soporte';

const HEADERS: Record<PortalSectionKey, { title: string; description: string; primary: string }> = {
  documentos: {
    title: 'Documentación',
    description: 'Manuales, guías de instalación y recursos técnicos asociados al cliente.',
    primary: 'Documentos',
  },
  cotizaciones: {
    title: 'Cotizaciones',
    description: 'Historial de propuestas, módulos solicitados y estado comercial.',
    primary: 'Cotizaciones recientes',
  },
  soporte: {
    title: 'Soporte',
    description: 'Tickets abiertos, detalles de atención y seguimiento de estado.',
    primary: 'Tickets',
  },
};

@Component({
  selector: 'app-client-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal cliente</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">
          {{ header().title }}
        </h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          {{ header().description }}
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <section class="bg-muted/50 rounded-xl p-5">
          <h2 class="text-foreground text-base font-semibold">{{ header().primary }}</h2>
          <div class="mt-5 grid gap-3">
            <div class="bg-background/70 border-border h-10 rounded-lg border"></div>
            <div class="bg-background/70 border-border h-10 rounded-lg border"></div>
            <div class="bg-background/70 border-border h-10 rounded-lg border"></div>
          </div>
        </section>

        <section class="bg-muted/50 rounded-xl p-5">
          <h2 class="text-foreground text-base font-semibold">Listado</h2>
          <div class="mt-5 grid gap-3">
            @for (item of items(); track item.title) {
              <article class="bg-background/70 border-border rounded-lg border p-4">
                <p class="text-foreground text-sm font-medium">{{ item.title }}</p>
                <p class="text-muted-foreground mt-1 text-xs">{{ item.subtitle }}</p>
              </article>
            } @empty {
              <p class="text-muted-foreground text-sm">Sin registros por ahora.</p>
            }
          </div>
        </section>
      </div>

      <div class="bg-muted/50 min-h-80 flex-1 rounded-xl"></div>
    </section>
  `,
})
export class ClientSection {
  private readonly route = inject(ActivatedRoute);
  private readonly documentsService = inject(DocumentsService);
  private readonly quotesService = inject(QuotesService);
  private readonly supportTicketsService = inject(SupportTicketsService);

  private readonly section =
    (this.route.snapshot.data['section'] as PortalSectionKey | undefined) ?? 'documentos';

  protected readonly header = computed(() => HEADERS[this.section]);

  private readonly documents = toSignal(
    this.section === 'documentos' ? this.documentsService.list() : of([]),
    { initialValue: [] },
  );

  private readonly quotes = toSignal(
    this.section === 'cotizaciones' ? this.quotesService.list() : of([]),
    { initialValue: [] },
  );

  private readonly tickets = toSignal(
    this.section === 'soporte' ? this.supportTicketsService.list() : of([]),
    { initialValue: [] },
  );

  protected readonly items = computed<{ title: string; subtitle: string }[]>(() => {
    switch (this.section) {
      case 'documentos':
        return this.documents().map((d) => ({ title: d.title, subtitle: d.documentType }));
      case 'cotizaciones':
        return this.quotes().map((q) => ({ title: q.institutionName, subtitle: q.status }));
      case 'soporte':
        return this.tickets().map((t) => ({ title: t.subject, subtitle: t.status }));
    }
  });
}
