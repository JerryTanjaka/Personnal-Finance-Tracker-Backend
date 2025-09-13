import express from "express";
import cors from "cors";

import auth from "./routes/auth.route.js";
import expenses from "./routes/expenses.route.js";
import categories from "./routes/categories.route.js";
import incomeRoute from "./routes/income.route.js";
import summary from "./routes/summary.route.js";
import receipts from "./routes/receipts.route.js";

import changePasswordRoute from "./routes/changePassword.route.js";

import requireAuth from "./middleware/auth.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

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

app.use("/api/auth", auth);
app.use("/api/expenses", requireAuth, expenses)
app.use("/api/incomes", incomeRoute);
app.use("/api/categories", requireAuth, categories)
app.use("/api/summary", requireAuth, summary)
app.use("/api/receipts", requireAuth, receipts)
app.use("/api/user", changePasswordRoute);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
