import cookieParser from 'cookie-parser';
import { verifyAccessToken } from '../utils/jwt.js';

const requireAuth = (req, res, next) => {
  const auth = cookieParser.signedCookie(
    req.signedCookies["access_token"],
    process.env.COOKIE_SECRET || 'set_a_cookie_secret_please'
  ) || null;

  const [scheme, token] = auth?.split(' ') || [null, null];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

export default requireAuth;
