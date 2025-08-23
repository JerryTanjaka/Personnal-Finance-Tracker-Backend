import express from "express";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categories.controller.js"

const categories = express.Router()

categories.get("/", getAllCategories)
categories.post("/", createCategory)
categories.put("/:id", updateCategory)
categories.delete("/:id", deleteCategory)

export default categories