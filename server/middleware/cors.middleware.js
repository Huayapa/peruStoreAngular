export const corsMiddleware = (req, res, next) => {
  const allowOriginUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:4200' : process.env.CLIENT_URL || 'http://localhost:4200' // http://localhost:4200 | *
  res.setHeader('Access-Control-Allow-Origin', allowOriginUrl);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
};
