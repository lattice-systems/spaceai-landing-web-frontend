import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

const TERMS = [
  {
    title: 'Uso del sitio',
    body: 'El contenido presenta información comercial preliminar sobre SpaceIA y sus módulos.',
  },
  {
    title: 'Cotizaciones',
    body: 'Las solicitudes enviadas desde el cotizador no constituyen una oferta final hasta ser revisadas por el equipo.',
  },
  {
    title: 'Propiedad intelectual',
    body: 'Marcas, diseños, textos y materiales del sitio pertenecen a Lattice Systems o sus titulares.',
  },
] as const;

@Component({
  selector: 'app-terminos',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <p class="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">Legal</p>
      <h1 class="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">
        Términos de uso.
      </h1>
      <p class="text-muted-foreground mt-5 text-sm leading-relaxed">
        Documento preliminar para navegación pública. Debe revisarse legalmente antes de producción.
      </p>

      <section class="mt-10 flex flex-col gap-5">
        @for (term of terms; track term.title) {
          <article class="border-border bg-card rounded-lg border p-6">
            <h2 class="text-card-foreground text-xl font-bold">{{ term.title }}</h2>
            <p class="text-muted-foreground mt-3 text-sm leading-relaxed">{{ term.body }}</p>
          </article>
        }
      </section>

      <a routerLink="/contacto" class="text-primary hover:text-primary/80 mt-8 inline-flex text-sm">
        Reportar duda sobre estos términos
      </a>
    </main>
  `,
})
export class Terminos {
  protected readonly terms = TERMS;
}
