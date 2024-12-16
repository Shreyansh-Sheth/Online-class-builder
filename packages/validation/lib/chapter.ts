import { z } from "zod";
import { courseId } from "./course";

const chapterFields = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
});
export const addChapter = z.object({}).merge(chapterFields).merge(courseId);

export const chapterId = z.object({ chapterId: z.string().cuid() });
export const updateChapter = z.object({}).merge(chapterId).merge(chapterFields);
