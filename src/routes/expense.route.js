import express from "express";
const router = express.Router();

// Route test
router.get("/", (req, res) => {
  res.send("Expenses route works!");
});

export default router;
