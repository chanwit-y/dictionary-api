import "jsr:@std/dotenv/load";

export const Env = {
  openaiApiKey: Deno.env.get("OPENAI_API_KEY"),
  supabaseKey: Deno.env.get("SUPABASE_KEY"),
  supabaseUrl: Deno.env.get("SUPABASE_URL"),
  supabaseToken: Deno.env.get("SUPABASE_TOKEN"),
  supabaseUser: Deno.env.get("SUPABASE_USER"),
  supabasePass: Deno.env.get("SUPABASE_PASS"),
};
