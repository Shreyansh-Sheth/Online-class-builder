import { pagination } from "@tutor/validation/lib/utils";
import p from "@tutor/db";

import { z } from "zod";
import { t } from "../../utils/trpc/v10";
import { tAdmin, tAdminProcedure } from "../../utils/trpc/v10AdminRouter";
const { USER_STATUS } = p;
const allUserQuery = z
  .object({
    email: z.string().optional(),
  })
  .merge(pagination.omit({ storeFrontId: true }));
const updateUser = z.object({
  status: z.nativeEnum(USER_STATUS).optional(),
  name: z.string().optional(),
  userId: z.string().cuid(),
});
export const UsersAdminRouter = t.router({
  getAllUsers: tAdminProcedure
    .input(allUserQuery)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.user.findMany({
        where: {
          email: {
            contains: input.email,
            mode: "insensitive",
          },
        },
        take: input.limit,
        skip: input.skip,
      });
    }),

  updateUser: tAdminProcedure
    .input(updateUser)
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input;

      return await ctx.PrismaClient.user.update({
        where: {
          id: input.userId,
        },
        data: {
          ...data,
        },
      });
    }),
});
