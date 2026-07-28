import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideTriangleAlert, lucideX } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { PagedResult } from '../../../core/models/paged-result.model';
import { ReviewResponse } from '../../../core/models/review.model';
import { ReviewsService } from '../../../core/services/reviews.service';

type StatusFilter = 'all' | 'Pending' | 'Approved' | 'Rejected';

@Component({
  selector: 'app-admin-reviews',
  imports: [
    NgIcon,
    DatePipe,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmNativeSelectImports,
    HlmTableImports,
    HlmBadgeImports,
    HlmCheckboxImports,
    HlmPaginationImports,
  ],
  providers: [provideIcons({ lucideSearch, lucideTriangleAlert, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div>
        <h1 class="text-foreground text-xl font-semibold tracking-tight">Reseñas</h1>
        <p class="text-muted-foreground text-sm">
          Comentarios y valoraciones enviados por clientes — aprueba las que se pueden mostrar públicamente.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="relative min-w-56 flex-1">
          <ng-icon
            name="lucideSearch"
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base"
          />
          <input
            hlmInput
            class="pl-9"
            placeholder="Buscar por institución, producto o comentario…"
            [value]="search()"
            (input)="onSearchInput($event)"
          />
        </div>

        <hlm-native-select class="w-40" [value]="statusFilter()" (valueChange)="onStatusFilterChange($event)">
          <option value="all" hlmNativeSelectOption>Todos los estados</option>
          <option value="Pending" hlmNativeSelectOption>Pendientes</option>
          <option value="Approved" hlmNativeSelectOption>Aprobadas</option>
          <option value="Rejected" hlmNativeSelectOption>Rechazadas</option>
        </hlm-native-select>
      </div>

      @if (actionError()) {
        <div class="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
          <ng-icon name="lucideTriangleAlert" class="mt-0.5 shrink-0 text-base" />
          <p class="flex-1">{{ actionError() }}</p>
          <button
            type="button"
            class="text-destructive/70 hover:text-destructive"
            aria-label="Cerrar"
            (click)="actionError.set(null)"
          >
            <ng-icon name="lucideX" />
          </button>
        </div>
      }

      @if (selectedIds().size > 0) {
        <div class="bg-muted/50 border-border flex items-center gap-3 rounded-lg border p-3">
          <p class="text-sm font-medium">{{ selectedIds().size }} seleccionadas</p>
          <button hlmBtn size="sm" (click)="bulkDecide('Approved')">Aprobar seleccionadas</button>
          <button hlmBtn variant="outline" size="sm" (click)="bulkDecide('Rejected')">Rechazar seleccionadas</button>
        </div>
      }

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="w-10">
                  <hlm-checkbox [checked]="allSelected()" (checkedChange)="toggleSelectAll($event)" />
                </th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Cliente</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Producto</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Calificación</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Comentario</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fecha</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (review of page().data; track review.id) {
                <tr hlmTr class="align-top" [attr.data-state]="selectedIds().has(review.id) ? 'selected' : null">
                  <td hlmTd>
                    <hlm-checkbox [checked]="selectedIds().has(review.id)" (checkedChange)="toggleSelect(review.id)" />
                  </td>
                  <td hlmTd class="font-medium whitespace-nowrap">{{ review.institutionName }}</td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ review.productName }}</td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ review.rating }}/5</td>
                  <td hlmTd class="text-muted-foreground max-w-md">{{ review.comment }}</td>
                  <td hlmTd class="whitespace-nowrap">
                    <span hlmBadge [variant]="statusVariant(review.status)" class="font-normal">
                      {{ statusLabel(review.status) }}
                    </span>
                  </td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ review.createdAt | date: 'mediumDate' }}</td>
                  <td hlmTd class="whitespace-nowrap">
                    @if (review.status === 'Pending') {
                      <div class="flex gap-2">
                        <button hlmBtn size="sm" (click)="decideOne(review, 'Approved')">Aprobar</button>
                        <button hlmBtn size="sm" variant="outline" (click)="decideOne(review, 'Rejected')">Rechazar</button>
                      </div>
                    }
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="8" class="text-muted-foreground text-center">
                    Sin reseñas que coincidan con la búsqueda.
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
export class AdminReviews {
  private readonly reviewsService = inject(ReviewsService);

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<ReviewResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });
  protected readonly selectedIds = signal<Set<string>>(new Set());
  protected readonly actionError = signal<string | null>(null);

  protected readonly allSelected = computed(() => {
    const data = this.page().data;
    return data.length > 0 && data.every((r) => this.selectedIds().has(r.id));
  });

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    // Efecto central: cualquier cambio de búsqueda/filtro/página dispara una sola recarga.
    effect(() => {
      this.search();
      this.statusFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected statusLabel(status: string): string {
    if (status === 'Approved') return 'Aprobada';
    if (status === 'Rejected') return 'Rechazada';
    return 'Pendiente';
  }

  protected statusVariant(status: string): 'default' | 'outline' | 'secondary' {
    if (status === 'Approved') return 'default';
    if (status === 'Rejected') return 'outline';
    return 'secondary';
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.search.set(value);
      this.pageNumber.set(1);
    }, 300);
  }

  protected onStatusFilterChange(value: string | null | undefined): void {
    this.statusFilter.set((value ?? 'all') as StatusFilter);
    this.pageNumber.set(1);
  }

  protected toggleSelect(id: string): void {
    const next = new Set(this.selectedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedIds.set(next);
  }

  protected toggleSelectAll(checked: boolean): void {
    if (!checked) {
      this.selectedIds.set(new Set());
      return;
    }
    this.selectedIds.set(new Set(this.page().data.map((r) => r.id)));
  }

  protected decideOne(review: ReviewResponse, status: 'Approved' | 'Rejected'): void {
    this.actionError.set(null);
    const call = status === 'Approved' ? this.reviewsService.approve(review.id) : this.reviewsService.reject(review.id);
    call.subscribe({
      next: () => this.reload(),
      error: (err: HttpErrorResponse) =>
        this.actionError.set(this.extractError(err, 'No se pudo guardar la decisión.')),
    });
  }

  protected bulkDecide(status: 'Approved' | 'Rejected'): void {
    this.reviewsService.bulkDecide(Array.from(this.selectedIds()), status).subscribe((result) => {
      this.selectedIds.set(new Set());
      this.reportBulkResult(result.affected, result.skipped);
      this.reload();
    });
  }

  private reportBulkResult(affected: number, skipped: string[]): void {
    if (skipped.length > 0) {
      this.actionError.set(`${affected} aplicadas. Omitidas: ${skipped.join(' ')}`);
    } else {
      this.actionError.set(null);
    }
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }

  private reload(): void {
    this.reviewsService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
      })
      .subscribe((result) => this.page.set(result));
  }
}
