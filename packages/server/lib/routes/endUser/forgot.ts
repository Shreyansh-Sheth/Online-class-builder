import { t } from "../../utils/trpc/v10";
import { z } from "zod";
import {
  forgetPassword,
  verifyForgetPassword,
} from "@tutor/validation/lib/enduser/forget";
import { TRPCError } from "@trpc/server";
import {
  createForgetPasswordToken,
  verifyForgetPasswordToken,
} from "../../jwt/endUser/forget";
import { sendEmailForgotPassword } from "../../email/enduser/forgotpasss";
import Config from "../../const/endUserConfig";
export const ForgotPasswordRouter = t.router({
  forgotPassword: t.procedure
    .input(forgetPassword)
    .mutation(async ({ ctx, input }) => {
      const endUser = await ctx.PrismaClient.endUser.findUnique({
        include: {
          storeFront: {
            include: {
              Domain: true,
            },
          },
        },
        where: {
          email_storeFrontId: {
            email: input.email,
            storeFrontId: input.storeFrontId,
          },
        },
      });

      if (!endUser || !endUser.emailVerified) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      }

      if (
        endUser.forgotPasswordExpiryTime &&
        endUser.forgotPasswordExpiryTime > new Date()
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "forgot password already sent",
        });
      }
      const token = createForgetPasswordToken("20min", endUser.id);

      const primaryDomainName = endUser.storeFront.Domain.find(
        (domain) => domain.isPrimary
      )?.name;

      const link =
        ("http://" + primaryDomainName ?? "") +
        "/enduser/verify-forget?token=" +
        token;

      sendEmailForgotPassword(endUser.email, link);
      await ctx.PrismaClient.endUser.update({
        where: {
          id: endUser.id,
        },
        data: {
          forgotPasswordExpiryTime: new Date(
            new Date().getTime() + 20 * 60 * 1000 //20mins
          ),
        },
      });
      return {};
    }),

  changePassword: t.procedure
    .input(verifyForgetPassword)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = verifyForgetPasswordToken(input.token);

        const endUser = await ctx.PrismaClient.endUser.findUnique({
          where: {
            id,
          },
        });

        if (!endUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "user not found",
          });
        }

        if (
          !endUser.forgotPasswordExpiryTime ||
          endUser.forgotPasswordExpiryTime < new Date()
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "forgot password token expired",
          });
        }

        await ctx.PrismaClient.endUser.update({
          where: {
            id,
          },
          data: {
            password: Config.HashPassword(input.password),
            forgotPasswordExpiryTime: null,
          },
        });

        return {};
      } catch {}
    }),
});
