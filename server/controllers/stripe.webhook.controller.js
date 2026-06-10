import { inject } from "vitest";
import orderService from "../services/order.service.js";
import stripeService from "../services/stripe.service.js";
import checkoutSessionService from "../services/checkoutSession.service.js";

export async function stripeWebhookController(req, res) {
  let event;
  const signature = req.headers['stripe-signature'];

  try {
    event = stripeService.constructWebHookEvent(req.body, signature);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).json({ message: err.message });
  }

  try {
    await handlerEventWebhookStripe(event)
  } catch (err) {
    return res.status(500).json({ message: 'Fallo al manejar el webhook' });
  }

  return res.json({ received: true });
}

/** @param {import('stripe').Stripe.Event} event */
async function handlerEventWebhookStripe(event) {
  const paymentIntent = event.data.object;
  if(!orderService.getOrderById(paymentIntent.id)) return

  if(event.type === 'payment_intent.amount_capturable_updated') {
    try {
      const { name, email, phone, city, state, zipcode, address, token } = paymentIntent.metadata;
      if(!name || !email || !phone || !city || !state || !zipcode || !address || !token) {
        await stripeService.cancelPaymentIntent(paymentIntent.id);
        return;
      }
      const order = orderService.getOrderById(paymentIntent.id)
      if(!order?.extraInformation) {
        await stripeService.cancelPaymentIntent(paymentIntent.id);
        return
      }
      await stripeService.capturePaymentIntent(paymentIntent.id);
    } catch (err) {
      console.error('Error al capturar el pago', err.message);
    }
  }

  if(event.type === 'payment_intent.succeeded') {
    try {
      orderService.changeStatus(paymentIntent.id, 'paid')
      const { token } = paymentIntent.metadata;
      checkoutSessionService.removeSession(token)
      // Enviar correo a usuario
    } catch (err) {
      console.error('Error al procesar el pago', err.message)
    }
  }
  
  if(event.type === 'payment_intent.canceled') {
    try {
      orderService.changeStatus(paymentIntent.id, 'cancelled')
      checkoutSessionService.removeSession(token)
      // Enviar correo a usuario
    } catch (err) {
      console.error('Error al cancelar el pago', err.message)
    }
  }
}