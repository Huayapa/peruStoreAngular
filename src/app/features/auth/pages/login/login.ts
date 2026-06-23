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
import { catchError, EMPTY, finalize } from 'rxjs';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { AuthService } from '../../../../core/services/auth/auth';
import { FormDeactivateAbstract } from '../../../../shared/abstracts/form-deactivate.abstract';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { CartProductsService } from '../../../../core/services/cart-products/cart-products';

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
export default class LoginPage extends FormDeactivateAbstract {
  private readonly _cartProduct = inject(CartProductsService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _fbNon = inject(NonNullableFormBuilder);
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  readonly APP_ROUTES = APP_ROUTES;
  readonly isLoading = signal(false);
  hidePassword = true;

  readonly form = this._fbNon.group({
    username: ['mor_2314', [Validators.required]],
    password: ['83r5^_', [Validators.required, Validators.minLength(4)]],
  });

  send(e: Event): void {
    e.preventDefault();
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.isLoading.set(true);
    this._auth
      .login(this.form.getRawValue())
      .pipe(
        catchError((err: Error) => {
          this._snackBar.open(err.message, 'Cerrar');
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this.handleLoginSuccess());
  }

  private handleLoginSuccess() {
    const cart = this._cartProduct.getCartStorage();
    if (cart.products.length) {
      this.showReplaceCartDialog();
    } else {
      this.completeLoginProcess(true);
    }
  }

  private showReplaceCartDialog() {
    const dialog = this._dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: '¿Reemplazar carrito?',
        message: '¿Deseas reemplazar tu carrito actual con el de tu cuenta?',
      },
    });
    dialog
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((confirmed) => this.completeLoginProcess(confirmed));
  }

  private completeLoginProcess(loadCartLogin: boolean) {
    if (loadCartLogin) {
      this._cartProduct.loadUserCart();
    }
    this.allowNavigation = true;
    this.form.reset({ username: '', password: '' });
    this.openSnackBar();
    this._router.navigate([APP_ROUTES.HOME.ROOT]);
  }

  private openSnackBar() {
    this._snackBar.open('Sesión iniciada con exito', 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'success-snackbar',
    });
  }
}
