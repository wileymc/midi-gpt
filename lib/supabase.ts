import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:54321"
    : process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey =
  (process.env.NODE_ENV === "development"
    ? process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) ?? "";

export const supabase = createClient(supabaseUrl, supabaseKey);
