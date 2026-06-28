import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .cta-glow {
      background: radial-gradient(
        ellipse 60% 55% at 50% 50%,
        oklch(0.609 0.126 221.723 / 0.07) 0%,
        transparent 65%
      );
    }
    .header-anim {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
      transition:
        opacity 700ms cubic-bezier(0.23, 1, 0.32, 1),
        transform 700ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    .header-anim.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .btns-anim {
      opacity: 0;
      transform: translateY(12px);
      transition:
        opacity 600ms cubic-bezier(0.23, 1, 0.32, 1),
        transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    .btns-anim.visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media (prefers-reduced-motion: reduce) {
      .header-anim, .btns-anim { transition: none; opacity: 1; transform: none; }
    }
  `],
  template: `
    <section class="relative py-14 sm:py-20">
      <!-- Centered gradient divider at top -->
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px"
        style="background: linear-gradient(to right, transparent, oklch(0.902 0.006 264.532), transparent)"
        aria-hidden="true"
      ></div>

      <!-- Radial glow -->
      <div class="cta-glow pointer-events-none absolute inset-0" aria-hidden="true"></div>

      <!-- Content -->
      <div class="relative mx-auto max-w-2xl px-6 text-center">

        <div
          #ctaHeader
          class="header-anim"
          [class.visible]="headerVisible()"
        >
          <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Una demo de 30 minutos.<br class="hidden sm:block" />
            <span class="text-primary">Tu propuesta en 48 horas.</span>
          </h2>
          <p class="mb-10 text-base leading-relaxed text-muted-foreground">
            Sin compromiso. Adaptada a las necesidades de tu institución.
          </p>
        </div>

        <div
          #ctaBtns
          class="btns-anim flex flex-col items-center justify-center gap-3 sm:flex-row"
          [class.visible]="btnsVisible()"
        >
          <a hlmBtn size="lg" routerLink="/cotizador">Solicitar cotización</a>
          <a hlmBtn size="lg" variant="outline" routerLink="/contacto">Hablar con un asesor</a>
        </div>
      </div>
    </section>
  `,
})
export class CtaBand {
  protected readonly headerVisible = signal(false);
  protected readonly btnsVisible = signal(false);

  private readonly headerRef = viewChildren<ElementRef>('ctaHeader');
  private readonly btnsRef = viewChildren<ElementRef>('ctaBtns');

  constructor() {
    const el = inject(ElementRef);
    afterNextRender(() => {
      const observe = (ref: ElementRef, onVisible: () => void, delay = 0) => {
        const obs = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) {
            setTimeout(onVisible, delay);
            obs.disconnect();
          }
        }, { threshold: 0.15 });
        obs.observe(ref.nativeElement);
      };

      const h = this.headerRef()[0];
      const b = this.btnsRef()[0];
      if (h) observe(h, () => this.headerVisible.set(true));
      if (b) observe(b, () => this.btnsVisible.set(true), 160);
    });
  }
}
