import { TRPCError } from "@trpc/server";
import { createStoreFront } from "@tutor/validation";
import {
  addDomain,
  storeFrontId,
  updateStoreFront,
} from "@tutor/validation/lib/storefront";
import cuid from "cuid";
import { z } from "zod";
import DomainSettings from "../const/domainSettings";
import { ProtectedRouter } from "../utils/trpc/protectedRouter";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";

const domainRouter = t.router({
  addDomain: tProtectedProcedure
    .input(addDomain)
    .mutation(async ({ ctx, input }) => {
      // check if input name only contains host name not the standards like https://
      //remove extra path only take domain or subdomain.domain .tld format
      input.name = input.name.replace(/https?:\/\//, "");
      const domainName = input.name.replace(/(^\w+:|^)\/\//, "").split("/")[0];

      if (input.name.endsWith(DomainSettings.domain)) {
        throw new TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "You can't add a subdomain of your own domain",
        });
      }
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
      try {
        await ctx.PrismaClient.domain.create({
          data: {
            isPremium: true,
            name: input.name,
            storeFrontId: input.storeFrontId,
          },
        });
      } catch {
        throw new TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "Domain already exists",
        });
      }
    }),
  getDomains: tProtectedProcedure
    .input(storeFrontId)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.domain.findMany({
        where: {
          storeFront: {
            id: input.storeFrontId,
            userId: ctx.userData.id,
          },
        },
      });
    }),
});
export default domainRouter;
