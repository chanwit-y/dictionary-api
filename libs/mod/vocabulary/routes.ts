import { IUserService } from "./../auth/service.ts";
import { Hono } from "hono";
import { zValidator } from "../../middleware/zodValidator.middleware.ts";
import { z } from "zod";
import { container, Instances } from "../../config/container.ts";

const authRoutes = new Hono().post(
  "/sign-in",
  zValidator(
    "json",
    z.object({
      email: z.string(),
      password: z.string(),
    })
  ),
  async (c) => {
    const { email, password } = await c.req.valid("json");
    const srv = container.get<IUserService>(Instances.UserService);

    return await srv.signIn(email, password);
  }
);

export default authRoutes;