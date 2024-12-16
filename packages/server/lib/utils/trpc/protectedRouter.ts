import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc/context";
import { OpenRouter } from "./openRouter";
export const ProtectedRouter = OpenRouter.middleware(({ ctx, next }) => {
  if (!ctx.userData) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return next({
    ctx: {
      ...ctx,
      userData: ctx.userData,
    },
  });
});
