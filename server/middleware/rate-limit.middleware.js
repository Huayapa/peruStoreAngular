import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (req) => {
    return ipKeyGenerator(req)
  },
  handler: (req, res) => {
    return res.status(429).json({ message: 'Demasiadas peticiones, Intentalo más tarde' })
  }
});
