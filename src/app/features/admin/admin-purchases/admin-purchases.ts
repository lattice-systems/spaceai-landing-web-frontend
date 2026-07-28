import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideEllipsis,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
  lucideTriangleAlert,
  lucideX,
} from '@ng-icons/lucide';
import { HlmAlertDialogImports, HlmAlertDialog } from '@spartan-ng/helm/alert-dialog';
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
import { ProviderResponse } from '../../../core/models/provider.model';
import { PurchaseResponse } from '../../../core/models/purchase.model';
import { ProvidersService } from '../../../core/services/providers.service';
import { PurchasesService } from '../../../core/services/purchases.service';

type StatusFilter = 'all' | 'Completed' | 'Cancelled';

@Component({
  selector: 'app-admin-purchases',
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
    HlmAlertDialogImports,
    HlmPaginationImports,
  ],
  providers: [
    provideIcons({
      lucideEllipsis,
      lucidePlus,
      lucideSearch,
      lucideTrash2,
      lucideTriangleAlert,
      lucideX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Compras</h1>
          <p class="text-muted-foreground text-sm">
            Historial de compras a proveedores — registro financiero, no editable línea por línea.
          </p>
        </div>

        <button hlmBtn size="sm" (click)="openCreate()">
          <ng-icon name="lucidePlus" class="mr-1" />
          Nueva compra
        </button>
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
            placeholder="Buscar por proveedor…"
            [value]="search()"
            (input)="onSearchInput($event)"
          />
        </div>

        <hlm-native-select class="w-48" [value]="providerFilter()" (valueChange)="onProviderFilterChange($event)">
          <option value="" hlmNativeSelectOption>Todos los proveedores</option>
          @for (provider of providers(); track provider.id) {
            <option [value]="provider.id" hlmNativeSelectOption>{{ provider.name }}</option>
          }
        </hlm-native-select>

        <hlm-native-select class="w-40" [value]="statusFilter()" (valueChange)="onStatusFilterChange($event)">
          <option value="all" hlmNativeSelectOption>Todos los estados</option>
          <option value="Completed" hlmNativeSelectOption>Completadas</option>
          <option value="Cancelled" hlmNativeSelectOption>Canceladas</option>
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
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Proveedor</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fecha</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Total</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="w-10 text-right">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (purchase of page().data; track purchase.id) {
                <tr hlmTr>
                  <td hlmTd class="text-foreground font-medium">{{ purchase.providerName }}</td>
                  <td hlmTd class="text-muted-foreground">{{ purchase.purchaseDate | date: 'mediumDate' }}</td>
                  <td hlmTd>{{ purchase.total | currency: 'USD' }}</td>
                  <td hlmTd>
                    <span hlmBadge [variant]="purchase.status === 'Cancelled' ? 'secondary' : 'outline'" class="gap-1.5 font-normal">
                      @if (purchase.status !== 'Cancelled') {
                        <span class="bg-primary size-1.5 rounded-full"></span>
                      }
                      {{ purchase.status === 'Cancelled' ? 'Cancelada' : 'Completada' }}
                    </span>
                  </td>
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
                        <button hlmDropdownMenuItem (click)="openDetail(purchase)">Ver detalle</button>
                        @if (purchase.status !== 'Cancelled') {
                          <hlm-dropdown-menu-separator />
                          <button hlmDropdownMenuItem variant="destructive" (click)="openCancelConfirm(purchase)">
                            <ng-icon name="lucideTrash2" />
                            Cancelar
                          </button>
                        }
                      </hlm-dropdown-menu>
                    </ng-template>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="5" class="text-muted-foreground text-center">
                    Sin compras que coincidan con la búsqueda.
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

    <!-- Nueva compra -->
    <hlm-dialog #createDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-2xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Nueva compra</h3>
          <p hlmDialogDescription>Se registra como completada. Solo se puede cancelar después, no editar sus líneas.</p>
        </hlm-dialog-header>
        <form [formGroup]="form" (ngSubmit)="submitCreate()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Proveedor</label>
            <hlm-native-select formControlName="providerId">
              <option value="" disabled hlmNativeSelectOption>Selecciona un proveedor</option>
              @for (provider of activeProviders(); track provider.id) {
                <option [value]="provider.id" hlmNativeSelectOption>{{ provider.name }}</option>
              }
            </hlm-native-select>
          </div>

          <div class="grid gap-3">
            @for (item of items.controls; track $index; let i = $index) {
              <div [formGroup]="item" class="grid items-center gap-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                <input hlmInput placeholder="Material" formControlName="materialName" />
                <input hlmInput type="number" min="1" placeholder="Cantidad" formControlName="quantity" />
                <input hlmInput type="number" step="0.01" min="0" placeholder="Costo unitario" formControlName="unitCost" />
                <span class="text-muted-foreground text-sm">
                  {{ subtotalOf(item) | currency: 'USD' }}
                </span>
                <button
                  hlmBtn
                  type="button"
                  variant="outline"
                  size="icon"
                  [disabled]="items.length === 1"
                  (click)="removeItem(i)"
                  aria-label="Quitar material"
                >
                  <ng-icon name="lucideTrash2" />
                </button>
              </div>
            }
          </div>

          <div class="flex items-center justify-between">
            <button hlmBtn type="button" variant="outline" size="sm" (click)="addItem()">
              <ng-icon name="lucidePlus" class="mr-1" />
              Agregar material
            </button>
            <p class="text-foreground text-sm font-semibold">
              Total estimado: {{ estimatedTotal() | currency: 'USD' }}
            </p>
          </div>

          <div class="grid gap-2">
            <label hlmLabel>Notas (opcional)</label>
            <input hlmInput placeholder="Referencia, condiciones de pago…" formControlName="notes" />
          </div>

          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="form.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Registrar compra }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Ver detalle -->
    <hlm-dialog #detailDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-2xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ selectedPurchase()?.providerName }}</h3>
          <p hlmDialogDescription>
            {{ selectedPurchase()?.purchaseDate | date: 'mediumDate' }} — {{ selectedPurchase()?.status === 'Cancelled' ? 'Cancelada' : 'Completada' }}
          </p>
        </hlm-dialog-header>
        <div class="grid gap-4 py-2">
          @if (selectedPurchase()?.notes) {
            <p class="text-muted-foreground text-sm">{{ selectedPurchase()?.notes }}</p>
          }
          <div hlmTableContainer class="rounded-lg border">
            <table hlmTable>
              <thead hlmTHead>
                <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Material</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Cantidad</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Costo unit.</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Subtotal</th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @for (item of selectedPurchase()?.items ?? []; track item.id) {
                  <tr hlmTr>
                    <td hlmTd>
                      <div class="flex flex-col">
                        <span class="text-foreground font-medium leading-tight">{{ item.materialName }}</span>
                        @if (item.description) {
                          <span class="text-muted-foreground text-xs leading-tight">{{ item.description }}</span>
                        }
                      </div>
                    </td>
                    <td hlmTd>{{ item.quantity }}</td>
                    <td hlmTd>{{ item.unitCost | currency: 'USD' }}</td>
                    <td hlmTd class="font-medium">{{ item.subtotal | currency: 'USD' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <p class="text-foreground text-right text-sm font-semibold">
            Total: {{ selectedPurchase()?.total | currency: 'USD' }}
          </p>
        </div>
        <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
          <button hlmBtn type="button" variant="outline" hlmDialogClose>Cerrar</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Confirmar cancelación -->
    <hlm-alert-dialog #cancelConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Cancelar esta compra?</h2>
          <p hlmAlertDialogDescription>
            Quedará marcada como cancelada; no se elimina del historial ni se puede revertir desde aquí.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Volver</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmCancel()">Cancelar compra</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class AdminPurchases {
  private readonly fb = inject(FormBuilder);
  private readonly providersService = inject(ProvidersService);
  private readonly purchasesService = inject(PurchasesService);

  @ViewChild('createDialogRef') private createDialogRef!: HlmDialog;
  @ViewChild('detailDialogRef') private detailDialogRef!: HlmDialog;
  @ViewChild('cancelConfirmRef') protected cancelConfirmRef!: HlmAlertDialog;

  protected readonly providers = signal<ProviderResponse[]>([]);
  protected readonly activeProviders = signal<ProviderResponse[]>([]);

  protected readonly search = signal('');
  protected readonly providerFilter = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<PurchaseResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });

  protected readonly selectedPurchase = signal<PurchaseResponse | null>(null);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    providerId: ['', Validators.required],
    notes: [''],
    items: this.fb.array([this.newItem()]),
  });

  protected get items() {
    return this.form.controls.items;
  }

  // Método plano (no computed): un FormArray no es un signal, así que un computed() nunca
  // volvería a evaluarse al teclear. OnPush sí corre change detection en eventos del propio
  // componente, así que un método plano se re-evalúa en cada ciclo.
  protected estimatedTotal(): number {
    return this.items.controls.reduce((sum, item) => sum + this.subtotalOf(item), 0);
  }

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    this.providersService.listAll().subscribe((data) => {
      this.providers.set(data);
      this.activeProviders.set(data.filter((p) => p.isActive));
    });

    // Efecto central: cualquier cambio de búsqueda/filtro/página dispara una sola recarga.
    effect(() => {
      this.search();
      this.providerFilter();
      this.statusFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  private newItem() {
    return this.fb.nonNullable.group({
      materialName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitCost: [0, [Validators.required, Validators.min(0)]],
    });
  }

  protected addItem(): void {
    this.items.push(this.newItem());
  }

  protected removeItem(index: number): void {
    if (this.items.length > 1) this.items.removeAt(index);
  }

  protected subtotalOf(item: ReturnType<typeof this.newItem>): number {
    const { quantity, unitCost } = item.getRawValue();
    return (quantity || 0) * (unitCost || 0);
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.search.set(value);
      this.pageNumber.set(1);
    }, 300);
  }

  protected onProviderFilterChange(value: string | null | undefined): void {
    this.providerFilter.set(value ?? '');
    this.pageNumber.set(1);
  }

  protected onStatusFilterChange(value: string | null | undefined): void {
    this.statusFilter.set((value ?? 'all') as StatusFilter);
    this.pageNumber.set(1);
  }

  protected openCreate(): void {
    this.formError.set(null);
    this.form.reset({ providerId: '', notes: '' });
    this.items.clear();
    this.items.push(this.newItem());
    this.createDialogRef.open();
  }

  protected openDetail(purchase: PurchaseResponse): void {
    this.selectedPurchase.set(purchase);
    this.detailDialogRef.open();
  }

  protected openCancelConfirm(purchase: PurchaseResponse): void {
    this.selectedPurchase.set(purchase);
    this.cancelConfirmRef.open();
  }

  protected submitCreate(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.formError.set(null);

    const { providerId, notes, items } = this.form.getRawValue();
    this.purchasesService.create({ providerId, notes: notes || undefined, purchaseItems: items }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.createDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo registrar la compra.'));
      },
    });
  }

  protected confirmCancel(): void {
    const purchase = this.selectedPurchase();
    if (!purchase) return;
    this.actionError.set(null);
    this.purchasesService.cancel(purchase.id).subscribe({
      next: () => {
        this.cancelConfirmRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.cancelConfirmRef.close();
        this.actionError.set(this.extractError(err, 'No se pudo cancelar la compra.'));
      },
    });
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }

  private reload(): void {
    this.purchasesService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        providerId: this.providerFilter() || undefined,
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
      })
      .subscribe((result) => this.page.set(result));
  }
}
