import { Router } from 'express';
import db from '../models/index.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import createDefaultCategory from '../utils/createBaseCategory.js';

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
        const userTokens = await issueTokens(user);

        await createDefaultCategory(user.id)

        return res
            .status(201)
            .json({ user: { id: user.id, email: user.email }, ...userTokens });
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
        return res.status(200).json({ message: 'Password changed successfully .' });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error', error: e.message });
    }
};
