import crypto from "crypto";
const Config = {
  AuthEmailExpiryInMin: 3,
  ForgetPasswordEmailExpiryInMin: 5,
  HashPassword: (password: string) => {
    return crypto.createHash("sha256").update(password).digest("base64");
  },
  emailVerificationSubject: (siteName: string) =>
    `Verify Your Email ${siteName}`,
};
export default Config;
