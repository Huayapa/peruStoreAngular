import { Component, inject, signal } from '@angular/core';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { AuthService } from '../../../../core/services/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
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
    MatError,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class LoginPage {
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _fbNon = inject(NonNullableFormBuilder);
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);
  readonly APP_ROUTES = APP_ROUTES;
  readonly isLoading = signal(false);
  hidePassword = true;

  form = this._fbNon.group({
    username: ['mor_2314', [Validators.required]],
    password: ['83r5^_', [Validators.required, Validators.minLength(4)]],
  });

  openSnackBar() {
    this._snackBar.open('Sesión iniciada con exito', 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'success-snackbar',
    });
  }

  send() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.isLoading.set(true);
    this._auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset();
        this.isLoading.set(false);
        this.openSnackBar();
        this._router.navigate([APP_ROUTES.HOME.ROOT]);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
