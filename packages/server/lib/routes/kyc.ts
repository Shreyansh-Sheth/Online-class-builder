import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import { ContentJsonValidator } from "@tutor/validation/lib/courseContent";
import { TRPCError } from "@trpc/server";
import { addNotes, notesId, updateNote } from "@tutor/validation/lib/notes";
import { StatsValidation } from "@tutor/validation/lib/stats";
import { updateKycData, submitKycData } from "@tutor/validation/lib/kyc";
export const kycRouter = t.router({
  getKyc: tProtectedProcedure.query(async ({ ctx, input }) => {
    return await ctx.PrismaClient.kyc.findUnique({
      where: {
        userId: ctx.userData.id,
      },
    });
  }),

  updateKyc: tProtectedProcedure
    .input(updateKycData)
    .mutation(async ({ ctx, input }) => {
      //check for kyc ststus
      const kyc = await ctx.PrismaClient.kyc.findUnique({
        where: {
          userId: ctx.userData.id,
        },
      });
      if (kyc?.status === "APPROVED" || kyc?.status === "SUBMITTED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return await ctx.PrismaClient.kyc.upsert({
        where: {
          userId: ctx.userData.id,
        },
        create: {
          status: "PENDING",
          userId: ctx.userData.id,
          // @ts-ignore
          data: input,
        },
        update: {
          status: "PENDING",
          // @ts-ignore
          data: input,
        },
      });
    }),

  submitKyc: tProtectedProcedure
    .input(submitKycData)
    .mutation(async ({ ctx, input }) => {
      //check for kyc ststus
      const kyc = await ctx.PrismaClient.kyc.findUnique({
        where: {
          userId: ctx.userData.id,
        },
      });
      if (kyc?.status === "APPROVED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return await ctx.PrismaClient.kyc.upsert({
        where: {
          userId: ctx.userData.id,
        },
        create: {
          status: "SUBMITTED",
          userId: ctx.userData.id,
          // @ts-ignore
          data: input,
        },
        update: {
          status: "SUBMITTED",
          // @ts-ignore
          data: input,
        },
      });
    }),
});
