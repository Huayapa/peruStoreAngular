import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';

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
    MatError,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export default class RegisterPage {
  private readonly _fbNon = inject(NonNullableFormBuilder);
  readonly APP_ROUTES = APP_ROUTES;
  hidePassword = true;
  form = this._fbNon.group({
    user: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatpassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  send() {
    if (this.form.invalid) return;
    console.log(this.form.invalid);
  }
}
