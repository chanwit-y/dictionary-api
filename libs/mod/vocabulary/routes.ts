import { Hono } from "hono";
import type { IVocabularyService } from "./service.ts";
import { container, Instances } from "../../utils/config/container.ts";
import authMiddleware from "../../utils/middleware/auth.middleware.ts";

const vocabularyRoutes = new Hono()
  .use("*", authMiddleware)
  .post("/create", async (c) => {
    const body = await c.req.json<{ word: string }>();
    const srv = container.get<IVocabularyService>(Instances.VocabularyService);
    const res = await srv.insert(body.word);
    return c.json(res);
  })
  .get("/speech", async (c) => {
    const text = await c.req.query("text");
    if(!text) return c.json({ error: "text is required" }, 400);

    const srv = container.get<IVocabularyService>(Instances.VocabularyService);
    const res = await srv.speech(text);
    return c.json(res);
  });

export default vocabularyRoutes;
