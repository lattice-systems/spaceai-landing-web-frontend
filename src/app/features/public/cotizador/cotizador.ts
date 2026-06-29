import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  NgZone,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBot,
  lucideCheck,
  lucideChevronRight,
  lucideFingerprint,
  lucideMonitor,
  lucideSmartphone,
} from '@ng-icons/lucide';

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  { title: 'Tu institución',     desc: 'Cuéntanos sobre tu campus' },
  { title: '¿Qué te interesa?', desc: 'Selecciona uno o más productos' },
  { title: 'Tus datos',          desc: 'Para enviarte la propuesta' },
] as const;

const TIPOS = ['Universidad Pública', 'Universidad Privada', 'Tecnológico', 'Otra'] as const;
const TAMANIOS = ['< 1,000', '1,000 – 5,000', '5,000 – 15,000', '+ 15,000'] as const;
const TIMELINES = ['En menos de 3 meses', 'Entre 3 y 6 meses', 'Más de 6 meses', 'Solo explorando'] as const;

const PRODUCTOS = [
  { id: 'movil',  label: 'Aplicación Móvil',    icon: 'lucideSmartphone', color: '#22D3EE' },
  { id: 'acceso', label: 'Control de Acceso',    icon: 'lucideFingerprint', color: '#38BDF8' },
  { id: 'kiosco', label: 'Kiosco SIDE',          icon: 'lucideMonitor',    color: '#2DD4BF' },
  { id: 'robot',  label: 'Robot Autónomo',       icon: 'lucideBot',        color: '#818CF8' },
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

function emptyState(): QuoteState {
  return {
    institucion: '',
    tipo:        '',
    tamanio:     '',
    productos:   new Set(),
    nombre:      '',
    cargo:       '',
    email:       '',
    timeline:    '',
  };
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ─── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-cotizador',
  imports: [RouterLink, HlmButtonImports, HlmInputImports, NgIcon],
  providers: [
    provideIcons({ lucideSmartphone, lucideFingerprint, lucideMonitor, lucideBot, lucideCheck, lucideChevronRight }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    /* Progress bar fill */
    .progress-fill {
      transition: width 400ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    /* Option pill / card press feedback */
    .opt-btn:active { transform: scale(0.97); }
    .opt-btn { transition: transform 140ms ease-out, border-color 150ms, background-color 150ms, color 150ms; }

    /* Submit button */
    .submit-btn:active:not(:disabled) { transform: scale(0.97); }
    .submit-btn { transition: transform 160ms ease-out; }

    /* Step fade */
    .step-enter {
      animation: stepIn 260ms cubic-bezier(0.23,1,0.32,1) both;
    }
    @keyframes stepIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .progress-fill { transition: none; }
      .step-enter { animation: none; }
    }
  `],
  template: `
    <div class="mx-auto max-w-2xl px-6 py-16 sm:py-24 lg:px-8">

      @if (!done()) {

        <!-- Progress bar -->
        <div class="mb-10">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-medium text-muted-foreground">
              Paso {{ step() + 1 }} de {{ steps.length }}
            </span>
            <span class="text-xs text-muted-foreground">
              {{ steps[step()].title }}
            </span>
          </div>
          <div class="h-0.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              class="progress-fill h-full rounded-full bg-primary"
              [style.width]="progressPct() + '%'"
            ></div>
          </div>
        </div>

        <!-- Step header -->
        <div class="mb-8 step-enter" [attr.key]="step()">
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {{ steps[step()].title }}
          </h1>
          <p class="mt-2 text-sm text-muted-foreground">{{ steps[step()].desc }}</p>
        </div>

        <!-- ── Step 0: Institución ─────────────────────────────────────── -->
        @if (step() === 0) {
          <div class="step-enter space-y-6">

            <div class="flex flex-col gap-1.5">
              <label for="inst" class="text-sm font-medium text-foreground">
                Nombre de la institución <span class="text-destructive" aria-hidden="true">*</span>
              </label>
              <input
                hlmInput
                id="inst"
                type="text"
                [value]="state().institucion"
                (input)="set('institucion', $event)"
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
                  <button
                    type="button"
                    (click)="pick('tipo', t)"
                    class="opt-btn rounded-full border px-4 py-2 text-sm font-medium"
                    [class]="state().tipo === t
                      ? 'border-primary bg-primary/8 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'"
                  >{{ t }}</button>
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
                  <button
                    type="button"
                    (click)="pick('tamanio', s)"
                    class="opt-btn rounded-full border px-4 py-2 text-sm font-medium"
                    [class]="state().tamanio === s
                      ? 'border-primary bg-primary/8 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'"
                  >{{ s }}</button>
                }
              </div>
              @if (showErr() && !state().tamanio) {
                <p class="mt-2 text-xs text-destructive" role="alert">Selecciona un rango</p>
              }
            </div>

          </div>
        }

        <!-- ── Step 1: Productos ───────────────────────────────────────── -->
        @if (step() === 1) {
          <div class="step-enter">
            <div class="grid grid-cols-2 gap-3">
              @for (p of productos; track p.id) {
                <button
                  type="button"
                  (click)="toggleProducto(p.id)"
                  class="opt-btn relative flex flex-col items-start gap-3 rounded-lg border p-5 text-left"
                  [class]="state().productos.has(p.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'"
                  [attr.aria-pressed]="state().productos.has(p.id)"
                >
                  <!-- Checkmark -->
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
              <p class="mt-3 text-xs text-destructive" role="alert">Selecciona al menos un producto</p>
            }
          </div>
        }

        <!-- ── Step 2: Datos ───────────────────────────────────────────── -->
        @if (step() === 2) {
          <div class="step-enter space-y-5">

            <div class="grid gap-5 sm:grid-cols-2">

              <div class="flex flex-col gap-1.5">
                <label for="nombre" class="text-sm font-medium text-foreground">
                  Nombre completo <span class="text-destructive" aria-hidden="true">*</span>
                </label>
                <input
                  hlmInput id="nombre" type="text"
                  [value]="state().nombre"
                  (input)="set('nombre', $event)"
                  placeholder="Lic. Juan García"
                  autocomplete="name"
                  [class.border-destructive]="showErr() && !state().nombre.trim()"
                />
                @if (showErr() && !state().nombre.trim()) {
                  <span class="text-xs text-destructive" role="alert">Requerido</span>
                }
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="cargo" class="text-sm font-medium text-foreground">
                  Cargo <span class="text-destructive" aria-hidden="true">*</span>
                </label>
                <input
                  hlmInput id="cargo" type="text"
                  [value]="state().cargo"
                  (input)="set('cargo', $event)"
                  placeholder="Director de Servicios"
                  autocomplete="organization-title"
                  [class.border-destructive]="showErr() && !state().cargo.trim()"
                />
                @if (showErr() && !state().cargo.trim()) {
                  <span class="text-xs text-destructive" role="alert">Requerido</span>
                }
              </div>

            </div>

            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-sm font-medium text-foreground">
                Correo institucional <span class="text-destructive" aria-hidden="true">*</span>
              </label>
              <input
                hlmInput id="email" type="email"
                [value]="state().email"
                (input)="set('email', $event)"
                placeholder="juan@universidad.edu.mx"
                autocomplete="email"
                [class.border-destructive]="showErr() && !validEmail()"
              />
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
                  <button
                    type="button"
                    (click)="pick('timeline', t)"
                    class="opt-btn rounded-full border px-4 py-2 text-sm font-medium"
                    [class]="state().timeline === t
                      ? 'border-primary bg-primary/8 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'"
                  >{{ t }}</button>
                }
              </div>
              @if (showErr() && !state().timeline) {
                <p class="mt-2 text-xs text-destructive" role="alert">Selecciona una opción</p>
              }
            </div>

          </div>
        }

        <!-- Navigation -->
        <div class="mt-10 flex items-center justify-between">
          @if (step() > 0) {
            <button
              type="button"
              hlmBtn
              variant="ghost"
              (click)="prev()"
            >
              ← Atrás
            </button>
          } @else {
            <span></span>
          }

          @if (step() < steps.length - 1) {
            <button
              type="button"
              hlmBtn
              class="submit-btn gap-1.5"
              (click)="next()"
            >
              Continuar
              <ng-icon name="lucideChevronRight" size="16" />
            </button>
          } @else {
            <button
              type="button"
              hlmBtn
              size="lg"
              class="submit-btn"
              [disabled]="submitting()"
              (click)="submit()"
            >
              @if (submitting()) {
                <svg class="mr-2 size-4 animate-spin" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="25 13" />
                </svg>
                Enviando…
              } @else {
                Solicitar propuesta
              }
            </button>
          }
        </div>

      } @else {

        <!-- ── Success ─────────────────────────────────────────────────── -->
        <div class="step-enter flex flex-col gap-6 py-4">

          <div class="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <ng-icon name="lucideCheck" size="24" class="text-primary" />
          </div>

          <div>
            <h1 class="mb-2 text-3xl font-extrabold tracking-tight text-foreground">
              Solicitud recibida.
            </h1>
            <p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Te contactaremos en menos de 48 horas al correo
              <span class="font-medium text-foreground">{{ state().email }}</span>
              con una propuesta personalizada para
              <span class="font-medium text-foreground">{{ state().institucion }}</span>.
            </p>
          </div>

          <!-- Summary -->
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
  protected readonly steps     = STEPS;
  protected readonly tipos     = TIPOS;
  protected readonly tamanios  = TAMANIOS;
  protected readonly timelines = TIMELINES;
  protected readonly productos = PRODUCTOS;

  protected readonly step       = signal(0);
  protected readonly done       = signal(false);
  protected readonly showErr    = signal(false);
  protected readonly submitting = signal(false);
  protected readonly state      = signal<QuoteState>(emptyState());

  protected readonly progressPct = computed(() =>
    Math.round((this.step() / STEPS.length) * 100)
  );

  protected readonly validEmail = computed(() =>
    isEmail(this.state().email)
  );

  protected readonly productoLabels = computed(() =>
    PRODUCTOS
      .filter(p => this.state().productos.has(p.id))
      .map(p => p.label)
      .join(', ')
  );

  private readonly zone = inject(NgZone);

  // ── Mutations ─────────────────────────────────────────────────────────────

  protected set(field: 'institucion' | 'nombre' | 'cargo' | 'email', ev: Event): void {
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

  // ── Navigation ────────────────────────────────────────────────────────────

  protected next(): void {
    if (!this.canProceed()) { this.showErr.set(true); return; }
    this.showErr.set(false);
    this.step.update(n => n + 1);
  }

  protected prev(): void {
    this.showErr.set(false);
    this.step.update(n => n - 1);
  }

  protected submit(): void {
    if (!this.canProceed()) { this.showErr.set(true); return; }
    this.submitting.set(true);
    // TODO: POST /api/support-tickets or /api/quotes when backend ready
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.submitting.set(false);
          this.done.set(true);
        });
      }, 900);
    });
  }

  private canProceed(): boolean {
    const s = this.state();
    switch (this.step()) {
      case 0: return !!s.institucion.trim() && !!s.tipo && !!s.tamanio;
      case 1: return s.productos.size > 0;
      case 2: return !!s.nombre.trim() && !!s.cargo.trim() && isEmail(s.email) && !!s.timeline;
      default: return true;
    }
  }
}
