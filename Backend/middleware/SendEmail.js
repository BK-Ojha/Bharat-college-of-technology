const nodemailer = require('nodemailer')
require('dotenv').config()

const SendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully', info.response)
  } catch (error) {
    throw new Error('Failed to send email: ' + error.message)
  }
}

module.exports = SendEmail
