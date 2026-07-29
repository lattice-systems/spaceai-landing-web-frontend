import { DatePipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBox,
  lucideEllipsis,
  lucideLock,
  lucidePencil,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
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
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { ProductModulesService } from '../../../core/services/product-modules.service';
import { ProductsService } from '../../../core/services/products.service';
import { PagedResult } from '../../../core/models/paged-result.model';
import { ProductModuleResponse } from '../../../core/models/product-module.model';
import { ProductResponse } from '../../../core/models/product.model';
import { StatusChip } from '../../../shared/status-chip/status-chip';
import { toast } from '@spartan-ng/brain/sonner';
import { TableSkeleton } from '../../../shared/table-skeleton/table-skeleton';

type StatusFilter = 'all' | 'active' | 'inactive';
type CatalogTab = 'modules' | 'products';

@Component({
  selector: 'app-admin-products',
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
    HlmTabsImports,
    HlmCheckboxImports,
    HlmDropdownMenuImports,
    HlmDialogImports,
    HlmAlertDialogImports,
    HlmPaginationImports,
    StatusChip,
    TableSkeleton,
  ],
  providers: [
    provideIcons({
      lucideBox,
      lucideEllipsis,
      lucideLock,
      lucidePencil,
      lucidePlus,
      lucideSearch,
      lucideTrash2,
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
            <ng-icon name="lucideBox" class="text-lg" />
          </span>
          <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">Catálogo</h1>
            <p class="text-muted-foreground text-sm">
              Los módulos son lo que se vende. Los productos son solo la categoría que los agrupa.
            </p>
          </div>
        </div>

        @if (activeTab() === 'modules') {
          <button hlmBtn size="sm" (click)="openCreateModule()">
            <ng-icon name="lucidePlus" class="mr-1" />
            Nuevo módulo
          </button>
        } @else {
          <button hlmBtn size="sm" (click)="openCreateProduct()">
            <ng-icon name="lucidePlus" class="mr-1" />
            Nuevo producto
          </button>
        }
      </div>

      <hlm-tabs [tab]="activeTab()" (tabActivated)="onTabChange($event)">
        <hlm-tabs-list aria-label="Vista del catálogo" class="w-fit">
          <button hlmTabsTrigger="modules">Módulos</button>
          <button hlmTabsTrigger="products">Productos</button>
        </hlm-tabs-list>
      </hlm-tabs>

      @if (activeTab() === 'modules') {
        <!-- ── Tab Módulos ─────────────────────────────────────────────── -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative min-w-56 flex-1">
            <ng-icon
              name="lucideSearch"
              class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base"
            />
            <input
              hlmInput
              class="pl-9"
              placeholder="Buscar módulo…"
              [value]="moduleSearch()"
              (input)="onModuleSearchInput($event)"
            />
          </div>

          <hlm-native-select class="w-48" [value]="moduleProductFilter()" (valueChange)="onModuleProductFilterChange($event)">
            <option value="" hlmNativeSelectOption>Todos los productos</option>
            @for (product of products(); track product.id) {
              <option [value]="product.id" hlmNativeSelectOption>{{ product.name }}</option>
            }
          </hlm-native-select>

          <hlm-native-select class="w-40" [value]="moduleStatusFilter()" (valueChange)="onModuleStatusFilterChange($event)">
            <option value="all" hlmNativeSelectOption>Todos los estados</option>
            <option value="active" hlmNativeSelectOption>Activos</option>
            <option value="inactive" hlmNativeSelectOption>Inactivos</option>
          </hlm-native-select>
        </div>

        @if (moduleSelectedIds().size > 0) {
          <div class="bg-muted/50 border-border flex items-center gap-3 rounded-lg border p-3">
            <p class="text-sm font-medium">{{ moduleSelectedIds().size }} seleccionados</p>
            <button hlmBtn variant="outline" size="sm" (click)="bulkDeactivateModulesConfirmRef.open()">
              Desactivar seleccionados
            </button>
            <button hlmBtn variant="destructive" size="sm" (click)="bulkDeleteModulesConfirmRef.open()">
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
                    <hlm-checkbox [checked]="allModulesSelected()" (checkedChange)="toggleSelectAllModules($event)" />
                  </th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Módulo</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Producto</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Precio</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                  <th hlmTh class="w-10 text-right">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @if (loadingModules()) {
                  <tr hlmTr>
                    <td hlmTd colspan="6"><app-table-skeleton [cols]="6" /></td>
                  </tr>
                } @else {
                @for (module of modulesPage().data; track module.id) {
                  <tr hlmTr [attr.data-state]="moduleSelectedIds().has(module.id) ? 'selected' : null">
                    <td hlmTd>
                      <hlm-checkbox [checked]="moduleSelectedIds().has(module.id)" (checkedChange)="toggleSelectModule(module.id)" />
                    </td>
                    <td hlmTd>
                      <div class="flex flex-col">
                        <span class="text-foreground font-medium leading-tight">{{ module.name }}</span>
                        <span class="text-muted-foreground max-w-xs truncate text-xs leading-tight">
                          {{ module.description || 'Sin descripción' }}
                        </span>
                      </div>
                    </td>
                    <td hlmTd class="text-muted-foreground">{{ module.productName }}</td>
                    <td hlmTd class="text-muted-foreground">
                      <div class="flex items-center gap-1.5">
                        {{ module.price | currency: 'USD' }}
                        @if (module.hasRecipe) {
                          <span hlmBadge variant="secondary" class="gap-1 font-normal">
                            <ng-icon name="lucideLock" class="text-[10px]" />
                            Por receta
                          </span>
                        }
                      </div>
                    </td>
                    <td hlmTd>
                      <app-status-chip
                        [label]="module.isActive ? 'Activo' : 'Inactivo'"
                        [chip]="module.isActive ? '--chip-emerald' : null"
                      />
                    </td>
                    <td hlmTd class="text-right">
                      <button
                        hlmBtn
                        variant="ghost"
                        size="icon"
                        [hlmDropdownMenuTrigger]="moduleRowMenu"
                        align="end"
                        aria-label="Acciones"
                      >
                        <ng-icon name="lucideEllipsis" />
                      </button>
                      <ng-template #moduleRowMenu>
                        <hlm-dropdown-menu class="min-w-48 rounded-lg">
                          <button hlmDropdownMenuItem (click)="openEditModule(module)">
                            <ng-icon name="lucidePencil" />
                            Editar
                          </button>
                          <hlm-dropdown-menu-separator />
                          @if (module.isActive) {
                            <button hlmDropdownMenuItem (click)="deactivateModule(module)">Desactivar</button>
                          } @else {
                            <button hlmDropdownMenuItem (click)="activateModule(module)">Activar</button>
                          }
                          <hlm-dropdown-menu-separator />
                          <button hlmDropdownMenuItem variant="destructive" (click)="openDeleteModuleConfirm(module)">
                            <ng-icon name="lucideTrash2" />
                            Eliminar
                          </button>
                        </hlm-dropdown-menu>
                      </ng-template>
                    </td>
                  </tr>
                } @empty {
                  <tr hlmTr>
                    <td hlmTd colspan="6" class="text-muted-foreground text-center">
                      Sin módulos que coincidan con la búsqueda.
                    </td>
                  </tr>
                }
                }
              </tbody>
            </table>
          </div>

          <hlm-numbered-pagination
            class="border-border border-t"
            [(currentPage)]="modulePageNumber"
            [(itemsPerPage)]="modulePageSize"
            [totalItems]="modulesPage().totalRecords"
          />
        </div>
      } @else {
        <!-- ── Tab Productos ───────────────────────────────────────────── -->
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
              [value]="productSearch()"
              (input)="onProductSearchInput($event)"
            />
          </div>

          <hlm-native-select class="w-40" [value]="productStatusFilter()" (valueChange)="onProductStatusFilterChange($event)">
            <option value="all" hlmNativeSelectOption>Todos los estados</option>
            <option value="active" hlmNativeSelectOption>Activos</option>
            <option value="inactive" hlmNativeSelectOption>Inactivos</option>
          </hlm-native-select>
        </div>

        @if (productSelectedIds().size > 0) {
          <div class="bg-muted/50 border-border flex items-center gap-3 rounded-lg border p-3">
            <p class="text-sm font-medium">{{ productSelectedIds().size }} seleccionados</p>
            <button hlmBtn variant="outline" size="sm" (click)="bulkDeactivateProductsConfirmRef.open()">
              Desactivar seleccionados
            </button>
            <button hlmBtn variant="destructive" size="sm" (click)="bulkDeleteProductsConfirmRef.open()">
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
                    <hlm-checkbox [checked]="allProductsSelected()" (checkedChange)="toggleSelectAllProducts($event)" />
                  </th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Producto</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Actualizado</th>
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Módulos</th>
                  <th hlmTh class="w-10 text-right">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @if (loadingProducts()) {
                  <tr hlmTr>
                    <td hlmTd colspan="6"><app-table-skeleton [cols]="6" /></td>
                  </tr>
                } @else {
                @for (product of productsPage().data; track product.id) {
                  <tr hlmTr [attr.data-state]="productSelectedIds().has(product.id) ? 'selected' : null">
                    <td hlmTd>
                      <hlm-checkbox [checked]="productSelectedIds().has(product.id)" (checkedChange)="toggleSelectProduct(product.id)" />
                    </td>
                    <td hlmTd>
                      <div class="flex flex-col">
                        <span class="text-foreground font-medium leading-tight">{{ product.name }}</span>
                        <span class="text-muted-foreground max-w-xs truncate text-xs leading-tight">
                          {{ product.description || 'Sin descripción' }}
                        </span>
                      </div>
                    </td>
                    <td hlmTd>
                      <app-status-chip
                        [label]="product.isActive ? 'Activo' : 'Inactivo'"
                        [chip]="product.isActive ? '--chip-emerald' : null"
                      />
                    </td>
                    <td hlmTd class="text-muted-foreground">{{ product.updatedAt | date: 'dd MMM yyyy' }}</td>
                    <td hlmTd>
                      <span hlmBadge variant="secondary" class="font-normal">
                        {{ product.moduleCount }} {{ product.moduleCount === 1 ? 'módulo' : 'módulos' }}
                      </span>
                    </td>
                    <td hlmTd class="text-right">
                      <button
                        hlmBtn
                        variant="ghost"
                        size="icon"
                        [hlmDropdownMenuTrigger]="productRowMenu"
                        align="end"
                        aria-label="Acciones"
                      >
                        <ng-icon name="lucideEllipsis" />
                      </button>
                      <ng-template #productRowMenu>
                        <hlm-dropdown-menu class="min-w-48 rounded-lg">
                          <button hlmDropdownMenuItem (click)="openEditProduct(product)">
                            <ng-icon name="lucidePencil" />
                            Editar
                          </button>
                          <hlm-dropdown-menu-separator />
                          @if (product.isActive) {
                            <button hlmDropdownMenuItem (click)="deactivateProduct(product)">Desactivar</button>
                          } @else {
                            <button hlmDropdownMenuItem (click)="activateProduct(product)">Activar</button>
                          }
                          <hlm-dropdown-menu-separator />
                          <button hlmDropdownMenuItem variant="destructive" (click)="openDeleteProductConfirm(product)">
                            <ng-icon name="lucideTrash2" />
                            Eliminar
                          </button>
                        </hlm-dropdown-menu>
                      </ng-template>
                    </td>
                  </tr>
                } @empty {
                  <tr hlmTr>
                    <td hlmTd colspan="6" class="text-muted-foreground text-center">
                      Sin productos que coincidan con la búsqueda.
                    </td>
                  </tr>
                }
                }
              </tbody>
            </table>
          </div>

          <hlm-numbered-pagination
            class="border-border border-t"
            [(currentPage)]="productPageNumber"
            [(itemsPerPage)]="productPageSize"
            [totalItems]="productsPage().totalRecords"
          />
        </div>
      }
    </section>

    <!-- Crear módulo -->
    <hlm-dialog #createModuleDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Nuevo módulo</h3>
          <p hlmDialogDescription>Se crea inactivo; actívalo cuando esté listo para cotizarse.</p>
        </hlm-dialog-header>
        <form [formGroup]="createModuleForm" (ngSubmit)="submitCreateModule()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Producto</label>
            <hlm-native-select formControlName="productId">
              <option value="" disabled hlmNativeSelectOption>Selecciona un producto</option>
              @for (product of products(); track product.id) {
                <option [value]="product.id" hlmNativeSelectOption>{{ product.name }}</option>
              }
            </hlm-native-select>
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Nombre</label>
            <input hlmInput placeholder="Control de Acceso" formControlName="name" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Descripción</label>
            <input hlmInput placeholder="Qué incluye este módulo…" formControlName="description" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Precio (USD)</label>
            <input hlmInput type="number" min="0" step="0.01" placeholder="0.00" formControlName="price" />
            <p class="text-muted-foreground text-xs">
              Si luego le asignas una receta en /admin/recetas, el precio se recalculará automáticamente.
            </p>
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="createModuleForm.invalid || submitting()">
              @if (submitting()) { Creando… } @else { Crear módulo }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Editar módulo -->
    <hlm-dialog #editModuleDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Editar módulo</h3>
          <p hlmDialogDescription>{{ selectedModule()?.productName }}</p>
        </hlm-dialog-header>
        <form [formGroup]="editModuleForm" (ngSubmit)="submitEditModule()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Nombre</label>
            <input hlmInput placeholder="Control de Acceso" formControlName="name" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Descripción</label>
            <input hlmInput placeholder="Qué incluye este módulo…" formControlName="description" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Precio (USD)</label>
            <input hlmInput type="number" min="0" step="0.01" formControlName="price" [readOnly]="selectedModule()?.hasRecipe" />
            @if (selectedModule()?.hasRecipe) {
              <p class="text-muted-foreground text-xs">
                Precio calculado por receta (costo de materiales × 1.40). Edítalo desde /admin/recetas.
              </p>
            }
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="editModuleForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Guardar cambios }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Crear producto -->
    <hlm-dialog #createProductDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Nuevo producto</h3>
          <p hlmDialogDescription>
            Es solo la categoría. Se crea inactivo hasta tener descripción y al menos un módulo activo dentro.
          </p>
        </hlm-dialog-header>
        <form [formGroup]="createProductForm" (ngSubmit)="submitCreateProduct()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Nombre</label>
            <input hlmInput placeholder="Ecosistema SpaceIA" formControlName="name" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Descripción</label>
            <input hlmInput placeholder="Qué incluye este producto…" formControlName="description" />
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="createProductForm.invalid || submitting()">
              @if (submitting()) { Creando… } @else { Crear producto }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Editar producto -->
    <hlm-dialog #editProductDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Editar producto</h3>
          <p hlmDialogDescription>Actualiza los datos del producto seleccionado.</p>
        </hlm-dialog-header>
        <form [formGroup]="editProductForm" (ngSubmit)="submitEditProduct()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Nombre</label>
            <input hlmInput placeholder="Ecosistema SpaceIA" formControlName="name" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Descripción</label>
            <input hlmInput placeholder="Qué incluye este producto…" formControlName="description" />
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="editProductForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Guardar cambios }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Confirmar eliminación individual de módulo -->
    <hlm-alert-dialog #deleteModuleConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar este módulo?</h2>
          <p hlmAlertDialogDescription>
            {{ selectedModule()?.name }} dejará de estar disponible para cotizar. Esta acción se puede revertir solo
            desde la base de datos.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmDeleteModule()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar desactivación en lote de módulos -->
    <hlm-alert-dialog #bulkDeactivateModulesConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Desactivar {{ moduleSelectedIds().size }} módulos?</h2>
          <p hlmAlertDialogDescription>Dejarán de aparecer en el cotizador público hasta que se reactiven.</p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction (click)="confirmBulkDeactivateModules()">Desactivar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar eliminación en lote de módulos -->
    <hlm-alert-dialog #bulkDeleteModulesConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar {{ moduleSelectedIds().size }} módulos?</h2>
          <p hlmAlertDialogDescription>Dejarán de estar disponibles para cotizar de forma inmediata.</p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmBulkDeleteModules()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar eliminación individual de producto -->
    <hlm-alert-dialog #deleteProductConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar este producto?</h2>
          <p hlmAlertDialogDescription>
            {{ selectedProduct()?.name }} dejará de estar disponible para cotizar. Esta acción se puede revertir solo
            desde la base de datos.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmDeleteProduct()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar desactivación en lote de productos -->
    <hlm-alert-dialog #bulkDeactivateProductsConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Desactivar {{ productSelectedIds().size }} productos?</h2>
          <p hlmAlertDialogDescription>Sus módulos dejarán de aparecer en el cotizador hasta que se reactiven.</p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction (click)="confirmBulkDeactivateProducts()">Desactivar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar eliminación en lote de productos -->
    <hlm-alert-dialog #bulkDeleteProductsConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar {{ productSelectedIds().size }} productos?</h2>
          <p hlmAlertDialogDescription>Dejarán de estar disponibles de forma inmediata.</p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmBulkDeleteProducts()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class AdminProducts {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly modulesService = inject(ProductModulesService);

  @ViewChild('createModuleDialogRef') private createModuleDialogRef!: HlmDialog;
  @ViewChild('editModuleDialogRef') private editModuleDialogRef!: HlmDialog;
  @ViewChild('createProductDialogRef') private createProductDialogRef!: HlmDialog;
  @ViewChild('editProductDialogRef') private editProductDialogRef!: HlmDialog;
  @ViewChild('deleteModuleConfirmRef') protected deleteModuleConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeactivateModulesConfirmRef') protected bulkDeactivateModulesConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeleteModulesConfirmRef') protected bulkDeleteModulesConfirmRef!: HlmAlertDialog;
  @ViewChild('deleteProductConfirmRef') protected deleteProductConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeactivateProductsConfirmRef') protected bulkDeactivateProductsConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeleteProductsConfirmRef') protected bulkDeleteProductsConfirmRef!: HlmAlertDialog;

  protected readonly activeTab = signal<CatalogTab>('modules');
  protected readonly products = signal<ProductResponse[]>([]);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly loadingModules = signal(true);
  protected readonly loadingProducts = signal(true);

  // ── Estado tab Módulos ──────────────────────────────────────────────
  protected readonly moduleSearch = signal('');
  protected readonly moduleStatusFilter = signal<StatusFilter>('all');
  protected readonly moduleProductFilter = signal('');
  protected readonly modulePageNumber = signal(1);
  protected readonly modulePageSize = signal(10);
  protected readonly modulesPage = signal<PagedResult<ProductModuleResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });
  protected readonly moduleSelectedIds = signal<Set<string>>(new Set());
  protected readonly selectedModule = signal<ProductModuleResponse | null>(null);

  protected readonly allModulesSelected = computed(() => {
    const data = this.modulesPage().data;
    return data.length > 0 && data.every((m) => this.moduleSelectedIds().has(m.id));
  });

  // ── Estado tab Productos ────────────────────────────────────────────
  protected readonly productSearch = signal('');
  protected readonly productStatusFilter = signal<StatusFilter>('all');
  protected readonly productPageNumber = signal(1);
  protected readonly productPageSize = signal(10);
  protected readonly productsPage = signal<PagedResult<ProductResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });
  protected readonly productSelectedIds = signal<Set<string>>(new Set());
  protected readonly selectedProduct = signal<ProductResponse | null>(null);

  protected readonly allProductsSelected = computed(() => {
    const data = this.productsPage().data;
    return data.length > 0 && data.every((p) => this.productSelectedIds().has(p.id));
  });

  // ── Formularios ──────────────────────────────────────────────────────
  protected readonly createModuleForm = this.fb.nonNullable.group({
    productId: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  protected readonly editModuleForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  protected readonly createProductForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  protected readonly editProductForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  private moduleSearchTimeout?: ReturnType<typeof setTimeout>;
  private productSearchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    // Catálogo de productos para el filtro de la tab Módulos y el select de los diálogos.
    this.productsService.listAll(false).subscribe((products) => this.products.set(products));

    // Un effect por tab: cada uno solo dispara su propia recarga cuando esa tab está activa,
    // pero sigue leyendo sus signals aunque esté inactiva para no perder la dependencia.
    effect(() => {
      const tab = this.activeTab();
      this.moduleSearch();
      this.moduleStatusFilter();
      this.moduleProductFilter();
      this.modulePageNumber();
      this.modulePageSize();
      if (tab === 'modules') this.reloadModules();
    });

    effect(() => {
      const tab = this.activeTab();
      this.productSearch();
      this.productStatusFilter();
      this.productPageNumber();
      this.productPageSize();
      if (tab === 'products') this.reloadProducts();
    });
  }

  protected onTabChange(tab: string): void {
    this.activeTab.set(tab as CatalogTab);
  }

  // ── Handlers tab Módulos ────────────────────────────────────────────
  protected onModuleSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.moduleSearchTimeout);
    this.moduleSearchTimeout = setTimeout(() => {
      this.moduleSearch.set(value);
      this.modulePageNumber.set(1);
    }, 300);
  }

  protected onModuleStatusFilterChange(value: string | null | undefined): void {
    this.moduleStatusFilter.set((value ?? 'all') as StatusFilter);
    this.modulePageNumber.set(1);
  }

  protected onModuleProductFilterChange(value: string | null | undefined): void {
    this.moduleProductFilter.set(value ?? '');
    this.modulePageNumber.set(1);
  }

  protected toggleSelectModule(id: string): void {
    const next = new Set(this.moduleSelectedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.moduleSelectedIds.set(next);
  }

  protected toggleSelectAllModules(checked: boolean): void {
    if (!checked) {
      this.moduleSelectedIds.set(new Set());
      return;
    }
    this.moduleSelectedIds.set(new Set(this.modulesPage().data.map((m) => m.id)));
  }

  protected openCreateModule(): void {
    this.formError.set(null);
    this.createModuleForm.reset({ productId: '', name: '', description: '', price: 0 });
    this.createModuleDialogRef.open();
  }

  protected openEditModule(module: ProductModuleResponse): void {
    this.formError.set(null);
    this.selectedModule.set(module);
    this.editModuleForm.reset({ name: module.name, description: module.description, price: module.price });
    this.editModuleDialogRef.open();
  }

  protected openDeleteModuleConfirm(module: ProductModuleResponse): void {
    this.selectedModule.set(module);
    this.deleteModuleConfirmRef.open();
  }

  protected submitCreateModule(): void {
    if (this.createModuleForm.invalid) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.modulesService.create(this.createModuleForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.createModuleDialogRef.close();
        this.reloadModules();
        this.refreshProductCatalog();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo crear el módulo.'));
      },
    });
  }

  protected submitEditModule(): void {
    const module = this.selectedModule();
    if (this.editModuleForm.invalid || !module) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.modulesService.update(module.id, this.editModuleForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.editModuleDialogRef.close();
        this.reloadModules();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo actualizar el módulo.'));
      },
    });
  }

  protected activateModule(module: ProductModuleResponse): void {
    this.modulesService.activate(module.id).subscribe({
      next: () => this.reloadModules(),
      error: (err: HttpErrorResponse) =>
        toast.error(this.extractError(err, 'No se pudo activar el módulo.')),
    });
  }

  protected deactivateModule(module: ProductModuleResponse): void {
    this.modulesService.deactivate(module.id).subscribe(() => this.reloadModules());
  }

  protected confirmDeleteModule(): void {
    const module = this.selectedModule();
    if (!module) return;
    this.modulesService.remove(module.id).subscribe(() => {
      this.deleteModuleConfirmRef.close();
      this.reloadModules();
      this.refreshProductCatalog();
    });
  }

  protected confirmBulkDeactivateModules(): void {
    const ids = Array.from(this.moduleSelectedIds());
    this.runBulk(ids, (id) => this.modulesService.deactivate(id), () => {
      this.bulkDeactivateModulesConfirmRef.close();
      this.moduleSelectedIds.set(new Set());
      this.reloadModules();
    });
  }

  protected confirmBulkDeleteModules(): void {
    const ids = Array.from(this.moduleSelectedIds());
    this.runBulk(ids, (id) => this.modulesService.remove(id), () => {
      this.bulkDeleteModulesConfirmRef.close();
      this.moduleSelectedIds.set(new Set());
      this.reloadModules();
      this.refreshProductCatalog();
    });
  }

  // ── Handlers tab Productos ──────────────────────────────────────────
  protected onProductSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.productSearchTimeout);
    this.productSearchTimeout = setTimeout(() => {
      this.productSearch.set(value);
      this.productPageNumber.set(1);
    }, 300);
  }

  protected onProductStatusFilterChange(value: string | null | undefined): void {
    this.productStatusFilter.set((value ?? 'all') as StatusFilter);
    this.productPageNumber.set(1);
  }

  protected toggleSelectProduct(id: string): void {
    const next = new Set(this.productSelectedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.productSelectedIds.set(next);
  }

  protected toggleSelectAllProducts(checked: boolean): void {
    if (!checked) {
      this.productSelectedIds.set(new Set());
      return;
    }
    this.productSelectedIds.set(new Set(this.productsPage().data.map((p) => p.id)));
  }

  protected openCreateProduct(): void {
    this.formError.set(null);
    this.createProductForm.reset({ name: '', description: '' });
    this.createProductDialogRef.open();
  }

  protected openEditProduct(product: ProductResponse): void {
    this.formError.set(null);
    this.selectedProduct.set(product);
    this.editProductForm.reset({ name: product.name, description: product.description });
    this.editProductDialogRef.open();
  }

  protected openDeleteProductConfirm(product: ProductResponse): void {
    this.selectedProduct.set(product);
    this.deleteProductConfirmRef.open();
  }

  protected submitCreateProduct(): void {
    if (this.createProductForm.invalid) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.productsService.create(this.createProductForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.createProductDialogRef.close();
        this.reloadProducts();
        this.refreshProductCatalog();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo crear el producto.'));
      },
    });
  }

  protected submitEditProduct(): void {
    const product = this.selectedProduct();
    if (this.editProductForm.invalid || !product) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.productsService.update(product.id, this.editProductForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.editProductDialogRef.close();
        this.reloadProducts();
        this.refreshProductCatalog();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo actualizar el producto.'));
      },
    });
  }

  protected activateProduct(product: ProductResponse): void {
    this.productsService.activate(product.id).subscribe({
      next: () => this.reloadProducts(),
      error: (err: HttpErrorResponse) =>
        toast.error(this.extractError(err, 'No se pudo activar el producto.')),
    });
  }

  protected deactivateProduct(product: ProductResponse): void {
    this.productsService.deactivate(product.id).subscribe(() => this.reloadProducts());
  }

  protected confirmDeleteProduct(): void {
    const product = this.selectedProduct();
    if (!product) return;
    this.productsService.remove(product.id).subscribe(() => {
      this.deleteProductConfirmRef.close();
      this.reloadProducts();
      this.refreshProductCatalog();
    });
  }

  protected confirmBulkDeactivateProducts(): void {
    this.productsService.bulkSetStatus(Array.from(this.productSelectedIds()), false).subscribe((result) => {
      this.bulkDeactivateProductsConfirmRef.close();
      this.productSelectedIds.set(new Set());
      this.reportBulkResult(result.affected, result.skipped);
      this.reloadProducts();
    });
  }

  protected confirmBulkDeleteProducts(): void {
    this.productsService.bulkDelete(Array.from(this.productSelectedIds())).subscribe((result) => {
      this.bulkDeleteProductsConfirmRef.close();
      this.productSelectedIds.set(new Set());
      this.reportBulkResult(result.affected, result.skipped);
      this.reloadProducts();
      this.refreshProductCatalog();
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  private runBulk(ids: string[], action: (id: string) => import('rxjs').Observable<unknown>, onDone: () => void): void {
    let pending = ids.length;
    if (pending === 0) {
      onDone();
      return;
    }
    ids.forEach((id) =>
      action(id).subscribe(() => {
        if (--pending === 0) onDone();
      }),
    );
  }

  private reportBulkResult(affected: number, skipped: string[]): void {
    // Nunca fallar en silencio en acciones en lote: si algo se omitió, se explica por qué.
    if (skipped.length > 0) {
      toast.error(`${affected} aplicados. Omitidos: ${skipped.join(' ')}`);
    } else {
      toast.success(`${affected} aplicados.`);
    }
  }

  private refreshProductCatalog(): void {
    // Recarga el catálogo usado por el filtro/select de productos (moduleCount, altas/bajas).
    this.productsService.listAll(false).subscribe((products) => this.products.set(products));
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }

  private reloadModules(): void {
    this.loadingModules.set(true);
    this.modulesService
      .list({
        pageNumber: this.modulePageNumber(),
        pageSize: this.modulePageSize(),
        productId: this.moduleProductFilter() || undefined,
        search: this.moduleSearch() || undefined,
        isActive: this.moduleStatusFilter() === 'all' ? undefined : this.moduleStatusFilter() === 'active',
      })
      .subscribe((result) => {
        this.modulesPage.set(result);
        this.loadingModules.set(false);
      });
  }

  private reloadProducts(): void {
    this.loadingProducts.set(true);
    this.productsService
      .list({
        pageNumber: this.productPageNumber(),
        pageSize: this.productPageSize(),
        search: this.productSearch() || undefined,
        isActive: this.productStatusFilter() === 'all' ? undefined : this.productStatusFilter() === 'active',
      })
      .subscribe((result) => {
        this.productsPage.set(result);
        this.loadingProducts.set(false);
      });
  }
}
