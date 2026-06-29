import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { SpartanStep } from './spartan-step';
import { SpartanStepHeader, SpartanStepperIndicatorMode, SpartanStepperLabelPosition } from './spartan-step-header';
import { SpartanStepLabel } from './spartan-step-label';
import { injectSpartanStepperConfig } from './stepper.token';

export type SpartanStepperHeaderPosition = 'top' | 'bottom';

@Component({
  selector: 'spartan-stepper',
  imports: [CdkStepperModule, NgTemplateOutlet, SpartanStepHeader],
  providers: [{ provide: CdkStepper, useExisting: SpartanStepper }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex w-full flex-col gap-6">
      <!-- Step indicators -->
      <ol class="flex w-full items-center" role="tablist" aria-orientation="horizontal">
        @for (step of steps; track step) {
          <li class="flex min-w-0 items-center">
            <spartan-step-header
              cdkStepHeader
              class="min-w-0"
              (click)="step.select()"
              (keydown)="_onKeydown($event)"
              [tabIndex]="_getFocusIndex() === step.index() ? 0 : -1"
              [id]="_getStepLabelId(step.index())"
              role="tab"
              [attr.aria-posinset]="step.index() + 1"
              [attr.aria-setsize]="steps.length"
              [attr.aria-selected]="step.isSelected()"
              [attr.aria-controls]="_getStepContentId(step.index())"
              [attr.aria-label]="step.ariaLabel || null"
              [attr.aria-disabled]="!step.isNavigable() ? 'true' : null"
              [index]="step.index()"
              [state]="step.indicatorType()"
              [label]="_stepLabel(step)"
              [selected]="step.isSelected()"
              [reached]="step.index() < selectedIndex"
              [active]="step.isNavigable()"
              [optional]="step.optional"
              [errorMessage]="step.errorMessage"
              [disabled]="linear && !step.isNavigable()"
              [labelPosition]="labelPosition()"
              [indicatorMode]="indicatorMode()"
              [icon]="_stepIcon(step)"
            />
          </li>

          @if (!$last) {
            <li class="mx-3 flex min-w-8 flex-1 items-center" aria-hidden="true">
              <span class="bg-border relative h-px w-full overflow-hidden rounded">
                <span
                  class="bg-primary absolute inset-y-0 start-0 transition-[width] duration-300"
                  [style.width.%]="step.index() < selectedIndex ? 100 : 0"
                ></span>
              </span>
            </li>
          }
        }
      </ol>

      <!-- Step content -->
      <div class="relative min-h-0 overflow-hidden">
        @for (activeIndex of [selectedIndex]; track activeIndex) {
          <section
            role="tabpanel"
            [id]="_getStepContentId(activeIndex)"
            [attr.aria-labelledby]="_getStepLabelId(activeIndex)"
          >
            <ng-container [ngTemplateOutlet]="steps.get(activeIndex)?.content" />
          </section>
        }
      </div>
    </div>
  `,
})
export class SpartanStepper extends CdkStepper {
  private readonly _config = injectSpartanStepperConfig();

  public readonly labelPosition  = input<SpartanStepperLabelPosition>('end');
  public readonly indicatorMode  = input<SpartanStepperIndicatorMode>('state');
  public readonly animationsEnabled = input(this._config.animationEnabled, { transform: booleanAttribute });
  public readonly animationDuration = input(this._config.animationDuration, { transform: numberAttribute });

  protected readonly _animDir = signal<'forward' | 'backward'>('forward');

  constructor() {
    super();
    this.selectionChange.pipe(
      tap(e => this._animDir.set(e.selectedIndex < e.previouslySelectedIndex ? 'backward' : 'forward')),
      takeUntilDestroyed(),
    ).subscribe();
  }

  override next(): void {
    this.selected?.stepControl?.markAllAsTouched();
    this.selected?.stepControl?.updateValueAndValidity();
    if (this.linear && this.selected?.stepControl?.invalid) return;
    super.next();
  }

  protected _stepIcon(step: CdkStep): string | null {
    return step instanceof SpartanStep ? step.icon() : null;
  }

  protected _stepLabel(step: CdkStep): string | SpartanStepLabel | null {
    return step instanceof SpartanStep ? (step.stepLabelContent() ?? step.label) : step.label;
  }
}
