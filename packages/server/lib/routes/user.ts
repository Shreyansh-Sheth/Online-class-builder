import { TRPCError } from "@trpc/server";
import { differenceInMinutes, parseISO } from "date-fns";
import { AuthToken } from "../jwt/auth";
import { cookieOptions } from "../utils/cookieOptions";
import { ProtectedRouter } from "../utils/trpc/protectedRouter";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";

const userRouter = t.router({
  me: tProtectedProcedure.query(async ({ ctx, input }) => {
    const user = await ctx.PrismaClient.user.findUnique({
      where: {
        email: ctx.userData.email,
      },
    });
    if (user?.status === "INACTIVE") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is inactive",
      });
    }
    return user;
  }),
});

export default userRouter;
