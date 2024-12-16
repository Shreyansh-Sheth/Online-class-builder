import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import { ContentJsonValidator } from "@tutor/validation/lib/courseContent";
import { TRPCError } from "@trpc/server";
import { addNotes, notesId, updateNote } from "@tutor/validation/lib/notes";
import { StatsValidation } from "@tutor/validation/lib/stats";
const statsRouter = t.router({
  users: tProtectedProcedure
    .input(StatsValidation)
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const usersCount = await ctx.cachePrismaClient.endUser.count({
        where: {
          storeFront: {
            id: input.storefrontId,
            userId: ctx.userData.id,
          },
          createdAt: {
            gte: startTime,
            lte: endTime,
          },
        },
      });
      return usersCount;
    }),

  courses: tProtectedProcedure
    .input(StatsValidation)
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const coursesCount = await ctx.cachePrismaClient.purchase.count({
        where: {
          storeFront: {
            id: input.storefrontId,
            userId: ctx.userData.id,
          },
          createdAt: {
            gte: startTime,
            lte: endTime,
          },
        },
      });
      return coursesCount;
    }),
  earning: tProtectedProcedure
    .input(StatsValidation)
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const earning = await ctx.cachePrismaClient.purchase.aggregate({
        where: {
          status: "paid",
          storeFront: {
            id: input.storefrontId,
            userId: ctx.userData.id,
          },
          createdAt: {
            gte: startTime,
            lte: endTime,
          },
        },
        _sum: {
          sellersCut: true,
          amount: true,
        },
      });
      console.log(earning);
      return {
        total: (earning._sum.amount ?? 0) / 100,
        sellersCut: (earning._sum.sellersCut ?? 0) / 100,
      };
    }),
});
export default statsRouter;
