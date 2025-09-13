/** @format */

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import auth from "./routes/auth.route.js";
import categories from "./routes/categories.route.js";
import changePasswordRoute from "./routes/changePassword.route.js";
import expenses from "./routes/expenses.route.js";
import incomeRoute from "./routes/income.route.js";
import receipts from "./routes/receipts.route.js";
import summary from "./routes/summary.route.js";

import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yamljs";
import requireAuth from "./middleware/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, "../api.docs.yaml"));

const PORT = process.env.PORT || 8080;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://personnal-finance-tracker-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());


app.use(cookieParser(process.env.COOKIE_SECRET || "set_a_cookie_secret"));

// Routes
app.use("/api/auth", auth);
app.use("/api/expenses", requireAuth, expenses);
app.use("/api/incomes", incomeRoute);
app.use("/api/categories", requireAuth, categories);
app.use("/api/summary", requireAuth, summary);
app.use("/api/receipts", requireAuth, receipts);
app.use("/api/user", changePasswordRoute);

// Docs Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
