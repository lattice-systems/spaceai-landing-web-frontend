import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { QuotesService } from '../../../core/services/quotes.service';

@Component({
  selector: 'app-admin-quotes',
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

      <section class="bg-muted/50 overflow-x-auto rounded-xl p-5">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-muted-foreground border-border border-b">
              <th class="pb-3 font-medium">Institución</th>
              <th class="pb-3 font-medium">Tipo</th>
              <th class="pb-3 font-medium">Contacto</th>
              <th class="pb-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (quote of quotes(); track quote.id) {
              <tr class="border-border/60 border-b last:border-0">
                <td class="text-foreground py-3 font-medium">{{ quote.institutionName }}</td>
                <td class="text-muted-foreground py-3">{{ quote.institutionType }}</td>
                <td class="text-muted-foreground py-3">{{ quote.requesterEmail }}</td>
                <td class="text-muted-foreground py-3">{{ quote.status }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="text-muted-foreground py-6 text-center">
                  Sin cotizaciones registradas.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>
  `,
})
export class AdminQuotes {
  private readonly quotesService = inject(QuotesService);
  protected readonly quotes = toSignal(this.quotesService.list(), { initialValue: [] });
}
