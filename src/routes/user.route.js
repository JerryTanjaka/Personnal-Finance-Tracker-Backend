import express from "express";
const router = express.Router();

// Route test
router.get("/", (req, res) => {
  res.send("Users route works!");
});

export default router;
