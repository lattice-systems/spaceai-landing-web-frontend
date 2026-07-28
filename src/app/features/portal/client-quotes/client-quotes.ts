import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { QuoteResponse } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';

const COUNT_LABELS: { key: keyof QuoteResponse; label: string }[] = [
  { key: 'studentCount', label: 'Estudiantes' },
  { key: 'buildingCount', label: 'Edificios' },
  { key: 'accessPointCount', label: 'Puntos de acceso' },
  { key: 'kioskCount', label: 'Kioscos' },
  { key: 'robotCount', label: 'Robots' },
];

@Component({
  selector: 'app-client-quotes',
  imports: [NgIcon, DatePipe, CurrencyPipe, HlmButtonImports, HlmCardImports, HlmBadgeImports, HlmTableImports, HlmDialogImports],
  providers: [provideIcons({ lucideEllipsis })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 class="text-foreground text-xl font-semibold tracking-tight">Cotizaciones</h1>
        <p class="text-muted-foreground text-sm">Propuestas comerciales que has solicitado.</p>
      </div>

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Institución</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Total</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fecha</th>
                <th hlmTh class="w-10 text-right"><span class="sr-only">Ver</span></th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (quote of quotes(); track quote.id) {
                <tr hlmTr>
                  <td hlmTd class="text-foreground font-medium">{{ quote.institutionName }}</td>
                  <td hlmTd>{{ quote.total | currency: 'USD' }}</td>
                  <td hlmTd>
                    <span hlmBadge [variant]="statusVariant(quote.status)" class="font-normal">
                      {{ statusLabel(quote.status) }}
                    </span>
                  </td>
                  <td hlmTd class="text-muted-foreground">{{ quote.createdAt | date: 'mediumDate' }}</td>
                  <td hlmTd class="text-right">
                    <button hlmBtn variant="ghost" size="icon" (click)="openDetail(quote)" aria-label="Ver detalle">
                      <ng-icon name="lucideEllipsis" />
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="5" class="text-muted-foreground text-center">Aún no has solicitado cotizaciones.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Ver detalle -->
    <hlm-dialog #detailDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-2xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ selectedQuote()?.institutionName }}</h3>
          <p hlmDialogDescription>{{ selectedQuote()?.createdAt | date: 'medium' }}</p>
        </hlm-dialog-header>
        <div class="grid gap-4 py-2">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            @for (count of visibleCounts(); track count.label) {
              <div class="border-border rounded-lg border p-2 text-center">
                <p class="text-foreground text-lg font-semibold">{{ count.value }}</p>
                <p class="text-muted-foreground text-xs">{{ count.label }}</p>
              </div>
            }
          </div>

          <div hlmTableContainer class="rounded-lg border">
            <table hlmTable>
              <thead hlmTHead>
                <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Módulo</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Cantidad</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Precio unit.</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Subtotal</th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @for (item of selectedQuote()?.items ?? []; track item.id) {
                  <tr hlmTr>
                    <td hlmTd class="font-medium">{{ item.productModuleName }}</td>
                    <td hlmTd>{{ item.quantity }}</td>
                    <td hlmTd>{{ item.unitPrice | currency: 'USD' }}</td>
                    <td hlmTd class="font-medium">{{ item.subtotal | currency: 'USD' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <p class="text-foreground text-right text-sm font-semibold">
            Total: {{ selectedQuote()?.total | currency: 'USD' }}
          </p>

          @if (selectedQuote()?.status !== 'Pending') {
            <div class="border-border bg-muted/30 rounded-lg border p-3">
              <p class="text-foreground text-sm font-medium">
                {{ statusLabel(selectedQuote()?.status ?? '') }} el {{ selectedQuote()?.decidedAt | date: 'medium' }}
              </p>
              @if (selectedQuote()?.adminNotes) {
                <p class="text-muted-foreground mt-1 text-sm">{{ selectedQuote()?.adminNotes }}</p>
              }
            </div>
          }
        </div>
        <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
          <button hlmBtn type="button" variant="outline" hlmDialogClose>Cerrar</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class ClientQuotes {
  private readonly quotesService = inject(QuotesService);

  @ViewChild('detailDialogRef') private detailDialogRef!: HlmDialog;

  protected readonly quotes = toSignal(this.quotesService.listAll(), { initialValue: [] });
  protected readonly selectedQuote = signal<QuoteResponse | null>(null);

  protected readonly visibleCounts = () => {
    const quote = this.selectedQuote();
    if (!quote) return [];
    return COUNT_LABELS.map(({ key, label }) => ({ label, value: quote[key] as number | null })).filter(
      (c) => c.value !== null && c.value !== undefined,
    );
  };

  protected statusLabel(status: string): string {
    if (status === 'Approved') return 'Aprobada';
    if (status === 'Rejected') return 'Rechazada';
    return 'Pendiente';
  }

  protected statusVariant(status: string): 'default' | 'outline' | 'destructive' {
    if (status === 'Approved') return 'default';
    if (status === 'Rejected') return 'destructive';
    return 'outline';
  }

  protected openDetail(quote: QuoteResponse): void {
    this.selectedQuote.set(quote);
    this.detailDialogRef.open();
  }
}
