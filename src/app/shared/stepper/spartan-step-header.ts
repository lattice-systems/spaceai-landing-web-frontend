import { CdkStepHeader, StepState } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleAlert } from '@ng-icons/lucide';
import { buttonVariants } from '@spartan-ng/helm/button';
import { SpartanStepLabel } from './spartan-step-label';
import { injectSpartanStepperConfig } from './stepper.token';

export type SpartanStepperIndicatorMode = 'number' | 'state' | 'icon';
export type SpartanStepperLabelPosition = 'end' | 'bottom';

@Component({
  selector: 'spartan-step-header',
  imports: [NgTemplateOutlet, NgIcon],
  providers: [provideIcons({ lucideCheck, lucideCircleAlert })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'group inline-flex shrink-0 outline-none items-center gap-2 touch-manipulation transition-opacity data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
    '[class.flex-col]': 'labelPosition() === "bottom"',
    '[class.text-center]': 'labelPosition() === "bottom"',
    '[attr.data-disabled]': 'disabled() ? "true" : null',
  },
  template: `
    <span aria-hidden="true" [class]="_indicatorClass()">
      @if (_iconName(); as icon) {
        <ng-icon [name]="icon" size="14" />
      } @else {
        <span>{{ index() + 1 }}</span>
      }
    </span>

    <span class="flex min-w-0 touch-manipulation flex-col truncate text-sm font-medium"
      [class.text-destructive]="state() === 'error'">
      @if (_templateLabel(); as tpl) {
        <ng-container [ngTemplateOutlet]="tpl.template" />
      } @else if (_stringLabel(); as str) {
        {{ str }}
      }
      @if (_showErrorLabel()) {
        <span class="text-destructive text-xs">{{ errorMessage() }}</span>
      }
    </span>
  `,
})
export class SpartanStepHeader extends CdkStepHeader {
  private readonly _config = injectSpartanStepperConfig();

  public readonly state        = input<StepState>('number');
  public readonly label        = input<SpartanStepLabel | string | null>(null);
  public readonly errorMessage = input('');
  public readonly index        = input(0, { transform: numberAttribute });
  public readonly selected     = input(false, { transform: booleanAttribute });
  public readonly reached      = input(false, { transform: booleanAttribute });
  public readonly active       = input(false, { transform: booleanAttribute });
  public readonly optional     = input(false, { transform: booleanAttribute });
  public readonly disabled     = input(false, { transform: booleanAttribute });
  public readonly icon         = input<string | null>(null);
  public readonly indicatorMode = input<SpartanStepperIndicatorMode>(this._config.defaultIndicatorMode);
  public readonly labelPosition = input<SpartanStepperLabelPosition>('end');

  protected readonly _stringLabel   = computed(() => { const l = this.label(); return typeof l === 'string' ? l : null; });
  protected readonly _templateLabel = computed(() => { const l = this.label(); return l instanceof SpartanStepLabel ? l : null; });
  protected readonly _showErrorLabel = computed(() => this.state() === 'error' && !!this.errorMessage());

  protected readonly _buttonVariant = computed<'default' | 'outline' | 'destructive'>(() => {
    if (this.state() === 'error') return 'destructive';
    if (this.selected() || this.reached()) return 'default';
    return 'outline';
  });

  protected readonly _indicatorClass = computed(() =>
    buttonVariants({ size: 'icon-sm', variant: this._buttonVariant() })
  );

  protected readonly _iconName = computed(() => {
    const mode = this.indicatorMode();
    if (mode === 'number') return null;
    if (this.state() === 'error') return 'lucideCircleAlert';
    if (mode === 'state' && (this.selected() || this.reached())) return 'lucideCheck';
    return this.icon();
  });
}
