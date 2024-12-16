import p from "@tutor/db";
const { CONTENT_STATUS } = p;
import { TRPCError } from "@trpc/server";
import { courseId } from "@tutor/validation/lib/course";
import {
  updateContentJson,
  updateCourseContentStatus,
} from "@tutor/validation/lib/courseContent";
import { z } from "zod";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";

export const ContentRouter = t.router({
  getJson: tProtectedProcedure.input(courseId).query(async ({ ctx, input }) => {
    return await ctx.PrismaClient.courseContentJSON.findFirst({
      where: {
        course: {
          storeFront: {
            userId: ctx.userData.id,
          },
        },
        coursesId: input.courseId,
      },
    });
  }),
  updateJson: tProtectedProcedure
    .input(updateContentJson)
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.courseContentJSON.updateMany({
        data: {
          json: input.json,
        },
        where: {
          coursesId: input.courseId,
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
        },
      });
    }),
  getContentList: tProtectedProcedure
    .input(courseId)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.content.findMany({
        include: {
          chapter: true,
          notes: true,
          downloadable: true,
          video: true,
        },
        where: {
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
          coursesId: input.courseId,
        },
      });
    }),
  updateContentStatus: tProtectedProcedure
    .input(updateCourseContentStatus)
    .mutation(async ({ ctx, input }) => {
      const content = await ctx.PrismaClient.content.findFirst({
        where: {
          id: input.contentId,
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
        },
      });

      if (!content) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const newStatus: keyof typeof CONTENT_STATUS =
        content?.status === "DISABLE" ? "ENABLE" : "DISABLE";

      const newData = ctx.PrismaClient.content.update({
        where: {
          id: input.contentId,
        },
        data: {
          status: newStatus,
        },
      });
      return newData;
    }),
  demoSwitch: tProtectedProcedure
    .input(updateCourseContentStatus)
    .mutation(async ({ ctx, input }) => {
      const content = await ctx.PrismaClient.content.findFirst({
        where: {
          id: input.contentId,
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
        },
      });

      if (!content) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      //switch isDemo
      const newData = ctx.PrismaClient.content.update({
        where: {
          id: input.contentId,
        },
        data: {
          isDemo: !content.isDemo,
        },
      });
      return newData;
    }),
});
