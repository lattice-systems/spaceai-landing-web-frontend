export * from './spartan-step';
export * from './spartan-step-content';
export * from './spartan-step-header';
export * from './spartan-step-label';
export * from './spartan-stepper';
export * from './spartan-stepper-buttons';
export * from './stepper.token';

import { SpartanStep } from './spartan-step';
import { SpartanStepContent } from './spartan-step-content';
import { SpartanStepHeader } from './spartan-step-header';
import { SpartanStepLabel } from './spartan-step-label';
import { SpartanStepper } from './spartan-stepper';
import { SpartanStepperNext, SpartanStepperPrevious } from './spartan-stepper-buttons';

export const SpartanStepperImports = [
  SpartanStepper,
  SpartanStep,
  SpartanStepHeader,
  SpartanStepperNext,
  SpartanStepperPrevious,
  SpartanStepContent,
  SpartanStepLabel,
] as const;
