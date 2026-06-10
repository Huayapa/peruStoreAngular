import express from 'express';
import CartService from '../../services/cart.service.js';
import StripeService from '../../services/stripe.service.js';
import {
  cancelPaymentIntent,
  createPaymentIntent,
  updatePaymentIntent,
} from '../../controllers/stripe.payment-intent.controller.js';
import { validateSessionMiddleware } from '../../middleware/validate-session.middleware.js';

export const stripeRoutes = express.Router();

stripeRoutes.post('/payment-intent', createPaymentIntent);

stripeRoutes.patch('/payment-intent', validateSessionMiddleware, updatePaymentIntent);

stripeRoutes.delete('/payment-intent', validateSessionMiddleware, cancelPaymentIntent);
