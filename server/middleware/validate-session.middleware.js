import checkoutSessionService from '../services/checkoutSession.service.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const validateSessionMiddleware = (req, res, next) => {
  const token = req.headers['x-session-token'];
  if (!token || Array.isArray(token))
    return res.status(401).json({ message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente' });
  const session = checkoutSessionService.getSession(token);
  if (!session) 
    return res.status(401).json({ message: 'Session no valida' });
  next();
};
