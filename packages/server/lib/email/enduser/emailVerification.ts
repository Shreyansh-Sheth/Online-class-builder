import Config from "../../const/endUserConfig";
import { SendMail } from "../sendEmail";
import { emailTemplateForEndUserVerification } from "../template/enduser/verification";

export const sendEmailVerification = (
  email: string,
  name: string,
  imageUrl: string,
  homeLink: string,
  link: string
) => {
  const html = emailTemplateForEndUserVerification(
    name,
    imageUrl,
    homeLink,
    link
  );
  SendMail(email, Config.emailVerificationSubject(name), html);
};
