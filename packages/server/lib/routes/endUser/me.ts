import { z } from "zod";
import { t } from "../../utils/trpc/v10";
import { verify } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { tEndUserProtectedProcedure } from "../../utils/trpc/v10enduser";

export const meRoute = t.router({
  getMe: tEndUserProtectedProcedure.query(async ({ ctx, input }) => {
    // console.log(ctx.endUserData);
    return ctx.endUserData;
  }),
});
