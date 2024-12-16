import { z } from "zod";
import { storeFrontId } from "../storefront";
import { password } from "./auth";

export const forgetPassword = z
  .object({
    email: z
      .string()
      .email()
      .transform((e) => e.toLowerCase()),
  })
  .merge(storeFrontId);

export const verifyForgetPassword = z
  .object({
    token: z.string(),
    password: password,
    confirmPassword: password,
  })
  .refine((v) => v.confirmPassword === v.password, {
    message: "Password Does Not Match",
    path: ["confirmPassword"],
  });
