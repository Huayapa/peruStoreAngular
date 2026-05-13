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
    const isValidForm = Object.values(this.form.controls).some((control) => control.value !== '');
    if (isValidForm) e.preventDefault();
  }

  canDeactivate(): MaybeAsync<GuardResult> {
    if (this.allowNavigation) return true;
    const isValidForm = Object.values(this.form.controls).some((control) => control.value !== '');
    if (isValidForm) {
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
}
