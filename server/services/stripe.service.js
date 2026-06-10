import Stripe from 'stripe';

class StripeService {
  #stripe = null;

  #getStripe() {
    if (!this.#stripe) {
      this.#stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return this.#stripe
  }

  async createOrUpdatePaymentIntent(amount, paymentIntentId) {
    const stripe = this.#getStripe();
    
    if (paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      const updatableStatuses = ['requires_payment_method', 'requires_confirmation', 'requires_action'];
      
      if (!updatableStatuses.includes(pi.status)) {
        const error = new Error('El intento de pago ya fue procesado.');
        error.statusCode = 400;
        error.code = 'SESSION_ALREADY_PROCESSED'
        throw error;
      }
      return await stripe.paymentIntents.update(paymentIntentId, { amount });
    }

    return await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      capture_method: 'manual',
      payment_method_types: ['card']
    });
  }
  
  async capturePaymentIntent(paymentIntentId) {
    return await this.#getStripe().paymentIntents.capture(paymentIntentId)
  }
  
  async cancelPaymentIntent(paymentIntentId) {
    return await this.#getStripe().paymentIntents.cancel(paymentIntentId)
  }

  async updatePaymentIntentWithOrder(paymentIntentId, orderdata, sessionToken) {
    const stripe = this.#getStripe();
    
    return await stripe.paymentIntents.update(paymentIntentId, {
      receipt_email: orderdata.email,
      metadata: {
        token: sessionToken,
        name: orderdata.name,
        email: orderdata.email,
        phone: orderdata.phone,
        city: orderdata.city,
        state: orderdata.state,
        zipcode: orderdata.zipcode,
        address: orderdata.address,
      },
    });
  }

  constructWebHookEvent(payload, signature) {
    return this.#getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }
}

export default new StripeService()