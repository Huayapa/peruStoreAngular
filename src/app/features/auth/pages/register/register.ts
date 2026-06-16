import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { IRegisterRequest } from '../../../../core/interfaces/auth.interfaces';
import { AuthService } from '../../../../core/services/auth/auth';
import { FormDeactivateAbstract } from '../../../../shared/abstracts/form-deactivate.abstract';
import {
  crossPasswordCustomValidation,
  PasswordStateMatcher,
} from '../../validators/cross-password.validator';

@Component({
  selector: 'app-register',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatIconButton,
    MatAnchor,
    RouterLink,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatError,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export default class RegisterPage extends FormDeactivateAbstract {
  private readonly _fbNon = inject(NonNullableFormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);
  readonly APP_ROUTES = APP_ROUTES;
  readonly isLoading = signal(false);
  readonly matcher = new PasswordStateMatcher();
  hidePassword = true;

  readonly form = this._fbNon.group(
    {
      username: ['prueba1', [Validators.required]],
      email: ['prueba@gmail.com', [Validators.required, Validators.email]],
      password: ['12345678', [Validators.required, Validators.minLength(4)]],
      repeatpassword: ['12345678', [Validators.required, Validators.minLength(4)]],
    },
    { validators: crossPasswordCustomValidation },
  );

  openSnackBar() {
    this._snackBar.open(`Registrado Exitosamente:`, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'success-snackbar',
    });
  }

  send(e: Event) {
    e.stopPropagation();
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.isLoading.set(true);
    const { username, email, password } = this.form.getRawValue();
    const newuser: IRegisterRequest = { username, email, password };
    this._auth
      .register(newuser)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.allowNavigation = true;
          this.form.reset({ username: '', email: '', password: '', repeatpassword: '' });
          this.isLoading.set(false);
          this.openSnackBar();
          this._router.navigate([APP_ROUTES.AUTH.ROOT, APP_ROUTES.AUTH.LOGIN.ROOT]);
        },
        error: () => this.isLoading.set(false),
      });
  }
}
