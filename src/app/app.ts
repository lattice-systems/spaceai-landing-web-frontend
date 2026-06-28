import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucideArrowRight })],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SpaceIA');

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
