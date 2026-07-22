import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { MaterialResponse } from '../../../core/models/material.model';
import { MaterialsService } from '../../../core/services/materials.service';

@Component({
  selector: 'app-admin-materials',
  imports: [ReactiveFormsModule, HlmButtonImports, HlmInputImports, HlmTableImports, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">Materia prima</h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Catálogo de materiales con su costo unitario — base del costeo de cada módulo.
        </p>
      </div>

      <section class="bg-muted/50 rounded-xl p-5">
        <h2 class="text-foreground mb-4 text-base font-semibold">Nuevo material</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3 sm:grid-cols-3">
          <input hlmInput placeholder="Nombre" formControlName="name" />
          <input hlmInput placeholder="Descripción" formControlName="description" />
          <input hlmInput placeholder="Unidad (pieza, kg...)" formControlName="unitOfMeasure" />
          <input hlmInput type="number" step="0.01" placeholder="Costo unitario" formControlName="unitCost" />
          <input hlmInput type="number" placeholder="Stock actual" formControlName="currentStock" />
          <input hlmInput type="number" placeholder="Stock mínimo" formControlName="minimumStock" />
          <button hlmBtn type="submit" [disabled]="form.invalid || submitting()" class="sm:col-span-3">
            @if (submitting()) { Guardando… } @else { Agregar material }
          </button>
        </form>
      </section>

      <section class="bg-muted/50 rounded-xl p-5">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Nombre</th>
                <th hlmTh>Unidad</th>
                <th hlmTh>Costo unitario</th>
                <th hlmTh>Stock</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (material of materials(); track material.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{ material.name }}</td>
                  <td hlmTd class="text-muted-foreground">{{ material.unitOfMeasure }}</td>
                  <td hlmTd class="text-muted-foreground">
                    {{ material.unitCost | number: '1.2-2' }}
                  </td>
                  <td hlmTd class="text-muted-foreground">
                    {{ material.currentStock }} (mín. {{ material.minimumStock }})
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="4" class="text-muted-foreground text-center">
                    Sin materiales registrados.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `,
})
export class AdminMaterials {
  private readonly fb = inject(FormBuilder);
  private readonly materialsService = inject(MaterialsService);

  protected readonly submitting = signal(false);
  protected readonly materials = signal<MaterialResponse[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    unitOfMeasure: ['', Validators.required],
    unitCost: [0, [Validators.required, Validators.min(0)]],
    currentStock: [0, [Validators.required, Validators.min(0)]],
    minimumStock: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    this.reload();
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.materialsService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset({
          name: '',
          description: '',
          unitOfMeasure: '',
          unitCost: 0,
          currentStock: 0,
          minimumStock: 0,
        });
        this.reload();
      },
      error: () => this.submitting.set(false),
    });
  }

  private reload(): void {
    this.materialsService.list().subscribe((data) => this.materials.set(data));
  }
}
