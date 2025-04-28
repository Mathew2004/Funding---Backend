const nodemailer = require('nodemailer');

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'paradoxical.ana@gmail.com',    
    pass: 'rlqgajhhxmgluros',         
  },
});


async function sendMail(title, body, subject, to) {
  const mailOptions = {
    from: title,    // sender name/email
    to: to,         // list of receivers
    subject: subject,  // Subject line
    html: body,    // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendMail };
