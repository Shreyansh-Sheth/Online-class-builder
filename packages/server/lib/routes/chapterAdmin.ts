import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import { ContentJsonValidator } from "@tutor/validation/lib/courseContent";
import { TRPCError } from "@trpc/server";
import {
  addChapter,
  chapterId,
  updateChapter,
} from "@tutor/validation/lib/chapter";
const chapterRouter = t.router({
  addChapter: tProtectedProcedure
    .input(addChapter)
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.PrismaClient.courses.findUnique({
        where: {
          id: input.courseId,
        },
        include: {
          storeFront: true,
        },
      });
      if (!course || course.storeFront.userId !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const courseContentJsonData =
        await ctx.PrismaClient.courseContentJSON.findUnique({
          where: {
            coursesId: input.courseId,
          },
        });
      const courseJsonData =
        courseContentJsonData?.json as typeof ContentJsonValidator["_input"];

      const chapterData = await ctx.PrismaClient.chapter.create({
        include: { Content: true },
        data: {
          name: input.name,
          coursesId: input.courseId,
          description: input.description,
          Content: {
            create: {
              type: "CHAPTER",
              coursesId: input.courseId,
            },
          },
        },
      });

      if (!chapterData?.Content) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const newData = [
        ...courseJsonData,
        { id: chapterData?.Content.id, index: courseJsonData.length },
      ];

      await ctx.PrismaClient.courseContentJSON.update({
        where: {
          coursesId: input.courseId,
        },
        data: {
          json: newData,
        },
      });
      return chapterData;
    }),

  getChapterById: tProtectedProcedure
    .input(chapterId)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.chapter.findFirst({
        include: {
          Content: true,
        },
        where: {
          id: input.chapterId,
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
        },
      });
    }),

  updateChapterById: tProtectedProcedure
    .input(updateChapter)
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.chapter.updateMany({
        where: {
          id: input.chapterId,
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
});
export default chapterRouter;
