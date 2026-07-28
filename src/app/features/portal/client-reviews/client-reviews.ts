import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { AuthService } from '../../../core/services/auth.service';
import { ProductModuleResponse } from '../../../core/models/product-module.model';
import { ReviewResponse } from '../../../core/models/review.model';
import { ProductModulesService } from '../../../core/services/product-modules.service';
import { ReviewsService } from '../../../core/services/reviews.service';

@Component({
  selector: 'app-client-reviews',
  imports: [
    ReactiveFormsModule,
    HlmButtonImports,
    HlmInputImports,
    HlmNativeSelectImports,
    HlmTextareaImports,
    HlmCardImports,
    HlmBadgeImports,
    HlmCheckboxImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal cliente</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">Opiniones</h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Cuéntanos cómo te fue con el producto. Puedes calificar un módulo, varios, o todos a la vez —
          se publica en el sitio una vez que el equipo la revisa.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <section class="bg-muted/50 rounded-xl p-5">
          <h2 class="text-foreground mb-4 text-base font-semibold">Nueva opinión</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3">
            <div class="grid gap-2">
              <label class="flex items-center gap-2 text-sm">
                <hlm-checkbox [checked]="allModulesSelected()" (checkedChange)="toggleAllModules($event)" />
                Todos los módulos
              </label>
              <div class="grid gap-1.5 border-border bg-background/50 rounded-lg border p-2.5">
                @for (module of productModules(); track module.id) {
                  <label class="flex items-center gap-2 text-sm">
                    <hlm-checkbox
                      [checked]="isModuleSelected(module.id)"
                      (checkedChange)="toggleModule(module.id)"
                    />
                    {{ module.name }}
                  </label>
                }
              </div>
              @if (submitAttempted() && selectedModuleIds().size === 0) {
                <p class="text-destructive text-xs">Elige al menos un módulo.</p>
              }
            </div>
            <hlm-native-select formControlName="rating">
              <option value="" disabled hlmNativeSelectOption>Calificación</option>
              @for (n of [5, 4, 3, 2, 1]; track n) {
                <option [value]="n" hlmNativeSelectOption>{{ n }} / 5</option>
              }
            </hlm-native-select>
            <textarea
              hlmTextarea
              rows="4"
              placeholder="Cuéntanos tu experiencia con el producto"
              formControlName="comment"
            ></textarea>
            <button hlmBtn type="submit" [disabled]="submitting()">
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
              <div hlmCard>
                <div hlmCardContent>
                  <p class="text-foreground text-sm font-medium">
                    {{ review.productModuleName }} — {{ review.rating }}/5
                  </p>
                  <p class="text-muted-foreground mt-1 text-xs">{{ review.comment }}</p>
                  <span hlmBadge [variant]="statusVariant(review.status)" class="mt-2">
                    {{ statusLabel(review.status) }}
                  </span>
                </div>
              </div>
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
  private readonly productModulesService = inject(ProductModulesService);
  private readonly reviewsService = inject(ReviewsService);

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly productModules = signal<ProductModuleResponse[]>([]);
  protected readonly selectedModuleIds = signal<Set<string>>(new Set());
  private readonly allReviews = signal<ReviewResponse[]>([]);

  protected readonly allModulesSelected = computed(() => {
    const modules = this.productModules();
    return modules.length > 0 && modules.every((m) => this.selectedModuleIds().has(m.id));
  });

  protected readonly myReviews = computed(() => {
    const clientId = this.authService.user()?.clientId;
    return this.allReviews().filter((r) => r.clientId === clientId);
  });

  protected statusLabel(status: string): string {
    if (status === 'Approved') return 'Publicada';
    if (status === 'Rejected') return 'No publicada';
    return 'Pendiente de aprobación';
  }

  protected statusVariant(status: string): 'default' | 'secondary' | 'outline' {
    if (status === 'Approved') return 'default';
    if (status === 'Rejected') return 'outline';
    return 'secondary';
  }

  protected readonly form = this.fb.nonNullable.group({
    rating: ['', Validators.required],
    comment: ['', Validators.required],
  });

  constructor() {
    this.productModulesService.listAll().subscribe((data) => this.productModules.set(data));
    this.reload();
  }

  protected isModuleSelected(id: string): boolean {
    return this.selectedModuleIds().has(id);
  }

  protected toggleModule(id: string): void {
    const next = new Set(this.selectedModuleIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedModuleIds.set(next);
  }

  protected toggleAllModules(checked: boolean): void {
    this.selectedModuleIds.set(checked ? new Set(this.productModules().map((m) => m.id)) : new Set());
  }

  protected onSubmit(): void {
    this.submitAttempted.set(true);
    if (this.form.invalid || this.selectedModuleIds().size === 0) return;

    this.submitting.set(true);
    this.submitted.set(false);

    const { rating, comment } = this.form.getRawValue();
    const requests = Array.from(this.selectedModuleIds()).map((productModuleId) =>
      this.reviewsService.create({ productModuleId, rating: Number(rating), comment }),
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.submitAttempted.set(false);
        this.form.reset({ rating: '', comment: '' });
        this.selectedModuleIds.set(new Set());
        this.reload();
      },
      error: () => this.submitting.set(false),
    });
  }

  private reload(): void {
    this.reviewsService.listAll().subscribe((data) => this.allReviews.set(data));
  }
}
