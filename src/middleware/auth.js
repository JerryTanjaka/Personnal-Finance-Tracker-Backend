import { verifyAccessToken } from "../utils/jwt.js";

const requireAuth = (req, res, next) => {
  const auth = req.signedCookies["access_token"] || null;
  const [scheme, token] = auth?.split(" ") || [null, null];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export default requireAuth;
