import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { MaterialResponse } from '../../../core/models/material.model';
import { ProductModuleResponse } from '../../../core/models/product-module.model';
import { ProductRecipeResponse } from '../../../core/models/product-recipe.model';
import { MaterialsService } from '../../../core/services/materials.service';
import { ProductModulesService } from '../../../core/services/product-modules.service';
import { ProductRecipesService } from '../../../core/services/product-recipes.service';

@Component({
  selector: 'app-admin-recipes',
  imports: [ReactiveFormsModule, HlmButtonImports, HlmInputImports, DecimalPipe],
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
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-muted-foreground border-border border-b">
              <th class="pb-3 font-medium">Módulo</th>
              <th class="pb-3 font-medium">Precio de venta</th>
            </tr>
          </thead>
          <tbody>
            @for (module of modules(); track module.id) {
              <tr class="border-border/60 border-b last:border-0">
                <td class="text-foreground py-3 font-medium">{{ module.name }}</td>
                <td class="text-muted-foreground py-3">{{ module.price | number: '1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>

      <section class="bg-muted/50 rounded-xl p-5">
        <h2 class="text-foreground mb-4 text-base font-semibold">Agregar material a receta</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3 sm:grid-cols-4">
          <select hlmInput formControlName="productModuleId">
            <option value="" disabled>Módulo</option>
            @for (module of modules(); track module.id) {
              <option [value]="module.id">{{ module.name }}</option>
            }
          </select>
          <select hlmInput formControlName="materialId">
            <option value="" disabled>Material</option>
            @for (material of materials(); track material.id) {
              <option [value]="material.id">{{ material.name }} ({{ material.unitCost | number: '1.2-2' }})</option>
            }
          </select>
          <input hlmInput type="number" min="1" placeholder="Cantidad" formControlName="quantity" />
          <button hlmBtn type="submit" [disabled]="form.invalid || submitting()">
            @if (submitting()) { Guardando… } @else { Agregar }
          </button>
        </form>
      </section>

      <section class="bg-muted/50 overflow-x-auto rounded-xl p-5">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-muted-foreground border-border border-b">
              <th class="pb-3 font-medium">Módulo</th>
              <th class="pb-3 font-medium">Material</th>
              <th class="pb-3 font-medium">Cantidad</th>
              <th class="pb-3 font-medium">Costo unitario</th>
              <th class="pb-3 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            @for (recipe of recipes(); track recipe.id) {
              <tr class="border-border/60 border-b last:border-0">
                <td class="text-foreground py-3 font-medium">{{ recipe.productModuleName }}</td>
                <td class="text-muted-foreground py-3">{{ recipe.materialName }}</td>
                <td class="text-muted-foreground py-3">{{ recipe.quantity }}</td>
                <td class="text-muted-foreground py-3">{{ recipe.unitCost | number: '1.2-2' }}</td>
                <td class="text-muted-foreground py-3">{{ recipe.subtotal | number: '1.2-2' }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="text-muted-foreground py-6 text-center">
                  Sin recetas registradas.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>
  `,
})
export class AdminRecipes {
  private readonly fb = inject(FormBuilder);
  private readonly recipesService = inject(ProductRecipesService);
  private readonly modulesService = inject(ProductModulesService);
  private readonly materialsService = inject(MaterialsService);

  protected readonly submitting = signal(false);
  protected readonly recipes = signal<ProductRecipeResponse[]>([]);
  protected readonly modules = signal<ProductModuleResponse[]>([]);
  protected readonly materials = signal<MaterialResponse[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    productModuleId: ['', Validators.required],
    materialId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.reload();
    this.materialsService.list().subscribe((data) => this.materials.set(data));
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.recipesService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset({ productModuleId: '', materialId: '', quantity: 1 });
        this.reload();
      },
      error: () => this.submitting.set(false),
    });
  }

  private reload(): void {
    this.recipesService.list().subscribe((data) => this.recipes.set(data));
    this.modulesService.list().subscribe((data) => this.modules.set(data));
  }
}
