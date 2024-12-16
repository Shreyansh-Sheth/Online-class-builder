import { TRPCError } from "@trpc/server";
import { t } from "./v10";

const endUserProtectedProcedure = t.middleware(({ ctx, next }) => {
  if (!ctx.endUserData) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return next({
    ctx: {
      ...ctx,
      endUserData: ctx.endUserData,
    },
  });
});

export const tEndUserProtectedProcedure = t.procedure.use(
  endUserProtectedProcedure
);
