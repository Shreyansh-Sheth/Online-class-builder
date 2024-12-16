import { z } from "zod";
import { downloadableFileId, downloadableId } from "../downloadable";

export const downloadableFile = z
  .object({})
  .merge(downloadableId)
  .merge(downloadableFileId);
