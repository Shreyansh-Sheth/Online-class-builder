import { courseId } from "@tutor/validation/lib/course";
import { storeFrontId } from "@tutor/validation/lib/storefront";
import { t } from "../../utils/trpc/v10";
import { tEndUserProtectedProcedure } from "../../utils/trpc/v10enduser";

export const courseRouter = t.router({
  getPurchasedCourse: tEndUserProtectedProcedure.query(
    async ({ ctx, input }) => {
      return await ctx.PrismaClient.courses.findMany({
        include: {
          posterImg: true,
          purchase: {
            where: {
              endUserId: ctx?.endUserData?.id,
              status: "paid",
            },
          },
        },
        where: {
          purchase: {
            some: {
              endUserId: ctx.endUserData.id,
              status: "paid",
            },
          },
        },
      });
    }
  ),
  getAllActiveCourse: t.procedure
    .input(storeFrontId)
    .query(async ({ ctx, input }) => {
      return await ctx.cachePrismaClient.courses.findMany({
        where: {
          storeFrontId: input.storeFrontId,
          status: "ACTIVE",
        },
        include: {
          purchase: {
            where: {
              endUserId: ctx?.endUserData?.id,
              status: "paid",
            },
          },
          posterImg: true,
        },
      });
    }),
  getCourseById: t.procedure.input(courseId).query(async ({ ctx, input }) => {
    const courseData = await ctx.PrismaClient.courses.findUnique({
      where: {
        id: input.courseId,
      },
      include: {
        purchase: {
          where: {
            status: "paid",
            endUserId: ctx?.endUserData?.id ?? "",
          },
        },
        posterImg: true,
        CourseContentJSON: true,
        Content: {
          include: {
            content_enduser: {
              where: {
                endUserId: ctx?.endUserData?.id ?? "",
              },
            },
            downloadable: {
              select: {
                name: true,
              },
            },
            notes: {
              select: {
                name: true,
              },
            },
            video: {
              select: {
                name: true,
              },
            },
            chapter: {
              select: {
                name: true,
              },
            },
          },
          where: {
            status: "ENABLE",
          },
        },
        storeFront: {
          select: {
            status: true,
          },
        },
      },
    });
    // TODO enable this later
    // if (courseData?.storeFront.status !== "LIVE") {
    //   return null;
    // }
    return courseData;
  }),
});
