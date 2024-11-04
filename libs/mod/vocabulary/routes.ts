import { Hono } from "hono";
import { container, Instances } from "../../config/container.ts";
import type { IVocabularyService } from "./service.ts";
import authMiddleware from "../../middleware/auth.middleware.ts";

const vocabularyRoutes = new Hono()
.use("*", authMiddleware)
.post("/create", async (c) => {
  const body = await c.req.json<{ word: string }>();
  const srv = container.get<IVocabularyService>(Instances.VocabularyService);
  const res = await srv.insert(body.word);
  return c.json(res);
});

export default vocabularyRoutes;
