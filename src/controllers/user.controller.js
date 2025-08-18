/** @format */

// src/controllers/user.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../models/index.js";

import dotenv from 'dotenv';
dotenv.config();

const { User } = db;

export const signup = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Hash du mot de passe pour sécurité
		const hashedPassword = await bcrypt.hash(password, 10);

		// Création de l'utilisateur dans la DB
		const user = await User.create({ email, password: hashedPassword });

		res.status(201).json({ message: "User created", user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Vérifier si l'utilisateur existe
		const user = await User.findOne({ where: { email } });
		if (!user) return res.status(404).json({ message: "User not found" });

		// Comparer le mot de passe avec le hash stocké
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

		// Générer un token JWT valide 3h
		const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "3h" });

		res.json({ message: "Login successful", token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
