import { z } from "zod";
import { storeFrontId } from "./storefront";

const courseParams = z.object({
  name: z.string().min(5).max(100),
  posterImageKey: z.string(),
  disc: z.string().max(500).optional(),
});

export const CreateCourse = z
  .object({})
  .merge(storeFrontId)
  .merge(courseParams);
export const courseId = z.object({
  courseId: z.string().cuid(),
});
export const coursePrice = z.object({
  price: z.number().int().min(0),
});
export const updateCoursePrice = coursePrice.merge(courseId);
export const updateCourse = z.object({}).merge(courseId).merge(courseParams);
