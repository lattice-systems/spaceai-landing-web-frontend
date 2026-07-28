import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideEllipsis,
  lucideLayoutGrid,
  lucideList,
  lucidePackageCheck,
  lucidePlus,
  lucideReceipt,
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
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { PagedResult } from '../../../core/models/paged-result.model';
import { ProviderResponse } from '../../../core/models/provider.model';
import { PurchaseItemResponse, PurchaseResponse } from '../../../core/models/purchase.model';
import { ProvidersService } from '../../../core/services/providers.service';
import { PurchasesService } from '../../../core/services/purchases.service';
import { StatusChip } from '../../../shared/status-chip/status-chip';

type StatusFilter = 'all' | 'Pending' | 'PartiallyReceived' | 'Received' | 'Cancelled';
type BoardStatus = 'Pending' | 'PartiallyReceived' | 'Received' | 'Cancelled';
type ViewMode = 'table' | 'board';

const BOARD_COLUMNS: { status: BoardStatus; label: string }[] = [
  { status: 'Pending', label: 'Pendiente' },
  { status: 'PartiallyReceived', label: 'Recibida parcial' },
  { status: 'Received', label: 'Recibida' },
  { status: 'Cancelled', label: 'Cancelada' },
];

@Component({
  selector: 'app-admin-purchases',
  imports: [
    ReactiveFormsModule,
    DragDropModule,
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
    HlmTabsImports,
    StatusChip,
  ],
  providers: [
    provideIcons({
      lucideEllipsis,
      lucideLayoutGrid,
      lucideList,
      lucidePackageCheck,
      lucidePlus,
      lucideReceipt,
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
        <div class="flex items-center gap-3">
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full"
            style="background: color-mix(in oklch, var(--chip-violet) 12%, transparent); color: var(--chip-violet)"
          >
            <ng-icon name="lucideReceipt" class="text-lg" />
          </span>
          <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">Compras</h1>
            <p class="text-muted-foreground text-sm">
              Ordenes de compra: registra qué se pidió y ve registrando qué va llegando. Una orden mal
              cargada se cancela, no se edita ni se borra.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <hlm-tabs [tab]="view()" (tabActivated)="setView($event)">
            <hlm-tabs-list aria-label="Vista de compras">
              <button hlmTabsTrigger="table">
                <ng-icon name="lucideList" class="mr-1.5" />
                Tabla
              </button>
              <button hlmTabsTrigger="board">
                <ng-icon name="lucideLayoutGrid" class="mr-1.5" />
                Tablero
              </button>
            </hlm-tabs-list>
          </hlm-tabs>
          <button hlmBtn size="sm" (click)="openCreate()">
            <ng-icon name="lucidePlus" class="mr-1" />
            Nueva compra
          </button>
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

        @if (view() === 'table') {
          <hlm-native-select class="w-44" [value]="statusFilter()" (valueChange)="onStatusFilterChange($event)">
            <option value="all" hlmNativeSelectOption>Todos los estados</option>
            <option value="Pending" hlmNativeSelectOption>Pendientes</option>
            <option value="PartiallyReceived" hlmNativeSelectOption>Recibidas parcial</option>
            <option value="Received" hlmNativeSelectOption>Recibidas</option>
            <option value="Cancelled" hlmNativeSelectOption>Canceladas</option>
          </hlm-native-select>
        }
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

      @if (view() === 'table') {
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
                    <app-status-chip [label]="statusLabel(purchase.status)" [chip]="statusChip(purchase.status)" />
                  </td>
                  <td hlmTd class="text-right">
                    <div class="flex items-center justify-end gap-1">
                      @if (canReceive(purchase.status)) {
                        <button
                          hlmBtn
                          variant="ghost"
                          size="icon"
                          aria-label="Registrar recepción"
                          title="Registrar recepción"
                          (click)="openReceive(purchase)"
                        >
                          <ng-icon name="lucidePackageCheck" />
                        </button>
                      }
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
                    </div>
                    <ng-template #rowMenu>
                      <hlm-dropdown-menu class="min-w-48 rounded-lg">
                        <button hlmDropdownMenuItem (click)="openDetail(purchase)">Ver detalle</button>
                        @if (canReceive(purchase.status)) {
                          <button hlmDropdownMenuItem (click)="openReceive(purchase)">
                            <ng-icon name="lucidePackageCheck" />
                            Registrar recepción
                          </button>
                        }
                        @if (canCancel(purchase.status)) {
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
      }

      @if (view() === 'board') {
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          @for (col of boardColumns; track col.status) {
            <div class="flex min-w-0 flex-col gap-2">
              <div class="flex items-center gap-2 px-1">
                <span
                  class="size-2 shrink-0 rounded-full"
                  [style.background]="statusChip(col.status) ? 'var(' + statusChip(col.status) + ')' : 'var(--muted-foreground)'"
                ></span>
                <h3 class="text-foreground text-sm font-medium">{{ col.label }}</h3>
                <span class="text-muted-foreground text-xs">{{ boardData()[col.status].length }}</span>
              </div>
              <div
                cdkDropList
                [id]="col.status"
                [cdkDropListData]="boardData()[col.status]"
                [cdkDropListConnectedTo]="boardColumnIds"
                (cdkDropListDropped)="onBoardDrop($event, col.status)"
                class="bg-muted/30 flex min-h-24 flex-col gap-2 rounded-xl p-2"
              >
                @for (purchase of boardData()[col.status]; track purchase.id) {
                  <div
                    cdkDrag
                    [cdkDragData]="purchase"
                    hlmCard
                    class="cursor-grab gap-0 p-3 active:cursor-grabbing"
                  >
                    <button type="button" class="text-left" (click)="openDetail(purchase)">
                      <p class="text-foreground text-sm font-medium leading-tight">{{ purchase.providerName }}</p>
                      <p class="text-muted-foreground mt-1 text-xs">{{ purchase.purchaseDate | date: 'mediumDate' }}</p>
                    </button>
                    <div class="mt-2 flex items-center justify-between">
                      <span class="text-foreground text-sm font-semibold">{{ purchase.total | currency: 'USD' }}</span>
                      <span class="text-muted-foreground text-xs">
                        {{ purchase.items.length }} {{ purchase.items.length === 1 ? 'línea' : 'líneas' }}
                      </span>
                    </div>
                  </div>
                } @empty {
                  <p class="text-muted-foreground px-1 py-3 text-center text-xs">Sin compras aquí.</p>
                }
              </div>
            </div>
          }
        </div>
      }
    </section>

    <!-- Nueva compra -->
    <hlm-dialog #createDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-2xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Nueva compra</h3>
          <p hlmDialogDescription>
            Queda pendiente hasta que registres qué fue llegando. Sus líneas no se editan después.
          </p>
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
            {{ selectedPurchase()?.purchaseDate | date: 'mediumDate' }} — {{ statusLabel(selectedPurchase()?.status ?? '') }}
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
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Recibido</th>
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
                    <td hlmTd>
                      <span [class.text-chip-emerald]="item.receivedQuantity >= item.quantity" [style.color]="item.receivedQuantity >= item.quantity ? 'var(--chip-emerald)' : null">
                        {{ item.receivedQuantity }}/{{ item.quantity }}
                      </span>
                    </td>
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

    <!-- Registrar recepción -->
    <hlm-dialog #receiveDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-lg">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Registrar recepción</h3>
          <p hlmDialogDescription>{{ selectedPurchase()?.providerName }} — cantidad total recibida a la fecha por línea.</p>
        </hlm-dialog-header>
        <form [formGroup]="receiveForm" (ngSubmit)="submitReceive()" class="grid gap-3 py-2">
          @for (line of receiveLines.controls; track $index; let i = $index) {
            <div [formGroup]="line" class="grid grid-cols-[1fr_auto] items-center gap-3">
              <div>
                <p class="text-foreground text-sm font-medium">{{ receiveItems()[i].materialName }}</p>
                <p class="text-muted-foreground text-xs">ordenado: {{ receiveItems()[i].quantity }}</p>
              </div>
              <input
                hlmInput
                type="number"
                min="0"
                [max]="receiveItems()[i].quantity"
                class="w-24"
                formControlName="receivedQuantity"
              />
            </div>
          }
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="submitting()">
              @if (submitting()) { Guardando… } @else { Guardar recepción }
            </button>
          </hlm-dialog-footer>
        </form>
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
  @ViewChild('receiveDialogRef') private receiveDialogRef!: HlmDialog;
  @ViewChild('cancelConfirmRef') protected cancelConfirmRef!: HlmAlertDialog;

  protected readonly receiveItems = signal<PurchaseItemResponse[]>([]);

  protected readonly boardColumns = BOARD_COLUMNS;
  protected readonly boardColumnIds = BOARD_COLUMNS.map((c) => c.status);
  protected readonly view = signal<ViewMode>('table');
  protected readonly boardData = signal<Record<BoardStatus, PurchaseResponse[]>>({
    Pending: [],
    PartiallyReceived: [],
    Received: [],
    Cancelled: [],
  });

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

  protected readonly receiveForm = this.fb.nonNullable.group({
    lines: this.fb.array<ReturnType<typeof this.newReceiveLine>>([]),
  });

  protected get receiveLines(): FormArray<ReturnType<typeof this.newReceiveLine>> {
    return this.receiveForm.controls.lines;
  }

  private newReceiveLine() {
    return this.fb.nonNullable.group({
      receivedQuantity: [0, [Validators.required, Validators.min(0)]],
    });
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

  protected statusLabel(status: string): string {
    if (status === 'PartiallyReceived') return 'Recibida parcial';
    if (status === 'Received') return 'Recibida';
    if (status === 'Cancelled') return 'Cancelada';
    return 'Pendiente';
  }

  protected statusChip(status: string): string | null {
    if (status === 'Received') return '--chip-emerald';
    if (status === 'PartiallyReceived') return '--chip-sky';
    if (status === 'Pending') return '--chip-amber';
    return null;
  }

  protected canReceive(status: string): boolean {
    return status === 'Pending' || status === 'PartiallyReceived';
  }

  protected canCancel(status: string): boolean {
    return status === 'Pending' || status === 'PartiallyReceived';
  }

  protected openReceive(purchase: PurchaseResponse, fillFull = false): void {
    this.formError.set(null);
    this.selectedPurchase.set(purchase);
    this.receiveItems.set(purchase.items);
    this.receiveLines.clear();
    for (const item of purchase.items) {
      this.receiveLines.push(this.newReceiveLine());
    }
    this.receiveForm.reset({
      lines: purchase.items.map((item) => ({
        receivedQuantity: fillFull ? item.quantity : item.receivedQuantity,
      })),
    });
    this.receiveDialogRef.open();
  }

  protected submitReceive(): void {
    const purchase = this.selectedPurchase();
    if (this.receiveForm.invalid || !purchase) return;
    this.submitting.set(true);
    this.formError.set(null);

    const items = this.receiveItems().map((item, i) => ({
      purchaseItemId: item.id,
      receivedQuantity: this.receiveLines.at(i).getRawValue().receivedQuantity,
    }));

    this.purchasesService.receive(purchase.id, { items }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.receiveDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo registrar la recepción.'));
      },
    });
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

  protected setView(view: string): void {
    this.view.set(view as ViewMode);
    if (view === 'board') this.loadBoard();
  }

  // El tablero necesita ver las 4 columnas completas a la vez, no una página de 10 — se
  // pide aparte con un límite alto en vez de paginar (mismo patrón ya usado en Recetas).
  private loadBoard(): void {
    this.purchasesService
      .list({
        pageNumber: 1,
        pageSize: 200,
        search: this.search() || undefined,
        providerId: this.providerFilter() || undefined,
      })
      .subscribe((result) => {
        const grouped: Record<BoardStatus, PurchaseResponse[]> = {
          Pending: [],
          PartiallyReceived: [],
          Received: [],
          Cancelled: [],
        };
        for (const purchase of result.data) {
          const status = purchase.status as BoardStatus;
          (grouped[status] ?? grouped.Pending).push(purchase);
        }
        this.boardData.set(grouped);
      });
  }

  protected onBoardDrop(event: CdkDragDrop<PurchaseResponse[]>, targetStatus: BoardStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    // Solo se acepta soltar sobre un destino que representa una acción real — el estado
    // no se fuerza a mano, se deriva de lo recibido. Cualquier otro destino no hace nada
    // y la tarjeta vuelve visualmente a su columna (nunca se movió el dato de verdad).
    const purchase = event.previousContainer.data[event.previousIndex];
    if (targetStatus === 'Cancelled' && this.canCancel(purchase.status)) {
      this.openCancelConfirm(purchase);
      return;
    }
    if (targetStatus === 'Received' && this.canReceive(purchase.status)) {
      this.openReceive(purchase, true);
      return;
    }
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

    if (this.view() === 'board') this.loadBoard();
  }
}
