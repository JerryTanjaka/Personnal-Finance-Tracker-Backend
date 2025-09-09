import db from '../models/index.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './jwt.js';

export const issueTokens = async (user, rememberMe) => {
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id }, { expiresIn: rememberMe ? '30d' : process.env.JWT_REFRESH_EXPIRES || '7d' });

    const decoded = verifyRefreshToken(refreshToken);
    const expires_at = new Date(decoded.exp * 1000);

    await db.RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expires_at,
    });

    return { accessToken, refreshToken };
};