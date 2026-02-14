import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js"; // your email helper

// -----------------------
// REGISTER USER (all roles)
// -----------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, boatName, boatCapacity, adminKey } = req.body;

    // Admin requires a secret key
    if (role === "admin") {
      if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: "Invalid admin registration key" });
      }
    }

    // Check existing email
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const userData = { name, email, password, role, verificationToken };

    // Add operator fields
    if (role === "operator") {
      userData.boatName = boatName;
      userData.boatCapacity = boatCapacity;
    }

    const user = await User.create(userData);

    // Send verification email
    const link = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify Your Account",
      html: `<p>Click to verify your account: <a href="${link}">Verify Email</a></p>`
    });

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered. Please verify your email.`
    });
  } catch (error) {
    console.error(error);
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

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified) return res.status(403).json({ message: "Email not verified" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        boatName: user.boatName,
        boatCapacity: user.boatCapacity
      }
    });
  } catch (error) {
    console.error(error);
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
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
