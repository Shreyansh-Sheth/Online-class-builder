import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { addDays, parseISO } from "date-fns";
import { TrpcAppRouter } from "../../server";
import { t } from "./v10";

export const tProtected = t.middleware(({ ctx, next }) => {
  if (!ctx.userData) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  if (
    addDays(new Date(), -2).valueOf() >
    parseISO(ctx.userData.refetchTime).valueOf()
  ) {
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
export const tProtectedProcedure = t.procedure.use(tProtected);
