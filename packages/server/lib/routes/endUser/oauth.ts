import { z } from "zod";
import { t } from "../../utils/trpc/v10";
import {
  getEndUserDataById,
  loginEndUser,
  verifyToken,
} from "@tutor/validation/lib/enduser/oauth";
import { checkEndUserOauth } from "../../utils/trpc/v10oauthroute";
import Config from "../../const/endUserConfig";
import { TRPCError } from "@trpc/server";
import { verifyVerificationToken } from "../../jwt/endUser/verification";
const oauthRouter = t.router({
  getUserDataById: t.procedure
    .input(getEndUserDataById)
    .query(async ({ ctx, input }) => {
      checkEndUserOauth(input.oauthSecret);
      const endUser = await ctx.PrismaClient.endUser.findUnique({
        where: {
          id: input.endUserId,
        },
      });
      if (!endUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      const { password, ...newData } = endUser;
      return newData;
    }),

  loginEndUser: t.procedure
    .input(loginEndUser)
    .mutation(async ({ ctx, input }) => {
      checkEndUserOauth(input.oauthSecret);

      const endUser = await ctx.PrismaClient.endUser.findUnique({
        where: {
          email_storeFrontId: {
            email: input.email,
            storeFrontId: input.storeFrontId,
          },
        },
      });

      const hashPass = Config.HashPassword(input.password);

      if (endUser?.password === hashPass && endUser.emailVerified) {
        const { password, ...newData } = endUser;
        return newData;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
    }),

  verifyToken: t.procedure
    .input(verifyToken)
    .mutation(async ({ ctx, input }) => {
      checkEndUserOauth(input.oauthSecret);

      try {
        const tokenData = verifyVerificationToken(input.token);
        const id = tokenData.id;
        const endUser = await ctx.PrismaClient.endUser.update({
          where: {
            id,
          },

          data: {
            emailVerified: true,
          },
        });
        const { password, ...newData } = endUser;
        return newData;
      } catch (e) {
        // console.log(e);
        throw new TRPCError({ code: "UNAUTHORIZED", message: "bad token" });
      }
    }),
});
export { oauthRouter };
