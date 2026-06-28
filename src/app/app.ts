import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  readonly #doc = inject(DOCUMENT);

  constructor() {
    const mq = this.#doc.defaultView!.matchMedia('(prefers-color-scheme: dark)');
    this.#applyDark(mq.matches);
    mq.addEventListener('change', (e) => this.#applyDark(e.matches));
  }

  #applyDark(dark: boolean): void {
    this.#doc.documentElement.classList.toggle('dark', dark);
  }
}
