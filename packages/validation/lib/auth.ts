import { z } from "zod";

export const login = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(50)
    .transform((e) => e.toLowerCase()),
});

export const register = z
  .object({
    name: z.string().trim().min(2).max(20),
  })
  .merge(login);
export const verify = z.object({
  token: z.string().trim(),
});
