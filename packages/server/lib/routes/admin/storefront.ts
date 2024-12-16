import { pagination } from "@tutor/validation/lib/utils";
import p from "@tutor/db";

import { z } from "zod";
import { t } from "../../utils/trpc/v10";
import { tAdmin, tAdminProcedure } from "../../utils/trpc/v10AdminRouter";
import { storeFrontId } from "@tutor/validation/lib/storefront";
const { USER_STATUS, StoreFrontStatus } = p;

const updateStoreFrontPaymentProcessingDetailsValidation = z
  .object({
    paymentProcessingDetails: z.object({
      razorpayAccountId: z.string(),
      percentCut: z.number(),
    }),
  })
  .merge(storeFrontId);
const getAllStorefrontValidation = z
  .object({
    userId: z.string().cuid().optional(),
  })
  .merge(storeFrontId.partial())
  .merge(pagination.omit({ storeFrontId: true }));

export const storeFrontAdminRouter = t.router({
  getAllStorefronts: tAdminProcedure
    .input(getAllStorefrontValidation)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.storeFront.findMany({
        include: {
          admin: true,
          Domain: true,
          iconUrl: { select: { url: true } },
          storeFrontPaymentProcessingDetails: true,
        },
        where: {
          userId: input.userId,
          id: input.storeFrontId,
        },
        take: input.limit,
        skip: input.skip,
      });
    }),

  updateStoreFrontPaymentProcessingDetails: tAdminProcedure
    .input(updateStoreFrontPaymentProcessingDetailsValidation)
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.storeFrontPaymentProcessingDetails.upsert({
        where: {
          storeFrontId: input.storeFrontId,
        },
        create: {
          StoreFront: {
            connect: {
              id: input.storeFrontId,
            },
          },
          storeFrontId: input.storeFrontId,
          razorpayAccountId: input.paymentProcessingDetails.razorpayAccountId,
          percentCut: input.paymentProcessingDetails.percentCut,
        },
        update: {
          razorpayAccountId: input.paymentProcessingDetails.razorpayAccountId,
          percentCut: input.paymentProcessingDetails.percentCut,
        },
      });
    }),
  updateStatus: tAdminProcedure
    .input(
      storeFrontId.merge(z.object({ status: z.nativeEnum(StoreFrontStatus) }))
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.storeFront.update({
        where: {
          id: input.storeFrontId,
        },
        data: {
          status: input.status,
        },
      });
    }),
});
