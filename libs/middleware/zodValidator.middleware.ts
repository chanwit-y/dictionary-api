import type { Context, Env, MiddlewareHandler, TypedResponse } from "hono";
import type { ZodError, ZodSchema } from "zod";

import { ValidationTargets } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

export type Hook<T, E extends Env, P extends string, O = {}> = (
  result:
    | { susscess: true; data: T }
    | { success: false; error: ZodError; data: T },
  c: Context<E, P>
) =>
  | Response
  | Promise<Response>
  | void
  | Promise<Response | void | TypedResponse<O>>;

type HasUndefined<T> = T extends undefined ? true : false;

export const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
  E extends Env,
  P extends string,
  I = z.input<T>,
  O = z.output<T>,
  V extends {
    in: HasUndefined<I> extends true
      ? { [K in Target]?: I }
      : { [K in Target]: I };
    out: { [K in Target]: O };
  } = {
    in: HasUndefined<I> extends true
      ? { [K in Target]?: I }
      : { [K in Target]: I };
    out: { [K in Target]: O };
  }
>(
  target: Target,
  schema: T,
  hook?: Hook<z.infer<T>, E, P>
): MiddlewareHandler<E, P, V> => validator();
