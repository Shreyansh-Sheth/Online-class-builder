import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { addDays, parseISO } from "date-fns";
import { TrpcAppRouter } from "../../server";
import { t } from "./v10";
import crypto from "crypto";
const sha256 = (str: string) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

export const tAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.req.headers["x-admin-secret"]) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }
  const hashOfHeader = sha256(ctx.req.headers["x-admin-secret"] as string);
  if (hashOfHeader !== process.env?.ADMIN_KEY) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return next({
    ctx: {
      ...ctx,
    },
  });
});
export const tAdminProcedure = t.procedure.use(tAdmin);
