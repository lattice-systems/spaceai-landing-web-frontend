import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { ContactMessagesService } from '../../../core/services/contact-messages.service';

const CONTACT_INFO = [
  {
    label: 'Correo',
    value: 'contacto@latticesystems.dev',
    href: 'mailto:contacto@latticesystems.dev',
  },
  {
    label: 'Teléfono',
    value: '81 4823 6850',
    href: 'tel:+528148236850',
  },
  {
    label: 'Ubicación',
    value: 'León, Guanajuato, México',
    href: null,
  },
] as const;

@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule, RouterLink, HlmButtonImports, HlmInputImports, HlmTextareaImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    /* Field error visibility */
    .field-error {
      display: none;
    }
    .ng-submitted .ng-invalid ~ .field-error,
    .ng-touched.ng-invalid ~ .field-error {
      display: block;
    }

    /* Active press feedback on submit button */
    .submit-btn:active:not(:disabled) {
      transform: scale(0.97);
    }
    .submit-btn { transition: transform 160ms ease-out, opacity 150ms ease; }
  `],
  template: `
    <div class="mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:px-16">
      <div class="grid gap-16 lg:grid-cols-2 lg:gap-24">

        <!-- Left: context -->
        <div class="lg:sticky lg:top-24 lg:self-start">

          <!-- Heading — promise, not generic CTA -->
          <h1 class="mb-4 text-5xl font-extrabold tracking-tighter text-foreground sm:text-6xl">
            Hablemos.
          </h1>
          <p class="mb-10 max-w-sm text-base leading-relaxed text-muted-foreground">
            Responderemos en menos de 24 horas.
            Sin argumentos de venta, sin presión.
          </p>

          <!-- Contact info -->
          <ul class="space-y-5">
            @for (item of contactInfo; track item.label) {
              <li class="flex flex-col gap-0.5">
                <span class="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {{ item.label }}
                </span>
                @if (item.href) {
                  <a
                    [href]="item.href"
                    class="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {{ item.value }}
                  </a>
                } @else {
                  <span class="text-sm font-medium text-foreground">{{ item.value }}</span>
                }
              </li>
            }
          </ul>

          <!-- Schedule CTA -->
          <div class="mt-10 border-t border-border pt-8">
            <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Agendar directamente
            </p>
            <a
              href="#"
              class="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              aria-label="Agendar una sesión (abre calendario)"
            >
              <svg class="size-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <rect x="2" y="3" width="12" height="12" rx="1.5" />
                <path d="M2 7h12M5 1v4M11 1v4" stroke-linecap="round"/>
              </svg>
              Reservar una sesión de 30 min
            </a>
          </div>

        </div>

        <!-- Right: form -->
        <div>
          @if (!submitted()) {
            <form
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="space-y-5"
              novalidate
            >

              <div class="grid gap-5 sm:grid-cols-2">
                <!-- Nombre -->
                <div class="flex flex-col gap-1.5">
                  <label for="nombre" class="text-sm font-medium text-foreground">
                    Nombre completo <span class="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    hlmInput
                    id="nombre"
                    type="text"
                    formControlName="nombre"
                    placeholder="Lic. Juan García"
                    autocomplete="name"
                    [class.border-destructive]="isInvalid('nombre')"
                  />
                  @if (isInvalid('nombre')) {
                    <span class="text-xs text-destructive" role="alert">Nombre requerido</span>
                  }
                </div>

                <!-- Cargo -->
                <div class="flex flex-col gap-1.5">
                  <label for="cargo" class="text-sm font-medium text-foreground">
                    Cargo <span class="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    hlmInput
                    id="cargo"
                    type="text"
                    formControlName="cargo"
                    placeholder="Director de Servicios Escolares"
                    autocomplete="organization-title"
                    [class.border-destructive]="isInvalid('cargo')"
                  />
                  @if (isInvalid('cargo')) {
                    <span class="text-xs text-destructive" role="alert">Cargo requerido</span>
                  }
                </div>
              </div>

              <!-- Email -->
              <div class="flex flex-col gap-1.5">
                <label for="email" class="text-sm font-medium text-foreground">
                  Correo institucional <span class="text-destructive" aria-hidden="true">*</span>
                </label>
                <input
                  hlmInput
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="juan.garcia@universidad.edu.mx"
                  autocomplete="email"
                  [class.border-destructive]="isInvalid('email')"
                />
                @if (isInvalid('email')) {
                  <span class="text-xs text-destructive" role="alert">
                    @if (form.get('email')?.errors?.['required']) { Correo requerido }
                    @else { Correo inválido }
                  </span>
                }
              </div>

              <!-- Institución -->
              <div class="flex flex-col gap-1.5">
                <label for="institucion" class="text-sm font-medium text-foreground">
                  Institución <span class="text-destructive" aria-hidden="true">*</span>
                </label>
                <input
                  hlmInput
                  id="institucion"
                  type="text"
                  formControlName="institucion"
                  placeholder="Universidad Autónoma de Sonora"
                  autocomplete="organization"
                  [class.border-destructive]="isInvalid('institucion')"
                />
                @if (isInvalid('institucion')) {
                  <span class="text-xs text-destructive" role="alert">Institución requerida</span>
                }
              </div>

              <!-- Mensaje -->
              <div class="flex flex-col gap-1.5">
                <label for="mensaje" class="text-sm font-medium text-foreground">
                  ¿En qué podemos ayudarte? <span class="text-destructive" aria-hidden="true">*</span>
                </label>
                <textarea
                  hlmTextarea
                  id="mensaje"
                  formControlName="mensaje"
                  rows="5"
                  placeholder="Cuéntanos sobre tu campus — número de estudiantes, retos actuales, qué producto te interesa..."
                  [class.border-destructive]="isInvalid('mensaje')"
                ></textarea>
                @if (isInvalid('mensaje')) {
                  <span class="text-xs text-destructive" role="alert">Mensaje requerido</span>
                }
              </div>

              <!-- Submit -->
              <button
                hlmBtn
                type="submit"
                size="lg"
                class="submit-btn w-full"
                [disabled]="submitting()"
              >
                @if (submitting()) {
                  <svg class="mr-2 size-4 animate-spin" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="25 13" />
                  </svg>
                  Enviando…
                } @else {
                  Enviar mensaje
                }
              </button>

              <p class="text-center text-xs text-muted-foreground">
                Al enviar aceptas nuestra
                <a routerLink="/privacidad" class="underline underline-offset-2 hover:text-foreground">política de privacidad</a>.
              </p>

              @if (submitError()) {
                <p class="text-center text-sm text-destructive" role="alert">
                  No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.
                </p>
              }

            </form>
          } @else {
            <!-- Success state -->
            <div class="flex flex-col items-start gap-6 py-4">
              <div class="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <svg class="size-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-foreground">Mensaje recibido.</h2>
                <p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Te contactaremos en menos de 24 horas al correo que proporcionaste.
                  Revisamos cada solicitud personalmente.
                </p>
              </div>
              <a hlmBtn variant="outline" routerLink="/">Volver al inicio</a>
            </div>
          }
        </div>

      </div>
    </div>
  `,
})
export class Contacto {
  private readonly fb = inject(FormBuilder);
  private readonly contactMessagesService = inject(ContactMessagesService);

  protected readonly submitting = signal(false);
  protected readonly submitted  = signal(false);
  protected readonly submitError = signal(false);
  protected readonly contactInfo = CONTACT_INFO;

  protected readonly form = this.fb.nonNullable.group({
    nombre:      ['', Validators.required],
    cargo:       ['', Validators.required],
    email:       ['', [Validators.required, Validators.email]],
    institucion: ['', Validators.required],
    mensaje:     ['', Validators.required],
  });

  protected isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.submitError.set(false);

    const { nombre, cargo, email, institucion, mensaje } = this.form.getRawValue();
    this.contactMessagesService
      .create({
        name: nombre,
        jobTitle: cargo,
        email,
        institutionName: institucion,
        message: mensaje,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
        },
        error: () => {
          this.submitting.set(false);
          this.submitError.set(true);
        },
      });
  }
}
