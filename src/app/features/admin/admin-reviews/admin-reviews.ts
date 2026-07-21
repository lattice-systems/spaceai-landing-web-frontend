import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ReviewResponse } from '../../../core/models/review.model';
import { ReviewsService } from '../../../core/services/reviews.service';

@Component({
  selector: 'app-admin-reviews',
  imports: [HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">
          Comentarios y valoraciones
        </h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Reseñas enviadas por clientes. Aprueba las que se pueden mostrar públicamente o
          recházalas.
        </p>
      </div>

      <section class="bg-muted/50 overflow-x-auto rounded-xl p-5">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-muted-foreground border-border border-b">
              <th class="pb-3 font-medium">Cliente</th>
              <th class="pb-3 font-medium">Producto</th>
              <th class="pb-3 font-medium">Calificación</th>
              <th class="pb-3 font-medium">Comentario</th>
              <th class="pb-3 font-medium">Estado</th>
              <th class="pb-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (review of reviews(); track review.id) {
              <tr class="border-border/60 border-b last:border-0 align-top">
                <td class="text-foreground py-3 font-medium whitespace-nowrap">{{ review.institutionName }}</td>
                <td class="text-muted-foreground py-3 whitespace-nowrap">{{ review.productName }}</td>
                <td class="text-muted-foreground py-3 whitespace-nowrap">{{ review.rating }}/5</td>
                <td class="text-muted-foreground py-3 max-w-md">{{ review.comment }}</td>
                <td class="text-muted-foreground py-3 whitespace-nowrap">
                  {{ review.isApproved ? 'Aprobada' : 'Pendiente' }}
                </td>
                <td class="py-3 whitespace-nowrap">
                  @if (!review.isApproved) {
                    <button hlmBtn size="sm" (click)="approve(review.id)">Aprobar</button>
                  }
                  <button hlmBtn size="sm" variant="outline" (click)="reject(review.id)">
                    Rechazar
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="text-muted-foreground py-6 text-center">
                  Sin reseñas recibidas.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>
  `,
})
export class AdminReviews {
  private readonly reviewsService = inject(ReviewsService);

  protected readonly reviews = signal<ReviewResponse[]>([]);

  constructor() {
    this.reload();
  }

  protected approve(id: string): void {
    this.reviewsService.approve(id).subscribe(() => this.reload());
  }

  protected reject(id: string): void {
    this.reviewsService.reject(id).subscribe(() => this.reload());
  }

  private reload(): void {
    this.reviewsService.list().subscribe((data) => this.reviews.set(data));
  }
}
