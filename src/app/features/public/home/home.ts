import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from './hero/hero';

@Component({
  selector: 'app-home',
  imports: [Hero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-hero />`,
})
export class Home {}
