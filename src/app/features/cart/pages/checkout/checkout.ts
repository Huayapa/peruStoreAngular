import { Component, inject, OnInit, signal } from '@angular/core';
import { StripeService } from '../../../../core/services/stripe';
import { CartProductsService } from '../../../../core/services/cart-products';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { HttpErrorResponse } from '@angular/common/http';
import { ICartItems } from '../../../../core/interfaces/cart.interfaces';
import { firstValueFrom } from 'rxjs';

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
  readonly products = signal<ICartItems[]>([]);
  readonly pricetotal = signal(0);
  readonly clientSecret = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this._stripe.init();
    this.loading.set(true);

    try {
      const cart = await firstValueFrom(this._cart.cartproduct$);
      if (!cart.products.length) {
        this.errorMessage.set('Debes agregar productos antes de continuar.');
        return;
      }
      const { clientSecret, products, price } = await this._stripe.createPaymentIntent(
        cart,
        this.clientSecret() ?? null,
      );
      this._stripe.mountElements(clientSecret);
      this.clientSecret.set(clientSecret);
      this.products.set(products);
      this.pricetotal.set(price / 100);
      this._cart.updateCartItems(products);
    } catch (err: unknown) {
      if (err instanceof HttpErrorResponse && err.status === 400) {
        this.errorMessage.set('El carrito está vacío o contiene datos inválidos.');
      }
    } finally {
      this.loading.set(false);
    }
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
