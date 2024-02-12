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
async function sendEmail(receiverGmail, subject, text, passwordOrOtp) {
  try {
    const info = await transporter.sendMail({
      from: "nurmdopu428@gmail.com", // sender address
      to: receiverGmail, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
        <p style="font-size: 24px; font-weight: bold; color: #2ecc71; text-align: center;">${passwordOrOtp}</p>
        <p style="font-size: 14px; color: #888;">Please do not share this code with anyone for security reasons.</p>
      </div>
    `, // html body
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendEmail;
