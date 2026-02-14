import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.countDocuments();
  const operators = await User.countDocuments({ role: "operator" });
  const travelers = await User.countDocuments({ role: "traveler" });

  res.json({
    stats: {
      users,
      operators,
      travelers
    }
  });
});

export default router;
