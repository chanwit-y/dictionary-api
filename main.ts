import { Hono } from "hono";
// import { bearerAuth } from "hono/bearer-auth";
import { container, Instances } from "./libs/config/container.ts";
import type { IVocabularyService } from "./libs/mod/vocabulary/service.ts";
import authRoutes from "./libs/mod/auth/routes.ts";
import vocabularyRoutes from "./libs/mod/vocabulary/routes.ts";

// const readToken = "read";
// const prvilegedToekn = "read+write";
// const privilegedMethods = ["POST", "PUT", "PATCH", "DELETE"];

const app = new Hono();

// const brearer = bearerAuth({ token: [readToken, prvilegedToekn] });
// app.on("GET", "/api/*", (c, next) => {
//   return brearer(c, next);
// });

// app.on(privilegedMethods, "/api/*", (c, next) => {
//   const bearer = bearerAuth({ token: prvilegedToekn });
//   return bearer(c, next);
// });

// app.get("/api/auth", async (c) => {
//   const srv = container.get<IVocabularyService>(Instances.VocabularyService);
//   const res = await srv.auth();
//   return c.json(res);
// });

// app.post("/api/get-user", async (c) => {
//   const body = await c.req.json<{ token: string }>();
//   const srv = container.get<IVocabularyService>(Instances.VocabularyService);
//   const res = await srv.getUser(body.token);
//   return c.json(res);
// })

app.route("api/auth", authRoutes);
app.route("/api/vocabulary", vocabularyRoutes);

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
