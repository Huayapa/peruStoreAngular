import express from 'express'
import { stripeRoutes } from './stripe/stripe.routes.js'
import orderService from '../services/order.service.js';

export const indexRoutes = express.Router()

indexRoutes.use('/stripe', stripeRoutes)

if (process.env.NODE_ENV === 'development') {
  indexRoutes.get('/debug/orders', (req, res) => {
    res.json(orderService.getAllOrders());
  });
}

indexRoutes.get('/health', (req, res) => {
  res.sendStatus(200)
})