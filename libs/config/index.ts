
import "jsr:@std/dotenv/load";

export const Env = {
  openaiApiKey: Deno.env.get("OPENAI_API_KEY"),
  supabaseKey: Deno.env.get("SUPABASE_KEY"),
  supabaseUrl: Deno.env.get("SUPABASE_URL"),
};
