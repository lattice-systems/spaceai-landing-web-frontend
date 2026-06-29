import { ChangeDetectionStrategy, Component, computed, inject, NgZone, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideCheck, lucideFingerprint, lucideMonitor, lucideSmartphone } from '@ng-icons/lucide';
import { SpartanStepper, SpartanStepperImports } from '../../../shared/stepper';

// ─── Data ────────────────────────────────────────────────────────────────────

const TIPOS     = ['Universidad Pública', 'Universidad Privada', 'Tecnológico', 'Otra'] as const;
const TAMANIOS  = ['< 1,000', '1,000 – 5,000', '5,000 – 15,000', '+ 15,000'] as const;
const TIMELINES = ['En menos de 3 meses', 'Entre 3 y 6 meses', 'Más de 6 meses', 'Solo explorando'] as const;

const PRODUCTOS = [
  { id: 'movil',  label: 'Aplicación Móvil',  icon: 'lucideSmartphone',  color: '#22D3EE' },
  { id: 'acceso', label: 'Control de Acceso',  icon: 'lucideFingerprint', color: '#38BDF8' },
  { id: 'kiosco', label: 'Kiosco SIDE',        icon: 'lucideMonitor',     color: '#2DD4BF' },
  { id: 'robot',  label: 'Robot Autónomo',     icon: 'lucideBot',         color: '#818CF8' },
] as const;

// ─── State ───────────────────────────────────────────────────────────────────

interface QuoteState {
  institucion: string;
  tipo:        string;
  tamanio:     string;
  productos:   Set<string>;
  nombre:      string;
  cargo:       string;
  email:       string;
  timeline:    string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ─── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-cotizador',
  imports: [RouterLink, HlmButtonImports, HlmInputImports, NgIcon, SpartanStepperImports],
  providers: [
    provideIcons({ lucideSmartphone, lucideFingerprint, lucideMonitor, lucideBot, lucideCheck }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    .opt-btn {
      transition: border-color 150ms, background-color 150ms, color 150ms, transform 140ms ease-out;
    }
    .opt-btn:active { transform: scale(0.97); }

    .submit-btn:active:not(:disabled) { transform: scale(0.97); }
    .submit-btn { transition: transform 160ms ease-out; }

    @media (prefers-reduced-motion: reduce) {
      .opt-btn, .submit-btn { transition: none; }
    }
  `],
  template: `
    <div class="mx-auto max-w-2xl px-6 py-16 sm:py-24 lg:px-8">

      @if (!done()) {

        <spartan-stepper [linear]="true">

          <!-- ── Paso 1: Institución ──────────────────────────────────── -->
          <spartan-step label="Tu institución">
            <div class="flex flex-col gap-6 pt-6">

              <div class="flex flex-col gap-1.5">
                <label for="inst" class="text-sm font-medium text-foreground">
                  Nombre de la institución <span class="text-destructive" aria-hidden="true">*</span>
                </label>
                <input
                  hlmInput id="inst" type="text"
                  [value]="state().institucion"
                  (input)="setField('institucion', $event)"
                  placeholder="Universidad Autónoma de Sonora"
                  autocomplete="organization"
                  [class.border-destructive]="showErr() && !state().institucion.trim()"
                />
                @if (showErr() && !state().institucion.trim()) {
                  <span class="text-xs text-destructive" role="alert">Requerido</span>
                }
              </div>

              <div>
                <p class="mb-3 text-sm font-medium text-foreground">Tipo de institución</p>
                <div class="flex flex-wrap gap-2">
                  @for (t of tipos; track t) {
                    <button type="button" (click)="pick('tipo', t)"
                      class="opt-btn rounded-full border px-4 py-2 text-sm font-medium"
                      [class]="state().tipo === t
                        ? 'border-primary bg-primary/8 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'">
                      {{ t }}
                    </button>
                  }
                </div>
                @if (showErr() && !state().tipo) {
                  <p class="mt-2 text-xs text-destructive" role="alert">Selecciona un tipo</p>
                }
              </div>

              <div>
                <p class="mb-3 text-sm font-medium text-foreground">Número de estudiantes</p>
                <div class="flex flex-wrap gap-2">
                  @for (s of tamanios; track s) {
                    <button type="button" (click)="pick('tamanio', s)"
                      class="opt-btn rounded-full border px-4 py-2 text-sm font-medium"
                      [class]="state().tamanio === s
                        ? 'border-primary bg-primary/8 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'">
                      {{ s }}
                    </button>
                  }
                </div>
                @if (showErr() && !state().tamanio) {
                  <p class="mt-2 text-xs text-destructive" role="alert">Selecciona un rango</p>
                }
              </div>

              <div class="flex justify-end pt-2">
                <button hlmBtn class="submit-btn" type="button" (click)="nextStep0()">
                  Continuar
                </button>
              </div>

            </div>
          </spartan-step>

          <!-- ── Paso 2: Productos ────────────────────────────────────── -->
          <spartan-step label="Productos">
            <div class="flex flex-col gap-6 pt-6">

              <div class="grid grid-cols-2 gap-3">
                @for (p of productos; track p.id) {
                  <button type="button" (click)="toggleProducto(p.id)"
                    class="opt-btn relative flex flex-col items-start gap-3 rounded-lg border p-5 text-left"
                    [class]="state().productos.has(p.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'"
                    [attr.aria-pressed]="state().productos.has(p.id)">
                    @if (state().productos.has(p.id)) {
                      <span class="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary">
                        <ng-icon name="lucideCheck" size="11" class="text-primary-foreground" />
                      </span>
                    }
                    <ng-icon [name]="p.icon" size="28" [style.color]="p.color" />
                    <span class="text-sm font-semibold text-foreground">{{ p.label }}</span>
                  </button>
                }
              </div>
              @if (showErr() && state().productos.size === 0) {
                <p class="text-xs text-destructive" role="alert">Selecciona al menos un producto</p>
              }

              <div class="flex justify-between pt-2">
                <button hlmBtn variant="outline" type="button" spartanStepperPrevious (click)="clearErr()">
                  ← Atrás
                </button>
                <button hlmBtn class="submit-btn" type="button" (click)="nextStep1()">
                  Continuar
                </button>
              </div>

            </div>
          </spartan-step>

          <!-- ── Paso 3: Datos ────────────────────────────────────────── -->
          <spartan-step label="Tus datos">
            <div class="flex flex-col gap-5 pt-6">

              <div class="grid gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-1.5">
                  <label for="nombre" class="text-sm font-medium text-foreground">
                    Nombre completo <span class="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input hlmInput id="nombre" type="text"
                    [value]="state().nombre" (input)="setField('nombre', $event)"
                    placeholder="Lic. Juan García" autocomplete="name"
                    [class.border-destructive]="showErr() && !state().nombre.trim()" />
                  @if (showErr() && !state().nombre.trim()) {
                    <span class="text-xs text-destructive" role="alert">Requerido</span>
                  }
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="cargo" class="text-sm font-medium text-foreground">
                    Cargo <span class="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input hlmInput id="cargo" type="text"
                    [value]="state().cargo" (input)="setField('cargo', $event)"
                    placeholder="Director de Servicios" autocomplete="organization-title"
                    [class.border-destructive]="showErr() && !state().cargo.trim()" />
                  @if (showErr() && !state().cargo.trim()) {
                    <span class="text-xs text-destructive" role="alert">Requerido</span>
                  }
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="email" class="text-sm font-medium text-foreground">
                  Correo institucional <span class="text-destructive" aria-hidden="true">*</span>
                </label>
                <input hlmInput id="email" type="email"
                  [value]="state().email" (input)="setField('email', $event)"
                  placeholder="juan@universidad.edu.mx" autocomplete="email"
                  [class.border-destructive]="showErr() && !validEmail()" />
                @if (showErr() && !validEmail()) {
                  <span class="text-xs text-destructive" role="alert">
                    {{ state().email ? 'Correo inválido' : 'Requerido' }}
                  </span>
                }
              </div>

              <div>
                <p class="mb-3 text-sm font-medium text-foreground">¿Cuándo planeas implementarlo?</p>
                <div class="flex flex-wrap gap-2">
                  @for (t of timelines; track t) {
                    <button type="button" (click)="pick('timeline', t)"
                      class="opt-btn rounded-full border px-4 py-2 text-sm font-medium"
                      [class]="state().timeline === t
                        ? 'border-primary bg-primary/8 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'">
                      {{ t }}
                    </button>
                  }
                </div>
                @if (showErr() && !state().timeline) {
                  <p class="mt-2 text-xs text-destructive" role="alert">Selecciona una opción</p>
                }
              </div>

              <div class="flex justify-between pt-2">
                <button hlmBtn variant="outline" type="button" spartanStepperPrevious (click)="clearErr()">
                  ← Atrás
                </button>
                <button hlmBtn size="lg" class="submit-btn" type="button"
                  [disabled]="submitting()" (click)="submit()">
                  @if (submitting()) {
                    <svg class="mr-2 size-4 animate-spin" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="25 13"/>
                    </svg>
                    Enviando…
                  } @else {
                    Solicitar propuesta
                  }
                </button>
              </div>

            </div>
          </spartan-step>

        </spartan-stepper>

      } @else {

        <!-- ── Éxito ──────────────────────────────────────────────────── -->
        <div class="flex flex-col gap-6 py-4">
          <div class="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <ng-icon name="lucideCheck" size="24" class="text-primary" />
          </div>
          <div>
            <h1 class="mb-2 text-3xl font-extrabold tracking-tight text-foreground">Solicitud recibida.</h1>
            <p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Te contactaremos en menos de 48 horas al correo
              <span class="font-medium text-foreground">{{ state().email }}</span>
              con una propuesta personalizada para
              <span class="font-medium text-foreground">{{ state().institucion }}</span>.
            </p>
          </div>
          <div class="rounded-lg border border-border bg-card p-5 text-sm">
            <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Resumen</p>
            <div class="space-y-2">
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Institución</span>
                <span class="text-right font-medium text-foreground">{{ state().institucion }} · {{ state().tamanio }} est.</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Productos</span>
                <span class="text-right font-medium text-foreground">{{ productoLabels() }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Implementación</span>
                <span class="text-right font-medium text-foreground">{{ state().timeline }}</span>
              </div>
            </div>
          </div>
          <a hlmBtn variant="outline" routerLink="/">Volver al inicio</a>
        </div>

      }

    </div>
  `,
})
export class Cotizador {
  protected readonly tipos     = TIPOS;
  protected readonly tamanios  = TAMANIOS;
  protected readonly timelines = TIMELINES;
  protected readonly productos = PRODUCTOS;

  protected readonly state      = signal<QuoteState>({ institucion: '', tipo: '', tamanio: '', productos: new Set(), nombre: '', cargo: '', email: '', timeline: '' });
  protected readonly showErr    = signal(false);
  protected readonly submitting = signal(false);
  protected readonly done       = signal(false);

  protected readonly validEmail    = computed(() => isEmail(this.state().email));
  protected readonly productoLabels = computed(() =>
    PRODUCTOS.filter(p => this.state().productos.has(p.id)).map(p => p.label).join(', ')
  );

  private readonly zone    = inject(NgZone);
  private readonly stepper = viewChild(SpartanStepper);

  protected setField(field: 'institucion' | 'nombre' | 'cargo' | 'email', ev: Event): void {
    const val = (ev.target as HTMLInputElement).value;
    this.state.update(s => ({ ...s, [field]: val }));
  }

  protected pick(field: 'tipo' | 'tamanio' | 'timeline', val: string): void {
    this.state.update(s => ({ ...s, [field]: val }));
  }

  protected toggleProducto(id: string): void {
    this.state.update(s => {
      const next = new Set(s.productos);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...s, productos: next };
    });
  }

  protected clearErr(): void { this.showErr.set(false); }

  protected nextStep0(): void {
    const s = this.state();
    if (!s.institucion.trim() || !s.tipo || !s.tamanio) { this.showErr.set(true); return; }
    this.showErr.set(false);
    this.stepper()?.next();
  }

  protected nextStep1(): void {
    if (this.state().productos.size === 0) { this.showErr.set(true); return; }
    this.showErr.set(false);
    this.stepper()?.next();
  }

  protected submit(): void {
    const s = this.state();
    if (!s.nombre.trim() || !s.cargo.trim() || !isEmail(s.email) || !s.timeline) {
      this.showErr.set(true); return;
    }
    this.submitting.set(true);
    // TODO: POST /api/quotes when backend ready
    this.zone.runOutsideAngular(() => setTimeout(() =>
      this.zone.run(() => { this.submitting.set(false); this.done.set(true); }),
    900));
  }
}
