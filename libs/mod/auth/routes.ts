import { IUserService } from "./service.ts";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { zValidator } from "../../utils/middleware/zodValidator.middleware.ts";
import { z } from "zod";
import { container, Instances } from "../../utils/config/container.ts";

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
    const { data, error } = await srv.signIn(email, password);

    if (error) {
      return c.json({ error: error.message }, 500);
    }
    setCookie(c, "access_token", data.session.access_token);

    return c.json(data);
  }
);

export default authRoutes;
