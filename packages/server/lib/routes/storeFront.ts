import { TRPCError } from "@trpc/server";
import { createStoreFront } from "@tutor/validation";
import { RESERVED_SUBDOMAINS } from "@tutor/validation/lib/const/reserved_subdomains";
import { addDomain, updateStoreFront } from "@tutor/validation/lib/storefront";
import { customAlphabet } from "nanoid";
import slugify from "slugify";
import { z } from "zod";
import DomainSettings from "../const/domainSettings";
import { SafeAlphabet } from "../const/safeAlphabet";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
const nanoId = customAlphabet(SafeAlphabet, 3);
const StoreFromRouter = t.router({
  create: tProtectedProcedure
    .input(createStoreFront)
    .mutation(async ({ ctx, input }) => {
      // const customDomainName = cuid() + DomainSettings.subdomainSiteBaseURL;
      let slugName = slugify(input.name.toLowerCase());

      while (true) {
        if (RESERVED_SUBDOMAINS.includes(slugName)) {
          slugName = slugName + "-" + nanoId();
        } else {
          break;
        }
      }

      let customDomainName = slugName + DomainSettings.subdomainSiteBaseURL;
      //if this custom  domain name exist add random string and check again
      while (true) {
        const customExist = await ctx.PrismaClient.domain.findFirst({
          where: {
            name: customDomainName,
          },
        });
        if (customExist) {
          customDomainName = nanoId(3) + "-" + customDomainName;
        } else {
          break;
        }
      }

      const theme = await ctx.PrismaClient.theme.create({
        data: {
          color: "blue",
        },
      });
      return await ctx.PrismaClient.storeFront.create({
        data: {
          name: input.name,
          userId: ctx.userData.id,
          description: input.description,
          themeId: theme.id,
          Domain: {
            create: {
              isPrimary: true,
              isPremium: false,
              name: customDomainName,
            },
          },
        },
      });
    }),
  update: tProtectedProcedure
    .input(updateStoreFront)
    .mutation(async ({ ctx, input }) => {
      const oldData = await ctx.PrismaClient.storeFront.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!oldData || oldData?.userId !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      if (input.iconKey) {
        await ctx.PrismaClient.storeFront.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            iconUrl: {
              connect: {
                key: input.iconKey,
              },
            },
          },
        });
      } else {
        await ctx.PrismaClient.storeFront.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
          },
        });
      }
    }),
  addDomain: tProtectedProcedure
    .input(addDomain)
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
      await ctx.PrismaClient.domain.create({
        data: {
          isPremium: true,
          name: input.name,
          storeFrontId: input.storeFrontId,
        },
      });
    }),
  mySiteById: tProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.storeFront.findFirst({
        where: {
          id: input,
          userId: ctx.userData.id,
        },
        include: {
          Domain: true,
          theme: true,
          iconUrl: {
            select: {
              url: true,
              key: true,
            },
          },
        },
      });
    }),
  mySites: tProtectedProcedure.query(async ({ ctx }) => {
    return await ctx.PrismaClient.storeFront.findMany({
      where: {
        userId: ctx.userData.id,
      },
      include: {
        Domain: true,
      },
    });
  }),
});
export default StoreFromRouter;
