import db from "../models/index.js";

export default async function createDefaultCategory(userId) {
    const defaultOptions = { is_default: true, user_id: userId }
    const defaultCategories = [
        { name: "Food", ...defaultOptions },
        { name: "Entertainment", ...defaultOptions },
        { name: "Transport", ...defaultOptions },
        { name: "Utilities", ...defaultOptions },
        { name: "Coffee", ...defaultOptions },
        { name: "Doctor", ...defaultOptions }
    ]
    await db.Category.bulkCreate(defaultCategories)
        .then(() => console.log("Created default categories successfully"))
        .catch(rej => console.log({ message: "Failed to create default categories", error: rej.message }))
    return;
}