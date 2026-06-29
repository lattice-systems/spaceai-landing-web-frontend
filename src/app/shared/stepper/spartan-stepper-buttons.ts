import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

@Directive({
  selector: 'button[spartanStepperNext]',
  host: { '[type]': 'type', '[style.touch-action]': '"manipulation"' },
})
export class SpartanStepperNext extends CdkStepperNext {}

@Directive({
  selector: 'button[spartanStepperPrevious]',
  host: { '[type]': 'type', '[style.touch-action]': '"manipulation"' },
})
export class SpartanStepperPrevious extends CdkStepperPrevious {}
