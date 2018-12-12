require('dotenv').config();

const resetPasswordTemplate = token_reset => {

  const URL = process.env.ROOT_URL;
  const pageTitle = 'Your page name';

  return `
    <!DOCTYPE html>
   <html style="margin: 0; padding: 0;">
   
       <head>
           <title>One | Email template!</title>
       </head>
   
           <body style="margin: 0; padding: 0;">
               <table class="table" cellpadding="0" cellspacing="0" style="background-color: #eee; empty-cells: hide; margin: 0 auto; padding: 0; width: 600px;">
                   <tr>
                       <td style="background-color: #999592; margin: 0 auto;">
                           <h1 style="box-sizing: border-box; color: white; font-family: Helvetica, Arial, sans-serif; letter-spacing: 0.5px; line-height: 1.4; margin: 0; padding: 15px 25px; text-align: center; text-transform: uppercase;">${pageTitle}</h1></td>
                   </tr>
                   <tr>
                       <td style="margin: 0 auto;padding: 15px 25px;box-sizing: border-box">
                            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                            <p>Click on this link to reset your password:</p>
                            <a href="${URL}/reset-password/${token_reset}">Reset your password</a>

                            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                       </td>
                   </tr>
                   <tr>
                        <td style="background-color: #999592; margin: 0 auto;">
                                <p style="box-sizing: border-box; color: white; font-family: Helvetica, Arial, sans-serif; letter-spacing: 0.5px; line-height: 1.4; margin: 0; padding: 15px 25px; text-align: center; text-transform: uppercase;font-size:10px">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p></td>
                   </tr>
               </table>
           </body>
   
     </html>
    `;
};

export {
  resetPasswordTemplate
}