
import "jsr:@std/dotenv/load";

export const Env = {
  openaiApiKey: Deno.env.get("OPENAI_API_KEY"),
};
