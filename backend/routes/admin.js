import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * GET /api/admin/dashboard
 * Admin-only dashboard stats
 */
router.get("/dashboard", authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: "admin" });
    const operators = await User.countDocuments({ role: "operator" });
    const travelers = await User.countDocuments({ role: "traveler" });

    res.json({
      stats: {
        totalUsers,
        admins,
        operators,
        travelers,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
