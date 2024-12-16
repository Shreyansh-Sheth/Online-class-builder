import domainSettings from "../const/domainSettings";
import { VerifyJWT } from "../jwt/verification";
import { emailTemplate } from "./emailTemplate";
import { SendMail } from "./sendEmail";

export default function SendRegisterEmail(email: string, isVerified: boolean) {
  const token = VerifyJWT.signToken(email, isVerified);
  const link = `http://${domainSettings.domain}/auth/verify/${token}`;
  const html = emailTemplate(link);
  SendMail(email, "Your Register Email For Tutor", html);
}
