import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeDollarSign } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { PagedResult } from '../../../core/models/paged-result.model';
import { SaleResponse } from '../../../core/models/sale.model';
import { SalesService } from '../../../core/services/sales.service';
import { StatusChip } from '../../../shared/status-chip/status-chip';

@Component({
  selector: 'app-admin-sales',
  imports: [NgIcon, DatePipe, CurrencyPipe, HlmButtonImports, HlmCardImports, HlmTableImports, HlmPaginationImports, StatusChip],
  providers: [provideIcons({ lucideBadgeDollarSign })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div class="flex items-center gap-3">
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-full"
          style="background: color-mix(in oklch, var(--chip-emerald) 14%, transparent); color: var(--chip-emerald)"
        >
          <ng-icon name="lucideBadgeDollarSign" class="text-lg" />
        </span>
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Ventas</h1>
          <p class="text-muted-foreground text-sm">
            Cotizaciones aprobadas que se convirtieron en negocio cerrado.
          </p>
        </div>
      </div>

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Institución</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Solicitante</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Total</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fecha</th>
                <th hlmTh class="w-10 text-right"><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (sale of page().data; track sale.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{ sale.institutionName }}</td>
                  <td hlmTd class="text-muted-foreground">{{ sale.requesterName }}</td>
                  <td hlmTd>{{ sale.total | currency: 'USD' }}</td>
                  <td hlmTd>
                    <app-status-chip [label]="statusLabel(sale.status)" [chip]="statusChip(sale.status)" />
                  </td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ sale.createdAt | date: 'mediumDate' }}</td>
                  <td hlmTd class="text-right">
                    @if (sale.status === 'Pending') {
                      <button hlmBtn variant="ghost" size="sm" (click)="markDelivered(sale)">Marcar entregada</button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="6" class="text-muted-foreground text-center">
                    Sin ventas todavía — se generan al convertir una cotización aprobada.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <hlm-numbered-pagination
          class="border-border border-t"
          [(currentPage)]="pageNumber"
          [(itemsPerPage)]="pageSize"
          [totalItems]="page().totalRecords"
        />
      </div>
    </section>
  `,
})
export class AdminSales {
  private readonly salesService = inject(SalesService);

  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<SaleResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });

  constructor() {
    effect(() => {
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected statusLabel(status: string): string {
    return status === 'Delivered' ? 'Entregada' : 'Pendiente';
  }

  protected statusChip(status: string): string | null {
    return status === 'Delivered' ? '--chip-emerald' : '--chip-amber';
  }

  protected markDelivered(sale: SaleResponse): void {
    this.salesService.updateStatus(sale.id, 'Delivered').subscribe(() => this.reload());
  }

  private reload(): void {
    this.salesService.list(this.pageNumber(), this.pageSize()).subscribe((result) => this.page.set(result));
  }
}
