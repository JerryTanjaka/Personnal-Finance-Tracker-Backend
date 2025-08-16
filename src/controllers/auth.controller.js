import { Router } from 'express';
import db from '../models/index.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const router = Router();

// Utils
const issueTokens = async (user) => {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id });

  const decoded = verifyRefreshToken(refreshToken);
  const expires_at = new Date(decoded.exp * 1000);

  await db.RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expires_at,
  });

  return { accessToken, refreshToken };
};

// Register
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'email & password required' });

    const exists = await db.User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'email already used' });

    const user = await db.User.create({ email, password });
    const tokens = await issueTokens(user);

    return res
      .status(201)
      .json({ user: { id: user.id, email: user.email }, ...tokens });
  } catch (e) {
    return res.status(500).json({ message: 'Server Error', error: e.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid Credentials' });

    const ok = await user.checkPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid Credentials' });

    const tokens = await issueTokens(user);
    return res.json({ user: { id: user.id, email: user.email }, ...tokens });
  } catch (e) {
    return res.status(500).json({ message: 'Server Error', error: e.message });
  }
};
