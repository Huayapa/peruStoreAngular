import { MaybeAsync, GuardResult } from '@angular/router';
import { CanComponentDeactivate } from '../../core/guards/exit-form-guard';
import { Directive, HostListener, inject } from '@angular/core';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Directive()
export abstract class FormDeactivateAbstract implements CanComponentDeactivate {
  readonly _dialog = inject(MatDialog);
  abstract form: FormGroup;
  protected allowNavigation = false;

  @HostListener('window:beforeunload', ['$event'])
  onBeforeReload(e: BeforeUnloadEvent) {
    if (!this.allowNavigation && this.hasFormChanges()) e.preventDefault();
  }

  canDeactivate(): MaybeAsync<GuardResult> {
    if (this.allowNavigation) return true;
    if (this.hasFormChanges()) {
      const dialog = this._dialog.open(ConfirmDialog, {
        width: '350px',
        enterAnimationDuration: '100ms',
        exitAnimationDuration: '100ms',
        data: {
          title: 'Los datos se perderan',
          message: '¿Seguro que deseas salir? Los cambios que implemento se perderán.',
        },
      });
      return dialog.afterClosed();
    }
    return true;
  }

  private hasFormChanges(): boolean {
    return Object.entries(this.form.controls)
      .filter(([key]) => key !== 'stripeReady')
      .some(([, control]) => {
        const value = control.value;
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some((v) => v !== '');
        }
        return value !== '';
      });
  }
}
