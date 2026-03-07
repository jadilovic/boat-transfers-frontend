import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }
console.log(data);

  res.json(data);
});

export default router;