import { z } from "zod";
import { storeFrontId } from "./storefront";

export const pageBuilderSettings = z
  .object({
    data: z.any(),
  })
  .merge(storeFrontId);
