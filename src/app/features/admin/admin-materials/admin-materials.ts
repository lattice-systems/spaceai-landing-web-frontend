import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideBeaker,
  lucideEllipsis,
  lucidePencil,
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
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { MaterialsService } from '../../../core/services/materials.service';
import { PagedResult } from '../../../core/models/paged-result.model';
import { MaterialResponse } from '../../../core/models/material.model';
import { StatusChip } from '../../../shared/status-chip/status-chip';

type StatusFilter = 'all' | 'active' | 'inactive';
type StockFilter = 'all' | 'low';

@Component({
  selector: 'app-admin-materials',
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
    HlmCheckboxImports,
    HlmDropdownMenuImports,
    HlmDialogImports,
    HlmAlertDialogImports,
    HlmPaginationImports,
    StatusChip,
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideBeaker,
      lucideEllipsis,
      lucidePencil,
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
        <div class="flex items-center gap-3">
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full"
            style="background: color-mix(in oklch, var(--chip-amber) 16%, transparent); color: var(--chip-amber)"
          >
            <ng-icon name="lucideBeaker" class="text-lg" />
          </span>
          <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">Materia prima</h1>
            <p class="text-muted-foreground text-sm">
              Costo unitario de cada material. De aquí sale el precio de venta de los módulos.
            </p>
          </div>
        </div>

        <button hlmBtn size="sm" (click)="openCreate()">
          <ng-icon name="lucidePlus" class="mr-1" />
          Nuevo material
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
            placeholder="Buscar por nombre o descripción…"
            [value]="search()"
            (input)="onSearchInput($event)"
          />
        </div>

        <hlm-native-select class="w-40" [value]="statusFilter()" (valueChange)="onStatusFilterChange($event)">
          <option value="all" hlmNativeSelectOption>Todos los estados</option>
          <option value="active" hlmNativeSelectOption>Activos</option>
          <option value="inactive" hlmNativeSelectOption>Inactivos</option>
        </hlm-native-select>

        <hlm-native-select class="w-40" [value]="stockFilter()" (valueChange)="onStockFilterChange($event)">
          <option value="all" hlmNativeSelectOption>Todo el stock</option>
          <option value="low" hlmNativeSelectOption>Solo stock bajo</option>
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
          <p class="text-sm font-medium">{{ selectedIds().size }} seleccionados</p>
          <button hlmBtn variant="outline" size="sm" (click)="bulkDeactivateConfirmRef.open()">
            Desactivar seleccionados
          </button>
          <button hlmBtn variant="destructive" size="sm" (click)="bulkDeleteConfirmRef.open()">
            Eliminar seleccionados
          </button>
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
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Material</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Unidad</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Costo unitario</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Stock</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="w-10 text-right">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (material of page().data; track material.id) {
                <tr hlmTr [attr.data-state]="selectedIds().has(material.id) ? 'selected' : null">
                  <td hlmTd>
                    <hlm-checkbox [checked]="selectedIds().has(material.id)" (checkedChange)="toggleSelect(material.id)" />
                  </td>
                  <td hlmTd>
                    <div class="flex flex-col">
                      <span class="text-foreground font-medium leading-tight">{{ material.name }}</span>
                      <span class="text-muted-foreground max-w-xs truncate text-xs leading-tight">
                        {{ material.description || 'Sin descripción' }}
                      </span>
                    </div>
                  </td>
                  <td hlmTd class="text-muted-foreground">{{ material.unitOfMeasure }}</td>
                  <td hlmTd class="text-muted-foreground">{{ material.unitCost | currency: 'USD' }}</td>
                  <td hlmTd>
                    <div class="flex items-center gap-1.5">
                      <span class="text-muted-foreground">
                        {{ material.currentStock }} (mín. {{ material.minimumStock }})
                      </span>
                      @if (isLowStock(material)) {
                        <app-status-chip label="Stock bajo" chip="--chip-amber" />
                      }
                    </div>
                  </td>
                  <td hlmTd>
                    <app-status-chip
                      [label]="material.isActive ? 'Activo' : 'Inactivo'"
                      [chip]="material.isActive ? '--chip-emerald' : null"
                    />
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
                        <button hlmDropdownMenuItem (click)="openEdit(material)">
                          <ng-icon name="lucidePencil" />
                          Editar
                        </button>
                        <button hlmDropdownMenuItem (click)="openAdjustStock(material)">
                          <ng-icon name="lucideArrowUpDown" />
                          Ajustar stock
                        </button>
                        <hlm-dropdown-menu-separator />
                        @if (material.isActive) {
                          <button hlmDropdownMenuItem (click)="deactivateOne(material)">Desactivar</button>
                        } @else {
                          <button hlmDropdownMenuItem (click)="activateOne(material)">Activar</button>
                        }
                        <hlm-dropdown-menu-separator />
                        <button hlmDropdownMenuItem variant="destructive" (click)="openDeleteConfirm(material)">
                          <ng-icon name="lucideTrash2" />
                          Eliminar
                        </button>
                      </hlm-dropdown-menu>
                    </ng-template>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="7" class="text-muted-foreground text-center">
                    Sin materiales que coincidan con la búsqueda.
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

    <!-- Crear material -->
    <hlm-dialog #createDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Nuevo material</h3>
          <p hlmDialogDescription>Se crea activo. El costo unitario alimenta el motor de costeo de recetas.</p>
        </hlm-dialog-header>
        <form [formGroup]="createForm" (ngSubmit)="submitCreate()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Nombre</label>
            <input hlmInput placeholder="Touch Screen 10&quot;" formControlName="name" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Descripción</label>
            <input hlmInput placeholder="Detalle del material…" formControlName="description" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Unidad de medida</label>
              <input hlmInput placeholder="pieza, kg, m…" formControlName="unitOfMeasure" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Costo unitario (USD)</label>
              <input hlmInput type="number" min="0" step="0.01" formControlName="unitCost" />
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Stock actual</label>
              <input hlmInput type="number" min="0" formControlName="currentStock" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Stock mínimo</label>
              <input hlmInput type="number" min="0" formControlName="minimumStock" />
            </div>
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="createForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Agregar material }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Editar material -->
    <hlm-dialog #editDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Editar material</h3>
          <p hlmDialogDescription>Actualiza los datos del material seleccionado.</p>
        </hlm-dialog-header>
        <form [formGroup]="editForm" (ngSubmit)="submitEdit()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Nombre</label>
            <input hlmInput placeholder="Touch Screen 10&quot;" formControlName="name" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Descripción</label>
            <input hlmInput placeholder="Detalle del material…" formControlName="description" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Unidad de medida</label>
              <input hlmInput placeholder="pieza, kg, m…" formControlName="unitOfMeasure" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Costo unitario (USD)</label>
              <input hlmInput type="number" min="0" step="0.01" formControlName="unitCost" />
              @if ((selectedMaterial()?.recipeCount ?? 0) > 0) {
                <p class="text-muted-foreground text-xs">
                  {{ selectedMaterial()?.recipeCount }} receta(s) ya usan este material a su costo actual — no se
                  recalculan solas al cambiarlo, edítalas en /admin/recetas si necesitas el precio nuevo.
                </p>
              }
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Stock actual</label>
              <input hlmInput type="number" min="0" formControlName="currentStock" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Stock mínimo</label>
              <input hlmInput type="number" min="0" formControlName="minimumStock" />
            </div>
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="editForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Guardar cambios }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Ajustar stock -->
    <hlm-dialog #adjustStockDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-md">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Ajustar stock</h3>
          <p hlmDialogDescription>
            {{ selectedMaterial()?.name }} — stock actual: {{ selectedMaterial()?.currentStock }}
            {{ selectedMaterial()?.unitOfMeasure }}.
          </p>
        </hlm-dialog-header>
        <form [formGroup]="adjustStockForm" (ngSubmit)="submitAdjustStock()" class="grid gap-4 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Cantidad (positivo entra, negativo sale)</label>
            <input hlmInput type="number" step="1" formControlName="delta" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Motivo</label>
            <input hlmInput placeholder="Compra recibida, merma, conteo físico…" formControlName="reason" />
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="adjustStockForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Ajustar }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Confirmar eliminación individual -->
    <hlm-alert-dialog #deleteConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar este material?</h2>
          <p hlmAlertDialogDescription>
            {{ selectedMaterial()?.name }} dejará de estar disponible. Esta acción se puede revertir solo desde la
            base de datos.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmDeleteOne()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar desactivación en lote -->
    <hlm-alert-dialog #bulkDeactivateConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Desactivar {{ selectedIds().size }} materiales?</h2>
          <p hlmAlertDialogDescription>Dejarán de estar disponibles para nuevas recetas hasta que se reactiven.</p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction (click)="confirmBulkDeactivate()">Desactivar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar eliminación en lote -->
    <hlm-alert-dialog #bulkDeleteConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar {{ selectedIds().size }} materiales?</h2>
          <p hlmAlertDialogDescription>
            Los que tengan recetas asociadas se omitirán y se te avisará cuáles fueron.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmBulkDelete()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class AdminMaterials {
  private readonly fb = inject(FormBuilder);
  private readonly materialsService = inject(MaterialsService);

  @ViewChild('createDialogRef') private createDialogRef!: HlmDialog;
  @ViewChild('editDialogRef') private editDialogRef!: HlmDialog;
  @ViewChild('adjustStockDialogRef') private adjustStockDialogRef!: HlmDialog;
  @ViewChild('deleteConfirmRef') protected deleteConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeactivateConfirmRef') protected bulkDeactivateConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeleteConfirmRef') protected bulkDeleteConfirmRef!: HlmAlertDialog;

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly stockFilter = signal<StockFilter>('all');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<MaterialResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });
  protected readonly selectedIds = signal<Set<string>>(new Set());
  protected readonly selectedMaterial = signal<MaterialResponse | null>(null);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly allSelected = computed(() => {
    const data = this.page().data;
    return data.length > 0 && data.every((m) => this.selectedIds().has(m.id));
  });

  protected readonly createForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    unitOfMeasure: ['', Validators.required],
    unitCost: [0, [Validators.required, Validators.min(0)]],
    currentStock: [0, [Validators.required, Validators.min(0)]],
    minimumStock: [0, [Validators.required, Validators.min(0)]],
  });

  protected readonly editForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    unitOfMeasure: ['', Validators.required],
    unitCost: [0, [Validators.required, Validators.min(0)]],
    currentStock: [0, [Validators.required, Validators.min(0)]],
    minimumStock: [0, [Validators.required, Validators.min(0)]],
  });

  protected readonly adjustStockForm = this.fb.nonNullable.group({
    delta: [0, [Validators.required]],
    reason: ['', Validators.required],
  });

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    // Deep-link desde el dashboard (?lowStock=true): fija el filtro inicial antes de que
    // corra el efecto de recarga, así el KPI aterriza ya filtrado.
    if (inject(ActivatedRoute).snapshot.queryParamMap.get('lowStock') === 'true') {
      this.stockFilter.set('low');
    }

    // Efecto central: cualquier cambio de búsqueda/filtro/página dispara una sola recarga.
    effect(() => {
      this.search();
      this.statusFilter();
      this.stockFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected isLowStock(material: MaterialResponse): boolean {
    return material.currentStock <= material.minimumStock;
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

  protected onStockFilterChange(value: string | null | undefined): void {
    this.stockFilter.set((value ?? 'all') as StockFilter);
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
    this.selectedIds.set(new Set(this.page().data.map((m) => m.id)));
  }

  protected openCreate(): void {
    this.formError.set(null);
    this.createForm.reset({ name: '', description: '', unitOfMeasure: '', unitCost: 0, currentStock: 0, minimumStock: 0 });
    this.createDialogRef.open();
  }

  protected openEdit(material: MaterialResponse): void {
    this.formError.set(null);
    this.selectedMaterial.set(material);
    this.editForm.reset({
      name: material.name,
      description: material.description,
      unitOfMeasure: material.unitOfMeasure,
      unitCost: material.unitCost,
      currentStock: material.currentStock,
      minimumStock: material.minimumStock,
    });
    this.editDialogRef.open();
  }

  protected openAdjustStock(material: MaterialResponse): void {
    this.formError.set(null);
    this.selectedMaterial.set(material);
    this.adjustStockForm.reset({ delta: 0, reason: '' });
    this.adjustStockDialogRef.open();
  }

  protected submitAdjustStock(): void {
    const material = this.selectedMaterial();
    if (this.adjustStockForm.invalid || !material) return;
    this.submitting.set(true);
    this.formError.set(null);

    const { delta, reason } = this.adjustStockForm.getRawValue();
    this.materialsService.adjustStock(material.id, delta, reason).subscribe({
      next: () => {
        this.submitting.set(false);
        this.adjustStockDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo ajustar el stock.'));
      },
    });
  }

  protected openDeleteConfirm(material: MaterialResponse): void {
    this.selectedMaterial.set(material);
    this.deleteConfirmRef.open();
  }

  protected submitCreate(): void {
    if (this.createForm.invalid) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.materialsService.create(this.createForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.createDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo crear el material.'));
      },
    });
  }

  protected submitEdit(): void {
    const material = this.selectedMaterial();
    if (this.editForm.invalid || !material) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.materialsService.update(material.id, this.editForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.editDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo actualizar el material.'));
      },
    });
  }

  protected activateOne(material: MaterialResponse): void {
    this.actionError.set(null);
    this.materialsService.activate(material.id).subscribe({
      next: () => this.reload(),
      error: (err: HttpErrorResponse) =>
        this.actionError.set(this.extractError(err, 'No se pudo activar el material.')),
    });
  }

  protected deactivateOne(material: MaterialResponse): void {
    this.materialsService.deactivate(material.id).subscribe(() => this.reload());
  }

  protected confirmDeleteOne(): void {
    const material = this.selectedMaterial();
    if (!material) return;
    this.actionError.set(null);
    this.materialsService.remove(material.id).subscribe({
      next: () => {
        this.deleteConfirmRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.deleteConfirmRef.close();
        this.actionError.set(this.extractError(err, 'No se pudo eliminar el material.'));
      },
    });
  }

  protected confirmBulkDeactivate(): void {
    this.materialsService.bulkSetStatus(Array.from(this.selectedIds()), false).subscribe((result) => {
      this.bulkDeactivateConfirmRef.close();
      this.selectedIds.set(new Set());
      this.reportBulkResult(result.affected, result.skipped);
      this.reload();
    });
  }

  protected confirmBulkDelete(): void {
    this.materialsService.bulkDelete(Array.from(this.selectedIds())).subscribe((result) => {
      this.bulkDeleteConfirmRef.close();
      this.selectedIds.set(new Set());
      this.reportBulkResult(result.affected, result.skipped);
      this.reload();
    });
  }

  private reportBulkResult(affected: number, skipped: string[]): void {
    // Nunca fallar en silencio en acciones en lote: si algo se omitió, se explica por qué.
    if (skipped.length > 0) {
      this.actionError.set(`${affected} aplicados. Omitidos: ${skipped.join(' ')}`);
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
    this.materialsService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        isActive: this.statusFilter() === 'all' ? undefined : this.statusFilter() === 'active',
        lowStock: this.stockFilter() === 'low' ? true : undefined,
      })
      .subscribe((result) => this.page.set(result));
  }
}
