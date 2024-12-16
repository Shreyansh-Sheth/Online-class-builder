import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import { pagination } from "@tutor/validation/lib/utils";
export const endUserManageRoute = t.router({
  listEndUsers: tProtectedProcedure
    .input(pagination)
    .query(async ({ ctx, input }) => {
      const count = await ctx.cachePrismaClient.endUser.count({
        where: {
          storeFrontId: input.storeFrontId,
          storeFront: {
            userId: ctx.userData.id,
          },
        },
      });
      const users = await ctx.cachePrismaClient.endUser.findMany({
        where: {
          storeFrontId: input.storeFrontId,
          storeFront: {
            userId: ctx.userData.id,
          },
        },
        take: input.limit,
        skip: input.skip,
      });
      return {
        count,
        users,
      };
    }),
});
