import { Component, inject } from '@angular/core';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';

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
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class LoginPage {
  private readonly _fbNon = inject(NonNullableFormBuilder);
  readonly APP_ROUTES = APP_ROUTES;
  hidePassword = true;
  form = this._fbNon.group({
    user: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  send() {
    if (this.form.invalid) return;
    console.log(this.form.invalid);
  }
}
