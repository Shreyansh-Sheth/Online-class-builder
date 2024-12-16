import nodemailer from "nodemailer";
const SendinBlue = {
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: "<Redacted>",
    pass: "<Redacted>",
  },
};
const mailGun = {
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: "<Redacted>",
    pass: "<Redacted>",
  },
};
const mailTrap = {
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "<Redacted>",
    pass: "<Redacted>",
  },
};

const transport = nodemailer.createTransport(SendinBlue);
export const SendMail = (email: string, subject: string, content: string) => {
  const mockString = `
EMAIL RECEIVER : ${email}
-----------------
SUBJECT : ${subject}
-----------------
CONTENT 
-----------------
${content}
-----------------
`;
  transport
    .sendMail({
      to: email,
      from: "no-replay@skillflake.com Skillflake",
      subject: subject,
      html: content,
    })
    .then((e) => {
      // console.log(e);
    })
    .catch((e: any) => {
      console.log(e);
    });
  // writeFileSync(
  //   `D:/projects/tutor-app/Tutor/packages/server/temp-email/${Date.now().toString()}.txt`,
  //   mockString
  // );
};
