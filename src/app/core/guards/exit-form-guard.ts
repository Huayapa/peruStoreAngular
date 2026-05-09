import { CanDeactivateFn, GuardResult, MaybeAsync } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => MaybeAsync<GuardResult> | GuardResult;
}

export const exitFormGuardFn: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
): MaybeAsync<GuardResult> => {
  return component.canDeactivate();
};
