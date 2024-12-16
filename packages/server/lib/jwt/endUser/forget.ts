import { sign, verify } from "jsonwebtoken";

const END_USER_FORGOT_PASSWORD_SECRET =
  process.env.END_USER_FORGOT_PASSWORD_SECRET ??
  "secretAuthEnduserveirifatonan";
export const createForgetPasswordToken = (expiryAt: string, id: string) => {
  return sign({ id }, END_USER_FORGOT_PASSWORD_SECRET, { expiresIn: expiryAt });
};

export const verifyForgetPasswordToken = (token: string) => {
  return verify(token, END_USER_FORGOT_PASSWORD_SECRET) as { id: string };
};
