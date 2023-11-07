const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log(`options: ${JSON.stringify(options)}`);
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // Define email options
  const mailOptions = {
    from: 'Slack MailTrap <slack.mailtap@inbox.mailtrap.io>',
    to: options.email,
    subject: options.subject,
    text: options.message 
  };
  // Send Email
  await transporter.sendMail(mailOptions);
  console.log('End of senEmail')
}

module.exports = sendEmail;