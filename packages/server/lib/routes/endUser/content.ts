import { TRPCError } from "@trpc/server";
import { contentId } from "@tutor/validation/lib/courseContent";
import { downloadableFile } from "@tutor/validation/lib/enduser/content";
import { videoId } from "@tutor/validation/lib/video";
import { z } from "zod";
import { getCloudflareStreamSignedUrl } from "../../utils/CloudFlareStream";
import { S3Service } from "../../utils/s3";
import { t } from "../../utils/trpc/v10";
import { tEndUserProtectedProcedure } from "../../utils/trpc/v10enduser";

export const contentRouter = t.router({
  getNoteByContentId: tEndUserProtectedProcedure
    .input(contentId)
    .query(async ({ ctx, input }) => {
      //check if user bought the course
      const data = await ctx.PrismaClient.content.findFirst({
        include: {
          content_enduser: {
            where: {
              endUserId: ctx.endUserData.id,
            },
          },
          notes: true,
          chapter: true,
          downloadable: {
            include: {
              files: true,
            },
          },
          video: true,
        },
        where: {
          OR: [
            {
              id: input.contentId,
              course: {
                purchase: {
                  some: {
                    endUserId: ctx.endUserData.id,
                    status: "paid",
                  },
                },
              },
            },
            {
              id: input.contentId,
              isDemo: true,
            },
          ],
        },
      });
      if (!data) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this content",
        });
      }
      return data;
    }),
  getDonwloadableSignedUrl: tEndUserProtectedProcedure
    .input(downloadableFile)
    .mutation(async ({ ctx, input }) => {
      //check if user bought the course
      const data = await ctx.PrismaClient.downloadable.findFirst({
        include: {
          files: {
            where: {
              key: input.key,
            },
          },
        },
        where: {
          OR: [
            {
              id: input.downloadableId,
              files: {
                some: {
                  key: input.key,
                },
              },
              course: {
                purchase: {
                  some: {
                    endUserId: ctx.endUserData.id,
                    status: "paid",
                  },
                },
              },
            },
            {
              id: input.downloadableId,
              files: {
                some: {
                  key: input.key,
                },
              },
              Content: {
                isDemo: true,
              },
            },
          ],
        },
      });
      if (!data) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this content",
        });
      }

      const signedUrl = await S3Service.getPresignedUrlForDownload(
        data.files[0].key
      );
      return signedUrl;
    }),
  getVideoStreamUrl: tEndUserProtectedProcedure
    .input(videoId)
    .mutation(async ({ ctx, input }) => {
      //check if user bought the course
      const data = await ctx.PrismaClient.video.findFirst({
        where: {
          OR: [
            {
              id: input.videoId,
              course: {
                purchase: {
                  some: {
                    endUserId: ctx.endUserData.id,
                    status: "paid",
                  },
                },
              },
            },
            {
              id: input.videoId,
              Content: {
                isDemo: true,
              },
            },
          ],
        },
      });
      if (!data) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this content",
        });
      }
      let ip =
        ctx.req.headers["x-forwarded-for"] ||
        ctx.req.headers["x-real-ip"] ||
        ctx.req.ips;

      if (!ip) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      if (typeof ip === "string") {
        ip = [ip];
      }
      const cfStreamUrl = await getCloudflareStreamSignedUrl(
        data.streamUid,
        ip
      );

      return cfStreamUrl;
    }),

  markCompleteStatusSwitch: tEndUserProtectedProcedure
    .input(
      contentId.merge(
        z.object({
          isComplete: z.boolean(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.content_enduser.upsert({
        where: {
          contentId_endUserId: {
            contentId: input.contentId,
            endUserId: ctx.endUserData.id,
          },
        },
        update: {
          completed: input.isComplete,
        },
        create: {
          contentId: input.contentId,
          endUserId: ctx.endUserData.id,
          completed: input.isComplete,
        },
      });
    }),
});
