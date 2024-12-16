import { z } from "zod";
import { storeFrontId } from "../storefront";
import { email, password } from "./auth";
const endUserId = z.string().cuid();

export const oauthSecret = z.string();

export const getEndUserDataById = z
  .object({ endUserId, oauthSecret })
  .merge(storeFrontId);

export const loginEndUser = z
  .object({ oauthSecret, email, password })
  .merge(storeFrontId);
export const verifyToken = z.object({ oauthSecret, token: z.string() });
