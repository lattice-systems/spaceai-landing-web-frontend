import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucidePencil, lucideSearch, lucideTrash2 } from '@ng-icons/lucide';
import { HlmAlertDialogImports, HlmAlertDialog } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { MaterialResponse } from '../../../core/models/material.model';
import { PagedResult } from '../../../core/models/paged-result.model';
import { ProductModuleResponse } from '../../../core/models/product-module.model';
import { ProductRecipeResponse } from '../../../core/models/product-recipe.model';
import { MaterialsService } from '../../../core/services/materials.service';
import { ProductModulesService } from '../../../core/services/product-modules.service';
import { ProductRecipesService } from '../../../core/services/product-recipes.service';

@Component({
  selector: 'app-admin-recipes',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    HlmNativeSelectImports,
    HlmTableImports,
    HlmDropdownMenuImports,
    HlmDialogImports,
    HlmAlertDialogImports,
    HlmPaginationImports,
    DecimalPipe,
  ],
  providers: [provideIcons({ lucideEllipsis, lucidePencil, lucideSearch, lucideTrash2 })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">
          Recetas de producto
        </h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Explosión de materiales (BOM) por módulo. El precio de venta del módulo se recalcula
          automáticamente a partir del costo de sus materiales + margen.
        </p>
      </div>

      <section class="bg-muted/50 rounded-xl p-5">
        <h2 class="text-foreground mb-4 text-base font-semibold">Precio calculado por módulo</h2>
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Módulo</th>
                <th hlmTh>Precio de venta</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (module of modules(); track module.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{ module.name }}</td>
                  <td hlmTd class="text-muted-foreground">{{ module.price | number: '1.2-2' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="bg-muted/50 rounded-xl p-5">
        <h2 class="text-foreground mb-4 text-base font-semibold">Agregar material a receta</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3 sm:grid-cols-4">
          <hlm-native-select formControlName="productModuleId">
            <option value="" disabled hlmNativeSelectOption>Módulo</option>
            @for (module of modules(); track module.id) {
              <option [value]="module.id" hlmNativeSelectOption>{{ module.name }}</option>
            }
          </hlm-native-select>
          <hlm-native-select formControlName="materialId">
            <option value="" disabled hlmNativeSelectOption>Material</option>
            @for (material of materials(); track material.id) {
              <option [value]="material.id" hlmNativeSelectOption>
                {{ material.name }} ({{ material.unitCost | number: '1.2-2' }})
              </option>
            }
          </hlm-native-select>
          <input hlmInput type="number" min="1" placeholder="Cantidad" formControlName="quantity" />
          <button hlmBtn type="submit" [disabled]="form.invalid || submitting()">
            @if (submitting()) { Guardando… } @else { Agregar }
          </button>
        </form>
        @if (createError()) {
          <p class="text-destructive mt-2 text-sm">{{ createError() }}</p>
        }
      </section>

      <section class="bg-muted/50 rounded-xl p-5">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <div class="relative min-w-56 flex-1">
            <ng-icon
              name="lucideSearch"
              class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base"
            />
            <input
              hlmInput
              class="bg-card pl-9"
              placeholder="Buscar por módulo o material…"
              [value]="search()"
              (input)="onSearchInput($event)"
            />
          </div>
          <hlm-native-select class="bg-card w-56" [value]="moduleFilter()" (valueChange)="onModuleFilterChange($event)">
            <option value="" hlmNativeSelectOption>Todos los módulos</option>
            @for (module of modules(); track module.id) {
              <option [value]="module.id" hlmNativeSelectOption>{{ module.name }}</option>
            }
          </hlm-native-select>
        </div>

        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Módulo</th>
                <th hlmTh>Material</th>
                <th hlmTh>Cantidad</th>
                <th hlmTh>Costo unitario</th>
                <th hlmTh>Subtotal</th>
                <th hlmTh class="w-10 text-right">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (recipe of page().data; track recipe.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{ recipe.productModuleName }}</td>
                  <td hlmTd class="text-muted-foreground">{{ recipe.materialName }}</td>
                  <td hlmTd class="text-muted-foreground">{{ recipe.quantity }}</td>
                  <td hlmTd class="text-muted-foreground">
                    {{ recipe.unitCost | number: '1.2-2' }}
                  </td>
                  <td hlmTd class="text-muted-foreground">
                    {{ recipe.subtotal | number: '1.2-2' }}
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
                      <hlm-dropdown-menu class="min-w-44 rounded-lg">
                        <button hlmDropdownMenuItem (click)="openEdit(recipe)">
                          <ng-icon name="lucidePencil" />
                          Editar cantidad
                        </button>
                        <hlm-dropdown-menu-separator />
                        <button hlmDropdownMenuItem variant="destructive" (click)="openDeleteConfirm(recipe)">
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
                    Sin recetas que coincidan con la búsqueda.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <hlm-numbered-pagination
          class="mt-3"
          [(currentPage)]="pageNumber"
          [(itemsPerPage)]="pageSize"
          [totalItems]="page().totalRecords"
        />
      </section>
    </section>

    <!-- Editar cantidad -->
    <hlm-dialog #editDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-md">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Editar cantidad</h3>
          <p hlmDialogDescription>
            {{ selectedRecipe()?.materialName }} en {{ selectedRecipe()?.productModuleName }}
          </p>
        </hlm-dialog-header>
        <form [formGroup]="editForm" (ngSubmit)="submitEdit()" class="grid gap-4 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Cantidad</label>
            <input hlmInput type="number" min="1" formControlName="quantity" />
            <p class="text-muted-foreground text-xs">
              El costo unitario se vuelve a leer del material al guardar, y el precio del
              módulo se recalcula.
            </p>
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

    <!-- Confirmar eliminación -->
    <hlm-alert-dialog #deleteConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar esta fila de receta?</h2>
          <p hlmAlertDialogDescription>
            {{ selectedRecipe()?.materialName }} dejará de contar en el costo de
            {{ selectedRecipe()?.productModuleName }}, y su precio de venta se recalculará.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmDelete()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class AdminRecipes {
  private readonly fb = inject(FormBuilder);
  private readonly recipesService = inject(ProductRecipesService);
  private readonly modulesService = inject(ProductModulesService);
  private readonly materialsService = inject(MaterialsService);

  @ViewChild('editDialogRef') private editDialogRef!: HlmDialog;
  @ViewChild('deleteConfirmRef') protected deleteConfirmRef!: HlmAlertDialog;

  protected readonly submitting = signal(false);
  protected readonly createError = signal<string | null>(null);
  protected readonly formError = signal<string | null>(null);
  protected readonly modules = signal<ProductModuleResponse[]>([]);
  protected readonly materials = signal<MaterialResponse[]>([]);
  protected readonly selectedRecipe = signal<ProductRecipeResponse | null>(null);

  protected readonly search = signal('');
  protected readonly moduleFilter = signal('');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<ProductRecipeResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });

  protected readonly form = this.fb.nonNullable.group({
    productModuleId: ['', Validators.required],
    materialId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  protected readonly editForm = this.fb.nonNullable.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    this.materialsService.listAll().subscribe((data) => this.materials.set(data));
    // Admin ve todos los módulos (incluidos inactivos) para poder asignarles receta antes de publicarlos.
    this.modulesService.listAll(false).subscribe((data) => this.modules.set(data));

    effect(() => {
      this.search();
      this.moduleFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.search.set(value);
      this.pageNumber.set(1);
    }, 300);
  }

  protected onModuleFilterChange(value: string | null | undefined): void {
    this.moduleFilter.set(value ?? '');
    this.pageNumber.set(1);
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.createError.set(null);
    this.recipesService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset({ productModuleId: '', materialId: '', quantity: 1 });
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.createError.set(this.extractError(err, 'No se pudo agregar el material a la receta.'));
      },
    });
  }

  protected openEdit(recipe: ProductRecipeResponse): void {
    this.formError.set(null);
    this.selectedRecipe.set(recipe);
    this.editForm.reset({ quantity: recipe.quantity });
    this.editDialogRef.open();
  }

  protected submitEdit(): void {
    const recipe = this.selectedRecipe();
    if (this.editForm.invalid || !recipe) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.recipesService.update(recipe.id, this.editForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.editDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo actualizar la cantidad.'));
      },
    });
  }

  protected openDeleteConfirm(recipe: ProductRecipeResponse): void {
    this.selectedRecipe.set(recipe);
    this.deleteConfirmRef.open();
  }

  protected confirmDelete(): void {
    const recipe = this.selectedRecipe();
    if (!recipe) return;
    this.recipesService.remove(recipe.id).subscribe(() => {
      this.deleteConfirmRef.close();
      this.reload();
    });
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }

  private reload(): void {
    this.recipesService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        productModuleId: this.moduleFilter() || undefined,
      })
      .subscribe((result) => this.page.set(result));

    // El precio recalculado del módulo se refleja aquí tras editar/eliminar una receta.
    this.modulesService.listAll(false).subscribe((data) => this.modules.set(data));
  }
}
