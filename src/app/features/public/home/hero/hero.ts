import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { CampusGraph } from './campus-graph/campus-graph';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, HlmButtonImports, CampusGraph],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeSlideInDelay', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('500ms 150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <section
      class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6"
    >
      <div class="grid w-full items-center gap-12 md:grid-cols-2">

        <!-- Left: copy -->
        <div @fadeSlideIn class="flex flex-col gap-6">
          <span class="w-fit rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            Ecosistema Universitario Inteligente
          </span>

          <h1 class="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Transforma tu institución con el
            <span class="text-primary"> campus inteligente</span>
          </h1>

          <p class="max-w-md text-base leading-relaxed text-muted-foreground">
            SpaceIA integra IA, IoT y robótica para automatizar procesos,
            modernizar espacios y elevar la experiencia de cada estudiante.
          </p>

          <div class="flex flex-wrap gap-3">
            <a hlmBtn size="lg" routerLink="/cotizador">Solicitar cotización</a>
            <a hlmBtn size="lg" variant="ghost" routerLink="/spaceai">Conocer productos</a>
          </div>
        </div>

        <!-- Right: campus graph -->
        <div @fadeSlideInDelay class="flex items-center justify-center">
          <app-campus-graph />
        </div>

      </div>
    </section>
  `,
})
export class Hero {}
