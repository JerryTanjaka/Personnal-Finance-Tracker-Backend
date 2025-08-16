import { Router } from 'express';
import db from '../models/index.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const router = Router();

const issueTokens = async (user) => {
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id });

    const decoded = verifyRefreshToken(refreshToken); 
    const expiresAt = new Date(decoded.exp * 1000);

    await db.RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt,
    });

    return { accessToken, refreshToken };
}