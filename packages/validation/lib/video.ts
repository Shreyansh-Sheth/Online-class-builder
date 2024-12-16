import { z } from "zod";
import { courseId } from "./course";

const videoData = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  videoKey: z.string(),
});
export const videoId = z.object({
  videoId: z.string().cuid(),
});
export const createVideoMetadata = z
  .object({})
  .merge(courseId)
  .merge(videoData);
export const updateVideoMetadata = z.object({}).merge(videoId).merge(videoData);
