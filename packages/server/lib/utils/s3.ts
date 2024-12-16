import {
  PutObjectCommand,
  S3,
  GetObjectCommand,
  PutBucketPolicyCommand,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";
import * as Minio from "minio";
import crypto from "crypto";
import { policy } from "./policy";
import { checkStringArr } from "./checkOrThrow";
import { TRPCError } from "@trpc/server";

const endPoint = process.env.R2_ENDPOINT;
const accessKey = process.env.R2_ACCESSKEY;
const secretAccessKey = process.env.R2_SECRET_KEY;
checkStringArr(endPoint, accessKey, secretAccessKey);
const s3Client = new S3Client({
  credentials: {
    accessKeyId: accessKey ?? "",
    secretAccessKey: secretAccessKey ?? "",
  },
  region: "auto",
  endpoint: "https://" + endPoint!,
  forcePathStyle: true,
});
export class S3Service {
  static expiresIn = 1000;
  // static publicKeyName = "public/";
  static publicBucketName = "tutor-public";
  static publicBucketURL =
    "https://pub-b8c54e10d1ec46b8bdfb83d4b7896110.r2.dev/";

  static privateBucketName = "tutor";
  //this is temp url for not any purpose just ignore it
  static privateBucketURL = "https://r2.dev/";

  static setCors() {
    return;

    const cors = new PutBucketCorsCommand({
      Bucket: this.privateBucketName,

      CORSConfiguration: {
        CORSRules: [
          {
            AllowedMethods: ["GET", "PUT"],
            AllowedOrigins: ["*"],
            AllowedHeaders: ["content-type"],
            // AllowedOrigins: ["http://lacolhost.com:3000"],
          },
        ],
      },
    });
    s3Client
      .send(cors)
      .then((v) => {
        console.log(v);
      })
      .catch((v) => {
        console.log("ERR", v);
      });
  }

  static async getPresignedUrlForFileUpload(key: string, isPublic: boolean) {
    try {
      const command = new PutObjectCommand({
        Key: key,
        Bucket: isPublic ? this.publicBucketName : this.privateBucketName,
      });
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 1000,
      });
      const viewURL = isPublic
        ? this.publicBucketURL + key
        : this.privateBucketURL + key;

      return { signedUrl, viewURL };
    } catch (e) {
      console.log(e);
    }
  }
  static async getPresignedUrlForDownload(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.privateBucketName,
        Key: key,
      });
      const signedURL = await getSignedUrl(s3Client, command, {
        expiresIn: 1000,
      });
      return signedURL;
    } catch (e) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }
  }
}
