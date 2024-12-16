import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import {
  createVideoMetadata,
  updateVideoMetadata,
  videoId,
} from "@tutor/validation/lib/video";
import { ContentJsonValidator } from "@tutor/validation/lib/courseContent";
import { TRPCError } from "@trpc/server";
import cuid from "cuid";
import { S3Service } from "../utils/s3";
import {
  uploadVideoToCloudflareStream,
  getCloudflareStreamSignedUrl,
  deleteVideoFromCloudflareStream,
} from "../utils/CloudFlareStream";

export const videoRouter = t.router({
  createVideo: tProtectedProcedure
    .input(createVideoMetadata)
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

      const VIDEO_KEY = input.videoKey;
      const signedS3Url = await S3Service.getPresignedUrlForDownload(VIDEO_KEY);
      const streamData = await uploadVideoToCloudflareStream(
        signedS3Url,
        ctx.userData.id,
        VIDEO_KEY
      );

      const videoData = await ctx.PrismaClient.video.create({
        include: { Content: true, originalFile: true },
        data: {
          name: input.name,
          course: {
            connect: {
              id: input.courseId,
            },
          },
          description: input.description,
          originalFile: {
            connect: {
              key: VIDEO_KEY,
            },
          },
          Content: {
            create: {
              type: "VIDEO",
              coursesId: input.courseId,
            },
          },
          streamUid: streamData.result.uid,
        },
      });

      if (!videoData?.Content) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const newData = [
        ...courseJsonData,
        { id: videoData?.Content.id, index: courseJsonData.length },
      ];

      await ctx.PrismaClient.courseContentJSON.update({
        where: {
          coursesId: input.courseId,
        },
        data: {
          json: newData,
        },
      });

      return videoData;
    }),
  getVideoData: tProtectedProcedure
    .input(videoId)
    .query(async ({ ctx, input }) => {
      const video = await ctx.PrismaClient.video.findUnique({
        where: {
          id: input.videoId,
        },
        include: {
          Content: true,
          course: { include: { storeFront: true } },
        },
      });
      if (!video || video.course.storeFront.userId !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      return video;
    }),
  getVideoStreamSignedUrl: tProtectedProcedure
    .input(videoId)
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.PrismaClient.video.findUnique({
        where: {
          id: input.videoId,
        },
        include: {
          Content: true,
          course: { include: { storeFront: true } },
        },
      });
      if (!video || video.course.storeFront.userId !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      // x-forwarded-for

      // console.log("Forwarewded For" + ctx.req.headers["x-forwarded-for"]);
      // console.log("Real IP" + ctx.req.headers["x-real-ip"]);
      // console.log("IPS" + ctx.req.ips);
      //get ip of request
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
        video.streamUid,
        ip
      );

      return cfStreamUrl;
    }),
  updateVideo: tProtectedProcedure
    .input(updateVideoMetadata)
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.PrismaClient.video.findUnique({
        where: {
          id: input.videoId,
        },
        include: {
          Content: true,
          course: { include: { storeFront: true } },
        },
      });
      if (!video || video.course.storeFront.userId !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const isNewVideoKey = input.videoKey !== video.fileKey;
      let streamUID = video.streamUid;
      if (isNewVideoKey) {
        await deleteVideoFromCloudflareStream(video.streamUid);
        const VIDEO_KEY = input.videoKey;
        const signedS3Url = await S3Service.getPresignedUrlForDownload(
          VIDEO_KEY
        );
        const streamData = await uploadVideoToCloudflareStream(
          signedS3Url,
          ctx.userData.id,
          VIDEO_KEY
        );
        streamUID = streamData.result.uid;
      }
      const videoData = await ctx.PrismaClient.video.update({
        where: {
          id: input.videoId,
        },
        data: {
          StreamStatus: isNewVideoKey ? "PROCESSING" : video.StreamStatus,
          name: input.name,
          description: input.description,
          fileKey: input.videoKey,
          streamUid: streamUID,
        },
      });

      return videoData;
    }),
});
