import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main
      class="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-center px-6 py-24 text-center"
    >
      <p class="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">404</p>
      <h1 class="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">
        Página no encontrada.
      </h1>
      <p class="text-muted-foreground mx-auto mt-5 max-w-xl text-sm leading-relaxed">
        La ruta no existe o todavía no está disponible en esta versión del sitio.
      </p>
      <div class="mt-8">
        <a hlmBtn routerLink="/">Volver al inicio</a>
      </div>
    </main>
  `,
})
export class NotFound {}
