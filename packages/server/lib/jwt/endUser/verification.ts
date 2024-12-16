import { sign, verify } from "jsonwebtoken";

const END_USER_AUTH_SECRET =
  process.env.END_USER_AUTH_SECRET ?? "secretAuthEnduserveirifatonan";
export const createVerificationToken = (expiryAt: string, id: string) => {
  return sign({ id }, END_USER_AUTH_SECRET, { expiresIn: expiryAt });
};

export const verifyVerificationToken = (token: string) => {
  return verify(token, END_USER_AUTH_SECRET) as { id: string };
};
