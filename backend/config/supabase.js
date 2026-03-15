import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// load .env from project root
// dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// console.log("__dirname", __dirname, supabaseUrl, supabaseKey);


export const supabase = createClient(supabaseUrl, supabaseKey);