import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ProviderResponse } from '../../../core/models/provider.model';
import { PurchaseResponse } from '../../../core/models/purchase.model';
import { ProvidersService } from '../../../core/services/providers.service';
import { PurchasesService } from '../../../core/services/purchases.service';

@Component({
  selector: 'app-admin-purchases',
  imports: [
    ReactiveFormsModule,
    HlmButtonImports,
    HlmInputImports,
    HlmNativeSelectImports,
    HlmTableImports,
    NgIcon,
    DecimalPipe,
  ],
  providers: [provideIcons({ lucidePlus, lucideTrash2 })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">
          Compras a proveedores
        </h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Registro de compras de materia prima a proveedores.
        </p>
      </div>

      <section class="bg-muted/50 rounded-xl p-5">
        <h2 class="text-foreground mb-4 text-base font-semibold">Nueva compra</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-4">
          <div class="max-w-sm">
            <hlm-native-select formControlName="providerId">
              <option value="" disabled hlmNativeSelectOption>Proveedor</option>
              @for (provider of providers(); track provider.id) {
                <option [value]="provider.id" hlmNativeSelectOption>{{ provider.name }}</option>
              }
            </hlm-native-select>
          </div>

          <div class="grid gap-3">
            @for (item of items.controls; track $index; let i = $index) {
              <div [formGroup]="item" class="grid items-center gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                <input hlmInput placeholder="Material" formControlName="materialName" />
                <input hlmInput type="number" min="1" placeholder="Cantidad" formControlName="quantity" />
                <input hlmInput type="number" step="0.01" min="0" placeholder="Costo unitario" formControlName="unitCost" />
                <span class="text-muted-foreground text-sm">
                  Subtotal: {{ subtotalOf(item) | number: '1.2-2' }}
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
              Total estimado: {{ estimatedTotal() | number: '1.2-2' }}
            </p>
          </div>

          <button hlmBtn type="submit" [disabled]="form.invalid || submitting()" class="w-fit">
            @if (submitting()) { Guardando… } @else { Registrar compra }
          </button>
        </form>
      </section>

      <section class="bg-muted/50 rounded-xl p-5">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Proveedor</th>
                <th hlmTh>Total</th>
                <th hlmTh>Estado</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (purchase of purchases(); track purchase.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{ providerName(purchase.providerId) }}</td>
                  <td hlmTd>{{ purchase.total | number: '1.2-2' }}</td>
                  <td hlmTd>{{ purchase.status }}</td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="3" class="text-muted-foreground text-center">
                    Sin compras registradas.
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
export class AdminPurchases {
  private readonly fb = inject(FormBuilder);
  private readonly providersService = inject(ProvidersService);
  private readonly purchasesService = inject(PurchasesService);

  protected readonly submitting = signal(false);
  protected readonly providers = signal<ProviderResponse[]>([]);
  protected readonly purchases = signal<PurchaseResponse[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    providerId: ['', Validators.required],
    items: this.fb.array([this.newItem()]),
  });

  protected get items() {
    return this.form.controls.items;
  }

  // Método plano (no computed): un FormArray no es un signal, así que un computed() nunca
  // volvería a evaluarse al teclear. OnPush sí corre change detection en eventos del propio
  // componente (los inputs del formulario), así que un método plano se re-evalúa en cada ciclo.
  protected estimatedTotal(): number {
    return this.items.controls.reduce((sum, item) => sum + this.subtotalOf(item), 0);
  }

  constructor() {
    this.providersService.listAll().subscribe((data) => this.providers.set(data));
    this.reload();
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

  protected providerName(providerId: string): string {
    return this.providers().find((p) => p.id === providerId)?.name ?? providerId;
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const { providerId, items } = this.form.getRawValue();
    this.purchasesService.create({ providerId, purchaseItems: items }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset({ providerId: '' });
        this.items.clear();
        this.items.push(this.newItem());
        this.reload();
      },
      error: () => this.submitting.set(false),
    });
  }

  private reload(): void {
    this.purchasesService.list().subscribe((data) => this.purchases.set(data));
  }
}
