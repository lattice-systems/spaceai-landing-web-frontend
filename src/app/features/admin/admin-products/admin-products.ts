import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-admin-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">Productos</h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Catálogo de módulos SpaceIA disponibles para cotizar y asignar a clientes.
        </p>
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        @for (product of products(); track product.id) {
          <article class="bg-muted/50 rounded-xl p-5">
            <p class="text-foreground text-sm font-semibold">{{ product.name }}</p>
            <p class="text-muted-foreground mt-2 text-sm leading-6">{{ product.description }}</p>
          </article>
        } @empty {
          <p class="text-muted-foreground text-sm">Sin productos registrados.</p>
        }
      </div>
    </section>
  `,
})
export class AdminProducts {
  private readonly productsService = inject(ProductsService);
  protected readonly products = toSignal(this.productsService.list(), { initialValue: [] });
}
