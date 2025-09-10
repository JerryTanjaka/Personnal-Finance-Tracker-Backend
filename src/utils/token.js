import { signAccessToken, signRefreshToken } from './jwt.js';

export const issueTokens = async (user, rememberMe) => {
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, rememberMe }, { expiresIn: rememberMe ? (process.env.JWT_REFRESH_EXPIRES || '7d') : 0 });

    return { accessToken, refreshToken };
};