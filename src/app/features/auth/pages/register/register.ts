import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth';
import { IRegisterRequest } from '../../../../core/interfaces/auth.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  crossPasswordCustomValidation,
  PasswordStateMatcher,
} from '../../validators/cross-password.validator';
import { FormDeactivateAbstract } from '../../../../shared/abstracts/form-deactivate.abstract';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
