import nodemailer from "nodemailer";
import { env } from "../config/env.js";


export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.email,
    pass: env.passkey,
  },
});



export const AdminLoginAdmin = async(email:string,otp:string):Promise<void>=>{

      await mailer.sendMail({
      from: `"Admin Security" <${env.email}>`,
      to: email,
      subject: "Your Admin Login Verification Code",
     text: `Your login verification code is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:28px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#111827">Admin Login Verification</h2>
        <p style="color:#4b5563">Use this code to complete your admin login.</p>
        <div style="background:#f3f4f6;padding:18px;text-align:center;border-radius:8px">
          <h1 style="letter-spacing:8px;color:#111827;margin:0">${otp}</h1>
        </div>
        <p style="color:#6b7280">This code expires in <strong>5 minutes</strong>.</p>
        <p style="color:#dc2626">Never share this code with anyone.</p>
        <hr style="border:0;border-top:1px solid #e5e7eb"/>
        <p style="font-size:12px;color:#9ca3af">If you did not attempt to log in, you can ignore this email.</p>
      </div>
    `})
}




export const ClientVerifyOTP = async (
  email: string,
  otp: string
): Promise<void> => {
  await mailer.sendMail({
    from: `"Travel Support" <${env.email}>`,
    to: email,
    subject: `${otp} is your email verification code`,

    text: `
Welcome to our travel community!

Your email verification code is: ${otp}

This code expires in 5 minutes.

For your security, never share this code with anyone.
If you did not request this code, you can safely ignore this email.
    `.trim(),

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background-color:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">

  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your verification code is ${otp}. It expires in 5 minutes.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="background-color:#f3f6fb;padding:35px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
          style="max-width:520px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5eaf2;">

          <!-- Header -->
          <tr>
            <td style="background:#102b46;padding:30px 28px;text-align:center;">

              <div style="font-size:12px;font-weight:bold;letter-spacing:3px;color:#9bd8d3;text-transform:uppercase;">
                YOUR TRAVEL JOURNEY
              </div>

              <h1 style="margin:15px 0 8px;color:#ffffff;font-size:27px;line-height:1.3;">
                Welcome aboard!
              </h1>

              <p style="margin:0;color:#d5e2ef;font-size:14px;line-height:1.7;">
                One quick step to get your account ready.
              </p>

            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding:32px 28px 24px;">

              <h2 style="margin:0 0 12px;font-size:21px;color:#172033;">
                Verify your email address
              </h2>

              <p style="margin:0 0 24px;font-size:14px;line-height:1.8;color:#596579;">
                Use the verification code below to complete your registration
                and start exploring travel packages.
              </p>

              <!-- OTP -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center"
                    style="background:#f0f7fa;border:1px solid #d9e9ed;border-radius:12px;padding:25px 12px;">

                    <p style="margin:0 0 12px;color:#64748b;font-size:11px;font-weight:bold;letter-spacing:2px;">
                      YOUR VERIFICATION CODE
                    </p>

                    <div style="font-size:34px;font-weight:bold;letter-spacing:10px;color:#102b46;padding-left:10px;">
                      ${otp}
                    </div>

                    <p style="margin:15px 0 0;font-size:12px;color:#64748b;">
                      Enter this code on the verification page.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="margin-top:22px;">
                <tr>
                  <td width="34" valign="top" style="font-size:20px;">
                    &#9201;
                  </td>
                  <td style="font-size:13px;line-height:1.7;color:#596579;">
                    <strong style="color:#172033;">Expires in 5 minutes</strong><br />
                    Request a new code if this one expires.
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <div style="margin-top:22px;padding:15px;background:#fff8ed;border-radius:10px;border:1px solid #f6e5c7;">
                <p style="margin:0;font-size:13px;line-height:1.8;color:#865b22;">
                  <strong>Security reminder</strong><br />
                  Never share your verification code with anyone.
                  Our team will never ask you to disclose it.
                </p>
              </div>

              <p style="margin:24px 0 0;font-size:13px;line-height:1.8;color:#788397;">
                Didn't request this code? No worries — simply ignore this email.
                No changes will be made to your account.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e9eef5;padding:22px 28px;text-align:center;">

              <p style="margin:0 0 7px;font-size:13px;font-weight:bold;color:#102b46;">
                Your next adventure starts here.
              </p>

              <p style="margin:0;font-size:11px;line-height:1.8;color:#94a0b1;">
                This is an automated email. Please do not reply to this message.
                <br />
                &copy; ${new Date().getFullYear()} Travel Support. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

        <p style="margin:18px 0 0;font-size:11px;color:#a0aaba;text-align:center;">
          Sent securely to ${email}
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};










