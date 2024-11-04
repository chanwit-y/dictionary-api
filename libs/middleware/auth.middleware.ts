import { IUserService } from "./../mod/auth/service.ts";
import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { container, Instances } from "../config/container.ts";

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const accessToken = getCookie(c, "access_token");
  if (accessToken) {
    const srv = container.get<IUserService>(Instances.UserService);
    const { data, error } = await srv.getUser(accessToken);
//     console.log(accessToken);
    console.log(data);
    console.log(error);
    if (data.user) {
      c.set("user", { ...data });
    }
    if (error) {
      return c.json({ error: error.message }, 401);
    }
  }
  await next();
};

export default authMiddleware;
