import { z } from "zod";
import { courseId } from "./course";
export const downloadableFileId = z.object({
  key: z.string(),
});
export const downloadableFileData = z
  .object({
    name: z.string(),
    size: z.number(),
    mime: z.string(),
  })
  .merge(downloadableFileId);

export const downloadableName = z.object({ name: z.string().min(2).max(100) });

export const downloadableId = z.object({
  downloadableId: z.string().cuid(),
});

const downloadableData = z
  .object({
    fileList: z.array(downloadableFileData),
  })
  .merge(downloadableName);

export const addDownloadable = z
  .object({})
  .merge(courseId)
  .merge(downloadableData);
export const updateDownloadableName = z
  .object({})
  .merge(downloadableId)
  .merge(downloadableName);
export const updateDownloadableFiles = z
  .object({
    fileList: z.array(downloadableFileData),
  })
  .merge(downloadableId);
