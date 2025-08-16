import express from "express";
import cors from "cors";
import auth from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(express.json())

app.use("/api/auth", auth)

app.listen(PORT, () => {
  console.log(`Server is listen on port ${PORT}`);
});