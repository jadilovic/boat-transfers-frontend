import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase.js";

export async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "traveler",
        boat_name: userData.boatName,
        boat_capacity: userData.boatCapacity
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;

  return data;
}

export async function matchPassword(enteredPassword, hashedPassword) {
  return bcrypt.compare(enteredPassword, hashedPassword);
}