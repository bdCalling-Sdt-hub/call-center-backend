const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "nurmdopu428@gmail.com",
    pass: "fpel vaen ickk tvme",
  },
});
async function sendEmail(receiverGmail, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: "nurmdopu428@gmail.com", // sender address
      to: receiverGmail, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendEmail;
