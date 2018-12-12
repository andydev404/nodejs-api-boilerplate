require('dotenv').config();
import mailer from 'nodemailer';
import {resetPasswordTemplate} from './resetPassword_template';

/**
 * @desc   Generate email template
 * @param  {String} to
 * @param  {String} name
 * @param  {String} template
 * @param  {String} token_reset
 * @return {Object} data
 */
const getEmailData = (to, name, template, token_reset) => {
  let data = null;

  switch (template) {
    case "reset-password":
      data = {
        from: "Company <info@company.com>",
        to,
        subject: `Hey ${name}, reset your password`,
        html: resetPasswordTemplate(token_reset)
      }
      break;
    default:
      data;
  }
  return data;
}


/**
 * @desc   Send email to user
 * @param  {String} to
 * @param  {String} name
 * @param  {String} type
 * @param  {String} token_reset
 */
const sendEmail = (to, name, type, token_reset = null) => {

  const smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "info@company.com",
      pass: process.env.EMAIL_PASS
    }
  });

  const mail = getEmailData(to, name, type, token_reset);

  smtpTransport.sendMail(mail, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      cb()
    }
    smtpTransport.close();
  })
}

export default sendEmail;