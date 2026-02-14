import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// -----------------------
// REGISTER USER (ALL ROLES)
// -----------------------
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      boatName,
      boatCapacity,
      adminKey,
    } = req.body;

    // Validate role
    if (!["traveler", "operator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Admin secret key check
    if (role === "admin") {
      if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res
          .status(403)
          .json({ message: "Invalid admin registration key" });
      }
    }

    // Operator required fields
    if (role === "operator" && (!boatName || !boatCapacity)) {
      return res
        .status(400)
        .json({ message: "Boat name and capacity are required" });
    }

    // Existing email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role,
      boatName: role === "operator" ? boatName : undefined,
      boatCapacity: role === "operator" ? boatCapacity : undefined,
      verificationToken,
    });

    // Send verification email
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your account",
      html: `
        <h3>Welcome to Island Boat Transfers</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}">Verify Email</a>
      `,
    });

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------
// LOGIN
// -----------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        boatName: user.boatName,
        boatCapacity: user.boatCapacity,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------
// EMAIL VERIFICATION
// -----------------------
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
