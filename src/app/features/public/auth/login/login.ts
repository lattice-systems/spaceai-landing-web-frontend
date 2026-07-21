import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { AuthService } from '../../../../core/services/auth.service';
import { Footer } from '../../../../layouts/public-layout/footer/footer';

@Component({
  selector: 'app-login',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterLink,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputImports,
    Footer,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-background min-h-svh">
      <main class="grid min-h-svh lg:grid-cols-2">
        <section class="flex flex-col p-6 md:p-10">
          <div class="flex items-center justify-between gap-4">
            <a routerLink="/" class="inline-flex items-center" aria-label="SpaceIA inicio">
              <img
                ngSrc="/spaceai-logo.png"
                alt="SpaceIA"
                width="96"
                height="64"
                class="h-8 w-auto dark:hidden"
                priority
              />
              <img
                ngSrc="/spaceai-logo-dark-variant.png"
                alt="SpaceIA"
                width="96"
                height="64"
                class="hidden h-8 w-auto dark:block"
                priority
              />
            </a>
            <a hlmBtn variant="ghost" size="sm" routerLink="/">Volver al inicio</a>
          </div>

          <div class="flex flex-1 items-center justify-center py-12">
            <form class="w-full max-w-sm" [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <hlm-field-group>
                <div class="flex flex-col gap-2">
                  <h1 class="text-foreground text-3xl font-bold tracking-tight">Iniciar sesión</h1>
                  <p class="text-muted-foreground text-sm">Accede al portal de tu institución.</p>
                </div>

                <hlm-field>
                  <label hlmFieldLabel for="email">Correo institucional</label>
                  <input
                    hlmInput
                    id="email"
                    type="email"
                    formControlName="email"
                    placeholder="nombre@universidad.edu.mx"
                    autocomplete="email"
                  />
                  <hlm-field-error validator="required">El correo es requerido.</hlm-field-error>
                  <hlm-field-error validator="email">Ingresa un correo válido.</hlm-field-error>
                </hlm-field>

                <hlm-field>
                  <div class="flex items-center">
                    <label hlmFieldLabel for="password">Contraseña</label>
                    <a
                      hlmFieldDescription
                      routerLink="/contacto"
                      class="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Recuperar acceso
                    </a>
                  </div>
                  <input
                    hlmInput
                    id="password"
                    type="password"
                    formControlName="password"
                    autocomplete="current-password"
                  />
                  <hlm-field-error validator="required"
                    >La contraseña es requerida.</hlm-field-error
                  >
                  <hlm-field-error validator="minlength">
                    La contraseña debe tener al menos 8 caracteres.
                  </hlm-field-error>
                </hlm-field>

                <hlm-field>
                  <button hlmBtn type="submit" [disabled]="form.invalid || submitted()">
                    Entrar
                  </button>
                </hlm-field>

                <p class="text-muted-foreground text-center text-sm">
                  ¿Necesitas acceso?
                  <a routerLink="/contacto" class="text-primary hover:text-primary/80 font-medium">
                    Contacta al equipo.
                  </a>
                </p>
              </hlm-field-group>

              @if (errorMessage()) {
                <p
                  class="bg-destructive/10 text-destructive mt-5 rounded-md p-3 text-center text-sm"
                  role="alert"
                >
                  {{ errorMessage() }}
                </p>
              }
            </form>
          </div>
        </section>

        <section class="bg-muted hidden p-6 lg:block">
          <div
            class="border-border bg-muted-foreground/10 flex h-full min-h-[520px] items-center justify-center rounded-lg border"
            aria-label="Imagen pendiente"
          >
            <span class="text-muted-foreground text-sm font-medium">Imagen pendiente</span>
          </div>
        </section>
      </main>

      <app-footer />
    </div>
  `,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitted = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitted.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();
    this.authService.login({ email, password }).subscribe({
      next: ({ user }) => {
        this.router.navigateByUrl(user.role === 'Admin' ? '/admin' : '/client');
      },
      error: () => {
        this.submitted.set(false);
        this.errorMessage.set('Correo o contraseña incorrectos.');
      },
    });
  }
}
