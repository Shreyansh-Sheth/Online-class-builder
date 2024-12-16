import cuid from "cuid";
import { z } from "zod";
import { S3Service } from "../utils/s3";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import { getFileDownloadUrlForDownloadable } from "@tutor/validation/lib/s3";
import { TRPCError } from "@trpc/server";
const s3Router = t.router({
  getFileUploadUrl: tProtectedProcedure
    .input(
      z.object({
        isPrivate: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const key = ctx.userData.id + "/" + cuid();
      const fullURL = S3Service.publicBucketURL + key;
      const signedData = await S3Service.getPresignedUrlForFileUpload(
        key,
        !input.isPrivate
      );
      if (!signedData) {
        return;
      }
      await ctx.PrismaClient.file.create({
        data: { key, url: signedData.viewURL, isPublic: !input.isPrivate },
      });
      return { url: signedData.signedUrl, key, fullURL: signedData.viewURL };
    }),
  getFileDownloadUrlForDownloadable: tProtectedProcedure
    .input(getFileDownloadUrlForDownloadable)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.PrismaClient.downloadable.findUnique({
        include: {
          course: {
            include: { storeFront: true },
          },
          files: {
            where: {
              key: input.key,
            },
          },
        },
        where: {
          id: input.downloadableId,
        },
      });
      const specificFile = data?.files
        ? data.files.find((e: { key: string }) => e.key === input.key)
        : undefined;
      if (data?.course.storeFront.userId !== ctx.userData.id || !specificFile) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return await S3Service.getPresignedUrlForDownload(input.key);
    }),
  getSignedUrlForKey: tProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //check if key belongs to user

      const data = await ctx.PrismaClient.file.findUnique({
        where: {
          key: input,
        },
        include: {
          Courses: {
            include: {
              storeFront: true,
            },
          },
        },
      });
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      const uid = input.split("/")[0];
      if (uid !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      // check if user exist in storeFront
      return await S3Service.getPresignedUrlForDownload(input);
    }),
});

export default s3Router;
