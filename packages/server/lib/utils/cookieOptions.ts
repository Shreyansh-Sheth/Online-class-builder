import { addYears } from "date-fns";
import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  expires: addYears(new Date(), 1),
};
