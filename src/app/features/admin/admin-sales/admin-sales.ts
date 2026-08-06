import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeDollarSign } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { PagedResult } from '../../../core/models/paged-result.model';
import { SaleResponse, SalesProfitability } from '../../../core/models/sale.model';
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

      @if (profit(); as p) {
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div hlmCard class="gap-1 p-4">
            <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Ingresos</p>
            <p class="text-foreground text-2xl font-semibold tabular-nums">{{ p.totalRevenue | currency: 'USD' }}</p>
            <p class="text-muted-foreground text-xs">{{ p.salesCount }} venta(s)</p>
          </div>
          <div hlmCard class="gap-1 p-4">
            <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Costo de ventas</p>
            <p class="text-foreground text-2xl font-semibold tabular-nums">{{ p.totalCost | currency: 'USD' }}</p>
            <p class="text-muted-foreground text-xs">Costo promedio ponderado</p>
          </div>
          <div hlmCard class="gap-1 p-4">
            <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Utilidad bruta</p>
            <p class="text-2xl font-semibold tabular-nums" style="color: var(--chip-emerald)">
              {{ p.grossProfit | currency: 'USD' }}
            </p>
            <p class="text-muted-foreground text-xs">Ingresos menos costo</p>
          </div>
          <div hlmCard class="gap-1 p-4">
            <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Margen</p>
            <p class="text-foreground text-2xl font-semibold tabular-nums">{{ p.marginPercent }}%</p>
            <p class="text-muted-foreground text-xs">Sobre ingresos</p>
          </div>
        </div>
      }

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Institución</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Solicitante</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Total</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Costo</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Utilidad</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Margen</th>
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
                  <td hlmTd class="tabular-nums">{{ sale.total | currency: 'USD' }}</td>
                  <td hlmTd class="text-muted-foreground tabular-nums">{{ sale.totalCost | currency: 'USD' }}</td>
                  <td hlmTd class="tabular-nums" style="color: var(--chip-emerald)">
                    {{ sale.grossProfit | currency: 'USD' }}
                  </td>
                  <td hlmTd class="text-muted-foreground tabular-nums">{{ sale.marginPercent }}%</td>
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
                  <td hlmTd colspan="9" class="text-muted-foreground text-center">
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
  protected readonly profit = signal<SalesProfitability | null>(null);

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
    this.salesService.updateStatus(sale.id, 'Delivered').subscribe({
      next: () => this.reload(),
      error: (err: HttpErrorResponse) => toast.error(this.extractError(err, 'No se pudo actualizar la venta.')),
    });
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }

  private reload(): void {
    this.salesService.list(this.pageNumber(), this.pageSize()).subscribe({
      next: (result) => this.page.set(result),
      error: (err: HttpErrorResponse) => toast.error(this.extractError(err, 'No se pudo cargar la lista de ventas.')),
    });

    // El resumen es global (no paginado), así que se recarga junto con la tabla para que
    // no quede desfasado tras marcar una venta como entregada.
    this.salesService.profitability().subscribe({
      next: (result) => this.profit.set(result),
      error: (err: HttpErrorResponse) => toast.error(this.extractError(err, 'No se pudo cargar el resumen de ganancias.')),
    });
  }
}
