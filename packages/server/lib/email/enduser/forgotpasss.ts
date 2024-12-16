import Config from "../../const/endUserConfig";
import { SendMail } from "../sendEmail";
import { emailTemplateForEndUserVerification } from "../template/enduser/verification";

export const sendEmailForgotPassword = (email: string, link: string) => {
  const html = `
  <a href=${link}>${link}</a>
  `;
  SendMail(email, "Forgot Password", html);
};
