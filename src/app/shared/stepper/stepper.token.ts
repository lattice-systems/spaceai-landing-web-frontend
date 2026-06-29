import { InjectionToken, type ValueProvider, inject } from '@angular/core';
import type { SpartanStepperIndicatorMode } from './spartan-step-header';

export interface SpartanStepperConfig {
  animationEnabled: boolean;
  animationDuration: number;
  defaultIndicatorMode: SpartanStepperIndicatorMode;
}

const defaultConfig: SpartanStepperConfig = {
  animationEnabled: true,
  animationDuration: 300,
  defaultIndicatorMode: 'state',
};

const SpartanStepperConfigToken = new InjectionToken<SpartanStepperConfig>('spartanStepperConfig');

export function provideSpartanStepperConfig(config: Partial<SpartanStepperConfig>): ValueProvider {
  const merged = { ...defaultConfig, ...config };
  return { provide: SpartanStepperConfigToken, useValue: merged };
}

export function injectSpartanStepperConfig(): SpartanStepperConfig {
  return inject(SpartanStepperConfigToken, { optional: true }) ?? defaultConfig;
}
