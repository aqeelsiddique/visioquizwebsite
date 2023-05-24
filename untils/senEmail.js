const nodemailer = require ('nodemailer');
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "webdeveloperaqeel@gmail.com",
        pass: "uxhcuiszeebphvvl"
      }
    });
  
    const mailOptions = {
      from: "webdeveloperaqeel@gmail.com",
      to: options.email, // replace this with the actual email address
      subject: options.subject,
      text: options.message
    };
  
    await transporter.sendMail(mailOptions);
  }
  
  module.exports = sendEmail;




