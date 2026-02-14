import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * Register (traveler / operator / admin)
 */
router.post("/register", registerUser);

/**
 * Login
 */
router.post("/login", loginUser);

/**
 * Email verification
 */
router.get("/verify-email/:token", verifyEmail);

export default router;
