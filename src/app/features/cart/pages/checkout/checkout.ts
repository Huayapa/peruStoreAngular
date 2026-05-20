import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { StripeService } from '../../../../core/services/stripe';
import { CartProductsService } from '../../../../core/services/cart-products';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { HttpErrorResponse } from '@angular/common/http';
import { ICartItems, ICartProduct } from '../../../../core/interfaces/cart.interfaces';
import { ActivatedRoute } from '@angular/router';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormDeactivateAbstract } from '../../../../shared/abstracts/form-deactivate.abstract';
import { IPaymentIntent } from '../../../../core/interfaces/stripe.interfaces';

@Component({
  selector: 'app-checkout',
  imports: [
    MatProgressSpinner,
    CurrencyPipe,
    MatIcon,
    MatAnchor,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatHint,
    ReactiveFormsModule,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export default class CheckoutPage extends FormDeactivateAbstract implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _stripe = inject(StripeService);
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _routeActive = inject(ActivatedRoute);
  private readonly _cart = inject(CartProductsService);
  readonly errorMessage = signal('');
  readonly loading = signal(false);
  readonly products = signal<ICartItems[]>([]);
  readonly pricetotal = signal(0);
  readonly clientSecret = signal<string | null>(null);

  readonly form = this._fb.group({
    contact: this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-().]{7,15}$/)]],
    }),
    address: this._fb.group({
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      zipcode: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(5),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
    }),
    stripeReady: [false, Validators.requiredTrue],
  });

  ngOnInit(): void {
    const error = this._routeActive.snapshot.queryParamMap.get('payment_error');
    if (error) this.errorMessage.set(error);

    this._stripe.init().then(() => {
      this._cart.cartproduct$
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((cart) => this.handleCartChange(cart));
    });
  }

  private async handleCartChange(cart: ICartProduct) {
    if (!cart.products.length) {
      this.errorMessage.set('Debes agregar productos antes de continuar.');
      return;
    }
    this.loading.set(true);
    try {
      const intent = await this._stripe.createPaymentIntent(cart, this.clientSecret());
      this.applyPaymentIntent(intent);
    } catch (err) {
      this.handleError(err);
    } finally {
      this.loading.set(false);
    }
  }

  private applyPaymentIntent({ clientSecret, products, price }: IPaymentIntent) {
    this.clientSecret.set(clientSecret);
    this.products.set(products);
    this.pricetotal.set(price / 100);
    this._cart.updateCartItems(products);
    this._stripe.mountElements(clientSecret);
    this.form.get('stripeReady')?.setValue(true);
    this.errorMessage.set('');
  }

  private handleError(err: unknown) {
    if (!(err instanceof HttpErrorResponse)) return;
    const messages: Record<number, string> = {
      400: 'El carrito está vacío o contiene datos inválidos.',
      0: 'Servicio no disponible. Por favor intente más tarde.',
    };
    this.errorMessage.set(messages[err.status] ?? 'Error desconocido.');
  }

  async pay(e: Event) {
    e.preventDefault();
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.allowNavigation = true;
    this.loading.set(true);
    const { error } = await this._stripe.confirmPayment(
      `${window.location.origin}/${APP_ROUTES.CART.ROOT}/${APP_ROUTES.CART.SUCCESS.ROOT}`,
    );
    if (error) {
      this.errorMessage.set(error.message ?? 'Error desconocido');
    }
    this.loading.set(false);
  }

  getError(control: AbstractControl | null): string | null {
    if (!control || !control.errors || !control.touched) return null;
    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('minlength'))
      return `No debe ser menor a ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.hasError('maxlength'))
      return `No debe exceder a ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.hasError('email')) return `Correo Inválido`;
    if (control.hasError('pattern')) return `Formato Inválido`;
    return null;
  }
}
