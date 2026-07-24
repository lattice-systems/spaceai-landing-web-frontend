import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucidePencil, lucidePlus, lucideSearch, lucideTrash2 } from '@ng-icons/lucide';
import { HlmAlertDialogImports, HlmAlertDialog } from '@spartan-ng/helm/alert-dialog';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { MaterialResponse } from '../../../core/models/material.model';
import { ProductModuleResponse } from '../../../core/models/product-module.model';
import { ProductRecipeResponse } from '../../../core/models/product-recipe.model';
import { MaterialsService } from '../../../core/services/materials.service';
import { ProductModulesService } from '../../../core/services/product-modules.service';
import { ProductRecipesService } from '../../../core/services/product-recipes.service';

interface RecipeGroup {
  module: ProductModuleResponse;
  rows: ProductRecipeResponse[];
}

@Component({
  selector: 'app-admin-recipes',
  imports: [
    ReactiveFormsModule,
    NgIcon,
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
  ],
  providers: [provideIcons({ lucideEllipsis, lucidePencil, lucidePlus, lucideSearch, lucideTrash2 })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Recetas de producto</h1>
          <p class="text-muted-foreground text-sm">
            Materiales por módulo (BOM). El precio de venta se recalcula solo al editar.
          </p>
        </div>

        <button hlmBtn size="sm" (click)="openCreate()">
          <ng-icon name="lucidePlus" class="mr-1" />
          Agregar material
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
            placeholder="Buscar por módulo o material…"
            [value]="search()"
            (input)="onSearchInput($event)"
          />
        </div>

        <hlm-native-select class="w-56" [value]="moduleFilter()" (valueChange)="onModuleFilterChange($event)">
          <option value="" hlmNativeSelectOption>Todos los módulos</option>
          @for (module of modules(); track module.id) {
            <option [value]="module.id" hlmNativeSelectOption>{{ module.name }}</option>
          }
        </hlm-native-select>
      </div>

      @if (createError()) {
        <p class="text-destructive text-sm">{{ createError() }}</p>
      }

      <!-- Una tarjeta por módulo: deja clarísimo qué receta es de cuál. -->
      <div class="grid gap-3">
        @for (group of groups(); track group.module.id) {
          <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
            <div class="border-border flex items-center justify-between border-b p-4">
              <div>
                <h3 class="text-foreground font-medium leading-tight">{{ group.module.name }}</h3>
                <p class="text-muted-foreground text-xs leading-tight">
                  {{ group.rows.length }} {{ group.rows.length === 1 ? 'material' : 'materiales' }}
                </p>
              </div>
              <span hlmBadge variant="secondary" class="font-normal">
                Precio: {{ group.module.price | currency: 'USD' }}
              </span>
            </div>

            <div hlmTableContainer>
              <table hlmTable>
                <thead hlmTHead>
                  <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                    <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Material</th>
                    <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Cantidad</th>
                    <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Costo unitario</th>
                    <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Subtotal</th>
                    <th hlmTh class="w-10 text-right">
                      <span class="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody hlmTBody>
                  @for (recipe of group.rows; track recipe.id) {
                    <tr hlmTr>
                      <td hlmTd class="font-medium">{{ recipe.materialName }}</td>
                      <td hlmTd class="text-muted-foreground">{{ recipe.quantity }}</td>
                      <td hlmTd class="text-muted-foreground">{{ recipe.unitCost | currency: 'USD' }}</td>
                      <td hlmTd class="text-muted-foreground">{{ recipe.subtotal | currency: 'USD' }}</td>
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
                      <td hlmTd colspan="5" class="text-muted-foreground text-center">
                        Sin materiales en este módulo todavía.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        } @empty {
          <p class="text-muted-foreground text-center text-sm">Sin módulos que coincidan con la búsqueda.</p>
        }
      </div>
    </section>

    <!-- Agregar material a receta -->
    <hlm-dialog #createDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Agregar material a receta</h3>
          <p hlmDialogDescription>El costo unitario se toma directo del maestro de Materiales.</p>
        </hlm-dialog-header>
        <form [formGroup]="createForm" (ngSubmit)="submitCreate()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Módulo</label>
            <hlm-native-select formControlName="productModuleId">
              <option value="" disabled hlmNativeSelectOption>Selecciona un módulo</option>
              @for (module of modules(); track module.id) {
                <option [value]="module.id" hlmNativeSelectOption>{{ module.name }}</option>
              }
            </hlm-native-select>
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Material</label>
            <hlm-native-select formControlName="materialId">
              <option value="" disabled hlmNativeSelectOption>Selecciona un material</option>
              @for (material of materials(); track material.id) {
                <option [value]="material.id" hlmNativeSelectOption>
                  {{ material.name }} ({{ material.unitCost | currency: 'USD' }})
                </option>
              }
            </hlm-native-select>
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Cantidad</label>
            <input hlmInput type="number" min="1" formControlName="quantity" />
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="createForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Agregar }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

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

  @ViewChild('createDialogRef') private createDialogRef!: HlmDialog;
  @ViewChild('editDialogRef') private editDialogRef!: HlmDialog;
  @ViewChild('deleteConfirmRef') protected deleteConfirmRef!: HlmAlertDialog;

  protected readonly submitting = signal(false);
  protected readonly createError = signal<string | null>(null);
  protected readonly formError = signal<string | null>(null);
  protected readonly modules = signal<ProductModuleResponse[]>([]);
  protected readonly materials = signal<MaterialResponse[]>([]);
  protected readonly recipes = signal<ProductRecipeResponse[]>([]);
  protected readonly selectedRecipe = signal<ProductRecipeResponse | null>(null);

  protected readonly search = signal('');
  protected readonly moduleFilter = signal('');

  // Agrupa por módulo (para separar visualmente qué receta es de cuál) respetando los
  // filtros de búsqueda/módulo. El dataset es chico (~16 filas) así que se agrupa en cliente.
  protected readonly groups = computed<RecipeGroup[]>(() => {
    const term = this.search().trim().toLowerCase();
    const moduleId = this.moduleFilter();
    const recipes = this.recipes();

    return this.modules()
      .filter((m) => !moduleId || m.id === moduleId)
      .map((module) => ({
        module,
        rows: recipes.filter((r) => {
          if (r.productModuleId !== module.id) return false;
          if (!term) return true;
          return r.materialName.toLowerCase().includes(term) || module.name.toLowerCase().includes(term);
        }),
      }))
      .filter((group) => !this.search().trim() || group.rows.length > 0);
  });

  protected readonly createForm = this.fb.nonNullable.group({
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
    this.reload();
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.search.set(value), 300);
  }

  protected onModuleFilterChange(value: string | null | undefined): void {
    this.moduleFilter.set(value ?? '');
  }

  protected openCreate(): void {
    this.formError.set(null);
    this.createForm.reset({ productModuleId: '', materialId: '', quantity: 1 });
    this.createDialogRef.open();
  }

  protected submitCreate(): void {
    if (this.createForm.invalid) return;
    this.submitting.set(true);
    this.createError.set(null);
    this.formError.set(null);

    this.recipesService.create(this.createForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.createDialogRef.close();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo agregar el material a la receta.'));
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
    // Admin ve todos los módulos (incluidos inactivos) para poder asignarles receta antes de publicarlos.
    this.modulesService.listAll(false).subscribe((data) => this.modules.set(data));
    this.recipesService.list({ pageNumber: 1, pageSize: 200 }).subscribe((result) => this.recipes.set(result.data));
  }
}
