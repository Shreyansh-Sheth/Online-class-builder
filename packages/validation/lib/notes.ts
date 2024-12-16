import { z } from "zod";
import { courseId } from "./course";

const notesData = z.object({
  name: z.string().min(2).max(100),
  note: z.string(),
  urlList: z.array(z.string().url()),
});
export const addNotes = z.object({}).merge(courseId).merge(notesData);

export const notesId = z.object({
  noteId: z.string().cuid(),
});
export const updateNote = z.object({}).merge(notesData).merge(notesId);
