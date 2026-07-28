import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideQuote, lucideSearch, lucideTriangleAlert, lucideX } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { PagedResult } from '../../../core/models/paged-result.model';
import { QuoteResponse } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';

type StatusFilter = 'all' | 'Pending' | 'Approved' | 'Rejected';
type DecisionKind = 'approve' | 'reject';

const COUNT_LABELS: { key: keyof QuoteResponse; label: string }[] = [
  { key: 'studentCount', label: 'Estudiantes' },
  { key: 'buildingCount', label: 'Edificios' },
  { key: 'accessPointCount', label: 'Puntos de acceso' },
  { key: 'kioskCount', label: 'Kioscos' },
  { key: 'robotCount', label: 'Robots' },
];

@Component({
  selector: 'app-admin-quotes',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    DatePipe,
    CurrencyPipe,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
    HlmNativeSelectImports,
    HlmTableImports,
    HlmBadgeImports,
    HlmDropdownMenuImports,
    HlmDialogImports,
    HlmPaginationImports,
  ],
  providers: [provideIcons({ lucideEllipsis, lucideQuote, lucideSearch, lucideTriangleAlert, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div class="flex items-center gap-3">
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-full"
          style="background: color-mix(in oklch, var(--chip-amber) 16%, transparent); color: var(--chip-amber)"
        >
          <ng-icon name="lucideQuote" class="text-lg" />
        </span>
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Cotizaciones</h1>
          <p class="text-muted-foreground text-sm">
            Solicitudes de propuesta recibidas desde el cotizador público y el portal cliente.
          </p>
        </div>
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
            placeholder="Buscar por institución o solicitante…"
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

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Institución</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Contacto</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Total</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fecha</th>
                <th hlmTh class="w-10 text-right">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (quote of page().data; track quote.id) {
                <tr hlmTr>
                  <td hlmTd>
                    <div class="flex flex-col">
                      <span class="text-foreground font-medium leading-tight">{{ quote.institutionName }}</span>
                      <span class="text-muted-foreground text-xs leading-tight">{{ quote.requesterName }}</span>
                    </div>
                  </td>
                  <td hlmTd>
                    <div class="flex flex-col text-xs leading-tight">
                      <span class="text-foreground">{{ quote.requesterEmail }}</span>
                      <span class="text-muted-foreground">{{ quote.phone || 'Sin teléfono' }}</span>
                    </div>
                  </td>
                  <td hlmTd>{{ quote.total | currency: 'USD' }}</td>
                  <td hlmTd>
                    <span hlmBadge [variant]="statusVariant(quote.status)" class="gap-1.5 font-normal">
                      {{ statusLabel(quote.status) }}
                    </span>
                  </td>
                  <td hlmTd class="text-muted-foreground">{{ quote.createdAt | date: 'mediumDate' }}</td>
                  <td hlmTd class="text-right">
                    <button
                      hlmBtn
                      variant="ghost"
                      size="icon"
                      [hlmDropdownMenuTrigger]="rowMenu"
                      align="end"
                      aria-label="Acciones"
                    >
                      <ng-icon name="lucideEllipsis" />
                    </button>
                    <ng-template #rowMenu>
                      <hlm-dropdown-menu class="min-w-48 rounded-lg">
                        <button hlmDropdownMenuItem (click)="openDetail(quote)">Ver detalle</button>
                        @if (quote.status === 'Pending') {
                          <hlm-dropdown-menu-separator />
                          <button hlmDropdownMenuItem (click)="openDecision(quote, 'approve')">Aprobar</button>
                          <button hlmDropdownMenuItem variant="destructive" (click)="openDecision(quote, 'reject')">Rechazar</button>
                        }
                      </hlm-dropdown-menu>
                    </ng-template>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="6" class="text-muted-foreground text-center">
                    Sin cotizaciones que coincidan con la búsqueda.
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

    <!-- Ver detalle -->
    <hlm-dialog #detailDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-2xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ selectedQuote()?.institutionName }}</h3>
          <p hlmDialogDescription>
            {{ selectedQuote()?.requesterName }} — {{ selectedQuote()?.requesterEmail }}
            @if (selectedQuote()?.phone) { · {{ selectedQuote()?.phone }} }
          </p>
        </hlm-dialog-header>
        <div class="grid gap-4 py-2">
          <div class="flex flex-wrap gap-2">
            @if (selectedQuote()?.institutionType) {
              <span hlmBadge variant="secondary" class="font-normal">{{ selectedQuote()?.institutionType }}</span>
            }
            @if (selectedQuote()?.requesterRole) {
              <span hlmBadge variant="outline" class="font-normal">{{ selectedQuote()?.requesterRole }}</span>
            }
          </div>

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

    <!-- Aprobar / Rechazar -->
    <hlm-dialog #decisionDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-md">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ decisionKind() === 'approve' ? '¿Aprobar esta cotización?' : '¿Rechazar esta cotización?' }}</h3>
          <p hlmDialogDescription>{{ selectedQuote()?.institutionName }} — {{ selectedQuote()?.total | currency: 'USD' }}</p>
        </hlm-dialog-header>
        <form [formGroup]="decisionForm" (ngSubmit)="submitDecision()" class="grid gap-4 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Notas (opcional)</label>
            <input hlmInput placeholder="Motivo o contexto para el seguimiento…" formControlName="adminNotes" />
          </div>
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [variant]="decisionKind() === 'reject' ? 'destructive' : 'default'" [disabled]="submitting()">
              @if (submitting()) { Guardando… } @else if (decisionKind() === 'approve') { Aprobar } @else { Rechazar }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AdminQuotes {
  private readonly fb = inject(FormBuilder);
  private readonly quotesService = inject(QuotesService);

  @ViewChild('detailDialogRef') private detailDialogRef!: HlmDialog;
  @ViewChild('decisionDialogRef') private decisionDialogRef!: HlmDialog;

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<QuoteResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });

  protected readonly selectedQuote = signal<QuoteResponse | null>(null);
  protected readonly decisionKind = signal<DecisionKind>('approve');
  protected readonly submitting = signal(false);
  protected readonly actionError = signal<string | null>(null);

  protected readonly decisionForm = this.fb.nonNullable.group({
    adminNotes: [''],
  });

  protected readonly visibleCounts = () => {
    const quote = this.selectedQuote();
    if (!quote) return [];
    return COUNT_LABELS.map(({ key, label }) => ({ label, value: quote[key] as number | null }))
      .filter((c) => c.value !== null && c.value !== undefined);
  };

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    // Deep-link desde el dashboard (?status=Pending): fija el filtro inicial antes de que
    // corra el efecto de recarga, así el KPI aterriza ya filtrado.
    const initialStatus = inject(ActivatedRoute).snapshot.queryParamMap.get('status');
    if (initialStatus === 'Pending' || initialStatus === 'Approved' || initialStatus === 'Rejected') {
      this.statusFilter.set(initialStatus);
    }

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

  protected statusVariant(status: string): 'default' | 'outline' | 'destructive' {
    if (status === 'Approved') return 'default';
    if (status === 'Rejected') return 'destructive';
    return 'outline';
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

  protected openDetail(quote: QuoteResponse): void {
    this.selectedQuote.set(quote);
    this.detailDialogRef.open();
  }

  protected openDecision(quote: QuoteResponse, kind: DecisionKind): void {
    this.selectedQuote.set(quote);
    this.decisionKind.set(kind);
    this.decisionForm.reset({ adminNotes: '' });
    this.decisionDialogRef.open();
  }

  protected submitDecision(): void {
    const quote = this.selectedQuote();
    if (!quote) return;
    this.submitting.set(true);
    this.actionError.set(null);

    const { adminNotes } = this.decisionForm.getRawValue();
    const request = { adminNotes: adminNotes || undefined };
    const call = this.decisionKind() === 'approve'
      ? this.quotesService.approve(quote.id, request)
      : this.quotesService.reject(quote.id, request);

    call.subscribe({
      next: () => {
        this.submitting.set(false);
        this.decisionDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.decisionDialogRef.close();
        this.actionError.set(this.extractError(err, 'No se pudo guardar la decisión.'));
      },
    });
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }

  private reload(): void {
    this.quotesService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
      })
      .subscribe((result) => this.page.set(result));
  }
}
