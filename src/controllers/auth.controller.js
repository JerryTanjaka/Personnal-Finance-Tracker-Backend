import db from '../models/index.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import createDefaultCategory from '../utils/createBaseCategory.js';
import { OAuth2Client } from 'google-auth-library';
import cookieParser from 'cookie-parser';
import express from "express";
import { issueTokens } from '../utils/token.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const signCookie = cookieParser(process.env.COOKIE_SECRET || 'set_a_cookie_secret_please')
const accessCookieMaxAge = 1000 * 60 * (parseFloat(process.env.COOKIE_ACCESS_EXPIRES || 45))

// Register
export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'email & password required' });

        const exists = await db.User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ message: 'email already used' });

        const user = await db.User.create({ email, password });
        const userTokens = await issueTokens(user, false);

        await createDefaultCategory(user.id)

        return res
            .status(201)
            .json({ user: { id: user.id, email: user.email }, ...userTokens });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error', error: e.message });
    }
};

// Login
export const login = express().use(signCookie, async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const user = await db.User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid Credentials' });

        const ok = await user.checkPassword(password);
        if (!ok) return res.status(401).json({ message: 'Invalid Credentials' });

        const tokens = await issueTokens(user, rememberMe);
        return res.status(200)
            .cookie('access_token', `Bearer ${tokens.accessToken}`, { signed: true, maxAge: accessCookieMaxAge })
            .cookie('refresh_token', `Bearer ${tokens.refreshToken}`, { signed: true, maxAge: 1000 * 60 * 60 * 24 * (rememberMe ? parseFloat(process.env.COOKIE_REFRESH_EXPIRES || 7) : 0) })
            .json({ user: { id: user.id, email: user.email } });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error', error: e.message });
    }
});

// Google Login
export const googleLogin = express().use(signCookie, async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        return res.status(400).json({ message: 'Google access token is required' });
    }

    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info from Google');
        }

        const data = await response.json();
        const { email } = data;

        let user = await db.User.findOne({ where: { email } });

        if (!user) {
            user = await db.User.create({ email, password: Math.random().toString(36).slice(-8) });
            await createDefaultCategory(user.id);
        }

        const tokens = await issueTokens(user, true);
        return res.status(200)
            .cookie('access_token', `Bearer ${tokens.accessToken}`, { signed: true, maxAge: accessCookieMaxAge })
            .cookie('refresh_token', `Bearer ${tokens.refreshToken}`, { signed: true, maxAge: (1000 * 60 * 60 * 24 * 30) })
            .json({ user: { id: user.id, email: user.email } });
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ message: 'Invalid Google token' });
    }
});

export const refreshLogin = express().use(signCookie, async (req, res) => {
    const refresh_token = cookieParser.signedCookie(req.signedCookies["refresh_token"], process.env.COOKIE_SECRET || 'set_a_cookie_secret_please')?.split(" ")[1] || null
    if (!refresh_token) return res.status(401).json({ message: "No refresh token found" })

    try {
        const decoded_token = verifyRefreshToken(refresh_token)
        if (new Date(decoded_token.exp * 1000) > new Date()) {

            const user = await db.User.findOne({ where: { id: decoded_token.sub } })
            const tokens = await issueTokens(user, true)

            return res.status(200)
                .cookie('access_token', `Bearer ${tokens.accessToken}`, { signed: true, maxAge: accessCookieMaxAge })
                .json({ user: { id: user.id, email: user.email } });
        }

        return res.status(401).json({ message: "Refresh token is expired" })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Failed to check refresh token" })
    }
})

// Return authenticated user's profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await db.User.findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ id: user.id, email: user.email, createdAt: user.createdAt });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error', error: e.message });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { oldPassword, newPassword } = req.body;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old and new password required' });
        }
        const user = await db.User.findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const ok = await user.checkPassword(oldPassword);
        if (!ok) return res.status(401).json({ message: 'Old password incorrect' });
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error', error: e.message });
    }
};
