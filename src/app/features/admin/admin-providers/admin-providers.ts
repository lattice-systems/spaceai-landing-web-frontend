import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
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
import { PagedResult } from '../../../core/models/paged-result.model';
import { ProviderResponse } from '../../../core/models/provider.model';
import { ProvidersService } from '../../../core/services/providers.service';

type StatusFilter = 'all' | 'active' | 'inactive';

// Catálogo fijo — el estándar de vendor master data pide dropdown, no texto libre, para
// campos que no cambian seguido (evita variantes como "hardware"/"Hardware "/"HW").
const PROVIDER_TYPES = ['Hardware', 'Software', 'Servicios', 'Logística', 'Otro'] as const;

@Component({
  selector: 'app-admin-providers',
  imports: [
    ReactiveFormsModule,
    NgIcon,
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
  ],
  providers: [
    provideIcons({
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
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Proveedores</h1>
          <p class="text-muted-foreground text-sm">
            Maestro de proveedores — origen de las compras de materia prima.
          </p>
        </div>

        <button hlmBtn size="sm" (click)="openCreate()">
          <ng-icon name="lucidePlus" class="mr-1" />
          Nuevo proveedor
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
            placeholder="Buscar por nombre, contacto o correo…"
            [value]="search()"
            (input)="onSearchInput($event)"
          />
        </div>

        <hlm-native-select class="w-40" [value]="statusFilter()" (valueChange)="onStatusFilterChange($event)">
          <option value="all" hlmNativeSelectOption>Todos los estados</option>
          <option value="active" hlmNativeSelectOption>Activos</option>
          <option value="inactive" hlmNativeSelectOption>Inactivos</option>
        </hlm-native-select>

        <hlm-native-select class="w-40" [value]="typeFilter()" (valueChange)="onTypeFilterChange($event)">
          <option value="" hlmNativeSelectOption>Todos los tipos</option>
          @for (type of providerTypes; track type) {
            <option [value]="type" hlmNativeSelectOption>{{ type }}</option>
          }
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
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Proveedor</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Tipo</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Contacto</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Compras</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="w-10 text-right">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (provider of page().data; track provider.id) {
                <tr hlmTr [attr.data-state]="selectedIds().has(provider.id) ? 'selected' : null">
                  <td hlmTd>
                    <hlm-checkbox [checked]="selectedIds().has(provider.id)" (checkedChange)="toggleSelect(provider.id)" />
                  </td>
                  <td hlmTd>
                    <div class="flex flex-col gap-1">
                      <div class="flex items-center gap-2">
                        <span class="text-foreground font-medium leading-tight">{{ provider.name }}</span>
                        @if (isIncomplete(provider)) {
                          <span hlmBadge variant="outline" class="text-muted-foreground font-normal">Ficha incompleta</span>
                        }
                      </div>
                      <span class="text-muted-foreground text-xs leading-tight">
                        {{ provider.contactPerson || 'Sin contacto registrado' }}
                      </span>
                    </div>
                  </td>
                  <td hlmTd>
                    @if (provider.providerType) {
                      <span hlmBadge variant="secondary" class="font-normal">{{ provider.providerType }}</span>
                    } @else {
                      <span class="text-muted-foreground text-xs">Sin tipo</span>
                    }
                  </td>
                  <td hlmTd>
                    <div class="flex flex-col text-xs leading-tight">
                      <span class="text-foreground">{{ provider.email || 'Sin correo' }}</span>
                      <span class="text-muted-foreground">{{ provider.phone || 'Sin teléfono' }}</span>
                    </div>
                  </td>
                  <td hlmTd>
                    <span hlmBadge variant="outline" class="font-normal">{{ provider.purchaseCount }}</span>
                  </td>
                  <td hlmTd>
                    <span hlmBadge variant="outline" class="gap-1.5 font-normal">
                      <span
                        class="size-1.5 rounded-full"
                        [class.bg-primary]="provider.isActive"
                        [class.bg-muted-foreground]="!provider.isActive"
                      ></span>
                      {{ provider.isActive ? 'Activo' : 'Inactivo' }}
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
                        <button hlmDropdownMenuItem (click)="openEdit(provider)">
                          <ng-icon name="lucidePencil" />
                          Editar
                        </button>
                        <hlm-dropdown-menu-separator />
                        @if (provider.isActive) {
                          <button hlmDropdownMenuItem (click)="deactivateOne(provider)">Desactivar</button>
                        } @else {
                          <button hlmDropdownMenuItem (click)="activateOne(provider)">Activar</button>
                        }
                        <hlm-dropdown-menu-separator />
                        <button hlmDropdownMenuItem variant="destructive" (click)="openDeleteConfirm(provider)">
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
                    Sin proveedores que coincidan con la búsqueda.
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

    <!-- Crear proveedor -->
    <hlm-dialog #createDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Nuevo proveedor</h3>
          <p hlmDialogDescription>Se crea activo y disponible para registrarle compras.</p>
        </hlm-dialog-header>
        <form [formGroup]="createForm" (ngSubmit)="submitCreate()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Nombre de la empresa</label>
            <input hlmInput placeholder="Componentes del Norte S.A." formControlName="name" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Persona de contacto</label>
              <input hlmInput placeholder="Nombre del contacto" formControlName="contactPerson" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Tipo de proveedor</label>
              <hlm-native-select formControlName="providerType">
                <option value="" disabled hlmNativeSelectOption>Selecciona un tipo</option>
                @for (type of providerTypes; track type) {
                  <option [value]="type" hlmNativeSelectOption>{{ type }}</option>
                }
              </hlm-native-select>
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Correo</label>
              <input hlmInput type="email" placeholder="contacto@proveedor.com" formControlName="email" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Teléfono</label>
              <input hlmInput placeholder="+52 55 0000 0000" formControlName="phone" />
            </div>
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Dirección</label>
            <input hlmInput placeholder="Calle, ciudad, país" formControlName="address" />
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="createForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Agregar proveedor }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Editar proveedor -->
    <hlm-dialog #editDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Editar proveedor</h3>
          <p hlmDialogDescription>Actualiza los datos del proveedor seleccionado.</p>
        </hlm-dialog-header>
        <form [formGroup]="editForm" (ngSubmit)="submitEdit()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Nombre de la empresa</label>
            <input hlmInput placeholder="Componentes del Norte S.A." formControlName="name" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Persona de contacto</label>
              <input hlmInput placeholder="Nombre del contacto" formControlName="contactPerson" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Tipo de proveedor</label>
              <hlm-native-select formControlName="providerType">
                <option value="" disabled hlmNativeSelectOption>Selecciona un tipo</option>
                @for (type of providerTypes; track type) {
                  <option [value]="type" hlmNativeSelectOption>{{ type }}</option>
                }
              </hlm-native-select>
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Correo</label>
              <input hlmInput type="email" placeholder="contacto@proveedor.com" formControlName="email" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Teléfono</label>
              <input hlmInput placeholder="+52 55 0000 0000" formControlName="phone" />
            </div>
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Dirección</label>
            <input hlmInput placeholder="Calle, ciudad, país" formControlName="address" />
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

    <!-- Confirmar eliminación individual -->
    <hlm-alert-dialog #deleteConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar este proveedor?</h2>
          <p hlmAlertDialogDescription>
            {{ selectedProvider()?.name }} dejará de estar disponible. Si tiene compras registradas, el sistema
            bloqueará la eliminación y sugerirá desactivarlo en su lugar.
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
          <h2 hlmAlertDialogTitle>¿Desactivar {{ selectedIds().size }} proveedores?</h2>
          <p hlmAlertDialogDescription>
            No podrán recibir nuevas compras hasta que se reactiven. Su historial se conserva.
          </p>
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
          <h2 hlmAlertDialogTitle>¿Eliminar {{ selectedIds().size }} proveedores?</h2>
          <p hlmAlertDialogDescription>
            Los que tengan compras registradas se omitirán y se te avisará cuáles fueron.
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
export class AdminProviders {
  private readonly fb = inject(FormBuilder);
  private readonly providersService = inject(ProvidersService);

  @ViewChild('createDialogRef') private createDialogRef!: HlmDialog;
  @ViewChild('editDialogRef') private editDialogRef!: HlmDialog;
  @ViewChild('deleteConfirmRef') protected deleteConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeactivateConfirmRef') protected bulkDeactivateConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeleteConfirmRef') protected bulkDeleteConfirmRef!: HlmAlertDialog;

  protected readonly providerTypes = PROVIDER_TYPES;

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly typeFilter = signal('');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<ProviderResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });
  protected readonly selectedIds = signal<Set<string>>(new Set());
  protected readonly selectedProvider = signal<ProviderResponse | null>(null);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly allSelected = computed(() => {
    const data = this.page().data;
    return data.length > 0 && data.every((p) => this.selectedIds().has(p.id));
  });

  protected readonly createForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    contactPerson: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    providerType: ['', Validators.required],
  });

  protected readonly editForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    contactPerson: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    providerType: ['', Validators.required],
  });

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    // Efecto central: cualquier cambio de búsqueda/filtro/página dispara una sola recarga.
    effect(() => {
      this.search();
      this.statusFilter();
      this.typeFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected isIncomplete(provider: ProviderResponse): boolean {
    return !provider.email || !provider.phone || !provider.address || !provider.providerType;
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

  protected onTypeFilterChange(value: string | null | undefined): void {
    this.typeFilter.set(value ?? '');
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
    this.selectedIds.set(new Set(this.page().data.map((p) => p.id)));
  }

  protected openCreate(): void {
    this.formError.set(null);
    this.createForm.reset({ name: '', contactPerson: '', email: '', phone: '', address: '', providerType: '' });
    this.createDialogRef.open();
  }

  protected openEdit(provider: ProviderResponse): void {
    this.formError.set(null);
    this.selectedProvider.set(provider);
    this.editForm.reset({
      name: provider.name,
      contactPerson: provider.contactPerson,
      email: provider.email,
      phone: provider.phone,
      address: provider.address,
      providerType: provider.providerType,
    });
    this.editDialogRef.open();
  }

  protected openDeleteConfirm(provider: ProviderResponse): void {
    this.selectedProvider.set(provider);
    this.deleteConfirmRef.open();
  }

  protected submitCreate(): void {
    if (this.createForm.invalid) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.providersService.create(this.createForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.createDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo crear el proveedor.'));
      },
    });
  }

  protected submitEdit(): void {
    const provider = this.selectedProvider();
    if (this.editForm.invalid || !provider) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.providersService.update(provider.id, this.editForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.editDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo actualizar el proveedor.'));
      },
    });
  }

  protected activateOne(provider: ProviderResponse): void {
    this.actionError.set(null);
    this.providersService.activate(provider.id).subscribe({
      next: () => this.reload(),
      error: (err: HttpErrorResponse) =>
        this.actionError.set(this.extractError(err, 'No se pudo activar el proveedor.')),
    });
  }

  protected deactivateOne(provider: ProviderResponse): void {
    this.providersService.deactivate(provider.id).subscribe(() => this.reload());
  }

  protected confirmDeleteOne(): void {
    const provider = this.selectedProvider();
    if (!provider) return;
    this.actionError.set(null);
    this.providersService.remove(provider.id).subscribe({
      next: () => {
        this.deleteConfirmRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.deleteConfirmRef.close();
        this.actionError.set(this.extractError(err, 'No se pudo eliminar el proveedor.'));
      },
    });
  }

  protected confirmBulkDeactivate(): void {
    this.providersService.bulkSetStatus(Array.from(this.selectedIds()), false).subscribe((result) => {
      this.bulkDeactivateConfirmRef.close();
      this.selectedIds.set(new Set());
      this.reportBulkResult(result.affected, result.skipped);
      this.reload();
    });
  }

  protected confirmBulkDelete(): void {
    this.providersService.bulkDelete(Array.from(this.selectedIds())).subscribe((result) => {
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
    this.providersService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        isActive: this.statusFilter() === 'all' ? undefined : this.statusFilter() === 'active',
        providerType: this.typeFilter() || undefined,
      })
      .subscribe((result) => this.page.set(result));
  }
}
