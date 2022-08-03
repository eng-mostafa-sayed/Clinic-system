const nodemailer = require("nodemailer");
const smtpConfig = {
  service: "gmail",
  auth: {
    user: "test@gmail.com",
    pass: "123456",
  },
};
const sendEmailAcc = (reciverEmail) => {
  try {
    const transporter = nodemailer.createTransport(smtpConfig);
    const emailOptions = {
      from: "My site",
      to: reciverEmail, // list of receivers
      subject: "new user register", // Subject line
      //       text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    };
    transporter.sendMail(emailOptions);
  } catch (e) {
    console.log(e);
  }
};
module.exports = sendEmailAcc;
