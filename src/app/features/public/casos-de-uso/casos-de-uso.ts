import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const USE_CASES = [
  {
    title: 'Acceso a edificios y laboratorios',
    body: 'Validación digital para alumnos, docentes, visitantes y personal operativo.',
    result: 'Menos filas y mayor trazabilidad de uso.',
  },
  {
    title: 'Orientación para estudiantes de nuevo ingreso',
    body: 'App, kiosco y robot ayudan a encontrar aulas, oficinas y servicios clave.',
    result: 'Menos fricción durante admisiones e inicio de semestre.',
  },
  {
    title: 'Atención autoservicio en campus',
    body: 'Preguntas frecuentes, ubicación de servicios y derivación a áreas correctas con IA.',
    result: 'Menor carga para ventanillas y atención más rápida.',
  },
  {
    title: 'Eventos, recorridos y visitas institucionales',
    body: 'Credenciales temporales, guías autónomas y rutas para visitantes.',
    result: 'Experiencias más ordenadas y memorables.',
  },
] as const;

@Component({
  selector: 'app-casos-de-uso',
  imports: [RouterLink, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto max-w-7xl px-6 py-24 lg:px-16">
      <section class="max-w-3xl">
        <p class="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">
          Casos de uso
        </p>
        <h1 class="text-foreground text-4xl font-extrabold tracking-tight sm:text-6xl">
          Escenarios donde SpaceIA reduce fricción operativa.
        </h1>
        <p class="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
          La plataforma está pensada para instituciones que necesitan modernizar servicios visibles
          sin fragmentar más su operación.
        </p>
      </section>

      <section class="mt-14 grid gap-5 md:grid-cols-2">
        @for (item of useCases; track item.title) {
          <article
            class="border-border bg-card flex min-h-64 flex-col justify-between gap-8 rounded-lg border p-6"
          >
            <div>
              <h2 class="text-card-foreground text-xl font-bold tracking-tight">
                {{ item.title }}
              </h2>
              <p class="text-muted-foreground mt-3 text-sm leading-relaxed">{{ item.body }}</p>
            </div>
            <p class="bg-muted text-foreground rounded-md p-4 text-sm font-medium">
              {{ item.result }}
            </p>
          </article>
        }
      </section>

      <section
        class="border-border mt-14 flex flex-col gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-foreground text-2xl font-bold tracking-tight">¿Tienes otro escenario?</h2>
          <p class="text-muted-foreground mt-2 text-sm">
            Podemos mapear el flujo de tu campus y priorizar una primera implementación.
          </p>
        </div>
        <a hlmBtn routerLink="/contacto">Contactar</a>
      </section>
    </main>
  `,
})
export class CasosDeUso {
  protected readonly useCases = USE_CASES;
}
