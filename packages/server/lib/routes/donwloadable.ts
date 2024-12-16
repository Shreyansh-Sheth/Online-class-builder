import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import { ContentJsonValidator } from "@tutor/validation/lib/courseContent";
import { TRPCError } from "@trpc/server";
import {
  addDownloadable,
  downloadableFileId,
  downloadableId,
  updateDownloadableFiles,
  updateDownloadableName,
} from "@tutor/validation/lib/downloadable";
import { closestIndexTo } from "date-fns";
const downloadableRouter = t.router({
  addDownloadable: tProtectedProcedure
    .input(addDownloadable)
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

      const downloadableData = await ctx.PrismaClient.downloadable.create({
        include: { Content: true },
        data: {
          name: input.name,
          coursesId: input.courseId,
          files: {
            connect: input.fileList.map((e) => ({ key: e.key })),
          },
          Content: {
            create: {
              type: "DOWNLOADABLE",
              coursesId: input.courseId,
            },
          },
        },
      });
      for (let i of input.fileList) {
        await ctx.PrismaClient.file.update({
          where: {
            key: i.key,
          },
          data: {
            name: i.name,
            mime: i.mime,
            size: i.size,
          },
        });
      }

      if (!downloadableData?.Content) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const newData = [
        ...courseJsonData,
        { id: downloadableData?.Content.id, index: courseJsonData.length },
      ];

      await ctx.PrismaClient.courseContentJSON.update({
        where: {
          coursesId: input.courseId,
        },
        data: {
          json: newData,
        },
      });
      return downloadableData;
    }),
  getDownloadableById: tProtectedProcedure
    .input(downloadableId)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.downloadable.findFirst({
        include: { Content: true, files: true },
        where: {
          id: input.downloadableId,
          course: { storeFront: { userId: ctx.userData.id } },
        },
      });
    }),
  updateName: tProtectedProcedure
    .input(updateDownloadableName)
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.downloadable.updateMany({
        data: {
          name: input.name,
        },
        where: {
          id: input.downloadableId,
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
        },
      });
    }),
  removeFile: tProtectedProcedure
    .input(downloadableFileId)
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.file.updateMany({
        where: {
          key: input.key,
          Downloadable: {
            course: {
              storeFront: {
                userId: ctx.userData.id,
              },
            },
          },
        },
        data: {
          downloadableId: null,
        },
      });
    }),

  updateDownloadableFile: tProtectedProcedure
    .input(updateDownloadableFiles)
    .mutation(async ({ ctx, input }) => {
      const downloadable = await ctx.PrismaClient.downloadable.findUnique({
        include: {
          course: { include: { storeFront: true } },
        },
        where: { id: input.downloadableId },
      });
      if (downloadable?.course.storeFront.userId !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      for (let i of input.fileList) {
        await ctx.PrismaClient.file.update({
          where: {
            key: i.key,
          },
          data: {
            downloadableId: input.downloadableId,
            name: i.name,
            mime: i.mime,
            size: i.size,
          },
        });
      }
      return true;
    }),
});
export default downloadableRouter;
