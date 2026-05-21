import { inject, Injectable } from '@angular/core';
import { Appearance, loadStripe, Stripe, StripeElements, StripeError } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { ICartProduct } from '../interfaces/cart.interfaces';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CartAdapter } from '../adapters/cart.adapter';
import { IPaymentIntent } from '../interfaces/stripe.interfaces';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private readonly _http = inject(HttpClient);
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private apiUrl = 'http://localhost:3000/stripe';

  private appearance: Appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#f05a28',
      colorBackground: '#f05a2820',
      colorText: '#1c1c1c',
      colorDanger: '#ff4757',
      fontFamily: 'sans-serif',
      borderRadius: '5px',
    },
    rules: {
      '.Block': {
        backgroundColor: '#f05a2820',
      },
    },
  };

  async init() {
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublicKey);
    }
  }
  async createPaymentIntent(
    cart: ICartProduct,
    clientSecretkey: string | null,
  ): Promise<IPaymentIntent> {
    return await firstValueFrom(
      this._http.post<IPaymentIntent>(`${this.apiUrl}/create-payment-intent`, {
        cart: CartAdapter.toAPI(cart),
        clientSecretkey,
      }),
    );
  }

  mountElements(clientSecret: string) {
    if (!this.stripe) throw new Error('Stripe not inicializado');
    if (this.elements) {
      const existing = this.elements.getElement('payment');
      if (existing) existing.destroy();
    }
    this.elements = this.stripe.elements({
      appearance: this.appearance,
      clientSecret,
    });
    const paymentElement = this.elements.create('payment', {
      layout: 'tabs',
    });
    paymentElement.mount('#payment-element');
  }

  async confirmPayment(returnUrl: string): Promise<{ error?: StripeError }> {
    if (!this.stripe || !this.elements) throw new Error('Stripe not inicializado');
    return this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: { return_url: returnUrl },
    });
  }
}
