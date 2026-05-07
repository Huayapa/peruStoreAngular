import { Component, inject, signal } from '@angular/core';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { AuthService } from '../../../../core/services/auth';
import { ILoginRequest } from '../../../../core/interfaces/auth.interfaces';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  private readonly _fbNon = inject(NonNullableFormBuilder);
  private readonly _auth = inject(AuthService);
  readonly APP_ROUTES = APP_ROUTES;
  isLoading = signal(false);
  hidePassword = true;
  form = this._fbNon.group({
    user: ['mor_2314', [Validators.required]],
    password: ['83r5^_', [Validators.required, Validators.minLength(4)]],
  });

  send() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const user: ILoginRequest = {
      username: this.form.get('user')!.value,
      password: this.form.get('password')!.value,
    };
    this.isLoading.set(true);
    this._auth.login(user).subscribe({
      next: () => {
        console.log('autenticado');
        this.form.reset();
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
