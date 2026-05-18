import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StripeService } from '../../../../core/services/stripe';
import { CartProductsService } from '../../../../core/services/cart-products';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { APP_ROUTES } from '../../../../core/constants/app-routes';

@Component({
  selector: 'app-checkout',
  imports: [MatProgressSpinner, CurrencyPipe, MatIcon, MatAnchor],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export default class CheckoutPage implements OnInit {
  private readonly _stripe = inject(StripeService);
  private readonly _cart = inject(CartProductsService);
  readonly errorMessage = signal('');
  readonly loading = signal(false);
  readonly cart = toSignal(this._cart.cartproduct$, { initialValue: null });
  readonly pricetotal = toSignal(this._cart.totalPrice$, { initialValue: 0 });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    await this._stripe.init();
    const cart = await firstValueFrom(this._cart.cartproduct$);
    const clientSecret = await this._stripe.createPaymentIntent(cart);
    this._stripe.mountElements(clientSecret);
    this.loading.set(false);
  }

  async pay(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    const { error } = await this._stripe.confirmPayment(
      `${window.location.origin}/${APP_ROUTES.CART.ROOT}/${APP_ROUTES.CART.SUCCESS.ROOT}`,
    );
    if (error) {
      this.errorMessage.set(error.message ?? 'Error desconocido');
    }
    this.loading.set(false);
  }
}
