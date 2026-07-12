import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

const PRIVACY_ITEMS = [
  'Datos de contacto proporcionados en formularios.',
  'Información institucional necesaria para preparar propuestas.',
  'Datos técnicos mínimos para operar y proteger la plataforma.',
] as const;

@Component({
  selector: 'app-privacidad',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <p class="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">Legal</p>
      <h1 class="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">
        Política de privacidad.
      </h1>
      <p class="text-muted-foreground mt-5 text-sm leading-relaxed">
        Documento preliminar para el sitio comercial de SpaceIA. El texto legal final debe validarse
        antes de producción.
      </p>

      <section class="mt-10 flex flex-col gap-6">
        <article>
          <h2 class="text-foreground text-xl font-bold">Información que podemos solicitar</h2>
          <ul class="mt-4 flex flex-col gap-3">
            @for (item of items; track item) {
              <li class="border-border bg-card text-card-foreground rounded-md border p-4 text-sm">
                {{ item }}
              </li>
            }
          </ul>
        </article>

        <article>
          <h2 class="text-foreground text-xl font-bold">Uso de la información</h2>
          <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
            Usamos la información para responder solicitudes, preparar cotizaciones, dar seguimiento
            comercial y mejorar la operación del ecosistema.
          </p>
        </article>

        <article>
          <h2 class="text-foreground text-xl font-bold">Contacto</h2>
          <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
            Para dudas sobre privacidad, escribe desde la página de
            <a routerLink="/contacto" class="text-primary hover:text-primary/80"> contacto</a>.
          </p>
        </article>
      </section>
    </main>
  `,
})
export class Privacidad {
  protected readonly items = PRIVACY_ITEMS;
}
