import express from 'express';
import dotenv from 'dotenv';
import { validateEnv } from './config/env.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { rateLimitMiddleware } from './middleware/rate-limit.middleware.js';
import { securityMiddleware } from './middleware/security.middleware.js';
import { indexRoutes } from './routes/index.routes.js';
import { stripeWebhookController } from './controllers/stripe.webhook.controller.js';

dotenv.config();
validateEnv();

const app = express();
app.use(securityMiddleware);
app.use(express.static('public'));

app.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookController);

app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(express.json());

app.use('/', indexRoutes);

app.listen(3000, () => console.log('Escuchando el puerto 3000'));
