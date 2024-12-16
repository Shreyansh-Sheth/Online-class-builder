import { z } from "zod";
import { storeFrontId } from "./storefront";

export const pagination = z
  .object({
    limit: z.number().min(1).max(50),
    skip: z.number().min(0),
  })
  .merge(storeFrontId);
