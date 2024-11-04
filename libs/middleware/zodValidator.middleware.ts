import type { Context, Env, MiddlewareHandler, TypedResponse } from "hono";
import type { ZodError, ZodSchema } from "zod";

import { ValidationTargets } from "hono";
import { fromZodError } from "zod-validation-error";

import { validator } from "hono/validator";
import { z } from "zod";

export type Hook<
  T,
  E extends Env,
  P extends string,
  O = Record<string | number | symbol, never>
> = (
  result: { success: boolean; data: T; error?: ZodError },
  //   result:
  //     | { success: true; data: T }
  //     | { success: false; error: ZodError; data: T },
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
    in: {
      [K in Target]: K extends "json"
        ? I
        : {
            [x: string]: ValidationTargets[K][string];
          };
    };
    out: { [K in Target]: O };
  } = {
    in: {
      [K in Target]: K extends "json"
        ? I
        : {
            [x: string]: ValidationTargets[K][string];
          };
    };
    out: { [K in Target]: O };
  }
>(
  target: Target,
  schema: T,
  hook?: Hook<z.infer<T>, E, P>
): MiddlewareHandler<E, P, V> =>
  validator(target, async (v, c) => {
    const { success, data, error } = await schema.safeParseAsync(v);
    if (hook) {
      const hookResult = hook({ success, data, error }, c);
      if (hookResult) {
        if (
          (hookResult && hookResult instanceof Response) ||
          hookResult instanceof Promise
        ) {
          return hookResult;
        }
        if ("response" in hookResult) {
          return hookResult["response"];
        }

        if (!success) {
          const validationError = fromZodError(error);

          return c.json(
            {
              message: validationError.message,
              errors: validationError.details,
            },
            400
          );
        }
      }
    }

    return data;
  });
