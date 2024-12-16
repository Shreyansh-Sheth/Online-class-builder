import { z } from "zod";

export const StatsValidation = z.object({
  storefrontId: z.string(),
  startTime: z.date(),
  endTime: z.date().optional().default(new Date()),
});
