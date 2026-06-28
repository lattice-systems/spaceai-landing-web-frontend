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
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeSlideInDelay', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms 180ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <section class="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden md:flex-row">

      <div
        class="pointer-events-none absolute inset-0"
        style="background: radial-gradient(ellipse 65% 90% at 78% 50%, oklch(0.715 0.143 215.221 / 0.09) 0%, transparent 60%)"
        aria-hidden="true"
      ></div>

      <!-- Left: copy -->
      <div
        @fadeSlideIn
        class="relative z-10 flex flex-col justify-center gap-6 px-6 py-24 sm:px-10 md:w-1/2 md:max-w-[580px] md:py-0 lg:pl-16 xl:pl-24"
      >
        <!-- Social proof indicator — replaces generic description badge -->
        <div class="flex items-center gap-2">
          <span class="size-2 animate-pulse rounded-full bg-primary/70" aria-hidden="true"></span>
          <span class="text-xs font-medium text-muted-foreground">
            3 instituciones piloto · Noroeste de México
          </span>
        </div>

        <!-- Editorial headline: specific, tactical, product-grounded -->
        <h1 class="text-5xl font-extrabold leading-[1.06] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
          El campus que ya<br class="hidden sm:block" /> sabe quién eres.
        </h1>

        <p class="max-w-md text-base leading-relaxed text-muted-foreground">
          Cada acceso. Cada consulta. Cada decisión.
          SpaceIA conecta IA, IoT y robótica en el sistema nervioso de tu campus.
        </p>

        <div class="flex flex-wrap gap-3">
          <a hlmBtn size="lg" routerLink="/cotizador">Solicitar cotización</a>
          <a hlmBtn size="lg" variant="ghost" routerLink="/spaceai">Ver el ecosistema</a>
        </div>
      </div>

      <!-- Right: graph -->
      <div
        @fadeSlideInDelay
        class="relative hidden md:flex md:w-1/2 md:items-center md:justify-center md:pr-6 lg:pr-12"
      >
        <app-campus-graph />
      </div>

    </section>
  `,
})
export class Hero {}
