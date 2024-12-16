import { z } from "zod";
import { downloadableId } from "./downloadable";

export const getFileDownloadUrlForDownloadable = z
  .object({
    key: z.string(),
  })
  .merge(downloadableId);
