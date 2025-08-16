import express from "express";
import cors from "cors";
import healthCheckRoute from "./routes/health-check.route.js";
import todoRoutes from "./routes/todo.route.js";

const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(express.json())



app.listen(PORT, () => {
  console.log(`Server is listen on port ${PORT}`);
});