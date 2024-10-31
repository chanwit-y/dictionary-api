import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { bodyLimit } from "hono/body-limit";
import { VocabularyService } from "./libs/service/vocabulary.service.ts";
import { VocabularyRepository } from "./libs/repository/vocabulary.repo.ts";
import { supabase } from "./libs/db/index.ts";
import { OpenAIAPI } from "./libs/api/openai.api.ts";


const readToken = "read";
const prvilegedToekn = "read+write";
const privilegedMethods = ["POST", "PUT", "PATCH", "DELETE"];

const app = new Hono();

app.on("GET", "/api/*", async (c, next) => {
  const brearer = bearerAuth({ token: [readToken, prvilegedToekn] });
  return brearer(c, next);
});

app.on(privilegedMethods, "/api/*", async (c, next) => {
  const bearer = bearerAuth({ token: prvilegedToekn });
  return bearer(c, next);
});

app.get("/api/page/x", async (c) => {
  // const res = await translate("antecedent")
  // return c.json(res);
});

app.post("/api/vocabulary", async (c) => {
  const body = await c.req.json<{word: string}>();
  console.log("body", body.word);
  const srv = new VocabularyService(new VocabularyRepository(supabase), new OpenAIAPI());
  const res = await srv.insert(body.word);
  console.log("res", res);
  return c.json(res);
})

// app.use(
//   bodyLimit({
//     maxSize: 1 * 1024,
//     onError: (c) => {
//       return c.text("overflow :(", 413);
//     },
//   })
// );

// app.post("/api/page/x", async (c) => {
//   const body = await c.req.json();
//   console.log("body", body);
//   return c.json({ message: "Hello POST - Hono!" });
// });

//==================================================================================================

// const token = "honosicool";

// app.use(
//   "/api/*",
//   // Brearer auth token
//   // bearerAuth({ token })
//   // Basic auth
//   // basicAuth({
//   //   username: "hono",
//   //   password: "acoolproject",
//   // })
//   // basicAuth({
//   //   verifyUser:  (username: string, password: string) => {
//   //     return username === "hono" && password === "acoolproject";
//   //   },
//   // })
// );

// // deno-lint-ignore require-await
// app.get('/api/page', async (c) => {
//   return c.json({ message: 'Hello Hono!' });
// })

// app.get("/", (c: { text: (arg0: string) => any }) => {
//   return c.text("Hello Hono!");
// });

// app.get("/auth/page", (c: { text: (arg0: string) => any }) => {
//   return c.text("Hello auth Hono!");
// });

Deno.serve(app.fetch);
