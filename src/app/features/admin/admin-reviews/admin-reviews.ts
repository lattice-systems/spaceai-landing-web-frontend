import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ReviewResponse } from '../../../core/models/review.model';
import { ReviewsService } from '../../../core/services/reviews.service';

@Component({
  selector: 'app-admin-reviews',
  imports: [HlmButtonImports, HlmBadgeImports, HlmTableImports],
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

      <section class="bg-muted/50 rounded-xl p-5">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Cliente</th>
                <th hlmTh>Producto</th>
                <th hlmTh>Calificación</th>
                <th hlmTh>Comentario</th>
                <th hlmTh>Estado</th>
                <th hlmTh>Acciones</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (review of reviews(); track review.id) {
                <tr hlmTr class="align-top">
                  <td hlmTd class="font-medium whitespace-nowrap">{{ review.institutionName }}</td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">
                    {{ review.productName }}
                  </td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">
                    {{ review.rating }}/5
                  </td>
                  <td hlmTd class="text-muted-foreground max-w-md">{{ review.comment }}</td>
                  <td hlmTd class="whitespace-nowrap">
                    <span hlmBadge [variant]="review.isApproved ? 'default' : 'secondary'">
                      {{ review.isApproved ? 'Aprobada' : 'Pendiente' }}
                    </span>
                  </td>
                  <td hlmTd class="whitespace-nowrap">
                    <div class="flex gap-2">
                      @if (!review.isApproved) {
                        <button hlmBtn size="sm" (click)="approve(review.id)">Aprobar</button>
                      }
                      <button hlmBtn size="sm" variant="outline" (click)="reject(review.id)">
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="6" class="text-muted-foreground text-center">
                    Sin reseñas recibidas.
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
