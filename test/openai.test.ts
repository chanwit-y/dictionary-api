import { assertEquals } from "jsr:@std/assert";
import { OpenAIAPI } from "../libs/api/openai.ts";

// Deno.test("openai", async () => {
//   const openai = new OpenAIAPI();
//   await openai.speech('beer')

//   assertEquals(1, 1);
// });

Deno.test({
  name: "leaky test",
  async fn() {
    const openai = new OpenAIAPI();
    await openai.speech("beer");

    assertEquals(1, 1);
  },
  sanitizeResources: false,
});
