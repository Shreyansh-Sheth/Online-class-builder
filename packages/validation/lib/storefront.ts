import { z } from "zod";

export const createStoreFront = z.object({
  name: z.string().min(4).max(50),
  description: z.string().max(500).min(0),
});
export const updateStoreFront = z
  .object({
    id: z.string().cuid(),
    iconKey: z.string().optional(),
  })
  .merge(createStoreFront);
export const addDomain = z.object({
  name: z.string(),
  storeFrontId: z.string().cuid(),
});
export const storeFrontId = z.object({
  storeFrontId: z.string().cuid(),
});
export const updateTheme = z
  .object({
    color: z.string(),
    themeId: z.string().cuid(),
  })
  .merge(storeFrontId);
