import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { CdkStep } from '@angular/cdk/stepper';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  contentChild,
  effect,
  inject,
  input,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { SpartanStepContent } from './spartan-step-content';
import { SpartanStepLabel } from './spartan-step-label';

@Component({
  selector: 'spartan-step',
  exportAs: 'spartanStep',
  imports: [CdkPortalOutlet],
  providers: [{ provide: CdkStep, useExisting: SpartanStep }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { hidden: '' },
  template: `
    <ng-template>
      <ng-content />
      <ng-template [cdkPortalOutlet]="portal" />
    </ng-template>
  `,
})
export class SpartanStep extends CdkStep {
  private readonly _vcr        = inject(ViewContainerRef);
  private readonly _destroyRef = inject(DestroyRef);

  public readonly icon             = input<string | null>(null);
  public readonly stepLabelContent = contentChild(SpartanStepLabel);
  private readonly _lazyContent   = contentChild(SpartanStepContent);

  public portal: TemplatePortal | null = null;

  constructor() {
    super();
    effect(() => {
      const isSelected  = this.isSelected();
      const lazyContent = this._lazyContent();
      untracked(() => {
        if (isSelected && lazyContent && !this.portal) {
          this.portal = new TemplatePortal(lazyContent.template, this._vcr);
        }
      });
    });
    this._destroyRef.onDestroy(() => { if (this.portal?.isAttached) this.portal.detach(); });
  }
}
