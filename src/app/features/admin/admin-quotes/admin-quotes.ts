import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { QuotesService } from '../../../core/services/quotes.service';

@Component({
  selector: 'app-admin-quotes',
  imports: [HlmTableImports, HlmBadgeImports, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">Cotizaciones</h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Solicitudes de propuesta recibidas desde el cotizador público y el portal cliente.
        </p>
      </div>

      <section class="bg-muted/50 rounded-xl p-5">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Institución</th>
                <th hlmTh>Tipo</th>
                <th hlmTh>Contacto</th>
                <th hlmTh>Total</th>
                <th hlmTh>Estado</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (quote of quotes(); track quote.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{ quote.institutionName }}</td>
                  <td hlmTd class="text-muted-foreground">{{ quote.institutionType }}</td>
                  <td hlmTd class="text-muted-foreground">{{ quote.requesterEmail }}</td>
                  <td hlmTd class="text-muted-foreground">
                    {{ quote.total | number: '1.2-2' }}
                  </td>
                  <td hlmTd>
                    <span hlmBadge [variant]="quote.status === 'Pending' ? 'secondary' : 'default'">
                      {{ quote.status }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="5" class="text-muted-foreground text-center">
                    Sin cotizaciones registradas.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `,
})
export class AdminQuotes {
  private readonly quotesService = inject(QuotesService);
  protected readonly quotes = toSignal(this.quotesService.list(), { initialValue: [] });
}
