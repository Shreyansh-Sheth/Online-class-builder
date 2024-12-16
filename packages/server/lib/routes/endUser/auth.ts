import { t } from "../../utils/trpc/v10";
import {
  registerEndUser,
  resendRegisterEmail,
} from "@tutor/validation/lib/enduser/auth";
import { addMinutes } from "date-fns";
import EndUserConfig from "../../const/endUserConfig";
import { TRPCError } from "@trpc/server";
import { sendEmailVerification } from "../../email/enduser/emailVerification";
import { createVerificationToken } from "../../jwt/endUser/verification";
import Config from "../../const/endUserConfig";
export const authRouter = t.router({
  register: t.procedure
    .input(registerEndUser)
    .mutation(async ({ ctx, input }) => {
      try {
        const FindEndUser = await ctx.PrismaClient.endUser.findUnique({
          where: {
            email_storeFrontId: {
              email: input.email,
              storeFrontId: input.storeFrontId,
            },
          },
        });
        if (FindEndUser) {
          if (FindEndUser?.emailVerified) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "user already exist",
            });
          }
          if ((FindEndUser?.emailSendExpiryTime ?? new Date()) <= new Date()) {
            await ctx.PrismaClient.endUser.delete({
              where: { id: FindEndUser?.id },
            });
          }
          if (!FindEndUser.emailVerified) {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "You Are Trying To Register Again. We Have Sent You An Email, Please Verify Your Email",
            });
          }
        }

        const endUser = await ctx.PrismaClient.endUser.create({
          select: {
            id: true,
            email: true,
            storeFront: {
              include: {
                Domain: true,
                theme: true,

                iconUrl: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
          data: {
            email: input.email,
            name: input.name,
            emailSendExpiryTime: addMinutes(
              new Date(),
              EndUserConfig.AuthEmailExpiryInMin
            ),
            password: EndUserConfig.HashPassword(input.password),
            storeFrontId: input.storeFrontId,
          },
        });
        //TODO send mail to verify that user
        const token = createVerificationToken(
          Config.AuthEmailExpiryInMin + "min",
          endUser.id
        );
        const primaryDomainName = endUser.storeFront.Domain.find(
          (domain) => domain.isPrimary
        )?.name;

        const verificationURL = new URL(
          ("http://" + primaryDomainName ?? "") +
            "/enduser/verify?token=" +
            token
        );
        console.log(verificationURL);
        // return;
        sendEmailVerification(
          endUser.email,
          endUser.storeFront.name,
          endUser.storeFront.iconUrl?.url ?? "",
          verificationURL.origin,
          verificationURL.href
        );
      } catch (e) {
        // console.log(e);
        throw new TRPCError({
          code: "CONFLICT",
          message: "user already exist please try to login",
        });
      }
    }),
  resendRegister: t.procedure
    .input(resendRegisterEmail)
    .mutation(async ({ ctx, input }) => {
      const endUser = await ctx.PrismaClient.endUser.findUnique({
        include: {
          storeFront: {
            include: { Domain: true, iconUrl: true },
          },
        },
        where: {
          email_storeFrontId: {
            email: input.email,
            storeFrontId: input.storeFrontId,
          },
        },
      });
      if (
        !endUser ||
        new Date(endUser?.emailSendExpiryTime ?? 0) >= new Date() ||
        endUser?.emailVerified
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      await ctx.PrismaClient.endUser.update({
        where: {
          id: endUser.id,
        },
        data: {
          emailSendExpiryTime: addMinutes(
            new Date(),
            Config.AuthEmailExpiryInMin
          ),
        },
      });

      const token = createVerificationToken(
        Config.AuthEmailExpiryInMin + "min",
        endUser.id
      );
      const primaryDomainName = endUser.storeFront.Domain.find(
        (domain) => domain.isPrimary
      )?.name;

      const verificationURL = new URL(
        ("http://" + primaryDomainName ?? "") + "/enduser/verify?token=" + token
      );
      sendEmailVerification(
        endUser.email,
        endUser.storeFront.name,
        endUser.storeFront.iconUrl?.url ?? "",
        verificationURL.origin,
        verificationURL.href
      );
      return;
    }),
});
