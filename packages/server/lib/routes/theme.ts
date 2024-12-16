import { TRPCError } from "@trpc/server";
import { createStoreFront } from "@tutor/validation";
import {
  addDomain,
  storeFrontId,
  updateStoreFront,
  updateTheme,
} from "@tutor/validation/lib/storefront";
import cuid from "cuid";
import { z } from "zod";
import DomainSettings from "../const/domainSettings";
import { ProtectedRouter } from "../utils/trpc/protectedRouter";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";

const Router = ProtectedRouter.query("getTheme", {
  input: storeFrontId,
  resolve: async ({ ctx, input }) => {
    return await ctx.PrismaClient.theme.findFirst({
      where: {
        StoreFront: {
          id: input.storeFrontId,
        },
      },
    });
  },
}).mutation("updateTheme", {
  input: updateTheme,
  resolve: async ({ ctx, input }) => {
    const oldData = await ctx.PrismaClient.storeFront.findUnique({
      where: {
        id: input.storeFrontId,
      },
    });
    if (!oldData || oldData?.userId !== ctx.userData.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
    await ctx.PrismaClient.theme.update({
      where: {
        id: input.themeId,
      },
      data: {
        color: input.color,
      },
    });
  },
});
const themeRouter = t.router({
  getTheme: tProtectedProcedure
    .input(storeFrontId)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.theme.findFirst({
        where: {
          StoreFront: {
            id: input.storeFrontId,
          },
        },
      });
    }),
  updateTheme: tProtectedProcedure
    .input(updateTheme)
    .mutation(async ({ ctx, input }) => {
      const oldData = await ctx.PrismaClient.storeFront.findUnique({
        where: {
          id: input.storeFrontId,
        },
      });
      if (!oldData || oldData?.userId !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      await ctx.PrismaClient.theme.update({
        where: {
          id: input.themeId,
        },
        data: {
          color: input.color,
        },
      });
    }),
});
export default themeRouter;
