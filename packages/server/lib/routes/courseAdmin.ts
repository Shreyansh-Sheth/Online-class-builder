import { TRPCError } from "@trpc/server";
import {
  courseId,
  CreateCourse,
  updateCourse,
  updateCoursePrice,
} from "@tutor/validation/lib/course";
import { storeFrontId } from "@tutor/validation/lib/storefront";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";

const courseRouter = t.router({
  myCourse: tProtectedProcedure
    .input(storeFrontId)
    .query(async ({ ctx, input }) => {
      const data = await ctx.PrismaClient.courses.findMany({
        include: {
          posterImg: {
            select: {
              url: true,
            },
          },
        },
        where: {
          storeFront: {
            id: input.storeFrontId,
            userId: ctx.userData.id,
          },
        },
      });
      return data;
    }),
  createCourse: tProtectedProcedure
    .input(CreateCourse)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.PrismaClient.courses.create({
        data: {
          name: input.name,
          fileKey: input.posterImageKey,
          storeFrontId: input.storeFrontId,
          disc: input.disc,
          CourseContentJSON: {
            create: {
              json: [],
            },
          },
        },
      });
      return data;
    }),
  myCourseById: tProtectedProcedure
    .input(courseId)
    .query(async ({ ctx, input }) => {
      const courseData = await ctx.PrismaClient.courses.findUnique({
        where: {
          id: input.courseId,
        },
        include: {
          posterImg: true,
          storeFront: {
            include: {
              admin: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      if (courseData?.storeFront.admin.id !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      return courseData;
    }),
  toggleCourse: tProtectedProcedure
    .input(courseId)
    .mutation(async ({ ctx, input }) => {
      const currentCourse = await ctx.PrismaClient.courses.findUnique({
        include: { storeFront: true },
        where: { id: input.courseId },
      });
      if (currentCourse?.storeFront.userId !== ctx.userData.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.PrismaClient.courses.update({
        where: {
          id: input.courseId,
        },
        data: {
          status: currentCourse.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        },
      });
    }),
  updateCoursePrice: tProtectedProcedure
    .input(updateCoursePrice)
    .mutation(async ({ ctx, input }) => {
      await ctx.PrismaClient.courses.updateMany({
        where: {
          id: input.courseId,
          storeFront: {
            userId: ctx.userData.id,
          },
        },
        data: {
          price: input.price,
        },
      });
    }),

  updateCourse: tProtectedProcedure
    .input(updateCourse)
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.courses.updateMany({
        where: {
          id: input.courseId,
          storeFront: {
            userId: ctx.userData.id,
          },
        },
        data: {
          name: input.name,
          disc: input.disc,
          fileKey: input.posterImageKey,
        },
      });
    }),
});
export default courseRouter;
