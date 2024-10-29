import { findAll } from './libs/db/index.ts';
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { bodyLimit } from "hono/body-limit";
import { translate } from "./libs/api/index.ts";
// import { basicAuth } from "hono/basic-auth";


const readToken = "read";
const prvilegedToekn = "read+write";
const privilegedMethods = ["POST", "PUT", "PATCH", "DELETE"];

const app = new Hono();

app.on("GET", "/api/page/*", async (c, next) => {
  const brearer = bearerAuth({ token: [readToken, prvilegedToekn] });
  return brearer(c, next);
});

app.on(privilegedMethods, "/api/page/*", async (c, next) => {
  const bearer = bearerAuth({ token: prvilegedToekn });
  return bearer(c, next);
});

app.get("/api/page/x", async (c) => {
const res = await findAll("eng_to_tha") 
  // const res = await translate("environment")
  return c.json(res);
});

app.use(
  bodyLimit({
    maxSize: 1 * 1024,
    onError: (c) => {
      return c.text("overflow :(", 413);
    },
  })
);

app.post("/api/page/x", async (c) => {
  const body = await c.req.json();
  console.log("body", body);
  return c.json({ message: "Hello POST - Hono!" });
});

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
