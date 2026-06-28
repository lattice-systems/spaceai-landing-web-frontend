import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Beneficios } from './beneficios/beneficios';
import { CtaBand } from './cta-band/cta-band';
import { Hero } from './hero/hero';
import { ParticleBg } from './particles/particle-bg';
import { Productos } from './productos/productos';
import { Testimonios } from './testimonios/testimonios';

@Component({
  selector: 'app-home',
  imports: [Hero, Productos, Beneficios, Testimonios, CtaBand, ParticleBg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-particle-bg />
    <app-hero />
    <app-productos />
    <app-beneficios />
    <app-testimonios />
    <app-cta-band />
  `,
})
export class Home {}
