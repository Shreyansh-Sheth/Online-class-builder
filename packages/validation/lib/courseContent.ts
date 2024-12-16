import _ from "underscore";
import { z } from "zod";
import { courseId } from "./course";
const contentTypes = ["CHAPTER", "VIDEO", "NOTES", "DOWNLOADABLE"] as const;
const status = ["DISABLE", "ENABLE"] as const;
export const ContentJsonValidator = z
  .array(
    z.object({
      index: z.number().int().min(0),
      id: z.string().cuid(),
      // name: z.string(),
      // type: z.enum(contentTypes),
      // status: z.enum(status),
    })
  )
  .refine(
    (v) => _(v).isMatch(_.uniq(v, (i) => i.index)),
    "There Is Some Problem Sorting Please Try Again Later"
  );

export const updateContentJson = z
  .object({
    json: ContentJsonValidator,
  })
  .merge(courseId);

export const contentId = z.object({
  contentId: z.string().cuid(),
});

export const updateCourseContentStatus = z
  .object({
    // status: z.boolean(),
  })
  .merge(contentId);
