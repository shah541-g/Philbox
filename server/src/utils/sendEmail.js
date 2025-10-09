import { transporter } from "../config/nodemailer.config.js"
import { OTP_MESSAGE } from "../constants/global.mail.constants.js"
export const sendOTP = async (email,otp) => {
  let message = OTP_MESSAGE.replace("<<123456>>",otp)
  message = message.replace("<<2025>>",(new Date()).getFullYear())

  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Philbox - Login OTP",
    html: message
  }
  transporter.sendMail(emailOptions, (error, info) => {
    if(error){
      return `Error occured ${console.log(error)}`
    }
    console.log(`Email sent successfully: ${info.response}`)
  })

}