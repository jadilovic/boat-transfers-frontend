import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/**
 * GET /api/auth/users
 * Returns all profiles (admin use)
 */
router.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*");

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json(error);
    }

    console.log("Profiles returned:", data?.length);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * POST /api/auth/create-traveler
 * Creates traveler user (admin panel)
 */
router.post("/create-traveler", async (req, res) => {
  try {
    const { name, email, password, state, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    // 1️⃣ Create Supabase Auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

    if (authError) {
      console.error("Auth error:", authError);
      return res.status(500).json(authError);
    }

    const authUser = authData.user;

    // 2️⃣ Insert profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authUser.id,
          name,
          email,
          state,
          city,
          role: "traveler"
        }
      ])
      .select()
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      return res.status(500).json(profileError);
    }

    res.json({
      message: "Traveler created successfully",
      user: profile
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

export default router;