import { z } from "zod";
import { storeFrontId } from "../storefront";

export const email = z
  .string()
  .email()
  .transform((e) => e.toLowerCase());

export const password = z.string().min(6).max(80);

const name = z.string().min(5);
export const registerEndUser = z
  .object({
    name: name,
    email,
    password,
    confirmPassword: password,
    tnc: z.boolean().refine((v) => v, {
      message: "you have not accepted the t&c",
    }),
  })
  .merge(storeFrontId)
  .refine((v) => v.confirmPassword === v.password, {
    message: "Password Does Not Match",
    path: ["confirmPassword"],
  });
export const resendRegisterEmail = z
  .object({
    email,
  })
  .merge(storeFrontId);
