import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { AuthService } from '../../../core/services/auth.service';
import { ProductResponse } from '../../../core/models/product.model';
import { ReviewResponse } from '../../../core/models/review.model';
import { ProductsService } from '../../../core/services/products.service';
import { ReviewsService } from '../../../core/services/reviews.service';

@Component({
  selector: 'app-client-reviews',
  imports: [ReactiveFormsModule, HlmButtonImports, HlmInputImports, HlmTextareaImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal cliente</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">Opiniones</h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Deja tu opinión sobre el producto adquirido. Se publica en el sitio público una vez
          aprobada por el equipo de SpaceIA.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <section class="bg-muted/50 rounded-xl p-5">
          <h2 class="text-foreground mb-4 text-base font-semibold">Nueva opinión</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3">
            <select hlmInput formControlName="productId">
              <option value="" disabled>Producto</option>
              @for (product of products(); track product.id) {
                <option [value]="product.id">{{ product.name }}</option>
              }
            </select>
            <select hlmInput formControlName="rating">
              <option value="" disabled>Calificación</option>
              @for (n of [5, 4, 3, 2, 1]; track n) {
                <option [value]="n">{{ n }} / 5</option>
              }
            </select>
            <textarea
              hlmTextarea
              rows="4"
              placeholder="Cuéntanos tu experiencia con el producto"
              formControlName="comment"
            ></textarea>
            <button hlmBtn type="submit" [disabled]="form.invalid || submitting()">
              @if (submitting()) { Enviando… } @else { Enviar opinión }
            </button>
            @if (submitted()) {
              <p class="text-muted-foreground text-xs">Gracias, tu opinión quedó pendiente de aprobación.</p>
            }
          </form>
        </section>

        <section class="bg-muted/50 rounded-xl p-5">
          <h2 class="text-foreground text-base font-semibold">Mis opiniones</h2>
          <div class="mt-5 grid gap-3">
            @for (review of myReviews(); track review.id) {
              <article class="bg-background/70 border-border rounded-lg border p-4">
                <p class="text-foreground text-sm font-medium">
                  {{ review.productName }} — {{ review.rating }}/5
                </p>
                <p class="text-muted-foreground mt-1 text-xs">{{ review.comment }}</p>
                <p class="text-muted-foreground mt-2 text-xs">
                  {{ review.isApproved ? 'Publicada' : 'Pendiente de aprobación' }}
                </p>
              </article>
            } @empty {
              <p class="text-muted-foreground text-sm">Aún no has dejado opiniones.</p>
            }
          </div>
        </section>
      </div>
    </section>
  `,
})
export class ClientReviews {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly productsService = inject(ProductsService);
  private readonly reviewsService = inject(ReviewsService);

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly products = signal<ProductResponse[]>([]);
  private readonly allReviews = signal<ReviewResponse[]>([]);

  protected readonly myReviews = computed(() => {
    const clientId = this.authService.user()?.clientId;
    return this.allReviews().filter((r) => r.clientId === clientId);
  });

  protected readonly form = this.fb.nonNullable.group({
    productId: ['', Validators.required],
    rating: ['', Validators.required],
    comment: ['', Validators.required],
  });

  constructor() {
    this.productsService.list().subscribe((data) => this.products.set(data));
    this.reload();
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.submitted.set(false);

    const { productId, rating, comment } = this.form.getRawValue();
    this.reviewsService.create({ productId, rating: Number(rating), comment }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.form.reset({ productId: '', rating: '', comment: '' });
        this.reload();
      },
      error: () => this.submitting.set(false),
    });
  }

  private reload(): void {
    this.reviewsService.list().subscribe((data) => this.allReviews.set(data));
  }
}
