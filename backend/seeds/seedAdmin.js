import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// ⚡ Load Supabase keys from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin inserts
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    // Step 1: Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.log("Admin user already exists!");
      return;
    }

    // Step 2: Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // mark email as verified
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return;
    }

    // Step 3: Insert user in your app users table
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          supabase_id: authData.user.id,
          email: email,
          name: name,
          role: "admin",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting user:", error);
      return;
    }

    console.log("✅ Admin user created:", data);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    process.exit();
  }
}

seedAdmin();