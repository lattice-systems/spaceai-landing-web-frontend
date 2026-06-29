import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({ selector: 'ng-template[spartanStepContent]' })
export class SpartanStepContent<C> {
  public readonly template = inject<TemplateRef<C>>(TemplateRef);
}
